import { useState } from 'react'
import './App.css'
import BagChart from './components/BagChart'
import YearSlider from './components/YearSlider'
import { YEARS } from './data.js'

const VB_W = 600
const VB_H = 1200

function App() {
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1])

  return (
    <div className="app">
      <div className="circular-bag-embed">
        <svg
          className="circular-bag-embed__svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <BagChart
            selectedYear={selectedYear}
            x={50}
            y={40}
            width={500}
            height={960}
          />
          <foreignObject x={0} y={1010} width={VB_W} height={190}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <YearSlider value={selectedYear} onChange={setSelectedYear} />
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  )
}

export default App
