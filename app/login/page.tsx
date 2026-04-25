"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BrandMark } from "@/components/quorum/brand-mark"
import { login, useStore } from "@/lib/store"
import { ArrowRight, User, Lock, Sparkles, Fingerprint } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const user = useStore((s) => s.user)
  const [name, setName] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  if (user) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    setIsSyncing(true)
    // Simulate biometric/sync delay
    await new Promise(r => setTimeout(r, 1500))
    login(name)
    router.push("/dashboard")
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center bg-background overflow-hidden p-5">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden />
      
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1920" 
          alt="Background" 
          className="h-full w-full object-cover grayscale opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      </div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] border-[2px] border-primary/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] border-[2px] border-secondary/20 rounded-full"
        />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="brutal-border bg-card p-10 brutal-shadow-lg relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-primary" />
          
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="mb-6"
            >
              <BrandMark size={80} />
            </motion.div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-center">
              ACCESS <br/> <span className="text-primary italic">QUORUM</span>
            </h1>
            <p className="mt-4 font-bold text-lg opacity-60 uppercase tracking-widest">Identify yourself to sync</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="font-pixel text-sm font-black uppercase tracking-widest block ml-1">
                Display Name
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="h-6 w-6" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.G. PIXEL_COMMANDER"
                  className="w-full brutal-border bg-background px-14 py-5 text-xl font-black uppercase outline-none focus:brutal-shadow transition-all placeholder:opacity-30"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-pixel text-sm font-black uppercase tracking-widest block ml-1">
                Pass-Key (Optional)
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-6 w-6" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full brutal-border bg-muted/30 px-14 py-5 text-xl font-black uppercase outline-none cursor-not-allowed"
                  disabled
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground text-background px-2 py-1 text-[10px] font-black uppercase">
                  Locked
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSyncing || !name.trim()}
              className="group w-full brutal-border bg-primary px-8 py-6 text-2xl font-black uppercase text-primary-foreground transition-all hover:-translate-y-2 brutal-shadow hover:brutal-shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <div className="flex items-center justify-center gap-4">
                <AnimatePresence mode="wait">
                  {isSyncing ? (
                    <motion.div
                      key="syncing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Fingerprint className="h-8 w-8 animate-pulse" />
                      SYNCING...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      Initialize
                      <ArrowRight className="h-8 w-8 transition-transform group-hover:translate-x-2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between border-t-4 border-foreground pt-8">
            <div className="flex items-center gap-2 font-pixel text-[10px] font-black uppercase opacity-40">
              <Sparkles className="h-4 w-4" />
              Secure Link Active
            </div>
            <button className="font-pixel text-[10px] font-black uppercase underline decoration-2 underline-offset-4 hover:text-primary transition-colors">
              Help?
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative Floating Icons */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 left-20 hidden lg:block"
      >
        <div className="brutal-border bg-secondary p-4 brutal-shadow-sm rotate-12">
          <Fingerprint className="h-10 w-10 text-secondary-foreground" />
        </div>
      </motion.div>
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-20 right-20 hidden lg:block"
      >
        <div className="brutal-border bg-accent p-4 brutal-shadow-sm -rotate-12">
          <Sparkles className="h-10 w-10 text-accent-foreground" />
        </div>
      </motion.div>
    </main>
  )
}
