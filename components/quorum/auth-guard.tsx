"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useStore } from "@/lib/store"

const PUBLIC_PATHS = ["/", "/login"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useStore((s) => s.user)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for hydration from sessionStorage
    const timeout = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isReady) return

    const isPublic = PUBLIC_PATHS.includes(pathname)
    
    if (!user && !isPublic) {
      router.replace("/login")
    }
  }, [user, pathname, router, isReady])

  // Optional: Prevent flash of protected content
  if (!isReady) return null
  if (!user && !PUBLIC_PATHS.includes(pathname)) return null

  return <>{children}</>
}
