export default function Brand({ compact = false }) {
  return (
    <div className="brandRow" style={{ gap: 10, minWidth: 0 }}>
      <div className="brandLogoWrap" aria-label="TapIn">
        {/* 2D (default) */}
        <img
          src="/brand/tapin_logo.png"
          alt="TapIn"
          className="brandLogo"
          draggable="false"
        />
        {/* 3D (hover) */}
        <img
          src="/brand/tapinlogo3d.png"
          alt=""
          className="brandLogo brandLogoAlt"
          aria-hidden
          draggable="false"
        />
      </div>

      {!compact && (
        <div style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>TapIn</div>
      )}
    </div>
  )
}
