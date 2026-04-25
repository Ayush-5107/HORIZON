import type { Metadata, Viewport } from "next"
import { Space_Grotesk, VT323 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "PROJECT QUORUM",
  description: "A neobrutalist pixel-art movie decision automaton.",
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import { AuthGuard } from "@/components/quorum/auth-guard"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${vt323.variable} bg-background`}
    >
      <body className="font-sans antialiased min-h-dvh font-bold bg-background text-foreground selection:bg-primary selection:text-foreground">
        <AuthGuard>
          {children}
        </AuthGuard>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
