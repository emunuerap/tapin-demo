'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export default function WidgetDemo(){
  const [restaurant,setRestaurant]=useState('r-otoro')
  const [accent,setAccent]=useState('yuzu')
  const [compact,setCompact]=useState(false)

  const src = useMemo(() => {
    const p = new URLSearchParams()
    p.set('restaurant', restaurant)
    p.set('accent', accent)
    if (compact) p.set('compact','1')
    return `/embed/widget?${p.toString()}`
  }, [restaurant, accent, compact])

  return (
    <main className="container">
      <div className="panel" style={{padding:22}}>
        <div className="row" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:22,fontWeight:900,letterSpacing:'-0.02em'}}>TapIn Web Widget</div>
            <div style={{color:'var(--muted)',marginTop:6}}>Embed-style preview. Customize via query params.</div>
          </div>
          <div className="row" style={{flexWrap:'wrap'}}>
            <Link href="/dashboard" className="btn">Back to dashboard</Link>
            <Link href="/" className="btn">Home</Link>
          </div>
        </div>

        <div className="hr" />
        <div className="grid" style={{gridTemplateColumns:'320px 1fr',alignItems:'start'}}>
          <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
            <div style={{fontWeight:800}}>Controls</div>
            <div style={{height:10}} />
            <label style={{color:'var(--muted)',fontSize:12}}>Restaurant</label>
            <select className="input" value={restaurant} onChange={(e)=>setRestaurant(e.target.value)}>
              <option value="r-otoro">Otoro</option>
              <option value="r-lobo">LOBO</option>
            </select>
            <div style={{height:10}} />
            <label style={{color:'var(--muted)',fontSize:12}}>Accent</label>
            <select className="input" value={accent} onChange={(e)=>setAccent(e.target.value)}>
              <option value="yuzu">Yuzu</option>
              <option value="ice">Ice</option>
              <option value="ember">Ember</option>
            </select>
            <div style={{height:10}} />
            <label className="row" style={{gap:10,color:'var(--muted)',fontSize:13}}>
              <input type="checkbox" checked={compact} onChange={(e)=>setCompact(e.target.checked)} />
              Compact mode
            </label>
            <div className="hr" />
            <div style={{color:'var(--muted)',fontSize:13,lineHeight:1.5}}>
            This page previews the embeddable widget. The widget can be integrated via iframe or by consuming the embed route directly.
            </div>
          </div>

          <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontWeight:800}}>Preview</div>
              <div style={{color:'var(--muted)',fontSize:12}}>Source: {src}</div>
            </div>
            <div style={{height:12}} />
            <iframe
              title="TapIn widget"
              src={src}
              style={{width:'100%',height:560,border:'1px solid rgba(255,255,255,.12)',borderRadius:18,background:'rgba(0,0,0,.25)'}}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
