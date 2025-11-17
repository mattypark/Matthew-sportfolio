import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Portfolio = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timelineEvents = [
    {
      date: '11.17.25',
      description: <span className="animate-typing">???</span>,
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
      description: <>Joins <a className="underline" target="_blank" rel="noopener noreferrer" href="https://prayerlock.com/">Prayer lock</a> as growth & strategy consultant</>,
      link: 'https://prayerlock.com/',
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
      date: '04.01.25',
      description: <>Joins <a className="underline" target="_blank" rel="noopener noreferrer" href="https://retro.app">Retro</a> as growth</>,
      link: 'https://retro.app',
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

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 z-10 flex flex-row items-start justify-between tracking-tight w-full max-w-screen overflow-x-hidden sm:p-8 p-6 bg-background/10 backdrop-blur-xl"
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
          <a target="_blank" rel="noopener noreferrer" className="hover:underline" href="https://www.youtube.com/@Mattyparkkk">
            YT
          </a>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="tracking-tight no-scrollbar relative h-screen w-screen overflow-y-auto flex flex-col gap-4 items-start justify-start p-8 sm:pl-8 pl-6 sm:pt-24 pt-20 pb-32">
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
            className="flex flex-row items-center justify-start sm:gap-26 gap-16 text-xs"
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
