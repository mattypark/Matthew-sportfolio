import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

const inspirations = [
  {
    name: 'Trey Gustafson',
    title: 'Entrepreneur',
    handle: 'treygustafson_',
    link: 'https://www.instagram.com/treygustafson_/',
    photo: '/inspiration-trey.jpg',
    why: 'Trey is the first reason why I ever got into entrepreneurship. Watched his content ever since 2 years ago, and his content expertise is what I study almost a weekly basis. He\'s the definition of an inspiration and a teenage entrepreneur for me.',
  },
  {
    name: 'Alysa Liu',
    title: 'Olympic Figure Skater',
    handle: 'alysaxliu',
    link: 'https://www.instagram.com/alysaxliu/',
    photo: '/inspiration-alysa.jpg',
    why: 'She won the gold medal for USA in the olympics. However, she was different because it just looked like she was having fun. Every other skater was stressed, but for her, winning and losing didn\'t matter. It was the craft.',
  },
  {
    name: 'Peter Thiel',
    title: 'Venture Capitalist & Author',
    handle: 'peterthiel',
    link: 'https://x.com/peterthiel',
    photo: '/inspiration-peter.jpg',
    why: 'Reading his book and story opens me up to so much more perspectives in business/startups. It truly made me understand more about how this game really works.',
  },
  {
    name: 'Steph Curry',
    title: 'Basketball Player',
    handle: 'stephencurry30',
    link: 'https://www.instagram.com/stephencurry30/',
    photo: '/inspiration-steph.jpg',
    why: 'Always been undersized, never underdelivered. He showed the world no matter where you came from, what people say about you, you always find what you\'re good at, then. DOMINATE. So dominate to where people are afraid that they fear you on or off the court.',
  },
  {
    name: 'Jannik Sinner',
    title: 'Tennis Player',
    handle: 'janniksin',
    link: 'https://www.instagram.com/janniksin/',
    photo: '/inspiration-jannik.jpg',
    why: 'The quiet sinner that has been forgiven. On the court, he never is too flashy, sometimes makes others lose control, but always delivers consistent good work.',
  },
  {
    name: 'Ben Shelton',
    title: 'Tennis Player',
    handle: 'benshelton',
    link: 'https://www.instagram.com/benshelton/',
    photo: '/inspiration-ben.jpg',
    why: 'Loud. Bold. Proud. He loves expressing his feelings, showing who he is, playing like every point matters, hitting with all his might. The shell that delivers tons.',
  },
]

const Inspiration = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Core Values', href: '/values' },
    { name: 'Inspiration', href: '/inspiration' },
    { name: 'Socials', href: '/socials' },
  ]

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
          className="font-instrument text-7xl sm:text-8xl tracking-tight mb-6"
        >
          Inspiration
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-ibm text-sm text-foreground/60 max-w-lg mb-16 leading-relaxed"
        >
          People I look up to, who I aspire to be, and why they inspire me every day. Not in any particular order.
        </motion.p>

        {/* Inspiration cards — photo left, text right like About */}
        <div className="flex flex-col gap-24">
          {inspirations.map((person, i) => (
            <motion.div
              key={person.handle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start"
            >
              {/* Photo */}
              <div className="w-full sm:w-[320px] shrink-0">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full rounded-2xl object-cover aspect-[3/4] grayscale"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-4 max-w-lg">
                <p className="font-ibm text-[11px] text-muted-foreground uppercase tracking-widest">{person.title}</p>
                <h2 className="font-instrument text-3xl sm:text-4xl leading-snug tracking-tight">
                  {person.name}
                </h2>
                <a
                  href={person.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ibm text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  @{person.handle}
                </a>
                <p className="font-ibm text-sm leading-relaxed text-foreground/80">
                  {person.why}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Inspiration
