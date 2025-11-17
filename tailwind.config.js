/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom': '#fb6e1c',
        background: 'oklch(98% 0 0)',
        foreground: 'oklch(14.5% 0 0)',
        card: 'oklch(100% 0 0)',
        'card-foreground': 'oklch(14.5% 0 0)',
        popover: 'oklch(100% 0 0)',
        'popover-foreground': 'oklch(14.5% 0 0)',
        primary: 'oklch(20.5% 0 0)',
        'primary-foreground': 'oklch(98.5% 0 0)',
        secondary: 'oklch(97% 0 0)',
        'secondary-foreground': 'oklch(20.5% 0 0)',
        muted: 'oklch(97% 0 0)',
        'muted-foreground': 'oklch(55.6% 0 0)',
        accent: 'oklch(97% 0 0)',
        'accent-foreground': 'oklch(20.5% 0 0)',
        destructive: 'oklch(57.7% .245 27.325)',
        border: 'oklch(92.2% 0 0)',
        input: 'oklch(92.2% 0 0)',
        ring: 'oklch(70.8% 0 0)',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'instrument': ['Instrument Serif', 'Times New Roman', 'serif'],
        'ibm': ['IBM Plex Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight': '-0.025em',
      },
      animation: {
        'typing': 'cursor-blink 1.5s step-end infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      backdropBlur: {
        'xl': '24px',
      },
      spacing: {
        '26': '6.5rem',
      },
    },
  },
  plugins: [],
}

