import './YearSlider.css'
import { YEARS } from '../data.js'

export default function YearSlider({ value, onChange }) {
  const idx       = YEARS.indexOf(value)
  const trackFill = YEARS.length > 1
    ? `${(idx / (YEARS.length - 1)) * 100}%`
    : '100%'

  return (
    <div className="year-slider">
      <div className="year-slider__heading">
        <span className="year-slider__label">SELECT YEAR</span>
        <span className="year-slider__badge">{value}</span>
      </div>
      <div className="year-slider__btns">
        {YEARS.map((y) => {
          const isPast   = y < value
          const isActive = y === value
          const cls = `year-slider__btn${isActive ? ' active' : isPast ? ' past' : ''}`
          return (
            <button key={y} className={cls} onClick={() => onChange(y)}>
              {y}
            </button>
          )
        })}
      </div>
      <div className="year-slider__range">
        <input
          type="range"
          min={YEARS[0]}
          max={YEARS[YEARS.length - 1]}
          step={1}
          value={value}
          style={{ '--track-fill': trackFill }}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
