import { Navigate, Route, Routes } from 'react-router'
import { MainMenuPage } from '../features/main-menu/pages/MainMenuPage'
import { CasesPage } from '../features/cases/pages/CasesPage'
import { GameplayPage } from '../features/gameplay/pages/GameplayPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainMenuPage />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/cases/:caseId" element={<GameplayPage />} />
      <Route path="/how-to-play" element={<Navigate to="/cases" replace />} />
      <Route path="/tutorial" element={<Navigate to="/cases" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
