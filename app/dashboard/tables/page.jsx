'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { tables } from '@/lib/mock'
import { useDashboard } from '@/components/DashboardContext'

const fmt=(t)=>new Date(t).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})

export default function Tables(){
  const { bookings } = useDashboard()
  const [partySize,setPartySize] = useState(2)
  const [time,setTime] = useState(()=>new Date().toISOString())

  const suggestion = useMemo(() => {
    const candidates = tables.filter(t=>t.seats>=partySize).sort((a,b)=>a.seats-b.seats)
    return candidates[0] || null
  }, [partySize])

  return (
    <div>
      <div className="row" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.02em'}}>Tables</div>
          <div style={{color:'var(--muted)',marginTop:6}}>Smart allocation (lightweight demo logic).</div>
        </div>
      </div>

      <div style={{height:14}} />
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
        <div className="panel" style={{padding:16}}>
          <div style={{fontWeight:800}}>New request</div>
          <div style={{height:10}} />
          <label style={{color:'var(--muted)',fontSize:12}}>Party size</label>
          <input className="input" type="number" min={1} max={10} value={partySize} onChange={(e)=>setPartySize(parseInt(e.target.value||'2',10))} />
          <div style={{height:10}} />
          <label style={{color:'var(--muted)',fontSize:12}}>Time (demo)</label>
          <input className="input" type="datetime-local" onChange={(e)=>setTime(new Date(e.target.value).toISOString())} />
          <div style={{height:12}} />
          {suggestion ? (
            <div className="panel" style={{padding:12,background:'rgba(255,255,255,.03)'}}>
              <div style={{color:'var(--muted)',fontSize:12}}>Suggested table</div>
              <div style={{fontSize:18,fontWeight:800,marginTop:6}}>{suggestion.label} · {suggestion.seats} seats</div>
              <div style={{color:'var(--muted)',marginTop:6}}>ETA: {fmt(time)}</div>
            </div>
          ) : (
            <div style={{color:'var(--muted)'}}>No table fits that size.</div>
          )}
        </div>

        <div className="panel" style={{padding:16}}>
          <div style={{fontWeight:800}}>Live map (cards)</div>
          <div style={{color:'var(--muted)',marginTop:6,fontSize:13}}>A quick at-a-glance layout — replace with your 3D floorplan later.</div>
          <div className="hr" />
          <div className="grid" style={{gridTemplateColumns:'repeat(2,minmax(0,1fr))'}}>
            {tables.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}} className="panel" style={{padding:12,background:'rgba(255,255,255,.03)'}}>
                <div style={{fontWeight:800}}>{t.label}</div>
                <div style={{color:'var(--muted)',marginTop:4}}>{t.seats} seats</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="panel" style={{padding:16}}>
          <div style={{fontWeight:800}}>Pressure</div>
          <div style={{color:'var(--muted)',marginTop:6,fontSize:13}}>Bookings by status (derived from current filter).</div>
          <div className="hr" />
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {['Confirmed','Pending','No-show risk'].map((s)=>(
              <span key={s} className="badge">{s}: {bookings.filter(b=>b.status===s).length}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
