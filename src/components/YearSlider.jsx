import './YearSlider.css'
import { YEARS } from '../data.js'

export default function YearSlider({ value, onChange }) {
  return (
    <div className="year-slider">
      <div className="year-slider__heading">
        <span className="year-slider__label">SELECT YEAR</span>
        <span className="year-slider__badge">{value}</span>
      </div>
      <div className="year-slider__btns">
        {YEARS.map((y) => (
          <button
            key={y}
            className={`year-slider__btn${value === y ? ' active' : ''}`}
            onClick={() => onChange(y)}
          >
            {y}
          </button>
        ))}
      </div>
      <div className="year-slider__range">
        <input
          type="range"
          min={YEARS[0]}
          max={YEARS[YEARS.length - 1]}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
