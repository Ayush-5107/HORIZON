"use client"

import { useEffect, useState } from "react"
import { Heart, Star, X } from "lucide-react"
import { type Movie } from "@/lib/movies"
import { reviewsForMovie } from "@/lib/reviews"
import { cn } from "@/lib/utils"

type Props = {
  movie: Movie | null
  onClose: () => void
}

export function ReviewSheet({ movie, onClose }: Props) {
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  // Reset reaction state when the active movie changes.
  useEffect(() => {
    setLikes({})
    setLiked({})
  }, [movie?.id])

  if (!movie) return null
  const reviews = reviewsForMovie(movie.id)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Reviews for ${movie.title}`}
    >
      <div
        className="relative w-full max-w-2xl border-t-4 border-l-4 border-r-4 border-foreground bg-card p-5 pb-8 brutal-shadow-[0_-8px_0px_var(--foreground)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "sheet-in 220ms ease-out" }}
      >
        <div className="mx-auto mb-6 h-1.5 w-12 bg-foreground" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-sans text-3xl font-black uppercase tracking-tighter leading-none">{movie.title}</h3>
            <p className="mt-2 font-pixel text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Viewer reviews · {reviews.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center brutal-border bg-background transition-all hover:bg-destructive hover:text-destructive-foreground hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow"
            aria-label="Close reviews"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-5 max-h-[60svh] space-y-3 overflow-y-auto pr-1">
          {reviews.map((r) => {
            const total = (likes[r.id] ?? 0) + r.likes
            const isLiked = liked[r.id]
            return (
              <li
                key={r.id}
                className="brutal-border bg-background p-4 brutal-shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center brutal-border bg-primary font-pixel text-sm font-black text-primary-foreground transform -rotate-6">
                      {r.avatar}
                    </span>
                    <div className="leading-none">
                      <p className="font-sans text-lg font-black uppercase tracking-tight">{r.author}</p>
                      <p className="mt-1 flex items-center gap-1.5 font-pixel text-[10px] font-black text-muted-foreground">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        {r.rating}/10
                      </p>
                    </div>
                  </div>
                    <button
                      onClick={() => {
                        setLiked((s) => ({ ...s, [r.id]: !s[r.id] }))
                        setLikes((s) => ({ ...s, [r.id]: (s[r.id] ?? 0) + (isLiked ? -1 : 1) }))
                      }}
                      className={cn(
                        "flex items-center gap-2 brutal-border px-3 py-1.5 font-pixel text-[10px] font-black transition-all hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow active:translate-y-0 active:brutal-shadow-none",
                        isLiked ? "bg-accent text-accent-foreground" : "bg-card text-foreground",
                      )}
                    >
                      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                      {total}
                    </button>
                  </div>
                  <p className="mt-4 text-sm font-bold leading-relaxed text-foreground/90 border-l-4 border-primary pl-4">{r.body}</p>
              </li>
            )
          })}
        </ul>
      </div>

      <style jsx>{`
        @keyframes sheet-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
