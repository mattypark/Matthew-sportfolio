# Design Specifications

This document details the exact design specifications extracted from benarata.me.

## Color Palette

### Primary Colors
```css
--color-custom: #fb6e1c;          /* Accent/Selection color */
--background: oklch(98% 0 0);      /* Main background (light) */
--foreground: oklch(14.5% 0 0);    /* Primary text (near black) */
--muted-foreground: oklch(55.6% 0 0); /* Secondary text (gray) */
```

### UI Colors
```css
--border: oklch(92.2% 0 0);
--primary: oklch(20.5% 0 0);
--primary-foreground: oklch(98.5% 0 0);
--secondary: oklch(97% 0 0);
--secondary-foreground: oklch(20.5% 0 0);
```

## Typography

### Font Families
1. **Inter** (Body text, links)
   - Weights: 100-900 (variable)
   - Usage: Navigation, timeline descriptions, body text
   
2. **Instrument Serif** (Display)
   - Weights: 400, 400 italic
   - Usage: Logo/brand name, centered footer logo
   
3. **IBM Plex Mono** (Monospace)
   - Weights: 400, 500, 600, 700
   - Usage: Dates, technical information

### Font Sizes
- **text-xs**: 0.75rem (12px) - Timeline text, footer, navigation
- **text-sm**: 0.875rem (14px)
- **text-base**: 1rem (16px)
- **text-xl**: 1.25rem (20px) - Footer centered logo
- **text-2xl**: 1.5rem (24px) - Header brand name

### Letter Spacing
- **tracking-tight**: -0.025em (applied globally)

## Spacing

### Gaps
- Timeline item gap: 1rem (16px)
- Header social links gap: 1.25rem (20px)
- Date to description gap: 
  - Mobile: 4rem (64px)
  - Desktop: 6.5rem (104px)

### Padding
- **Header/Footer**:
  - Mobile: 1.5rem (24px)
  - Desktop: 2rem (32px)
  
- **Main Content**:
  - Top: 5rem (80px) mobile, 6rem (96px) desktop
  - Sides: 1.5rem (24px) mobile, 2rem (32px) desktop
  - Bottom: 8rem (128px) - for footer clearance

## Layout

### Structure
```
┌─────────────────────────────────────┐
│ Fixed Header (backdrop-blur-xl)    │
│ ┌─────────┐         ┌──────────┐   │
│ │ logo    │         │ socials  │   │
│ └─────────┘         └──────────┘   │
├─────────────────────────────────────┤
│                                     │
│ Main Timeline (scrollable)          │
│ ┌────────┬─────────────────────┐   │
│ │ date   │ description         │   │
│ ├────────┼─────────────────────┤   │
│ │ date   │ description         │   │
│ └────────┴─────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ Fixed Footer (gradient overlay)     │
│ ┌───────┐  ┌────┐  ┌──────────┐   │
│ │ copy  │  │ logo│  │ time     │   │
│ └───────┘  └────┘  └──────────┘   │
└─────────────────────────────────────┘
```

### Z-Index Layering
- Header: `z-10`
- Footer: `z-10`
- Main content: `z-0` (default)

## Effects

### Backdrop Blur
```css
backdrop-blur-xl: 24px
```
Applied to: Header navigation bar

### Gradients
```css
/* Footer gradient overlay */
bg-gradient-to-t 
from-background/100 
to-background/10
```

### Box Shadows
None - the design uses clean, flat surfaces

### Border Radius
None - all elements have sharp corners

## Animations

### Typing Cursor
```css
@keyframes cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
animation: cursor-blink 1.5s step-end infinite;
```

### Scroll Animations (Framer Motion)
```javascript
// Timeline items
initial={{ opacity: 0, x: -20 }}
whileInView={{ opacity: 1, x: 0 }}
transition={{ 
  duration: 0.5, 
  delay: index * 0.02,
  ease: "easeOut" 
}}
```

### Page Load Animations
```javascript
// Header
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Footer
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Hover Effects
```css
/* Links */
.hover\:underline:hover {
  text-decoration-line: underline;
}
```
- No transition delay - instant underline
- Applied to: All navigation links, timeline links

## Interactions

### Selection Highlighting
```css
::selection {
  background-color: var(--color-custom); /* #fb6e1c */
  opacity: 0.5;
}
```

### Link States
- Default: No underline
- Hover: Underline appears
- Active/Focus: Same as hover

### Cursor Types
- Links: `cursor: pointer` (default)
- Dates: `cursor: pointer` (clickable feel, even if no action)
- Text: Default cursor

## Responsive Breakpoints

### Tailwind Breakpoints Used
```javascript
sm: 640px (40rem)
```

### Key Responsive Changes
1. **Gap between date and description**:
   - < 640px: `gap-16` (4rem / 64px)
   - ≥ 640px: `gap-26` (6.5rem / 104px)

2. **Padding**:
   - < 640px: `p-6 pl-6 pt-20` (1.5rem, 5rem top)
   - ≥ 640px: `p-8 pl-8 pt-24` (2rem, 6rem top)

3. **Footer center logo**:
   - < 640px: Hidden
   - ≥ 640px: Visible

## Accessibility

### Semantic HTML
- Uses semantic tags (`<main>`, `<nav>`, `<footer>`)
- Proper heading hierarchy
- `<a>` tags for all links

### ARIA Attributes
- `rel="noopener noreferrer"` on external links
- `target="_blank"` for external links

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states inherit hover styles

## Performance

### Optimization Techniques
1. Font preloading via Google Fonts CDN
2. Lazy animation triggering (viewport detection)
3. CSS-only effects where possible
4. Minimal JavaScript bundle (~91KB gzipped)

### Loading Strategy
1. Critical CSS inlined
2. Fonts loaded asynchronously
3. Animations triggered on scroll/mount
4. No image optimization needed (text-only design)

## Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- `backdrop-filter` (widely supported, no fallback needed for modern browsers)
- `oklch()` colors (modern browsers, falls back gracefully)
- Framer Motion animations (JavaScript required)

