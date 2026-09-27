// The four boxes. Colors are Friday Night Funkin's arrow colors, pulled a
// touch deeper so ink text on top stays readable (all ≥ 4.5:1 with --ink).

export const SECTIONS = [
  {
    id: 'timeline',
    peek: '48 moments · 2010 → now',
    arrow: '←',
    key: 'ArrowLeft',
    label: 'Timeline',
    sub: 'everything so far',
    color: '#cc57a3',
    dark: '#8f2f70',
  },
  {
    id: 'now',
    peek: 'Terac · WAP · 30K',
    arrow: '↓',
    key: 'ArrowDown',
    label: 'Right now',
    sub: 'what I’m working on',
    color: '#00c3ff',
    dark: '#0086b3',
  },
  {
    id: 'contact',
    peek: 'email · socials',
    arrow: '↑',
    key: 'ArrowUp',
    label: 'Contact',
    sub: 'say hi',
    color: '#12d82a',
    dark: '#0a9a1c',
  },
  {
    id: 'personality',
    peek: 'CORTIS · sax · tennis',
    arrow: '→',
    key: 'ArrowRight',
    label: 'Personality',
    sub: 'who I am off the clock',
    color: '#f9393f',
    dark: '#b8141a',
  },
]

export const byId = Object.fromEntries(SECTIONS.map((s) => [s.id, s]))
