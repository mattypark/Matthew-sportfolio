// The instrument panel down both edges of block 01. Static markup except
// three live things, all written from IndexPage's frame loop through the refs:
// the green square that mirrors the pointer, the X/Y read-outs, and the
// slashed progress bar that reads the copy's scroll.

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { FIGURE_SRC } from '../fx/figure.js'
import { PLACE, hud, ledger } from '../content.js'

const SLASHES = '/'.repeat(120)

function Brackets() {
  return (
    <div className="hud__brackets" aria-hidden="true">
      <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0.5 6V0.5H6" fill="none" stroke="currentColor" /></svg>
      <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 0.5H5.5V6" fill="none" stroke="currentColor" /></svg>
    </div>
  )
}

function BracketsBottom() {
  return (
    <div className="hud__brackets" aria-hidden="true">
      <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0.5 0V5.5H6" fill="none" stroke="currentColor" /></svg>
      <svg width="6" height="6" viewBox="0 0 6 6"><path d="M0 5.5H5.5V0" fill="none" stroke="currentColor" /></svg>
    </div>
  )
}

const Hud = forwardRef(function Hud(_props, ref) {
  const root = useRef(null)
  const dot = useRef(null)
  const box = useRef(null)
  const readX = useRef(null)
  const readY = useRef(null)
  const fill = useRef(null)
  const count = useRef(null)

  useImperativeHandle(ref, () => ({
    // mx, my: pointer as a share of the viewport
    pointer(mx, my) {
      const b = box.current
      if (!b) return
      const w = b.clientWidth - 3
      const h = b.clientHeight - 3
      dot.current.style.transform = `translate3d(${(mx * w).toFixed(1)}px, ${(my * h).toFixed(1)}px, 0)`
      readX.current.textContent = String(Math.round(mx * 999)).padStart(3, '0')
      readY.current.textContent = String(Math.round(my * 999)).padStart(3, '0')
    },
    progress(p) {
      if (fill.current) fill.current.style.width = `${(p * 100).toFixed(2)}%`
    },
    // during the intro the bar and the 000 read-out are the loader
    loading(p) {
      this.progress(p)
      if (count.current) count.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
    },
    // at 100 the gauge sweeps back to zero before the scroll takes it over
    reset() {
      if (count.current) count.current.textContent = '000'
      fill.current?.classList.add('is-resetting')
      this.progress(0)
      setTimeout(() => fill.current?.classList.remove('is-resetting'), 700)
    },
    fade(a) {
      if (!root.current) return
      root.current.style.opacity = a.toFixed(3)
      root.current.style.visibility = a <= 0.001 ? 'hidden' : 'visible'
    },
  }))

  const ticker = [...hud.roles, ...hud.roles]
  const total = ledger.reduce((n, g) => n + g.rows.length, 0)
  const groups = [...ledger, ...ledger]

  return (
    <div className="hud cf-ui" ref={root} aria-hidden="true">
      {/* ---- left: map ---- */}
      <div className="hud__map" style={{ '--h': 0 }}>
        <div className="hud__mapbox" ref={box}>
          <span className="hud__corner hud__corner--tl" />
          <span className="hud__corner hud__corner--tr" />
          <span className="hud__corner hud__corner--bl" />
          <span className="hud__corner hud__corner--br" />
          <img className="hud__mini" src={FIGURE_SRC} alt="" width="75" height="68" />
          <span className="hud__dot" ref={dot} />
          <p className="hud__xy hud__xy--x" data-fixed>
            <b>X</b>
            <span className="cf-mono" ref={readX} data-fixed>000</span>
          </p>
          <p className="hud__xy hud__xy--y" data-fixed>
            <b>Y</b>
            <span className="cf-mono" ref={readY} data-fixed>000</span>
          </p>
        </div>
        <div className="hud__maplabels">
          <p className="l r1"><span className="hud__sep">//</span> {hud.tagTL[0]}</p>
          <p className="l r2 i1">{hud.tagTL[1]} <span className="hud__sep">//</span></p>
          <p className="r r1">{hud.tagTR[0]} <span className="hud__sep">//</span></p>
          <p className="r r2">{hud.tagTR[1]}</p>
        </div>
      </div>

      {/* ---- the two coordinates at a third of the height ---- */}
      <div className="hud__coord hud__coord--l" style={{ '--h': 1 }}>
        <p className="hud__sep">//</p>
        <p>{PLACE.lat}</p>
      </div>
      <div className="hud__coord hud__coord--r" style={{ '--h': 2 }}>
        <p>{PLACE.lon}</p>
        <p className="hud__sep">//</p>
      </div>

      {/* ---- left: bracketed panel ---- */}
      <div className="hud__panel" style={{ '--h': 3 }}>
        <Brackets />
        <div className="hud__panelbody">
          <div className="hud__row">
            <div className="hud__cellA hud__stack">
              <p className="hud__sep">//</p>
              <p>{hud.tagBL[0]}</p>
              <p>{hud.tagBL[1]}</p>
            </div>
            <div className="hud__cellB">
              <div className="top">
                <span className="hud__dot3" />
                <p className="hud__sep">//</p>
              </div>
              <p>{hud.tagBR[0]}</p>
              <p>{hud.tagBR[1]}</p>
            </div>
          </div>
          <div className="hud__row2">
            <div className="hud__dots">
              <span className="hud__dot3" />
              <span className="hud__dot3" />
              <span className="hud__dot3" />
            </div>
            <div className="hud__meta">
              {hud.protocol.map(([l, r]) => (
                <div className="hud__pair" key={l}>
                  <p className="l">{l}</p>
                  <p className="r cf-mono">{r}</p>
                </div>
              ))}
              <div className="hud__year">
                <p className="cf-mono">{hud.year[0]}</p>
                <p className="hud__sep">//</p>
                <p>{hud.year[1]}</p>
              </div>
              <svg className="hud__reg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" />
                <circle cx="5" cy="5" r="1.4" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        <BracketsBottom />
      </div>

      {/* ---- left: progress ---- */}
      <div className="hud__progress" style={{ '--h': 4 }}>
        <div className="hud__ends cf-mono">
          <p ref={count} data-fixed>000</p>
          <p>100</p>
        </div>
        <div className="hud__track">
          <p className="hud__slashes hud__slashes--dim">{SLASHES}</p>
          <div className="hud__fill" ref={fill}>
            <p className="hud__slashes">{SLASHES}</p>
          </div>
        </div>
      </div>

      {/* ---- right: ticker and ledger ---- */}
      <div className="hud__ticker" style={{ '--h': 5 }}>
        {/* two identical halves; each item carries its own trailing space so
            sliding by exactly half lands on a frame identical to the start */}
        <div className="hud__tick">
          {ticker.map((r, i) => (
            <span className="hud__tickitem" key={i}>
              {r} <span className="s">//</span>
            </span>
          ))}
        </div>
      </div>
      <div className="hud__ledger" style={{ '--h': 6 }}>
        <div className="hud__track2">
          {groups.map((g, gi) => (
            <div className="hud__grp" key={`${g.name}-${gi}`}>
              <p className="hud__name">{g.name}</p>
              <div className="hud__list">
                {g.rows.map(([label, n]) => (
                  <div className="hud__row3" key={label}>
                    <p>{label}</p>
                    <p className="cf-mono">{n}</p>
                  </div>
                ))}
                {gi % ledger.length === ledger.length - 1 && (
                  <div className="hud__row3 hud__tot">
                    <p className="cf-mono">[{total}]</p>
                    <p>In total</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="hud__scroll" style={{ '--h': 7 }}>{hud.scroll}</p>
    </div>
  )
})

export default Hud
