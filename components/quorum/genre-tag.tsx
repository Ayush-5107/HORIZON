import { GENRE_COLORS } from "@/lib/movies"
import { cn } from "@/lib/utils"

export function GenreTag({
  genre,
  className,
}: {
  genre: string
  className?: string
}) {
  const color = GENRE_COLORS[genre] ?? "oklch(0.7 0.05 280)"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        borderColor: `${color.replace(")", " / 0.4)")}`,
        color: color,
        backgroundColor: `${color.replace(")", " / 0.08)")}`,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {genre}
    </span>
  )
}
