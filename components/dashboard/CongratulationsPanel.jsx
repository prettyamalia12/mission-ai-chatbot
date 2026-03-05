import { X } from 'lucide-react'
import Link from 'next/link'

// In a real app, the published mission data would be passed via state/context
// For now showing a static congratulations panel with mock data
export function CongratulationsPanel({ mission, onClose }) {
  return (
    <div className="absolute top-0 right-0 h-full w-[420px] bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Congratulations</h2>
        <p className="text-base font-semibold text-gray-800 mb-1">
          You have launched a Mission 🎉
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Your community members can now view your mission on the Missions page in the Freedom World app
        </p>

        {/* Cover image */}
        {mission?.cover_image_url ? (
          <img
            src={mission.cover_image_url}
            alt="Mission cover"
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-blue-200 rounded-xl mb-4 flex items-center justify-center">
            <span className="text-4xl">🎊</span>
          </div>
        )}

        {/* Mission title */}
        <div className="text-base font-bold text-gray-900 mb-1 flex items-center justify-between">
          {mission?.title || 'Invite a Friend to join the Mystic Valley Community'}
          <X size={16} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4].map((n, i) => (
              <div key={n} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {n}
                </div>
                {i < 3 && <div className="flex-1 h-0.5 bg-gray-200 mx-0.5" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>Current Progress <strong>0</strong></span>
            <span><strong>4</strong> to finish LVL 1</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-500 mb-4 leading-relaxed">
          {mission?.description || 'Invite Friends to Join the Mystic Valley Community:\n- Click the "Referral" button on the home page.\n- Share your QR code or referral link with your friend.\n- Get rewarded with 50 MYST Points'}
        </div>

        {/* Milestone levels */}
        <div className="space-y-2 mb-6">
          {(mission?.milestones || [
            { level: 1, requirement: 'Invite 3 friends', rewards: [{ type: 'Token', amount: null }] },
            { level: 2, requirement: 'Invite 6 friends', rewards: [{ type: 'XP', amount: null }] },
            { level: 3, requirement: 'Invite 9 friends', rewards: [{ type: 'XP', amount: null }] },
            { level: 4, requirement: 'Invite 12 friends', rewards: [{ type: 'NFT', amount: null }, { type: 'XP', amount: null }] },
          ]).map((m) => (
            <div key={m.level} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Level {m.level}: {m.requirement}</span>
              <div className="flex gap-1">
                {(m.rewards || []).map((r, i) => (
                  <div key={i} className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-[9px] font-bold">{r.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-center transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
