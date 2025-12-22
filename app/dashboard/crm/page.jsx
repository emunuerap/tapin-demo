'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useDashboard } from '@/components/DashboardContext'

export default function CRM(){
  const { bookings } = useDashboard()
  const [sel, setSel] = useState(null)

  const guests = useMemo(() => {
    const map = new Map()
    for (const b of bookings){
      const k = b.guest
      if (!map.has(k)) map.set(k,{name:k,visits:0,notes:new Set(),last:null,avgSize:0})
      const g = map.get(k)
      g.visits++
      g.avgSize += b.partySize
      if (b.note) g.notes.add(b.note)
      g.last = !g.last || new Date(b.time)>new Date(g.last) ? b.time : g.last
    }
    const arr = Array.from(map.values()).map(g=>({...g,avgSize:Math.round(g.avgSize/g.visits)}))
    arr.sort((a,b)=>(b.visits-a.visits)||a.name.localeCompare(b.name))
    return arr
  }, [bookings])

  const detail = sel ? guests.find(g=>g.name===sel) : null

  return (
    <div>
      <div className="row" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.02em'}}>CRM</div>
          <div style={{color:'var(--muted)',marginTop:6}}>Minimal guest memory: preferences & soft signals.</div>
        </div>
      </div>

      <div style={{height:14}} />
      <div className="grid" style={{gridTemplateColumns:'1fr 360px',alignItems:'start'}}>
        <div className="panel" style={{padding:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1.2fr .5fr .6fr',gap:10,color:'var(--muted)',fontSize:12}}>
            <div>Guest</div><div>Visits</div><div>Avg size</div>
          </div>
          <div className="hr" />
          <div className="grid" style={{gap:10}}>
            {guests.slice(0,14).map((g,i)=>(
              <motion.button
                key={g.name}
                initial={{opacity:0,y:6}}
                animate={{opacity:1,y:0}}
                transition={{delay:i*0.02}}
                className="btn"
                onClick={()=>setSel(g.name)}
                style={{justifyContent:'space-between',padding:12,background: sel===g.name ? 'rgba(202,255,75,.10)' : 'rgba(255,255,255,.03)'}}
              >
                <div style={{fontWeight:800}}>{g.name}</div>
                <div style={{display:'grid',gridTemplateColumns:'80px 90px',gap:10,justifyItems:'end',color:'var(--muted)'}}>
                  <div>{g.visits}</div>
                  <div>{g.avgSize}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="panel" style={{padding:16,position:'sticky',top:18}}>
          <div style={{fontWeight:800}}>Guest card</div>
          <div style={{color:'var(--muted)',marginTop:6,fontSize:13}}>Click a guest to inspect notes.</div>
          <div className="hr" />
          {!detail ? (
            <div style={{color:'var(--muted)'}}>No selection.</div>
          ) : (
            <div>
              <div style={{fontSize:18,fontWeight:900}}>{detail.name}</div>
              <div style={{color:'var(--muted)',marginTop:6,fontSize:13}}>Last visit: {new Date(detail.last).toLocaleString()}</div>
              <div style={{height:12}} />
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[...detail.notes].slice(0,6).map((n)=> <span key={n} className="badge">{n}</span>)}
              </div>
              <div style={{height:12}} />
              <div className="panel" style={{padding:12,background:'rgba(255,255,255,.03)'}}>
                <div style={{color:'var(--muted)',fontSize:12}}>Action ideas</div>
                <ul style={{margin:'8px 0 0 18px',color:'var(--muted)',lineHeight:1.5}}>
                  <li>Auto-tag allergies & preferences.</li>
                  <li>Push a “welcome back” note to staff.</li>
                  <li>Offer a slot if cancellation happens.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
