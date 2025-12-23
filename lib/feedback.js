let audioCtx = null

export function haptic(ms = 12) {
  if (typeof navigator === 'undefined') return
  try { navigator.vibrate?.(ms) } catch {}
}

export function clickTone(freq = 420, dur = 0.035, vol = 0.04) {
  if (typeof window === 'undefined') return
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)()
    const ctx = audioCtx
    const o = ctx.createOscillator()
    const g = ctx.createGain()

    o.type = 'sine'
    o.frequency.value = freq

    g.gain.value = 0
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)

    o.connect(g)
    g.connect(ctx.destination)

    o.start()
    o.stop(ctx.currentTime + dur)
  } catch {}
}
