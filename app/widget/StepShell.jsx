'use client'

import { useEffect, useRef } from 'react'

export default function StepShell({ stepKey, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.animate(
      [
        { opacity: 0, transform: 'translateY(10px) scale(.995)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'translateY(0px) scale(1)', filter: 'blur(0px)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.2,.9,.2,1)' }
    )
  }, [stepKey])

  return <div ref={ref} style={{ width: '100%' }}>{children}</div>
}
