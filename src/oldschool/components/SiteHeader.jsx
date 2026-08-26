import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CartIcon from './CartIcon'

// The header and menu overlay, lifted verbatim out of the existing pages so the
// LUT page doesn't add a sixth hand-copied version. The other pages still carry
// their own copies; they can adopt this whenever someone is in there anyway.

const NavLink = ({ href, name, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block font-instrument text-5xl sm:text-7xl py-3 select-none"
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

const SOCIALS = [
  { label: 'X', href: 'https://x.com/MattyparkW' },
  { label: 'IN', href: 'https://www.linkedin.com/in/matthew-park-487889350/' },
  { label: 'IG', href: 'https://www.instagram.com/matty.park/' },
  { label: 'TT', href: 'https://www.tiktok.com/@mattparxy' },
  { label: 'YT', href: 'https://www.youtube.com/@Matty_park' },
]

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Core Values', href: '/values' },
  { name: 'Shop', href: '/shop' },
]

const SiteHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
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
          <CartIcon />
          {SOCIALS.map((s) => (
            <a key={s.label} target="_blank" rel="noopener noreferrer" className="hover:underline" href={s.href}>
              {s.label}
            </a>
          ))}

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-[60] flex items-center justify-center w-6 h-6 ml-1"
            aria-label="Toggle menu"
          >
            <motion.div className="relative w-4 h-3 flex flex-col justify-between">
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { rotate: 45, y: 5, backgroundColor: '#ffffff' } : { rotate: 0, y: 0, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { opacity: 0, backgroundColor: '#ffffff' } : { opacity: 1, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block h-[1.5px] w-4 origin-center"
                animate={isMenuOpen ? { rotate: -45, y: -5, backgroundColor: '#ffffff' } : { rotate: 0, y: 0, backgroundColor: '#1A1A1A' }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </button>
        </div>
      </motion.div>

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
                {NAV_LINKS.map((link, i) => (
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
                    <CartIcon tone="dark" />
                    {SOCIALS.map((s) => (
                      <a key={s.label} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href={s.href}>
                        {s.label}
                      </a>
                    ))}
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
              <CartIcon tone="dim" />
              {SOCIALS.map((s) => (
                <a key={s.label} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href={s.href}>
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SiteHeader
