'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { restaurants, tables } from '@/lib/mock'

const accents={
  yuzu:{a:'#caff4b',b:'#ffe266'},
  ice:{a:'#72f4ff',b:'#a8b6ff'},
  ember:{a:'#ff6b4a',b:'#ffcc66'}
}

const times=['18:00','18:30','19:00','19:30','20:00','20:30','21:00']

function clamp(n,min,max){return Math.max(min,Math.min(max,n))}

export default function Widget(){
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const restaurantId = search.get('restaurant') || 'r-otoro'
  const accentKey = search.get('accent') || 'yuzu'
  const compact = search.get('compact') === '1'
  const r = restaurants.find(x=>x.id===restaurantId) || restaurants[0]
  const accent = accents[accentKey] || accents.yuzu

  const [step,setStep]=useState('form')
  const [date,setDate]=useState(()=>{
    const d=new Date();
    const iso = new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)
    return iso
  })
  const [time,setTime]=useState('19:00')
  const [size,setSize]=useState(2)
  const [name,setName]=useState('')
  const [loading,setLoading]=useState(false)
  const [code,setCode]=useState('')

  const pick = useMemo(() => {
    const candidates=tables.filter(t=>t.seats>=size).sort((a,b)=>a.seats-b.seats)
    return candidates[0] || null
  }, [size])

  const slots = useMemo(()=>{
    // fake availability: hide some slots based on size
    return times.map((t,i)=>({t, ok: (i+size)%4!==0}))
  }, [size])

  const style = {
    border:'1px solid rgba(255,255,255,.14)',
    borderRadius: compact ? 18 : 22,
    background:
      `radial-gradient(900px 420px at 20% 0%, ${accent.a}22, transparent 55%),`+
      `radial-gradient(700px 420px at 85% 10%, ${accent.b}18, transparent 60%),`+
      'rgba(255,255,255,.04)',
    boxShadow:'0 20px 80px rgba(0,0,0,.55)',
    backdropFilter:'blur(10px)',
    padding: compact ? 14 : 18,
    color:'rgba(255,255,255,.92)',
    fontFamily:'system-ui,-apple-system,sans-serif'
  }

  return (
    <div style={{padding: compact ? 12 : 18}}>
      <div style={style}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
          <div>
            <div style={{fontWeight:900,letterSpacing:'-0.02em',fontSize: compact ? 16 : 18}}>{r.name}</div>
            <div style={{color:'rgba(255,255,255,.65)',fontSize:12,marginTop:4}}>Book in seconds · powered by TapIn</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'end'}}>
            <span style={{fontSize:12,color:'rgba(255,255,255,.65)',border:'1px solid rgba(255,255,255,.12)',padding:'6px 10px',borderRadius:999}}>No app</span>
            <span style={{fontSize:12,color:'rgba(255,255,255,.65)',border:'1px solid rgba(255,255,255,.12)',padding:'6px 10px',borderRadius:999}}>1‑tap confirm</span>
          </div>
        </div>

        <div style={{height:12}} />
        <AnimatePresence mode="wait">
          {step==='form' && (
            <motion.div key="form" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.18}}>
              <div style={{display:'grid',gridTemplateColumns: compact ? '1fr' : '1fr 1fr',gap:10}}>
                <div>
                  <div style={{color:'rgba(255,255,255,.65)',fontSize:12}}>Date</div>
                  <input value={date} onChange={(e)=>setDate(e.target.value)} type="date" style={inputStyle(accent)} />
                </div>
                <div>
                  <div style={{color:'rgba(255,255,255,.65)',fontSize:12}}>Party</div>
                  <div style={{display:'flex',gap:10}}>
                    <button onClick={()=>setSize(s=>clamp(s-1,1,10))} style={btnStyle(false,accent)}>-</button>
                    <div style={{flex:1,textAlign:'center',padding:'10px 12px',borderRadius:14,border:'1px solid rgba(255,255,255,.12)',background:'rgba(0,0,0,.20)'}}>{size}</div>
                    <button onClick={()=>setSize(s=>clamp(s+1,1,10))} style={btnStyle(false,accent)}>+</button>
                  </div>
                </div>
              </div>

              <div style={{height:10}} />
              <div style={{color:'rgba(255,255,255,.65)',fontSize:12}}>Time</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
                {slots.map((s)=> (
                  <button
                    key={s.t}
                    onClick={()=>s.ok && setTime(s.t)}
                    style={slotStyle(time===s.t, s.ok, accent)}
                  >
                    {s.t}
                  </button>
                ))}
              </div>

              <div style={{height:12}} />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                <div style={{color:'rgba(255,255,255,.65)',fontSize:12}}>
                  {pick ? `Suggested: ${pick.label} · ${pick.seats} seats` : 'No table fits'}
                </div>
                <button
                  disabled={!pick}
                  onClick={()=>setStep('confirm')}
                  style={btnStyle(true,accent)}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step==='confirm' && (
            <motion.div key="confirm" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.18}}>
              <div style={{fontWeight:900}}>Confirm</div>
              <div style={{color:'rgba(255,255,255,.65)',marginTop:6,fontSize:13}}>
                {date} · {time} · {size} guests
              </div>
              <div style={{height:10}} />
              <div style={{color:'rgba(255,255,255,.65)',fontSize:12}}>Name (demo)</div>
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" style={inputStyle(accent)} />
              <div style={{height:12}} />
              <div style={{display:'flex',gap:10,justifyContent:'space-between',flexWrap:'wrap'}}>
                <button onClick={()=>setStep('form')} style={btnStyle(false,accent)}>Back</button>
                <button
                  onClick={async ()=>{
                    setLoading(true)
                    await new Promise(r=>setTimeout(r, 650))
                    setCode('TI-' + Math.random().toString(16).slice(2,6).toUpperCase())
                    setLoading(false)
                    setStep('done')
                  }}
                  style={btnStyle(true,accent)}
                >
                  {loading ? 'Booking…' : 'Book now'}
                </button>
              </div>
            </motion.div>
          )}

          {step==='done' && (
            <motion.div key="done" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.18}}>
              <div style={{fontWeight:900}}>Confirmed</div>
              <div style={{color:'rgba(255,255,255,.65)',marginTop:6,fontSize:13}}>Code: <span style={{color:accent.a,fontWeight:900}}>{code}</span></div>
              <div style={{height:10}} />
              <div style={{color:'rgba(255,255,255,.65)',fontSize:13,lineHeight:1.5}}>
                In production this would send a confirmation + allow edits. Here it’s a portfolio-friendly UX snapshot.
              </div>
              <div style={{height:12}} />
              <button onClick={()=>{setStep('form');setName('')}} style={btnStyle(false,accent)}>New booking</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{height:10,color:'rgba(255,255,255,.55)',fontSize:12,textAlign:'center'}}>
        Demo widget · query: restaurant={restaurantId} · accent={accentKey}
      </div>
    </div>
  )
}

function inputStyle(accent){
  return {
    width:'100%',padding:'10px 12px',borderRadius:14,
    border:'1px solid rgba(255,255,255,.12)',
    background:'rgba(0,0,0,.18)',color:'rgba(255,255,255,.92)',
    outline:'none',
    boxShadow:`0 0 0 0 rgba(0,0,0,0)`,
    caretColor:accent.a
  }
}

function btnStyle(primary, accent){
  return {
    padding:'10px 14px',borderRadius:14,cursor:'pointer',
    border: primary ? `1px solid ${accent.a}55` : '1px solid rgba(255,255,255,.12)',
    background: primary ? `${accent.a}1A` : 'rgba(255,255,255,.06)',
    color:'rgba(255,255,255,.92)',
    fontWeight:800,
    userSelect:'none'
  }
}

function slotStyle(active, ok, accent){
  return {
    padding:'8px 10px',borderRadius:12,cursor: ok ? 'pointer' : 'not-allowed',
    border: active ? `1px solid ${accent.a}66` : '1px solid rgba(255,255,255,.12)',
    background: active ? `${accent.a}1A` : 'rgba(255,255,255,.06)',
    opacity: ok ? 1 : 0.35,
    color:'rgba(255,255,255,.92)',
    fontWeight:700
  }
}
