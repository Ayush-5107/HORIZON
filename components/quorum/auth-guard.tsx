"use client"

import { type ReactNode } from "react"

// The app currently has no real auth — every route is accessible.
// This wrapper is kept as a structural placeholder for future auth integration.
export function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>
}
