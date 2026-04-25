"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, EyeOff, Hand, LogOut } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { SwipeDeck } from "@/components/quorum/swipe-deck"
import { MOVIES } from "@/lib/movies"
import {
  advanceParticipant,
  recordVote,
  setState,
  useStore,
  type VoteValue,
} from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Stage = "handoff" | "voting"

export default function VotePage() {
  const router = useRouter()
  const phase = useStore((s) => s.phase)
  const participants = useStore((s) => s.participants)
  const currentParticipant = useStore((s) => s.currentParticipant)
  const moviePool = useStore((s) => s.moviePool)

  const [stage, setStage] = useState<Stage>("handoff")
  const [readyChecked, setReadyChecked] = useState(false)

  useEffect(() => {
    if (phase === "idle" || participants.length === 0 || moviePool.length === 0) {
      router.replace("/session")
    }
  }, [phase, participants.length, moviePool.length, router])

  useEffect(() => {
    if (phase === "reveal") {
      router.push("/reveal")
    }
  }, [phase, router])

  const deck = useMemo(
    () => moviePool.map((id) => MOVIES.find((m) => m.id === id)!).filter(Boolean),
    [moviePool],
  )

  const participantLabel = useMemo(() => {
    const name = participants[currentParticipant]
    if (!name) return `P${currentParticipant + 1}`
    return name === `P${currentParticipant + 1}` ? name : `${name}`
  }, [participants, currentParticipant])

  useEffect(() => {
    setStage("handoff")
    setReadyChecked(false)
  }, [currentParticipant])

  function handleComplete(votes: Record<string, VoteValue>) {
    Object.entries(votes).forEach(([movieId, v]) => recordVote(movieId, v))
    advanceParticipant()
  }

  if (deck.length === 0) return null

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-50 border-b-8 border-foreground bg-secondary flex w-full items-center justify-between px-5 py-6 sm:px-8">
        <BrandMark withWordmark={false} size={40} />
        <span className="font-pixel text-xl uppercase tracking-widest text-foreground font-black brutal-border bg-card px-5 py-2 brutal-shadow-sm">
          {currentParticipant + 1} / {participants.length}
        </span>
        <button
          onClick={() => {
            setState({ phase: "idle" })
            router.push("/")
          }}
          className="brutal-border bg-destructive p-3 text-destructive-foreground transition-all hover:-translate-y-1 brutal-shadow hover:brutal-shadow-hover active:translate-y-0"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </header>

      <div className="relative z-10 mx-auto flex w-full flex-1 flex-col items-center px-5 pt-10 pb-12 sm:px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === "handoff" ? (
            <motion.div 
              key="handoff"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="flex w-full flex-1 flex-col items-center justify-center text-center max-w-2xl"
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex h-24 w-24 items-center justify-center brutal-border bg-primary brutal-shadow-lg text-primary-foreground mb-10 transform -rotate-6"
              >
                <Hand className="h-12 w-12" />
              </motion.div>
              
              <div className="space-y-3">
                <p className="font-pixel text-lg uppercase tracking-widest text-foreground bg-accent px-4 py-2 brutal-border brutal-shadow-sm inline-block font-black">
                  Pass the device
                </p>
                <h1 className="text-balance font-sans font-black text-5xl uppercase leading-none tracking-tighter sm:text-7xl">
                  <span className="text-primary">{participantLabel}</span>
                  <br/>
                  <span className="bg-foreground text-background px-4 mt-2 inline-block transform -rotate-1">YOUR TURN</span>
                </h1>
              </div>

              <p className="mt-8 text-xl font-bold font-sans leading-tight max-w-lg">
                You&apos;ll swipe <span className="bg-secondary px-2">{deck.length} cards</span>. <br/>
                Decisions are <span className="text-primary">private</span> and will only be revealed at the end.
              </p>

              <motion.label 
                whileHover={{ scale: 1.01 }}
                className="mt-12 flex cursor-pointer items-center gap-4 brutal-border bg-card px-6 py-4 text-xl font-black brutal-shadow hover:brutal-shadow-lg transition-all active:translate-y-1"
              >
                <div className="relative h-8 w-8 shrink-0">
                  <input
                    type="checkbox"
                    checked={readyChecked}
                    onChange={(e) => setReadyChecked(e.target.checked)}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className={cn(
                    "h-full w-full brutal-border transition-colors flex items-center justify-center",
                    readyChecked ? "bg-success" : "bg-background"
                  )}>
                    {readyChecked && <Hand className="h-4 w-4 text-success-foreground" />}
                  </div>
                </div>
                <span className="flex items-center gap-3 text-foreground uppercase tracking-tight text-lg">
                  <EyeOff className="h-6 w-6" />
                  I&apos;m alone with the device
                </span>
              </motion.label>

              <button
                onClick={() => setStage("voting")}
                disabled={!readyChecked}
                className="group mt-10 inline-flex items-center gap-4 brutal-border bg-primary px-10 py-4 text-2xl font-black uppercase text-primary-foreground transition-all disabled:opacity-20 brutal-shadow hover:brutal-shadow-lg enabled:hover:-translate-y-1 enabled:active:translate-y-1"
              >
                Begin Deck
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="voting"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex-1 flex flex-col"
            >
              <SwipeDeck
                movies={deck}
                participantLabel={participantLabel}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
