import { useState } from 'react'
import './App.css'
import BagChart from './components/BagChart'
import YearSlider from './components/YearSlider'
import { YEARS } from './data.js'

function App() {
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1])

  return (
    <div className="app">
      <BagChart selectedYear={selectedYear} />
      <YearSlider value={selectedYear} onChange={setSelectedYear} />
    </div>
  )
}

export default App
