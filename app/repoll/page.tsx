"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Hand, Swords, EyeOff } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { SwipeDeck } from "@/components/quorum/swipe-deck"
import { getMovieById } from "@/lib/movies"
import { setState, useStore, type VoteValue } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Stage = "handoff" | "voting"

export default function RepollPage() {
  const router = useRouter()
  const phase = useStore((s) => s.phase)
  const tied = useStore((s) => s.tied)
  const participants = useStore((s) => s.participants)
  const repollVotes = useStore((s) => s.repollVotes)
  const currentParticipant = useStore((s) => s.currentParticipant)

  const [stage, setStage] = useState<Stage>("handoff")
  const [readyChecked, setReadyChecked] = useState(false)

  useEffect(() => {
    if (phase === "idle" || tied.length < 2) {
      router.replace("/")
    }
  }, [phase, tied.length, router])

  useEffect(() => {
    setStage("handoff")
    setReadyChecked(false)
  }, [currentParticipant])

  const deck = useMemo(
    () => tied.map((id) => getMovieById(id)!).filter(Boolean),
    [tied],
  )

  const participantLabel = useMemo(() => {
    const name = participants[currentParticipant]
    if (!name) return `P${currentParticipant + 1}`
    return name === `P${currentParticipant + 1}` ? name : `${name}`
  }, [participants, currentParticipant])

  function handleComplete(votes: Record<string, VoteValue>) {
    const next = { ...repollVotes, [currentParticipant]: votes }
    const nextIdx = currentParticipant + 1
    if (nextIdx >= participants.length) {
      setState({ repollVotes: next, phase: "reveal" })
      router.push("/reveal")
    } else {
      setState({ repollVotes: next, currentParticipant: nextIdx })
    }
  }

  if (deck.length === 0) return null

  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-50 border-b-8 border-foreground bg-secondary flex w-full items-center justify-between px-5 py-6 sm:px-8">
        <BrandMark withWordmark={false} size={40} />
        <div className="flex items-center gap-4">
          <div className="font-pixel text-lg uppercase tracking-widest text-foreground font-black brutal-border bg-card px-4 py-1.5 brutal-shadow-sm flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            TIE-BREAK
          </div>
          <span className="font-pixel text-xl uppercase tracking-widest text-foreground font-black brutal-border bg-card px-5 py-1.5 brutal-shadow-sm">
            {currentParticipant + 1} / {participants.length}
          </span>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-5 pt-10 pb-12 sm:px-8 overflow-hidden">
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
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex h-24 w-24 items-center justify-center brutal-border bg-secondary brutal-shadow-lg text-secondary-foreground mb-10 transform rotate-6"
              >
                <Hand className="h-12 w-12" />
              </motion.div>
              
              <div className="space-y-4">
                <p className="font-pixel text-2xl uppercase tracking-widest text-background bg-primary px-8 py-3 brutal-border brutal-shadow-sm inline-block font-black transform -rotate-1">
                  Final Decisive Round
                </p>
                <h1 className="text-balance font-sans font-black text-7xl uppercase leading-none tracking-tighter sm:text-9xl">
                  <span className="text-secondary">{participantLabel}</span>
                  <br/>
                  <span className="bg-foreground text-background px-6 mt-4 inline-block transform rotate-1">BREAK THE TIE</span>
                </h1>
              </div>

              <p className="mt-12 text-2xl font-bold font-sans leading-tight max-w-lg">
                Only the <span className="bg-accent px-2 text-foreground">{deck.length} tied films</span> remain. <br/>
                Every swipe now carries double the weight.
              </p>

              <motion.label 
                whileHover={{ scale: 1.02 }}
                className="mt-16 flex cursor-pointer items-center gap-6 brutal-border bg-card px-8 py-6 text-2xl font-black brutal-shadow hover:brutal-shadow-lg transition-all active:translate-y-1"
              >
                <div className="relative h-10 w-10 shrink-0">
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
                    {readyChecked && <Hand className="h-6 w-6 text-success-foreground" />}
                  </div>
                </div>
                <span className="flex items-center gap-4 text-foreground uppercase tracking-tight">
                  <EyeOff className="h-8 w-8" />
                  I&apos;m alone with the device
                </span>
              </motion.label>

              <button
                onClick={() => setStage("voting")}
                disabled={!readyChecked}
                className="group mt-12 inline-flex items-center gap-4 brutal-border bg-primary px-16 py-6 text-3xl font-black uppercase text-primary-foreground transition-all disabled:opacity-20 brutal-shadow hover:brutal-shadow-lg enabled:hover:-translate-y-2 enabled:active:translate-y-1"
              >
                Begin Tie-Break
                <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
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
                participantLabel={`${participantLabel} · FINAL ROUND`}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
