"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, RotateCcw, Sparkles, Star, ThumbsDown, ThumbsUp, Tv, Repeat, Share2, LogOut } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { Poster } from "@/components/quorum/poster"
import { GenreTag } from "@/components/quorum/genre-tag"
import { MOVIES, getMovieById } from "@/lib/movies"
import { rematchSession, resetState, tallyVotes, useStore, VOTE_SCORE, type VoteValue } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function ResultsPage() {
  const router = useRouter()
  const phase = useStore((s) => s.phase)
  const votes = useStore((s) => s.votes)
  const moviePool = useStore((s) => s.moviePool)
  const repollVotes = useStore((s) => s.repollVotes)
  const winnerId = useStore((s) => s.winner)
  const participants = useStore((s) => s.participants)

  const fullTally = useMemo(() => tallyVotes(votes, moviePool), [votes, moviePool])
  const repollTally = useMemo(
    () => (Object.keys(repollVotes).length ? tallyVotes(repollVotes, Object.keys(repollVotes[0] ?? {})) : null),
    [repollVotes],
  )

  const winner = winnerId ? getMovieById(winnerId) : getMovieById(fullTally.ranked[0]?.movieId ?? "")
  const winnerRow = fullTally.ranked.find((r) => r.movieId === (winner?.id ?? ""))
  const top3 = fullTally.ranked.slice(0, 3)
  const cameFromTie = repollTally !== null

  useEffect(() => {
    if (phase !== "results" || !winner) {
      if (moviePool.length === 0) router.replace("/")
    }
  }, [phase, winner, moviePool.length, router])

  const [showWatch, setShowWatch] = useState(false)

  if (!winner) return null

  return (
    <main className="relative min-h-dvh bg-background pb-20 overflow-x-hidden">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-50 flex w-full items-center justify-between px-5 py-6 sm:px-8 border-b-8 border-foreground bg-secondary">
        <BrandMark size={40} />
        <div className="flex gap-4">
          <Link
            href="/"
            onClick={() => resetState()}
            className="brutal-border bg-card px-5 py-2 text-lg font-black uppercase hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow-hover transition-all flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Quit
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        {/* Winner Hero */}
        <motion.section
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative overflow-hidden brutal-border bg-primary brutal-shadow-lg"
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
          
          <div className="relative grid gap-0 lg:grid-cols-[400px_1fr]">
            {/* Cinematic Poster */}
            <div className="relative aspect-[2/3] overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-foreground group">
              <Poster movie={winner} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-40" />
              
              {/* Winner Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [-5, -2, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 left-6 z-20 bg-success text-success-foreground brutal-border px-6 py-2 text-2xl font-black uppercase tracking-tighter shadow-[6px_6px_0px_var(--foreground)]"
              >
                #1 PICK
              </motion.div>
            </div>

            {/* Winner Info */}
            <div className="flex flex-col justify-center p-8 lg:p-16 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-pixel text-sm uppercase tracking-widest bg-foreground text-background px-4 py-1.5 font-black inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    QUORUM CONSENSUS
                  </span>
                  {cameFromTie && (
                    <span className="font-pixel text-sm uppercase tracking-widest bg-secondary text-foreground px-4 py-1.5 brutal-border font-black">
                      TIE-BREAKER WIN
                    </span>
                  )}
                </div>
                
                <h1 className="text-balance font-sans text-6xl font-black uppercase leading-[0.85] tracking-tighter sm:text-8xl lg:text-9xl">
                  {winner.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <GenreTag genre={winner.genre} className="brutal-border bg-background text-foreground text-lg px-5 py-1.5" />
                <div className="flex items-center gap-2 brutal-border bg-background text-foreground px-4 py-1.5 text-base font-black uppercase">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  {winner.rating.toFixed(1)}
                </div>
                <div className="brutal-border bg-background text-foreground px-4 py-1.5 text-base font-black uppercase">
                  {winner.runtime}m
                </div>
              </div>

              {winnerRow && (
                <div className="space-y-4">
                  <p className="font-pixel text-xs uppercase tracking-widest opacity-70">Victory Statistics</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3 brutal-border bg-secondary text-secondary-foreground px-5 py-2">
                      <Heart className="h-5 w-5" />
                      <span className="font-pixel text-2xl font-black">{winnerRow.counts.love}</span>
                      <span className="text-xs font-bold uppercase">Loves</span>
                    </div>
                    <div className="flex items-center gap-3 brutal-border bg-success text-success-foreground px-5 py-2">
                      <ThumbsUp className="h-5 w-5" />
                      <span className="font-pixel text-2xl font-black">{winnerRow.counts.yes}</span>
                      <span className="text-xs font-bold uppercase">Yeses</span>
                    </div>
                    <div className="flex items-center gap-3 brutal-border bg-destructive text-destructive-foreground px-5 py-2">
                      <ThumbsDown className="h-5 w-5" />
                      <span className="font-pixel text-2xl font-black">{winnerRow.counts.no}</span>
                      <span className="text-xs font-bold uppercase">Nos</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="max-w-xl text-xl font-bold leading-tight opacity-90 font-sans border-l-4 border-foreground pl-6 py-2">
                {winner.synopsis}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setShowWatch(true)}
                  className="group inline-flex items-center gap-3 brutal-border bg-secondary px-8 py-4 text-xl font-black uppercase text-foreground transition-all hover:translate-y-[-4px] brutal-shadow-sm hover:brutal-shadow"
                >
                  <Tv className="h-6 w-6" />
                  Watch Room
                </button>
                <button
                  onClick={() => {
                    rematchSession()
                    router.push("/vote")
                  }}
                  className="inline-flex items-center gap-3 brutal-border bg-card px-8 py-4 text-xl font-black uppercase text-foreground transition-all hover:translate-y-[-4px] brutal-shadow-sm hover:brutal-shadow"
                >
                  <Repeat className="h-6 w-6" />
                  Rematch
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Insight */}
        <Insight winnerId={winner.id} fullTally={fullTally} cameFromTie={cameFromTie} />

        {/* Leaderboard / Podium */}
        <section className="mt-20">
          <div className="border-b-4 border-foreground pb-4 mb-10">
            <h2 className="font-sans text-5xl font-black uppercase tracking-tighter">The Podium</h2>
            <p className="mt-2 text-lg font-bold opacity-70">
              TOP THREE WEIGHTED SCORERS.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            {top3.map((row, i) => {
              const m = getMovieById(row.movieId)
              if (!m) return null
              return (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={m.id}
                  className={cn(
                    "relative group brutal-border bg-card p-6 brutal-shadow hover:brutal-shadow-lg transition-all hover:-translate-y-2",
                    i === 0 ? "bg-primary/10 ring-4 ring-primary" : ""
                  )}
                >
                  <div className="absolute -top-6 -right-4 z-10 font-pixel text-4xl font-black bg-foreground text-background px-4 py-2 transform rotate-12">
                    #{i + 1}
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="relative h-48 w-32 shrink-0 overflow-hidden brutal-border brutal-shadow-sm">
                      <Poster movie={m} className="h-full w-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <span className="font-pixel text-2xl font-black text-primary">
                          {row.score} PTS
                        </span>
                        <h3 className="mt-3 font-sans text-2xl font-black uppercase leading-none tracking-tight">
                          {m.title}
                        </h3>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-success text-success-foreground brutal-border px-2 py-1 text-sm font-black">
                          <ThumbsUp className="h-4 w-4" />
                          {row.counts.yes}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground brutal-border px-2 py-1 text-sm font-black">
                          <Heart className="h-4 w-4" />
                          {row.counts.love}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Room Sentiment Overview */}
        <section className="mt-20">
          <div className="border-b-4 border-foreground pb-4 mb-8">
            <h2 className="font-sans text-4xl font-black uppercase tracking-tighter">Room Sentiment</h2>
            <p className="mt-2 text-lg font-bold opacity-70">
              CUMULATIVE ENGAGEMENT ACROSS ALL BALLOTS.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SentimentCard 
              label="Total Love" 
              value={Object.values(votes).reduce((acc, v) => acc + Object.values(v).filter(x => x === "love").length, 0)}
              icon={<Heart className="h-6 w-6 text-primary" />}
              sub="Highest signal"
            />
            <SentimentCard 
              label="Consensus" 
              value={Object.values(votes).reduce((acc, v) => acc + Object.values(v).filter(x => x === "yes").length, 0)}
              icon={<ThumbsUp className="h-6 w-6 text-success" />}
              sub="Agreement"
            />
            <SentimentCard 
              label="Objections" 
              value={Object.values(votes).reduce((acc, v) => acc + Object.values(v).filter(x => x === "no").length, 0)}
              icon={<ThumbsDown className="h-6 w-6 text-destructive" />}
              sub="Friction"
            />
            <SentimentCard 
              label="Engagement" 
              value={`${Math.round((Object.values(votes).reduce((acc, v) => acc + Object.values(v).length, 0) / (moviePool.length * participants.length)) * 100)}%`}
              icon={<Star className="h-6 w-6 text-secondary" />}
              sub="Ballot fill rate"
            />
          </div>
        </section>

        {/* Full Tally Table */}
        <section className="mt-20">
          <div className="border-b-4 border-foreground pb-4 mb-8">
            <h2 className="font-sans text-4xl font-black uppercase tracking-tighter">Full Rankings</h2>
            <p className="mt-2 text-lg font-bold opacity-70">
              WEIGHTED SCORE DISTRIBUTION FOR THE ENTIRE POOL.
            </p>
          </div>
          
          <div className="overflow-x-auto brutal-border bg-card brutal-shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-secondary font-pixel text-lg font-black uppercase border-b-4 border-foreground">
                <tr>
                  <th className="px-6 py-4">Film</th>
                  <th className="px-6 py-4">Distribution</th>
                  <th className="px-6 py-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-foreground font-bold">
                {fullTally.ranked.map((row, i) => {
                  const m = getMovieById(row.movieId)
                  if (!m) return null
                  const total = participants.length || 1
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      key={m.id} 
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-11 shrink-0 overflow-hidden brutal-border-sm">
                            <Poster movie={m} className="h-full w-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xl uppercase tracking-tighter leading-none truncate">{m.title}</p>
                            <p className="font-pixel text-[10px] uppercase mt-1 opacity-50">{m.genre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex h-8 w-full max-w-[280px] overflow-hidden brutal-border bg-background p-0.5 shadow-[2px_2px_0_var(--foreground)]">
                          <div
                            className="h-full bg-secondary border-r-2 border-foreground"
                            style={{ width: `${(row.counts.love / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-success border-r-2 border-foreground"
                            style={{ width: `${(row.counts.yes / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-destructive"
                            style={{ width: `${(row.counts.no / total) * 100}%` }}
                          />
                        </div>
                        <div className="mt-2 flex gap-4 text-[10px] font-black uppercase tracking-tight opacity-70">
                          <span>LOVE {row.counts.love}</span>
                          <span>YES {row.counts.yes}</span>
                          <span>NO {row.counts.no}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-pixel text-2xl text-primary">{row.score}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <p className="font-pixel text-[10px] font-black uppercase bg-card brutal-border px-4 py-1.5 brutal-shadow-sm opacity-60">
              Weights: NO {VOTE_SCORE.no} · YES +{VOTE_SCORE.yes} · LOVE +{VOTE_SCORE.love}
            </p>
          </div>
        </section>

        {/* Per-participant takeaways */}
        <PerParticipantTakeaways
          participants={participants}
          votes={votes}
          winnerId={winner.id}
          ranked={fullTally.ranked}
        />
      </div>

      <AnimatePresence>
        {showWatch && <WatchRoom title={winner.title} onClose={() => setShowWatch(false)} />}
      </AnimatePresence>
    </main>
  )
}


function Insight({
  winnerId,
  fullTally,
  cameFromTie,
}: {
  winnerId: string
  fullTally: ReturnType<typeof tallyVotes>
  cameFromTie: boolean
}) {
  const winner = getMovieById(winnerId)
  const winnerRow = fullTally.ranked.find((r) => r.movieId === winnerId)
  const runnerUp = fullTally.ranked[1]
  if (!winner || !winnerRow) return null

  // Rule-based explanation
  let line = ""
  if (cameFromTie) {
    line = `${winner.title} PULLED AHEAD IN THE TIE-BREAK ROUND.`
  } else if (winnerRow.counts.love >= 2) {
    line = `${winner.title} WON ON ENTHUSIASM — ${winnerRow.counts.love} LOVE VOTES CARRIED IT.`
  } else if (winnerRow.counts.yes >= 3 && winnerRow.counts.no === 0) {
    line = `${winner.title} WON BY CLEAN CONSENSUS — NO OBJECTIONS.`
  } else if (runnerUp && winnerRow.score - runnerUp.score <= 1) {
    line = `${winner.title} EDGED OUT THE RUNNER-UP BY A SINGLE POINT.`
  } else {
    line = `${winner.title} TOOK THE ROOM WITH THE HIGHEST WEIGHTED SCORE.`
  }

  const conflict = fullTally.ranked.filter((r) => r.counts.no > 0 && r.counts.love > 0).length
  return (
    <section className="mt-10 brutal-border bg-card p-6 brutal-shadow-md">
      <p className="font-pixel text-xl font-bold uppercase bg-foreground text-background px-3 py-1 inline-block">
        INSIGHT
      </p>
      <p className="mt-4 text-pretty font-sans text-3xl font-bold uppercase leading-tight">
        {line}
      </p>
      {conflict > 0 && (
        <p className="mt-4 text-lg font-bold">
          {conflict} {conflict === 1 ? "FILM" : "FILMS"} POLARISED THE ROOM — STRONG LOVES AND STRONG NOS.
        </p>
      )}
    </section>
  )
}

// Builds an anonymous, per-participant note explaining how the consensus
// landed for them personally. Pure function of the participant's vote map
// and the global tally — fully deterministic.
function takeawayFor(
  participantVotes: Record<string, VoteValue> | undefined,
  winnerId: string,
  ranked: { movieId: string; score: number; counts: Record<VoteValue, number> }[],
): { line: string; topPick?: string; topPickRank?: number } {
  const v = participantVotes ?? {}
  const winnerVote = v[winnerId]

  // Find this participant's most-loved (or top yes) movie that ISN'T the winner.
  const loved = Object.entries(v).filter(([, val]) => val === "love").map(([id]) => id)
  const yessed = Object.entries(v).filter(([, val]) => val === "yes").map(([id]) => id)
  const personalFavId =
    loved.find((id) => id !== winnerId) ?? yessed.find((id) => id !== winnerId)
  const personalFav = personalFavId ? getMovieById(personalFavId) : undefined
  const personalFavRank = personalFavId
    ? ranked.findIndex((r) => r.movieId === personalFavId) + 1
    : undefined

  let line = ""
  if (winnerVote === "love") {
    line = "YOUR TOP CHOICE. THE ROOM AGREED LOUDLY."
  } else if (winnerVote === "yes") {
    line = "YOU SAID YES — IT CLIMBED ALL THE WAY TO THE TOP."
  } else if (winnerVote === "no") {
    if (personalFav) {
      line = `YOU WEREN'T SOLD, BUT THE ROOM RALLIED. YOUR PICK — ${personalFav.title.toUpperCase()} — PLACED #${personalFavRank}.`
      return { line, topPick: personalFav.title, topPickRank: personalFavRank }
    }
    line = "YOU WEREN'T SOLD, BUT THE ROOM RALLIED AROUND IT."
  } else {
    line = "YOU DIDN'T WEIGH IN ON THIS ONE."
  }

  if (personalFav && winnerVote !== "no") {
    return { line, topPick: personalFav.title, topPickRank: personalFavRank }
  }
  return { line }
}

function PerParticipantTakeaways({
  participants,
  votes,
  winnerId,
  ranked,
}: {
  participants: string[]
  votes: Record<number, Record<string, VoteValue>>
  winnerId: string
  ranked: { movieId: string; score: number; counts: Record<VoteValue, number> }[]
}) {
  const [active, setActive] = useState(0)
  if (participants.length === 0) return null
  const note = takeawayFor(votes[active], winnerId, ranked)
  const counts = countsFor(votes[active])

  return (
    <section className="mt-16">
      <div className="border-b-4 border-foreground pb-4">
        <h2 className="font-sans text-4xl font-bold uppercase tracking-tighter">Per-participant takeaways</h2>
        <p className="mt-2 text-lg font-bold">
          ANONYMOUS, DETERMINISTIC NOTES — EACH BALLOT GETS ITS OWN STORY.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {participants.map((label, i) => (
          <button
            key={label + i}
            onClick={() => setActive(i)}
            className={cn(
              "brutal-border px-6 py-3 text-lg font-bold uppercase transition-transform hover:-translate-y-1",
              active === i
                ? "bg-primary text-primary-foreground brutal-shadow-sm translate-y-0"
                : "bg-card text-foreground brutal-shadow-sm"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center brutal-border bg-card p-6 lg:p-8 brutal-shadow-md">
        <div>
          <p className="font-pixel text-xl font-bold uppercase bg-foreground text-background px-3 py-1 inline-block">
            NOTE FOR {participants[active]}
          </p>
          <p className="mt-6 text-pretty font-sans text-3xl font-bold uppercase leading-tight">{note.line}</p>
          {note.topPick && (
            <p className="mt-4 text-lg font-bold">
              YOUR STRONGEST SIGNAL LANDED ON <span className="underline">{note.topPick.toUpperCase()}</span>.
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <Stat icon={<Heart className="h-5 w-5 text-secondary-foreground" />} label="Loves" value={counts.love} bg="bg-secondary" />
          <Stat
            icon={<ThumbsUp className="h-5 w-5 text-success-foreground" />}
            label="Yeses"
            value={counts.yes}
            bg="bg-success"
          />
          <Stat
            icon={<ThumbsDown className="h-5 w-5 text-destructive-foreground" />}
            label="Nos"
            value={counts.no}
            bg="bg-destructive"
          />
        </div>
      </div>
    </section>
  )
}

function countsFor(v: Record<string, VoteValue> | undefined): Record<VoteValue, number> {
  const out: Record<VoteValue, number> = { yes: 0, no: 0, love: 0 }
  if (!v) return out
  for (const val of Object.values(v)) out[val] += 1
  return out
}

function Stat({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: number; bg: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 brutal-border px-4 py-3 text-center", bg)}>
      <div className="flex items-center gap-2">
        {icon}
      </div>
      <span className="font-pixel text-2xl font-bold">{value}</span>
      <span className="text-sm font-bold uppercase tracking-widest">{label}</span>
    </div>
  )
}

function WatchRoom({ title, onClose }: { title: string; onClose: () => void }) {
  const reactions = ["🍿", "🔥", "😭", "😂", "🤯", "❤️"]
  const [bursts, setBursts] = useState<{ id: number; emoji: string; left: number }[]>([])

  function react(emoji: string) {
    const id = Date.now() + Math.random()
    setBursts((b) => [...b, { id, emoji, left: 20 + Math.random() * 60 }])
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1800)
  }

  // Pick the matching movie to render its poster as ambient background.
  const movie = MOVIES.find((m) => m.title === title)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {movie && (
        <div className="absolute inset-0 opacity-20 filter grayscale blur-sm">
          <Poster movie={movie} className="h-full w-full rounded-none object-cover" />
        </div>
      )}
      <div className="absolute inset-0 bg-background/80" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 border-b-4 border-foreground pb-4 bg-secondary">
        <BrandMark withWordmark={false} />
        <button
          onClick={onClose}
          className="brutal-border bg-card px-4 py-2 text-sm font-bold uppercase hover:-translate-y-1 brutal-shadow-sm transition-transform"
        >
          Leave
        </button>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 text-center">
        <p className="font-pixel text-xl uppercase tracking-widest bg-foreground text-background px-4 py-2 font-bold">
          NOW PLAYING
        </p>
        <h2 className="mt-8 text-balance font-sans text-6xl font-bold uppercase leading-none tracking-tighter sm:text-8xl">
          {title}
        </h2>
        <p className="mt-6 max-w-md text-xl font-bold bg-card brutal-border px-6 py-4 brutal-shadow-sm">
          A SHARED ROOM. TAP A REACTION — EVERYONE WATCHING SEES IT FLOAT UP.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {reactions.map((e) => (
            <button
              key={e}
              onClick={() => react(e)}
              className="flex h-16 w-16 items-center justify-center brutal-border bg-card text-3xl brutal-shadow-sm hover:brutal-shadow-hover transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* floating reactions */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {bursts.map((b) => (
          <span
            key={b.id}
            className="absolute bottom-24 text-6xl drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
            style={{
              left: `${b.left}%`,
              animation: "float-up 1.8s ease-out forwards",
            }}
          >
            {b.emoji}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 1; }
          100% { transform: translateY(-400px) scale(1.6) rotate(10deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
function SentimentCard({ label, value, icon, sub }: { label: string; value: string | number; icon: React.ReactNode; sub: string }) {
  return (
    <div className="brutal-border bg-card p-6 brutal-shadow-sm hover:brutal-shadow transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="brutal-border bg-background p-2">
          {icon}
        </div>
        <span className="font-pixel text-2xl font-black text-primary">{value}</span>
      </div>
      <p className="font-sans text-xl font-black uppercase tracking-tight">{label}</p>
      <p className="mt-1 text-xs font-bold opacity-50 uppercase tracking-widest">{sub}</p>
    </div>
  )
}
