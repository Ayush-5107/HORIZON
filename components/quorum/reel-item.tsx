"use client"

import { useState } from "react"
import { Bookmark, Heart, MessageCircle, Share2, Star, ThumbsDown } from "lucide-react"
import { Poster } from "@/components/quorum/poster"
import { GenreTag } from "@/components/quorum/genre-tag"
import { type Movie } from "@/lib/movies"
import { recordReel, useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

type Props = {
  movie: Movie
  onOpenReviews: (movie: Movie) => void
}

function formatRuntime(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h ${m}m`
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

export function ReelItem({ movie, onOpenReviews }: Props) {
  const liked = useStore((s) => s.reels.liked.includes(movie.id))
  const skipped = useStore((s) => s.reels.skipped.includes(movie.id))
  const saved = useStore((s) => s.reels.saved.includes(movie.id))
  const [shared, setShared] = useState(false)

  return (
    <article className="relative h-[100svh] w-full snap-start snap-always">
      {/* poster fills */}
      <div className="absolute inset-0">
        <Poster movie={movie} className="h-full w-full rounded-none" />
      </div>

      {/* content overlay */}
      <div className="relative z-10 flex h-full w-full">
        {/* left: meta */}
        <div className="flex flex-1 flex-col justify-end px-5 pb-28 pt-24 sm:px-10 sm:pb-16">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <GenreTag genre={movie.genre} />
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-xs text-foreground/90 backdrop-blur">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {movie.rating.toFixed(1)}
              </span>
              <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-xs text-foreground/90 backdrop-blur">
                {formatRuntime(movie.runtime)}
              </span>
              <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-xs text-foreground/90 backdrop-blur">
                {movie.year}
              </span>
            </div>

            <h2 className="mt-4 text-balance font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {movie.title}
            </h2>

            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-foreground/85 sm:text-base">
              {movie.synopsis}
            </p>

            <p className="mt-4 text-xs text-muted-foreground">
              <span className="text-primary">{formatCount(movie.socialProof)}</span> people liked this
              {movie.director ? <> · dir. {movie.director}</> : null}
            </p>
          </div>
        </div>

        {/* right: action rail */}
        <div className="flex w-16 flex-col items-center justify-end gap-5 pb-28 pr-3 sm:w-20 sm:pb-16 sm:pr-6">
          <ActionButton
            label="Like"
            active={liked}
            activeClass="text-accent"
            onClick={() => recordReel("liked", movie.id)}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-accent")} />
          </ActionButton>
          <ActionButton
            label="Skip"
            active={skipped}
            activeClass="text-muted-foreground"
            onClick={() => recordReel("skipped", movie.id)}
          >
            <ThumbsDown className="h-5 w-5" />
          </ActionButton>
          <ActionButton label="Reviews" onClick={() => onOpenReviews(movie)}>
            <MessageCircle className="h-5 w-5" />
          </ActionButton>
          <ActionButton
            label="Save"
            active={saved}
            activeClass="text-primary"
            onClick={() => recordReel("saved", movie.id)}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-primary")} />
          </ActionButton>
          <ActionButton
            label={shared ? "Copied" : "Share"}
            onClick={() => {
              setShared(true)
              setTimeout(() => setShared(false), 1500)
            }}
          >
            <Share2 className="h-5 w-5" />
          </ActionButton>
        </div>
      </div>
    </article>
  )
}

function ActionButton({
  children,
  label,
  active,
  activeClass,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  activeClass?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5"
      aria-label={label}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground backdrop-blur transition active:scale-95",
          active && activeClass,
          active && "border-current/40",
        )}
      >
        {children}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/80">
        {label}
      </span>
    </button>
  )
}
