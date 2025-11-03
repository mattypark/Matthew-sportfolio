# Blog Setup Guide

Your portfolio currently has placeholder blog posts. Here are three approaches to implement a working blog, from simplest to most advanced:

## Option 1: Markdown Files (Recommended for Beginners)

This approach stores blog posts as Markdown files and uses a simple routing system.

### Steps:

1. **Install dependencies:**
```bash
npm install react-router-dom react-markdown gray-matter
```

2. **Create a blog posts directory:**
```bash
mkdir -p src/content/blog
```

3. **Create a sample blog post** (`src/content/blog/my-first-post.md`):
```markdown
---
title: "My First Blog Post"
date: "2025-11-02"
description: "This is my first blog post"
---

# My First Blog Post

This is the content of my blog post. You can write in **Markdown**!

## Features

- Easy to write
- Supports formatting
- Code blocks work too

\`\`\`javascript
console.log('Hello, world!')
\`\`\`
```

4. **Update your Portfolio.jsx** to use actual slugs matching your markdown files:
```javascript
const blogPosts = [
  {
    title: 'My First Blog Post',
    date: 'November 2, 2025',
    description: 'This is my first blog post',
    link: '/blog/my-first-post'
  },
]
```

5. **Create a blog post component** (`src/components/BlogPost.jsx`):
```javascript
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import matter from 'gray-matter'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Import the markdown file dynamically
    import(`../content/blog/${slug}.md`)
      .then(res => fetch(res.default))
      .then(res => res.text())
      .then(text => {
        const { data, content } = matter(text)
        setPost({ ...data, content })
        setLoading(false)
      })
      .catch(() => {
        setPost(null)
        setLoading(false)
      })
  }, [slug])

  if (loading) return <div className="min-h-screen bg-white p-8">Loading...</div>
  if (!post) return <div className="min-h-screen bg-white p-8">Post not found</div>

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        <Link to="/" className="text-mocha-mousse hover:underline mb-8 inline-block">
          ← Back to home
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-8">{post.date}</p>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  )
}

export default BlogPost
```

6. **Update App.jsx** to use React Router:
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './components/Portfolio'
import BlogPost from './components/BlogPost'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  )
}

export default App
```

7. **Configure Vite** to handle markdown files (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
})
```

---

## Option 2: Headless CMS (Best for Non-Technical Content Updates)

Use a service like **Contentful**, **Sanity**, or **Strapi** to manage your blog posts through a visual interface.

### Recommended: Contentful

1. **Sign up** at [contentful.com](https://www.contentful.com)
2. **Create a content model** for blog posts with fields:
   - Title (Short text)
   - Slug (Short text)
   - Date (Date)
   - Description (Long text)
   - Content (Rich text)

3. **Install Contentful SDK:**
```bash
npm install contentful
```

4. **Create a Contentful client** (`src/utils/contentful.js`):
```javascript
import { createClient } from 'contentful'

const client = createClient({
  space: 'YOUR_SPACE_ID',
  accessToken: 'YOUR_ACCESS_TOKEN',
})

export const getBlogPosts = async () => {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    order: '-fields.date',
  })
  return entries.items
}

export const getBlogPost = async (slug) => {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  })
  return entries.items[0]
}
```

5. **Update Portfolio.jsx** to fetch from Contentful:
```javascript
const [blogPosts, setBlogPosts] = useState([])

useEffect(() => {
  getBlogPosts().then(posts => {
    setBlogPosts(posts.map(post => ({
      title: post.fields.title,
      date: post.fields.date,
      description: post.fields.description,
      link: `/blog/${post.fields.slug}`,
    })))
  })
}, [])
```

---

## Option 3: Static Site Generation with Next.js (Most Professional)

For a production-ready blog with excellent SEO and performance, consider migrating to **Next.js** with static generation.

### Benefits:
- Pre-rendered pages for better SEO
- Faster page loads
- Built-in routing
- API routes for dynamic content

This would require a more significant refactor but is ideal for a professional portfolio with a blog.

---

## Quick Start: Which Option Should You Choose?

| Option | Best For | Difficulty | Features |
|--------|----------|-----------|----------|
| **Markdown Files** | Developers who can edit code | Easy | Simple, version-controlled |
| **Headless CMS** | Non-technical content updates | Medium | Visual editor, no coding needed |
| **Next.js** | Professional production site | Advanced | Best performance & SEO |

**For your current setup, I recommend starting with Option 1 (Markdown Files).** It's the easiest to implement and you can always migrate later.

---

## Current Blog Structure

Your blog posts are currently defined as a JavaScript array in `Portfolio.jsx`. To activate a blog system:

1. Choose one of the options above
2. Follow the setup instructions
3. Update your `socialLinks`, `achievements`, and blog post links with your actual URLs
4. Deploy to Vercel (it supports all three options automatically!)

## Need Help?

If you need assistance implementing any of these options, feel free to ask! Each approach has its strengths depending on your technical comfort level and future plans.

