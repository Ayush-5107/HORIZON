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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
        {/* Winner Section */}
        <motion.section
          initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="relative grid gap-10 overflow-hidden brutal-border bg-primary p-8 sm:p-14 lg:grid-cols-[400px_1fr] lg:gap-16 brutal-shadow-lg"
        >
          {/* Winner Badge Floating */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: [5, 2, 5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -left-4 z-20 bg-success text-success-foreground brutal-border px-8 py-4 text-3xl font-black uppercase tracking-tighter shadow-[8px_8px_0px_var(--foreground)]"
          >
            Winner
          </motion.div>

          <div className="relative aspect-[2/3] w-full overflow-hidden brutal-border bg-foreground group">
            <Poster movie={winner} className="h-full w-full transform transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-60" />
          </div>

          <div className="flex flex-col justify-center">
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <span className="font-pixel text-2xl uppercase tracking-widest bg-foreground text-background px-4 py-1.5 font-black inline-flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  CONSENSUS REACHED
                </span>
                {cameFromTie && (
                  <span className="font-pixel text-xl uppercase tracking-widest bg-secondary text-foreground px-4 py-1.5 brutal-border font-black">
                    TIE-BREAK
                  </span>
                )}
              </div>
              
              <h1 className="mt-8 text-balance font-sans text-7xl font-black uppercase leading-none tracking-tighter sm:text-9xl">
                {winner.title}
              </h1>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <GenreTag genre={winner.genre} className="brutal-border bg-background text-foreground text-xl px-6 py-2" />
                <div className="flex items-center gap-2 brutal-border bg-background text-foreground px-4 py-2 text-lg font-black uppercase">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                  {winner.rating.toFixed(1)}
                </div>
                <div className="brutal-border bg-background text-foreground px-4 py-2 text-lg font-black uppercase">
                  {winner.runtime}m
                </div>
                <div className="brutal-border bg-background text-foreground px-4 py-2 text-lg font-black uppercase">
                  {winner.year}
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-2xl font-bold leading-tight opacity-90 font-sans">
                {winner.synopsis}
              </p>

              <div className="mt-12 flex flex-wrap gap-6">
                <button
                  onClick={() => setShowWatch(true)}
                  className="group inline-flex items-center gap-4 brutal-border bg-secondary px-10 py-6 text-2xl font-black uppercase text-foreground transition-all hover:-translate-y-2 brutal-shadow hover:brutal-shadow-lg"
                >
                  <Tv className="h-8 w-8" />
                  Watch Room
                </button>
                <button
                  onClick={() => {
                    const remaining = rematchSession()
                    if (remaining > 0) router.push("/vote")
                    else router.push("/session")
                  }}
                  className="inline-flex items-center gap-4 brutal-border bg-card px-10 py-6 text-2xl font-black uppercase text-foreground transition-all hover:-translate-y-2 brutal-shadow hover:brutal-shadow-lg"
                >
                  <Repeat className="h-8 w-8" />
                  Rematch
                </button>
                <button
                  onClick={() => {
                    resetState()
                    router.push("/session")
                  }}
                  className="inline-flex items-center gap-4 brutal-border bg-accent px-10 py-6 text-2xl font-black uppercase text-foreground transition-all hover:-translate-y-2 brutal-shadow hover:brutal-shadow-lg"
                >
                  <RotateCcw className="h-8 w-8" />
                  New Session
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Insight */}
        <Insight winnerId={winner.id} fullTally={fullTally} cameFromTie={cameFromTie} />

        {/* Podium */}
        <section className="mt-24">
          <div className="border-b-8 border-foreground pb-6 flex items-end justify-between">
            <div>
              <h2 className="font-sans text-6xl font-black uppercase tracking-tighter">Podium</h2>
              <p className="mt-3 text-2xl font-bold opacity-70">
                TOP THREE BY WEIGHTED SCORE.
              </p>
            </div>
            <div className="hidden sm:block font-pixel text-xl font-black bg-foreground text-background px-4 py-2">
              SCORING ACTIVE
            </div>
          </div>
          
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
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

        {/* Sentiment matrix */}
        <section className="mt-24">
          <div className="border-b-8 border-foreground pb-6">
            <h2 className="font-sans text-6xl font-black uppercase tracking-tighter">Full Tally</h2>
            <p className="mt-3 text-2xl font-bold opacity-70">
              ANONYMOUS DISTRIBUTION ACROSS {participants.length} BALLOTS.
            </p>
          </div>
          
          <div className="mt-12 overflow-x-auto brutal-border bg-card brutal-shadow">
            <table className="w-full">
              <thead className="bg-secondary text-left font-pixel text-xl font-black uppercase border-b-8 border-foreground">
                <tr>
                  <th className="px-8 py-6">Film</th>
                  <th className="px-8 py-6">Distribution</th>
                  <th className="px-8 py-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y-8 divide-foreground font-black">
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
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="h-20 w-14 shrink-0 overflow-hidden brutal-border">
                            <Poster movie={m} className="h-full w-full" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-2xl uppercase tracking-tighter leading-none">{m.title}</p>
                            <p className="font-pixel text-sm uppercase mt-2 opacity-50">{m.genre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex h-10 w-full max-w-md overflow-hidden brutal-border bg-background p-1 shadow-[4px_4px_0_var(--foreground)]">
                          <div
                            className="h-full bg-secondary brutal-border border-y-0 border-l-0"
                            style={{ width: `${(row.counts.love / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-success brutal-border border-y-0 border-l-0"
                            style={{ width: `${(row.counts.yes / total) * 100}%` }}
                          />
                          <div
                            className="h-full bg-destructive"
                            style={{ width: `${(row.counts.no / total) * 100}%` }}
                          />
                        </div>
                        <div className="mt-4 flex gap-6 text-sm font-black uppercase tracking-tight">
                          <span className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-secondary brutal-border" />
                            Love {row.counts.love}
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-success brutal-border" />
                            Yes {row.counts.yes}
                          </span>
                          <span className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-destructive brutal-border" />
                            No {row.counts.no}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-pixel text-4xl text-primary">{row.score}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <p className="font-pixel text-lg font-black uppercase bg-card brutal-border px-6 py-2 brutal-shadow-sm">
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

  let line = ""
  if (cameFromTie) {
    line = `${winner.title} PULLED AHEAD IN THE TIE-BREAK ROUND.`
  } else if (winnerRow.counts.love >= 2) {
    line = `${winner.title} WON ON ENTHUSIASM — LOVES CARRIED THE DAY.`
  } else if (winnerRow.counts.yes >= 3 && winnerRow.counts.no === 0) {
    line = `${winner.title} WON BY CLEAN CONSENSUS — NO OBJECTIONS.`
  } else if (runnerUp && winnerRow.score - runnerUp.score <= 1) {
    line = `${winner.title} EDGED OUT THE RUNNER-UP BY A SINGLE POINT.`
  } else {
    line = `${winner.title} TOOK THE ROOM WITH THE HIGHEST WEIGHTED SCORE.`
  }

  const conflict = fullTally.ranked.filter((r) => r.counts.no > 0 && r.counts.love > 0).length
  
  return (
    <motion.section 
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="mt-16 brutal-border bg-card p-10 brutal-shadow flex flex-col md:flex-row gap-10 items-center"
    >
      <div className="flex-1">
        <p className="font-pixel text-2xl font-black uppercase bg-foreground text-background px-4 py-1.5 inline-block transform rotate-1">
          QUORUM INSIGHT
        </p>
        <p className="mt-8 text-pretty font-sans text-5xl font-black uppercase leading-none tracking-tighter">
          {line}
        </p>
        {conflict > 0 && (
          <p className="mt-6 text-2xl font-bold opacity-70 leading-tight">
            Note: {conflict} {conflict === 1 ? "film" : "films"} polarized the room — high love and high friction.
          </p>
        )}
      </div>
      <div className="shrink-0">
        <div className="brutal-border bg-primary p-6 brutal-shadow-sm transform -rotate-2">
          <Sparkles className="h-16 w-16 text-primary-foreground" />
        </div>
      </div>
    </motion.section>
  )
}

function takeawayFor(
  participantVotes: Record<string, VoteValue> | undefined,
  winnerId: string,
  ranked: { movieId: string; score: number; counts: Record<VoteValue, number> }[],
): { line: string; topPick?: string; topPickRank?: number } {
  const v = participantVotes ?? {}
  const winnerVote = v[winnerId]

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
    <section className="mt-24">
      <div className="border-b-8 border-foreground pb-6">
        <h2 className="font-sans text-6xl font-black uppercase tracking-tighter">Your Story</h2>
        <p className="mt-3 text-2xl font-bold opacity-70">
          ANONYMOUS, PERSONALIZED NOTES FOR EACH BALLOT.
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        {participants.map((label, i) => (
          <button
            key={label + i}
            onClick={() => setActive(i)}
            className={cn(
              "brutal-border px-8 py-4 text-xl font-black uppercase transition-all hover:-translate-y-1 brutal-shadow-sm",
              active === i
                ? "bg-primary text-primary-foreground brutal-shadow translate-y-[-4px]"
                : "bg-card text-foreground hover:brutal-shadow-hover"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div 
        key={active}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-12 grid gap-12 sm:grid-cols-[1fr_auto] items-center brutal-border bg-card p-10 lg:p-14 brutal-shadow-lg"
      >
        <div>
          <span className="font-pixel text-2xl font-black uppercase bg-foreground text-background px-4 py-1.5 inline-block transform rotate-1 mb-10">
            BALLOT {active + 1} Takeaway
          </span>
          <p className="text-pretty font-sans text-5xl font-black uppercase leading-none tracking-tighter">{note.line}</p>
          {note.topPick && (
            <p className="mt-8 text-2xl font-bold opacity-60">
              YOUR PERSONAL FAVORITE WAS <span className="text-foreground underline decoration-primary decoration-4">{note.topPick.toUpperCase()}</span>.
            </p>
          )}
        </div>
        
        <div className="flex gap-6">
          <Stat icon={<Heart className="h-8 w-8 text-secondary-foreground" />} label="Loves" value={counts.love} bg="bg-secondary" />
          <Stat
            icon={<ThumbsUp className="h-8 w-8 text-success-foreground" />}
            label="Yeses"
            value={counts.yes}
            bg="bg-success"
          />
          <Stat
            icon={<ThumbsDown className="h-8 w-8 text-destructive-foreground" />}
            label="Nos"
            value={counts.no}
            bg="bg-destructive"
          />
        </div>
      </motion.div>
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
    <div className={cn("flex flex-col items-center gap-4 brutal-border px-6 py-6 text-center brutal-shadow-sm", bg)}>
      {icon}
      <span className="font-pixel text-4xl font-black">{value}</span>
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
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

  const movie = MOVIES.find((m) => m.title === title)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {movie && (
        <div className="absolute inset-0 opacity-10 filter blur-xl scale-110">
          <Poster movie={movie} className="h-full w-full rounded-none object-cover" />
        </div>
      )}
      <div className="absolute inset-0 bg-background/90" />

      <header className="relative z-10 flex items-center justify-between px-5 py-8 sm:px-10 border-b-8 border-foreground bg-secondary">
        <BrandMark size={48} />
        <button
          onClick={onClose}
          className="brutal-border bg-card px-8 py-3 text-xl font-black uppercase hover:-translate-y-2 brutal-shadow transition-all"
        >
          Exit Room
        </button>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="font-pixel text-2xl uppercase tracking-widest bg-foreground text-background px-6 py-2 font-black transform -rotate-1">
            Now Playing
          </span>
          <h2 className="mt-10 text-balance font-sans text-8xl font-black uppercase leading-none tracking-tighter sm:text-9xl">
            {title}
          </h2>
          <p className="mt-10 max-w-lg mx-auto text-2xl font-bold bg-card brutal-border px-10 py-6 brutal-shadow transform rotate-1">
            TAP REACTION TO SYNC WITH OTHERS.
          </p>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
            {reactions.map((e) => (
              <motion.button
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                key={e}
                onClick={() => react(e)}
                className="flex h-24 w-24 items-center justify-center brutal-border bg-card text-5xl brutal-shadow hover:brutal-shadow-lg transition-all"
              >
                {e}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* floating reactions */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {bursts.map((b) => (
          <span
            key={b.id}
            className="absolute bottom-32 text-8xl drop-shadow-[8px_8px_0_rgba(0,0,0,1)]"
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
          0% { transform: translateY(0) scale(1) rotate(-15deg); opacity: 1; }
          100% { transform: translateY(-600px) scale(2) rotate(15deg); opacity: 0; }
        }
      `}</style>
    </motion.div>
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
