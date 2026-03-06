'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function ProgressBar({ milestones, currentLevel = 0 }) {
  if (!milestones?.length) return null
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">Progress</div>
      <div className="flex items-center gap-1">
        {milestones.map((m, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i < currentLevel ? 'bg-emerald-500 text-white' :
              i === currentLevel ? 'bg-emerald-500 text-white' :
              i === milestones.length - 1 ? 'bg-gray-200 text-gray-400' :
              'bg-gray-200 text-gray-400'
            }`}>
              {i === milestones.length - 1 ? '✓' : i + 1}
            </div>
            {i < milestones.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 ${i < currentLevel ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>Current progress <strong>0</strong></span>
        <span><strong>{milestones[0]?.threshold || 2}</strong> to finish LVL 1</span>
      </div>
    </div>
  )
}

function MilestoneToDoList({ milestones }) {
  if (!milestones?.length) return null
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-2">To Do</div>
      <div className="space-y-1.5">
        {milestones.map((m, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
              i === 0 ? 'border border-emerald-300 bg-white' : 'bg-gray-100'
            }`}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-500'
            }`}>
              {i === 0 ? '→' : i + 1}
            </div>
            <span className="text-xs text-gray-700 flex-1">{m.requirement || `Level ${m.level}`}</span>
            {i === 0 && <span className="text-[10px] text-gray-400">0%</span>}
            <div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center">
              <span className="text-[8px]">🎁</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleToDoList({ steps }) {
  if (!steps?.length) return null
  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-gray-700 mb-1">To Do (0/{steps.length})</div>
      {steps.map((s, i) => (
        <div key={i} className="text-xs text-gray-500">{s.label}</div>
      ))}
    </div>
  )
}

export function MissionPreview({ mission, completionPct = 0 }) {
  const [tcExpanded, setTcExpanded] = useState(false)
  const isMilestone = mission?.mission_type === 'milestone'
  const isSimple = mission?.mission_type === 'simple'

  const statusLabel = completionPct >= 100
    ? 'You are all set!'
    : 'Please Keep chatting with AVA!'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <span className="text-sm font-medium text-gray-600">{statusLabel}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold ${completionPct >= 100 ? 'text-emerald-500' : 'text-emerald-500'}`}>
            {completionPct}%
          </span>
          <span className="text-xs text-gray-500">Completed</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* Preview card */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Cover image */}
        {mission?.cover_image_url ? (
          <img
            src={mission.cover_image_url}
            alt="Mission cover"
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Cover image</span>
          </div>
        )}

        {/* Community + timer */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">
              {mission?.community ? mission.community[0] : 'C'}
            </span>
          </div>
          <span className="text-xs text-gray-500">{mission?.community || '{Community Name}'}</span>
          <span className="ml-auto text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-200 px-1.5 py-0.5 rounded-full">
            ⏱ {mission?.duration?.days ? `${mission.duration.days} days` : '... days'}
          </span>
        </div>

        {/* Mission name */}
        <div className="text-sm font-bold text-gray-900 mb-4 leading-snug">
          {mission?.title || 'Mission Name'}
        </div>

        {/* Progress + To Do */}
        {isMilestone && mission?.milestones?.length > 0 && (
          <>
            <ProgressBar milestones={mission.milestones} />
            <MilestoneToDoList milestones={mission.milestones} />
          </>
        )}
        {isSimple && mission?.steps?.length > 0 && (
          <SimpleToDoList steps={mission.steps} />
        )}

        {/* Description */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-700 mb-1">Description</div>
          <div className="text-xs text-gray-400 leading-relaxed">
            {mission?.description || 'Briefly describe your mission here..'}
          </div>
        </div>

        {/* Terms */}
        <div className="border-t border-gray-100 pt-3">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => mission?.terms_and_conditions && setTcExpanded(v => !v)}
          >
            <span className="text-xs font-semibold text-gray-700">Terms and Conditions</span>
            {mission?.terms_and_conditions
              ? (tcExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />)
              : <ChevronDown size={14} className="text-gray-400" />
            }
          </button>
          {tcExpanded && mission?.terms_and_conditions && (
            <div className="mt-2 text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
              {mission.terms_and_conditions}
            </div>
          )}
          {!mission?.terms_and_conditions && (
            <div className="mt-1 text-xs text-gray-400 italic">Optional — ask AVA to generate or provide your own</div>
          )}
        </div>
      </div>
    </div>
  )
}
