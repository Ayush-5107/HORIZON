"use client"

import { motion } from "framer-motion"
import { Battery, Wifi, Signal } from "lucide-react"

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#080808] flex items-center justify-center p-0 md:p-10">
      {/* The "Device" */}
      <div className="relative w-full max-w-md h-full md:h-[850px] bg-background md:rounded-[60px] md:border-[12px] md:border-[#1a1a1a] overflow-hidden md:shadow-[0_0_0_4px_#333,0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col">
        
        {/* Notch / Status Bar */}
        <div className="h-12 bg-background flex items-center justify-between px-10 relative z-[100]">
          <div className="text-xs font-black font-pixel">9:41</div>
          
          {/* Physical Notch simulation on desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-40 h-8 bg-[#1a1a1a] rounded-b-3xl" />
          
          <div className="flex items-center gap-2">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <Battery className="h-3 w-3 rotate-90" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-none relative">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="h-8 bg-background flex items-center justify-center pb-2 relative z-[100]">
          <div className="w-32 h-1.5 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  )
}
