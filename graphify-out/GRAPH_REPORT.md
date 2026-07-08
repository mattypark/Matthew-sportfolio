# Graph Report - matthewportfolio  (2026-07-07)

## Corpus Check
- 71 files · ~1,038,261 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 430 nodes · 490 edges · 45 communities (32 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3ae2c31`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Design Specifications|Design Specifications]]
- [[_COMMUNITY_🎉 Delivery Notes|🎉 Delivery Notes]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_App.jsx|App.jsx]]
- [[_COMMUNITY_App.jsx|App.jsx]]
- [[_COMMUNITY_RightPanel.jsx|RightPanel.jsx]]
- [[_COMMUNITY_Floating Icons Guide|Floating Icons Guide]]
- [[_COMMUNITY_Implementation Summary benarata.me Clone|Implementation Summary: benarata.me Clone]]
- [[_COMMUNITY_audioBus.js|audioBus.js]]
- [[_COMMUNITY_Portfolio Customization Guide|Portfolio Customization Guide]]
- [[_COMMUNITY_🎯 Next Steps|🎯 Next Steps]]
- [[_COMMUNITY_Who Matthew is — for any future agent  collaborator|Who Matthew is — for any future agent / collaborator]]
- [[_COMMUNITY_Blog Setup Guide|Blog Setup Guide]]
- [[_COMMUNITY_Globe.jsx|Globe.jsx]]
- [[_COMMUNITY_Setup Instructions|Setup Instructions]]
- [[_COMMUNITY_HomePage.jsx|HomePage.jsx]]
- [[_COMMUNITY_Terminal.jsx|Terminal.jsx]]
- [[_COMMUNITY_Socials.jsx|Socials.jsx]]
- [[_COMMUNITY_song.js|song.js]]
- [[_COMMUNITY_spotify-auth.mjs|spotify-auth.mjs]]
- [[_COMMUNITY_Nav.jsx|Nav.jsx]]
- [[_COMMUNITY_SongsOfTheWeek.jsx|SongsOfTheWeek.jsx]]
- [[_COMMUNITY_message.js|message.js]]
- [[_COMMUNITY_Masterpiece.jsx|Masterpiece.jsx]]
- [[_COMMUNITY_Manifesto.jsx|Manifesto.jsx]]
- [[_COMMUNITY_Works.jsx|Works.jsx]]
- [[_COMMUNITY_BootSequence.jsx|BootSequence.jsx]]
- [[_COMMUNITY_PageTransition.jsx|PageTransition.jsx]]
- [[_COMMUNITY_Stickers.jsx|Stickers.jsx]]
- [[_COMMUNITY_SectionRail.jsx|SectionRail.jsx]]
- [[_COMMUNITY_TheLoop.jsx|TheLoop.jsx]]
- [[_COMMUNITY_ThreeBlock.jsx|ThreeBlock.jsx]]
- [[_COMMUNITY_vercel.json|vercel.json]]
- [[_COMMUNITY_OldMoneyPage.jsx|OldMoneyPage.jsx]]

## God Nodes (most connected - your core abstractions)
1. `🎉 Delivery Notes` - 17 edges
2. `Design Specifications` - 12 edges
3. `Floating Icons Guide` - 12 edges
4. `Implementation Summary: benarata.me Clone` - 11 edges
5. `useDrawOnView()` - 7 edges
6. `strokeProps()` - 7 edges
7. `Blog Setup Guide` - 7 edges
8. `Who Matthew is — for any future agent / collaborator` - 7 edges
9. `SiteChrome()` - 6 edges
10. `Squiggle()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useLenis()`  [EXTRACTED]
  src/App.jsx → src/hooks/useLenis.js
- `Contact()` --calls--> `useMagnetic()`  [EXTRACTED]
  src/components/Contact.jsx → src/hooks/useMagnetic.js

## Import Cycles
- None detected.

## Communities (45 total, 13 thin omitted)

### Community 0 - "Design Specifications"
Cohesion: 0.05
Nodes (40): Accessibility, Animations, ARIA Attributes, Backdrop Blur, Border Radius, Box Shadows, Browser Support, Color Palette (+32 more)

### Community 1 - "🎉 Delivery Notes"
Cohesion: 0.06
Nodes (30): Animations (100% Match), Build for production:, 📊 Bundle Size, Color Customization (2 minutes), Core Application, 🎉 Delivery Notes, Deploy to popular platforms:, 🚢 Deployment Instructions (+22 more)

### Community 2 - "dependencies"
Cohesion: 0.06
Nodes (30): dependencies, animejs, framer-motion, gray-matter, gsap, lenis, lucide-react, react (+22 more)

### Community 3 - "App.jsx"
Cohesion: 0.12
Nodes (16): About(), CoreValues(), values, Inspiration(), inspirations, ease, Portfolio(), Posts() (+8 more)

### Community 4 - "App.jsx"
Cohesion: 0.15
Nodes (12): App(), Cursor(), detectEnabled(), Gate(), LoudSite(), Menu(), PAGES, CHANNELS (+4 more)

### Community 5 - "RightPanel.jsx"
Cohesion: 0.08
Nodes (28): ArrowCurve(), CircleScribble(), Spiral(), Squiggle(), Star(), strokeProps(), Sun(), useDrawOnView() (+20 more)

### Community 6 - "Floating Icons Guide"
Cohesion: 0.09
Nodes (21): Accessibility, Add New Icons, ✅ Animation Effects, Browser Support, Change Animation Speed, Change Icon Positions, Customization, Features Implemented (+13 more)

### Community 7 - "Implementation Summary: benarata.me Clone"
Cohesion: 0.10
Nodes (19): ✅ Animations & Interactions, Conclusion, ✅ Content Sections, Dependencies, Deploy, Development, Differences from Original, Features Implemented (+11 more)

### Community 8 - "audioBus.js"
Cohesion: 0.20
Nodes (11): ensureAudio(), ensureCtx(), fftSubs, isPlaying(), setTrack(), stateSubs, stop(), subscribeFFT() (+3 more)

### Community 9 - "Portfolio Customization Guide"
Cohesion: 0.17
Nodes (11): 1. Name & Branding, 2. Contact Information, 3. Timeline Events, 4. Footer, 5. Colors (Optional), Build for Production, Features Implemented, File Locations (+3 more)

### Community 10 - "🎯 Next Steps"
Cohesion: 0.17
Nodes (11): 1. Preview the Site, 2. Customize Your Content, 3. Quick Customization Checklist, 4. Customize Timeline Events, 5. Change Colors (Optional), 🚀 Deployment, 📚 More Help, 🎯 Next Steps (+3 more)

### Community 11 - "Who Matthew is — for any future agent / collaborator"
Cohesion: 0.14
Nodes (13): Asian-Korean, born in Kentucky., Creative-half design languages, Current Design Direction (2026-07) — The Gate + Two Sides, Currently building:, Design direction (this sandbox), Develop, Eyes set on:, Matthew Park — Portfolio (TESTING SANDBOX) (+5 more)

### Community 12 - "Blog Setup Guide"
Cohesion: 0.18
Nodes (10): Benefits:, Blog Setup Guide, Current Blog Structure, Need Help?, Option 1: Markdown Files (Recommended for Beginners), Option 2: Headless CMS (Best for Non-Technical Content Updates), Option 3: Static Site Generation with Next.js (Most Professional), Quick Start: Which Option Should You Choose? (+2 more)

### Community 13 - "Globe.jsx"
Cohesion: 0.27
Nodes (8): Contact(), buildArc(), buildRing(), Globe(), MERIDIAN_LONS, PARALLEL_LATS, rotate(), useMagnetic()

### Community 14 - "Setup Instructions"
Cohesion: 0.25
Nodes (7): Available Scripts, Deployment to Vercel, Installation, Prerequisites, Setup Instructions, Step 1: Push to GitHub, Step 2: Deploy to Vercel

### Community 15 - "HomePage.jsx"
Cohesion: 0.32
Nodes (5): CHANNELS, LeftPanel(), useClock(), WORKS, RightPanel()

### Community 16 - "Terminal.jsx"
Cohesion: 0.29
Nodes (7): BUILDING_LINES, CONTACT_LINES, HELP_LINES, MESSAGE_STEPS, mkLine(), STORY_LINES, Terminal()

### Community 18 - "song.js"
Cohesion: 0.67
Nodes (5): getAccessToken(), getItunesPreview(), handler(), lastSundayMidnightET(), secondsUntilNextSundayMidnightET()

### Community 19 - "spotify-auth.mjs"
Cohesion: 0.33
Nodes (5): env, ENV_PATH, SCOPES, server, STATE

### Community 20 - "Nav.jsx"
Cohesion: 0.60
Nodes (4): formatTime(), localTz, Nav(), shortZone()

### Community 22 - "message.js"
Cohesion: 0.83
Nodes (3): clean(), handler(), safeParse()

## Knowledge Gaps
- **206 isolated node(s):** `name`, `version`, `type`, `dev`, `build` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `version`, `type` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Design Specifications` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `🎉 Delivery Notes` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._
- **Should `RightPanel.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08350951374207188 - nodes in this community are weakly interconnected._
- **Should `Floating Icons Guide` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._