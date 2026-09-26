import { useState } from 'react'
import Slot from './Slot'
import Marquee from './Marquee'
import { cortis } from '../data/repeat'

// The music chapter: CORTIS on repeat, and the reason — he started singing
// in March and auditioned for JYP in July. Official embeds only; nothing of
// theirs is rehosted. The embed loads on click so YouTube's JS never touches
// first paint.
function LiteYouTube({ id, title }) {
  const [on, setOn] = useState(false)
  if (!id) {
    return (
      <div className="lite lite--empty">
        <p className="mono">Paste a CORTIS video id into src/life/data/repeat.js</p>
      </div>
    )
  }
  if (on) {
    return (
      <iframe
        className="lite"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <button type="button" className="lite lite--poster" onClick={() => setOn(true)} aria-label={`Play ${title}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy" />
      <span className="lite__play" aria-hidden>
        ▶
      </span>
    </button>
  )
}

export default function OnRepeat() {
  return (
    <section id="repeat" className="sec sec--ink repeat" aria-labelledby="repeat-title">
      <div className="repeat__lights" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="sec-head">
        <p className="sec-index">07 / On repeat</p>
        <h2 id="repeat-title" className="sec-title">
          Color outside <em className="serif-em">the lines</em>
        </h2>
      </div>

      <div className="repeat__grid">
        <div className="repeat__story">
          <p className="repeat__lede">
            My favorite artist is <strong>CORTIS</strong> — five guys whose name literally means <em>color outside the
            lines</em>. It&apos;s the whole reason this site breaks its own grid in red marker.
          </p>
          <ul className="repeat__facts mono">
            <li>
              <span className="red">03.17.26</span> starts singing
            </li>
            <li>
              <span className="red">07.07.26</span> auditions for JYP
            </li>
            <li>
              <span className="red">since 08.10.22</span> alto sax, All-State twice
            </li>
          </ul>
          <div className="repeat__embed">
            <LiteYouTube id={cortis.youtubeId} title={cortis.title} />
            <p className="mono repeat__credit">
              {cortis.title} ·{' '}
              <a href={cortis.link} target="_blank" rel="noopener noreferrer">
                official ↗
              </a>
            </p>
          </div>
        </div>
        <div className="repeat__clips">
          <Slot id="jyp" className="repeat__clip" sizes="260px" />
          <Slot id="singing" className="repeat__clip repeat__clip--low" sizes="260px" />
          <Slot id="sax-solo" className="repeat__clip" sizes="260px" />
        </div>
      </div>

      <Marquee text="COLOR ✱ OUTSIDE ✱ THE ✱ LINES ✱" className="repeat__marquee" />
    </section>
  )
}
