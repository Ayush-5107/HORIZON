"use client"

import Link from "next/link"
import { ArrowRight, Film, Sparkles, Users, Vote, X, History } from "lucide-react"
import { BrandMark } from "@/components/quorum/brand-mark"
import { MOVIES } from "@/lib/movies"
import { Poster } from "@/components/quorum/poster"
import { motion } from "framer-motion"

export default function HomePage() {
  const featured = [MOVIES[6], MOVIES[4], MOVIES[0]]

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
      <section className="relative z-10 border-b-4 border-foreground bg-background">
        <div className="mx-auto grid w-full max-w-7xl gap-0 lg:grid-cols-2 divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-foreground border-x-4 border-foreground my-6 sm:my-12 brutal-shadow bg-card overflow-hidden">
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-8 sm:p-16 bg-secondary flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(var(--foreground) 2px, transparent 2px)", backgroundSize: "24px 24px" }} />
            
            <div className="relative z-10 inline-flex items-center gap-3 brutal-border bg-accent px-4 py-2 text-xs font-black uppercase brutal-shadow-sm mb-10 w-fit">
              <Sparkles className="h-4 w-4" />
              <span>Version 1.0.4 — Build Stable</span>
            </div>

            <h1 className="relative z-10 text-balance font-sans text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter font-black">
              GROUP <br/> DECISION <br/> <span className="bg-primary text-primary-foreground px-4 py-1 mt-2 inline-block transform -rotate-1 shadow-[8px_8px_0px_var(--foreground)]">AUTOMATED.</span>
            </h1>

            <p className="relative z-10 mt-10 max-w-xl text-pretty text-2xl font-black font-sans leading-tight">
              QUORUM SOLVES THE &quot;WHAT SHOULD WE WATCH?&quot; DILEMMA THROUGH BLIND-VOTING AND WEIGHTED CONSENSUS.
            </p>

            <div className="relative z-10 mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-4 brutal-border bg-primary px-8 py-5 text-2xl font-black uppercase text-primary-foreground brutal-shadow-hover active:brutal-shadow-active transition-all"
              >
                Launch Session
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>

          {/* poster collage */}
          <motion.div 
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-[500px] lg:h-auto w-full bg-accent p-12 overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, var(--foreground) 1px, transparent 1px), linear-gradient(-45deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            
            <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="brutal-border bg-card p-2 brutal-shadow-sm rotate-3">
                <Poster movie={featured[0]} className="w-full border-0 shadow-none" />
              </div>
              <div className="brutal-border bg-card p-2 brutal-shadow-sm -rotate-2 translate-y-8">
                <Poster movie={featured[1]} className="w-full border-0 shadow-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Descriptive Analysis Sections */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 space-y-32">
        
        {/* The Problem */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              THE <span className="text-destructive">FRICTION</span> OF CHOICE
            </h2>
            <div className="brutal-border bg-card p-8 brutal-shadow space-y-6">
              <p className="text-xl font-bold leading-tight">
                Traditional movie nights are plagued by decision paralysis. Individual preferences clash, dominant voices override the quiet ones, and hours are wasted scrolling through endless thumbnails.
              </p>
              <ul className="space-y-3 font-pixel text-lg uppercase font-black">
                <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> The Infinite Scroll Trap</li>
                <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> Social Pressure to Conform</li>
                <li className="flex items-center gap-3"><X className="text-destructive h-5 w-5" /> Repetitive Arguments</li>
              </ul>
            </div>
          </div>
          <div className="brutal-border bg-secondary p-12 brutal-shadow rotate-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl font-black text-secondary-foreground mb-4">45%</div>
              <p className="font-pixel text-xl uppercase font-black">Average time spent <br/> just choosing the movie</p>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 brutal-border bg-primary p-12 brutal-shadow -rotate-1 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <Sparkles className="h-20 w-20 mx-auto mb-6" />
              <div className="text-4xl font-black uppercase tracking-tighter">WEIGHTED <br/> CONSENSUS</div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">
              THE <span className="text-success">QUORUM</span> ENGINE
            </h2>
            <div className="brutal-border bg-card p-8 brutal-shadow space-y-6">
              <p className="text-xl font-bold leading-tight">
                Quorum transforms the group dynamic. By utilizing a shared device or synced session, every participant votes in private. Our engine then computes a weighted result where &quot;Love&quot; carries triple the weight of a &quot;Yes&quot;.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="brutal-border bg-background p-4 text-center">
                  <div className="text-2xl font-black">+1</div>
                  <div className="font-pixel text-xs uppercase font-black">Yes</div>
                </div>
                <div className="brutal-border bg-primary p-4 text-center text-primary-foreground">
                  <div className="text-2xl font-black">+3</div>
                  <div className="font-pixel text-xs uppercase font-black">Love</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div>
          <div className="mb-16 flex items-end justify-between border-b-4 border-foreground pb-6">
            <h2 className="font-sans text-5xl sm:text-7xl uppercase tracking-tighter leading-none font-black">
              CORE FEATURES
            </h2>
            <span className="hidden font-pixel text-2xl uppercase tracking-widest text-primary font-bold sm:block">
              FULL SUITE
            </span>
          </div>

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Step
              n="01"
              icon={<Film className="h-8 w-8" />}
              title="CINEREELS"
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
