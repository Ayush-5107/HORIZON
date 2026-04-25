"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Send, Swords, Timer } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { Poster } from "@/components/quorum/poster"
import { GenreTag } from "@/components/quorum/genre-tag"
import { getMovieById } from "@/lib/movies"
import {
  postChatMessage,
  reactToMessage,
  setState,
  useStore,
} from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const REACTIONS = ["🔥", "👀", "💯", "😂", "🍿"]

export default function DebatePage() {
  const router = useRouter()
  const tied = useStore((s) => s.tied)
  const participants = useStore((s) => s.participants)
  const chat = useStore((s) => s.chat)
  const phase = useStore((s) => s.phase)

  const [activeParticipant, setActiveParticipant] = useState(0)
  const [text, setText] = useState("")
  const [timer, setTimer] = useState<number>(120) // 2 minute soft timer
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (tied.length < 2 || phase === "idle") {
      router.replace("/")
    }
  }, [tied.length, phase, router])

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [chat.length])

  const tiedMovies = useMemo(
    () => tied.map((id) => getMovieById(id)).filter(Boolean) as NonNullable<ReturnType<typeof getMovieById>>[],
    [tied],
  )

  function send() {
    const v = text.trim()
    if (!v) return
    postChatMessage(`P${activeParticipant + 1}`, v)
    setText("")
  }

  function startRepoll() {
    setState({ phase: "repoll", currentParticipant: 0, repollVotes: {} })
    router.push("/repoll")
  }

  const topMessageId = useMemo(() => {
    if (chat.length === 0) return undefined
    let best = chat[0]
    let bestScore = Object.values(best.reactions).reduce((a, b) => a + b, 0)
    for (const m of chat) {
      const score = Object.values(m.reactions).reduce((a, b) => a + b, 0)
      if (score > bestScore) {
        best = m
        bestScore = score
      }
    }
    return bestScore > 0 ? best.id : undefined
  }, [chat])

  const mins = Math.floor(timer / 60)
  const secs = String(timer % 60).padStart(2, "0")

  return (
    <main className="relative min-h-dvh bg-background overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      <header className="relative z-50 flex w-full items-center justify-between px-5 py-4 sm:px-8 border-b-4 border-foreground bg-secondary">
        <BrandMark size={32} />
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-pixel text-lg uppercase tracking-widest text-foreground font-black bg-card brutal-border px-4 py-1.5 brutal-shadow-sm">
            <Swords className="h-5 w-5 text-primary" />
            DEBATE ROOM
          </div>
          <div className={cn(
            "font-pixel text-xl uppercase tracking-widest font-black brutal-border px-4 py-1.5 transition-colors",
            timer < 30 ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-foreground text-background"
          )}>
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              {timer > 0 ? `${mins}:${secs}` : "TIME UP"}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-5 pb-24 pt-8 sm:px-8 lg:grid-cols-[350px_1fr]">
        {/* left: tied movies */}
        <aside className="space-y-8">
          <div>
            <h2 className="font-sans text-5xl font-black uppercase tracking-tighter leading-none mb-3">
              THE <span className="bg-primary text-primary-foreground px-2 py-1 inline-block transform -rotate-2 border-2 border-foreground brutal-shadow-sm">STANDOFF</span>
            </h2>
            <p className="font-pixel text-[10px] font-black uppercase tracking-widest bg-foreground text-background inline-block px-3 py-1.5 brutal-shadow-sm">
              THE ROOM IS TIED. DEBATE OR RE-POLL.
            </p>
          </div>
          
          <ul className="space-y-4">
            {tiedMovies.map((m, i) => (
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={m.id}
                className="group flex items-center gap-4 brutal-border bg-card p-4 brutal-shadow transition-all hover:-translate-y-1"
              >
                <div className="h-28 w-20 shrink-0 overflow-hidden brutal-border brutal-shadow-sm">
                  <Poster movie={m} className="h-full w-full object-cover" showMeta={false} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-sans text-xl font-black uppercase tracking-tight">{m.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <GenreTag genre={m.genre} className="brutal-border text-[10px] !px-1.5 !py-0.5" />
                    <span className="font-pixel text-[10px] font-black uppercase bg-foreground text-background px-1.5 py-0.5">
                      ★ {m.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          <button
            onClick={startRepoll}
            className="group mt-8 flex w-full items-center justify-between brutal-border bg-primary px-8 py-6 text-2xl font-black uppercase text-primary-foreground transition-all hover:-translate-y-1 brutal-shadow hover:brutal-shadow-lg"
          >
            <span>Final Re-poll</span>
            <span className="flex h-12 w-12 items-center justify-center brutal-border bg-foreground text-background transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-6 w-6" />
            </span>
          </button>
        </aside>

        {/* right: chat */}
        <section className="flex flex-col brutal-border bg-card brutal-shadow-lg h-[70svh]">
          <header className="flex items-center justify-between border-b-4 border-foreground px-6 py-4 bg-secondary">
            <span className="text-lg font-black uppercase font-pixel tracking-tighter">
              BATTLE LOG
            </span>
            <div className="flex gap-2">
              {participants.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveParticipant(i)}
                  className={cn(
                    "brutal-border px-3 py-1 font-pixel text-sm font-black transition-all hover:-translate-y-1",
                    activeParticipant === i
                      ? "bg-foreground text-background brutal-shadow-sm translate-y-0"
                      : "bg-background text-foreground hover:brutal-shadow-sm",
                  )}
                >
                  P{i + 1}
                </button>
              ))}
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-8 overflow-y-auto px-8 py-10 bg-muted/20">
            <AnimatePresence initial={false}>
              {chat.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid h-full place-items-center text-center p-10"
                >
                  <div className="brutal-border bg-background p-12 brutal-shadow-lg transform -rotate-2 transition-transform hover:rotate-0">
                    <p className="font-sans text-6xl font-black uppercase leading-none tracking-tighter bg-foreground text-background inline-block px-4 py-2">
                      Silence in the court.
                    </p>
                    <p className="mt-8 text-2xl font-bold leading-tight border-l-8 border-primary pl-6">
                      Make a case for your pick. Stay anonymous — only participant IDs are shown.
                    </p>
                  </div>
                </motion.div>
              ) : (
                chat.map((m) => {
                  const mine = m.participant === `P${activeParticipant + 1}`
                  const isTop = m.id === topMessageId
                  return (
                    <motion.div
                      layout
                      initial={{ y: 20, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      key={m.id}
                      className={cn(
                        "flex flex-col gap-3 group",
                        mine ? "items-end" : "items-start",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {!mine && <span className="font-pixel text-sm font-black uppercase bg-foreground text-background px-3 py-1">P{m.participant.slice(1)}</span>}
                        {isTop && (
                          <span className="font-pixel text-sm font-black uppercase bg-primary text-primary-foreground px-3 py-1 brutal-border shadow-none">
                            🔥 TOP TAKE
                          </span>
                        )}
                        {mine && <span className="font-pixel text-sm font-black uppercase bg-foreground text-background px-3 py-1">YOU (P{m.participant.slice(1)})</span>}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] brutal-border px-8 py-5 text-2xl font-black leading-tight transition-all",
                          mine
                            ? "bg-primary text-primary-foreground brutal-shadow transform rotate-1"
                            : "bg-background brutal-shadow-sm transform -rotate-1 group-hover:rotate-0",
                          isTop && "ring-4 ring-secondary ring-offset-4 ring-offset-background",
                        )}
                      >
                        {m.text}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {REACTIONS.map((r) => {
                          const count = m.reactions[r] ?? 0
                          return (
                            <button
                              key={r}
                              onClick={() => reactToMessage(m.id, r)}
                              className={cn(
                                "brutal-border px-4 py-2 text-xl transition-all hover:-translate-y-1 hover:brutal-shadow-sm",
                                count > 0
                                  ? "bg-accent text-accent-foreground brutal-shadow-sm"
                                  : "bg-background text-foreground hover:bg-muted",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span>{r}</span>
                                {count > 0 && <span className="font-pixel text-sm font-black">{count}</span>}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          {/* composer */}
          <footer className="border-t-8 border-foreground p-8 bg-secondary">
            <div className="flex items-center gap-6 brutal-border bg-card px-6 py-4 focus-within:brutal-shadow-lg transition-all focus-within:-translate-y-1">
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 240))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder={`DROP YOUR CASE AS P${activeParticipant + 1}…`}
                className="flex-1 bg-transparent py-4 text-2xl font-black outline-none uppercase placeholder:text-muted-foreground/60 tracking-tight text-foreground"
                aria-label="Chat message"
              />
              <button
                onClick={send}
                disabled={!text.trim()}
                className="group flex h-16 w-16 items-center justify-center brutal-border bg-primary text-primary-foreground transition-all disabled:opacity-20 hover:-translate-y-1 brutal-shadow hover:brutal-shadow-lg"
              >
                <Send className="h-8 w-8 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
            <p className="mt-6 px-4 text-sm font-black uppercase opacity-60 tracking-widest text-center">
              SWITCH LABELS TO SIMULATE VOICES ON ONE DEVICE. 
            </p>
          </footer>
        </section>
      </div>
    </main>
  )
}
