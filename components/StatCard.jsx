export default function StatCard({ label, value, hint }) {
  return (
    <div className="panel" style={{padding:16,background:'rgba(255,255,255,.03)'}}>
      <div style={{color:'var(--muted)',fontSize:12}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,letterSpacing:'-0.02em',marginTop:6}}>{value}</div>
      {hint && <div style={{color:'var(--muted)',fontSize:12,marginTop:6}}>{hint}</div>}
    </div>
  )
}
