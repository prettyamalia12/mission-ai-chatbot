// Shown when AVA suggests mission type options (simple vs milestone)

const MOCK_REWARDS = [
  { bg: 'bg-gray-800', label: '🎮' },
  { bg: 'bg-yellow-600', label: '★' },
  { bg: 'bg-emerald-600', label: 'XP' },
  { bg: 'bg-purple-600', label: '$' },
]

function MilestonePreviewCard({ milestones }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">F</span>
        </div>
        <span className="text-xs text-gray-600">Freedom Cafe</span>
        <span className="ml-auto text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">⏱ 3 days</span>
      </div>
      <div className="text-sm font-bold text-gray-900 mb-3">Lorem Ipsum dolor sit amet asceculpir</div>
      <div className="text-xs font-semibold text-gray-700 mb-2">Progress</div>
      <div className="flex items-center gap-1 mb-1">
        {milestones.map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i === milestones.length - 1 ? '✓' : i + 1}
            </div>
            {i < milestones.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-0.5" />}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-gray-400 mb-3">Current progress <strong>0</strong> &nbsp; <strong>2</strong> to finish LVL 1</div>
      <div className="text-xs font-semibold text-gray-700 mb-2">To Do</div>
      {milestones.slice(0, 3).map((m, i) => (
        <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-1 ${i === 0 ? 'border border-emerald-300 bg-white' : 'bg-gray-100'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i === 0 ? 'bg-emerald-500' : 'bg-gray-300'}`}>
            {i === 0 ? <span className="text-white text-[9px]">→</span> : <span className="text-white text-[9px]">🔒</span>}
          </div>
          <span className="text-xs text-gray-700 flex-1">{m.requirement}</span>
          <div className="w-4 h-4 rounded bg-gray-700" />
        </div>
      ))}
    </div>
  )
}

function SimplePreviewCard({ step }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">F</span>
        </div>
        <span className="text-xs text-gray-600">Freedom Cafe</span>
        <span className="ml-auto text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">⏱ 3 days</span>
      </div>
      <div className="text-sm font-bold text-gray-900 mb-3">Lorem Ipsum dolor sit amet asceculpir</div>
      <div className="bg-white rounded-lg p-2.5 mb-2 border border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-1">To Do (0/1)</div>
        <div className="text-xs text-gray-500">{step}</div>
      </div>
      <div className="bg-white rounded-lg p-2.5 border border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-1">Description and Rewards</div>
        <div className="text-xs text-gray-400 mb-2 line-clamp-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus lobortis leo id pretium.</div>
        <div className="flex gap-1">
          {MOCK_REWARDS.map((r, i) => (
            <div key={i} className={`w-8 h-8 ${r.bg} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-[10px] font-bold">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MissionTypeCards({ missionContext, onSelectType }) {
  const milestones = [
    { requirement: 'Invite 2 friends', threshold: 2 },
    { requirement: 'Invite 3 friends', threshold: 3 },
    { requirement: 'Invite 5 friends', threshold: 5 },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mt-3">
      {/* Milestone */}
      <div>
        <div className="text-xs text-gray-500 mb-2">
          <strong className="text-gray-700">Milestones Mission:</strong>
          {milestones.map((m, i) => (
            <div key={i}>• Level {i + 1}: {m.requirement} → Earn {i + 1} FDS</div>
          ))}
        </div>
        <MilestonePreviewCard milestones={milestones} />
        <button
          onClick={() => onSelectType('milestone')}
          className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          I want to create milestone mission
        </button>
      </div>

      {/* Simple */}
      <div>
        <div className="text-xs text-gray-500 mb-2">
          <strong className="text-gray-700">Simple Mission:</strong>
          <div>• Invite 1 friend → Earn 1 FDS</div>
        </div>
        <SimplePreviewCard step="Invite 1 friend" />
        <button
          onClick={() => onSelectType('simple')}
          className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          I want to create simple mission
        </button>
      </div>
    </div>
  )
}
