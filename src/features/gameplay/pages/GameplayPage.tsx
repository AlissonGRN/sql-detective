import {
  Navigate,
  useParams,
} from 'react-router'

import {
  getCaseById,
} from '../../cases/services/caseService'

import { DatabaseExplorer } from '../components/DatabaseExplorer'
import { GameHeader } from '../components/GameHeader'

import {
  getInitialScenarioForCase,
} from '../services/scenarioService'

export function GameplayPage() {
  const {
    caseId,
  } = useParams<{
    caseId: string
  }>()

  if (!caseId) {
    return (
      <Navigate
        to="/cases"
        replace
      />
    )
  }

  const gameCase =
    getCaseById(caseId)

  const scenario =
    getInitialScenarioForCase(
      caseId,
    )

  if (!gameCase || !scenario) {
    return (
      <Navigate
        to="/cases"
        replace
      />
    )
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#151512]
        px-5
        py-6
        text-[#e6dfcc]
        md:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
        "
      >
        <GameHeader
          caseNumber={
            gameCase.number
          }
          caseTitle={
            gameCase.title
          }
        />

        <section
          className="
            grid
            grid-cols-1
            gap-7
            lg:grid-cols-[280px_minmax(0,1fr)]
          "
        >
          <DatabaseExplorer
            databaseName="bell_db"
            tables={scenario.tables}
          />

          <section
            className="
              flex
              min-h-[650px]
              items-center
              justify-center
              border
              border-dashed
              border-neutral-800
            "
          >
            <div className="text-center">
              <p
                className="
                  mb-2
                  font-mono
                  text-[10px]
                  tracking-[0.2em]
                  text-[#9e3030]
                "
              >
                PRÓXIMA ETAPA
              </p>

              <h2
                className="
                  font-serif
                  text-3xl
                  font-bold
                "
              >
                Construtor SQL
              </h2>

              <p
                className="
                  mt-3
                  font-mono
                  text-xs
                  text-neutral-600
                "
              >
                O banco já está disponível
                para inspeção.
              </p>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}