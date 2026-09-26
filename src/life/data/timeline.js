// The life tape. Every dated moment from the live site (src/oldschool
// Portfolio.jsx), oldest first, plus the "next" stops that haven't happened.
//
// chapter  — drives the chip color/label on the tape
// big      — gets a wide card and a media slot on the tape
// slot     — id of the photo/video that belongs here (see media.js). Until a
//            file exists, the card renders a captioned placeholder.
// plan     — true for the future: drawn dashed, no date claimed

export const CHAPTERS = {
  origin: 'ORIGIN',
  game: 'GAMES',
  sport: 'SPORT',
  music: 'MUSIC',
  content: 'CONTENT',
  build: 'BUILD',
  speech: 'SPEECH',
  science: 'SCIENCE',
  school: 'SCHOOL',
  life: 'LIFE',
  next: 'NEXT',
}

export const timeline = [
  { date: '2010-10-12', chapter: 'origin', big: true, slot: 'born', title: 'Matthew is born', note: 'Kentucky. On a Sunday.' },
  { date: '2018-03-14', chapter: 'game', slot: 'fortnite', title: 'Plays his first video game', note: 'Fortnite. It starts somewhere.' },
  { date: '2020-07-28', chapter: 'content', slot: 'first-youtube', title: 'Posts his first YouTube video' },
  { date: '2021-01-07', chapter: 'sport', big: true, slot: 'tennis-start', title: 'Starts playing tennis' },
  { date: '2021-11-19', chapter: 'sport', title: 'Starts playing basketball' },
  { date: '2022-03-19', chapter: 'content', title: 'First TikTok posted' },
  { date: '2022-06-03', chapter: 'music', title: 'Starts playing guitar' },
  { date: '2022-08-10', chapter: 'music', big: true, slot: 'sax-start', title: 'Starts playing saxophone' },
  { date: '2022-09-01', chapter: 'sport', title: '3.0 UTR tennis rank' },
  { date: '2022-11-09', chapter: 'build', title: 'Starts reselling Prime / candy', note: 'First business. Margins were real.' },
  { date: '2024-03-02', chapter: 'music', big: true, slot: 'all-state', title: 'KMEA All-State alto sax, 2nd chair' },
  { date: '2024-12-19', chapter: 'sport', title: 'Career-high 22 points in basketball' },
  { date: '2025-03-06', chapter: 'music', title: 'KMEA All-State alto sax, 2nd chair (again)' },
  { date: '2025-07-29', chapter: 'life', slot: 'switzerland', title: 'Visits Switzerland' },
  { date: '2025-08-13', chapter: 'content', big: true, slot: 'first-viral', title: 'First viral talking-head video on TikTok' },
  { date: '2025-11-03', chapter: 'content', title: 'Starts doing UGC' },
  { date: '2025-11-03', chapter: 'build', title: 'Joins Turbolearn AI as growth', link: 'https://turbo.ai' },
  { date: '2025-11-08', chapter: 'build', title: 'Creates his first portfolio website' },
  { date: '2025-12-01', chapter: 'build', title: 'Starts building his first solo AI app' },
  { date: '2025-12-04', chapter: 'content', title: 'Posts his first X post', link: 'https://x.com/MattyparkW/status/1996768218082418915' },
  { date: '2025-12-05', chapter: 'build', big: true, slot: 'prayer-lock', title: 'Takes Prayer Lock from $2K MRR to $14K', note: '7× the business, as CMO / cofounder.' },
  { date: '2026-01-01', chapter: 'life', title: 'Skis for the first time' },
  { date: '2026-01-13', chapter: 'build', title: 'Starts working with BounceBack pickleball' },
  { date: '2026-02-02', chapter: 'speech', title: 'Qualifies for regionals, Speech & Debate' },
  { date: '2026-02-05', chapter: 'music', title: 'Starts playing drums' },
  { date: '2026-02-07', chapter: 'speech', title: 'Qualifies for state, Speech & Debate' },
  { date: '2026-02-10', chapter: 'content', title: 'Posts his first series of short-form content' },
  { date: '2026-02-10', chapter: 'content', big: true, slot: 'yt-doc', title: 'Posts his first YouTube documentary', link: 'https://youtu.be/rsYSeIQ_LV8' },
  { date: '2026-02-21', chapter: 'speech', title: '1st in Impromptu Sales, Marshall University tournament' },
  { date: '2026-02-21', chapter: 'content', title: 'The documentary crosses 10K views', link: 'https://youtu.be/rsYSeIQ_LV8' },
  { date: '2026-02-23', chapter: 'content', title: 'Hits 1K subscribers on YouTube' },
  { date: '2026-03-04', chapter: 'science', title: 'MIT Critical Data researcher + social media' },
  { date: '2026-03-07', chapter: 'science', big: true, slot: 'lrsef', title: 'National Sustainable Development Award, LRSEF', note: 'And 1st in the ESGD category, same day.' },
  { date: '2026-03-09', chapter: 'content', title: 'First LinkedIn post' },
  { date: '2026-03-14', chapter: 'speech', title: 'Quarterfinalist, state Impromptu' },
  { date: '2026-03-17', chapter: 'music', title: 'Starts singing' },
  { date: '2026-03-25', chapter: 'build', title: 'Builds his own AI agent' },
  { date: '2026-04-12', chapter: 'content', title: 'Posts his first Instagram video' },
  { date: '2026-04-17', chapter: 'school', big: true, slot: 'stanford-ases', title: 'Gets into Stanford ASES Launchpad' },
  { date: '2026-04-18', chapter: 'build', big: true, slot: 'axiom', title: 'Starts Axiom, a nonprofit', note: '550+ interns, 10+ startups since.' },
  { date: '2026-05-07', chapter: 'school', title: 'Finishes AP tests' },
  { date: '2026-07-06', chapter: 'content', title: 'Hits 10K followers on Instagram' },
  { date: '2026-07-07', chapter: 'music', big: true, slot: 'jyp', title: 'Auditions for JYP' },
  { date: '2026-07-25', chapter: 'build', big: true, slot: 'yc-ss', title: 'Attends YC Startup School' },
  { date: '2026-07-31', chapter: 'content', title: 'Hits 20K followers on Instagram', note: '10K → 20K in 25 days.' },
  { date: '2026-08-07', chapter: 'build', big: true, slot: 'google-grant', title: 'Gets a $10,000 Google grant' },
  { date: '2026-08-08', chapter: 'content', title: 'Starts a Substack' },
  { date: '2026-08-21', chapter: 'build', title: 'Releases his first LUT', link: '/lut' },

  { plan: true, chapter: 'next', title: 'An AI research topic worth the years', note: 'Still choosing. Academically serious and genuinely interesting.' },
  { plan: true, chapter: 'next', title: 'Stanford', note: 'Academics earns the room.' },
  { plan: true, chapter: 'next', title: 'San Francisco', note: 'Kentucky kid, SF address.' },
  { plan: true, chapter: 'next', title: 'New York. Then the world.' },
]

const pad = (n) => String(n).padStart(2, '0')

// 2026-08-21 → 08.21.26, the format the old site used and he's known for.
export function stamp(iso) {
  const [y, m, d] = iso.split('-')
  return `${m}.${d}.${y.slice(2)}`
}

export function yearOf(entry) {
  return entry.plan ? null : Number(entry.date.slice(0, 4))
}

export function daysSince(iso, now = new Date()) {
  const [y, m, d] = iso.split('-').map(Number)
  return Math.floor((now - new Date(y, m - 1, d)) / 86_400_000)
}

export function todayStamp(now = new Date()) {
  return `${pad(now.getMonth() + 1)}.${pad(now.getDate())}.${String(now.getFullYear()).slice(2)}`
}
