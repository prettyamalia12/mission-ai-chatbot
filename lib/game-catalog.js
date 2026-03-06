import { readFileSync } from 'fs'
import { join } from 'path'

function buildGameCatalog() {
  const filePath = join(process.cwd(), 'docs', 'game_planet_tracking_dictionary.json')
  const events = JSON.parse(readFileSync(filePath, 'utf-8'))

  const lines = [
    '## Game & Planet Tracking Events (Segment)',
    '',
    'These events are for Freedom game communities only — The Scape game and the Planet game.',
    'Event names are case-sensitive. Only filter on properties listed for each event.',
    '',
  ]

  for (const event of events) {
    // Only top-level properties — skip nested array notation (e.g. $.hp)
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

export const GAME_CATALOG = buildGameCatalog()
