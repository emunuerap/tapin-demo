'use client'

import { useEffect, useState } from 'react'
import { haptic, clickTone } from '@/lib/feedback'

function ToggleRow({ title, desc, value, onChange }) {
  return (
    <div className="setRow">
      <div className="setText">
        <div className="setTitle">{title}</div>
        <div className="setDesc">{desc}</div>
      </div>

      <button
        className={`switch ${value ? 'on' : ''}`}
        onClick={onChange}
        aria-pressed={value}
      >
        <span className="knob" />
      </button>
    </div>
  )
}

export default function Settings() {
  const [prefs, setPrefs] = useState({ sound: true, haptics: true })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tapin:prefs')
      if (raw) setPrefs(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('tapin:prefs', JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  const toggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    if (next.haptics) haptic(10)
    if (next.sound) clickTone(520, 0.03, 0.03)
  }

  return (
    <div>
      <div className="pageTitle">Settings</div>
      <div className="pageSub">Control feedback and preferences for this demo.</div>

      <div className="panel setPanel" style={{ marginTop: 14 }}>
        <div className="setHeader">
          <div className="setH">Interaction feedback</div>
          <div className="setHint">
            Optional micro-feedback for a more “native” feel on mobile devices.
          </div>
        </div>

        <div className="setGroup">
          <ToggleRow
            title="Sound"
            desc="Subtle confirmation tones on key actions."
            value={prefs.sound}
            onChange={() => toggle('sound')}
          />
          <div className="divider" />
          <ToggleRow
            title="Haptics"
            desc="Vibration feedback on supported mobile devices."
            value={prefs.haptics}
            onChange={() => toggle('haptics')}
          />
        </div>

        <div className="setFoot">
          Some browsers may ignore vibration requests. Sound requires user interaction.
        </div>
      </div>
    </div>
  )
}
