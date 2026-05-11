import React from 'react'
import { motion } from 'framer-motion'
import SiteChrome from './SiteChrome'
import RoomsNav from './RoomsNav'

const values = [
  "God #1 Always. Even if you forget, remind yourself that he is the reason you are here today.",
  "Do. Everything. It gives you more opportunities to do more great things.",
  "Always tell the truth, for it will be better than making the mistake with major guilt.",
  "Why? or Why not? Always ask yourself this, and you will find new questions to come.",
  "You will get nowhere running on a treadmill because you're always grinding, but not advancing.",
  "To do something exceptional, you have to be the exception.",
  "Failure > trying to be perfect, you WILL fail, but will you learn from your failure?",
  "being cringe is never cringe, just the saying of it is cringe.",
  "Never put off something tomorrow that can be done today.",
  "the goal isn’t to live forever, it’s to create something that can live forever",
  "The wise doesn't complain about problems, but rather solves them.",
  "Be cautious of what you listen and consume, for it will shape your mind, future, and you.",
  "Never trust a person who talks behind another man's back, for you never know what they're saying about you.",
  "You are never behind in life. As the closer you get to the sun, the shadow grows bigger behind you, but you must ignore the shadow and see the light in front of you.",
]

const CoreValues = () => {
  const left = values.slice(0, 7)
  const right = values.slice(7)

  return (
    <div className="min-h-screen text-foreground">
      <SiteChrome />

      <main className="sm:px-10 px-6 pt-32 sm:pt-40 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument text-7xl sm:text-8xl tracking-tight mb-16 text-foreground"
        >
          Core Values
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-0">
          <ol className="list-none">
            {left.map((value, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: 'easeOut' }}
                className="flex gap-4 font-mono text-sm leading-relaxed py-4 border-b border-border text-foreground"
              >
                <span className="text-foreground/40 shrink-0 w-5 text-right">{i + 1}.</span>
                <span className="text-foreground/85">{value}</span>
              </motion.li>
            ))}
          </ol>

          <ol className="list-none">
            {right.map((value, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + (i + 7) * 0.05, ease: 'easeOut' }}
                className="flex gap-4 font-mono text-sm leading-relaxed py-4 border-b border-border text-foreground"
              >
                <span className="text-foreground/40 shrink-0 w-5 text-right">{i + 8}.</span>
                <span className="text-foreground/85">{value}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </main>

      <RoomsNav />
    </div>
  )
}

export default CoreValues
