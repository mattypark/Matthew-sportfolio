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
            {/* Real char — slides up on hover */}
            <motion.span
              className="inline-block text-white"
              animate={{ y: isHovered ? '-105%' : '0%' }}
              transition={{ duration: 0.4, delay: ci * 0.03, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
            {/* Ghost char — slides up from below */}
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

const Portfolio = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const getTodaysDate = () => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const year = String(today.getFullYear()).slice(-2)
    return `${month}.${day}.${year}`
  }

  const timelineEvents = [
    {
      date: getTodaysDate(),
      description: <span className="animate-typing">???</span>,
      link: null,
    },
    {
      date: '03.07.26',
      description: 'Sustaniable Development National Award at LRSEF',
      link: null,
    },
    {
      date: '03.07.26',
      description: '1st in ESGD Category at LRSEF',
      link: null,
    },
    {
      date: '03.05.26',
      description: 'Starts working with Evan Yadegeri and Nick on new Startup',
      link: null,
    },
    {
      date: '02.25.26',
      description: <>Finishes building <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.gourmetai.run">Gourmet AI Waitlist</a> and is live</>,
      link: 'https://www.gourmetai.run',
    },
    {
      date: '02.24.26',
      description: 'Joins MathGPT for Growth',
      link: null,
    },
    {
      date: '02.23.26',
      description: 'Hits 1k subscribers on Youtube',
      link: null,
    },
    {
      date: '02.23.26',
      description: <>Finishes building <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.bouncebackpickle.com">BounceBack PickleBall Website</a></>,
      link: 'https://www.bouncebackpickle.com',
    },
    {
      date: '02.21.26',
      description: '1st in Impromptu Sales Speech & Debate at Marshalls University Speech Tournament',
      link: null,
    },
    {
      date: '02.21.26',
      description: <>The <a className="underline" target="_blank" rel="noopener noreferrer" href="https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_">YT Documentary Video</a> gets 10k views</>,
      link: 'https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_',
    },
    {
      date: '02.16.26',
      description: 'Cofounds 2nd startup, Travel App',
      link: null,
    },
    {
      date: '02.10.26',
      description: <>Posts his first <a className="underline" target="_blank" rel="noopener noreferrer" href="https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_">YT Documentary Video</a></>,
      link: 'https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_',
    },
    {
      date: '02.10.26',
      description: 'Posts first series of shortform content',
      link: null,
    },
    {
      date: '02.07.26',
      description: 'Qualified for State Speech & Debate',
      link: null,
    },
    {
      date: '02.05.26',
      description: 'Starts playing Drums',
      link: null,
    },
    {
      date: '02.02.26',
      description: 'Qualified for Regionals Speech & Debate',
      link: null,
    },
    {
      date: '01.17.26',
      description: 'Starts working with Jackson Sword',
      link: null,
    },
    {
      date: '01.13.26',
      description: 'Starts working with Dillon/BounceBack pickleball',
      link: null,
    },
    {
      date: '01.01.26',
      description: 'Skiing for the first time',
      link: null,
    },
    {
      date: '12.29.25',
      description: 'Stops working with Mau/Prayer Lock',
      link: null,
    },
    {
      date: '12.05.25',
      description: 'Generates 14k for Prayer Lock doing 2k MRR previously (7X the business)',
      link: null,
    },
    {
      date: '12.04.25',
      description: <>Posts his first <a className="underline" target="_blank" rel="noopener noreferrer" href="https://x.com/MattyparkW/status/1996768218082418915">X post</a></>,
      link: 'https://x.com/MattyparkW/status/1996768218082418915',
    },
    {
      date: '12.01.25',
      description: 'Starts building his first solo AI app',
      link: null,
    },
    {
      date: '11.19.25',
      description: 'Matthew Cofounds an Prayer Lockwith Mau',
      link: null,
    },
    {
      date: '11.17.25',
      description: 'Matthew redesigns his portfolio website',
      link: null,
    },
    {
      date: '11.08.25',
      description: 'Creates first portfolio website',
      link: null,
    },
    {
      date: '11.03.25',
      description: <>Joins <a className="underline" target="_blank" rel="noopener noreferrer" href="https://turbo.ai">Turbolearn AI</a> as growth</>,
      link: 'https://turbo.ai',
    },
    {
      date: '11.03.25',
      description: 'Starts doing UGC',
      link: null,
    },
    {
      date: '11.02.25',
      description: <>Signed first client for consulting/marketing strategies</>,
      link: null,
    },
    {
      date: '10.28.25',
      description: 'Matthew starts his own consulting company',
      link: null,
    },
    {
      date: '10.02.25',
      description: 'Recieves 30+ UGC offers',
      link: null,
    },
    {
      date: '08.13.25',
      description: 'First viral talking head video on TikTok',
      link: null,
    },
    {
      date: '07.29.25',
      description: 'Visits switzerland',
      link: null,
    },
    {
      date: '06.10.25',
      description: 'Creates his first telegram bot',
      link: null,
    },
    {
      date: '03.06.25',
      description: 'KMEA All-state Alto Saxaphone 2nd Chair (again)',
      link: null,
    },
    {
      date: '12.19.24',
      description: 'Drops Career high 22 points in Basketball',
      link: null,
    },
    {
      date: '03.02.24',
      description: 'KMEA All-state Alto Saxaphone 2nd Chair',
      link: null,
    },
    {
      date: '11.09.22',
      description: 'Starts reselling Prime/candy',
      link: null,
    },
    {
      date: '09.01.22',
      description: '3.0 UTR Tennis rank',
      link: null,
    },
    {
      date: '08.10.22',
      description: 'Starts playing Saxaphone',
      link: null,
    },
    {
      date: '06.03.22',
      description: 'Starts playing Guitar',
      link: null,
    },
    {
      date: '03.19.22',
      description: 'First TikTok posted',
      link: null,
    },
    {
      date: '11.19.21',
      description: "Starts playing Basketball",
      link: null,
    },
    {
      date: '01.07.21',
      description: 'Starts playing Tennis',
      link: null,
    },
    {
      date: '07.28.20',
      description: 'Matthew posts his first video on Youtube',
      link: null,
    },
    {
      date: '03.14.18',
      description: 'Matthew plays his first video game (Fortnite)',
      link: null,
    },
    {
      date: '10.12.10',
      description: 'Matthew is born',
      link: null,
    },
  ]

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Core Values', href: '/values' },
    { name: 'Socials', href: '/socials' },
  ]

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-50 flex flex-row items-center justify-between tracking-tight w-full max-w-screen overflow-x-hidden sm:p-8 p-6 bg-background/10 backdrop-blur-xl"
      >
        <a className="text-2xl leading-none font-instrument" href="/">
          Matthew.
        </a>
        <div className="flex flex-row items-center gap-5 font-ibm text-xs">
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://x.com/MattyparkW">
            X
          </a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.linkedin.com/in/matthew-park-487889350/">
            IN
          </a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.instagram.com/matty.park/">
            IG
          </a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.tiktok.com/@mattparxy">
            TT
          </a>
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.youtube.com/@Matty_park">
            YT
          </a>

          {/* Hamburger button */}
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
            {/* Main menu area */}
            <div className="flex flex-row flex-1 pt-24 -mt-10">
              {/* Left — nav links */}
              <div className="flex flex-col justify-center sm:pl-16 pl-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      delay: 0.15 + i * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <NavLink
                      href={link.href}
                      name={link.name}
                      onClick={() => setIsMenuOpen(false)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Right — info panel */}
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
                  <a
                    href="mailto:mattyparkbusiness@gmail.com"
                    className="font-ibm text-xs text-white hover:text-white/60 transition-colors"
                  >
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

            {/* Bottom bar */}
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

      {/* Main Content */}
      <main data-smooth-scroll className="tracking-tight no-scrollbar relative h-screen w-screen overflow-y-auto flex flex-col gap-4 items-start justify-start p-8 sm:pl-8 pl-6 sm:pt-24 pt-20 pb-32">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: index * 0.02,
              ease: "easeOut"
            }}
            className="relative flex flex-row items-center justify-start sm:gap-26 gap-16 text-xs"
          >
            <p className="font-ibm text-muted-foreground cursor-pointer whitespace-nowrap">
              {event.date}
            </p>
            <p className="font-inter">
              {event.description}
            </p>
          </motion.div>
        ))}
      </main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-0 z-10 flex flex-row items-end justify-between tracking-tight w-full max-w-screen overflow-x-hidden sm:p-8 p-6 pt-20 bg-gradient-to-t from-background/100 to-background/10"
      >
        <p className="text-xs text-muted-foreground">
          © 2025{' '}
          <a className="underline" target="_blank" rel="noopener noreferrer" href="mattyparkbusiness@gmail.com">
            Matthew Park
          </a>
        </p>
        <a
          className="text-xl leading-none font-instrument font-medium italic absolute left-1/2 -translate-x-1/2 bottom-7 sm:block hidden"
          href="/"
        >
          m/p
        </a>
        <p className="text-xs text-muted-foreground">
          Matthew Time: {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </p>
      </motion.div>
    </div>
  )
}

export default Portfolio
