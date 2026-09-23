import {
  Navigate,
  Route,
  Routes,
} from 'react-router'

import { MainMenuPage } from '../features/main-menu/pages/MainMenuPage'
import { CasesPage } from '../features/cases/pages/CasesPage'
import { GameplayPage } from '../features/gameplay/pages/GameplayPage'
import { TutorialPage } from '../features/tutorial/pages/TutorialPage'
import { HowToPlayPage } from '../features/how-to-play/pages/HowToPlayPage'

export function AppRoutes() {
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
        path="/tutorial"
        element={<TutorialPage />}
      />

      <Route
        path="/how-to-play"
        element={<HowToPlayPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  )
}