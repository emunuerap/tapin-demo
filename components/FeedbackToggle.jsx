'use client'

// FeedbackToggle is intentionally disabled.
// Preferences live in /dashboard/settings.
export default function FeedbackToggle() {
  return null
}

export function getPrefs() {
  if (typeof window === 'undefined') return { sound: false, haptics: false }
  try {
    const raw = localStorage.getItem('tapin:prefs')
    return raw ? JSON.parse(raw) : { sound: true, haptics: true }
  } catch {
    return { sound: true, haptics: true }
  }
}
