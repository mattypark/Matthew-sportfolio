import React from 'react'
import { motion } from 'framer-motion'
import SiteChrome from './SiteChrome'
import SideRoomsRail from './SideRoomsRail'

const inspirations = [
  {
    name: 'Peter Thiel',
    title: 'Venture Capitalist & Author',
    handle: 'peterthiel',
    link: 'https://x.com/peterthiel',
    photo: '/inspiration-peter.jpg',
    why: 'Reading his book and story opens me up to so much more perspectives in business/startups. It truly made me understand more about how this game really works.',
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
  {
    name: 'Trey Gustafson',
    title: 'Entrepreneur',
    handle: 'treygustafson_',
    link: 'https://www.instagram.com/treygustafson_/',
    photo: '/inspiration-trey.jpg',
    why: 'Trey is the first reason why I ever got into entrepreneurship. Watched his content ever since 2 years ago, and his content expertise is what I study almost a weekly basis. He\'s the definition of an inspiration and a teenage entrepreneur for me.',
  },
]

const Inspiration = () => {
  return (
    <div className="min-h-screen text-foreground">
      <SiteChrome />

      <main className="sm:pl-10 px-6 sm:pr-44 pt-32 sm:pt-40 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument text-7xl sm:text-8xl tracking-tight mb-6 text-foreground"
        >
          Inspiration
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-sm text-foreground/60 max-w-lg mb-16 leading-relaxed"
        >
          People I look up to, who I aspire to be, and why they inspire me every day. Not in any particular order.
        </motion.p>

        <div className="flex flex-col gap-24">
          {inspirations.map((person, i) => (
            <motion.div
              key={person.handle}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i === 0 ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start"
            >
              <div className="w-full sm:w-[320px] shrink-0">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-full rounded-2xl object-cover aspect-[3/4] grayscale"
                />
              </div>

              <div className="flex flex-col gap-4 max-w-lg">
                <p className="font-mono text-[11px] text-foreground/40 uppercase tracking-widest">{person.title}</p>
                <h2 className="font-instrument text-3xl sm:text-4xl leading-snug tracking-tight text-foreground">
                  {person.name}
                </h2>
                <a
                  href={person.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-foreground/50 hover:text-[color:var(--color-custom)] transition-colors"
                >
                  @{person.handle}
                </a>
                <p className="font-mono text-sm leading-relaxed text-foreground/80">
                  {person.why}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <SideRoomsRail />
    </div>
  )
}

export default Inspiration
