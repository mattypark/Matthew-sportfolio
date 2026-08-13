import React, { useState, useEffect } from 'react'
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

const sections = [
  {
    platform: 'YouTube',
    color: '#FF0000',
    accounts: [
      {
        handle: '@matty_park',
        desc: 'Main channel',
        href: 'https://www.youtube.com/@matty_park',
        thumb: 'https://unavatar.io/youtube/matty_park?updated=20260228',
        followers: null, // fetched live via YouTube API
        ytHandle: 'matty_park',
      },
    ],
  },
  {
    platform: 'TikTok',
    color: '#010101',
    accounts: [
      {
        handle: '@mattparxy',
        desc: 'Main',
        href: 'https://www.tiktok.com/@mattparxy',
        thumb: 'https://unavatar.io/tiktok/mattparxy?updated=20260228',
        followers: null, // update manually e.g. '12.4K'
      },
      {
        handle: '@mattyparkk',
        desc: 'Secondary',
        href: 'https://www.tiktok.com/@mattyparkk',
        thumb: 'https://unavatar.io/tiktok/mattyparkk?updated=20260228',
        followers: null,
      },
      {
        handle: '@prayerlock.app (not affiliated anymore)',
        desc: 'PrayerLock',
        href: 'https://www.tiktok.com/@prayerlock.app',
        thumb: 'https://unavatar.io/tiktok/prayerlock.app?updated=20260228',
        followers: null,
      },
      {
        handle: '@documatthew',
        desc: 'Documentary',
        href: 'https://www.tiktok.com/@documatthew',
        thumb: 'https://unavatar.io/tiktok/documatthew?updated=20260228',
        followers: null,
      },
    ],
  },
  {
    platform: 'Instagram',
    color: '#E1306C',
    accounts: [
      {
        handle: '@matty.park',
        desc: 'Business',
        href: 'https://www.instagram.com/matty.park/',
        thumb: 'https://unavatar.io/instagram/matty.park?updated=20260228',
        followers: null,
      },
      {
        handle: '@matthew.parkk_',
        desc: 'Personal',
        href: 'https://www.instagram.com/matthew.parkk_/',
        thumb: 'https://unavatar.io/instagram/matthew.parkk_?updated=20260228',
        followers: null,
      },
      {
        handle: '@mattyparkyap',
        desc: 'Business Yap',
        href: 'https://www.instagram.com/mattyparkyap/',
        thumb: 'https://unavatar.io/instagram/mattyparkyap?updated=20260228',
        followers: null,
      },
    ],
  },
  {
    platform: 'X',
    color: '#000000',
    accounts: [
      {
        handle: '@MattyparkW',
        desc: 'Main',
        href: 'https://x.com/MattyparkW',
        thumb: 'https://unavatar.io/twitter/MattyparkW?updated=20260228',
        followers: null,
      },
    ],
  },
  {
    platform: 'LinkedIn',
    color: '#0A66C2',
    accounts: [
      {
        handle: 'Matthew Park',
        desc: 'Professional',
        href: 'https://www.linkedin.com/in/matthew-park-487889350/',
        thumb: '/linkedin-photo.png',
        followers: null,
      },
    ],
  },
]

function formatCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

// Platform logo SVGs (inline, minimal)
const PlatformIcon = ({ platform, color }) => {
  if (platform === 'YouTube') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}><path d="M23.5 6.2s-.2-1.6-1-2.3c-.9-1-1.9-1-2.4-1C17.1 2.7 12 2.7 12 2.7s-5.1 0-8.1.2c-.5.1-1.5.1-2.4 1-.7.7-1 2.3-1 2.3S.3 8 .3 9.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.6 1 2.3c.9 1 2.1.9 2.6 1C5.8 18.6 12 18.7 12 18.7s5.1 0 8.1-.3c.5-.1 1.5-.1 2.4-1 .7-.7 1-2.3 1-2.3s.2-1.8.2-3.6V9.8c0-1.8-.2-3.6-.2-3.6zM9.7 14.6V8.3l6.5 3.2-6.5 3.1z"/></svg>
  )
  if (platform === 'TikTok') return (
    <svg width="16" height="18" viewBox="0 0 24 24" fill={color}><path d="M19.6 3.3A4.5 4.5 0 0 1 15.2 0h-3.4v16.4a2.6 2.6 0 0 1-2.6 2.2 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 2.6-2.6c.3 0 .5 0 .8.1V10a6 6 0 0 0-.8-.1 6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6V8.3a8 8 0 0 0 4.4 1.3V6.2a4.5 4.5 0 0 1-3-2.9z"/></svg>
  )
  if (platform === 'Instagram') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color}><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>
  )
  if (platform === 'X') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={color}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )
  if (platform === 'LinkedIn') return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={color}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )
  if (platform === 'Discord') return (
    <svg width="20" height="15" viewBox="0 0 24 18" fill={color}><path d="M20.3 1.5A19.8 19.8 0 0 0 15.4 0c-.2.4-.5 1-.7 1.4a18.4 18.4 0 0 0-5.5 0C9 1 8.7.4 8.5 0A19.7 19.7 0 0 0 3.6 1.5 20.9 20.9 0 0 0 .1 15.2a20 20 0 0 0 6.1 3.1c.5-.7 1-1.4 1.3-2.2-.7-.3-1.4-.6-2-1l.5-.4a14.3 14.3 0 0 0 12.2 0l.5.4c-.7.4-1.3.7-2 1 .4.8.8 1.5 1.3 2.2a19.9 19.9 0 0 0 6.1-3.1A20.7 20.7 0 0 0 20.3 1.5zM8.5 12.4c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4s2.2 1.1 2.1 2.4c0 1.3-.9 2.4-2.1 2.4zm7 0c-1.2 0-2.1-1.1-2.1-2.4 0-1.3.9-2.4 2.1-2.4 1.2 0 2.1 1.1 2.1 2.4 0 1.3-.9 2.4-2.1 2.4z"/></svg>
  )
  return null
}

const SocialCard = ({ account, platform, platformColor, index }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <motion.a
      href={account.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background hover:border-foreground/20 transition-all duration-300"
    >
      {/* Avatar — square */}
      <div className="relative w-full aspect-square overflow-hidden bg-muted flex items-center justify-center">
        {account.thumb && !imgError ? (
          <img
            src={account.thumb}
            alt={account.handle}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${platformColor}18, ${platformColor}08)` }}
          >
            <div style={{ opacity: 0.15 }}>
              <PlatformIcon platform={platform} color={platformColor} />
            </div>
          </div>
        )}
        {/* Platform badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1">
          <PlatformIcon platform={platform} color={platformColor} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-0.5">
        <p className="font-ibm text-xs font-medium tracking-tight truncate">{account.handle}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-ibm text-[11px] text-muted-foreground">{account.desc}</p>
          {account.followers && (
            <p className="font-ibm text-[11px] text-muted-foreground shrink-0">{account.followers}</p>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-foreground">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.a>
  )
}

const Socials = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [ytSubs, setYtSubs] = useState(null)

  useEffect(() => {
    const key = import.meta.env.VITE_YT_API_KEY
    if (!key) return
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=matty_park&key=${key}`)
      .then(r => r.json())
      .then(data => {
        const count = data?.items?.[0]?.statistics?.subscriberCount
        if (count) setYtSubs(formatCount(Number(count)))
      })
      .catch(() => {})
  }, [])

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
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.youtube.com/@matty_park">YT</a>

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
                    <a target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors" href="https://www.youtube.com/@matty_park">YT</a>
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
              <a target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" href="https://www.youtube.com/@matty_park">YT</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <main className="sm:px-8 px-6 pt-32 pb-24">
        <div className="flex items-baseline justify-between mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-instrument text-7xl sm:text-8xl tracking-tight"
          >
            Socials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-instrument text-7xl sm:text-8xl tracking-tight"
          >
            46.6k
          </motion.p>
        </div>

        <div className="flex flex-col gap-16">
          {sections.map((section, si) => (
            <motion.div
              key={section.platform}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + si * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                <PlatformIcon platform={section.platform} color={section.color} />
                <h2 className="font-ibm text-sm font-medium tracking-tight">{section.platform}</h2>
                <span className="font-ibm text-xs text-muted-foreground ml-auto">
                  {section.accounts.length} {section.accounts.length === 1 ? 'account' : 'accounts'}
                </span>
              </div>

              {/* Cards grid — 3 per row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {section.accounts.map((account, ai) => (
                  <SocialCard
                    key={account.handle}
                    account={account.ytHandle ? { ...account, followers: ytSubs ?? account.followers } : account}
                    platform={section.platform}
                    platformColor={section.color}
                    index={si * 4 + ai}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Socials
