import { AvaAvatar } from './AvaAvatar'

export function TypingIndicator({ label = '' }) {
  return (
    <div className="flex items-start gap-2">
      <AvaAvatar size={28} />
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
        {label ? (
          <span className="text-sm text-gray-600">{label}</span>
        ) : null}
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
