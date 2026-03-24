import { useEffect, useRef, useState } from 'react'
import './BagChart.css'
import { DATA, TARGET } from '../data.js'

// Original icon viewBox: 0 0 291.67 400
const VB_W = 291.67
const VB_H = 400
const TOTAL_H = 490 // extra space below for percentage label + title

// Fillable area of the bag body (below the top seal)
const FILL_TOP = 33
const FILL_BOTTOM = 395

// Official Biomar feed bag icon paths
const BAG_PATHS = [
  // Top seal (zigzag/fold pattern)
  'M269.6,11.65c-.7-3.53-2.82-6.35-6.34-7.76-3.52-1.41-6.34-1.41-9.87,0l-14.1,6.35-18.32-9.18c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18-18.32-9.18c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18L127.24,1.06c-3.52-1.41-7.05-1.41-10.57,0l-18.32,9.18L80.02,1.06c-3.52-1.41-7.05-1.41-10.57,0l-16.91,9.18-14.1-6.35c-2.82-1.41-7.05-1.41-9.87,0-2.82,1.41-5.64,4.24-6.34,7.76-1.41,4.94-2.82,12.71-4.93,21.88h257.24c-2.11-9.18-4.23-16.23-4.93-21.88h0Z',
  // Detail B letter – upper bump
  'M80.02,179.64c2.82,0,5.64-1.41,6.34-4.24.7-2.82-1.41-4.24-4.93-4.24h-2.82l-1.41,6.35c0,2.12.7,2.12,2.82,2.12h0Z',
  // Detail B letter – lower bump
  'M87.07,164.11c0-2.12-1.41-3.53-3.52-3.53h-2.82l-1.41,6.35h2.82c2.82.71,4.93-.71,4.93-2.82h0Z',
  // Detail circular element
  'M117.38,180.34c2.82,0,5.64-2.12,6.34-5.65.7-3.53-.7-5.65-3.52-5.65s-5.64,2.12-6.34,5.65c-.7,3.53,0,5.65,3.52,5.65h0Z',
  // Main bag body + branding text (compound path)
  'M289.34,381.51l-19.73-25.41c5.64-16.23,16.21-58.59,16.21-151.05,0-51.53-2.82-102.35-8.46-153.17H14.48c-5.64,50.82-8.46,102.35-8.46,153.17,0,89.64,11.28,134.11,16.91,151.05l-20.44,25.41c-2.82,3.53-3.52,9.18-.7,12.71,2.11,4.24,7.05,6.35,11.98,4.94,42.29-11.29,87.39-16.94,132.5-16.94s89.5,5.65,132.5,17.65c4.93.71,9.16-1.41,11.98-4.94,1.41-4.94,1.41-9.88-1.41-13.41h0ZM107.51,174.7c1.41-6.35,5.64-10.59,12.69-10.59s10.57,4.24,9.16,10.59c-1.41,6.35-5.64,10.59-12.69,10.59s-10.57-4.24-9.16-10.59h0ZM103.28,155.64c2.11,0,3.52,1.41,3.52,3.53s-1.41,3.53-3.52,3.53-3.52-1.41-3.52-3.53,1.41-3.53,3.52-3.53h0ZM99.05,165.52q0-.71,0,0l5.64-.71s.7,0,0,.71l-3.52,18.35s0,.71-.7.71h-5.64v-.71l4.23-18.35h0ZM75.09,157.05s.7,0,0,0c3.52-.71,6.34-.71,9.16-.71,5.64,0,9.16,2.12,9.16,7.06,0,4.24-2.82,5.65-5.64,6.35,1.41.71,4.23,2.12,4.23,6.35,0,5.65-4.23,9.18-13.39,9.18-2.82,0-5.64,0-9.16-.71v-.71l5.64-26.82h0ZM54.65,190.23c-.7-1.41-1.41-2.12-.7-2.82.7,0,1.41,0,2.11.71,9.16,9.18,27.49,24,52.15,24,32.42,0,45.1-21.18,59.9-21.18,4.93,0,7.75,2.82,7.75,6.35,0,12-26.78,26.82-54.27,26.82-26.08.71-50.04-12-66.95-33.88h0ZM130.06,183.87l12.69-26.82s0-.71.7-.71h1.41s.7,0,.7.71l4.23,16.23,10.57-16.94h1.41s.7,0,.7.71l2.11,26.82s0,.71-.7.71h-5.64s-.7,0-.7-.71l-1.41-14.12-9.16,14.12c0,.71-.7.71-.7.71h-1.41s-.7,0-.7-.71l-2.82-14.12-7.05,14.12h-4.23c0,.71-.7,0,0,0h0ZM179.39,169.05c-3.52,0-4.93,3.53-4.93,7.06,0,2.82,1.41,4.24,4.23,4.24h2.11s.7,0,.7.71v.71c-.7,2.12-2.11,4.24-4.93,4.24-4.93,0-7.75-3.53-7.75-8.47,0-7.06,4.23-12,11.28-12,2.11,0,4.93.71,6.34,2.82l.7-1.41s0-.71.7-.71h4.93s.7,0,0,.71l-3.52,18.35s0,.71-.7.71h-5.64s-.7,0,0-.71l2.11-9.88v-.71c-.7-4.24-3.52-5.65-5.64-5.65h0ZM149.79,244.58c-9.87,0-21.14-1.41-26.08-2.82-1.41-.71-2.11-.71-2.11-1.41s.7-.71,2.11-.71h16.21c35.94,0,71.89-25.41,77.52-64.23,1.41-7.76,4.93-12,9.87-12,6.34,0,9.16,5.65,9.16,12.71,0,33.17-40.17,68.47-86.69,68.47h0ZM195.6,166.23s0-.71,0,0l5.64-2.12h.7v2.12c1.41-2.12,3.52-2.82,5.64-2.82h1.41v5.65s0,.71-.7.71h-2.11c-2.82,0-4.93,1.41-5.64,5.65l-1.41,8.47s0,.71-.7.71h-5.64s-.7,0-.7-.71l2.11-12.71c2.11-2.12,2.11-3.53,1.41-4.94h0ZM238.59,157.05c-11.28-8.47-28.19-21.18-52.86-21.18-35.24,0-48.63,21.88-62.72,21.88-5.64,0-7.75-2.82-7.75-6.35,0-12,28.9-26.82,57.79-26.82s51.45,13.41,66.95,30.35c.7.71,1.41,2.12.7,2.12,0,.71-.7.71-2.11,0h0Z',
]

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

// Convert percentage to Y position (fills from bottom up)
function pctToY(pct) {
  const clamped = Math.max(0, Math.min(100, pct))
  return FILL_BOTTOM - (clamped / 100) * (FILL_BOTTOM - FILL_TOP)
}

export default function BagChart({ selectedYear }) {
  const animRef = useRef(null)
  const [displayPct, setDisplayPct] = useState(DATA[selectedYear].actual)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const from = displayPct
    const to = DATA[selectedYear].actual
    const start = performance.now()
    const duration = 700

    function animate(now) {
      const t = Math.min((now - start) / duration, 1)
      setDisplayPct(from + (to - from) * easeInOut(t))
      if (t < 1) animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [selectedYear])

  const fillY = pctToY(displayPct)
  const targetY = pctToY(TARGET)
  const cx = VB_W / 2

  return (
    <div className="bag-chart">
      <svg
        viewBox={`0 0 ${VB_W} ${TOTAL_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="bag-chart__svg"
      >
        <defs>
          {/* Clip fill to a rising rectangle */}
          <clipPath id="fill-rise-clip">
            <rect x="0" y={fillY} width={VB_W} height={FILL_BOTTOM - fillY + 10} />
          </clipPath>
          {/* Clip logo to the filled (dark) area only */}
          <clipPath id="logo-fill-clip">
            <rect x="0" y={fillY} width={VB_W} height={FILL_BOTTOM - fillY + 10} />
          </clipPath>
          {/* Clip logo to the empty (light) area only */}
          <clipPath id="logo-empty-clip">
            <rect x="0" y={FILL_TOP} width={VB_W} height={fillY - FILL_TOP} />
          </clipPath>
        </defs>

        {/* Empty bag — light fill */}
        <g fill="#eef7fc">
          {BAG_PATHS.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* Filled portion — dark blue, rising from bottom */}
        <g fill="#1f3e77" clipPath="url(#fill-rise-clip)">
          {BAG_PATHS.map((d, i) => <path key={i} d={d} />)}
        </g>

        {/* BioMar logo — black on light area, white on dark fill */}
        <image
          href={`${import.meta.env.BASE_URL}biomar-logo-black.png`}
          x={cx - 90} y={170}
          width={180} height={60}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#logo-empty-clip)"
        />
        <image
          href={`${import.meta.env.BASE_URL}biomar-logo-white.png`}
          x={cx - 90} y={170}
          width={180} height={60}
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#logo-fill-clip)"
        />

        {/* Target line at 50% */}
        <line
          x1={18} y1={targetY}
          x2={VB_W - 18} y2={targetY}
          stroke="#1f3e77" strokeWidth="1.5"
          strokeDasharray="5 3" opacity="0.55"
        />
        <text
          x={VB_W - 16} y={targetY - 4}
          fill="#1f3e77" fontSize="9"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700" opacity="0.65"
          textAnchor="end"
        >
          50% target
        </text>

        {/* Percentage display below bag */}
        <text
          x={cx} y={VB_H + 42}
          textAnchor="middle"
          fill="#1f3e77"
          fontSize="40"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
        >
          {displayPct.toFixed(1)}%
        </text>

        {/* Subtitle */}
        <text
          x={cx} y={VB_H + 66}
          textAnchor="middle"
          fill="#1f3e77"
          fontSize="11"
          fontFamily="Montserrat, sans-serif"
          fontWeight="600"
          opacity="0.7"
        >
          Circular &amp; Restorative — {selectedYear}
        </text>
      </svg>
    </div>
  )
}
