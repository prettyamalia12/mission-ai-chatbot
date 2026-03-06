import { readFileSync } from 'fs'
import { join } from 'path'

// Events that are admin/system actions — not valid mission tracking targets
const EXCLUDED_EVENTS = new Set([
  'Console Banner Created',
  'Console Campaign Created',
  'Console Community Created',
  'Console Token Created',
  'Console Location Updated',
  'Console Status Updated',
  'Console Profile Edited',
  'Social Post Deleted',
])

function buildEventCatalog() {
  const filePath = join(process.cwd(), 'docs', 'freedom_tracking_dictionary.json')
  const events = JSON.parse(readFileSync(filePath, 'utf-8'))
  const trackable = events.filter(e => !EXCLUDED_EVENTS.has(e.event_name))

  const lines = [
    '## Available Tracking Events (Segment)',
    '',
    'These are the ONLY valid Segment events for metric creation. Event names are case-sensitive.',
    'Only filter on properties listed for each event — never invent property names.',
    '',
  ]

  for (const event of trackable) {
    // Only top-level properties — exclude nested array notation (e.g. merchandise.$, choices.$.value)
    const topProps = event.properties
      .filter(p => !p.property_name.includes('.$'))
      .map(p => p.property_name)

    lines.push(`### ${event.event_name}`)
    lines.push(event.event_description)
    lines.push(`Filterable properties: ${topProps.join(', ')}`)
    lines.push('')
  }

  return lines.join('\n')
}

export const EVENT_CATALOG = buildEventCatalog()
