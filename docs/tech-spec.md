# Tech Spec — Mission AI Chatbot

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (no TypeScript) |
| Styling | Tailwind CSS v4 |
| AI | Anthropic Claude (`claude-sonnet-4-6` via `@anthropic-ai/sdk`) |
| Image gen | OpenAI DALL-E (`openai` SDK) |
| Runtime | Node.js 20+ (use `/opt/homebrew/opt/node/bin/node` on this machine) |
| Deployment | Vercel (planned) |

---

## Project Structure

```
mission-ai-chatbot/
├── app/
│   ├── page.js                   # Create Mission page (/)
│   ├── dashboard/page.js         # Campaign Dashboard (/dashboard)
│   └── api/
│       ├── chat/route.js         # SSE streaming chat endpoint
│       └── generate-image/route.js # Image generation endpoint
├── components/
│   ├── chat/
│   │   ├── CreateMission.jsx     # Main chat + preview layout
│   │   ├── AvaAvatar.jsx         # AVA icon component
│   │   ├── TypingIndicator.jsx   # Animated typing dots
│   │   ├── QuickPicks.jsx        # Landing quick-select buttons
│   │   └── ChatInput.jsx         # Text input with send
│   ├── preview/
│   │   └── MissionPreview.jsx    # Live preview panel
│   ├── dashboard/
│   │   ├── CampaignDashboard.jsx # Dashboard table + stats
│   │   └── CongratulationsPanel.jsx # Post-publish slide-in panel
│   └── layout/
│       └── TopBar.jsx            # Top navigation bar
├── lib/
│   ├── claude.js                 # Anthropic client + tool schema
│   └── system-prompt.js          # AVA system prompt
├── docs/                         # Spec documents
├── .env.local                    # API keys (not committed)
└── TESTING.md                    # Testing guide
```

---

## API Routes

### `POST /api/chat`

Accepts the full conversation history and streams AVA's response as SSE.

**Request body:**
```json
{ "messages": [{ "role": "user", "content": "..." }, ...] }
```

**SSE event types emitted:**
| Event | Fields | Description |
|---|---|---|
| `text` | `content: string` | Streamed text chunk from AVA |
| `tool_call` | `tool: string`, `input: object` | Tool call result (e.g. `update_mission_preview`) |
| `error` | `message: string` | API or processing error |
| `done` | — | Stream complete |

**Mock mode:** Activated when `ANTHROPIC_API_KEY` is not set. Returns a scripted 5-step conversation regardless of what the user sends.

**Real mode:** Calls `anthropic.messages.create()` with streaming enabled. Processes `content_block_delta` events for text and `content_block_stop` for tool use.

---

### `POST /api/generate-image`

Generates a cover image for the mission.

**Request body:**
```json
{ "prompt": "mission title or description" }
```

**Response:**
```json
{ "url": "https://..." }
```

**Mock mode:** Returns `https://picsum.photos/seed/mission/1024/1024` after a 1.5s delay when `OPENAI_API_KEY` is not set.

**Real mode:** Calls OpenAI DALL-E with a styled prompt.

---

## Claude Tool: `update_mission_preview`

AVA calls this tool whenever mission details change. The client side intercepts the `tool_call` SSE event and updates the preview panel state.

**Schema key fields:**
```js
{
  mission_type: 'simple' | 'milestone' | 'multi_step',
  title: string,
  description: string,
  community: string,
  milestones: [{ level, requirement, threshold, rewards: [{ type, amount, label }] }],
  steps: [{ label, threshold, completed }],
  duration: { start_date, end_date, days },
  cover_image_url: string | null,
  completion_percentage: number  // 0–100, required
}
```

---

## State Management (Client)

All state lives in `CreateMission.jsx` — no external state library.

| State | Type | Purpose |
|---|---|---|
| `apiMessages` | `array` | Full message history sent to Claude API |
| `displayMessages` | `array` | Messages rendered in the chat UI |
| `mission` | `object` | Current mission config from tool calls |
| `completionPct` | `number` | Drives preview header label |
| `isTyping` | `boolean` | Shows typing indicator |
| `typingLabel` | `string` | Label shown during image generation |
| `showPreview` | `boolean` | Whether the right preview panel is visible |
| `showConfirm` | `boolean` | Whether the publish confirmation modal is open |

---

## SSE Parsing

The client reads the SSE stream with `ReadableStream.getReader()`:

```js
const reader = res.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // parse `data: {...}` lines
}
```

JSON parse errors are caught per-line and skipped (`continue`) to avoid breaking the stream on partial chunks. Event processing happens outside the parse try/catch to allow real errors to surface.

---

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API access | For real AI mode |
| `OPENAI_API_KEY` | DALL-E image generation | For real image gen |

Both are optional — the app runs in mock mode without them.

---

## Local Development

```bash
# Start dev server (must use Homebrew Node on this machine)
/opt/homebrew/opt/node/bin/node ./node_modules/.bin/next dev --port 3001
```

App runs at `http://localhost:3001`

Mock mode activates automatically when `ANTHROPIC_API_KEY` is commented out or missing from `.env.local`.

---

## Deployment

Planned: Vercel

```bash
npm install -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

Set `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` in Vercel project environment variables before deploying.
