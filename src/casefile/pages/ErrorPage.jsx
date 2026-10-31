// Error: the 404 as a line call. The lawn, a service box drawn in hairline,
// a driver card that reads "Out 404", the word sliding huge behind it.
// Also serves every unknown URL.

import { BallMark } from '../ui/Loader.jsx'
import { GoLink } from '../ui/transition.jsx'
import { PlusMark } from '../ui/Bar.jsx'
import { errorPage } from '../content.js'

export default function ErrorPage() {
  return (
    <main className="err" aria-labelledby="err-title">
      <div className="err__ghost" aria-hidden="true">
        {errorPage.ghost}
      </div>
      <span className="err__court" aria-hidden="true" />

      <p className="err__num err__num--tl" aria-hidden="true">
        {errorPage.last}
      </p>
      <p className="err__team" aria-hidden="true">
        {errorPage.team}
      </p>
      <p className="err__num err__num--br" aria-hidden="true">
        {errorPage.last}
      </p>

      <h1 id="err-title" className="err__lock">
        <span className="err__first">{errorPage.first}</span>
        <span className="err__last">
          {[...errorPage.last].map((ch, i) => (
            <span key={i} style={{ '--k': i }}>
              {ch}
            </span>
          ))}
        </span>
      </h1>

      <p className="err__line cf-ui">{errorPage.line}</p>
      <GoLink to="/" className="err__back cf-ui">
        <BallMark className="cf-plus" />
        {errorPage.back}
        <PlusMark />
      </GoLink>
    </main>
  )
}
