"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { BrandMark } from "@/components/quorum/brand-mark"
import { logout, useStore, toggleWatchlist } from "@/lib/store"
import { MOVIES, getMovieById } from "@/lib/movies"
import { Poster } from "@/components/quorum/poster"
import { 
  LogOut, 
  Settings, 
  Bookmark, 
  History, 
  TrendingUp, 
  Calendar, 
  Users, 
  ChevronRight,
  Plus,
  Play,
  Heart,
  Film,
  Sparkles,
  Vote,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<"watchlist" | "history">("watchlist")

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) return null

  const watchlistMovies = user.watchlist.map(id => getMovieById(id)).filter(Boolean) as any[]
  const displayMovies = watchlistMovies.length > 0 ? watchlistMovies : MOVIES.slice(0, 4)

  return (
    <main className="relative min-h-dvh bg-background pb-20">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />

      {/* Web Header */}
      <header className="sticky top-0 z-50 brutal-border bg-secondary p-5 sm:px-10 border-x-0 border-t-0 flex items-center justify-between brutal-shadow-sm">
        <div className="flex items-center gap-6">
          <BrandMark size={40} withWordmark={false} />
          <div className="hidden sm:flex items-center gap-4">
            <div className="h-12 w-12 brutal-border bg-background p-1 brutal-shadow-sm overflow-hidden">
              <img src={user.avatar} alt={user.name} className="h-full w-full" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Command Center: {user.name}</h1>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => router.push("/reels")} className="font-pixel text-lg font-black uppercase hover:text-primary transition-colors flex items-center gap-2">
            <Play className="h-5 w-5" />
            Reels
          </button>
          <button onClick={() => router.push("/session")} className="font-pixel text-lg font-black uppercase hover:text-primary transition-colors flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session
          </button>
          <button 
            onClick={() => {
              logout()
              router.push("/")
            }}
            className="brutal-border bg-card px-4 py-2 text-sm font-black uppercase hover:-translate-y-1 brutal-shadow-sm hover:brutal-shadow-hover transition-all flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>

        {/* Mobile Logout Only */}
        <button 
          onClick={() => {
            logout()
            router.push("/")
          }}
          className="md:hidden h-12 w-12 brutal-border bg-card flex items-center justify-center brutal-shadow-sm"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Feature Hub / Quick Actions */}
            <section className="grid gap-6 lg:grid-cols-2">
              <Link
                href="/reels"
                className="group relative overflow-hidden brutal-border bg-accent p-8 brutal-shadow transition-all hover:translate-y-[-4px] hover:brutal-shadow-lg"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Film size={80} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Discovery Feed</h3>
                <p className="font-bold opacity-70 mb-6">Swipe through 100+ titles and build your personal interest profile.</p>
                <div className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 font-pixel text-sm uppercase font-black">
                  Launch CineReels <ArrowRight className="h-4 w-4" />
                </div>
              </Link>

              <Link
                href="/session"
                className="group relative overflow-hidden brutal-border bg-primary p-8 brutal-shadow transition-all hover:translate-y-[-4px] hover:brutal-shadow-lg"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Vote size={80} />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-primary-foreground">Start Session</h3>
                <p className="font-bold text-primary-foreground/70 mb-6">Gather the room, sync devices, and reach a weighted consensus.</p>
                <div className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-4 py-2 font-pixel text-sm uppercase font-black">
                  Open Engine <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </section>

            {/* Stats & Insights */}
            <section className="grid gap-6 sm:grid-cols-3">
              <div className="brutal-border bg-card p-6 brutal-shadow-sm">
                <span className="block font-pixel text-xs uppercase opacity-50 mb-2">Total Votes</span>
                <div className="text-4xl font-black">1,284</div>
              </div>
              <div className="brutal-border bg-card p-6 brutal-shadow-sm">
                <span className="block font-pixel text-xs uppercase opacity-50 mb-2">Watchlist Size</span>
                <div className="text-4xl font-black">{user.watchlist.length}</div>
              </div>
              <div className="brutal-border bg-card p-6 brutal-shadow-sm">
                <span className="block font-pixel text-xs uppercase opacity-50 mb-2">Consensus Rate</span>
                <div className="text-4xl font-black">94%</div>
              </div>
            </section>

            {/* Tab Switcher */}
            <div className="space-y-8">
              <div className="flex brutal-border bg-card p-1.5 brutal-shadow-sm max-w-md">
                <button 
                  onClick={() => setActiveTab("watchlist")}
                  className={cn(
                    "flex-1 py-3 text-lg font-black uppercase transition-all",
                    activeTab === "watchlist" ? "bg-primary text-primary-foreground brutal-border" : "hover:bg-muted"
                  )}
                >
                  Watchlist
                </button>
                <button 
                  onClick={() => setActiveTab("history")}
                  className={cn(
                    "flex-1 py-3 text-lg font-black uppercase transition-all",
                    activeTab === "history" ? "bg-secondary text-secondary-foreground brutal-border" : "hover:bg-muted"
                  )}
                >
                  History
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "watchlist" ? (
                  <motion.div 
                    key="watchlist"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="grid gap-6 sm:grid-cols-2"
                  >
                    {displayMovies.map((m, i) => (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={m.id}
                        className="group brutal-border bg-card p-4 brutal-shadow hover:brutal-shadow-lg transition-all"
                      >
                        <div className="relative aspect-[2/3] w-full brutal-border overflow-hidden bg-foreground mb-4">
                          <Poster movie={m} className="h-full w-full border-0 shadow-none" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight truncate mb-1">{m.title}</h3>
                        <p className="font-pixel text-[10px] font-black uppercase opacity-60 mb-4">{m.genre} · {m.year}</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => router.push(`/reels?id=${m.id}`)}
                            className="flex-1 brutal-border bg-secondary py-2 text-sm font-black uppercase flex items-center justify-center gap-2 brutal-shadow-sm hover:translate-y-[-1px] transition-transform"
                          >
                            <Play className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => toggleWatchlist(m.id)}
                            className="h-10 w-10 brutal-border bg-background flex items-center justify-center text-destructive brutal-shadow-sm hover:scale-110 transition-transform"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="history"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="space-y-6"
                  >
                    {user.history.map((h) => {
                      const winner = getMovieById(h.winnerId)
                      return (
                        <div key={h.sessionId} className="brutal-border bg-card p-6 brutal-shadow hover:brutal-shadow-lg transition-all flex flex-col sm:flex-row gap-6 items-center">
                          <div className="h-24 w-16 shrink-0 brutal-border overflow-hidden bg-foreground">
                            {winner && <Poster movie={winner} className="h-full w-full border-0 shadow-none" />}
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-4 mb-1">
                              <span className="font-pixel text-[10px] font-black uppercase opacity-40">{h.date}</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                              WINNER: <span className="text-primary">{winner?.title}</span>
                            </h3>
                            <div className="flex items-center justify-center sm:justify-start -space-x-3">
                              {h.participants.map((p, j) => (
                                <div key={j} className="h-8 w-8 brutal-border bg-background flex items-center justify-center text-[10px] font-black uppercase brutal-shadow-sm ring-2 ring-card">
                                  {p[0]}
                                </div>
                              ))}
                              <span className="ml-6 font-bold text-[10px] uppercase opacity-40">{h.participants.length} VOTERS</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="brutal-border bg-card p-8 brutal-shadow border-t-[12px] border-t-accent">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">SYSTEM STATS</h2>
              <div className="grid gap-4">
                <StatCard label="Quorums" value={user.history.length.toString()} icon={<Users />} />
                <StatCard label="Watchlist" value={user.watchlist.length.toString()} icon={<Bookmark />} />
                <StatCard label="Streak" value="4D" icon={<TrendingUp />} />
              </div>
            </div>

            <div className="brutal-border bg-secondary p-8 brutal-shadow relative overflow-hidden">
              <Sparkles className="absolute -top-4 -right-4 h-20 w-20 opacity-10" />
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">PRO TIP</h2>
              <p className="font-bold text-sm opacity-70">USE &quot;LOVE&quot; VOTES SPARINGLY. THEY CARRY TRIPLE WEIGHT IN THE FINAL CALCULATION.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Tab Bar (Bottom Nav Style) - Only on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 brutal-border bg-card p-4 border-x-0 border-b-0 flex items-center justify-around brutal-shadow-[0_-8px_0_rgba(0,0,0,1)]">
        <NavItem icon={<Play />} label="Reels" onClick={() => router.push("/reels")} />
        <NavItem icon={<Users />} label="Session" onClick={() => router.push("/session")} />
        <NavItem icon={<Bookmark />} label="Watch" active />
        <NavItem icon={<Settings />} label="Config" />
      </nav>
    </main>
  )
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="brutal-border bg-card p-4 brutal-shadow-sm flex flex-col items-center text-center">
      <div className="h-10 w-10 brutal-border bg-background flex items-center justify-center mb-3">
        {icon}
      </div>
      <p className="text-2xl font-black uppercase tracking-tighter">{value}</p>
      <p className="font-pixel text-[10px] font-black uppercase opacity-60">{label}</p>
    </div>
  )
}

function NavItem({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-primary scale-110" : "opacity-40 hover:opacity-100"
      )}
    >
      <div className={cn(
        "h-10 w-10 flex items-center justify-center transition-all",
        active && "brutal-border bg-primary text-primary-foreground"
      )}>
        {icon}
      </div>
      <span className="font-pixel text-[8px] font-black uppercase">{label}</span>
    </button>
  )
}
