import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import aboutPhoto from '/about-photo.png'

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

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Core Values', href: '/values' },
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
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://discord.com/users/1256249020398047333">DC</a>

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
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://discord.com/users/1256249020398047333">DC</a>
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
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://discord.com/users/1256249020398047333">DC</a>
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
          About
        </motion.h1>

        {/* Two-column layout: photo left, text right */}
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full sm:w-[420px] shrink-0"
          >
            <img
              src={aboutPhoto}
              alt="Matthew Park"
              className="w-full rounded-2xl object-cover"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 max-w-lg"
          >
            <p className="font-ibm text-[11px] text-muted-foreground uppercase tracking-widest">Matthew Park</p>
            <h2 className="font-instrument text-3xl sm:text-4xl leading-snug tracking-tight">
              Who is Matthew Park?
            </h2>
            <div className="flex flex-col gap-4 font-ibm text-sm leading-relaxed text-foreground/80">
              <p>
                I'm a 15-year-old builder, creator, and entrepreneur from Kentucky. I started my Journey ever since I was born.
              </p>
              <p>
                I was born on a Sunday, almost exactly a year prior, a pastor told my parents that they we're going to have another
                baby (me). I was then given the name, Matthew. The first name of the New Testament in the Bible and meaning "Gift of God." None of this 
                was a coincidence, but rather, a new generation. to create. something generational.
              </p>
              <p>
                The past year, I've worked as growth at MathGPT, Turbolearn AI, cofounded Prayer Lock, generated $20k
                in revenue, went viral on Social Media, competed in Speech & Debate, qualified for State, played
                Saxophone at All-State, and now I'm building my next thing.
              </p>
              <p>
                I believe in doing everything — the more you do, the more opportunities show up. And to do something exceptional, 
                you have to first be the exception.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default About
