import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SiteChrome from './SiteChrome'
import SideRoomsRail from './SideRoomsRail'

const Timeline = () => {
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
    { date: '04.18.26', description: 'Starts on a nonprofit', link: null },
    { date: '04.17.26', description: 'Gets into Stanford ASES Launchpad Program', link: null },
    { date: '03.25.26', description: 'Creates his own AI agent', link: null },
    { date: '03.17.26', description: 'Starts Singing', link: null },
    { date: '03.14.26', description: 'Quarter Finalists in State Speech & Debate Impromptu', link: null },
    {
      date: '03.13.26',
      description: <>Designs a <a className="underline" target="_blank" rel="noopener noreferrer" href="https://baselinewaitlistfrontend.vercel.app">futuristic waitlist page</a> for Jordan Franklin</>,
      link: 'https://baselinewaitlistfrontend.vercel.app',
    },
    { date: '03.09.26', description: '1st linkedin post', link: null },
    { date: '03.07.26', description: 'Sustaniable Development National Award at LRSEF', link: null },
    { date: '03.07.26', description: '1st in ESGD Category at LRSEF', link: null },
    { date: '03.05.26', description: 'Starts working with Evan Yadegeri and Nick on new Startup', link: null },
    { date: '03.04.26', description: 'MIT Critical Data Researcher + Social media', link: null },
    {
      date: '02.25.26',
      description: <>Finishes building <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.gourmetai.run">Gourmet AI Waitlist</a> and is live</>,
      link: 'https://www.gourmetai.run',
    },
    { date: '02.24.26', description: 'Joins MathGPT for Growth', link: null },
    { date: '02.23.26', description: 'Hits 1k subscribers on Youtube', link: null },
    {
      date: '02.23.26',
      description: <>Finishes building <a className="underline" target="_blank" rel="noopener noreferrer" href="https://www.bouncebackpickle.com">BounceBack PickleBall Website</a></>,
      link: 'https://www.bouncebackpickle.com',
    },
    { date: '02.21.26', description: '1st in Impromptu Sales Speech & Debate at Marshalls University Speech Tournament', link: null },
    {
      date: '02.21.26',
      description: <>The <a className="underline" target="_blank" rel="noopener noreferrer" href="https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_">YT Documentary Video</a> gets 10k views</>,
      link: 'https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_',
    },
    { date: '02.16.26', description: 'Cofounds 2nd startup, Travel App', link: null },
    {
      date: '02.10.26',
      description: <>Posts his first <a className="underline" target="_blank" rel="noopener noreferrer" href="https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_">YT Documentary Video</a></>,
      link: 'https://youtu.be/rsYSeIQ_LV8?si=CBHo9J55WQqPj5X_',
    },
    { date: '02.10.26', description: 'Posts first series of shortform content', link: null },
    { date: '02.07.26', description: 'Qualified for State Speech & Debate', link: null },
    { date: '02.05.26', description: 'Starts playing Drums', link: null },
    { date: '02.02.26', description: 'Qualified for Regionals Speech & Debate', link: null },
    { date: '01.17.26', description: 'Starts working with Jackson Sword/parasocial', link: null },
    { date: '01.13.26', description: 'Starts working with Dillon/BounceBack pickleball', link: null },
    { date: '01.01.26', description: 'Skiing for the first time', link: null },
    { date: '12.29.25', description: 'Stops working with Mau/Prayer Lock', link: null },
    { date: '12.05.25', description: 'Generates 14k for Prayer Lock doing 2k MRR previously (7X the business)', link: null },
    {
      date: '12.04.25',
      description: <>Posts his first <a className="underline" target="_blank" rel="noopener noreferrer" href="https://x.com/MattyparkW/status/1996768218082418915">X post</a></>,
      link: 'https://x.com/MattyparkW/status/1996768218082418915',
    },
    { date: '12.01.25', description: 'Starts building his first solo AI app', link: null },
    { date: '11.19.25', description: 'Matthew Cofounds an Prayer Lock with Mau', link: null },
    { date: '11.17.25', description: 'Matthew redesigns his portfolio website', link: null },
    { date: '11.08.25', description: 'Creates first portfolio website', link: null },
    {
      date: '11.03.25',
      description: <>Joins <a className="underline" target="_blank" rel="noopener noreferrer" href="https://turbo.ai">Turbolearn AI</a> as growth</>,
      link: 'https://turbo.ai',
    },
    { date: '11.03.25', description: 'Starts doing UGC', link: null },
    { date: '11.02.25', description: <>Signed first client for consulting/marketing strategies</>, link: null },
    { date: '10.28.25', description: 'Matthew starts his own consulting company', link: null },
    { date: '10.02.25', description: 'Recieves 30+ UGC offers', link: null },
    { date: '08.13.25', description: 'First viral talking head video on TikTok', link: null },
    { date: '07.29.25', description: 'Visits switzerland', link: null },
    { date: '06.10.25', description: 'Creates his first telegram bot', link: null },
    { date: '03.06.25', description: 'KMEA All-state Alto Saxaphone 2nd Chair (again)', link: null },
    { date: '12.19.24', description: 'Drops Career high 22 points in Basketball', link: null },
    { date: '03.02.24', description: 'KMEA All-state Alto Saxaphone 2nd Chair', link: null },
    { date: '11.09.22', description: 'Starts reselling Prime/candy', link: null },
    { date: '09.01.22', description: '3.0 UTR Tennis rank', link: null },
    { date: '08.10.22', description: 'Starts playing Saxaphone', link: null },
    { date: '06.03.22', description: 'Starts playing Guitar', link: null },
    { date: '03.19.22', description: 'First TikTok posted', link: null },
    { date: '11.19.21', description: "Starts playing Basketball", link: null },
    { date: '01.07.21', description: 'Starts playing Tennis', link: null },
    { date: '07.28.20', description: 'Matthew posts his first video on Youtube', link: null },
    { date: '03.14.18', description: 'Matthew plays his first video game (Fortnite)', link: null },
    { date: '10.12.10', description: 'Matthew is born', link: null },
  ]

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden text-foreground">
      <SiteChrome />

      <SideRoomsRail />

      {/* Main Content — timeline */}
      <main data-smooth-scroll className="tracking-tight no-scrollbar relative h-screen w-screen overflow-y-auto flex flex-col gap-4 items-start justify-start sm:pl-10 pl-6 sm:pr-40 pr-6 pt-6 sm:pt-8 pb-32">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.02, ease: "easeOut" }}
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
        className="fixed bottom-0 z-10 flex flex-row items-end justify-between tracking-tight w-full sm:px-10 px-6 pb-4 sm:pb-5 pt-16 font-mono text-[11px] text-foreground/50"
        style={{
          background: 'linear-gradient(to top, #ffffff 30%, rgba(255,255,255,0))',
        }}
      >
        <span>All rights reserved. ©2026 Matthew Park</span>
        <span className="tabular-nums">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </span>
      </motion.div>
    </div>
  )
}

export default Timeline
