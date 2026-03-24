import { useState } from 'react'
import './YearSlider.css'
import { YEARS } from '../data.js'

export default function YearSlider({ value, onChange }) {
  const [interacted, setInteracted] = useState(false)

  function handleChange(year) {
    setInteracted(true)
    onChange(year)
  }

  return (
    <div className="year-slider">
      <div className="year-slider__heading">
        <span className="year-slider__label">Select Year</span>
        <span className="year-slider__value-badge">{value}</span>
      </div>

      <div className="year-slider__btns">
        {YEARS.map((y) => (
          <button
            key={y}
            className={`year-slider__btn${y === value ? ' active' : ''}`}
            onClick={() => handleChange(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <input
        type="range"
        className="year-slider__range"
        min={YEARS[0]}
        max={YEARS[YEARS.length - 1]}
        step={1}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
      />

      {!interacted && (
        <span className="year-slider__hint">← Click a year or drag →</span>
      )}
    </div>
  )
}
