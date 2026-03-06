'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'

export function ChatInput({ onSend, onImageUpload, onTextUpload, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      onImageUpload?.(url, file.name)
    } else {
      const reader = new FileReader()
      reader.onload = (ev) => onTextUpload?.(ev.target.result, file.name)
      reader.readAsText(file)
    }
    e.target.value = ''
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
      <div className="flex items-center justify-between mt-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach image or T&C document (.txt)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Paperclip size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
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
