import { useEffect, useRef, useState } from 'react'
import './BagChart.css'
import { DATA, TARGET } from '../data.js'

const VB_W = 291.67
const VB_H = 400
const TOTAL_H = 490

const FILL_TOP    = 33
const FILL_BOTTOM = 395

const BAG_PATHS = [
  // Top seal (zigzag/fold pattern)
  'M269.6,11.65c-.7-3.53-2.82-6.35-6.34-7.76-3.52-1.41-6.34-1.41-9.87,0l-14.1,6.35-18.32-9.18c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18-18.32-9.18c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18L127.24,1.06c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18L80.02,1.06c-3.52-1.41-7.05-1.41-10.57,0l-16.91,9.18-14.1-6.35c-2.82-1.41-7.05-1.41-9.87,0-2.82,1.41-5.64,4.24-6.34,7.76-1.41,4.94-2.82,12.71-4.93,21.88h257.24c-2.11-9.18-4.23-16.23-4.93-21.88h0Z',
  // Bag body outline only
  'M289.34,381.51l-19.73-25.41c5.64-16.23,16.21-58.59,16.21-151.05,0-51.53-2.82-102.35-8.46-153.17H14.48c-5.64,50.82-8.46,102.35-8.46,153.17,0,89.64,11.28,134.11,16.91,151.05l-20.44,25.41c-2.82,3.53-3.52,9.18-.7,12.71,2.11,4.24,7.05,6.35,11.98,4.94,42.29-11.29,87.39-16.94,132.5-16.94s89.5,5.65,132.5,17.65c4.93.71,9.16-1.41,11.98-4.94,1.41-4.94,1.41-9.88-1.41-13.41h0Z',
]

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function pctToY(pct) {
  const clamped = Math.max(0, Math.min(100, pct))
  return FILL_BOTTOM - (clamped / 100) * (FILL_BOTTOM - FILL_TOP)
}

export default function BagChart({ selectedYear }) {
  const animRef = useRef(null)
  const [displayPct, setDisplayPct] = useState(DATA[selectedYear].actual)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const from     = displayPct
    const to       = DATA[selectedYear].actual
    const start    = performance.now()
    const duration = 700

    function animate(now) {
      const t = Math.min((now - start) / duration, 1)
      setDisplayPct(from + (to - from) * easeInOut(t))
      if (t < 1) animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [selectedYear])

  const fillY   = pctToY((displayPct / TARGET) * 100)
  const targetY = FILL_TOP
  const cx      = VB_W / 2

  return (
    <div className="bag-chart">
      <svg
        viewBox={`0 -70 ${VB_W} ${TOTAL_H + 70}`}
        preserveAspectRatio="xMidYMid meet"
        className="bag-chart__svg"
      >
        <defs>
          <clipPath id="bag-outline-clip">
            <path d={BAG_PATHS[1]} />
          </clipPath>
          {/* Flatten logo to single colour #c3e4ef (bg colour) */}
          <filter id="logo-bg-colour" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix"
              values="0 0 0 0 0.765
                      0 0 0 0 0.894
                      0 0 0 0 0.937
                      0 0 0 1 0" />
          </filter>
        </defs>

        {/* Title */}
        <text x={cx} y={-38} textAnchor="middle" fill="#1f3e77" fontSize="22"
          fontFamily="Montserrat, sans-serif" fontWeight="800">
          Circular &amp; Restorative
        </text>
        <text x={cx} y={-14} textAnchor="middle" fill="#1f3e77" fontSize="15"
          fontFamily="Montserrat, sans-serif" fontWeight="600" opacity="0.7">
          50% goal by 2030
        </text>

        {/* Empty bag — light fill */}
        <g fill="#eef7fc">
          {BAG_PATHS.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* Animated fill — clipped to bag outline */}
        <g clipPath="url(#bag-outline-clip)">
          <rect x="0" y={fillY} width={VB_W} height={FILL_BOTTOM - fillY + 20} fill="#1f3e77" />
        </g>

        {/* BioMar logo — single bg colour, always on top of fill */}
        <image
          href={`${import.meta.env.BASE_URL}biomar-logo-nobox.png`}
          x={cx - 90} y={130} width={180} height={120}
          preserveAspectRatio="xMidYMid meet"
          filter="url(#logo-bg-colour)"
        />

        {/* Target line at bag rim = 50% goal */}
        <line x1={18} y1={targetY} x2={VB_W - 18} y2={targetY}
          stroke="#1f3e77" strokeWidth="3" strokeDasharray="6 4" opacity="0.55" />

        {/* Percentage display */}
        <text x={cx} y={VB_H + 42} textAnchor="middle" fill="#1f3e77"
          fontSize="40" fontFamily="Montserrat, sans-serif" fontWeight="800">
          {displayPct.toFixed(1)}%
        </text>

        {/* Subtitle */}
        <text x={cx} y={VB_H + 66} textAnchor="middle" fill="#1f3e77"
          fontSize="11" fontFamily="Montserrat, sans-serif" fontWeight="600" opacity="0.7">
          Circular &amp; Restorative — {selectedYear}
        </text>
      </svg>
    </div>
  )
}
