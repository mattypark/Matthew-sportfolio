import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clapperboard, Guitar, Music, Bot, Gamepad2, Activity, Circle } from 'lucide-react'

const FloatingIcon = ({ children, delay = 0, rotation = 0, offsetY = -10, offsetX = 150, isPulsing = false, floatDuration = 8, floatAmount = 10 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: "easeOut" 
      }}
      className="absolute hidden sm:block pointer-events-auto"
      style={{ 
        top: `${offsetY}px`,
        right: `-${offsetX}px`,
        rotate: `${rotation}deg`,
        zIndex: 5
      }}
    >
      <motion.div
        drag={true}
        dragConstraints={{ left: 20, right: 600, top: -200, bottom: 200 }}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 20, bounceDamping: 15 }}
        animate={{
          y: [0, -floatAmount, 0],
          x: [0, floatAmount * 0.3, 0],
        }}
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.5
        }}
        whileHover={{ 
          scale: 1.15,
          rotate: rotation + 8,
          transition: { duration: 0.3 }
        }}
        whileDrag={{
          scale: 1.2,
          cursor: 'grabbing',
          transition: { duration: 0.1 }
        }}
        style={{
          cursor: 'grab'
        }}
      >
        {isPulsing ? (
          <motion.div
            animate={{
              opacity: [1, 0.4, 1],
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </motion.div>
    </motion.div>
  )
}

const Portfolio = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
      date: '11.19.25',
      description: <>Matthew cofounds <a className="underline" target="_blank" rel="noopener noreferrer" href="https://prayerlock.com/">Prayer lock</a> with Mau</>,
      link: 'https://prayerlock.com/',
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
            className="relative flex flex-row items-center justify-start sm:gap-26 gap-16 text-xs"
          >
            <p className="font-ibm text-muted-foreground cursor-pointer whitespace-nowrap">
              {event.date}
            </p>
            <p className="font-inter">
              {event.description}
            </p>
            
            {/* Floating Icons */}
            {index === 0 && (
              <FloatingIcon offsetY={30} offsetX={1000} rotation={-8} delay={0.1} isPulsing={true} floatDuration={10} floatAmount={8}>
                <div className="text-6xl font-bold">???</div>
              </FloatingIcon>
            )}
            {index === 1 && (
              <FloatingIcon offsetY={50} offsetX={300} rotation={12} delay={0.2} floatDuration={11} floatAmount={9}>
                <Clapperboard size={90} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 3 && (
              <FloatingIcon offsetY={70} offsetX={600} rotation={-15} delay={0.3} floatDuration={12} floatAmount={10}>
                <Bot size={110} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 11 && (
              <FloatingIcon offsetY={-80} offsetX={900} rotation={-12} delay={0.7} floatDuration={9} floatAmount={11}>
                <Music size={95} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 13 && (
              <FloatingIcon offsetY={150} offsetX={500} rotation={10} delay={0.8} floatDuration={8} floatAmount={8}>
                <Gamepad2 size={100} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 14 && (
              <FloatingIcon offsetY={200} offsetX={750} rotation={-8} delay={0.9} floatDuration={11.5} floatAmount={9}>
                <Activity size={110} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 15 && (
              <FloatingIcon offsetY={-0} offsetX={400} rotation={12} delay={1.0} floatDuration={10.5} floatAmount={12}>
                <Circle size={90} strokeWidth={2} />
              </FloatingIcon>
            )}
            {index === 17 && (
              <FloatingIcon offsetY={-200} offsetX={650} rotation={8} delay={1.2} floatDuration={9.5} floatAmount={10}>
                <Guitar size={100} strokeWidth={2} />
              </FloatingIcon>
            )}
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
