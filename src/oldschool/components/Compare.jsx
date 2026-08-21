import React, { useCallback, useRef, useState } from 'react'

// Before/after wipe. Built on pointer events and clip-path rather than
// framer-motion: the app is wrapped in <MotionConfig reducedMotion="always">,
// so a framer-driven divider would never move.
//
// Dragging is pointer-capture based, which covers mouse, touch and pen in one
// path. Arrow keys move the divider for anyone not using a pointer.

const STEP = 4
const clamp = (n) => Math.min(100, Math.max(0, n))

const Compare = ({ before, after, label, note, alt }) => {
  const [position, setPosition] = useState(50)
  const [missing, setMissing] = useState(false)
  const frameRef = useRef(null)

  const moveTo = useCallback((clientX) => {
    const frame = frameRef.current
    if (!frame) return
    const { left, width } = frame.getBoundingClientRect()
    if (!width) return
    setPosition(clamp(((clientX - left) / width) * 100))
  }, [])

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    moveTo(event.clientX)
  }

  const handlePointerMove = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    moveTo(event.clientX)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') setPosition((p) => clamp(p - STEP))
    else if (event.key === 'ArrowRight') setPosition((p) => clamp(p + STEP))
    else if (event.key === 'Home') setPosition(0)
    else if (event.key === 'End') setPosition(100)
    else return
    event.preventDefault()
  }

  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={frameRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative w-full overflow-hidden rounded-2xl border border-border bg-foreground/[0.03] aspect-video touch-none select-none cursor-ew-resize"
      >
        {missing ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="font-ibm text-[11px] uppercase tracking-widest text-muted-foreground">
              Frame not supplied yet
            </p>
          </div>
        ) : (
          <>
            {/* Graded sits underneath; the log frame is clipped away from the left. */}
            <img
              src={after}
              alt={alt ? `${alt} — graded` : 'Graded'}
              onError={() => setMissing(true)}
              draggable="false"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <img
              src={before}
              alt={alt ? `${alt} — ungraded log` : 'Ungraded log'}
              onError={() => setMissing(true)}
              draggable="false"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            />

            <span className="pointer-events-none absolute left-3 top-3 font-ibm text-[10px] uppercase tracking-widest text-white mix-blend-difference">
              Log
            </span>
            <span className="pointer-events-none absolute right-3 top-3 font-ibm text-[10px] uppercase tracking-widest text-white mix-blend-difference">
              Graded
            </span>
          </>
        )}

        {/* Divider + handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={label ? `${label} — before and after` : 'Before and after'}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% ungraded`}
          onKeyDown={handleKeyDown}
          className="absolute inset-y-0 z-10 w-px bg-custom outline-none"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-custom">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 3 2 6l2.5 3" />
              <path d="M7.5 3 10 6l-2.5 3" />
            </svg>
          </span>
        </div>
      </div>

      {(label || note) && (
        <figcaption className="flex flex-row items-baseline justify-between gap-4 font-ibm text-[11px] text-muted-foreground">
          {label && <span className="uppercase tracking-widest">{label}</span>}
          {note && <span className="text-right">{note}</span>}
        </figcaption>
      )}
    </figure>
  )
}

export default Compare
