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
        className="relative w-full max-w-2xl rounded-t-3xl border border-border bg-card p-5 pb-8 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "sheet-in 220ms ease-out" }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/40" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl tracking-tight">{movie.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Viewer reviews · {reviews.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border p-2 text-muted-foreground transition hover:text-foreground"
            aria-label="Close reviews"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-5 max-h-[60svh] space-y-3 overflow-y-auto pr-1">
          {reviews.map((r) => {
            const total = (likes[r.id] ?? 0) + r.likes
            const isLiked = liked[r.id]
            return (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-background/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {r.avatar}
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{r.author}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
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
                      "flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs transition",
                      isLiked ? "border-accent/50 text-accent" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-accent")} />
                    {total}
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{r.body}</p>
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
