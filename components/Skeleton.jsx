export default function Skeleton({ h = 14, w = '100%', r = 10 }) {
  return (
    <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,.10)', overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: 'translateX(-60%)',
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.14) 40%, transparent 70%)',
        animation: 'shimmer 1.2s ease-in-out infinite',
      }} />
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-60%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  )
}
