import { useState } from 'react'
import { DurationCalculator } from './components/DurationCalculator'
import { Layout } from './components/Layout'
import { TimestampConverter } from './components/TimestampConverter'

const DEFAULT_ZONE = 'Asia/Shanghai'

function App() {
  const [zone, setZone] = useState(DEFAULT_ZONE)

  return (
    <Layout zone={zone} onZoneChange={setZone}>
      <TimestampConverter zone={zone} onZoneChange={setZone} />
      <DurationCalculator defaultZone={zone} />
    </Layout>
  )
}

export default App
