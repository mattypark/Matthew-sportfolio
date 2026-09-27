// Snapshot Matthew's PUBLIC GitHub into src/life/data/github.json so the site
// never calls GitHub at runtime (no rate limits, no token in the browser).
//
//   node scripts/github-snapshot.mjs
//
// Uses the local `gh` CLI login. Only public, owned, non-fork repos are
// written; private repo names never reach the file.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const LOGIN = 'mattypark'
const RECENT = 6
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/life/data/github.json')

const QUERY = `
query($login: String!, $recent: Int!) {
  user(login: $login) {
    login
    followers { totalCount }
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes { ... on Repository { name description url isPrivate isFork stargazerCount pushedAt primaryLanguage { name color } } }
    }
    repositories(first: $recent, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes { name description url stargazerCount pushedAt primaryLanguage { name color } }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

function gh(query, vars) {
  const args = ['api', 'graphql', '-f', `query=${query}`]
  for (const [k, v] of Object.entries(vars)) args.push(typeof v === 'number' ? '-F' : '-f', `${k}=${v}`)
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8' }))
}

const repoShape = (r) => ({
  name: r.name,
  description: r.description,
  url: r.url,
  stars: r.stargazerCount,
  pushedAt: r.pushedAt,
  language: r.primaryLanguage?.name ?? null,
})

const { data } = gh(QUERY, { login: LOGIN, recent: RECENT })
const u = data.user
const pinned = u.pinnedItems.nodes.filter((r) => r && !r.isPrivate && !r.isFork).map(repoShape)
const pinnedNames = new Set(pinned.map((r) => r.name))
// the profile README repo (named after the login) isn't a project
const recent = u.repositories.nodes
  .filter((r) => !pinnedNames.has(r.name) && r.name !== u.login)
  .map(repoShape)

const days = u.contributionsCollection.contributionCalendar.weeks.map((w) =>
  w.contributionDays.map((d) => [d.date, d.contributionCount]),
)

const snapshot = {
  login: u.login,
  url: `https://github.com/${u.login}`,
  takenAt: new Date().toISOString(),
  followers: u.followers.totalCount,
  publicRepos: u.repositories.totalCount,
  contributionsLastYear: u.contributionsCollection.contributionCalendar.totalContributions,
  pinned,
  recent,
  weeks: days,
}

fs.writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`wrote ${path.relative(process.cwd(), OUT)}: ${pinned.length} pinned, ${recent.length} recent, ${snapshot.contributionsLastYear} contributions`)
