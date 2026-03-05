export function AvaAvatar({ size = 32 }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.35 }}>✦</span>
    </div>
  )
}
