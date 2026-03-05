# UI Spec — Mission AI Chatbot

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Brand green | `#22C55E` / `emerald-500` | Primary buttons, active states, user bubbles |
| Brand green hover | `#16A34A` / `emerald-600` | Button hover states |
| Background | `#FFFFFF` | Chat panel, modals |
| Dashboard background | `#F3F4F6` | Dashboard page bg |
| Border | `#E5E7EB` / `gray-200` | Dividers, card borders |
| Text primary | `#111827` / `gray-900` | Headings, bold labels |
| Text secondary | `#6B7280` / `gray-500` | Subtext, meta info |
| Text muted | `#9CA3AF` / `gray-400` | Placeholders, timestamps |
| User bubble bg | `#D1FAE5` / `emerald-100` | User chat messages |
| AVA bubble bg | Transparent | AVA messages render on white |

---

## Layout

### Create Mission Page (`/`)

```
┌─────────────────────────────────────────────────────┐
│  TopBar (h-14, border-b)                            │
├──────────────────────────┬──────────────────────────┤
│  Chat Panel              │  Preview Panel           │
│  (55% width when open)   │  (45% width, border-l)   │
│                          │                          │
│  - Messages list         │  - Header (% complete)   │
│  - Typing indicator      │  - Cover image           │
│  - Input bar (bottom)    │  - Mission card          │
│                          │  - Progress bar          │
│                          │  - Milestone list        │
│                          │  - Description           │
│                          │  - Terms (collapsed)     │
└──────────────────────────┴──────────────────────────┘
```

- Preview panel is hidden on load; appears when AVA first calls `update_mission_preview`
- Transition: `transition-all duration-300` on chat panel width
- Both panels scroll independently

### Dashboard Page (`/dashboard`)

Full-width scrollable page (`overflow-y-auto`), gray background `#F3F4F6`.

```
┌─────────────────────────────────────────────┐
│  Header: "Mission" + Create Mission button  │
├─────────────────────────────────────────────┤
│  Stats row (4 cards)                        │
├─────────────────────────────────────────────┤
│  Filter dropdowns                           │
├─────────────────────────────────────────────┤
│  Campaign table (white card, rounded-2xl)   │
└─────────────────────────────────────────────┘
```

---

## Components

### TopBar

```
← Create Mission                               ✕
```

- Height: `h-14`
- Background: white, `border-b border-gray-200`
- Left: back arrow (`ArrowLeft` icon) + "Create Mission" title
- Right: close icon (`X`)
- Both icons link to `/dashboard`
- Icon color: `text-gray-400`, hover: `text-gray-600`

---

### Landing State (no messages yet)

Centered vertically in the chat panel:

```
        [✦ gradient circle, w-16 h-16]
        Hi! Ready to build your mission?
   Describe the task your audience should complete
               or choose one below.

              [  Chat input field  ]

   [Invite Friends]  [Minimum Spend]
   [Purchase Items]  [Token Topup  ]
```

- Gradient circle: `from-blue-400 to-cyan-500`
- Quick picks: `grid grid-cols-2 gap-3`

---

### Quick Pick Cards

```
┌──────────────────────────────┐
│ [icon]  Invite Friends       │
│         Encourage users to   │
│         invite friends...    │
└──────────────────────────────┘
```

- Border: `border border-gray-200 rounded-xl`
- Hover: `border-emerald-300 bg-emerald-50/30`
- Icon container: `w-8 h-8 rounded-lg bg-blue-50`, icon `text-blue-500`
- Title: `text-sm font-semibold text-gray-800`
- Description: `text-xs text-gray-500`

---

### User Bubble

```
                    ┌──────────────┐
                    │  user text   │
                    └──────────────┘
```

- Right-aligned (`flex justify-end`)
- Max width: `max-w-[70%]`
- Background: `bg-emerald-100`
- Border radius: `rounded-2xl rounded-tr-sm`
- Text: `text-sm text-gray-800`
- Padding: `px-4 py-2.5`

---

### AVA Bubble

```
[●]  AVA message text here, can be
     multi-line with **bold** support
```

- Left-aligned with `gap-2` from avatar
- Avatar: 28px circle
- Text: `text-sm text-gray-700 leading-relaxed whitespace-pre-wrap`
- Supports `**bold**` via inline `renderMarkdown()`

---

### Typing Indicator

```
[●]  [• • •]
     Creating cover image
```

- Three animated dots
- Optional label below (e.g. "Creating cover image")

---

### Chat Input

- Full-width text field
- Send button on the right
- Disabled + grayed out while AVA is typing
- Border: `rounded-xl border border-gray-200`
- Focus: `ring-2 ring-emerald-300`

---

### Action Buttons (end of conversation)

```
[●]  [ Save draft ]  [ Preview and Publish ]
```

- Save draft: `border border-gray-200 rounded-xl text-sm font-medium text-gray-700`
- Preview and Publish: `bg-emerald-500 text-white rounded-xl text-sm font-semibold`

---

### Preview Panel

**Header:**
```
Please Keep chatting with AVA!          60% Completed ▾
```

**Body:**
```
┌─────────────────────────────┐
│     [Cover image / gray     │
│          placeholder]       │
│                             │
│  [C] Community Name   ⏱ Xd │
│  Mission Title              │
│                             │
│  Progress: ①──②──③──✓       │
│  Current progress 0         │
│                       X to LVL 1 │
│                             │
│  To Do                      │
│  → Level 1: Invite 3 ...  🎁│
│    Level 2: Invite 6 ...  🎁│
│    Level 3: Invite 9 ...  🎁│
│                             │
│  Description                │
│  Mission description text   │
│                             │
│  Terms and Conditions     ▾ │
└─────────────────────────────┘
```

- Cover placeholder: `bg-gray-200 rounded-xl h-40`
- Community avatar: `w-6 h-6 bg-blue-600 rounded text-white text-[9px]`
- Duration badge: `bg-yellow-50 text-yellow-700 border-yellow-200 rounded-full text-[10px]`
- Progress dots: `w-6 h-6 rounded-full`, active = `bg-emerald-500`, inactive = `bg-gray-200`
- Active milestone row: `border border-emerald-300 bg-white rounded-xl`
- Inactive rows: `bg-gray-100 rounded-xl`

---

### Confirm to Create Mission (Modal)

Full-screen overlay, centered card:

```
Confirm to Create Mission                          ✕

[Cover image full width, h-48, rounded-xl]

Mission Title
Mission description text...

Mission Type:          Community Referral
Publish Date:          2026-03-10
Unpublish Date:        2026-06-10

Level 1: Invite 3 friends          [Token]
Level 2: Invite 6 friends          [XP]
Level 3: Invite 9 friends          [NFT]

[ Save Draft ]        [ Confirm ]
```

- Overlay: `bg-black/40`
- Card: `bg-white rounded-2xl w-[520px] max-h-[85vh] overflow-y-auto p-8`
- Reward badges: `w-7 h-7 rounded-lg bg-gray-800 text-white text-[9px]`
- Save Draft: `border border-gray-200 rounded-xl`
- Confirm: `bg-emerald-500 text-white rounded-xl`

---

### Congratulations Panel (Dashboard slide-in)

```
┌──────────────────────────────────────┐
│ Congratulations                      │
│ You have launched a Mission 🎉       │
│ Your community can view...           │
│                                      │
│ [Cover image or gradient placeholder]│
│                                      │
│ Mission Title                      ✕ │
│ [Progress bar]                       │
│                                      │
│ Mission description...               │
│                                      │
│ Level 1: Invite 3 friends    [Token] │
│ Level 2: Invite 6 friends    [XP]    │
│ Level 3: Invite 9 friends    [XP]    │
│ Level 4: Invite 12 friends [NFT][XP] │
│                                      │
│ [ Edit ]           [ Close ]         │
└──────────────────────────────────────┘
```

- Positioned: `absolute top-0 right-0 h-full w-[420px]`
- Background: white with `shadow-2xl border-l border-gray-200`
- Cover placeholder: gradient `from-pink-200 to-blue-200`

---

### Campaign Dashboard Table

- Table card: `bg-white rounded-2xl border border-gray-100 shadow-sm`
- Header cells: `text-xs font-semibold text-gray-500`
- Campaign name: `text-sm font-medium text-emerald-600` (clickable)
- Other cells: `text-sm text-gray-500`
- Row hover: `hover:bg-gray-50/50`

---

## Spacing & Sizing Reference

| Element | Size |
|---|---|
| TopBar height | `h-14` (56px) |
| Chat panel padding | `p-6` |
| Message gap | `space-y-5` |
| Input bar padding | `p-4 border-t` |
| Preview panel width | 45% of viewport |
| Chat panel width (with preview) | 55% of viewport |
| Chat panel width (no preview) | 100% |
| Confirm modal width | `w-[520px]` |
| Congratulations panel width | `w-[420px]` |
| Quick pick icon | `w-8 h-8` |
| Progress step dots | `w-6 h-6` |
| Reward badges | `w-7 h-7` |
