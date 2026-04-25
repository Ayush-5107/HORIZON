"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Crown,
  QrCode,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { GenreTag } from "@/components/quorum/genre-tag"
import { GENRE_COLORS, MOVIES } from "@/lib/movies"
import { cn } from "@/lib/utils"
import { startSession, useStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

type Step = 0 | 1 | 2

const ALL_GENRES = Object.keys(GENRE_COLORS)

export default function SessionPage() {
  const router = useRouter()
  const reelLikes = useStore((s) => s.reels.liked)

  const [step, setStep] = useState<Step>(0)
  const [participants, setParticipants] = useState<string[]>(["", ""])
  const [leader, setLeader] = useState<number | undefined>(undefined)
  const [mode, setMode] = useState<"device" | "qr">("device")
  const [poolFilter, setPoolFilter] = useState<"auto" | "genre">("auto")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [deckSize, setDeckSize] = useState(15)

  const cleanedParticipants = participants
    .map((p, i) => p.trim() || `P${i + 1}`)
    .slice(0, 5)
    
  const validParticipantCount =
    participants.filter((p) => p.trim().length > 0).length >= 2

  const moviePool = useMemo(() => {
    const filtered =
      poolFilter === "genre" && selectedGenres.length > 0
        ? MOVIES.filter((m) => m.genres.some((g) => selectedGenres.includes(g)))
        : MOVIES
    const liked = filtered.filter((m) => reelLikes.includes(m.id))
    const rest = filtered.filter((m) => !reelLikes.includes(m.id))
    const ordered = [...liked, ...rest]
    const seen = new Set<string>()
    const ids: string[] = []
    for (const m of ordered) {
      if (seen.has(m.id)) continue
      seen.add(m.id)
      ids.push(m.id)
      if (ids.length >= deckSize) break
    }
    return ids
  }, [poolFilter, selectedGenres, reelLikes, deckSize])

  function addParticipant() {
    if (participants.length >= 5) return
    setParticipants([...participants, ""])
  }

  function removeParticipant(idx: number) {
    if (participants.length <= 2) return
    const next = participants.filter((_, i) => i !== idx)
    setParticipants(next)
    if (leader === idx) setLeader(undefined)
    else if (leader !== undefined && idx < leader) setLeader(leader - 1)
  }

  function toggleGenre(g: string) {
    setSelectedGenres((cur) =>
      cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g],
    )
  }

  function begin() {
    startSession({
      participants: cleanedParticipants,
      mode,
      leader,
      poolFilter,
      selectedGenres,
      deckSize,
      moviePool,
    })
    router.push("/vote")
  }

  return (
    <main className="relative min-h-dvh bg-background pb-40">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-50 flex w-full items-center justify-between px-5 py-4 sm:px-8 border-b-4 border-foreground bg-secondary">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center brutal-border bg-card brutal-shadow-sm hover:brutal-shadow-hover transition-all hover:-translate-y-1"
          aria-label="Back home"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <BrandMark withWordmark={false} size={32} />
        <span className="font-pixel text-sm uppercase tracking-widest text-foreground font-black bg-card brutal-border px-4 py-1.5 brutal-shadow-sm">
          Step {step + 1} / 3
        </span>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-12 sm:px-8">
        {/* Stepper */}
        <ol className="mb-12 flex gap-4">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className={cn(
                "h-2 flex-1 brutal-border transition-all duration-500",
                step >= i ? "bg-primary brutal-shadow-sm translate-y-[-2px]" : "bg-card opacity-50"
              )}
            />
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section 
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-sans font-black text-2xl uppercase tracking-tighter leading-none sm:text-3xl">
                  Who&apos;s in <br/> the <span className="text-primary">room?</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-bold leading-tight opacity-70">
                  ADD 2 TO 5 PARTICIPANTS. NAMES STAY ON THIS DEVICE.
                </p>
              </div>

              <ul className="space-y-3 mt-8">
                {participants.map((value, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 brutal-border bg-card p-1 pl-3 brutal-shadow-sm transition-all focus-within:brutal-shadow"
                  >
                    <span className="font-pixel text-sm font-black bg-foreground text-background px-2 py-0.5">
                      P{idx + 1}
                    </span>
                    <input
                      value={value}
                      onChange={(e) => {
                        const next = [...participants]
                        next[idx] = e.target.value.slice(0, 24)
                        setParticipants(next)
                      }}
                      placeholder={`Participant ${idx + 1}`}
                      className="flex-1 bg-transparent px-2 py-2 text-lg font-black outline-none uppercase placeholder:text-muted-foreground/30 tracking-tight"
                    />
                    <div className="flex gap-2 pr-2">
                      <button
                        type="button"
                        onClick={() => setLeader(leader === idx ? undefined : idx)}
                        aria-label={leader === idx ? "Remove leader" : "Make leader"}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center brutal-border transition-all brutal-shadow-sm hover:brutal-shadow-hover",
                          leader === idx
                            ? "bg-warning text-foreground translate-y-[-2px]"
                            : "bg-background text-foreground/40 hover:text-foreground"
                        )}
                      >
                        <Crown className={cn("h-4 w-4", leader === idx && "fill-current")} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeParticipant(idx)}
                        disabled={participants.length <= 2}
                        aria-label={`Remove participant ${idx + 1}`}
                        className="flex h-10 w-10 items-center justify-center brutal-border bg-destructive text-destructive-foreground transition-all brutal-shadow-sm hover:brutal-shadow-hover disabled:opacity-20"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={addParticipant}
                disabled={participants.length >= 5}
                className="w-full brutal-border bg-secondary py-3 text-lg font-black uppercase transition-all hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow disabled:opacity-40"
              >
                + Add participant {participants.length >= 5 && "(max 5)"}
              </button>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-sans font-black text-3xl uppercase tracking-tighter sm:text-5xl leading-none">
                  How will you <br/> <span className="text-secondary">vote?</span>
                </h1>
                <p className="mt-3 max-w-2xl text-base font-bold leading-tight">
                  QUORUM KEEPS VOTES PRIVATE. PICK HOW THE GROUP WILL PHYSICALLY VOTE.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 mt-8">
                <ModeCard
                  active={mode === "device"}
                  onClick={() => setMode("device")}
                  icon={<Smartphone className="h-10 w-10" />}
                  title="PASS DEVICE"
                  body="One screen. Each person votes their deck, then passes it."
                  badge="STABLE"
                  color="bg-primary"
                />
                <ModeCard
                  active={mode === "qr"}
                  onClick={() => setMode("qr")}
                  icon={<QrCode className="h-10 w-10" />}
                  title="QR SYNC"
                  body="Display a code, others scan to join from their phone."
                  color="bg-accent"
                />
              </div>

              {mode === "qr" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 brutal-border bg-card p-6 brutal-shadow flex items-center gap-6"
                >
                  <div
                    aria-hidden
                    className="grid h-40 w-40 shrink-0 grid-cols-8 grid-rows-8 gap-1 brutal-border bg-foreground p-3 shadow-[8px_8px_0px_var(--secondary)]"
                  >
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span
                        key={i}
                        className="bg-card"
                        style={{
                          opacity:
                            (i * 13) % 5 === 0 || i < 4 || i > 60 ? 1 : 0,
                        }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-sans font-black text-3xl uppercase tracking-tighter">Scan to join</p>
                    <p className="mt-3 text-base font-bold leading-tight opacity-70">
                      In this prototype, QR mode runs the same flow on a single device — useful for
                      previewing the multi-user experience.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h1 className="font-sans font-black text-4xl uppercase tracking-tighter sm:text-5xl leading-none">
                  The movie <br/> <span className="text-accent">deck.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-xl font-bold leading-tight">
                  EACH PARTICIPANT SEES THE SAME 15-CARD DECK. USE AUTO OR PICK GENRES.
                </p>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 mt-12">
                <ModeCard
                  active={poolFilter === "auto"}
                  onClick={() => setPoolFilter("auto")}
                  icon={<Sparkles className="h-12 w-12" />}
                  title="AUTO POOL"
                  body="Quorum picks a balanced mix, prioritizing movies you've liked in CineReels."
                  badge="AI-DRIVEN"
                  color="bg-secondary"
                />
                <ModeCard
                  active={poolFilter === "genre"}
                  onClick={() => setPoolFilter("genre")}
                  icon={<Crown className="h-12 w-12" />}
                  title="PICK GENRES"
                  body="Filter the pool to genres your group wants to lean into."
                  color="bg-success"
                />
              </div>

              {poolFilter === "genre" && (
                <div className="mt-12 flex flex-wrap gap-4 p-8 brutal-border bg-card brutal-shadow">
                  {ALL_GENRES.map((g) => {
                    const active = selectedGenres.includes(g)
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        className={cn(
                          "brutal-border px-6 py-3 font-black uppercase text-lg transition-all brutal-shadow-sm hover:brutal-shadow-hover",
                          active
                            ? "bg-accent text-accent-foreground translate-y-[-4px]"
                            : "bg-background text-foreground hover:-translate-y-1"
                        )}
                      >
                        {g}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="mt-8 brutal-border bg-card p-6 brutal-shadow-lg">
                <div className="flex items-center justify-between border-b-4 border-foreground pb-4 mb-6">
                  <p className="text-3xl font-black uppercase tracking-tighter">Deck preview</p>
                  <p className="font-pixel text-xl font-black bg-foreground text-background px-4 py-1.5 transform rotate-1">
                    {moviePool.length} CARDS
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {Array.from(new Set(moviePool))
                    .slice(0, 10)
                    .map((id) => {
                      const m = MOVIES.find((x) => x.id === id)!
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-3 brutal-border bg-background px-4 py-2.5 font-black text-sm uppercase brutal-shadow-sm transition-transform hover:-translate-y-1 hover:bg-secondary"
                        >
                          <GenreTag genre={m.genre} className="!border-transparent !bg-transparent !px-0 !py-0" />
                          <span>{poolFilter === "auto" ? "???" : m.title}</span>
                        </span>
                      )
                    })}
                  {moviePool.length > 10 && (
                    <span className="inline-flex items-center gap-3 brutal-border bg-foreground text-background px-4 py-2.5 font-black text-sm uppercase brutal-shadow-sm">
                      +{moviePool.length - 10} MORE
                    </span>
                  )}
                </div>
              </div>

              {/* Deck Size */}
              <section className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="brutal-border bg-foreground p-1.5 text-background">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h3 className="font-sans text-lg font-black uppercase tracking-tight">Deck Depth</h3>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[10, 15, 20, 30].map((size) => (
                    <button
                      key={size}
                      onClick={() => setDeckSize(size)}
                      className={cn(
                        "brutal-border py-3 font-pixel text-lg font-black transition-all hover:-translate-y-1",
                        deckSize === size
                          ? "bg-primary text-primary-foreground brutal-shadow translate-y-0"
                          : "bg-card text-foreground hover:brutal-shadow-sm"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                  HOW MANY FILMS TO VOTE ON BEFORE THE FINAL TALLY.
                </p>
              </section>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* fixed bottom nav */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-foreground bg-secondary brutal-shadow-lg">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
            disabled={step === 0}
            className="brutal-border bg-card px-6 py-2.5 text-base font-black uppercase transition-all disabled:opacity-30 hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow"
          >
            Back
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep((s) => Math.min(2, s + 1) as Step)}
              disabled={!validParticipantCount}
              className="group inline-flex items-center gap-2 brutal-border bg-primary px-8 py-2.5 text-lg font-black uppercase text-primary-foreground transition-all disabled:opacity-30 hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow"
            >
              Continue
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={begin}
              disabled={poolFilter === "genre" && selectedGenres.length === 0}
              className="group inline-flex items-center gap-2 brutal-border bg-success px-8 py-2.5 text-lg font-black uppercase text-success-foreground transition-all disabled:opacity-30 hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow"
            >
              Start Voting
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

function ModeCard({
  active,
  onClick,
  icon,
  title,
  body,
  badge,
  color,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  body: string
  badge?: string
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative p-4 text-left transition-all brutal-border",
        active 
          ? `${color || "bg-primary"} text-foreground brutal-shadow translate-y-[-4px]` 
          : "bg-card text-foreground brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1"
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center brutal-border brutal-shadow-sm transition-transform group-hover:rotate-6",
            active ? "bg-foreground text-background" : "bg-background text-foreground",
          )}
        >
          {icon}
        </span>
        {badge && (
          <span className="font-pixel text-xs uppercase tracking-widest bg-foreground text-background px-3 py-1 transform -rotate-3">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-sans font-black text-xl uppercase tracking-tighter leading-none">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-tight opacity-90">{body}</p>
      
      {active && (
        <div className="absolute -bottom-3 -right-3 bg-foreground text-background brutal-border p-1.5 animate-bounce">
          <ArrowRight className="h-4 w-4 rotate-90" />
        </div>
      )}
    </button>
  )
}
