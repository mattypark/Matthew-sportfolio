# Portfolio Customization Guide

This portfolio is an exact replica of https://benarata.me/. Below are instructions for replacing placeholder content with your own information.

## Quick Find & Replace

Search for these terms across all files and replace with your information:

### 1. Name & Branding
- `PLACEHOLDER NAME` → Your full name
- `placeholder.` → Your initials or brand name (e.g., "ben.")
- `p/h` → Your initials (e.g., "b/a")

### 2. Contact Information
- `placeholder@email.com` → Your email address
- All social media URLs in the header:
  - Twitter/X: `https://x.com/placeholder`
  - LinkedIn: `https://www.linkedin.com/in/placeholder/`
  - Instagram: `https://www.instagram.com/placeholder`
  - TikTok: `https://www.tiktok.com/@placeholder`
  - YouTube: `https://www.youtube.com/@placeholder`

### 3. Timeline Events

In `/src/components/Portfolio.jsx`, locate the `timelineEvents` array (around line 14) and update:

- Dates: Change dates to match your timeline
- Descriptions: Update all event descriptions with your story
- Links: Replace company/project links with your own
- Add or remove events as needed

Example event structure:
```javascript
{
  date: '09.13.25',
  description: <>Your Name cofounds <a className="underline" target="_blank" rel="noopener noreferrer" href="https://yourlink.com">Company©</a> with Partner</>,
  link: 'https://yourlink.com',
}
```

### 4. Footer
In the footer section of Portfolio.jsx:
- Update the time zone label: `PLACEHOLDER Time:` → `Your Location:`
- Update copyright info

### 5. Colors (Optional)

To change the accent color, edit `/tailwind.config.js`:
- Find `'custom': '#fb6e1c'` and change to your preferred color

## File Locations

- **Main Portfolio**: `/src/components/Portfolio.jsx`
- **Styling**: `/tailwind.config.js` and `/src/index.css`
- **Routing**: `/src/App.jsx`

## Features Implemented

✅ Timeline-based layout  
✅ Animated typing cursor  
✅ Scroll animations (fade in on scroll)  
✅ Hover effects on links  
✅ Fixed header with backdrop blur  
✅ Fixed footer with gradient overlay  
✅ Live clock display  
✅ Responsive design  
✅ Custom fonts (Inter, Instrument Serif, IBM Plex Mono)  
✅ Exact color scheme from original site  

## Running the Site

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `/dist` folder, ready for deployment.

