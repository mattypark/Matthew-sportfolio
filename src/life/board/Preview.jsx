import { timeline, stamp } from '../data/timeline'
import { now } from '../data/now'
import { EMAIL, socials } from '../data/site'

const latest = timeline
  .filter((e) => !e.plan)
  .slice(-3)
  .reverse()

// What a box shows while it's focused: a taste of the panel behind it,
// pulled from the same data so it never drifts. Spans, not a list: it
// renders inside a <button>, which only allows phrasing content.
const PREVIEWS = {
  timeline: () => (
    <>
      {latest.map((e) => (
        <span className="box__pline" key={`${e.date}-${e.title}`}>
          <b>{stamp(e.date)}</b> {e.title}
        </span>
      ))}
    </>
  ),
  now: () => (
    <>
      {now.map((n) => (
        <span className="box__pline" key={n.id}>
          <b>{n.name}</b> {n.role.toLowerCase()} · {n.tag}
        </span>
      ))}
    </>
  ),
  contact: () => (
    <>
      <span className="box__pline">
        <b>{EMAIL.split('@')[0]}</b>
      </span>
      <span className="box__pline">@{EMAIL.split('@')[1]}</span>
      <span className="box__pline">{socials.map((s) => s.short).join(' · ')}</span>
    </>
  ),
  personality: () => (
    <>
      <span className="box__pline">
        <b>sax</b> All-State ×2
      </span>
      <span className="box__pline">
        <b>tennis</b> since 2021
      </span>
      <span className="box__pline">
        <b>+</b> drums, guitar, singing
      </span>
    </>
  ),
}

export default function Preview({ id }) {
  const Body = PREVIEWS[id]
  return (
    <span className="box__preview" aria-hidden>
      <Body />
    </span>
  )
}
