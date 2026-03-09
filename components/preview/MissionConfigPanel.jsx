'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function JsonBlock({ label, data, endpoint }) {
  const json = JSON.stringify(data, null, 2)
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <div className="text-xs font-semibold text-gray-700">{label}</div>
          {endpoint && <div className="text-[10px] text-gray-400 font-mono">{endpoint}</div>}
        </div>
        <CopyButton text={json} />
      </div>
      <pre className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] leading-relaxed text-gray-700 overflow-x-auto whitespace-pre-wrap break-all">
        {json}
      </pre>
    </div>
  )
}

export function MissionConfigPanel({ config }) {
  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-gray-300 text-4xl mb-3">⚙️</div>
        <div className="text-sm font-medium text-gray-500">QL Config not ready yet</div>
        <div className="text-xs text-gray-400 mt-1">Confirm the mission summary with AVA to generate the QuestLab payload.</div>
      </div>
    )
  }

  const STAGING_ENTITY_ID = 'e-9946bedf-3c65-4111-b296-ca6fd2a3a738'
  const BASE_URL = 'https://staging-api.questera.ai'

  const metricPayload = config.metric ? {
    name: config.metric.name,
    entityId: STAGING_ENTITY_ID,
    platform: config.metric.platform || 'segment',
    eventName: config.metric.eventName,
    type: 'APP',
    isEnabled: true,
    propagateToSubEntities: config.metric.propagateToSubEntities ?? true,
    ...(config.metric.conditions?.length ? { conditions: config.metric.conditions } : {}),
    ...(config.metric.incrementProperty ? { incrementProperty: config.metric.incrementProperty } : {}),
  } : null

  const questPayload = {
    title: config.quest.title,
    description: config.quest.description,
    imageURL: config.quest.imageURL || '',
    status: config.quest.status || 'INACTIVE',
    visibility: config.quest.visibility || 'PUBLIC',
    ...(config.quest.startsAt ? { startsAt: config.quest.startsAt } : {}),
    ...(config.quest.endsAt ? { endsAt: config.quest.endsAt } : {}),
    frequency: config.quest.frequency || '',
    allowRepeatEntries: config.quest.allowRepeatEntries ?? false,
    isDependentCriterias: config.quest.isDependentCriterias ?? false,
    metrics: metricPayload ? [`// Run metric creation first → paste metricId here`] : [],
    rewards: [`// Paste reward ID(s) from Freedom rewards catalog`],
    ...(config.quest.termsAndConditions ? { termsAndConditions: config.quest.termsAndConditions } : {}),
    metadata: {
      isCommunityMission: !!config.quest.communityId,
      isRetryPossible: (config.quest.frequency || '') !== '',
      ...(config.quest.frequency ? { retryCount: 1 } : {}),
    },
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm font-bold text-gray-800">QuestLab Config</div>
        <div className="text-xs text-gray-400 mt-0.5">Staging: {BASE_URL}</div>
      </div>

      {/* Notes */}
      {config.notes && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800 leading-relaxed">
          ⚠️ {config.notes}
        </div>
      )}

      {/* Always-needed reminder */}
      <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-blue-700 leading-relaxed">
        <strong>Before submitting:</strong> Replace placeholder reward ID with the actual ID from the Freedom rewards catalog. If metric is required, create it first and paste the returned metricId into the quest payload.
      </div>

      {/* Step 1: Metric */}
      {metricPayload && (
        <>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Step 1 — Create Metric</div>
          <JsonBlock
            label="Metric Payload"
            endpoint={`POST /api/entities/{entityId}/metrics`}
            data={metricPayload}
          />
        </>
      )}

      {/* Step 2: Quest */}
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
        {metricPayload ? 'Step 2 — Create Quest' : 'Step 1 — Create Quest'}
      </div>
      <JsonBlock
        label="Quest Payload"
        endpoint={`POST /api/entities/{entityId}/quests`}
        data={questPayload}
      />

      {/* Mission-type specific details */}
      {config.quest.milestones?.length > 0 && (
        <>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Milestones (Reference)</div>
          <JsonBlock
            label="Milestone Levels"
            data={config.quest.milestones}
          />
        </>
      )}

      {config.quest.steps?.length > 0 && (
        <>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Steps (Reference)</div>
          <JsonBlock
            label="Mission Steps"
            data={config.quest.steps}
          />
        </>
      )}
    </div>
  )
}
