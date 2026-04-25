import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/movies"
import { toggleWatchlist, useStore } from "@/lib/store"
import { Heart } from "lucide-react"

type Props = {
  movie: Movie
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

export function Poster({ movie, className, width = 600, height = 900 }: Props) {
  const user = useStore((s) => s.user)
  const isWatched = user?.watchlist.includes(movie.id)

  const src = movie.posterQuery.startsWith("http") 
    ? movie.posterQuery 
    : `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(movie.posterQuery)}`

  return (
    <div className={cn("group relative overflow-hidden brutal-border bg-card brutal-shadow transition-all duration-300", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "/placeholder.svg"}
        alt={`${movie.title} poster`}
        className="h-full w-full object-cover pixel-dither transition-transform duration-500 group-hover:scale-110"
        draggable={false}
      />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Watchlist Toggle */}
      {user && (
        <button 
          onClick={(e) => {
            e.stopPropagation()
            toggleWatchlist(movie.id)
          }}
          className={cn(
            "absolute top-4 right-4 z-10 h-10 w-10 brutal-border flex items-center justify-center transition-all brutal-shadow-sm hover:scale-110 active:scale-95",
            isWatched ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
          )}
        >
          <Heart className={cn("h-6 w-6", isWatched && "fill-current")} />
        </button>
      )}

      {/* Title Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-foreground p-4 border-t-4 border-foreground transform transition-transform duration-300 group-hover:bg-primary">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-pixel text-background text-xl leading-none uppercase truncate font-black group-hover:text-primary-foreground">
            {movie.title}
          </h3>
          <span className="font-pixel text-background text-xs opacity-80 group-hover:text-primary-foreground group-hover:opacity-100">
            {movie.year}
          </span>
        </div>
        <p className="font-pixel text-background text-xs uppercase mt-1 opacity-60 group-hover:text-primary-foreground group-hover:opacity-100">
          {movie.genre}
        </p>
      </div>
    </div>
  )
}
