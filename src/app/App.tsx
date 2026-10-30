import { Analytics } from '@vercel/analytics/react'
import { AppRoutes } from './AppRoutes'

function App() {
  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  )
}

export default App
