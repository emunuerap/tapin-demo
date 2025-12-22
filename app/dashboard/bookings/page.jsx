'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboard } from '@/components/DashboardContext'

const fmtDate=(t)=>new Date(t).toLocaleDateString(undefined,{month:'short',day:'2-digit'})
const fmtTime=(t)=>new Date(t).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})

export default function Bookings(){
  const { bookings, query } = useDashboard()
  const [status, setStatus] = useState('All')
  const rows = useMemo(() => {
    const base = bookings
    const s = status==='All' ? base : base.filter(b=>b.status===status)
    return s
  }, [bookings, status])

  return (
    <div>
      <div className="row" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.02em'}}>Bookings</div>
          <div style={{color:'var(--muted)',marginTop:6}}>Filtered by sidebar search{query ? `: “${query}”` : ''}.</div>
        </div>
        <div className="row" style={{flexWrap:'wrap'}}>
          {['All','Confirmed','Pending','No-show risk'].map(s => (
            <button
              key={s}
              className="btn"
              onClick={()=>setStatus(s)}
              style={{
                background: status===s ? 'rgba(202,255,75,.10)' : undefined,
                borderColor: status===s ? 'rgba(202,255,75,.35)' : undefined
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{height:14}} />
      <div className="panel" style={{padding:16}}>
        <div style={{display:'grid',gridTemplateColumns:'1.2fr .6fr .6fr .7fr .7fr',gap:10,color:'var(--muted)',fontSize:12}}>
          <div>Guest</div><div>Date</div><div>Time</div><div>Status</div><div>Channel</div>
        </div>
        <div className="hr" />
        <div className="grid" style={{gap:10}}>
          {rows.slice(0,16).map((b, i) => (
            <motion.div
              key={b.id}
              initial={{opacity:0,y:6}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.02}}
              className="panel"
              style={{padding:12,background:'rgba(255,255,255,.03)'}}
            >
              <div style={{display:'grid',gridTemplateColumns:'1.2fr .6fr .6fr .7fr .7fr',gap:10,alignItems:'center'}}>
                <div style={{fontWeight:700}}>{b.guest} · {b.partySize}</div>
                <div style={{color:'var(--muted)'}}>{fmtDate(b.time)}</div>
                <div style={{color:'var(--muted)'}}>{fmtTime(b.time)}</div>
                <div><span className="badge">{b.status}</span></div>
                <div><span className="badge">{b.channel}</span></div>
              </div>
              {b.note && <div style={{marginTop:10,color:'var(--muted)',fontSize:13}}>Note: {b.note}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
