import { cn } from "@/lib/utils"

type Props = {
  className?: string
  size?: number
  withWordmark?: boolean
}

export function BrandMark({ className, size = 32, withWordmark = true }: Props) {
  return (
    <div className={cn("flex items-center gap-4 group cursor-pointer", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Shadow layer */}
        <div 
          className="absolute inset-0 bg-foreground brutal-border translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"
        />
        {/* Main layer */}
        <div 
          className="absolute inset-0 bg-primary brutal-border flex items-center justify-center transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
        >
          <span className="font-pixel text-primary-foreground text-2xl leading-none mt-1 font-black">Q</span>
        </div>
      </div>
      {withWordmark && (
        <span className="font-sans font-black text-3xl uppercase tracking-tighter text-foreground mt-1 transition-colors group-hover:text-primary">
          QUORUM
        </span>
      )}
    </div>
  )
}
