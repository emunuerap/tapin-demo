'use client'

import { useRef } from 'react'
import { haptic, clickTone } from '@/lib/feedback'
import { getPrefs } from '@/components/FeedbackToggle'

export default function TiltCard({ children, onClick }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (py - 0.5) * -6
    const ry = (px - 0.5) * 10
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`
  }

  const click = () => {
    const prefs = getPrefs()
    if (prefs.haptics) haptic(10)
    if (prefs.sound) clickTone(460, 0.03, 0.03)
    onClick?.()
  }

  return (
    <div
      ref={ref}
      className="glass glass-edge"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick ? click : undefined}
      style={{
        position: 'relative',
        padding: 18,
        cursor: onClick ? 'pointer' : 'default',
        transformStyle: 'preserve-3d',
        transition: 'transform 220ms cubic-bezier(.2,.9,.2,1)',
      }}
    >
      {children}
    </div>
  )
}
