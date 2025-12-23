'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { restaurants, tables } from '@/lib/mock'
import { haptic, clickTone } from '@/lib/feedback'

const accents = {
  yuzu: { a: '#caff4b', b: '#ffe266' },
  ice: { a: '#72f4ff', b: '#a8b6ff' },
  ember: { a: '#ff6b4a', b: '#ffcc66' },
}

const times = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00']
const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

const pageAnim = {
  initial: { opacity: 0, y: 10, scale: 0.995, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -8, scale: 0.995, filter: 'blur(6px)' },
  transition: { duration: 0.38, ease: [0.2, 0.9, 0.2, 1] },
}

export default function Widget() {
  // ✅ evita mismatch: primero default, luego hydrate con URL real
  const [params, setParams] = useState({ restaurant: 'r-otoro', accent: 'yuzu', compact: false })

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const restaurant = search.get('restaurant') || 'r-otoro'
    const accent = search.get('accent') || 'yuzu'
    const compact = search.get('compact') === '1'
    setParams({ restaurant, accent, compact })
  }, [])

  const { restaurant: restaurantId, accent: accentKey, compact } = params

  const r = restaurants.find((x) => x.id === restaurantId) || restaurants[0]
  const accent = accents[accentKey] || accents.yuzu

  const [step, setStep] = useState('form')
  const [date, setDate] = useState(() => {
    const d = new Date()
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  })
  const [time, setTime] = useState('19:00')
  const [size, setSize] = useState(2)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')

  const pick = useMemo(() => {
    const candidates = tables.filter((t) => t.seats >= size).sort((a, b) => a.seats - b.seats)
    return candidates[0] || null
  }, [size])

  const slots = useMemo(() => {
    // fake availability
    return times.map((t, i) => ({ t, ok: (i + size) % 4 !== 0 }))
  }, [size])

  const style = {
    border: '1px solid rgba(255,255,255,.14)',
    borderRadius: compact ? 18 : 22,
    background:
      `radial-gradient(900px 420px at 20% 0%, ${accent.a}22, transparent 55%),` +
      `radial-gradient(700px 420px at 85% 10%, ${accent.b}18, transparent 60%),` +
      'rgba(255,255,255,.04)',
    boxShadow: '0 24px 90px rgba(0,0,0,.55)',
    backdropFilter: 'blur(14px) saturate(120%)',
    WebkitBackdropFilter: 'blur(14px) saturate(120%)',
    padding: compact ? 14 : 18,
    color: 'rgba(255,255,255,.92)',
    fontFamily: 'system-ui,-apple-system,sans-serif',
    position: 'relative',
    overflow: 'hidden',
  }

  const feedback = () => {
    haptic(10)
    clickTone(520, 0.03, 0.028)
  }

  const go = (s) => {
    feedback()
    setStep(s)
  }

  return (
    <div style={{ padding: compact ? 12 : 18 }}>
      <div style={style}>
        {/* subtle rim light */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(900px 380px at 20% 0%, rgba(255,255,255,.14), transparent 55%)',
            mixBlendMode: 'screen',
            opacity: 0.55,
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, position:'relative' }}>
          <div>
            <div style={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: compact ? 16 : 18 }}>
              {r.name}
            </div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 12, marginTop: 4 }}>
              Book in seconds · powered by TapIn
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'end' }}>
            <span style={pillStyle()}>No app</span>
            <span style={pillStyle()}>1-tap confirm</span>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display:'flex', gap:6, marginTop: 12, position:'relative' }}>
          {['form','confirm','done'].map((k) => (
            <div
              key={k}
              style={{
                width: 9, height: 9, borderRadius: 99,
                background: step === k ? `${accent.a}` : 'rgba(255,255,255,.18)',
                boxShadow: step === k ? `0 0 0 4px ${accent.a}22` : 'none',
                transition: 'all .25s ease',
              }}
            />
          ))}
        </div>

        <div style={{ height: 12 }} />

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" {...pageAnim}>
              <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={labelStyle()}>Date</div>
                  <input value={date} onChange={(e) => setDate(e.target.value)} type="date" style={inputStyle(accent)} />
                </div>

                <div>
                  <div style={labelStyle()}>Party</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => { feedback(); setSize((s) => clamp(s - 1, 1, 10)) }}
                      style={btnStyle(false, accent)}
                    >
                      −
                    </button>

                    <div style={counterStyle()}>{size}</div>

                    <button
                      onClick={() => { feedback(); setSize((s) => clamp(s + 1, 1, 10)) }}
                      style={btnStyle(false, accent)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ height: 12 }} />
              <div style={labelStyle()}>Time</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {slots.map((s) => (
                  <button
                    key={s.t}
                    onClick={() => {
                      if (!s.ok) return
                      feedback()
                      setTime(s.t)
                    }}
                    style={slotStyle(time === s.t, s.ok, accent)}
                  >
                    {s.t}
                  </button>
                ))}
              </div>

              <div style={{ height: 14 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 12 }}>
                  {pick ? `Suggested: ${pick.label} · ${pick.seats} seats` : 'No table fits'}
                </div>

                <button
                  disabled={!pick}
                  onClick={() => go('confirm')}
                  style={{
                    ...btnStyle(true, accent),
                    opacity: pick ? 1 : 0.45,
                    cursor: pick ? 'pointer' : 'not-allowed',
                  }}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" {...pageAnim}>
              <div style={{ fontWeight: 900 }}>Confirm</div>
              <div style={{ color: 'rgba(255,255,255,.65)', marginTop: 6, fontSize: 13 }}>
                {date} · {time} · {size} guests
              </div>

              <div style={{ height: 12 }} />
              <div style={labelStyle()}>Name (demo)</div>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle(accent)} />

              <div style={{ height: 14 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button onClick={() => go('form')} style={btnStyle(false, accent)}>Back</button>

                <button
                  onClick={async () => {
                    feedback()
                    setLoading(true)
                    await new Promise((r) => setTimeout(r, 650))
                    setCode('TI-' + Math.random().toString(16).slice(2, 6).toUpperCase())
                    setLoading(false)
                    setStep('done')
                  }}
                  style={btnStyle(true, accent)}
                >
                  {loading ? 'Booking…' : 'Book now'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div key="done" {...pageAnim}>
              <div style={{ fontWeight: 900 }}>Confirmed</div>
              <div style={{ color: 'rgba(255,255,255,.65)', marginTop: 6, fontSize: 13 }}>
                Code: <span style={{ color: accent.a, fontWeight: 900 }}>{code}</span>
              </div>

              <div style={{ height: 10 }} />
              <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, lineHeight: 1.5 }}>
              The flow simulates confirmation and generates a booking code. Availability and persistence are mocked in memory for demonstration purposes.              </div>

              <div style={{ height: 14 }} />
              <button
                onClick={() => { feedback(); setStep('form'); setName('') }}
                style={btnStyle(false, accent)}
              >
                New booking
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ height: 10, color: 'rgba(255,255,255,.55)', fontSize: 12, textAlign: 'center' }}>
      Embeddable widget · parameters: restaurant · accent · compact      </div>
    </div>
  )
}

function pillStyle() {
  return {
    fontSize: 12,
    color: 'rgba(255,255,255,.65)',
    border: '1px solid rgba(255,255,255,.12)',
    padding: '6px 10px',
    borderRadius: 999,
    background: 'rgba(0,0,0,.18)',
  }
}

function labelStyle() {
  return { color: 'rgba(255,255,255,.65)', fontSize: 12 }
}

function counterStyle() {
  return {
    flex: 1,
    textAlign: 'center',
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(0,0,0,.20)',
  }
}

function inputStyle(accent) {
  return {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(0,0,0,.18)',
    color: 'rgba(255,255,255,.92)',
    outline: 'none',
    caretColor: accent.a,
    transition: 'box-shadow .2s ease, border-color .2s ease',
  }
}

function btnStyle(primary, accent) {
  return {
    padding: '10px 14px',
    borderRadius: 14,
    cursor: 'pointer',
    border: primary ? `1px solid ${accent.a}55` : '1px solid rgba(255,255,255,.12)',
    background: primary ? `${accent.a}1A` : 'rgba(255,255,255,.06)',
    color: 'rgba(255,255,255,.92)',
    fontWeight: 800,
    userSelect: 'none',
    transition: 'transform .18s ease, background .18s ease, border-color .18s ease',
  }
}

function slotStyle(active, ok, accent) {
  return {
    padding: '8px 10px',
    borderRadius: 12,
    cursor: ok ? 'pointer' : 'not-allowed',
    border: active ? `1px solid ${accent.a}66` : '1px solid rgba(255,255,255,.12)',
    background: active ? `${accent.a}1A` : 'rgba(255,255,255,.06)',
    opacity: ok ? 1 : 0.35,
    color: 'rgba(255,255,255,.92)',
    fontWeight: 700,
    transform: active ? 'translateY(-1px)' : 'translateY(0px)',
    transition: 'transform .18s ease, background .18s ease, border-color .18s ease',
  }
}
