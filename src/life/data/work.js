// Things built, numbers earned, values held. Copy is Matthew's own from the
// live site and the repo brief (CLAUDE.md); nothing here is invented.

export const projects = [
  {
    id: 'axiom', name: 'Axiom', role: 'Founder', years: '2026 — now', kind: 'Nonprofit',
    line: 'AI that helps high schoolers land real internships.',
    card: 'counter', value: 550, suffix: '+', label: 'interns placed',
    href: 'https://axiompathways.org',
  },
  {
    id: 'prayer-lock', name: 'Prayer Lock', role: 'CMO / cofounder', years: '2025', kind: 'App',
    line: 'Scaled it 7× — $14K generated from $2K MRR.',
    card: 'bars', from: 2, to: 14, unit: 'K',
  },
  {
    id: 'content', name: 'Matty Park', role: 'Creator', years: '2020 — now', kind: 'Content',
    line: 'Short-form, a YouTube documentary, UGC for brands.',
    card: 'poster', big: '30M+', label: 'views',
  },
  {
    id: 'turbolearn', name: 'Turbolearn AI', role: 'Growth', years: '2025', kind: 'Startup',
    line: 'Growth for an AI study tool.', card: 'terminal',
    lines: ['> growth --campaign ugc', 'creators booked ........ ok', 'posts shipped .......... ok', 'signups ................ ↑'],
    href: 'https://turbo.ai',
  },
  {
    id: 'bery', name: 'Bery', role: 'Solo build', years: '2026', kind: 'AI agent',
    line: 'A personal CRM: describe a person, the agent fills in the rest.',
    card: 'chat', lines: ['met a founder at YC SS, builds dev tools', '→ profile created · 6 links found'],
  },
  {
    id: 'bayouguard', name: 'BayouGuard', role: 'Frontend', years: '2026', kind: 'Civic app',
    line: 'Houston flood-risk app for the Congressional App Challenge.',
    card: 'terminal', lines: ['> risk --zip 77002', 'watershed ...... Buffalo Bayou', 'risk ........... elevated'],
  },
  {
    id: 'slapshift', name: 'SlapShift', role: 'Solo build', years: '2026', kind: 'macOS app',
    line: 'A Mac app, shipped with its own release pipeline.', card: 'terminal',
    lines: ['$ ./release.sh', 'signing ....... ok', 'notarizing .... ok', 'v0.1.0 ready'],
  },
  {
    id: 'lut', name: 'The LUT', role: 'Product', years: '2026', kind: 'Shop',
    line: 'His color grade, for sale. Five dollars.', card: 'price', big: '$5', href: '/lut',
  },
]

// The flat "everything" list (hover-band index): projects + side quests.
export const everything = [
  'Axiom', 'Prayer Lock', 'Turbolearn AI', 'MathGPT', 'Bery', 'BayouGuard', 'SlapShift', 'Hand Vocoder',
  'The LUT', 'BounceBack', 'UGC for brands', 'YouTube documentary', 'Substack', 'Speech & Debate',
  'LRSEF science fair', 'All-State sax', 'Tennis', 'Basketball', 'Drums', 'Guitar', 'Singing', 'JYP audition',
]

// Big numbers. `source` says where the figure comes from so it can be checked.
export const stats = [
  { value: 550, suffix: '+', label: 'interns through Axiom', source: 'Axiom' },
  { value: 30, suffix: 'M+', label: 'views across platforms', source: 'content' },
  { value: 7, suffix: '×', label: 'Prayer Lock revenue', source: '$2K MRR → $14K' },
  { value: 10, prefix: '$', suffix: 'K', label: 'Google grant', source: '08.07.26' },
  { value: 20, suffix: 'K', label: 'Instagram followers', source: '07.31.26' },
  { value: 10, suffix: '+', label: 'startups partnered', source: 'Axiom' },
]

export const proofLogos = [
  'Stanford ASES', 'YC Startup School', 'LRSEF', 'MIT Critical Data', 'Turbolearn AI',
  'Google', 'KMEA All-State', 'JYP', 'Prayer Lock', 'Axiom',
]

export const values = [
  { text: 'God #1 always. Even if you forget, remind yourself that he is the reason you are here today.', person: null },
  { text: 'Do. Everything. It gives you more opportunities to do more great things.', person: 'steph' },
  { text: 'Always tell the truth, for it will be better than making the mistake with major guilt.', person: null },
  { text: 'Why? Or why not? Always ask yourself this, and you will find new questions to come.', person: 'peter' },
  { text: "You will get nowhere running on a treadmill because you're always grinding, but not advancing.", person: 'jannik' },
  { text: 'To do something exceptional, you have to be the exception.', person: 'alysa' },
  { text: 'Failure > trying to be perfect. You WILL fail, but will you learn from your failure?', person: 'ben' },
  { text: 'Being cringe is never cringe, just the saying of it is cringe.', person: null },
  { text: 'Never put off something tomorrow that can be done today.', person: 'trey' },
  { text: 'The goal isn’t to live forever, it’s to create something that can live forever.', person: null },
  { text: "The wise doesn't complain about problems, but rather solves them.", person: null },
  { text: 'Be cautious of what you listen and consume, for it will shape your mind, future, and you.', person: null },
  { text: "Never trust a person who talks behind another man's back, for you never know what they're saying about you.", person: null },
  { text: 'You are never behind in life. As the closer you get to the sun, the shadow grows bigger behind you, but you must ignore the shadow and see the light in front of you.', person: null },
]

export const people = {
  steph: { name: 'Steph Curry', src: '/inspiration-steph.webp' },
  peter: { name: 'Peter Thiel', src: '/inspiration-peter.webp' },
  jannik: { name: 'Jannik Sinner', src: '/inspiration-jannik.webp' },
  alysa: { name: 'Alysa Liu', src: '/inspiration-alysa.webp' },
  ben: { name: 'Ben Shelton', src: '/inspiration-ben.webp' },
  trey: { name: 'Trey Gustafson', src: '/inspiration-trey.webp' },
}
