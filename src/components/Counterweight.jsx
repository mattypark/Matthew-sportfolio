import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Counterweight() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = root.current.querySelectorAll('.cw-word')
      gsap.from(words, {
        opacity: 0.15,
        duration: 1,
        stagger: 0.04,
        scrollTrigger: {
          trigger: root.current,
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const statement =
    'BE CAUTIOUS OF WHAT YOU LISTEN AND CONSUME, FOR IT WILL SHAPE YOUR MIND, FUTURE, AND YOU. ENVIRONMENT IS EVERYTHING, BECAUSE THEN YOU WENT FROM ASKING "WHY?" TO "WHY NOT?"'

  return (
    <section
      id="counterweight"
      ref={root}
      className="section-dark relative gutter py-[22vh]"
    >
      <p className="max-w-[1200px] mx-auto font-display text-[clamp(40px,6.5vw,110px)] leading-[0.95] tracking-[-0.02em]">
        {statement.split(' ').map((w, i) => (
          <span key={i} className="cw-word inline-block mr-[0.18em]">
            {w}
          </span>
        ))}
      </p>


    </section>
  )
}
