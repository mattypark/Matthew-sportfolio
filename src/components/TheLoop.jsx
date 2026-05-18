import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// "The Loop" — scroll-scrubbed process diagram inspired by carlodoroff.com.
// A curvy SVG path draws itself as the section scrolls, nodes pop in at fixed
// progress points, and a green dot rides the path's tip like a build cursor.

const VIEWBOX_W = 1600
const VIEWBOX_H = 700

// Hand-tuned wavy path crossing the viewport. Single Catmull-ish bezier sweep.
const PATH_D = 'M 180 360 C 320 360, 380 250, 540 250 S 760 460, 900 460 S 1140 220, 1280 220 S 1500 360, 1520 360'

// Nodes positioned along the path. `t` ≈ normalized progress (0-1) at which
// the node should be on-screen and "alive". x/y are absolute path positions.
const NODES = [
  { id: 'notice',  t: 0.10, x: 220,  y: 360, label: ['NOTICE', 'a gap'],     variant: 'outline' },
  { id: 'build',   t: 0.30, x: 540,  y: 250, label: ['BUILD', 'fast'],       variant: 'outline' },
  { id: 'post',    t: 0.55, x: 900,  y: 460, label: ['POST IT', 'raw'],      variant: 'filled'  },
  { id: 'listen',  t: 0.78, x: 1280, y: 220, label: ['LISTEN', 'to DMs'],    variant: 'outline' },
  { id: 'loop',    t: 0.95, x: 1500, y: 350, label: ['LOOP', 'again'],       variant: 'ghost'   },
]

export default function TheLoop() {
  const root = useRef(null)
  const pathRef = useRef(null)
  const dotRef = useRef(null)
  const [pathLen, setPathLen] = useState(0)

  useLayoutEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  useEffect(() => {
    if (!pathLen) return
    const ctx = gsap.context(() => {
      const path = pathRef.current

      // Draw path on scroll
      gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen })
      gsap.set('.loop-node', { scale: 0, opacity: 0, transformOrigin: '50% 50%' })
      gsap.set('.loop-title', { y: 16, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      tl.to('.loop-title', { y: 0, opacity: 1, duration: 0.1, ease: 'power2.out' }, 0)
      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)

      // Node reveal at its `t` along the timeline.
      NODES.forEach((n) => {
        tl.to(`.loop-node[data-id="${n.id}"]`, {
          scale: 1,
          opacity: 1,
          duration: 0.06,
          ease: 'back.out(2)',
        }, n.t)
      })

      // Green dot rides the path tip.
      const tickerObj = { p: 0 }
      tl.to(tickerObj, {
        p: 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => {
          if (!dotRef.current) return
          const pt = path.getPointAtLength(tickerObj.p * pathLen)
          dotRef.current.setAttribute('cx', pt.x)
          dotRef.current.setAttribute('cy', pt.y)
        },
      }, 0)
    }, root)
    return () => ctx.revert()
  }, [pathLen])

  return (
    <section id="loop" ref={root} className="relative bg-paper" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper flex flex-col items-center justify-center">
        <div className="loop-title font-mono text-[11px] tracking-[0.32em] uppercase mb-6" style={{ color: 'rgba(15,14,12,0.55)' }}>
          THE LOOP · HOW I ACTUALLY BUILD
        </div>

        <div className="relative w-[94%] max-w-[1400px] aspect-[16/7]">
          <svg
            viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.85"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {NODES.map((n) => {
              const r = 46
              const fill =
                n.variant === 'filled' ? 'var(--primary)' :
                n.variant === 'ghost'  ? 'rgba(80,70,55,0.18)' :
                'var(--paper)' // occludes the path beneath outline nodes
              const stroke =
                n.variant === 'filled' ? 'var(--primary)' :
                n.variant === 'ghost'  ? 'rgba(15,14,12,0.45)' :
                'var(--ink)'
              const textFill =
                n.variant === 'filled' ? 'var(--paper)' :
                n.variant === 'ghost'  ? 'rgba(15,14,12,0.55)' :
                'var(--ink)'
              return (
                <g key={n.id} className="loop-node" data-id={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <circle r={r} fill={fill} stroke={stroke} strokeWidth="1.4" />
                  {n.label.map((line, i) => (
                    <text
                      key={i}
                      x="0"
                      y={(i - (n.label.length - 1) / 2) * 14 + 4}
                      textAnchor="middle"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                      fontSize="11"
                      letterSpacing="1.2"
                      fill={textFill}
                    >
                      {line.toUpperCase()}
                    </text>
                  ))}
                </g>
              )
            })}

            <circle
              ref={dotRef}
              cx="180"
              cy="360"
              r="7"
              fill="var(--primary)"
              stroke="var(--ink)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
