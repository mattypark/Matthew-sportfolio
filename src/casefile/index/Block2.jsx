// Block 02: the lawn. Matthew from behind (the subway shot, cut out) as a
// pure white shape on mown Wimbledon stripes; two columns of words rise up
// his back, the age is printed huge and turned on its side, and out on both
// flanks a reel of him playing tennis cycles through its moves.
//
// Everything moves from IndexPage's loop through the handle below; this file
// is markup only.

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { PlusMark } from '../ui/Bar.jsx'
import { block2 } from '../content.js'
import TennisReel from './TennisReel.jsx'

export const BACK_SRC = '/casefile/back.webp'

const Block2 = forwardRef(function Block2(_props, ref) {
  const root = useRef(null)
  const top = useRef(null)
  const cols = useRef(null)
  const back = useRef(null)
  const on = useRef(false)
  const isOn = useRef(() => on.current).current

  useImperativeHandle(ref, () => ({
    // clip: the speed-band clip-path; travel: px block 02 has scrolled;
    // foot: the footer's progress, which the captions leave ahead of
    update({ clip, travel, foot, vh }) {
      const el = root.current
      if (!el) return
      on.current = clip !== 'polygon(0 0, 0 0, 0 0)'
      el.style.visibility = on.current ? 'visible' : 'hidden'
      if (!on.current) return
      el.style.clipPath = clip
      back.current.style.transform = `translate3d(-50%, ${(-travel * 0.04).toFixed(1)}px, 0)`
      cols.current.style.transform = `translate3d(-50%, ${(vh * 0.62 - travel * 0.55).toFixed(1)}px, 0)`
      const quiet = String(Math.max(0, 1 - foot * 1.6))
      top.current.style.opacity = quiet
      el.style.setProperty('--corner-a', quiet)
    },
  }))

  return (
    <section className="b2 cf-ui" ref={root} aria-label="Who">
      <span className="b2__mow" aria-hidden="true" />
      <div className="b2__corner b2__corner--l">
        <p className="a">{block2.corners[0]}</p>
        <div className="b">
          {block2.corners.slice(1).map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
      </div>
      <div className="b2__corner b2__corner--r">
        <p className="a">{block2.corners[0]}</p>
        <div className="b">
          {block2.corners.slice(1).map((c) => (
            <p key={c}>{c}</p>
          ))}
        </div>
      </div>

      <div className="b2__top" ref={top}>
        <p className="b2__na">{block2.meta[0][0]}</p>
        <div className="b2__words">
          {block2.wordsL.slice(0, 11).map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
        <div className="b2__tag">
          <p className="cf-mono">{block2.number.slice(1)}</p>
          <div className="b2__frame">
            <span className="c tl" />
            <span className="c tr" />
            <span className="c bl" />
            <span className="c br" />
            <p>{block2.meta[1][0]}</p>
            <p className="cf-mono">{block2.meta[1][1]}</p>
          </div>
          <div className="b2__out">
            <span className="b2__vdots">
              <i />
              <i />
              <i />
            </span>
            <p>
              {block2.meta[2][0]}
              <br />
              <br />
              {block2.meta[2][1]}
            </p>
          </div>
        </div>
        <p className="b2__num" data-fixed>{block2.number}</p>
      </div>

      <img
        className="b2__back"
        ref={back}
        src={BACK_SRC}
        alt="Matthew from behind, waiting for a train"
        width="720"
        height="1528"
      />
      <TennisReel isOn={isOn} />

      <div className="b2__colmask">
        <div className="b2__cols" ref={cols}>
          <div className="b2__col b2__col--l">
            <PlusMark className="b2__mark" />
            {block2.wordsL.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
          <div className="b2__col b2__col--r">
            <p className="b2__mark2">
              / <PlusMark className="b2__mark" />
            </p>
            {block2.wordsR.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})

export default Block2
