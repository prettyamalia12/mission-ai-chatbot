# Product & Feature Spec — Mission AI Chatbot

## Overview

Mission AI Chatbot is an internal tool for the **Freedom Team** to create community missions in the **QuestLab** system. Instead of filling out complex forms, operators describe a mission in natural language and the AI assistant (AVA) guides them through a structured conversation to produce a complete, validated mission configuration.

## Problem

Creating missions manually in QuestLab requires detailed knowledge of:
- Mission types and their rules
- Segment event tracking and metric configuration
- Reward structures and thresholds
- Community/entity identifiers

This creates friction and room for configuration errors. Non-technical operators struggle with the interface.

## Solution

AVA (the AI assistant) acts as a knowledgeable co-pilot that:
1. Accepts a natural language mission idea
2. Asks structured follow-up questions to fill in all required fields
3. Validates inputs against system rules
4. Shows a live preview as the mission is built
5. Outputs a complete, ready-to-publish mission configuration

## Users

- Internal Freedom Team operators
- Community managers creating missions for their communities

## Goals

- Reduce mission creation time
- Eliminate configuration errors through guided input
- Make mission creation accessible to non-technical operators
- Provide a live preview so operators can see the mission as it's being built

## Out of Scope (v1)

- NFT picker wired to a live API
- Publishing directly to the QuestLab API (currently navigates to dashboard as confirmation)
- Multi-language support
- Mission editing after publish

---

## Features

### 1. Chat Interface

The primary interaction surface. Operators type free-form messages; AVA responds with structured questions or updates.

**Components:**
- `AvaAvatar` — AVA's avatar icon displayed next to her messages
- `AvaBubble` — AVA's message bubble with basic markdown rendering (`**bold**`)
- `UserBubble` — Right-aligned user message bubble
- `TypingIndicator` — Animated dots shown while AVA is responding or an image is being generated
- `ChatInput` — Text input with send button; disabled while AVA is responding

**Behavior:**
- Messages stream in via SSE (Server-Sent Events) for a real-time typing feel
- AVA's responses accumulate as streaming chunks arrive, then display all at once after the stream ends
- Input is locked while AVA is typing

---

### 2. Quick Picks

Shown on the landing screen before any message is sent. Four preset mission types the operator can click to skip typing the first message.

| Quick Pick | Sends message |
|---|---|
| Invite Friends | "I want to create an Invite Friends mission" |
| Minimum Spend | "I want to create a Minimum Spend mission" |
| Purchase Items | "I want to create a Purchase Items mission" |
| Token Topup | "I want to create a Token Topup mission" |

---

### 3. Mission Types

AVA supports three mission types as defined by the QuestLab system:

| Type | Description | Example |
|---|---|---|
| **Simple** | One requirement → one reward | Invite 1 friend → 10 FDS |
| **Milestone** | One metric, multiple reward thresholds (levels) | Level 1: Invite 3 → Token, Level 2: Invite 6 → XP, Level 3: Invite 9 → NFT |
| **Multi-Step** | Multiple sequential steps; each may be an action or event | Visit page → Complete quiz → Make purchase |

---

### 4. Metric / Event Tracking

When a mission step requires event tracking, AVA creates a **metric** definition:

- **Source:** Segment
- **Entity:** Staging (`e-9946bedf-3c65-4111-b296-ca6fd2a3a738`) / Production (`k-8fb7df14-87ee-4c3b-bd77-1badf3e33834`)
- **Naming format:** `event-name-community-name-action` (lowercase, dash-separated)
- **propagate_to_sub_entities:** always `true`
- **Increment property:** `order_amount` for payment events (excludes fees)

**Supported event:** `Fdp Payment Completed`
- Filters: `currency = THB` (default), `merchant_name = <community>`, optionally `product_category_code = token-bundle` for top-ups

---

### 5. Required Information Checklist

AVA asks clarifying questions until all fields are collected:

**Mission Info:**
- Community name
- Mission title
- Mission description
- Mission type (simple / milestone / multi-step)
- Start and end dates

**Logic:**
- Action or event tracking
- Requirement threshold
- Increment logic (if accumulation is needed)

**Rewards:**
- Reward type (FDS token, XP, NFT, Voucher)
- Reward amount
- Reward pool

---

### 6. Live Preview Panel

Opens automatically after AVA has enough information to show a partial mission. Updates in real time as the conversation progresses.

**Shows:**
- Cover image (placeholder until generated)
- Community name + duration badge
- Mission title
- Progress bar and milestone to-do list (milestone missions)
- Step list (simple / multi-step missions)
- Mission description
- Completion percentage in the header

**Completion states:**
- `< 100%` → "Please Keep chatting with AVA!"
- `100%` → "You are all set!"

---

### 7. Cover Image Generation

When AVA determines a cover image is needed, it calls `/api/generate-image` with the mission title as the prompt. The generated image is displayed in both the preview panel and the chat as a message from AVA.

- Real mode: OpenAI DALL-E (requires `OPENAI_API_KEY`)
- Mock mode: Returns a placeholder from picsum.photos after a 1.5s simulated delay

---

### 8. Confirm and Publish Flow

When the mission is complete (`completion_percentage = 100`), AVA shows a summary and the **Save Draft** / **Preview and Publish** buttons appear in the chat.

**Clicking Preview and Publish:**
1. Opens a confirmation modal showing the full mission summary (cover image, title, description, type, dates, milestones/rewards)
2. Operator clicks **Confirm**
3. Navigates to `/dashboard?published=true`
4. Dashboard shows a slide-in **Congratulations** panel confirming the mission was launched

---

### 9. Campaign Dashboard

A separate page (`/dashboard`) showing all missions for the community.

**Stats row:** Total / Active / Scheduled / Ended campaign counts

**Filters:** Type, Reward, Status, Campaign Date

**Table columns:** No., Campaign Name, Type, Start Date, End Date, Reward

**Entry point to create a new mission:** "Create Mission" button → `/`
