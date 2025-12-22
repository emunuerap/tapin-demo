'use client'

import { useState } from 'react'

export default function Settings(){
  const [copied, setCopied] = useState(false)
  const snippet = `<script async src="https://YOUR-VERCEL-DOMAIN/embed/tapin-widget.js"></script>\n<div data-tapin-widget data-restaurant="r-otoro"></div>`

  return (
    <div>
      <div style={{fontSize:22,fontWeight:800,letterSpacing:'-0.02em'}}>Settings</div>
      <div style={{color:'var(--muted)',marginTop:6}}>Integration-friendly assets you can show in portfolio.</div>
      <div style={{height:14}} />

      <div className="panel" style={{padding:16}}>
        <div style={{fontWeight:800}}>Embed snippet (demo)</div>
        <div style={{color:'var(--muted)',marginTop:6,fontSize:13}}>In this demo we use a direct route (<code>/embed/widget</code>). For a real widget you’d publish a small JS loader.</div>
        <div style={{height:12}} />
        <textarea className="input" readOnly value={snippet} rows={4} style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, monospace'}} />
        <div style={{height:12}} />
        <button
          className="btn btnPrimary"
          onClick={async () => {
            try{
              await navigator.clipboard.writeText(snippet)
              setCopied(true)
              setTimeout(()=>setCopied(false), 1200)
            }catch(e){
              alert('Copy failed. Select text manually.')
            }
          }}
        >
          {copied ? 'Copied' : 'Copy embed code'}
        </button>
      </div>
    </div>
  )
}
