'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboard } from '@/components/DashboardContext'

const fmtDate = (t) =>
  new Date(t).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
const fmtTime = (t) =>
  new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

function StatusPill({ status }) {
  const isGood = status === 'Confirmed'
  const isWarn = status === 'Pending' || status === 'No-show risk'
  return (
    <span
      className="badge"
      style={{
        borderColor: isGood
          ? 'rgba(202,255,75,.35)'
          : isWarn
          ? 'rgba(255,226,102,.28)'
          : 'rgba(255,255,255,.12)',
        background: isGood
          ? 'rgba(202,255,75,.10)'
          : isWarn
          ? 'rgba(255,226,102,.08)'
          : 'rgba(0,0,0,.18)',
        color: 'rgba(255,255,255,.82)',
      }}
    >
      {status}
    </span>
  )
}

function ChannelPill({ channel }) {
  return (
    <span className="badge" style={{ background: 'rgba(255,255,255,.04)' }}>
      {channel}
    </span>
  )
}

function BookingRow({ b, onOpen }) {
  return (
    <button
      type="button"
      className="panel bookingRow"
      onClick={() => onOpen(b.id)}
      style={{
        padding: 14,
        textAlign: 'left',
        background: 'rgba(255,255,255,.03)',
        cursor: 'pointer',
        width: '100%',
      }}
      aria-label={`Open booking ${b.guest}`}
    >
      <div
        className="bookingGrid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr .6fr .6fr .7fr .7fr',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          <div style={{ fontWeight: 750, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {b.guest} · {b.partySize}
          </div>
        </div>

        <div style={{ color: 'var(--muted)' }}>{fmtDate(b.time)}</div>
        <div style={{ color: 'var(--muted)' }}>{fmtTime(b.time)}</div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusPill status={b.status} />
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          <ChannelPill channel={b.channel} />
          {b.note ? (
            <span
              style={{
                color: 'var(--muted)',
                fontSize: 13,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 240,
                textAlign: 'right',
              }}
              title={b.note}
            >
              Note: {b.note}
            </span>
          ) : (
            <span style={{ color: 'var(--muted)', fontSize: 13 }} />
          )}
        </div>
      </div>
    </button>
  )
}

function BookingDetailModal({ booking, onClose }) {
  // Hooks SIEMPRE en el mismo orden (booking puede ser null, pero no rompemos hooks)
  const [noteDraft, setNoteDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    // sincroniza cuando cambia la reserva seleccionada
    setNoteDraft(booking?.note ?? '')
    setToast(null)
    setSaving(false)
  }, [booking?.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const b = booking
  const visible = !!b

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.55)',
              backdropFilter: 'blur(6px)',
              zIndex: 80,
            }}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            style={{
              position: 'fixed',
              right: 18,
              top: 18,
              bottom: 18,
              width: 'min(560px, calc(100vw - 36px))',
              zIndex: 90,
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,.12)',
              background:
                'radial-gradient(900px 340px at 10% 0%, rgba(202,255,75,.10), transparent 60%), rgba(12,14,18,.72)',
              boxShadow: '0 26px 90px rgba(0,0,0,.62)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Booking details"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 850, letterSpacing: '-0.02em' }}>
                    {b.guest} · {b.partySize}
                  </div>
                  <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 13 }}>
                    {fmtDate(b.time)} · {fmtTime(b.time)} · <span style={{ opacity: 0.9 }}>{b.channel}</span>
                  </div>
                </div>
                <button className="btn" onClick={onClose} type="button" aria-label="Close details">
                  Close
                </button>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <StatusPill status={b.status} />
                <ChannelPill channel={b.channel} />
                <span className="badge" style={{ background: 'rgba(0,0,0,.18)' }}>
                  ID · {b.id}
                </span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 16, overflow: 'auto' }}>
              <div className="grid" style={{ gap: 12 }}>
                <div className="panel" style={{ padding: 14, background: 'rgba(255,255,255,.03)' }}>
                  <div style={{ fontWeight: 850, letterSpacing: '-0.01em' }}>Guest details</div>
                  <div style={{ height: 10 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Phone</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>{b.phone ?? '—'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Email</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>{b.email ?? '—'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Tags</div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(b.tags ?? ['VIP', 'Allergies?']).map((t) => (
                          <span key={t} className="badge" style={{ background: 'rgba(255,255,255,.04)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Table preference</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>{b.tablePref ?? '—'}</div>
                    </div>
                  </div>
                </div>

                <div className="panel" style={{ padding: 14, background: 'rgba(255,255,255,.03)' }}>
                  <div style={{ fontWeight: 850, letterSpacing: '-0.01em' }}>Notes</div>
                  <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 13 }}>
                    Internal note for the team (demo).
                  </div>
                  <div style={{ height: 10 }} />
                  <textarea
                    className="input"
                    rows={5}
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    style={{ resize: 'vertical' }}
                    placeholder="Add special requests, allergies, timing notes…"
                  />
                  <div style={{ height: 10 }} />
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {toast ? <span style={{ color: 'rgba(202,255,75,.9)' }}>{toast}</span> : ' '}
                    </div>
                    <button
                      className="btn btnPrimary"
                      type="button"
                      disabled={saving}
                      onClick={async () => {
                        setSaving(true)
                        // demo save (sin backend)
                        await new Promise((r) => setTimeout(r, 450))
                        setSaving(false)
                        setToast('Saved (demo)')
                        setTimeout(() => setToast(null), 1200)
                      }}
                    >
                      {saving ? 'Saving…' : 'Save note'}
                    </button>
                  </div>
                </div>

                <div className="panel" style={{ padding: 14, background: 'rgba(255,255,255,.03)' }}>
                  <div style={{ fontWeight: 850, letterSpacing: '-0.01em' }}>Operational</div>
                  <div style={{ height: 10 }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Created</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>{b.createdAt ? fmtDate(b.createdAt) : '—'}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: 12 }}>Source</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>{b.source ?? b.channel ?? '—'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: 14,
                borderTop: '1px solid rgba(255,255,255,.08)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
              }}
            >
              <button className="btn" onClick={onClose} type="button">
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Bookings() {
  const { bookings, query } = useDashboard()
  const [status, setStatus] = useState('All')
  const [openId, setOpenId] = useState(null)

  const rows = useMemo(() => {
    const base = bookings
    const s = status === 'All' ? base : base.filter((b) => b.status === status)
    return s
  }, [bookings, status])

  const selected = useMemo(() => rows.find((b) => b.id === openId) ?? bookings.find((b) => b.id === openId) ?? null, [
    openId,
    rows,
    bookings,
  ])

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 850, letterSpacing: '-0.02em' }}>Bookings</div>
          <div style={{ color: 'var(--muted)', marginTop: 6 }}>
            Filtered by sidebar search{query ? `: “${query}”` : ''}.
          </div>
        </div>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          {['All', 'Confirmed', 'Pending', 'No-show risk'].map((s) => (
            <button
              key={s}
              className="btn"
              onClick={() => setStatus(s)}
              style={{
                background: status === s ? 'rgba(202,255,75,.10)' : undefined,
                borderColor: status === s ? 'rgba(202,255,75,.35)' : undefined,
              }}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="panel" style={{ padding: 16 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr .6fr .6fr .7fr .7fr',
            gap: 12,
            color: 'var(--muted)',
            fontSize: 12,
          }}
        >
          <div>Guest</div>
          <div>Date</div>
          <div>Time</div>
          <div>Status</div>
          <div>Channel</div>
        </div>

        <div className="hr" />

        <div className="grid" style={{ gap: 10 }}>
          {rows.slice(0, 16).map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <BookingRow b={b} onOpen={setOpenId} />
            </motion.div>
          ))}
        </div>
      </div>

      <BookingDetailModal booking={selected} onClose={() => setOpenId(null)} />
    </div>
  )
}
