const KEY = import.meta.env.VITE_POSTHOG_KEY

// PostHog page analytics: visitors, page views, referrers, clicks, time on
// page. All of Matthew's sites report into one PostHog project, split by host
// in the dashboard. Events go through /ingest (rewritten to PostHog in
// vercel.json, proxied in vite.config.js for dev) so ad blockers don't drop
// them. No session replay. No key set → nothing loads.
// Its own chunk, fetched after the page is up, so it stays out of the home
// bundle budget.
export function startAnalytics() {
  if (!KEY) return
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      capture_pageview: 'history_change',
      capture_pageleave: true,
      person_profiles: 'identified_only',
      persistence: 'localStorage',
      disable_session_recording: true,
    })
  })
}
