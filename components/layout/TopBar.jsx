import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

export function TopBar() {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Create Mission</h1>
      </div>

      <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={20} />
      </Link>
    </div>
  )
}
