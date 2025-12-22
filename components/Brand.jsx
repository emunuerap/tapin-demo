export default function Brand({ compact=false }){
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div aria-hidden style={{width:32,height:32,borderRadius:12,border:'1px solid rgba(255,255,255,.18)',background:'rgba(202,255,75,.12)'}} />
      {!compact && <div style={{fontWeight:700,letterSpacing:'-0.02em'}}>TapIn</div>}
    </div>
  )
}
