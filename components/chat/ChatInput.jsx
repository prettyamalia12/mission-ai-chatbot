'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-3 focus-within:border-emerald-400 transition-colors">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message"
        disabled={disabled}
        rows={1}
        className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none outline-none leading-relaxed"
        style={{ minHeight: '24px', maxHeight: '120px' }}
      />
      <div className="flex items-center justify-end mt-1">
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            value.trim() && !disabled
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
