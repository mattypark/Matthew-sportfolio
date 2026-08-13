/** @type {import('tailwindcss').Config} */
export default {
  // src/oldschool IS the site now, so it must be scanned in every build.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* black / white / red / cream — the whole site */
        paper: '#FFFFFF',
        cream: '#F4EFE4',
        'cream-deep': '#E9E0CD',
        ink: '#0B0B0B',
        red: '#D22B1F',
        'red-dk': '#8B1A12',
        'red-lit': '#FF4A35',
        /* the one blue, ::selection only */
        select: '#2A6BFF',
        /* retained so the archived /loud + /journal files still compile */
        primary: '#E63E21',
        accent: '#1C5FCC',
        signal: '#8EE000',
        muted: '#6F634A',
        line: '#1F1D18',
        linen: '#F2F0EA',
        slate: '#6F675B',
        void: '#070605',
        bone: '#F7F4EC',
        umber: '#6B4A2F',
        bark: '#3E2C1C',
        latte: '#A9805B',
        /* --- oldschool tokens (localhost-only build, src/oldschool) ---
           Additive only: nothing above is redefined, so the live site's
           palette is untouched. */
        background: 'oklch(98% 0 0)',
        foreground: 'oklch(14.5% 0 0)',
        card: 'oklch(100% 0 0)',
        'card-foreground': 'oklch(14.5% 0 0)',
        popover: 'oklch(100% 0 0)',
        'popover-foreground': 'oklch(14.5% 0 0)',
        'primary-foreground': 'oklch(98.5% 0 0)',
        secondary: 'oklch(97% 0 0)',
        'secondary-foreground': 'oklch(20.5% 0 0)',
        'muted-foreground': 'oklch(55.6% 0 0)',
        'accent-foreground': 'oklch(20.5% 0 0)',
        destructive: 'oklch(57.7% .245 27.325)',
        border: 'oklch(92.2% 0 0)',
        input: 'oklch(92.2% 0 0)',
        ring: 'oklch(70.8% 0 0)',
        custom: '#fb6e1c',
        'background-elev': 'oklch(96% 0.006 80)',

      },
      fontFamily: {
        display: ['"Anthropic Serif Display"', '"Anthropic Serif"', 'Georgia', 'serif'],
        prose: ['"Anthropic Serif"', 'Georgia', 'serif'],
        ui: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        ibm: ['"IBM Plex Mono"', 'monospace'],
        instrument: ['"Instrument Serif"', 'Times New Roman', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Anthropic Serif"', 'Georgia', 'serif'],
      },
      animation: { typing: 'cursor-blink 1.5s step-end infinite' },
      keyframes: { 'cursor-blink': { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } } },
      spacing: {
        px8: '8px',
        block: '16px',
        26: '6.5rem',
      },
      letterSpacing: {
        tightest: '-0.045em',
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}
