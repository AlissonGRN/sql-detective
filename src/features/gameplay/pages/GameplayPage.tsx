import {
  useState,
} from 'react'

import {
  Navigate,
  useParams,
} from 'react-router'

import {
  getCaseById,
} from '../../cases/services/caseService'

import { DatabaseExplorer } from '../components/DatabaseExplorer'
import { GameHeader } from '../components/GameHeader'
import { SqlBuilder } from '../components/SqlBuilder/SqlBuilder'

import {
  getInitialScenarioForCase,
} from '../services/scenarioService'

export function GameplayPage() {
  const {
    caseId,
  } = useParams<{
    caseId: string
  }>()

  const [
    executedQuery,
    setExecutedQuery,
  ] = useState<string | null>(null)

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

  const handleExecuteQuery = (
    query: string,
  ) => {
    setExecutedQuery(query)
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

          <div className="space-y-8">
            <SqlBuilder
              tables={scenario.tables}
              onExecute={
                handleExecuteQuery
              }
            />

            {/* RESULTADO TEMPORÁRIO */}

            <section
              className="
                relative
                min-h-[220px]
                bg-[#d9ccb0]
                p-6
                text-[#28241d]
                shadow-2xl

                before:absolute
                before:-top-5
                before:left-0
                before:h-6
                before:w-40
                before:rounded-t-md
                before:bg-[#c5a56e]
              "
            >
              <p
                className="
                  mb-1
                  font-mono
                  text-[9px]
                  tracking-[0.2em]
                  text-[#786d59]
                "
              >
                SAÍDA DO SISTEMA
              </p>

              <h2
                className="
                  mb-5
                  font-serif
                  text-2xl
                  font-bold
                "
              >
                Resultado
              </h2>

              {executedQuery ? (
                <div>
                  <p
                    className="
                      mb-2
                      font-mono
                      text-[9px]
                      text-[#786d59]
                    "
                  >
                    CONSULTA RECEBIDA
                  </p>

                  <code
                    className="
                      block
                      bg-black/5
                      p-4
                      font-mono
                      text-xs
                    "
                  >
                    {executedQuery}
                  </code>

                  <p
                    className="
                      mt-5
                      font-mono
                      text-xs
                      text-[#786d59]
                    "
                  >
                    O motor SQL será
                    conectado na próxima
                    etapa.
                  </p>
                </div>
              ) : (
                <div
                  className="
                    flex
                    min-h-[120px]
                    items-center
                    justify-center
                    border
                    border-dashed
                    border-[#aa9d84]
                  "
                >
                  <p
                    className="
                      font-mono
                      text-xs
                      text-[#8a7f6c]
                    "
                  >
                    Execute uma consulta
                    para visualizar os
                    resultados.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}