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
    <article className="relative h-[100svh] w-full snap-start snap-always md:flex md:items-center md:justify-center md:gap-8 xl:gap-16">
      {/* Mobile background poster */}
      <div className="absolute inset-0 md:hidden">
        <Poster movie={movie} className="h-full w-full rounded-none" />
      </div>

      {/* Main Wrapper */}
      <div className="relative z-10 flex h-full w-full pointer-events-none md:static md:w-auto md:max-w-6xl md:items-center md:justify-center md:gap-8 xl:gap-16">
        
        {/* left: meta */}
        <div className="flex flex-1 flex-col justify-end px-5 pb-28 pt-24 sm:px-10 sm:pb-16 pointer-events-auto md:h-auto md:w-[320px] md:flex-none md:justify-center md:p-0">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <GenreTag genre={movie.genre} />
              <span className="inline-flex items-center gap-1 brutal-border bg-background px-3 py-1 font-pixel text-[10px] font-black uppercase text-foreground brutal-shadow-sm">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {movie.rating.toFixed(1)}
              </span>
              <span className="brutal-border bg-background px-3 py-1 font-pixel text-[10px] font-black uppercase text-foreground brutal-shadow-sm">
                {formatRuntime(movie.runtime)}
              </span>
              <span className="brutal-border bg-background px-3 py-1 font-pixel text-[10px] font-black uppercase text-foreground brutal-shadow-sm">
                {movie.year}
              </span>
            </div>

            <h2 className="mt-4 text-balance font-sans text-5xl font-black uppercase tracking-tighter leading-none sm:text-6xl text-background drop-shadow-md md:text-foreground md:drop-shadow-none">
              {movie.title}
            </h2>

            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-background font-bold drop-shadow-md sm:text-base border-l-4 border-primary pl-4 md:text-foreground md:drop-shadow-none md:border-foreground">
              {movie.synopsis}
            </p>

            <p className="mt-4 font-pixel text-[10px] font-black uppercase text-background drop-shadow-md md:text-foreground md:drop-shadow-none">
              <span className="text-primary">{formatCount(movie.socialProof)}</span> people liked this
              {movie.director ? <> · dir. {movie.director}</> : null}
            </p>
          </div>
        </div>

        {/* center: desktop poster */}
        <div className="hidden md:block relative h-[80svh] lg:h-[85svh] aspect-[9/16] shrink-0 pointer-events-auto transition-transform hover:-translate-y-2 group">
          <Poster movie={movie} showMeta={false} className="h-full w-full brutal-shadow-xl" />
        </div>

        {/* right: action rail */}
        <div className="flex w-16 flex-col items-center justify-end gap-5 pb-28 pr-3 sm:w-20 sm:pb-16 sm:pr-6 pointer-events-auto md:h-auto md:w-24 md:items-start md:justify-center md:p-0 md:gap-6">
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
          "flex h-12 w-12 items-center justify-center brutal-border transition-all active:translate-y-1 hover:-translate-y-1 hover:brutal-shadow brutal-shadow-sm",
          active ? `bg-foreground text-background` : "bg-card text-foreground"
        )}
      >
        {children}
      </span>
      <span className={cn(
        "font-pixel text-[10px] font-black uppercase tracking-widest",
        active ? activeClass : "text-foreground drop-shadow-md"
      )}>
        {label}
      </span>
    </button>
  )
}
