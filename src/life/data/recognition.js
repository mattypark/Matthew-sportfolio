// Awards and selections, grouped. Every line is from the timeline on the
// live site; `slot` points at the photo that should sit beside it.

export const recognition = [
  {
    group: 'Speech & Debate',
    items: [
      { title: '1st place, Impromptu Sales', by: 'Marshall University tournament', date: '02.21.26' },
      { title: 'Qualified for state', by: 'Speech & Debate', date: '02.07.26' },
      { title: 'Quarterfinalist, state Impromptu', by: 'State tournament', date: '03.14.26' },
      { title: 'Qualified for regionals', by: 'Speech & Debate', date: '02.02.26' },
    ],
  },
  {
    group: 'Science & research',
    items: [
      { title: 'National Sustainable Development Award', by: 'LRSEF', date: '03.07.26', slot: 'lrsef' },
      { title: '1st place, ESGD category', by: 'LRSEF', date: '03.07.26' },
      { title: 'Critical Data researcher + social media', by: 'MIT Critical Data', date: '03.04.26' },
    ],
  },
  {
    group: 'Programs & grants',
    items: [
      { title: 'Stanford ASES Launchpad', by: 'Stanford', date: '04.17.26', slot: 'stanford-ases' },
      { title: 'YC Startup School', by: 'Y Combinator', date: '07.25.26', slot: 'yc-ss' },
      { title: '$10,000 grant', by: 'Google', date: '08.07.26', slot: 'google-grant' },
    ],
  },
  {
    group: 'Music',
    items: [
      { title: 'All-State alto sax, 2nd chair', by: 'KMEA', date: '03.02.24', slot: 'all-state' },
      { title: 'All-State alto sax, 2nd chair (again)', by: 'KMEA', date: '03.06.25' },
      { title: 'Audition', by: 'JYP Entertainment', date: '07.07.26' },
    ],
  },
  {
    group: 'Sport',
    items: [
      { title: '3.0 UTR', by: 'Tennis', date: '09.01.22' },
      { title: 'Career-high 22 points', by: 'Basketball', date: '12.19.24' },
    ],
  },
]

// how many rows a group shows before "see more"
export const PREVIEW_ROWS = 2
