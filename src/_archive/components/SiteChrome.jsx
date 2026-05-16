import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/* Shared header — live clock only on the right. No wordmark, no breadcrumb. */

const LiveClock = () => {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span>
      {t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
    </span>
  )
}

export default function SiteChrome() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-start justify-end px-6 sm:px-10 pt-5 sm:pt-6"
    >
      <div className="flex items-start pt-2 sm:pt-4 font-mono text-[12px] sm:text-[13px]">
        <span className="hidden sm:inline text-foreground tabular-nums">
          EST <LiveClock />
        </span>
      </div>
    </motion.header>
  )
}
