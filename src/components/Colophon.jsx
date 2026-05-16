export default function Colophon() {
  return (
    <footer className="section-dark relative gutter border-t border-ink/15 py-12">
      <div className="grid grid-cols-12 gap-6 font-mono text-[11px] tracking-[0.18em] uppercase text-ink/70">
        {/* MY PERSONALITY */}
        <div className="col-span-12 md:col-span-3">
          <div className="text-ink/50 mb-3">// MY PERSONALITY</div>
          <ul className="space-y-1 text-ink/85">
            <li>ENTJ</li>
            <li>VERY EXTROVERTED</li>
            <li>LOVE TO TALK</li>
            <li>EXPRESS HOW I FEEL</li>
            <li>DANCE WHEN MUSIC HITS</li>
          </ul>
        </div>

        {/* WHAT I LIKE */}
        <div className="col-span-12 md:col-span-3">
          <div className="text-ink/50 mb-3">// WHAT I LIKE</div>
          <ul className="space-y-1 text-ink/85">
            <li>TENNIS</li>
            <li>CONTENT CREATION</li>
            <li>MAKING THINGS THAT MATTER</li>
            <li>FUN WITH ANYONE AROUND</li>
          </ul>
        </div>

        {/* ONE UNIQUE THING ABOUT ME */}
        <div className="col-span-12 md:col-span-3">
          <div className="text-ink/50 mb-3">// ONE UNIQUE THING ABOUT ME</div>
          <p className="italic-fraunces text-[13px] leading-[1.5] tracking-normal normal-case text-ink/85">
            every night at 8:55 i walk to the front of my neighborhood, watch the sunset, and listen to <span style={{ color: 'var(--primary)' }}>godspeed</span> by frank ocean. just to think about everything.
          </p>
        </div>

        {/* SIGNATURE BLOCK */}
        <div className="col-span-12 md:col-span-3 flex flex-col justify-between gap-6 md:items-end md:text-right">
          <div>
            <div className="text-ink/50 mb-3">// SIGNED</div>
            <div className="font-display text-[44px] leading-none text-ink normal-case">
              MP<span style={{ color: 'var(--primary)' }}>.</span>
            </div>
            <div className="mt-2 italic-fraunces text-[13px] tracking-normal normal-case text-ink/60">
              i'm just a 15 year old :)
            </div>
          </div>
          <a
            href="#top"
            data-hover
            className="self-start md:self-end inline-flex items-center gap-2 text-ink/75 hover:text-ink"
          >
            BACK TO TOP <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-ink/15 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-ink/45">
        <span>© 2026 MATTHEW PARK</span>
        <span>END.</span>
      </div>
    </footer>
  )
}
