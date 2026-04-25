"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Film, Sparkles, Users, Vote, X, History } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { MOVIES } from "@/lib/movies"
import { Poster } from "@/components/quorum/poster"
import { AnimatePresence, motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      <div className="grain absolute inset-0" aria-hidden />

      {/* nav */}
      <header className="relative z-50 border-b-4 border-foreground bg-secondary">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between p-4 sm:px-8">
          <BrandMark size={32} />
          <nav className="flex items-center gap-4 text-sm font-black uppercase">
            <Link
              href="/login"
              className="px-4 py-2 transition-all hover:bg-white brutal-border brutal-shadow-sm font-pixel tracking-tighter"
            >
              Access Engine
            </Link>
            <Link
              href="/login"
              className="bg-primary brutal-border px-6 py-2 text-primary-foreground brutal-shadow-sm hover:brutal-shadow-hover transition-all font-black tracking-tighter"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-0 lg:grid-cols-2">
        {/* left content */}
        <div className="flex flex-col justify-center bg-background px-5 py-12 sm:px-10 lg:py-24 border-b-4 lg:border-b-0 lg:border-r-4 border-foreground">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex w-fit items-center gap-2 brutal-border bg-accent px-4 py-1.5 font-pixel text-xs font-black uppercase tracking-widest brutal-shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Version 1.0.4 — Build Stable</span>
            </div>

            <h1 className="relative z-10 text-balance font-sans text-5xl md:text-6xl uppercase leading-[0.95] tracking-tighter font-black">
              GROUP <br/> DECISION <br/> <span className="bg-primary text-primary-foreground px-4 py-1 mt-2 inline-block transform -rotate-1 brutal-shadow">AUTOMATED.</span>
            </h1>

            <p className="relative z-10 mt-8 max-w-xl text-pretty text-xl font-bold font-sans leading-tight opacity-80">
              QUORUM SOLVES THE &quot;WHAT SHOULD WE WATCH?&quot; DILEMMA THROUGH BLIND-VOTING AND WEIGHTED CONSENSUS.
            </p>

            <div className="relative z-10 mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-4 brutal-border bg-primary px-8 py-4 text-xl font-black uppercase text-primary-foreground brutal-shadow hover:translate-y-[-2px] transition-all"
              >
                Launch Session
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* poster collage */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[400px] lg:h-auto w-full bg-accent p-8 overflow-hidden flex items-center justify-center"
        >
          <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

          <AutoRollingPosterCollage />
        </motion.div>
      </section>

      {/* Descriptive Analysis Sections */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 space-y-32">
        
        {/* The Problem */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              THE <span className="text-destructive">FRICTION</span> OF CHOICE
            </h2>
            <div className="brutal-border bg-card p-8 brutal-shadow">
              <p className="text-xl font-bold leading-tight">
                Movie night usually ends in the &quot;Netflix Scroll&quot; — forty minutes of indecision followed by giving up. The problem isn't lack of choice; it's the social pressure of picking for the group.
              </p>
            </div>
            <ul className="space-y-3 font-pixel text-lg uppercase font-black">
              <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> The loudest person picks</li>
              <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> Someone hates the choice</li>
              <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> Rotation fatigue</li>
            </ul>
          </div>
          <div className="brutal-border bg-secondary p-8 brutal-shadow flex items-center justify-center min-h-[300px]">
            <div className="w-full max-w-sm">
              <svg
                viewBox="0 0 320 220"
                role="img"
                aria-label="Chaotic decision map"
                className="h-auto w-full brutal-border bg-background p-3 brutal-shadow-sm"
              >
                <rect x="10" y="10" width="80" height="30" fill="var(--primary)" stroke="var(--foreground)" strokeWidth="4" />
                <rect x="120" y="22" width="82" height="30" fill="var(--accent)" stroke="var(--foreground)" strokeWidth="4" />
                <rect x="228" y="10" width="82" height="30" fill="var(--destructive)" stroke="var(--foreground)" strokeWidth="4" />

                <path d="M50 45 L75 95" stroke="var(--foreground)" strokeWidth="4" />
                <path d="M162 54 L142 104" stroke="var(--foreground)" strokeWidth="4" />
                <path d="M268 44 L218 104" stroke="var(--foreground)" strokeWidth="4" />

                <circle cx="82" cy="110" r="20" fill="var(--secondary)" stroke="var(--foreground)" strokeWidth="4" />
                <circle cx="156" cy="116" r="20" fill="var(--warning)" stroke="var(--foreground)" strokeWidth="4" />
                <circle cx="224" cy="112" r="20" fill="var(--success)" stroke="var(--foreground)" strokeWidth="4" />

                <path d="M82 130 L158 165" stroke="var(--foreground)" strokeWidth="4" />
                <path d="M156 136 L158 165" stroke="var(--foreground)" strokeWidth="4" />
                <path d="M224 132 L158 165" stroke="var(--foreground)" strokeWidth="4" />

                <polygon points="158,190 180,165 158,142 136,165" fill="var(--foreground)" />
                <text x="158" y="171" textAnchor="middle" fill="var(--background)" fontFamily="var(--font-pixel)" fontSize="20" fontWeight="700">?</text>
              </svg>
              <p className="mt-5 text-center font-black text-2xl uppercase tracking-tighter">Decision Fatigue</p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 brutal-border bg-primary p-12 brutal-shadow flex items-center justify-center min-h-[300px]">
            <div className="text-center text-primary-foreground">
              <Vote className="h-20 w-20 mx-auto mb-4" />
              <p className="font-black text-3xl uppercase tracking-tighter">Automated Consensus</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              THE <span className="text-success">QUORUM</span> ENGINE
            </h2>
            <div className="brutal-border bg-card p-8 brutal-shadow">
              <p className="text-xl font-bold leading-tight">
                Quorum turns group decision-making into a stylized interactive game. Everyone votes privately on their own devices. The system then calculates a weighted result that maximizes group satisfaction while ensuring no one is left behind.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="brutal-border bg-background p-4 brutal-shadow-sm">
                <span className="block font-pixel text-2xl text-primary">+1</span>
                <span className="font-black text-xs uppercase">Standard Yes</span>
              </div>
              <div className="brutal-border bg-background p-4 brutal-shadow-sm">
                <span className="block font-pixel text-2xl text-secondary">+3</span>
                <span className="font-black text-xs uppercase">Weighted Love</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <div className="mb-12 flex items-end justify-between border-b-4 border-foreground pb-6">
            <h2 className="font-sans text-5xl sm:text-6xl uppercase tracking-tighter leading-none font-black">
              CORE FEATURES
            </h2>
            <span className="hidden font-pixel text-2xl uppercase tracking-widest text-primary font-bold sm:block">
              FULL SUITE
            </span>
          </div>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Step
              n="01"
              icon={<Film className="h-8 w-8" />}
              title="CINESCROLL"
              body="A gesture-driven discovery feed. Save favorites to your private watchlist before the session starts."
              color="bg-secondary"
              delay={0.1}
            />
            <Step
              n="02"
              icon={<Users className="h-8 w-8" />}
              title="GATHER"
              body="Initialize your group. Every player gets an anonymous profile to ensure honest voting without bias."
              color="bg-primary"
              delay={0.2}
            />
            <Step
              n="03"
              icon={<Vote className="h-8 w-8" />}
              title="VOTE"
              body="A high-stakes swipe deck. Decisions are hidden until the final reveal, building group tension."
              color="bg-accent"
              delay={0.3}
            />
            <Step
              n="04"
              icon={<History className="h-8 w-8" />}
              title="COMMAND"
              body="Review session history, track your consensus streaks, and manage your long-term watchlist."
              color="bg-success"
              delay={0.4}
            />
          </ol>
        </div>
      </section>
      
      {/* footer */}
      <footer className="relative z-10 border-t-4 border-foreground bg-secondary mt-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-5 py-12 sm:flex-row sm:items-center sm:px-8">
          <BrandMark size={40} withWordmark={true} />
          <div className="flex flex-wrap gap-8 font-sans font-bold uppercase tracking-tighter text-xl">
            <Link href="/login" className="hover:text-primary transition-colors">Launch</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          <div className="font-pixel text-lg uppercase tracking-widest bg-foreground text-background px-4 py-2 brutal-border brutal-shadow-sm">
            V 1.0.4 [STABLE]
          </div>
        </div>
      </footer>
    </main>
  )
}

function AutoRollingPosterCollage() {
  const posterPool = useMemo(() => {
    const picks = [12, 0, 4, 6, 9, 2, 14].map((idx) => MOVIES[idx]).filter(Boolean)
    return picks.length >= 4 ? picks : MOVIES
  }, [])
  const featuredIds = useMemo(() => new Set([MOVIES[0]?.id, MOVIES[4]?.id, MOVIES[12]?.id]), [])

  const [lead, setLead] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [glitchBurst, setGlitchBurst] = useState(0)
  const [flashBurst, setFlashBurst] = useState(0)
  const [featuredSpinKey, setFeaturedSpinKey] = useState(0)
  const [featuredMovieId, setFeaturedMovieId] = useState<string | null>(null)

  useEffect(() => {
    if (posterPool.length < 2) return
    const id = window.setInterval(() => {
      setLead((v) => {
        const next = (v + 1) % posterPool.length
        setCycle((c) => {
          const nextCycle = c + 1
          setGlitchBurst(nextCycle)
          setFlashBurst(nextCycle)

          if (nextCycle % 4 === 0) {
            const nextMovie = posterPool[next]
            if (nextMovie && featuredIds.has(nextMovie.id)) {
              setFeaturedMovieId(nextMovie.id)
              setFeaturedSpinKey(nextCycle)
            }
          }

          return nextCycle
        })
        return next
      })
    }, 1950)
    return () => window.clearInterval(id)
  }, [featuredIds, posterPool])

  const visible = useMemo(() => {
    return posterPool
      .map((movie, idx) => ({ movie, idx, diff: circularDiff(idx, lead, posterPool.length) }))
      .filter((item) => Math.abs(item.diff) <= 2)
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
  }, [lead, posterPool])

  const centerMovie = posterPool[lead]

  return (
    <div className="relative z-10 h-[400px] w-full max-w-xl [perspective:1500px]">
      <div className="absolute left-0 top-1 z-40 flex w-[340px] items-center gap-2 brutal-border bg-foreground px-4 py-1.5 font-pixel text-xs font-black uppercase tracking-[0.2em] text-background">
        <span>AUTO ROLLING CINESCROLL</span>
        <span className="h-2 w-2 bg-primary" />
        <span>LIVE SWAP // 3D MODE</span>
      </div>

      <div className="absolute inset-0 top-10 [transform-style:preserve-3d]">
        <AnimatePresence initial={false}>
          {visible.map((item) => {
            const depth = Math.abs(item.diff)
            const x = item.diff * 118
            const z = -depth * 180
            const rotateY = item.diff * -30
            const scale = 1 - depth * 0.16
            const y = 26 + depth * 10
            const opacity = 1 - depth * 0.2
            const blur = depth * 1.6

            return (
              <motion.div
                key={`${item.movie.id}-${cycle}`}
                initial={{ opacity: 0, x: x * 1.2, z: z - 80, rotateY: rotateY * 1.4, y: y + 18, scale: scale * 0.9 }}
                animate={{ opacity, x, z, rotateY, y, scale, filter: `blur(${blur}px)` }}
                exit={{ opacity: 0, x: x * 0.82, z: z - 40, rotateY: rotateY * 0.6, scale: scale * 0.92 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
                className="absolute left-1/2 top-1/2 w-[180px] -translate-x-1/2 -translate-y-1/2 sm:w-[210px]"
                style={{ zIndex: 100 - depth * 10 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotateZ: [0, item.diff * 1.6, 0] }}
                  transition={{ duration: 3.7 + depth * 0.65, repeat: Infinity, ease: "easeInOut" }}
                  className="brutal-border bg-card p-1.5 brutal-shadow-lg"
                >
                  <Poster
                    movie={item.movie}
                    fit="contain"
                    showMeta={false}
                    className="aspect-[2/3] w-full border-0 shadow-none bg-foreground"
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {flashBurst > 0 && (
          <motion.div
            key={`flash-${flashBurst}`}
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-50 bg-background"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {glitchBurst > 0 && (
          <motion.div
            key={`glitch-${glitchBurst}`}
            initial={{ opacity: 0.9, x: -14 }}
            animate={{ opacity: [0.95, 0.35, 0], x: [14, -10, 0] }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-50"
          >
            <div className="absolute inset-x-0 top-20 h-8 bg-primary/70 mix-blend-multiply" />
            <div className="absolute inset-x-0 top-40 h-10 bg-secondary/70 mix-blend-multiply" />
            <div className="absolute inset-x-0 top-60 h-6 bg-destructive/65 mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {featuredMovieId && centerMovie?.id === featuredMovieId && (
          <motion.div
            key={`featured-${featuredSpinKey}-${centerMovie.id}`}
            initial={{ opacity: 0, scale: 0.45, rotateY: -190, rotateZ: -20, y: 80 }}
            animate={{ opacity: [0, 1, 0], scale: [0.45, 1.12, 1.04], rotateY: [-190, 0, 0], rotateZ: [-20, 5, 0], y: [80, 0, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.08, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-[56%] z-[60] w-[215px] -translate-x-1/2 -translate-y-1/2 sm:w-[245px]"
          >
            <div className="brutal-border bg-primary p-1.5 brutal-shadow-lg">
              <Poster
                movie={centerMovie}
                fit="contain"
                showMeta={false}
                className="aspect-[2/3] w-full border-0 shadow-none bg-foreground"
              />
            </div>
            <div className="absolute -left-2 -top-2 brutal-border bg-foreground px-2 py-1 font-pixel text-[10px] font-black uppercase tracking-widest text-background">
              FEATURED
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function circularDiff(index: number, lead: number, length: number) {
  const raw = (index - lead + length) % length
  return raw > length / 2 ? raw - length : raw
}

function Step({
  n,
  icon,
  title,
  body,
  color,
  delay
}: {
  n: string
  icon: React.ReactNode
  title: string
  body: string
  color: string
  delay: number
}) {
  return (
    <motion.li 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className={`group relative brutal-border ${color} p-8 brutal-shadow transition-all hover:-translate-y-4 hover:translate-x-4 hover:brutal-shadow-lg`}
    >
      <div className="flex items-center justify-between border-b-4 border-foreground pb-6 mb-6">
        <span className="font-pixel text-4xl text-foreground font-black">{n}</span>
        <span className="flex h-16 w-16 items-center justify-center brutal-border bg-card text-foreground brutal-shadow-sm transform transition-transform group-hover:rotate-12">
          {icon}
        </span>
      </div>
      <h3 className="font-sans text-3xl uppercase tracking-tighter font-black leading-none">{title}</h3>
      <p className="mt-4 text-lg font-bold leading-tight">{body}</p>
    </motion.li>
  )
}
