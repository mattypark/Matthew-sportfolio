# Setup Instructions

To get started with this portfolio, follow these steps:

## Prerequisites

You need to have Node.js installed. If you don't have it:

1. Download Node.js from https://nodejs.org/
2. Or install via Homebrew: `brew install node`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git (if not already done):
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Commit:
```bash
git commit -m "Initial commit: Portfolio website"
```

4. Create a new repository on GitHub

5. Add remote and push:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Vite project
6. Click "Deploy"
7. Your site will be live in seconds!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

