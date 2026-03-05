const USE_MOCK = !process.env.GEMINI_API_KEY

// Simulate a full conversation flow based on message count
function getMockResponse(messages) {
  const userMessages = messages.filter(m => m.role === 'user')
  const count = userMessages.length
  const lastUserMsg = userMessages[userMessages.length - 1]?.content || ''

  // Detect what the user said to vary responses
  const lower = typeof lastUserMsg === 'string' ? lastUserMsg.toLowerCase() : ''

  if (count === 1) {
    return {
      texts: [
        "Hi! I'm AVA, your Mission Creation Assistant. I'll help you design a mission that engages your community.\n\n",
        "To get started, what kind of action do you want your community members to take? For example:\n\n",
        "- **Invite friends** to join your community\n- **Make a minimum spend** on the platform\n- **Purchase specific items**\n- **Top up tokens**\n\n",
        "What's your goal for this mission?"
      ],
      toolCall: null,
    }
  }

  if (count === 2) {
    const missionType = lower.includes('invite') ? 'Community Referral' :
                        lower.includes('spend') ? 'Minimum Spend' :
                        lower.includes('purchase') ? 'Purchase Items' : 'Token Topup'
    return {
      texts: [
        `Great! A **${missionType}** mission sounds perfect. Let me set that up.\n\n`,
        "Now, how many levels/milestones do you want? For example:\n",
        "- Level 1: Invite 3 friends → Token reward\n- Level 2: Invite 6 friends → XP reward\n- Level 3: Invite 9 friends → NFT reward\n\n",
        "Or tell me a custom milestone structure."
      ],
      toolCall: {
        tool: 'update_mission_preview',
        input: {
          mission_type: missionType,
          title: `${missionType} Mission`,
          description: 'Engage your community members to grow together.',
          community: 'Mystic Valley',
          milestones: [],
          steps: [],
          duration: { start_date: null, end_date: null },
          cover_image_url: null,
          completion_percentage: 25,
        }
      }
    }
  }

  if (count === 3) {
    return {
      texts: [
        "Perfect! I'll set up 3 milestones for you.\n\n",
        "What rewards do you want to offer? Options:\n- **Token** (cryptocurrency)\n- **XP** (experience points)\n- **NFT** (digital collectible)\n\nOr mix and match across levels!"
      ],
      toolCall: {
        tool: 'update_mission_preview',
        input: {
          mission_type: 'Community Referral',
          title: 'Invite Friends to Join Mystic Valley',
          description: 'Invite your friends to join the Mystic Valley community and earn exciting rewards!',
          community: 'Mystic Valley',
          milestones: [
            { level: 1, requirement: 'Invite 3 friends', threshold: 3, rewards: [{ type: 'Token', amount: '50 MYST' }] },
            { level: 2, requirement: 'Invite 6 friends', threshold: 6, rewards: [{ type: 'XP', amount: '100 XP' }] },
            { level: 3, requirement: 'Invite 9 friends', threshold: 9, rewards: [{ type: 'NFT', amount: '1 NFT' }] },
          ],
          steps: [
            { step: 1, description: 'Click the Referral button on the home page', completed: false },
            { step: 2, description: 'Share your QR code or referral link', completed: false },
            { step: 3, description: 'Friend joins and gets verified', completed: false },
          ],
          duration: { start_date: '2026-03-10', end_date: '2026-06-10' },
          cover_image_url: null,
          completion_percentage: 60,
        }
      }
    }
  }

  if (count === 4) {
    return {
      texts: [
        "Excellent choices! Now let me generate a cover image for this mission.\n\n",
        "Creating cover image for: Invite Friends to Join Mystic Valley...\n\n",
        "Almost done! Let me finalize everything."
      ],
      toolCall: {
        tool: 'update_mission_preview',
        input: {
          mission_type: 'Community Referral',
          title: 'Invite Friends to Join Mystic Valley',
          description: 'Invite your friends to join the Mystic Valley community and earn exciting rewards! Click the Referral button, share your link, and get rewarded when friends join.',
          community: 'Mystic Valley',
          milestones: [
            { level: 1, requirement: 'Invite 3 friends', threshold: 3, rewards: [{ type: 'Token', amount: '50 MYST' }] },
            { level: 2, requirement: 'Invite 6 friends', threshold: 6, rewards: [{ type: 'XP', amount: '100 XP' }] },
            { level: 3, requirement: 'Invite 9 friends', threshold: 9, rewards: [{ type: 'NFT', amount: '1 NFT' }] },
          ],
          steps: [
            { step: 1, description: 'Click the Referral button on the home page', completed: false },
            { step: 2, description: 'Share your QR code or referral link', completed: false },
            { step: 3, description: 'Friend joins and gets verified', completed: false },
          ],
          duration: { start_date: '2026-03-10', end_date: '2026-06-10' },
          cover_image_url: null,
          completion_percentage: 80,
        }
      }
    }
  }

  // Final message — ready to publish
  return {
    texts: [
      "Your mission is ready! Here's a summary:\n\n",
      "**Mission:** Invite Friends to Join Mystic Valley\n",
      "**Type:** Community Referral\n",
      "**Duration:** March 10 – June 10, 2026\n",
      "**Milestones:** 3 levels (Token → XP → NFT)\n\n",
      "Everything looks great. You can now click **Preview and Publish** to launch your mission!"
    ],
    toolCall: {
      tool: 'update_mission_preview',
      input: {
        mission_type: 'Community Referral',
        title: 'Invite Friends to Join Mystic Valley',
        description: 'Invite your friends to join the Mystic Valley community and earn exciting rewards! Click the Referral button, share your link, and get rewarded when friends join.',
        community: 'Mystic Valley',
        milestones: [
          { level: 1, requirement: 'Invite 3 friends', threshold: 3, rewards: [{ type: 'Token', amount: '50 MYST' }] },
          { level: 2, requirement: 'Invite 6 friends', threshold: 6, rewards: [{ type: 'XP', amount: '100 XP' }] },
          { level: 3, requirement: 'Invite 9 friends', threshold: 9, rewards: [{ type: 'NFT', amount: '1 NFT' }] },
        ],
        steps: [
          { step: 1, description: 'Click the Referral button on the home page', completed: false },
          { step: 2, description: 'Share your QR code or referral link', completed: false },
          { step: 3, description: 'Friend joins and gets verified', completed: false },
        ],
        duration: { start_date: '2026-03-10', end_date: '2026-06-10' },
        cover_image_url: null,
        completion_percentage: 100,
      }
    }
  }
}

async function mockStream(messages, controller, encoder) {
  const send = (data) => {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
  }

  const { texts, toolCall } = getMockResponse(messages)

  // Stream text chunks with small delays
  for (const chunk of texts) {
    send({ type: 'text', content: chunk })
    await new Promise(r => setTimeout(r, 80))
  }

  // Send tool call if any
  if (toolCall) {
    await new Promise(r => setTimeout(r, 200))
    send({ type: 'tool_call', tool: toolCall.tool, input: toolCall.input })
  }

  send({ type: 'done' })
  controller.close()
}

export async function POST(request) {
  const { messages } = await request.json()
  const encoder = new TextEncoder()

  if (USE_MOCK) {
    const stream = new ReadableStream({
      start(controller) {
        mockStream(messages, controller, encoder)
      }
    })
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }
    })
  }

  // Real Gemini API (direct REST — avoids SDK v1beta hardcoding)
  const { SYSTEM_PROMPT } = await import('@/lib/system-prompt')
  const { UPDATE_MISSION_PREVIEW_TOOL_GEMINI } = await import('@/lib/gemini')

  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const body = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT + '\n\nCRITICAL: You must ALWAYS include a text response in every reply. Never respond with only a function call and no text. When calling update_mission_preview, you must also write a message to the user in the same response — either asking the next question or confirming what was updated.' }]
    },
    tools: [{ functionDeclarations: [UPDATE_MISSION_PREVIEW_TOOL_GEMINI] }],
    toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
    contents: geminiMessages,
  }

  const GEMINI_BASE = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash`
  const API_KEY = process.env.GEMINI_API_KEY

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Loop: handle multiple tool call rounds until we get actual text back
        // Gemini 2.5-flash (thinking model) may chain multiple function calls before responding
        let contents = geminiMessages
        let gotText = false
        const MAX_ROUNDS = 4

        for (let round = 0; round < MAX_ROUNDS && !gotText; round++) {
          const callBody = round === 0
            ? body
            : { systemInstruction: body.systemInstruction, contents }

          const res = await fetch(`${GEMINI_BASE}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(callBody),
          })
          if (!res.ok) throw new Error(await res.text())

          const data = await res.json()
          const parts = data.candidates?.[0]?.content?.parts || []

          // Visible text = parts without thoughtSignature
          const visibleText = parts
            .filter(p => p.text && !p.thoughtSignature)
            .map(p => p.text)
            .join('')
          const funcCall = parts.find(p => p.functionCall)

          // Send tool call to client so preview updates immediately
          if (funcCall) {
            send({ type: 'tool_call', tool: funcCall.functionCall.name, input: funcCall.functionCall.args })
          }

          if (visibleText) {
            send({ type: 'text', content: visibleText })
            gotText = true
          } else if (funcCall) {
            // No text yet — add model turn + function response to history, loop for text
            contents = [
              ...contents,
              { role: 'model', parts },
              {
                role: 'user',
                parts: [{
                  functionResponse: {
                    name: funcCall.functionCall.name,
                    response: { result: 'Preview updated successfully.' },
                  },
                }],
              },
            ]
          } else {
            // No text and no function call — stop
            break
          }
        }

        if (!gotText) {
          send({ type: 'text', content: "I've updated the mission preview. What would you like to configure next?" })
        }

        send({ type: 'done' })
      } catch (error) {
        send({ type: 'error', message: error.message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
