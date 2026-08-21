/**
 * Everything on /lut that Matthew edits without touching a component.
 *
 * Rule for this file, same as the media kit: nothing here may be invented.
 * Anything not yet real ships as `PLACEHOLDER` and the page marks it visibly,
 * so a buyer never sees a fabricated claim or downloads someone else's LUT.
 * Flip `ready` to true once the real files land in /public/lut.
 */

/** Set true only when the real .cube and real frames are in /public/lut. */
export const ready = false

export const product = {
  name: 'Matthew 01',
  /** Shown as-is. Keep it to one line. */
  tagline: 'The grade I use on everything. One .cube, log to Rec.709, no fixing after.',
  price: 5,
  currency: 'USD',
  lot: 'LOT NO. 001',
  size: '33×33×33',
  format: '.cube',
  colorSpace: 'Rec.709',
  /**
   * Log profiles this was actually built against. Matthew fills these in —
   * a LUT that claims cameras it was never tested on gets refunded.
   */
  builtFor: ['PLACEHOLDER — which log profile did you grade this against?'],
  /** Stripe Payment Link. Matthew creates it; paste the URL here. */
  stripeUrl: '',
}

/**
 * Before/after pairs. `before` is the ungraded log frame, `after` is the same
 * frame with the LUT applied — same frame, or the comparison is a lie.
 */
export const conversions = [
  {
    id: 'c1',
    label: 'Frame 01',
    note: 'PLACEHOLDER — drop the real pair in /public/lut',
    before: '/lut/before-01.jpg',
    after: '/lut/after-01.jpg',
  },
]

/**
 * Real posts, graded with this LUT. Thumbnails link out — the page never
 * embeds a player, which keeps LCP down.
 */
export const shotOnIt = [
  {
    id: 'v1',
    title: 'PLACEHOLDER — pick 4–8 real posts',
    platform: 'YouTube',
    url: 'https://www.youtube.com/@Matty_park',
    poster: '/lut/shot-01.jpg',
  },
]

export const install = [
  {
    app: 'Premiere Pro',
    steps: 'Lumetri Color → Creative → Look → Browse → pick the .cube.',
  },
  {
    app: 'DaVinci Resolve',
    steps: 'Project Settings → Color Management → Lookup Tables → Open LUT Folder, drop it in, Update Lists. Then right-click a clip → LUT.',
  },
  {
    app: 'Final Cut Pro',
    steps: 'Add the Custom LUT effect to the clip → LUT → Choose Custom LUT.',
  },
  {
    app: 'CapCut',
    steps: 'Adjust → LUT → Import → select the .cube.',
  },
]

export const faq = [
  {
    q: 'What do I actually get?',
    a: 'One .cube file. It works in Premiere, DaVinci, Final Cut, and CapCut — desktop and mobile.',
  },
  {
    q: 'Will it work on my footage?',
    a: 'It is built for the log profiles listed in the spec. On anything else it will still apply, it just will not land the same. Shoot log, expose properly, then apply.',
  },
  {
    q: 'Can I use it on client work?',
    a: 'Yes. Use it on anything you make. You just cannot resell or redistribute the file itself.',
  },
  {
    q: 'Refunds?',
    a: 'It is five dollars and it is a file. Email me and I will sort it out.',
  },
]

export const claim = {
  /** Platforms accepted as proof of a repost. */
  platforms: ['Instagram', 'TikTok', 'YouTube', 'X'],
  email: 'mattyparkbusiness@gmail.com',
}
