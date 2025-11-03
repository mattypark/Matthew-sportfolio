# Matthew Park - Portfolio Website

A clean, minimalist portfolio website inspired by modern web design principles. Features a text-focused layout with lots of whitespace, bold typography, and minimal use of color.

## Technologies

- React 18
- Vite
- Tailwind CSS
- Responsive Design

## Getting Started

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Customization

### Update Social Media Links

Edit the `socialLinks` array in `src/components/Portfolio.jsx`:

```javascript
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/yourusername' },
  { name: 'YouTube', url: 'https://youtube.com/@yourchannel' },
  // ... add or remove links as needed
]
```

### Update Email

Change the email in the `handleEmailCopy` function:

```javascript
navigator.clipboard.writeText('your.email@example.com')
```

### Add or Edit Achievements

Modify the `achievements` array:

```javascript
const achievements = [
  { text: 'Your achievement here' },
  // ... add more
]
```

### Add Blog Posts

Simply add new entries to the `blogPosts` array in `src/components/Portfolio.jsx`:

```javascript
const blogPosts = [
  {
    title: 'Your Blog Post Title',
    date: 'Month Day, Year',
    description: 'A brief description of your post.',
    link: '/blog/your-post-slug'
  },
  // ... add more posts
]
```

**Note:** The blog links currently point to placeholder URLs. For a full blog implementation, you would need to:
1. Set up a routing system (React Router)
2. Create individual blog post pages/components
3. Or integrate with a headless CMS like Contentful, Sanity, or Markdown files

## Design Features

- **Minimalist Design**: Lots of whitespace, clean typography
- **Bold Typography**: Large, impactful headings
- **Limited Color**: Strategic use of Pantone Mocha Mousse accent color
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Simple Navigation**: Single-page layout with clear sections
- **Subtle Interactions**: Hover effects on links and blog posts

## Deployment

This project is ready to be deployed to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with one click!

Vercel will automatically detect the Vite configuration and deploy your site.

# Matthew-sportfolio
