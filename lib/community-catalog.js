import { readFileSync } from 'fs'
import { join } from 'path'

function parseCSV(text) {
  const rows = []
  const lines = text.trim().split('\n')
  const headers = parseLine(lines[0])
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    if (values.length === 0) continue
    const row = {}
    headers.forEach((h, idx) => { row[h] = values[idx] ?? '' })
    rows.push(row)
  }
  return rows
}

function parseLine(line) {
  const values = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current.trim())
  return values
}

function buildCommunityCatalog() {
  const prodPath = join(process.cwd(), 'docs', 'communities_production.csv')
  const stagPath = join(process.cwd(), 'docs', 'communities-staging.csv')

  const prodRows = parseCSV(readFileSync(prodPath, 'utf-8'))
  const stagRows = parseCSV(readFileSync(stagPath, 'utf-8'))

  // Filter staging: published only, and has at least some activity
  const stagFiltered = stagRows.filter(r => r.is_published === '1' && r.has_post === '1')

  const lines = [
    '## Community Directory',
    '',
    'Use these IDs when setting community_id filters in metrics.',
    'The entity is currently set to STAGING. Use staging IDs.',
    '',
    '### Production Communities (ID → Name reference)',
    'Note: Production and staging share the same numeric community IDs for real communities.',
  ]

  for (const r of prodRows) {
    lines.push(`${r.id}: ${r.name}`)
  }

  lines.push('')
  lines.push('### Active Staging Communities (published with posts)')
  lines.push('These are staging-confirmed active communities. Use their community_id for staging metrics.')

  const prodIds = new Set(prodRows.map(r => r.id))
  for (const r of stagFiltered) {
    const tag = prodIds.has(r.community_id) ? '' : ' [staging-only]'
    lines.push(`${r.community_id}: ${r.community_name}${tag}`)
  }

  return lines.join('\n')
}

export const COMMUNITY_CATALOG = buildCommunityCatalog()
