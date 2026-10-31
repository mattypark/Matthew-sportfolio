// The driver card: block 01's opening frame, after the 2026 F1 titles.
//
// A signature first name over a heavy extended surname that wipes in letter
// by letter, the surname again as giant outline letters sliding behind him,
// the number in two corners and the place letterspaced in the third. The
// outline name rolls right forever, the numbers sway, and the lockup keeps
// rewriting itself: signature, then the surname letter by letter, a hold,
// a wipe out, again. The scroll carries the whole card off.
//
// The lockup is two identical rows laid over each other: one shows only the
// signature, the other only the surname. The surname row is blended with
// `difference`, so it reads black on the white studio and white across his
// shirt; the signature has to stay green, so it cannot share that row.

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { title } from '../content.js'

function Lockup({ show, rowRef }) {
  return (
    <div className={`ttl__lock ttl__lock--${show}`} ref={rowRef}>
      <span className="ttl__first">{title.first}</span>
      <span className="ttl__last">
        {[...title.last].map((ch, i) => (
          <span key={i} style={{ '--k': i }}>
            {ch}
          </span>
        ))}
      </span>
    </div>
  )
}

const Title = forwardRef(function Title(_props, ref) {
  const sign = useRef(null)
  const name = useRef(null)
  const ghost = useRef(null)
  const marks = useRef(null)

  useImperativeHandle(ref, () => ({
    // out: 0 resting .. 1 gone; drift: px of scroll for the slow slide
    update({ out, drift }) {
      if (!name.current) return
      const o = Math.min(1, Math.max(0, out))
      const clip = `inset(0 0 0 ${(o * 100).toFixed(2)}%)`
      const shift = `translate3d(${(-o * 80).toFixed(1)}px, 0, 0)`
      for (const row of [sign.current, name.current]) {
        row.style.clipPath = clip
        row.style.transform = shift
      }
      ghost.current.style.transform = `translate3d(${(-drift * 0.18).toFixed(1)}px, 0, 0)`
      marks.current.style.opacity = String(1 - o)
    },
  }))

  return (
    <div className="ttl" aria-hidden="true">
      <div className="ttl__ghost" ref={ghost}>
        {/* two copies on one track: sliding it one copy's width loops forever */}
        <div className="ttl__track">
          <span>{title.last}</span>
          <span>{title.last}</span>
        </div>
      </div>
      <div className="ttl__marks" ref={marks}>
        <p className="ttl__num ttl__num--tl">{title.number}</p>
        <p className="ttl__team">{title.team}</p>
        <p className="ttl__num ttl__num--br">{title.number}</p>
      </div>
      <Lockup show="name" rowRef={name} />
      <Lockup show="sign" rowRef={sign} />
    </div>
  )
})

export default Title
