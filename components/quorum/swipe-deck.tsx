"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, Star, ThumbsDown, ThumbsUp } from "lucide-react"
import { Poster } from "@/components/quorum/poster"
import { type Movie } from "@/lib/movies"
import { cn } from "@/lib/utils"
import type { VoteValue } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  movies: Movie[]
  onComplete: (votes: Record<string, VoteValue>) => void
  participantLabel: string
}

const THRESHOLD_X = 110
const THRESHOLD_Y = 130
const VELOCITY_X = 0.6 
const VELOCITY_Y = 0.7

export function SwipeDeck({ movies, onComplete, participantLabel }: Props) {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState<VoteValue | null>(null)
  const votesRef = useRef<Record<string, VoteValue>>({})

  const current = movies[index]
  const next = movies[index + 1]
  const after = movies[index + 2]
  const done = index >= movies.length

  const commit = useCallback(
    (movieId: string, value: VoteValue) => {
      votesRef.current = { ...votesRef.current, [movieId]: value }
      setFeedback(value)
      window.setTimeout(() => setFeedback(null), 450)
      setIndex((i) => i + 1)
    },
    [],
  )

  useEffect(() => {
    if (done) {
      const t = window.setTimeout(() => onComplete(votesRef.current), 320)
      return () => window.clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center pt-8 pb-12 bg-background">
      {/* progress */}
      <div className="mb-10 w-full max-w-md px-4">
        <div className="flex items-center justify-between text-sm brutal-border bg-secondary px-4 py-2 mb-3 brutal-shadow-sm font-black">
          <span className="font-pixel uppercase tracking-widest text-foreground">
            {participantLabel}
          </span>
          <span className="font-pixel text-foreground">
            {Math.min(index + 1, movies.length)} / {movies.length}
          </span>
        </div>
        <div className="h-6 w-full border-4 border-foreground bg-card brutal-shadow-sm overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${(index / movies.length) * 100}%` }}
            className="h-full bg-primary border-r-4 border-foreground"
          />
        </div>
      </div>

      {/* deck */}
      <div className="relative mx-auto h-[500px] w-[min(92vw,360px)] sm:h-[580px]">
        <AnimatePresence mode="popLayout">
          {after && (
            <StaticCard key={`bg-${after.id}`} movie={after} depth={2} />
          )}
          {next && (
            <StaticCard key={`mid-${next.id}`} movie={next} depth={1} />
          )}
          {current && (
            <DraggableCard
              key={`top-${current.id}`}
              movie={current}
              onDecision={(v) => commit(current.id, v)}
            />
          )}
        </AnimatePresence>

        {done && (
          <motion.div 
            initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center brutal-border bg-secondary brutal-shadow-lg text-center p-8"
          >
            <div>
              <SparkleIcon className="mx-auto mb-6 h-16 w-16 text-primary" />
              <p className="font-pixel text-3xl uppercase font-black text-foreground leading-none">Deck complete · tallying scores…</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* manual buttons */}
      <div className="mt-12 flex items-center gap-8">
        <ManualButton
          label="No"
          onClick={() => current && commit(current.id, "no")}
          color="bg-destructive"
        >
          <ThumbsDown className="h-8 w-8 text-destructive-foreground" />
        </ManualButton>
        <ManualButton
          label="Love"
          big
          onClick={() => current && commit(current.id, "love")}
          color="bg-primary"
        >
          <Heart className="h-10 w-10 text-primary-foreground" />
        </ManualButton>
        <ManualButton
          label="Yes"
          onClick={() => current && commit(current.id, "yes")}
          color="bg-success"
        >
          <ThumbsUp className="h-8 w-8 text-success-foreground" />
        </ManualButton>
      </div>

      <p className="mt-10 text-center font-pixel text-lg uppercase text-foreground bg-accent brutal-border px-6 py-3 brutal-shadow-sm inline-block font-black tracking-widest">
        Swipe right for YES · left for NO · up for LOVE
      </p>

      {/* feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1.2, opacity: 1, rotate: 5 }}
            exit={{ scale: 1.5, opacity: 0, rotate: 15 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className={cn(
                "brutal-border px-12 py-8 font-pixel text-8xl uppercase font-black tracking-[0.2em] brutal-shadow-lg transform -rotate-2",
                feedback === "yes" && "bg-success text-success-foreground",
                feedback === "no" && "bg-destructive text-destructive-foreground",
                feedback === "love" && "bg-primary text-primary-foreground",
              )}
            >
              {feedback}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StaticCard({ movie, depth }: { movie: Movie; depth: 1 | 2 }) {
  const scale = 1 - depth * 0.05
  const ty = depth * 20
  return (
    <motion.div
      initial={{ opacity: 0, scale: scale - 0.1 }}
      animate={{ opacity: 1, scale: scale, y: ty }}
      className="absolute inset-0 select-none pointer-events-none"
      style={{ zIndex: 10 - depth }}
    >
      <CardChrome movie={movie} dragX={0} dragY={0} />
    </motion.div>
  )
}

function DraggableCard({
  movie,
  onDecision,
}: {
  movie: Movie
  onDecision: (v: VoteValue) => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const startRef = useRef({ x: 0, y: 0, t: 0 })
  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const draggingRef = useRef(false)
  const decidedRef = useRef(false)
  const [drag, setDrag] = useState({ x: 0, y: 0, animating: false })

  const apply = useCallback((x: number, y: number, animate: boolean) => {
    const el = ref.current
    if (!el) return
    const rotate = (x / 12).toFixed(2)
    el.style.transition = animate
      ? "transform 450ms cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      : "none"
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (decidedRef.current) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    draggingRef.current = true
    const t = performance.now()
    startRef.current = { x: e.clientX, y: e.clientY, t }
    lastRef.current = { x: e.clientX, y: e.clientY, t }
    setDrag((d) => ({ ...d, animating: false }))
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || decidedRef.current) return
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    lastRef.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    apply(dx, dy, false)
    setDrag({ x: dx, y: dy, animating: false })
  }

  const finish = (decision: VoteValue | null, dx: number, dy: number) => {
    const el = ref.current
    if (!el) return

    if (decision) {
      decidedRef.current = true
      const w = window.innerWidth
      const h = window.innerHeight
      let toX = dx
      let toY = dy
      if (decision === "yes") toX = w * 1.5
      if (decision === "no") toX = -w * 1.5
      if (decision === "love") toY = -h * 1.5
      const rotate = (toX / 10).toFixed(2)
      el.style.transition = "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)"
      el.style.transform = `translate3d(${toX}px, ${toY}px, 0) rotate(${rotate}deg)`
      setDrag({ x: toX, y: toY, animating: true })
      window.setTimeout(() => onDecision(decision), 250)
    } else {
      apply(0, 0, true)
      setDrag({ x: 0, y: 0, animating: true })
    }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || decidedRef.current) return
    draggingRef.current = false
    const dx = e.clientX - startRef.current.x
    const dy = e.clientY - startRef.current.y
    const dt = Math.max(1, performance.now() - lastRef.current.t)
    const vx = (e.clientX - lastRef.current.x) / dt
    const vy = (e.clientY - lastRef.current.y) / dt

    if (dy < -THRESHOLD_Y || vy < -VELOCITY_Y) return finish("love", dx, dy)
    if (dx > THRESHOLD_X || vx > VELOCITY_X) return finish("yes", dx, dy)
    if (dx < -THRESHOLD_X || vx < -VELOCITY_X) return finish("no", dx, dy)
    finish(null, 0, 0)
  }

  const yesOpacity = clamp((drag.x - 40) / 120)
  const noOpacity = clamp((-drag.x - 40) / 120)
  const loveOpacity = clamp((-drag.y - 40) / 120)

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
      style={{ zIndex: 20, transform: "translate3d(0,0,0)" }}
    >
      <CardChrome
        movie={movie}
        dragX={drag.x}
        dragY={drag.y}
        yesOpacity={yesOpacity}
        noOpacity={noOpacity}
        loveOpacity={loveOpacity}
      />
    </div>
  )
}

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n))
}

function CardChrome({
  movie,
  dragX,
  dragY,
  yesOpacity = 0,
  noOpacity = 0,
  loveOpacity = 0,
}: {
  movie: Movie
  dragX: number
  dragY: number
  yesOpacity?: number
  noOpacity?: number
  loveOpacity?: number
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden brutal-border bg-card brutal-shadow-lg"
      data-dx={dragX}
      data-dy={dragY}
    >
      <Poster movie={movie} className="h-full w-full brutal-border-0" />

      {/* Decision Overlays */}
      <div className="pointer-events-none absolute inset-0 flex transition-opacity duration-200">
        <div
          style={{ opacity: yesOpacity }}
          className="absolute inset-0 bg-success/60 flex items-center justify-center"
        >
          <div className="brutal-border bg-foreground p-6 rotate-12">
            <ThumbsUp className="h-24 w-24 text-success" />
          </div>
        </div>
        <div
          style={{ opacity: noOpacity }}
          className="absolute inset-0 bg-destructive/60 flex items-center justify-center"
        >
          <div className="brutal-border bg-foreground p-6 -rotate-12">
            <ThumbsDown className="h-24 w-24 text-destructive" />
          </div>
        </div>
        <div
          style={{ opacity: loveOpacity }}
          className="absolute inset-0 bg-primary/60 flex items-center justify-center"
        >
          <div className="brutal-border bg-foreground p-8 scale-110">
            <Heart className="h-32 w-32 text-primary fill-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ManualButton({
  children,
  label,
  onClick,
  color,
  big,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  color: string
  big?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center brutal-border brutal-shadow hover:brutal-shadow-hover active:brutal-shadow-active transition-all",
        big ? "h-24 w-24" : "h-16 w-16",
        color,
      )}
    >
      {children}
    </button>
  )
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Star className="h-full w-full fill-current" />
      </motion.div>
    </div>
  )
}
