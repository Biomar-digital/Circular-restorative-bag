import { useState } from 'react'
import './App.css'
import BagChart from './components/BagChart'
import YearSlider from './components/YearSlider'
import { YEARS } from './data.js'

const VB_W = 600
const VB_H = 960

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
            x={100}
            y={10}
            width={400}
            height={768}
          />
          <foreignObject x={0} y={790} width={VB_W} height={170}>
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
