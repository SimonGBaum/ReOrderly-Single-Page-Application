export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function addDays(isoString, days) {
  const d = new Date(isoString)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function frequencyToDays(frequency, customDays) {
  switch (frequency) {
    case 'weekly':    return 7
    case 'biweekly':  return 14
    case 'monthly':   return 30
    case 'custom':    return customDays || 7
    default:          return null
  }
}
