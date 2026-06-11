# ZingConnect Monitoring & Alerting Setup Guide

**Last Updated:** 2026-06-12  
**Status:** Step-by-step configuration guide for Sentry + Vercel alerts  
**Target Audience:** DevOps/Platform Engineers (assumes Vercel knowledge)

---

## Table of Contents

1. [Sentry Setup](#sentry-setup)
2. [Vercel Alerts Configuration](#vercel-alerts-configuration)
3. [Dashboards & Metrics](#dashboards--metrics)
4. [Alert Destinations](#alert-destinations)
5. [Daily & Weekly Review Checklist](#daily--weekly-review-checklist)

---

## Sentry Setup

### Why Sentry?

Sentry captures frontend errors, backend exceptions, and performance issues. It provides:
- Real-time error notifications
- Source map support (map minified errors back to original code)
- Release tracking (know which version caused an issue)
- Session replays (see what user did before error occurred)
- Performance monitoring (track slow requests, database queries)

### Step 1: Create Sentry Project

1. Go to [sentry.io](https://sentry.io) and log in / sign up
2. Click "Create Project"
3. Select Platform: **React**
4. Select Alert Rule: Choose "Alert me on every new issue"
5. Project name: `zing-connect-prod`
6. Team: (create or select)
7. Click "Create Project"
8. You'll see your **DSN** (looks like `https://examplePublicKey@o0.ingest.sentry.io/0`). Copy it.

### Step 2: Install Sentry SDK

```bash
npm install @sentry/react @sentry/tracing
```

### Step 3: Initialize Sentry in React App

Add to `src/main.tsx` (before app render, at the very top):

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import App from './App'

// Initialize Sentry BEFORE rendering
Sentry.init({
  // Get this from Sentry project settings
  dsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Only enable in production
  enabled: import.meta.env.MODE === 'production',
  
  // Capture 10% of transactions for performance monitoring
  // Increase to 1.0 in early stages to understand performance patterns
  tracesSampleRate: 0.1,
  
  // Capture 100% of errors (always, unless very high volume)
  integrations: [
    new BrowserTracing({
      // Track React Router navigation
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        window.history
      ),
    }),
  ],
  
  // Release tracking: tie errors to git commits
  release: `zing-connect@${import.meta.env.VITE_APP_VERSION || '0.1.0'}`,
  
  // Environment: helps segment errors by stage
  environment: import.meta.env.VITE_ENV || 'production',
  
  // Capture unhandled promise rejections
  attachStacktrace: true,
  
  // Before sending to Sentry, filter out noisy errors
  beforeSend(event, hint) {
    // Ignore network errors for offline scenarios
    if (event.exception) {
      const error = hint.originalException;
      if (error instanceof Error && error.message.includes('NetworkError')) {
        return null;
      }
    }
    return event;
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Step 4: Add Sentry DSN to Environment Variables

**Update `.env.example`:**
```
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_APP_VERSION=0.1.0
VITE_ENV=production
```

**Update Vercel environment variables** (see Vercel setup section):
- Go to Vercel project → Settings → Environment Variables
- Add: `VITE_SENTRY_DSN` (paste from Sentry)
- Add: `VITE_ENV=production`

### Step 5: Capture Supabase Errors

Create `src/lib/sentry-supabase.ts`:

```typescript
import * as Sentry from '@sentry/react'
import { SupabaseClient } from '@supabase/supabase-js'

export function setupSentrySupabaseMonitoring(supabase: SupabaseClient) {
  // Log all Supabase auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    Sentry.captureMessage(`Auth event: ${event}`, 'info')
    if (event === 'SIGNED_OUT') {
      Sentry.setUser(null)
    } else if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
      })
    }
  })

  // Catch Supabase query errors
  return {
    handleError: (error: any, context: string) => {
      Sentry.captureException(error, {
        tags: {
          source: 'supabase',
          context,
        },
        extra: {
          errorCode: error?.code,
          errorMessage: error?.message,
        },
      })
    },
  }
}
```

Use in your API calls:

```typescript
import { setupSentrySupabaseMonitoring } from '@/lib/sentry-supabase'

const { handleError } = setupSentrySupabaseMonitoring(supabase)

// In your query:
try {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
  
  if (error) {
    handleError(error, 'fetch_bookings')
  }
} catch (err) {
  handleError(err, 'fetch_bookings_catch')
}
```

### Step 6: Configure Release Tracking

Every time you deploy, tell Sentry:

**Add to deployment script or Vercel build settings:**

```bash
# After successful build, before deployment:
npm run build
curl https://sentry.io/api/0/organizations/YOUR-ORG/releases/ \
  -X POST \
  -H 'Authorization: Bearer YOUR-SENTRY-TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "version": "'$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')'"
  }'
```

Or use Sentry CLI (recommended):

```bash
npm install --save-dev @sentry/cli
npx sentry-cli releases create -p zing-connect $(git rev-parse --short HEAD)
```

---

## Vercel Alerts Configuration

### Why Vercel Alerts?

Vercel provides real-time monitoring of:
- HTTP response times (latency)
- Error rates (5xx errors)
- Failed deployments
- Function execution time
- Database connection health

### Step 1: Access Vercel Monitoring

1. Go to [vercel.com](https://vercel.com)
2. Select project: **zing-connect**
3. Go to **Settings** → **Monitoring**
4. Enable "Enable Monitoring" (should be on by default)

### Step 2: Configure Error Rate Alert

Error rate = number of 5xx errors per minute / total requests.

**Alert Rule: Error rate exceeds 5 errors per minute**

1. In Monitoring section, click "Create Alert"
2. Alert Type: **Error Rate**
3. Threshold: `5 errors/min`
4. Check: `Every 1 minute`
5. For: `> 5 minutes` (wait 5 minutes before alerting to avoid noise from brief spikes)
6. Notification Channel: [Configure below](#step-4-configure-alert-destinations)
7. Click "Create"

**Example trigger:** If your app gets 1000 req/min and 60 are 500s, error rate = 60 errors/min (way above 5) → alert fires.

### Step 3: Configure Latency Alerts

**Alert Rule: P99 latency exceeds 1 second**

1. Click "Create Alert"
2. Alert Type: **Response Time**
3. Percentile: **P99** (99th percentile: 99% of requests are faster than this)
4. Threshold: `1000ms` (1 second)
5. Check: `Every 5 minutes`
6. For: `> 2 checks` (must be high for 2 consecutive checks = 10 minutes)
7. Notification Channel: [Configure below](#step-4-configure-alert-destinations)
8. Click "Create"

**Why P99?** P99 catches degradation that impacts real users. P50 (median) can hide issues. Example:
- P50 = 100ms (half requests are faster)
- P95 = 500ms (95% are faster)
- P99 = 1200ms (1% of users see 1.2s+ response time)

**Optional: Also add P95 alert**
- P95 > 700ms (earlier warning before P99 reaches 1s)

### Step 4: Configure Deployment Failure Alert

**Alert Rule: Deployment fails**

1. Click "Create Alert"
2. Alert Type: **Deployment Failures**
3. Projects: **zing-connect**
4. Notification Channel: [Configure below](#step-4-configure-alert-destinations)
5. Click "Create"

This fires whenever a git push fails to build or deploy.

### Step 5: Configure Function-Specific Alerts (Optional)

If using Vercel Functions (serverless API routes):

1. Click "Create Alert"
2. Alert Type: **Function Duration**
3. Function: (select specific functions if you have API routes)
4. Threshold: `5000ms` (5 seconds is typical timeout)
5. Check: `Every 5 minutes`
6. Click "Create"

---

## Dashboards & Metrics

### Sentry Dashboard Setup

**What to monitor in Sentry:**

1. **Home Dashboard** (default on login)
   - Graph: "Errors over time" (shows trend)
   - Table: "Latest issues" (newest problems)
   - Table: "Most frequent errors" (highest impact)

2. **Custom Dashboard** (optional)

   Click "Dashboards" → "Create Dashboard" → Add widgets:

   | Widget | Purpose | Metric |
   |--------|---------|--------|
   | **Error Rate** | Is production broken? | Errors / minute |
   | **P50 Latency** | Typical user speed | 50th percentile response time |
   | **P95 Latency** | Slow user experience | 95th percentile response time |
   | **P99 Latency** | Worst user experience | 99th percentile response time |
   | **Apdex Score** | Overall performance health | Ratio of satisfied:tolerated:frustrated users |
   | **Sessions** | Usage volume | Active user sessions |
   | **Session Replay Count** | Replay availability | Replays available for recent sessions |

   **Creating the dashboard:**
   - Click "Dashboards"
   - Click "Create Dashboard"
   - Name: "Production Health"
   - Add widget: Click "+" → search "Error Rate" → add
   - Add widget: Click "+" → search "Response Time" → add (set to P99)
   - Save

3. **Alert List**
   - Click "Alerts" to see all configured alert rules
   - Verify email/Slack destinations are set

### Vercel Monitoring Dashboard

1. Go to Vercel project → **Monitoring**
2. Review pre-built graphs:
   - **Response Time Distribution** (histogram of all latencies)
   - **Status Codes** (200 OK, 404, 500 errors by count)
   - **Requests Per Second** (traffic volume)
   - **Core Web Vitals** (LCP, FID, CLS if enabled)

3. Set time range to "24 hours" or "7 days" for investigation

### What Each Metric Means

| Metric | Healthy Range | Warning | Critical |
|--------|---|---------|----------|
| **Error Rate** | 0-1 err/min | 1-5 err/min | >5 err/min |
| **P50 Latency** | <200ms | 200-400ms | >400ms |
| **P95 Latency** | <500ms | 500-750ms | >750ms |
| **P99 Latency** | <1000ms (1s) | 1-2s | >2s |
| **Uptime** | >99.5% | 99-99.5% | <99% |
| **Deployment Freq** | 1-3 per day | 3-10 per day | >10 per day (investigate for release frequency) |
| **CPU Usage** | <50% | 50-70% | >70% |
| **Memory Usage** | <60% | 60-80% | >80% |
| **Database Connections** | <5 | 5-8 | >8 |

---

## Alert Destinations

### Step 1: Add Slack Integration to Sentry

1. Go to Sentry → **Settings** (left sidebar, gear icon)
2. Organization → **Integrations**
3. Search "Slack"
4. Click "Install" next to Slack integration
5. Authorize Sentry to access your Slack workspace
6. Select channel: `#prod-alerts` (create if needed)
7. Click "Save"

**Test it:**
- In Sentry, go to a recent error
- Click "Create Alert Rule"
- Select Slack channel: `#prod-alerts`
- Click "Save"
- Close an issue to trigger a test alert

### Step 2: Add Slack Integration to Vercel

1. Go to Vercel project → **Settings**
2. Scroll to **Integrations** section
3. Click "Slack" → "Install"
4. Authorize Vercel to access Slack
5. Select channel: `#deployment-alerts` (or same as above)
6. Click "Save"

**Slack will now receive:**
- Deployment started/completed messages
- Errors per our alert rules

### Step 3: Email Notifications (Fallback)

**In Sentry:**
1. Go to **Settings** → **Email**
2. Verify email address: `dev-team@your-org.com`
3. Go to **Organization** → **Members** → add team email
4. Default notification: "All alerts" or "On demand"

**In Vercel:**
1. Project → **Settings** → **Notifications**
2. Email: add team members
3. Enable "Deployment failures" checkbox

### Step 4: PagerDuty Integration (For On-Call Rotation)

*Optional but recommended for production apps.*

**Sentry + PagerDuty:**

1. Create PagerDuty account: [pagerduty.com](https://pagerduty.com)
2. Create service: "ZingConnect Production"
3. In Sentry → Settings → **Integrations** → search "PagerDuty"
4. Install
5. Connect your PagerDuty account
6. Select service: "ZingConnect Production"
7. Save

**When alert fires:**
- Sentry → Slack immediately
- Sentry → PagerDuty → pages on-call engineer's phone

**Example PagerDuty Alert Rule:**
- Critical: Error rate >10/min → pages immediately
- High: Error rate >5/min → waits 5 min before paging
- Medium: P99 latency >2s → Slack only (no page)

---

## Daily & Weekly Review Checklist

### Daily (Every Morning or Shift Start)

**Time commitment:** 10-15 minutes

**Checklist:**

- [ ] **Sentry Error Dashboard**
  - Open: sentry.io → zing-connect → Home
  - Questions to ask:
    - Any new critical errors? (red alerts)
    - Did error count increase vs yesterday?
    - Any errors we haven't seen before?
  - Action: Click error to see stacktrace + affected users

- [ ] **Vercel Monitoring**
  - Open: vercel.com → zing-connect → Monitoring
  - Set time to "Last 24h"
  - Questions to ask:
    - Did any requests fail? (any red in status codes?)
    - What was the highest P99 latency?
    - Any failed deployments overnight?
  - Action: If P99 >1s, investigate slow functions

- [ ] **Slack Channel Review**
  - Check `#prod-alerts` for overnight alerts
  - Questions to ask:
    - How many alerts fired?
    - Did any error resolve itself?
    - Do we need to page someone?
  - Action: Acknowledge alerts, assign to team member

- [ ] **Key Metrics at a Glance** (create this in Slack pinned message):
  ```
  Daily Health Check - [Date]
  
  Sentry:
  - Errors/hour: [X]
  - New issues: [Y]
  - Most common error: [Z]
  
  Vercel:
  - Deployments: [X]
  - Failed builds: [Y]
  - P99 latency: [Zms]
  
  Uptime: [99.X%]
  ```
  Update this every morning and pin to channel.

---

### Weekly (Every Monday)

**Time commitment:** 30-45 minutes + action items

**Checklist:**

- [ ] **Error Trends**
  - Sentry → go to time range "Last 7 days"
  - Questions:
    - Which errors affected most users?
    - Is error rate trending up or down?
    - Any errors specific to mobile/iOS/Android?
  - Action: Open 1-2 issues for top errors, assign to eng team

- [ ] **Performance Trends**
  - Vercel → Monitoring → Last 7 days
  - Graph: Response Time Distribution
  - Questions:
    - Is P99 latency trending up? (getting slower)
    - Did any function timeout? (duration near 5s limit)
    - Are there time-of-day patterns? (slow during peak hours?)
  - Action: If trending up, investigate code changes or load increase

- [ ] **Deployment Velocity**
  - Vercel → Deployments
  - Count: How many deployments this week?
  - Failures: How many failed?
  - Calculate: Success rate = (total - failed) / total
  - Healthy: >95% success rate
  - Action: If <95%, review failed deployments for patterns

- [ ] **Database Load** (if monitoring Supabase)
  - Go to Supabase → [project] → **Monitoring** (or Database → Performance)
  - Metrics:
    - Active connections (should be < 10 for MVP)
    - Query latency (median should be <100ms)
    - Storage (trending toward limit?)
  - Action: If connections > 10, may need connection pooling

- [ ] **User Session Quality**
  - Sentry → Sessions → Last 7 days
  - Metric: % sessions with errors (should be <5%)
  - Questions:
    - Did error % increase?
    - Any specific user flows with high error rate?
  - Action: If error % > 5%, deep-dive next week

- [ ] **Alert Rule Review**
  - Sentry → Alerts → Review all rules
  - Question: Did we get too many false alerts? (tune threshold)
  - Action: Adjust thresholds if needed
  - Example: If error rate alert fires 5+ times/week, raise threshold from 5 to 10

- [ ] **Team Standup Notes** (Share findings with team)
  ```
  Weekly Monitoring Report - Week of [Date]
  
  Health: [Green/Yellow/Red]
  
  Top Issues:
  1. [Error] - affecting [X users] - owned by [person]
  2. [Performance] - P99 is [Xms] - investigating [cause]
  3. [Deploy] - [Y failed builds] - caused by [root cause]
  
  Trends:
  - Error rate: [↑ up / ↓ down / → stable] vs last week
  - Latency: [↑ up / ↓ down / → stable] vs last week
  - Deployments: [X] deployments ([Y]% success)
  
  Action Items:
  - [ ] [Person] - investigate [error] by [date]
  - [ ] [Person] - optimize [slow endpoint] by [date]
  - [ ] [Person] - review [deployment failure] by [date]
  ```

---

## Troubleshooting

### Sentry: No Errors Showing Up

**Checklist:**
1. Is DSN configured? Check: `import.meta.env.VITE_SENTRY_DSN`
2. Is Sentry enabled in production? Check: `enabled: import.meta.env.MODE === 'production'`
   - Won't log errors in dev mode (by design)
3. Try forcing an error in prod:
   ```typescript
   // Add temporary test in React component
   useEffect(() => {
     if (Math.random() < 0.01) { // 1% of users
       throw new Error('Test Sentry error')
     }
   }, [])
   ```
4. Check browser console for Sentry logs: `console.log('Sentry DSN:', Sentry.getCurrentHub().getClient().getDsn())`

### Vercel: No Monitoring Data

1. Make sure monitoring is enabled: Settings → Monitoring → toggle "on"
2. Wait 5 minutes after enabling, data takes time to populate
3. Generate traffic: hit your site a few times, check again

### Alerts Not Firing

**Sentry:**
1. Verify alert rule exists: Settings → Alerts
2. Verify action rule exists: Settings → Actions (if using more complex logic)
3. Test: manually close an issue → should send notification

**Vercel:**
1. Check alert created: Settings → Monitoring → scroll to "Alerts" section
2. Test: deploy a broken build → should trigger failure alert
3. Check notification channel: may be in spam folder if email

### Too Many Alerts (Alert Fatigue)

**Solution: Adjust thresholds**

Current config:
- Error rate: >5 errors/min → maybe too strict for busy service
- P99 latency: >1000ms → reasonable
- Deployment failure: any → good (should be rare)

**Try increasing to:**
- Error rate: >10 errors/min (allow some errors)
- P99 latency: >1500ms (less sensitive to network jitter)
- Deployments: only failed + staged deployments

---

## Quick Reference: Copy-Paste Commands

### Deploy a release to Sentry
```bash
npm run build
npx sentry-cli releases create -p zing-connect $(git rev-parse --short HEAD)
npx sentry-cli releases finalize $(git rev-parse --short HEAD)
```

### View live errors in terminal
```bash
# Install sentry-cli first
npm install -g @sentry/cli

# Stream errors in real-time (replace PROJECT_ID)
sentry-cli releases list -p zing-connect --org YOUR-ORG-SLUG
```

### Test Sentry setup
```bash
# In browser console:
Sentry.captureException(new Error('Test error'))
```

### Check Vercel monitoring via API
```bash
curl -H "Authorization: Bearer YOUR-VERCEL-TOKEN" \
  https://api.vercel.com/v2/projects/zing-connect/monitoring
```

---

## Related Documentation

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Vercel Monitoring Docs](https://vercel.com/docs/observability/monitoring)
- [Supabase Monitoring](https://supabase.com/docs/guides/platform/monitoring)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Audit](./SECURITY-AUDIT.md)

---

## Ownership & Contact

- **Primary Owner:** Platform/DevOps Team
- **Alert Response:** On-call engineer (see PagerDuty schedule)
- **Questions/Issues:** Raise in `#prod-alerts` Slack channel

**Last Modified:** 2026-06-12
