"use client"

// Lightweight zustand-style store backed by sessionStorage, but written from
// scratch so we don't need an extra dependency. Provides a useStore() hook,
// a setState function, and persistence across navigations within a session.

import { useEffect, useState } from "react"

export type VoteValue = "yes" | "no" | "love"
// Score weights match the PRD: NO=0, YES=+1, LOVE=+3.
export const VOTE_SCORE: Record<VoteValue, number> = { no: 0, yes: 1, love: 3 }

export type SessionMode = "device" | "qr"

export type ReelInteractions = {
  liked: string[]
  skipped: string[]
  saved: string[]
  viewed: string[]
}

export type Phase =
  | "idle"
  | "session-setup"
  | "voting"
  | "reveal"
  | "results"
  | "debate"
  | "repoll"

export type ChatMessage = {
  id: string
  participant: string // P1, P2, ...
  text: string
  reactions: Record<string, number> // emoji -> count
  ts: number
}

export type User = {
  id: string
  name: string
  avatar?: string
  watchlist: string[] // movie ids
  history: {
    sessionId: string
    date: string
    winnerId: string
    participants: string[]
  }[]
}

export type QuorumState = {
  // auth
  user: User | null

  // discovery
  reels: ReelInteractions

  // session config
  participants: string[] // labels (P1..) or names
  leader?: number // index
  mode: SessionMode
  poolFilter: "auto" | "genre"
  selectedGenres: string[]
  deckSize: number // default 15, max 40
  moviePool: string[] // movie ids in deck

  // voting state
  currentParticipant: number // 0..n-1
  votes: Record<number, Record<string, VoteValue>> // participantIdx -> movieId -> vote

  // results
  phase: Phase
  tied: string[] // movie ids in tie
  winner?: string

  // debate / repoll
  chat: ChatMessage[]
  repollVotes: Record<number, Record<string, VoteValue>>
}

const initial: QuorumState = {
  user: null,
  reels: { liked: [], skipped: [], saved: [], viewed: [] },
  participants: [],
  leader: undefined,
  mode: "device",
  poolFilter: "auto",
  selectedGenres: [],
  deckSize: 15,
  moviePool: [],
  currentParticipant: 0,
  votes: {},
  phase: "idle",
  tied: [],
  winner: undefined,
  chat: [],
  repollVotes: {},
}

const STORAGE_KEY = "quorum:state:v1"

const listeners = new Set<() => void>()

function loadFromStorage(): QuorumState {
  if (typeof window === "undefined") return initial
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return initial
    const parsed = JSON.parse(raw) as Partial<QuorumState>
    return { ...initial, ...parsed }
  } catch {
    return initial
  }
}

// Eagerly hydrate at module load so the very first render of any component
// already has the real persisted state. This prevents race conditions where
// redirect guards (e.g. Results page) fire before hydration completes.
let memoryState: QuorumState = loadFromStorage()

function persist() {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState))
  } catch {
    // storage may be full or unavailable; ignore.
  }
}

export function getState(): QuorumState {
  return memoryState
}

export function setState(updater: Partial<QuorumState> | ((s: QuorumState) => Partial<QuorumState>)) {
  const patch = typeof updater === "function" ? updater(memoryState) : updater
  memoryState = { ...memoryState, ...patch }
  persist()
  listeners.forEach((l) => l())
}

export function resetState() {
  memoryState = initial
  persist()
  listeners.forEach((l) => l())
}

export function useStore<T>(selector: (s: QuorumState) => T): T {
  const [, force] = useState(0)
  useEffect(() => {
    const sub = () => force((n) => n + 1)
    listeners.add(sub)
    return () => {
      listeners.delete(sub)
    }
  }, [])
  return selector(memoryState)
}

// --- Helpers / actions ---------------------------------------------------

export function recordReel(action: keyof ReelInteractions, movieId: string) {
  const current = memoryState.reels[action]
  if (current.includes(movieId)) return
  setState({
    reels: { ...memoryState.reels, [action]: [...current, movieId] },
  })
}

export function startSession(args: {
  participants: string[]
  mode: SessionMode
  leader?: number
  poolFilter: "auto" | "genre"
  selectedGenres: string[]
  deckSize: number
  moviePool: string[]
}) {
  setState({
    participants: args.participants,
    mode: args.mode,
    leader: args.leader,
    poolFilter: args.poolFilter,
    selectedGenres: args.selectedGenres,
    deckSize: args.deckSize,
    moviePool: args.moviePool,
    currentParticipant: 0,
    votes: {},
    phase: "voting",
    tied: [],
    winner: undefined,
    chat: [],
    repollVotes: {},
  })
}

export function recordVote(movieId: string, value: VoteValue) {
  const idx = memoryState.currentParticipant
  const current = memoryState.votes[idx] ?? {}
  setState({
    votes: { ...memoryState.votes, [idx]: { ...current, [movieId]: value } },
  })
}

export function advanceParticipant() {
  const next = memoryState.currentParticipant + 1
  if (next >= memoryState.participants.length) {
    setState({ phase: "reveal" })
  } else {
    setState({ currentParticipant: next })
  }
}

export function tallyVotes(
  votes: Record<number, Record<string, VoteValue>>,
  pool: string[],
): { ranked: { movieId: string; score: number; counts: Record<VoteValue, number> }[]; tied: string[] } {
  const totals = pool.map((movieId) => {
    let score = 0
    const counts: Record<VoteValue, number> = { yes: 0, no: 0, love: 0 }
    Object.values(votes).forEach((perUser) => {
      const v = perUser?.[movieId]
      if (!v) return
      counts[v] += 1
      score += VOTE_SCORE[v]
    })
    return { movieId, score, counts }
  })
  totals.sort((a, b) => b.score - a.score)
  const top = totals[0]?.score ?? 0
  const tied = totals.filter((t) => t.score === top && top > 0).map((t) => t.movieId)
  return { ranked: totals, tied }
}

// Rematch: keep the same participants and config, but drop the previous
// winner from the pool and restart the voting loop. If after exclusion the
// pool is empty, callers should detect and surface a "no candidates" state.
export function rematchSession() {
  const s = memoryState
  const exclude = new Set<string>([...(s.winner ? [s.winner] : []), ...s.tied])
  const newPool = s.moviePool.filter((id) => !exclude.has(id))
  setState({
    moviePool: newPool,
    currentParticipant: 0,
    votes: {},
    repollVotes: {},
    chat: [],
    tied: [],
    winner: undefined,
    phase: "voting",
  })
  return newPool.length
}

export function postChatMessage(participant: string, text: string) {
  const msg: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    participant,
    text,
    reactions: {},
    ts: Date.now(),
  }
  setState({ chat: [...memoryState.chat, msg] })
}

export function reactToMessage(msgId: string, emoji: string) {
  setState({
    chat: memoryState.chat.map((m) =>
      m.id === msgId
        ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] ?? 0) + 1 } }
        : m,
    ),
  })
}

export function login(name: string) {
  const mockUser: User = {
    id: `user-${Date.now()}`,
    name,
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`,
    watchlist: [],
    history: [
      {
        sessionId: "sess-1",
        date: "2024-05-20",
        winnerId: "mov-1",
        participants: ["You", "Sarah", "Mike"],
      },
      {
        sessionId: "sess-2",
        date: "2024-05-18",
        winnerId: "mov-4",
        participants: ["You", "Alex"],
      },
    ],
  }
  setState({ user: mockUser })
}

export function logout() {
  setState({ user: null })
}

export function toggleWatchlist(movieId: string) {
  const user = memoryState.user
  if (!user) return

  const exists = user.watchlist.includes(movieId)
  const nextWatchlist = exists
    ? user.watchlist.filter((id) => id !== movieId)
    : [...user.watchlist, movieId]

  setState({
    user: { ...user, watchlist: nextWatchlist },
  })
}
