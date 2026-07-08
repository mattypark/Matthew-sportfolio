/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#E2D0A8',
        ink: '#0F0E0C',
        primary: '#E63E21',
        accent: '#1C5FCC',
        signal: '#8EE000',
        muted: '#6F634A',
        line: '#1F1D18',
        /* otherkind-mould quiet side */
        linen: '#F2F0EA',
        slate: '#6F675B',
        /* split-brain home palette */
        void: '#070605',
        bone: '#F7F4EC',
        cream: '#FFFFFF',
        umber: '#6B4A2F',
        bark: '#3E2C1C',
        latte: '#A9805B',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'Impact', 'Haettenschweiler', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        archivo: ['"Archivo Black"', 'Impact', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
        bodoni: ['"Bodoni Moda"', 'Didot', 'serif'],
        elite: ['"Special Elite"', 'Courier', 'monospace'],
        sixcaps: ['"Six Caps"', 'Impact', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}
