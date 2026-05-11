import React from 'react'
import { motion } from 'framer-motion'
import SiteChrome from './SiteChrome'
import SideRoomsRail from './SideRoomsRail'

const aboutPhoto = '/matthewflowers.png'

const About = () => {
  return (
    <div className="min-h-screen text-foreground">
      <SiteChrome />

      <main className="sm:pl-10 px-6 sm:pr-44 pt-32 sm:pt-40 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-instrument text-7xl sm:text-8xl tracking-tight mb-16 text-foreground"
        >
          About
        </motion.h1>

        <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 items-center">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6 max-w-lg"
          >
            <p className="font-mono text-[11px] text-foreground/40 uppercase tracking-widest">Matthew Park</p>
            <h2 className="font-instrument text-3xl sm:text-4xl leading-snug tracking-tight text-foreground">
              Who is Matthew Park?
            </h2>
            <div className="flex flex-col gap-4 font-mono text-sm leading-relaxed text-foreground/80">
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

      <SideRoomsRail />
    </div>
  )
}

export default About
