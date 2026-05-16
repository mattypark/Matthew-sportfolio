import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Walk a paragraph, split every text node into per-word spans while preserving
// the styling of any inline spans (hl-red / italic-fraunces / etc.) by leaving
// those wrapper spans in place around the new word spans.
function splitIntoWords(rootEl) {
  const words = []

  const walk = (node) => {
    // Snapshot childNodes so replacement doesn't mutate iteration
    const children = Array.from(node.childNodes)
    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent
        if (!text || !text.trim()) return

        const tokens = text.split(/(\s+)/) // keep whitespace for spacing
        const frag = document.createDocumentFragment()

        tokens.forEach((t) => {
          if (!t) return
          if (/^\s+$/.test(t)) {
            frag.appendChild(document.createTextNode(' '))
          } else {
            const span = document.createElement('span')
            span.className = 'm-word'
            span.style.display = 'inline-block'
            span.style.willChange = 'transform, opacity'
            span.textContent = t
            frag.appendChild(span)
            words.push(span)
          }
        })

        child.parentNode.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Recurse — words inside styled spans will inherit their color.
        walk(child)
      }
    })
  }

  walk(rootEl)
  return words
}

export default function Manifesto() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = root.current.querySelectorAll('.m-line')

      lines.forEach((line) => {
        const words = splitIntoWords(line)
        if (!words.length) return

        gsap.fromTo(
          words,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: line,
              start: 'top 90%',
              end: 'bottom 60%',
              scrub: 0.8,
            },
          }
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="relative gutter py-[18vh]">
      <div className="max-w-[1280px] mx-auto font-display text-[clamp(34px,5vw,84px)] leading-[0.95] tracking-[-0.02em]">
        <p className="m-line">
          I'VE CREATED CONTENT FOR <span className="hl-red">50K+ FOLLOWERS</span> AND THIS YEAR
          I HIT <span className="hl-red">30M+ VIEWS</span> AT 15 YEARS OLD. ADDITIONALLY, I FOLLOW 
          MY PASSION FOR COMPUTER SCIENCE, AI, ENTREPRENEURSHIP, AND CONTENT CREATION. ANYTHING IS
          <span className="italic-fraunces hl-blue normal-case font-normal"> POSSIBLE </span>
          I BELIEVE IN <span className="hl-red">GOD, SHIPPING PRODUCTS, CREATING THINGS THAT IMPACT MILLIONS UPON BILLIONS </span>
          ON SUNDAY AND SEEING WHO TRIES TO USE IT MONDAY.
        </p>
        <p className="m-line mt-10">
          I HATE THE WORD <span className="hl-fade">"VISIONARY"</span>.
          I HATE LANDING PAGES WHERE THE PRODUCT IS A WAITLIST.
          I HATE PEOPLE WHO TALK ABOUT BUILDING MORE THAN THEY BUILD.
        </p>
        <p className="m-line mt-10 hl-fade text-[clamp(20px,2.2vw,32px)] font-mono normal-case font-normal tracking-normal leading-relaxed">
          // I talk a lot, probably more than I should, I think that's good :)
        </p>
      </div>
    </section>
  )
}
