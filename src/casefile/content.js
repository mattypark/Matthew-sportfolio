// Every word on the case-file site. DRAFT copy, written from facts already on
// the live site (src/simple/content.js) so nothing is invented; Matthew is
// sending his own lines, and they replace these one for one.

import { AGE, EMAIL, socials } from '../simple/content.js'

export { AGE, EMAIL, socials }

export const NAME = 'Matthew Park'
export const PLACE = { city: 'Louisville', region: 'Kentucky', lat: '38.2527° N', lon: '085.7585° W' }
export const TIME_ZONE = 'America/Kentucky/Louisville'

// ---- index, block 01: the driver card --------------------------------------
export const title = {
  first: 'Matthew',
  last: 'Park',
  number: String(AGE),
  team: 'Kentucky',
}

// ---- index, block 01: the case file ---------------------------------------
// One sentence per line. The lines alternate left and right of the figure.
export const caseFile = [
  'Case file: the kid behind the screen',
  `Matthew Park is ${AGE}.`,
  'He is from Kentucky.',
  'Neither of those things slowed him down.',
  'He builds things.',
  'Then he ships them.',
  'Then he builds the next one before anyone asks.',
  'The first rule was simple.',
  'If it works on your laptop, it does not work yet.',
  'It works when a stranger uses it.',
  'So he put things in front of strangers.',
  'A lot of strangers.',
  'Seventy-five thousand of them follow along.',
  'Thirty million views later, he still reads the comments.',
  'The comments are where the real feedback lives.',
  'Then came Nudgy.',
  'An iPhone assistant that listens to your day.',
  'You say it in passing.',
  'It quietly does the next thing.',
  'No app to open. No form to fill.',
  'It was supposed to be a side project.',
  'It did not stay one.',
  'Then came Axiom Pathways.',
  'A nonprofit with one stubborn idea.',
  'The most passionate people should get the internship.',
  'Not the most credentialed.',
  'Eight hundred interns later, the idea still holds.',
  'Ten startups said yes.',
  'The goal is millions.',
  'He has played tennis since he was nine.',
  'Tennis teaches one thing well.',
  'The point is never over until it is.',
  'Kentucky taught him the other thing.',
  'You do not have to fit in every time.',
  'His eyes are on San Francisco.',
  'Kentucky has been told. Kentucky is fine with it.',
  'He is not in a hurry to grow up.',
  'He is in a hurry to make things.',
  'There is a difference.',
  'He learns by building.',
  'He steers by watching people use what he built.',
  'He breaks things on purpose.',
  'Then he fixes them on purpose.',
  'Design. Code. Content. Company.',
  'Different jobs.',
  'Same habit.',
  'Ship it.',
  'Watch it.',
  'Fix it.',
  'Ship it again.',
  'Most people wait until they are ready.',
  'He decided ready was a myth.',
  'Some nights that means no sleep.',
  'Most nights, actually.',
  'If you are reading this, the case is still open.',
  'Keep scrolling.',
  'He is probably building something right now.',
]

// ---- index HUD -------------------------------------------------------------
export const hud = {
  tagTL: ['Subject found', 'age ' + AGE],
  tagTR: ['Still building', 'do not disturb'],
  tagBL: ['Subject found', 'ky'],
  tagBR: ['Still building', 'do not disturb'],
  protocol: [['Protocol', String(AGE).padStart(5, '0')], ['Sleep', 'not found']],
  year: ['2026', 'forever'],
  roles: ['Founder', 'Builder', 'Designer', 'Engineer', 'Creator', 'Student'],
  scroll: 'Scroll',
}

// The right-hand ledger: what he has made, one fact per row.
export const ledger = [
  {
    name: 'Nudgy',
    rows: [
      ['iPhone assistant', 'live'],
      ['Mac app', 'live'],
      ['Apple Watch', 'live'],
      ['Live Activities', 'x1'],
      ['Voice first', 'x1'],
    ],
  },
  {
    name: 'Axiom Pathways',
    rows: [
      ['Interns placed', '800+'],
      ['Startups', '10+'],
      ['Nonprofit', 'x1'],
      ['Goal', 'millions'],
    ],
  },
  {
    name: 'Content',
    rows: [
      ['Followers', '75k'],
      ['Views', '30m'],
    ],
  },
  {
    name: 'Prayer Lock',
    rows: [
      ['Scaled', '7x'],
      ['Revenue', '$14k'],
    ],
  },
  {
    name: 'Record',
    rows: [
      ['Stanford ASES Launchpad', 'x1'],
      ['LRSEF sustainability award', 'x1'],
      ['Impromptu sales, 1st', 'x1'],
      ['Varsity tennis', 'since 9'],
    ],
  },
]

// ---- index, block 02 -------------------------------------------------------
export const block2 = {
  corners: ['Founder', 'Builder', 'Creative engineer'],
  number: String(AGE).padStart(4, '0'),
  meta: [['# ky', ''], ['Experiment', String(AGE).padStart(4, '0')], ['Get out', 'please']],
  wordsL: [
    'Curious', 'Stubborn', 'Fast', 'Restless', 'Hands-on', 'Loud', 'Precise', 'Young',
    'Honest', 'Playful', 'Obsessive', 'Direct', 'Early', 'Hungry', 'Unfinished', 'Kind',
    'Odd', 'Bold', 'Sleepless', 'Specific', 'Fearless', 'Shipping', 'Learning', 'Raw',
  ],
  wordsR: [
    'Builder', 'Founder', 'Designer', 'Engineer', 'Creator', 'Student', 'Writer', 'Editor',
    'Tinkerer', 'Organizer', 'Teacher', 'Intern', 'Recruiter', 'Shooter', 'Coder', 'Seller',
    'Listener', 'Tester', 'Fixer', 'Breaker', 'Sketcher', 'Planner', 'Filmer', 'Kid',
  ],
}

// ---- footer ----------------------------------------------------------------
export const footer = {
  notes: [
    'I build things\nso I can find out\nif they work',
    'Shipping beats\nplanning, almost\nevery time',
    'Built in Kentucky\nwith too much\ncaffeine',
  ],
  left: [['Project', String(AGE).padStart(4, '0')], ['', 'Thanks for reading\nall the way down']],
  right: ['Currently', `${PLACE.city}, KY`],
  rights: `©${new Date().getFullYear()} all rights reserved`,
}

// ---- the gear, the 3D scene after the footer --------------------------------
export const gearScene = { label: 'What I carry' }

// One story per object; the racket and the ball share tennis. Placeholder
// lines until he sends his own. `nodes` are the object names in the glb.
export const gear = [
  {
    id: 'tennis',
    nodes: ['racket', 'ball'],
    name: 'Tennis',
    line: 'Varsity, and on court since I was nine',
    notes: ['Placeholder: the racket I play with', 'Placeholder: the shot I am still fixing'],
  },
  {
    id: 'iphone',
    nodes: ['iphone'],
    name: 'iPhone',
    line: 'Where every app I build gets tested first',
    notes: ['Placeholder: Nudgy lives here', 'Placeholder: half the channel is shot on it'],
  },
  {
    id: 'fx30',
    nodes: ['fx30'],
    name: 'Sony FX30',
    line: 'What I shoot the channel on',
    notes: ['Placeholder: the lens on it', 'Placeholder: a video it made'],
  },
  {
    id: 'journal',
    nodes: ['journal'],
    name: 'Journal',
    line: 'What I am thinking, most days',
    notes: [],
  },
  {
    id: 'macbook',
    nodes: ['macbook'],
    name: 'MacBook Pro',
    line: 'Where the building happens',
    notes: ['Placeholder: what is open on it right now', 'Placeholder: too many terminals'],
  },
  {
    id: 'lightstick',
    nodes: ['lightstick'],
    name: 'Lightstick',
    line: 'CORTIS. I am a COER',
    notes: ['Placeholder: the first show', 'Placeholder: the song on repeat'],
  },
]

// ---- work page -------------------------------------------------------------
// Image paths are placeholders until he sends screenshots; a cell without one
// draws its own title card.
export const work = [
  { id: 'nudgy', name: 'Nudgy', year: '2026', kind: 'iPhone · Mac · Watch', href: 'https://nudgy.run' },
  { id: 'axiom', name: 'Axiom Pathways', year: '2025', kind: 'Nonprofit', href: 'https://axiompathways.org' },
  { id: 'slapshift', name: 'SlapShift', year: '2026', kind: 'macOS app' },
  { id: 'bery', name: 'Bery', year: '2026', kind: 'AI agent' },
  { id: 'bayouguard', name: 'BayouGuard', year: '2026', kind: 'Flood app' },
  { id: 'vocoder', name: 'Hand Vocoder', year: '2026', kind: 'Interaction' },
  { id: 'media', name: 'Media AI Agent', year: '2026', kind: 'Agent' },
  { id: 'content', name: 'Content', year: '2024—', kind: '75k followers' },
]

// ---- gallery ---------------------------------------------------------------
// Photos already on the site. More arrive when he sends them.
export const gallery = [
  { src: '/media/portrait-suit.webp', w: 640, h: 855, title: 'Suit', where: 'Kentucky' },
  { src: '/media/portrait-seoul.webp', w: 900, h: 753, title: 'Seoul', where: 'Korea' },
  { src: '/matthewflowers.webp', w: 1948, h: 1828, title: 'Flowers', where: 'Axiom' },
  { src: '/media/portrait-2.webp', w: 700, h: 991, title: 'Portrait 02', where: 'Kentucky' },
  { src: '/media/portrait-1.webp', w: 512, h: 653, title: 'Portrait 01', where: 'Kentucky' },
  { src: '/media/portrait-3.webp', w: 700, h: 666, title: 'Portrait 03', where: 'Kentucky' },
  { src: '/media/portrait-4.webp', w: 700, h: 632, title: 'Portrait 04', where: 'Kentucky' },
]

// ---- 404 -------------------------------------------------------------------
export const errorPage = {
  first: 'Out',
  last: '404',
  ghost: 'Out',
  team: 'Line judge',
  line: 'that page landed long. call it out and go back.',
  back: 'Back to index',
}

export const contactLabel = "Don't email me"
