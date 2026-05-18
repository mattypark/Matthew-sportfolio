import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from './hooks/useLenis'

import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import EdgeSquiggle from './components/EdgeSquiggle'
import AudioPrompt from './components/AudioPrompt'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Works from './components/Works'
import SongsOfTheWeek from './components/SongsOfTheWeek'
import Masterpiece from './components/Masterpiece'
import Counterweight from './components/Counterweight'
import TheLoop from './components/TheLoop'
import Contact from './components/Contact'
import Colophon from './components/Colophon'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [booted, setBooted] = useState(false)
  useLenis()

  return (
    <>
      {!booted && <Loader onDone={() => setBooted(true)} />}

      <Cursor />
      <EdgeSquiggle side="left" />
      <EdgeSquiggle side="right" />
      <Nav />

      <main>
        <Hero booted={booted} />
        <Manifesto />
        <Works />
        <SongsOfTheWeek />
        <Masterpiece />
        <Counterweight />
        <TheLoop />
        <Contact />
      </main>

      <Colophon />
      <AudioPrompt />
    </>
  )
}
