import Link from 'next/link'
import Brand from '@/components/Brand'

export default function Home(){
  return (
    <main className="container">
      <div className="panel" style={{padding:22}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <Brand />
          <span className="badge">Demo build · Dashboard + Widget</span>
        </div>
        <div style={{height:16}} />
        <h1 className="h1">Sentient hospitality UX — in a web demo.</h1>
        <div style={{height:10}} />
        <p className="h2">
          A polished, interactive slice of TapIn: a restaurant dashboard and an embeddable booking widget.
        </p>
        <div className="hr" />
        <div className="row" style={{flexWrap:'wrap'}}>
          <Link href="/dashboard" className="btn btnPrimary">Open dashboard</Link>
          <Link href="/widget" className="btn">Open widget demo</Link>
          <Link href="/embed/widget" className="btn">Direct widget (embed)</Link>
        </div>
        <div style={{height:18}} />
        <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
          <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
            <div style={{fontWeight:700}}>Dashboard</div>
            <div style={{color:'var(--muted)',marginTop:6}}>
              Bookings timeline, tables, CRM notes, and a “smart allocation” suggestion.
            </div>
          </div>
          <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
            <div style={{fontWeight:700}}>Widget</div>
            <div style={{color:'var(--muted)',marginTop:6}}>
              Embeddable UI with glass + motion, configurable via query params.
            </div>
          </div>
          <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
            <div style={{fontWeight:700}}>Interactivity</div>
            <div style={{color:'var(--muted)',marginTop:6}}>
              Keyboard shortcuts, stateful flows, animations, to feel like a real product.
            </div>
          </div>
        </div>
      </div>

      <div style={{height:16}} />
      <div style={{display:'flex',justifyContent:'space-between',color:'var(--muted)',fontSize:13}}>
        <div>Tip: press <span className="kbd">/</span> inside Dashboard to focus search.</div>
        <div>Made for your “Ramas · TapIn” section.</div>
      </div>
    </main>
  )
}
