// Every word on the one-pager. Facts come from Matthew (2026-10-03), the repo
// brief (CLAUDE.md) and the live product sites (nudgy.run,
// axiompathways.org). Nothing here is invented.

export const NAME = 'Matthew Park'
export const EMAIL = 'matthew.parkk0@gmail.com'
// written out the way Instinct and Noah Shinn do it, so scrapers skip it
export const EMAIL_SPOKEN = 'matthew.parkk0[at]gmail[dot]com'

const BIRTHDAY = new Date(2010, 9, 12) // 12 Oct 2010

// counted on each visit, so "15-year-old" turns 16 on its own
function ageToday(now = new Date()) {
  const hadBirthday =
    now.getMonth() > BIRTHDAY.getMonth() ||
    (now.getMonth() === BIRTHDAY.getMonth() && now.getDate() >= BIRTHDAY.getDate())
  return now.getFullYear() - BIRTHDAY.getFullYear() - (hadBirthday ? 0 : 1)
}

export const AGE = ageToday()

export const lead = `I'm Matthew Park, a ${AGE}-year-old kid from Kentucky. Founder of Nudgy and Axiom Pathways.`

export const building = [
  {
    id: 'nudgy',
    name: 'Nudgy',
    href: 'https://nudgy.run',
    line: 'is an iPhone assistant that listens to your day and quietly does the next thing.',
    more: 'Say “remind me to call Mom tonight” in passing and the reminder is set. Wonder out loud about the weather and the answer is on your Lock Screen a second later. Invite-only, and free during the beta.',
  },
  {
    id: 'axiom',
    name: 'Axiom Pathways',
    href: 'https://axiompathways.org',
    line: 'is a nonprofit that helps young people land real internships at startups.',
    more: 'Chapters teach AI, computer science and marketing, and the most passionate people, not the most credentialed, go on to intern. 800+ interns and 10+ startups so far, and the goal is millions.',
  },
]

export const cta = { label: 'Email me to say hi', href: `mailto:${EMAIL}` }

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/matty.park/' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mattparxy' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Matty_park' },
  { label: 'X', href: 'https://x.com/MattyparkW' },
  { label: 'GitHub', href: 'https://github.com/mattypark' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/matthew-park-487889350/' },
]
