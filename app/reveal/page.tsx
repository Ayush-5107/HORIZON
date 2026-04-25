"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BrandMark } from "@/components/quorum/brand-mark"
import { setState, tallyVotes, useStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

export default function RevealPage() {
  const router = useRouter()
  const phase = useStore((s) => s.phase)
  const votes = useStore((s) => s.votes)
  const moviePool = useStore((s) => s.moviePool)
  const repollVotes = useStore((s) => s.repollVotes)
  const tiedFromState = useStore((s) => s.tied)

  const isRepoll = phase === "repoll" || (tiedFromState.length > 0 && Object.keys(repollVotes).length > 0)

  const tally = useMemo(() => {
    if (isRepoll) return tallyVotes(repollVotes, tiedFromState)
    return tallyVotes(votes, moviePool)
  }, [isRepoll, votes, moviePool, repollVotes, tiedFromState])

  const [count, setCount] = useState(5)

  useEffect(() => {
    if (phase !== "reveal" && phase !== "repoll" && phase !== "debate") {
      router.replace("/")
    }
  }, [phase, router])

  useEffect(() => {
    if (count <= 0) {
      // Only proceed if we're still in a phase that should be revealing.
      // This prevents the infinite loop described in the stack trace.
      if (phase !== "reveal" && phase !== "repoll") return

      const winner = tally.tied.length > 1 && !isRepoll ? undefined : tally.ranked[0]?.movieId
      const tied = tally.tied
      if (tied.length > 1 && !isRepoll) {
        setState({ phase: "debate", tied })
        router.replace("/debate")
      } else {
        setState({ phase: "results", winner, tied: [] })
        router.replace("/results")
      }
      return
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, tally, isRepoll, router])

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 border-b-4 border-l-4 border-r-4 border-foreground bg-secondary px-8 py-3 brutal-shadow-sm z-50"
      >
        <BrandMark size={32} />
      </motion.div>

      <div className="relative flex flex-col items-center text-center px-4 w-full max-w-2xl">
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-pixel text-lg uppercase tracking-[0.2em] text-foreground bg-accent brutal-border px-6 py-2 brutal-shadow-sm font-black transform rotate-1"
        >
          {isRepoll ? "FINAL REVEAL" : "TALLYING BALLOTS"}
        </motion.p>

        <div className="mt-12 flex h-60 w-60 items-center justify-center relative">
          {/* Animated Background Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 brutal-border bg-card shadow-[8px_8px_0px_var(--foreground)]" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute h-[80%] w-[80%] brutal-border bg-primary opacity-50" 
          />
          <motion.div 
            animate={{ rotate: 180 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute h-[60%] w-[60%] brutal-border bg-secondary opacity-50" 
          />
          
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ scale: 2, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative z-10 font-sans font-black text-7xl text-foreground"
            >
              {count > 0 ? count : "!"}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 w-full text-pretty font-black text-xl uppercase leading-tight bg-card brutal-border p-6 brutal-shadow-sm"
        >
          Aggregating <span className="bg-primary text-primary-foreground px-2 py-0.5 inline-block transform -rotate-1">{Object.keys(isRepoll ? repollVotes : votes).length}</span>{" "}
          BALLOTS FOR{" "}
          <span className="bg-success text-success-foreground px-2 py-0.5 inline-block transform rotate-1">
            {(isRepoll ? tiedFromState : moviePool).length}
          </span>{" "}
          {isRepoll ? "TIED" : "CANDIDATE"} FILMS.
        </motion.div>
      </div>

      {/* Screen flash effect on each second */}
      <motion.div 
        key={`flash-${count}`}
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0 }}
        className="fixed inset-0 bg-white pointer-events-none z-40"
      />
    </main>
  )
}
