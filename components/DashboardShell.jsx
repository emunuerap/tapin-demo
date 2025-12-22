'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Brand from '@/components/Brand'
import { DashboardProvider } from '@/components/DashboardContext'
import { seedBookings } from '@/lib/mock'

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/bookings', label: 'Bookings' },
  { href: '/dashboard/tables', label: 'Tables' },
  { href: '/dashboard/crm', label: 'CRM' },
  { href: '/dashboard/settings', label: 'Settings' }
]

function useAuth(){
  const [ready, setReady] = useState(false)
  const [token, setToken] = useState(null)
  useEffect(() => {
    const t = window.localStorage.getItem('tapin_demo_token')
    setToken(t)
    setReady(true)
  }, [])
  return { ready, token, setToken }
}

export default function DashboardShell({ children }) {
  const path = usePathname()
  const router = useRouter()
  const { ready, token, setToken } = useAuth()
  const [q, setQ] = useState('')
  const [bookings] = useState(() => seedBookings(22))

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey) === false) {
        const el = document.getElementById('tapin-search')
        if (el) {
          e.preventDefault()
          el.focus()
        }
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        router.push('/widget')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return bookings
    return bookings.filter(b =>
      b.guest.toLowerCase().includes(s) ||
      b.status.toLowerCase().includes(s) ||
      b.channel.toLowerCase().includes(s)
    )
  }, [q, bookings])

  if (!ready) return null

  if (!token) {
    return (
      <main className="container">
        <div className="panel" style={{padding:22,maxWidth:520,margin:'0 auto'}}>
          <Brand />
          <div style={{height:12}} />
          <h1 style={{margin:0,fontSize:28,letterSpacing:'-0.02em'}}>Restaurant dashboard</h1>
          <p style={{color:'var(--muted)'}}>
            Fake login (demo). Any email + password works.
          </p>
          <div style={{height:10}} />
          <input className="input" placeholder="Email" defaultValue="ops@otoro.io" />
          <div style={{height:10}} />
          <input className="input" placeholder="Password" type="password" defaultValue="••••••••" />
          <div style={{height:12}} />
          <button
            className="btn btnPrimary"
            onClick={() => {
              const t = 'demo_' + Math.random().toString(16).slice(2)
              window.localStorage.setItem('tapin_demo_token', t)
              setToken(t)
              router.push('/dashboard')
            }}
          >
            Enter dashboard
          </button>
          <div className="hr" />
          <div style={{color:'var(--muted)',fontSize:13}}>
            Shortcuts: <span className="kbd">/</span> search · <span className="kbd">⌘K</span> widget
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="container" style={{paddingTop:18}}>
      <div className="panel" style={{display:'grid',gridTemplateColumns:'240px 1fr',minHeight:'78vh'}}>
        <aside style={{padding:16,borderRight:'1px solid rgba(255,255,255,.08)'}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <Brand compact />
            <button
              className="btn"
              title="Log out"
              onClick={() => {
                window.localStorage.removeItem('tapin_demo_token')
                setToken(null)
                router.push('/')
              }}
            >
              Logout
            </button>
          </div>
          <div style={{height:12}} />
          <input
            id="tapin-search"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search bookings (press /)"
          />
          <div style={{height:12}} />
          <div className="grid" style={{gap:8}}>
            {nav.map((n) => {
              const active = path === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="btn"
                  style={{
                    justifyContent:'space-between',
                    background: active ? 'rgba(202,255,75,.10)' : undefined,
                    borderColor: active ? 'rgba(202,255,75,.35)' : undefined
                  }}
                >
                  <span>{n.label}</span>
                  <span style={{color:'var(--muted)',fontSize:12}}>→</span>
                </Link>
              )
            })}
          </div>
          <div className="hr" />
          <div style={{color:'var(--muted)',fontSize:13,lineHeight:1.4}}>
            This demo keeps data in-memory. Use it as a portfolio preview for TapIn.
          </div>
        </aside>

        <DashboardProvider value={{ bookings: filtered, query: q }}>
          <section style={{padding:18}}>{children}</section>
        </DashboardProvider>
      </div>
    </div>
  )
}
