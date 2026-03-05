# Testing Guide

## Mock Mode (no API keys needed)

Mock mode activates automatically when `ANTHROPIC_API_KEY` is not set in `.env.local`.

### Setup

1. Make sure `.env.local` has the API key commented out:
   ```
   # ANTHROPIC_API_KEY=sk-ant-...
   ```

2. Start the dev server:
   ```bash
   /opt/homebrew/opt/node/bin/node ./node_modules/.bin/next dev --port 3001
   ```

3. Open `http://localhost:3001`

---

## Mock Conversation Flow

The mock simulates a 5-step conversation. Type anything to advance each step.

| Message # | What you type | AVA responds with | Preview panel |
|-----------|--------------|-------------------|---------------|
| 1 | Anything (e.g. "hi") | Introduction + asks what kind of mission | Hidden |
| 2 | "invite", "spend", "purchase", or anything else | Confirms mission type, asks for milestones | Opens (25% complete) |
| 3 | Anything (e.g. "3 levels") | Sets up 3 milestones, asks for rewards | Updates with milestones (60%) |
| 4 | Anything (e.g. "tokens and xp") | Triggers cover image generation | Updates description (80%) |
| 5 | Anything | Final summary + **Preview and Publish** button | 100% complete |

> **Tip:** On message 2, the word you use changes the mission type label:
> - "invite" → Community Referral
> - "spend" → Minimum Spend
> - "purchase" → Purchase Items
> - anything else → Token Topup

---

## Quick Picks

The landing screen has quick-pick buttons that skip typing step 1 and go straight to message 2.

---

## Switching to Real Claude API

1. Add credits to your Anthropic account at [console.anthropic.com](https://console.anthropic.com) → Plans & Billing
2. Uncomment the API key in `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Restart the dev server

---

## Dashboard

Go to `http://localhost:3001/dashboard` to see the campaign dashboard (mock data, no API needed).

After completing the mock flow and clicking **Confirm**, you'll be redirected here with a `?published=true` query param (banner can be added later).
