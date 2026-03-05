# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Commands

```bash
# Always use Homebrew Node (system Node is too old)
/opt/homebrew/opt/node/bin/node ./node_modules/.bin/next dev   # Dev server at localhost:3000
/opt/homebrew/opt/node/bin/npm install <pkg>                   # Install packages
/opt/homebrew/opt/node/bin/npm run build                       # Production build
```

## Stack

- **Next.js 16** App Router + **Tailwind CSS v4**, JavaScript (no TypeScript)
- **Anthropic SDK** (`@anthropic-ai/sdk`) — Claude claude-sonnet-4-6 with streaming + tool use
- **OpenAI SDK** (`openai`) — DALL-E 3 for image generation
- **lucide-react** for icons

## Architecture

- Entry: `app/page.js` → Create Mission AI chat (opens directly)
- After publish: `app/dashboard/page.js` → Campaign dashboard table + Congratulations panel
- API routes:
  - `app/api/chat/route.js` — Claude streaming chat with `update_mission_preview` tool
  - `app/api/generate-image/route.js` — OpenAI DALL-E 3
- `lib/system-prompt.js` — Mission AI system prompt (editable here)
- `lib/claude.js` — Anthropic client
- `lib/openai.js` — OpenAI client
- Components: `components/layout/`, `components/chat/`, `components/preview/`, `components/dashboard/`

## Env

Copy `.env.local.example` to `.env.local` and fill in keys:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`

## AI Name

The AI assistant is called **AVA** in the UI.
