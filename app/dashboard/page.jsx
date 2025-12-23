'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import StatCard from '@/components/StatCard'
import { useDashboard } from '@/components/DashboardContext'
import TiltCard from '@/components/TiltCard'


const fmt = (t) => new Date(t).toLocaleString(undefined,{weekday:'short',hour:'2-digit',minute:'2-digit'})

export default function Dashboard(){
  const { bookings } = useDashboard()
  const total = bookings.length
  const confirmed = bookings.filter(b=>b.status==='Confirmed').length
  const pending = bookings.filter(b=>b.status==='Pending').length
  const risk = bookings.filter(b=>b.status==='No-show risk').length
  const next = bookings.slice(0,6)

  return (
    <div>
      <div className="row" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.02em'}}>Overview</div>
          <div style={{color:'var(--muted)',marginTop:6}}>A crisp snapshot of tonight + current pipeline.</div>
        </div>
        <div className="row" style={{flexWrap:'wrap'}}>
          <Link href="/widget" className="btn">Preview widget</Link>
          <Link href="/dashboard/bookings" className="btn btnPrimary">Open bookings</Link>
        </div>
      </div>

      <div style={{height:14}} />
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))'}}>
      <TiltCard><StatCard label="Bookings" value={total} hint="in memory (demo)" /></TiltCard>
  <TiltCard><StatCard label="Confirmed" value={confirmed} hint="ready to seat" /></TiltCard>
  <TiltCard><StatCard label="Pending" value={pending} hint="needs confirmation" /></TiltCard>
  <TiltCard><StatCard label="No-show risk" value={risk} hint="consider SMS" /></TiltCard>
      </div>

      <div style={{height:14}} />
      <div className="panel" style={{padding:16}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div style={{fontWeight:800}}>Next arrivals</div>
          <div style={{color:'var(--muted)',fontSize:13}}>Tip: press <span className="kbd">/</span> to search.</div>
        </div>
        <div className="hr" />
        <div className="grid" style={{gap:10}}>
          {next.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{opacity:0,y:8}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.03}}
              className="panel"
              style={{padding:12,background:'rgba(255,255,255,.03)'}}
            >
              <div className="row" style={{justifyContent:'space-between'}}>
                <div style={{fontWeight:700}}>{b.guest} · {b.partySize}</div>
                <div style={{color:'var(--muted)'}}>{fmt(b.time)}</div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
                <span className="badge">{b.status}</span>
                <span className="badge">{b.channel}</span>
                {b.note && <span className="badge">{b.note}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
