const STORAGE_KEY = 'mission_drafts'

export function getDrafts() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveDraft(mission) {
  if (typeof window === 'undefined') return null
  const drafts = getDrafts()
  const draft = {
    id: `draft-${Date.now()}`,
    savedAt: new Date().toISOString(),
    status: 'draft',
    ...mission,
  }
  // Replace existing draft with same id if re-saving
  const idx = drafts.findIndex(d => d.id === draft.id)
  if (idx >= 0) {
    drafts[idx] = draft
  } else {
    drafts.unshift(draft)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
  return draft
}

export function getDraftById(id) {
  if (typeof window === 'undefined') return null
  return getDrafts().find(d => d.id === id) || null
}

export function deleteDraft(id) {
  if (typeof window === 'undefined') return
  const drafts = getDrafts().filter(d => d.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}
