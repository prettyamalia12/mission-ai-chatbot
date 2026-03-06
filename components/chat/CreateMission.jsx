'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AvaAvatar } from './AvaAvatar'
import { TypingIndicator } from './TypingIndicator'
import { ChatInput } from './ChatInput'
import { MissionPreview } from '@/components/preview/MissionPreview'
import { useRouter } from 'next/navigation'
import { saveDraft, getDraftById } from '@/lib/draft-store'

// Message types: 'user' | 'ava' | 'typing' | 'action_buttons'
function UserBubble({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%] bg-emerald-100 text-gray-800 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">
        {content}
      </div>
    </div>
  )
}

function renderMarkdown(text) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    return <span key={i}>{rendered}{i < arr.length - 1 ? '\n' : ''}</span>
  })
}

function AvaBubble({ content, extra }) {
  return (
    <div className="flex items-start gap-2">
      <AvaAvatar size={28} />
      <div className="flex-1">
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{renderMarkdown(content)}</div>
        {extra}
      </div>
    </div>
  )
}

function ActionButtons({ onSaveDraft, onPublish }) {
  return (
    <div className="flex items-start gap-2 mt-1">
      <AvaAvatar size={28} />
      <div className="flex gap-2 mt-1">
        <button
          onClick={onSaveDraft}
          className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Save draft
        </button>
        <button
          onClick={onPublish}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Preview and Publish
        </button>
      </div>
    </div>
  )
}

const AVA_GREETING = "Hi! I'm AVA, your Mission Creation Assistant. I'll help you design a mission that engages your community.\n\nFirst, choose a mission type:\n\n- **Simple Mission** — One requirement, one reward. _(e.g. Invite 1 friend → get 50 tokens)_\n- **Milestone Mission** — One goal with multiple reward levels. _(e.g. Invite 3 → Level 1 reward, Invite 6 → Level 2 reward)_\n- **Multi-Step Mission** — A series of steps users complete in order. _(e.g. Visit page → Answer quiz → Make a purchase)_\n\nWhich type fits your goal, or describe your mission idea and I'll suggest one!"

export function CreateMission({ draftId }) {
  const router = useRouter()
  const [apiMessages, setApiMessages] = useState([{ role: 'assistant', content: AVA_GREETING }])
  const [displayMessages, setDisplayMessages] = useState([{ type: 'ava', content: AVA_GREETING }])
  const [mission, setMission] = useState(null)
  const [completionPct, setCompletionPct] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [typingLabel, setTypingLabel] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const messagesEndRef = useRef(null)

  // Load draft if draftId is provided
  useEffect(() => {
    if (!draftId) return
    const draft = getDraftById(draftId)
    if (!draft) return
    setMission(draft)
    setCompletionPct(draft.completion_percentage || 0)
    const resumeMsg = `Welcome back! I've loaded your draft **${draft.title || 'Untitled Draft'}**. The preview panel shows your current progress. What would you like to work on next?`
    setDisplayMessages([{ type: 'ava', content: AVA_GREETING }, { type: 'ava', content: resumeMsg }])
    setApiMessages([
      { role: 'assistant', content: AVA_GREETING },
      { role: 'assistant', content: resumeMsg },
    ])
  }, [draftId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages, isTyping])

  const addDisplay = useCallback((msg) => {
    setDisplayMessages(prev => [...prev, msg])
  }, [])

  const handleSend = useCallback(async (text) => {
    // Add user message
    const userMsg = { role: 'user', content: text }
    addDisplay({ type: 'user', content: text })

    const newApiMessages = [...apiMessages, userMsg]
    setApiMessages(newApiMessages)
    setIsTyping(true)
    setTypingLabel('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newApiMessages }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Chat API error ${res.status}: ${errText}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let avaText = ''
      let toolUpdate = null
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          let event
          try {
            event = JSON.parse(raw)
          } catch {
            continue // skip malformed SSE lines
          }

          if (event.type === 'text') {
            avaText += event.content
          } else if (event.type === 'tool_call' && event.tool === 'update_mission_preview') {
            toolUpdate = event.input
            setShowPreview(true)
          } else if (event.type === 'tool_call' && event.tool === 'generate_cover_image') {
            toolUpdate = { _generateImage: true, _imagePrompt: event.input?.prompt }
          } else if (event.type === 'error') {
            throw new Error(event.message || 'API error')
          }
        }
      }

      setIsTyping(false)

      // Check if this is an image generation tool call
      const isImageGen = toolUpdate?._generateImage === true
      const imagePrompt = toolUpdate?._imagePrompt

      // Apply mission tool update (only if not the image gen sentinel)
      if (toolUpdate && !isImageGen) {
        setMission(prev => ({ ...prev, ...toolUpdate }))
        setCompletionPct(toolUpdate.completion_percentage || 0)
      }

      // Show AVA text response
      const finalText = avaText.trim()
      const lowerText = avaText.toLowerCase()

      if (finalText) {
        const assistantMsg = { role: 'assistant', content: finalText }
        setApiMessages(prev => [...prev, assistantMsg])
        addDisplay({ type: 'ava', content: finalText })
      } else if (toolUpdate && !isImageGen) {
        const isDoneEarly = (toolUpdate?.completion_percentage >= 100) ||
          lowerText.includes('ready to go') || lowerText.includes('preview and publish')
        const fallback = isDoneEarly
          ? "Your mission is ready! Click **Preview and Publish** to launch it."
          : "Got it, I've updated the mission preview."
        const assistantMsg = { role: 'assistant', content: fallback }
        setApiMessages(prev => [...prev, assistantMsg])
        addDisplay({ type: 'ava', content: fallback })
      } else if (!isImageGen) {
        addDisplay({ type: 'ava', content: "⚠️ No response received from the server. Please try again." })
      }

      // Fallback: trigger image gen if user asked for it but AVA didn't call the tool
      const userAskedForImage = /\b(generate|create|make)\b.{0,30}\b(image|cover|campaign image)\b/i.test(text) ||
        /\b(image|cover)\b.{0,20}\b(generate|create|yes|ok|sure)\b/i.test(text) ||
        text.toLowerCase().includes('campaign image') ||
        text.toLowerCase().includes('cover image')

      if (userAskedForImage && !isImageGen) {
        toolUpdate = { _generateImage: true, _imagePrompt: mission?.title || null }
      }

      const isImageGenFinal = toolUpdate?._generateImage === true
      const imagePromptFinal = toolUpdate?._imagePrompt

      // Trigger image generation if AVA called the generate_cover_image tool (or fallback)
      if (isImageGenFinal) {
        setIsGeneratingImage(true)
        setIsTyping(true)
        setTypingLabel('Creating cover image')
        try {
          const prompt = imagePromptFinal || mission?.title || 'community mission campaign'
          const imgRes = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          })
          const { url } = await imgRes.json()
          if (url) {
            setMission(prev => ({ ...prev, cover_image_url: url }))
            addDisplay({ type: 'ava_image', content: url })
          }
        } catch {
          addDisplay({ type: 'ava', content: "⚠️ Couldn't generate a cover image right now. Please try again." })
        }
        setIsTyping(false)
        setIsGeneratingImage(false)
        return
      }

      const isDone = (toolUpdate?.completion_percentage >= 100) ||
        lowerText.includes('ready to go') || lowerText.includes('preview and publish')

      if (isDone) {
        addDisplay({ type: 'action_buttons' })
      }
    } catch (err) {
      setIsTyping(false)
      addDisplay({ type: 'ava', content: `⚠️ Error: ${err.message}` })
    }
  }, [apiMessages, addDisplay, mission])

  const handleSaveDraft = useCallback(() => {
    const saved = saveDraft(mission || {})
    if (saved && !mission?.id) {
      setMission(prev => ({ ...(prev || {}), id: saved.id }))
    }
    addDisplay({ type: 'ava', content: 'Draft saved! You can find it in the Mission list.' })
  }, [mission, addDisplay])

  const handleImageUpload = useCallback((url, filename) => {
    setMission(prev => ({ ...prev, cover_image_url: url }))
    addDisplay({ type: 'ava_image', content: url })
    addDisplay({ type: 'ava', content: `Cover image set to **${filename}**. You can generate an AI image instead if you'd like.` })
  }, [addDisplay])

  const handleTCUpload = useCallback((content, filename) => {
    setMission(prev => ({ ...prev, terms_and_conditions: content }))
    addDisplay({ type: 'ava', content: `T&C uploaded from **${filename}**. It's now shown in the preview panel.` })
  }, [addDisplay])

  const handlePublish = () => setShowConfirm(true)
  const handleConfirm = () => {
    setShowConfirm(false)
    router.push('/dashboard?published=true')
  }

  return (
    <div className="flex h-full">
      {/* Chat panel */}
      <div className={`flex flex-col ${showPreview ? 'w-[55%]' : 'w-full'} transition-all duration-300`}>
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <span className="text-sm font-semibold text-gray-700">Mission Creation</span>
          <button
            onClick={handleSaveDraft}
            className="text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {displayMessages.map((msg, i) => {
            if (msg.type === 'user') return <UserBubble key={i} content={msg.content} />
            if (msg.type === 'ava') return <AvaBubble key={i} content={msg.content} />
            if (msg.type === 'ava_image') return (
              <div key={i} className="flex items-start gap-2">
                <AvaAvatar size={28} />
                <div>
                  <div className="text-sm text-gray-700 mb-2">Here you go</div>
                  <img src={msg.content} alt="Generated cover" className="w-60 rounded-xl" />
                </div>
              </div>
            )
            if (msg.type === 'action_buttons') return (
              <ActionButtons key={i} onSaveDraft={() => router.push('/dashboard')} onPublish={handlePublish} />
            )
            return null
          })}

          {isTyping && <TypingIndicator label={typingLabel} />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          <ChatInput onSend={handleSend} onImageUpload={handleImageUpload} onTextUpload={handleTCUpload} disabled={isTyping} />
        </div>
      </div>

      {/* Preview panel */}
      {showPreview && (
        <div className="w-[45%] border-l border-gray-200 bg-white overflow-hidden">
          <MissionPreview mission={mission} completionPct={completionPct} />
        </div>
      )}

      {/* Confirm modal */}
      {showConfirm && mission && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[520px] max-h-[85vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Confirm to Create Mission</h2>
              <button onClick={() => setShowConfirm(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            {mission.cover_image_url && (
              <img src={mission.cover_image_url} alt="Cover" className="w-full h-48 object-cover rounded-xl mb-5" />
            )}

            <div className="text-base font-bold text-gray-900 mb-2">{mission.title || 'Mission Name'}</div>
            <div className="text-sm text-gray-500 mb-5 leading-relaxed">{mission.description || ''}</div>

            <div className="space-y-2 mb-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mission Type:</span>
                <span className="font-medium text-gray-900 capitalize">{mission.mission_type || '—'}</span>
              </div>
              {mission.duration?.start_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Publish Date:</span>
                  <span className="font-medium text-gray-900">{mission.duration.start_date}</span>
                </div>
              )}
              {mission.duration?.end_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Unpublish Date:</span>
                  <span className="font-medium text-gray-900">{mission.duration.end_date}</span>
                </div>
              )}
            </div>

            {mission.milestones?.length > 0 && (
              <div className="space-y-2 mb-6">
                {mission.milestones.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">Level {m.level}: {m.requirement}</span>
                    <div className="flex gap-1">
                      {m.rewards?.map((r, j) => (
                        <div key={j} className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center">
                          <span className="text-white text-[9px] font-bold">{r.amount ? `+${r.amount}` : r.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
