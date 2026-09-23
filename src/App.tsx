import { Navigate, Route, Routes } from 'react-router'

import { MainMenuPage } from './pages/MainMenuPage'
import { CasesPage } from './pages/CasesPage'
import { GameplayPage } from './pages/GameplayPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainMenuPage />}
      />

      <Route
        path="/cases"
        element={<CasesPage />}
      />

      <Route
        path="/cases/:caseId"
        element={<GameplayPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App