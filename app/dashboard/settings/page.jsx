'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { haptic, clickTone } from '@/lib/feedback'

const PREFS_KEY = 'tapin:prefs'

export default function Settings(){
  const [copied, setCopied] = useState(false)
  const [prefs, setPrefs] = useState({ sound: true, haptics: true })

  // Snippet: mantenlo como “demo / integración”
  const snippet =
`<script async src="https://tapin-demo.vercel.app//embed/tapin-widget.js"></script>
<div data-tapin-widget data-restaurant="r-otoro"></div>`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY)
      if (raw) setPrefs(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)) } catch {}
  }, [prefs])

  const toggle = (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)

    // Feedback inmediato cuando se activa
    if (key === 'haptics' && next.haptics) haptic(10)
    if (key === 'sound' && next.sound) clickTone(520, 0.03, 0.03)
  }

  return (
    <main className="container">
      <div className="panel" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent:'space-between', flexWrap:'wrap' }}>
          <div>
            <div className="h2" style={{ fontSize: 22, fontWeight: 900 }}>Settings</div>
            <div className="p" style={{ marginTop: 6 }}>
              Preferences and integration assets for this demonstrator.
            </div>
          </div>

          <div className="row" style={{ gap: 10 }}>
            <Link className="btn" href="/">Home</Link>
            <Link className="btn btnPrimary" href="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="hr" />

        {/* Feedback */}
        <div className="panel" style={{ padding: 16, background: 'rgba(255,255,255,.03)' }}>
          <div style={{ fontWeight: 900 }}>Interaction feedback</div>
          <div className="p" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
            Sound provides subtle click/confirm tones. Haptics uses vibration on supported devices.
            Some browsers may ignore vibration requests.
          </div>

          <div style={{ height: 14 }} />

          <div className="grid">
            <label className="settingRow">
              <div>
                <div className="settingTitle">Sound</div>
                <div className="settingDesc">Subtle generated tones for UI confirmation.</div>
              </div>
              <button className="btn" type="button" onClick={() => toggle('sound')}>
                <span className="muted">Status</span>
                <strong>{prefs.sound ? 'On' : 'Off'}</strong>
              </button>
            </label>

            <label className="settingRow">
              <div>
                <div className="settingTitle">Haptics</div>
                <div className="settingDesc">Vibration feedback on supported mobile devices.</div>
              </div>
              <button className="btn" type="button" onClick={() => toggle('haptics')}>
                <span className="muted">Status</span>
                <strong>{prefs.haptics ? 'On' : 'Off'}</strong>
              </button>
            </label>
          </div>
        </div>

        <div className="hr" />

        {/* Embed snippet */}
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Embed snippet (demo)</div>
          <div className="p" style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6 }}>
            This demonstrator uses a direct route (<span className="kbd">/embed/widget</span>).
            In production, an embeddable widget can be delivered via a small JS loader.
          </div>

          <div style={{ height: 12 }} />

          <textarea
            className="input"
            readOnly
            value={snippet}
            rows={4}
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
          />

          <div style={{ height: 12 }} />

          <button
            className="btn btnPrimary"
            onClick={async () => {
              try{
                await navigator.clipboard.writeText(snippet)
                setCopied(true)
                setTimeout(()=>setCopied(false), 1200)
              }catch(e){
                alert('Copy failed. Select text manually.')
              }
            }}
          >
            {copied ? 'Copied' : 'Copy embed code'}
          </button>
        </div>

        {/* TFG/UOC block corto */}
        <div style={{ height: 14 }} />
        <div className="tfgBlock">
          <div className="tfgTitle">TFG (UOC) · Demonstrator context</div>
          <div className="tfgText">
            Developed as part of the Final Degree Project (UOC) to validate UX decisions, interaction patterns,
            and a cohesive visual system for a hospitality booking experience. Data is simulated for demonstration.
          </div>
        </div>
      </div>
    </main>
  )
}
