/**
 * Everything on /lut that Matthew edits without touching a component.
 *
 * Rule for this file, same as the media kit: nothing here may be invented.
 * Anything not yet real ships as `PLACEHOLDER` and the page marks it visibly,
 * so a buyer never sees a fabricated claim or downloads someone else's LUT.
 * Flip `ready` to true once the real files land in /public/lut.
 */

export const product = {
  name: 'Matthew 01',
  /** Shown as-is. Keep it to one line. */
  tagline: 'The grade I use on everything. One .cube, log to Rec.709, no fixing after.',
  price: 5,
  currency: 'USD',
  lot: 'LOT NO. 001',
  size: '16×16×16',
  format: '.cube',
  colorSpace: 'Rec.709',
  /**
   * Log profiles this was actually built against. A LUT that claims cameras it
   * was never tested on gets refunded, so only list what has been run.
   */
  builtFor: ['Sony S-Log3'],
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
    note: 'Straight off the card, then one click.',
    before: '/lut/before-01.jpg',
    after: '/lut/after-01.jpg',
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

/**
 * What is still missing before this page can take money, worked out from the
 * data above rather than tracked by hand — a boolean someone forgets to flip
 * is worse than no flag at all. Empty array means the page is live, and the
 * warning block disappears on its own.
 */
export function outstanding() {
  const missing = []
  if (!product.stripeUrl) missing.push('Stripe payment link (product.stripeUrl)')
  if (product.builtFor.some((p) => p.startsWith('PLACEHOLDER'))) {
    missing.push('which camera and log profile this was graded for (product.builtFor)')
  }
  return missing
}
