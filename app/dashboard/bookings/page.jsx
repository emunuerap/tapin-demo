'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboard } from '@/components/DashboardContext'

const fmtDate = (t) =>
  new Date(t).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
const fmtTime = (t) =>
  new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
const fmtDay = (t) =>
  new Date(t).toLocaleDateString(undefined, { weekday: 'long' })

function BookingDetail({ booking, onClose, onUpdate }) {
  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!booking) return null

  const dateObj = new Date(booking.time)
  const iso = dateObj.toISOString()
  const ref = booking.id || `BKG-${iso.slice(11, 19).replaceAll(':', '')}`

  // demo-only derived fields (optional)
  const derived = {
    email: `${(booking.guest || 'guest').toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+34 600 000 000',
    area: 'Main dining',
    table: 'Auto-assign',
    createdAt: new Date(dateObj.getTime() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(dateObj.getTime() - 1000 * 60 * 22).toISOString(),
  }

  const status = booking.status || 'Pending'
  const channel = booking.channel || 'Direct'

  // Local editable state (mock UI)
  const [noteDraft, setNoteDraft] = useState(booking.note || '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    setNoteDraft(booking.note || '')
    setToast(null)
  }, [booking?.id])

  const flash = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 1200)
  }

  const updateStatus = async (nextStatus) => {
    setSaving(true)
    try {
      // mock delay (feels real)
      await new Promise((r) => setTimeout(r, 240))
      onUpdate?.(booking.id, { status: nextStatus })
      flash(`Status: ${nextStatus}`)
    } finally {
      setSaving(false)
    }
  }

  const saveNote = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 260))
      onUpdate?.(booking.id, { note: noteDraft.trim() })
      flash('Note saved')
    } finally {
      setSaving(false)
    }
  }

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(ref)
      flash('Reference copied')
    } catch {
      flash('Copy failed')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modalOverlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className="modalCard"
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modalTop">
            <div>
              <div className="modalTitle">Booking details</div>
              <div className="modalSub">
                Reference <button className="linkPill" onClick={copyRef}><span className="kbd">{ref}</span></button>
                <span style={{ margin: '0 10px', opacity: 0.45 }}>•</span>
                <span className="small">{fmtDay(booking.time)}</span>
              </div>
            </div>

            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <span className={`badge ${status === 'Confirmed' ? 'badgeGlow' : ''}`}>{status}</span>
              <button className="btn" onClick={onClose}>Close</button>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="actionBar">
            <div className="row" style={{ flexWrap: 'wrap' }}>
              <button
                className={`btn btnPrimary`}
                disabled={saving || status === 'Confirmed'}
                onClick={() => updateStatus('Confirmed')}
                title="Confirm booking"
              >
                {saving && status !== 'Confirmed' ? 'Working…' : 'Confirm'}
              </button>

              <button
                className="btn"
                disabled={saving || status === 'Pending'}
                onClick={() => updateStatus('Pending')}
                title="Mark as pending"
              >
                Pending
              </button>

              <button
                className="btn"
                disabled={saving || status === 'No-show risk'}
                onClick={() => updateStatus('No-show risk')}
                title="Flag as no-show risk"
              >
                No-show risk
              </button>

              <button
                className="btn"
                disabled={saving}
                onClick={() => { setNoteDraft(''); flash('Note cleared') }}
                title="Clear note draft"
              >
                Clear note
              </button>
            </div>

            <div className="row" style={{ gap: 10 }}>
              <span className="small" style={{ opacity: 0.9 }}>
                Channel: <span style={{ color: 'rgba(255,255,255,.86)', fontWeight: 700 }}>{channel}</span>
              </span>
              {toast && <span className="toastPill">{toast}</span>}
            </div>
          </div>

          <div className="modalGrid">
            <div className="field">
              <div className="label">Guest</div>
              <div className="value">{booking.guest}</div>
              <div className="hint">
                {derived.email} · {derived.phone}
              </div>
            </div>

            <div className="field">
              <div className="label">Party</div>
              <div className="value">{booking.partySize} guests</div>
              <div className="hint">Preferences: —</div>
            </div>

            <div className="field">
              <div className="label">Date & time</div>
              <div className="value">
                {fmtDate(booking.time)} · {fmtTime(booking.time)}
              </div>
              <div className="hint">Local time</div>
            </div>

            <div className="field">
              <div className="label">Table</div>
              <div className="value">{derived.table}</div>
              <div className="hint">{derived.area}</div>
            </div>

            {/* NOTES (editable) */}
            <div className="field full">
              <div className="label">Notes</div>
              <textarea
                className="input"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={4}
                placeholder="Add internal note (all demo / mock)."
                style={{ marginTop: 10, resize: 'none' }}
              />
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap' }}>
                <div className="hint">
                  Created {new Date(derived.createdAt).toLocaleString()} · Updated{' '}
                  {new Date(derived.updatedAt).toLocaleString()}
                </div>

                <div className="row" style={{ gap: 10 }}>
                  <button className="btn" disabled={saving} onClick={() => setNoteDraft(booking.note || '')}>
                    Reset
                  </button>
                  <button className="btn btnPrimary" disabled={saving} onClick={saveNote}>
                    {saving ? 'Saving…' : 'Save note'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


export default function Bookings() {
  const { bookings, query } = useDashboard()
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)

  const [localBookings, setLocalBookings] = useState(bookings)

  useEffect(() => {
    setLocalBookings(bookings)
  }, [bookings])

  const onUpdate = (id, patch) => {
    setLocalBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    // también actualiza el seleccionado para que se refleje instantáneo
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev))
  }


  const rows = useMemo(() => {
    const base = localBookings
    const s = status === 'All' ? base : base.filter((b) => b.status === status)
    return s
  }, [localBookings, status])


  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div className="pageTitle">Bookings</div>
          <div className="pageSub">
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
            gap: 10,
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
            <motion.button
              key={b.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bookingRow"
              onClick={() => setSelected(b)}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr .6fr .6fr .7fr .7fr',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 700 }}>
                  {b.guest} · {b.partySize}
                </div>
                <div style={{ color: 'var(--muted)' }}>{fmtDate(b.time)}</div>
                <div style={{ color: 'var(--muted)' }}>{fmtTime(b.time)}</div>
                <div>
                  <span className={`badge ${b.status === 'Confirmed' ? 'badgeGlow' : ''}`}>
                    {b.status}
                  </span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="badge">{b.channel}</span>
                  <span className="arrow">↗</span>
                </div>
              </div>

              {b.note && (
                <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 13 }}>
                  Note: {b.note}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <BookingDetail booking={selected} onClose={() => setSelected(null)} onUpdate={onUpdate} />
      </div>
  )
}
