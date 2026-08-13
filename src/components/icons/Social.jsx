// Real brand marks, drawn inline — no icon font, no text labels.
// Every glyph sits on a 24x24 box and inherits currentColor so the same
// component works on white, cream, or a red block.

const box = (props) => ({
  width: props.size || 22,
  height: props.size || 22,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
})

export function Instagram(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.55.55-1.11.9-1.77 1.15-.64.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.47-2.43.25-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.2-1.86.34-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.3.88-.34 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.2 1.5.34 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.88.3 1.86.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.2 1.86-.34.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.3-.88.34-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.2-1.5-.34-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.88-.3-1.86-.34-1.05-.05-1.37-.06-4.04-.06Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
    </svg>
  )
}

export function X(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M17.53 3h3.03l-6.62 7.57L21.75 21h-6.1l-4.77-6.24L5.4 21H2.37l7.08-8.1L2.25 3h6.25l4.31 5.7L17.53 3Zm-1.06 16.17h1.68L7.6 4.74H5.8l10.67 14.43Z" />
    </svg>
  )
}

export function TikTok(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M16.6 2h-3.1v13.2a2.7 2.7 0 1 1-2.7-2.7c.24 0 .47.03.7.09V9.4a5.9 5.9 0 0 0-.7-.04 5.82 5.82 0 1 0 5.82 5.82V8.6a7.1 7.1 0 0 0 4.13 1.32V6.8a4.03 4.03 0 0 1-2.87-1.2A4.06 4.06 0 0 1 16.6 2Z" />
    </svg>
  )
}

export function GitHub(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

export function YouTube(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.5 2.5 0 0 0-1.77 1.77A26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.5 2.5 0 0 0 1.77-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z" />
    </svg>
  )
}

export function LinkedIn(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-.96 1.83-1.98 3.77-1.98 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.66c0-1.35-.03-3.09-1.96-3.09-1.96 0-2.26 1.46-2.26 2.99V21h-4V9Z" />
    </svg>
  )
}

export function Substack(props) {
  return (
    <svg {...box(props)} className={props.className}>
      <path d="M4 3h16v2.36H4V3Zm0 4.13h16V21l-8-4.42L4 21V7.13Zm0 3.24h16v2.36H4v-2.36Z" />
    </svg>
  )
}

export const SOCIALS = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/matty.park/', Icon: Instagram },
  { key: 'x', label: 'X', href: 'https://x.com/MattyparkW', Icon: X },
  { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@mattparxy', Icon: TikTok },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@matty_park', Icon: YouTube },
  { key: 'github', label: 'GitHub', href: 'https://github.com/mattypark', Icon: GitHub },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/matthew-park-487889350/', Icon: LinkedIn },
  { key: 'substack', label: 'Substack', href: 'https://substack.com/@mattyparkk', Icon: Substack },
]
