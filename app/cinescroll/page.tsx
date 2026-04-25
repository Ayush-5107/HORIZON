"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ReelItem } from "@/components/quorum/reel-item"
import { ReviewSheet } from "@/components/quorum/review-sheet"
import { MOVIES, type Movie } from "@/lib/movies"
import { recordReel } from "@/lib/store"
import { cn } from "@/lib/utils"

type Tab = "for-you" | "following"

// Deterministic shuffle so SSR/CSR match.
function rotate<T>(arr: T[], by: number) {
  const i = by % arr.length
  return [...arr.slice(i), ...arr.slice(0, i)]
}

export default function ReelsPage() {
  const [tab, setTab] = useState<Tab>("for-you")
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const reels = useMemo(() => {
    // "Following" tab presents a slightly different ordering and a
    // smaller curated subset to imply a social graph.
    if (tab === "following") {
      return rotate(MOVIES.filter((m) => m.rating >= 7.7), 2)
    }
    return MOVIES
  }, [tab])

  // Track which reel is in view → mark as "viewed" and update active for header.
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    observerRef.current?.disconnect()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const id = (e.target as HTMLElement).dataset.movieId
            if (id) recordReel("viewed", id)
          }
        }
      },
      { root, threshold: [0.6] },
    )
    root.querySelectorAll("[data-movie-id]").forEach((el) => io.observe(el))
    observerRef.current = io
    return () => io.disconnect()
  }, [reels])

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-background text-foreground">
      {/* top nav */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-5 sm:px-6">
        <Link
          href="/"
          aria-label="Back home"
          className="flex h-10 w-10 items-center justify-center brutal-border bg-card text-foreground brutal-shadow-sm hover:brutal-shadow transition-all hover:-translate-y-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div
          role="tablist"
          aria-label="Reel feed"
          className="flex brutal-border bg-card p-1 brutal-shadow-sm"
        >
          {(
            [
              { id: "for-you", label: "For You" },
              { id: "following", label: "Following" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-1.5 font-pixel text-[10px] font-black uppercase tracking-widest transition-all brutal-border",
                tab === t.id
                  ? "bg-primary text-primary-foreground brutal-shadow translate-y-[-2px]"
                  : "bg-transparent text-foreground/80 hover:bg-muted border-transparent"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Link
          href="/session"
          className="brutal-border bg-success px-4 py-2 font-pixel text-[10px] font-black uppercase tracking-widest text-success-foreground brutal-shadow-sm hover:brutal-shadow hover:-translate-y-1 transition-all"
        >
          Start
        </Link>
      </header>

      {/* feed */}
      <div
        ref={containerRef}
        className="scrollbar-hide h-full w-full snap-y snap-mandatory overflow-y-auto"
      >
        {reels.map((m) => (
          <div key={`${tab}-${m.id}`} data-movie-id={m.id}>
            <ReelItem movie={m} onOpenReviews={setActiveMovie} />
          </div>
        ))}
      </div>

      {/* hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <span className="brutal-border bg-foreground text-background px-4 py-2 font-pixel text-[10px] font-black uppercase tracking-widest brutal-shadow-sm">
          Scroll to explore · tap to react
        </span>
      </div>

      <ReviewSheet movie={activeMovie} onClose={() => setActiveMovie(null)} />
    </main>
  )
}
