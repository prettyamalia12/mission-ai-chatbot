// Renders a structured mission outline summary inside the chat

export function MissionOutlineBox({ outline }) {
  if (!outline) return null
  return (
    <div className="mt-2 bg-gray-100 rounded-xl p-3 text-xs text-gray-700 space-y-0.5">
      {outline.mission_type && (
        <div><strong>Mission Type:</strong> {outline.mission_type.charAt(0).toUpperCase() + outline.mission_type.slice(1)}</div>
      )}
      {outline.objective && (
        <div><strong>Objective:</strong> {outline.objective}</div>
      )}
      {outline.milestones?.length > 0 && (
        <div>
          <strong>Milestone Level:</strong>
          {outline.milestones.map((m, i) => (
            <div key={i} className="ml-2">
              Level {m.level}: {m.threshold} {outline.unit || 'friends'} &gt; earns{' '}
              {m.rewards?.map(r => `${r.amount} ${r.type}`).join(' + ') || '—'}
            </div>
          ))}
        </div>
      )}
      {outline.duration && (
        <div><strong>Duration:</strong> {outline.duration.days ? `${outline.duration.days} Days` : ''}{outline.duration.start_date && outline.duration.end_date ? ` (${outline.duration.start_date} – ${outline.duration.end_date})` : ''}</div>
      )}
      {outline.title && (
        <div><strong>Mission Name:</strong> {outline.title}</div>
      )}
    </div>
  )
}
