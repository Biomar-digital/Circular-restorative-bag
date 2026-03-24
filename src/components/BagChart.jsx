import { useEffect, useRef, useState } from 'react'
import './BagChart.css'
import { DATA, TARGET } from '../data.js'

const VB_W = 500
const VB_H = 560

// Bag bounding box inside the SVG
const BAG_X = 130
const BAG_Y = 60
const BAG_W = 240
const BAG_H = 340

// The bag shape (stylized flat-bottom bag)
// Uses absolute coordinates within VB
function bagPath() {
  const x = BAG_X
  const y = BAG_Y
  const w = BAG_W
  const h = BAG_H
  const r = 18 // corner radius
  const neckW = w * 0.55
  const neckX = x + (w - neckW) / 2
  const neckH = 32

  // Neck (top narrow part)
  // Bag body (rounded bottom corners)
  return [
    // Neck top-left
    `M ${neckX + r} ${y}`,
    `L ${neckX + neckW - r} ${y}`,
    `Q ${neckX + neckW} ${y} ${neckX + neckW} ${y + r}`,
    `L ${neckX + neckW} ${y + neckH}`,
    // Shoulder right
    `L ${x + w} ${y + neckH + 20}`,
    // Right side
    `L ${x + w} ${y + h - r}`,
    `Q ${x + w} ${y + h} ${x + w - r} ${y + h}`,
    // Bottom
    `L ${x + r} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - r}`,
    // Left side
    `L ${x} ${y + neckH + 20}`,
    // Shoulder left
    `L ${neckX} ${y + neckH}`,
    `L ${neckX} ${y + r}`,
    `Q ${neckX} ${y} ${neckX + r} ${y}`,
    'Z',
  ].join(' ')
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

// Convert % (0-100) to the clip rect Y position (bag fills from bottom)
// fillPct: 0 = empty, 100 = full
function pctToClipY(pct) {
  const clampedPct = Math.max(0, Math.min(100, pct))
  // The fill starts from the bottom of the bag (BAG_Y + BAG_H)
  // and grows upward
  return BAG_Y + BAG_H - (clampedPct / 100) * BAG_H
}

export default function BagChart({ selectedYear }) {
  const animRef = useRef(null)
  const [displayPct, setDisplayPct] = useState(DATA[selectedYear].actual)
  const prevYearRef = useRef(selectedYear)

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current)

    const from = displayPct
    const to = DATA[selectedYear].actual
    const start = performance.now()
    const duration = 700

    function animate(now) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = easeInOut(t)
      const current = from + (to - from) * eased
      setDisplayPct(current)
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    prevYearRef.current = selectedYear

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [selectedYear])

  const clipY = pctToClipY(displayPct)
  const targetY = pctToClipY(TARGET)
  const showTarget = DATA[selectedYear].target !== undefined

  // Wave effect on fill top edge
  const waveAmp = 6
  const fillLeft = BAG_X
  const fillRight = BAG_X + BAG_W
  const fillBottom = BAG_Y + BAG_H

  return (
    <div className="bag-chart">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="bag-chart__svg"
      >
        <defs>
          <clipPath id="bag-shape-clip">
            <path d={bagPath()} />
          </clipPath>

          <filter id="bag-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="rgba(31,62,119,0.18)" />
          </filter>
        </defs>

        {/* Bag background (empty) */}
        <path
          d={bagPath()}
          fill="#d0e8f5"
          stroke="#1f3e77"
          strokeWidth="2.5"
          filter="url(#bag-shadow)"
        />

        {/* Fill — clipped to bag shape, grows from bottom */}
        <g clipPath="url(#bag-shape-clip)">
          {/* Solid fill rectangle */}
          <rect
            x={fillLeft}
            y={clipY + waveAmp}
            width={BAG_W}
            height={fillBottom - clipY + waveAmp}
            fill="#1f3e77"
          />
          {/* Wave top edge */}
          <path
            d={`
              M ${fillLeft} ${clipY + waveAmp}
              Q ${fillLeft + BAG_W * 0.25} ${clipY - waveAmp}
                ${fillLeft + BAG_W * 0.5} ${clipY + waveAmp}
              Q ${fillLeft + BAG_W * 0.75} ${clipY + waveAmp * 3}
                ${fillRight} ${clipY + waveAmp}
              L ${fillRight} ${fillBottom}
              L ${fillLeft} ${fillBottom}
              Z
            `}
            fill="#1f3e77"
          />
        </g>

        {/* Bag outline on top */}
        <path
          d={bagPath()}
          fill="none"
          stroke="#1f3e77"
          strokeWidth="2.5"
        />

        {/* Target line at 50% */}
        <line
          x1={BAG_X + 10}
          y1={targetY}
          x2={BAG_X + BAG_W - 10}
          y2={targetY}
          stroke="#1f3e77"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.5"
        />
        <text
          x={BAG_X + BAG_W + 10}
          y={targetY + 5}
          fill="#1f3e77"
          fontSize="13"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          opacity="0.6"
        >
          50% target
        </text>

        {/* Percentage label inside bag */}
        <text
          x={BAG_X + BAG_W / 2}
          y={BAG_Y + BAG_H / 2 + 8}
          textAnchor="middle"
          fill={displayPct > 45 ? '#fff' : '#1f3e77'}
          fontSize="42"
          fontFamily="Montserrat, sans-serif"
          fontWeight="800"
        >
          {displayPct.toFixed(1)}%
        </text>

        {/* Title */}
        <text
          x={VB_W / 2}
          y={BAG_Y + BAG_H + 44}
          textAnchor="middle"
          fill="#1f3e77"
          fontSize="15"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          letterSpacing="0.5"
        >
          Circular &amp; Restorative
        </text>
        <text
          x={VB_W / 2}
          y={BAG_Y + BAG_H + 64}
          textAnchor="middle"
          fill="#1f3e77"
          fontSize="13"
          fontFamily="Montserrat, sans-serif"
          fontWeight="600"
          opacity="0.7"
        >
          of total feed sold — {selectedYear}
        </text>
      </svg>
    </div>
  )
}
