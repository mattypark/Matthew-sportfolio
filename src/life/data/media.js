// Media slots. Every photo/video on the site is addressed by an id so real
// files can be dropped in without touching components:
//
//   1. put the file in /public/media/  (photos: .webp/.jpg, videos: .mp4 H.264,
//      muted loops ≤ 3 MB, with a poster .jpg next to it)
//   2. fill `src` (and `poster` for video) below
//
// A slot with no src renders a captioned placeholder, so the page always
// shows exactly what is still missing.

export const media = {
  // hero constellation — real photos already in /public
  'portrait-suit': { kind: 'photo', src: '/media/portrait-suit.webp', w: 640, h: 855, alt: 'Matthew in a black suit under a magnolia tree' },
  'portrait-seoul': { kind: 'photo', src: '/media/portrait-seoul.webp', w: 900, h: 753, alt: 'Matthew in a Samsung Lions jersey at Jamsil, Seoul' },
  'portrait-1': { kind: 'photo', src: '/media/portrait-1.webp', w: 512, h: 653, alt: 'Portrait of Matthew' },
  'portrait-2': { kind: 'photo', src: '/media/portrait-2.webp', w: 700, h: 991, alt: 'Portrait of Matthew' },
  'portrait-3': { kind: 'photo', src: '/media/portrait-3.webp', w: 700, h: 666, alt: 'Portrait of Matthew' },
  'portrait-4': { kind: 'photo', src: '/media/portrait-4.webp', w: 700, h: 632, alt: 'Portrait of Matthew' },

  // the tape — placeholders until Matthew sends files
  born: { kind: 'photo', ratio: '4/5', caption: 'Baby photo · Kentucky, 2010' },
  fortnite: { kind: 'photo', ratio: '16/9', caption: 'First Fortnite win screenshot' },
  'first-youtube': { kind: 'video', ratio: '16/9', caption: 'Clip from the first YouTube video' },
  'tennis-start': { kind: 'video', ratio: '4/5', caption: 'Tennis — first year on court' },
  'sax-start': { kind: 'photo', ratio: '4/5', caption: 'First alto sax' },
  'all-state': { kind: 'photo', ratio: '4/5', caption: 'KMEA All-State, 2nd chair' },
  switzerland: { kind: 'photo', ratio: '16/9', caption: 'Switzerland, summer 2025' },
  'first-viral': { kind: 'video', ratio: '9/16', caption: 'The first viral TikTok' },
  'prayer-lock': { kind: 'photo', ratio: '4/5', caption: 'Prayer Lock dashboard: $2K → $14K' },
  'yt-doc': { kind: 'video', ratio: '16/9', caption: 'YouTube documentary — trailer cut' },
  lrsef: { kind: 'photo', ratio: '4/5', caption: 'LRSEF award photo' },
  'stanford-ases': { kind: 'photo', ratio: '4/5', caption: 'Stanford ASES acceptance' },
  axiom: { kind: 'photo', ratio: '16/9', caption: 'Axiom intern cohort' },
  jyp: { kind: 'video', ratio: '9/16', caption: 'JYP audition clip' },
  'yc-ss': { kind: 'photo', ratio: '4/5', caption: 'YC Startup School badge / photo' },
  'google-grant': { kind: 'photo', ratio: '16/9', caption: '$10,000 Google grant letter' },

  // content wall
  'reel-1': { kind: 'video', ratio: '9/16', caption: 'Top reel #1 · views' },
  'reel-2': { kind: 'video', ratio: '9/16', caption: 'Top reel #2 · views' },
  'reel-3': { kind: 'video', ratio: '9/16', caption: 'Top TikTok · views' },
  'reel-4': { kind: 'video', ratio: '9/16', caption: 'UGC spot' },
  'reel-5': { kind: 'video', ratio: '9/16', caption: 'Talking head · the viral one' },
  'reel-6': { kind: 'video', ratio: '9/16', caption: 'Behind the scenes' },

  // on repeat
  'singing': { kind: 'video', ratio: '9/16', caption: 'Singing / dance practice' },
  'sax-solo': { kind: 'video', ratio: '4/5', caption: 'Sax solo' },
}

export function slot(id) {
  return media[id] ?? { kind: 'photo', ratio: '4/5', caption: id }
}
