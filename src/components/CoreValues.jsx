import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const NavLink = ({ href, name, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block font-instrument text-6xl sm:text-8xl py-3 select-none"
      style={{ lineHeight: 1.1 }}
    >
      <span className="flex">
        {name.split('').map((char, ci) => (
          <span
            key={ci}
            className="inline-block relative overflow-hidden"
            style={{ lineHeight: 1.15, height: '1.15em' }}
          >
            <motion.span
              className="inline-block text-white"
              animate={{ y: isHovered ? '-105%' : '0%' }}
              transition={{ duration: 0.4, delay: ci * 0.03, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
            <motion.span
              className="inline-block text-white absolute left-0 top-0 w-full"
              animate={{ y: isHovered ? '0%' : '105%' }}
              transition={{ duration: 0.4, delay: ci * 0.03, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          </span>
        ))}
      </span>
    </a>
  )
}

const CoreValues = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Core Values', href: '/values' },
    { name: 'Socials', href: '/socials' },
  ]

  const left = values.slice(0, 7)
  const right = values.slice(7)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 flex flex-row items-center justify-between tracking-tight w-full sm:px-8 px-6 sm:py-8 py-6 bg-background/10 backdrop-blur-xl"
      >
        <a className="text-2xl leading-none font-instrument" href="/">
          Matthew.
        </a>
        <div className="flex flex-row items-center gap-5 font-ibm text-xs">
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://x.com/MattyparkW">X</a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.linkedin.com/in/matthew-park-487889350/">IN</a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.instagram.com/matty.park/">IG</a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.tiktok.com/@mattparxy">TT</a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.youtube.com/@Matty_park">YT</a>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-[60] flex items-center justify-center w-6 h-6 ml-1"
            aria-label="Toggle menu"
          >
            <motion.div className="relative w-4 h-3 flex flex-col justify-between">
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { rotate: 45, y: 5, backgroundColor: '#1A1A1A' } : { rotate: 0, y: 0, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { rotate: -45, y: -5, backgroundColor: '#1A1A1A' } : { rotate: 0, y: 0, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </button>
        </div>
      </motion.div>

      {/* Menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black flex flex-col justify-between"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-row flex-1 pt-24 -mt-10">
              <div className="flex flex-col justify-center sm:pl-16 pl-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink href={link.href} name={link.name} onClick={() => setIsMenuOpen(false)} />
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="hidden sm:flex flex-col justify-center gap-8 pr-[46px] min-w-[220px] ml-auto"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-ibm text-[10px] text-white/30 uppercase tracking-widest">Location</p>
                  <p className="font-ibm text-xs text-white">Kentucky</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-ibm text-[10px] text-white/30 uppercase tracking-widest">Email</p>
                  <a href="mailto:mattyparkbusiness@gmail.com" className="font-ibm text-xs text-white hover:text-white/60 transition-colors">
                    mattyparkbusiness@gmail.com
                  </a>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-ibm text-[10px] text-white/30 uppercase tracking-widest">Social</p>
                  <div className="flex flex-row gap-4 font-ibm text-xs text-white">
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://x.com/MattyparkW">X</a>
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://www.linkedin.com/in/matthew-park-487889350/">IN</a>
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://www.instagram.com/matty.park/">IG</a>
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://www.tiktok.com/@mattparxy">TT</a>
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://www.youtube.com/@Matty_park">YT</a>
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="sm:px-16 px-8 pb-10 flex flex-row items-center gap-6 font-ibm text-xs text-white/30 sm:hidden"
            >
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://x.com/MattyparkW">X</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://www.linkedin.com/in/matthew-park-487889350/">IN</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://www.instagram.com/matty.park/">IG</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://www.tiktok.com/@mattparxy">TT</a>
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://www.youtube.com/@Matty_park">YT</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main className="sm:px-8 px-6 pt-32 pb-20">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument text-7xl sm:text-8xl tracking-tight mb-16"
        >
          CORE VALUES
        </motion.h1>

        {/* Two-column list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-0">
          {/* Left column */}
          <ol className="list-none">
            {left.map((value, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
                className="flex gap-4 font-ibm text-sm leading-relaxed py-4 border-b border-border"
              >
                <span className="text-muted-foreground shrink-0 w-5 text-right">{i + 1}.</span>
                <span>{value}</span>
              </motion.li>
            ))}
          </ol>

          {/* Right column */}
          <ol className="list-none">
            {right.map((value, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + (i + 7) * 0.05, ease: 'easeOut' }}
                className="flex gap-4 font-ibm text-sm leading-relaxed py-4 border-b border-border"
              >
                <span className="text-muted-foreground shrink-0 w-5 text-right">{i + 8}.</span>
                <span>{value}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  )
}

export default CoreValues
