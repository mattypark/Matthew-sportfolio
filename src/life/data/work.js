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

// The flat "everything" list. Click a row to open its line. `line: null`
// shows "description coming" until Matthew writes it.
export const everything = [
  { name: 'Axiom', line: 'A nonprofit that uses AI to help high schoolers land real internships. 550+ interns and 10+ partner startups so far.' },
  { name: 'Prayer Lock', line: 'Former CMO and cofounder. Took it from $2K MRR to $14K in revenue, 7× the business.' },
  { name: 'Turbolearn AI', line: null },
  { name: 'MathGPT', line: null },
  { name: 'Bery', line: 'A personal CRM with an AI agent: describe a person and it fills in the profile for you.' },
  { name: 'BayouGuard', line: 'A Houston flood-risk app for the Congressional App Challenge. I built the frontend.' },
  { name: 'SlapShift', line: 'A macOS app with its own sign-and-notarize release pipeline.' },
  { name: 'Hand Vocoder', line: 'Hand gestures from the webcam drive a live vocal harmonizer in the browser.' },
  { name: 'The LUT', line: 'My color grade, packaged as a .cube file anyone can use.' },
  { name: 'BounceBack', line: 'Working with Dillon on BounceBack pickleball since January 2026.' },
  { name: 'UGC for brands', line: 'Short-form videos made for brands since November 2025.' },
  { name: 'YouTube documentary', line: 'My first documentary. Posted 02.10.26, past 10K views in eleven days.' },
  { name: 'Substack', line: 'Started writing in August 2026.' },
  { name: 'Speech & Debate', line: 'State qualifier. 1st in Impromptu Sales at the Marshall University tournament.' },
  { name: 'LRSEF science fair', line: 'National Sustainable Development Award and 1st in the ESGD category, same day.' },
  { name: 'All-State sax', line: 'KMEA All-State alto sax, 2nd chair — in 2024 and again in 2025.' },
  { name: 'Tennis', line: 'Playing since January 2021. 3.0 UTR by September 2022.' },
  { name: 'Basketball', line: 'Since November 2021. Career high: 22 points.' },
  { name: 'Drums', line: 'Picked them up in February 2026.' },
  { name: 'Guitar', line: 'Since June 2022.' },
  { name: 'Singing', line: 'Started in March 2026. Auditioned for JYP four months later.' },
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
