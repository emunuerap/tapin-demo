'use client'

import { useEffect, useState } from 'react'
import { haptic, clickTone } from '@/lib/feedback'

export default function FeedbackToggle() {
  const [prefs, setPrefs] = useState({ sound: true, haptics: true })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tapin:prefs')
      if (raw) setPrefs(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('tapin:prefs', JSON.stringify(prefs)) } catch {}
  }, [prefs])

  const toggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    if (next.haptics) haptic(10)
    if (next.sound) clickTone(520, 0.03, 0.03)
  }

  return (
    <div className="glass glass-edge" style={{ position:'fixed', right:16, bottom:16, padding:10, borderRadius:999, zIndex:50 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <button className="btn" onClick={() => toggle('sound')} aria-label="Toggle sound">
          <span className="muted">Sound</span>
          <strong>{prefs.sound ? 'On' : 'Off'}</strong>
        </button>
        <button className="btn" onClick={() => toggle('haptics')} aria-label="Toggle haptics">
          <span className="muted">Haptics</span>
          <strong>{prefs.haptics ? 'On' : 'Off'}</strong>
        </button>
      </div>
    </div>
  )
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
