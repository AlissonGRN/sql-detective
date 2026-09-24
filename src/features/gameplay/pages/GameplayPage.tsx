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
import { InvestigationGuide } from '../components/InvestigationGuide'
import { QueryResults } from '../components/QueryResults'
import { SqlBuilder } from '../components/SqlBuilder/SqlBuilder'
import { SuspectModal } from '../components/SuspectModal'

import {
  useScenarioDatabase,
} from '../hooks/useScenarioDatabase'

import {
  executeSelectQuery,
} from '../services/sqlEngine'

import {
  getInitialScenarioForCase,
} from '../services/scenarioService'

import type {
  SqlQueryResult,
} from '../types/query'

export function GameplayPage() {
  const {
    caseId,
  } = useParams<{
    caseId: string
  }>()

  const [
    queryResult,
    setQueryResult,
  ] = useState<SqlQueryResult | null>(
    null,
  )

  const [
    queryError,
    setQueryError,
  ] = useState<string | null>(
    null,
  )

  const [
    isSuspectModalOpen,
    setIsSuspectModalOpen,
  ] = useState(false)

  const [
    selectedCulpritId,
    setSelectedCulpritId,
  ] = useState<number | null>(null)

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

  const {
    database,
    isLoading: isDatabaseLoading,
    error: databaseError,
  } = useScenarioDatabase(
    scenario,
  )

  const suspectsTable =
    scenario.tables.find(
      (table) =>
        table.name === 'suspects',
    )

  const handleExecuteQuery = (
    query: string,
  ) => {
    setQueryError(null)
    setQueryResult(null)

    if (!database) {
      setQueryError(
        'O banco de dados ainda está sendo preparado.',
      )

      return
    }

    try {
      const result =
        executeSelectQuery(
          database,
          query,
        )

      setQueryResult(result)
    } catch (error: unknown) {
      setQueryError(
        error instanceof Error
          ? error.message
          : 'Não foi possível executar a consulta.',
      )
    }
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
          max-w-[1550px]
        "
      >
        <GameHeader
          caseNumber={
            gameCase.number
          }
          caseTitle={
            gameCase.title
          }
          onAnalyzeSuspects={() =>
            setIsSuspectModalOpen(
              true,
            )
          }
        />

        <section
          className="
            grid
            grid-cols-1
            gap-7

            xl:grid-cols-[245px_minmax(0,1fr)_300px]
          "
        >
          <DatabaseExplorer
            databaseName="bell_db"
            tables={scenario.tables}
            suggestedTable={
              gameCase.gameplay.guide
                .suggestedTable
            }
          />

          <div className="space-y-8">
            <SqlBuilder
              tables={scenario.tables}
              paletteConfig={
                gameCase.gameplay
                  .sqlPalette
              }
              disabled={
                isDatabaseLoading ||
                Boolean(databaseError)
              }
              onExecute={
                handleExecuteQuery
              }
            />

            <QueryResults
              result={queryResult}
              error={
                queryError ??
                databaseError
              }
              isDatabaseLoading={
                isDatabaseLoading
              }
            />
          </div>

          <div
            className="
              xl:sticky
              xl:top-6
            "
          >
            <InvestigationGuide
              config={
                gameCase.gameplay.guide
              }
            />
          </div>
        </section>
      </div>

      {isSuspectModalOpen &&
        suspectsTable && (
          <SuspectModal
            suspects={
              suspectsTable.rows
            }
            initialSelectedId={
              selectedCulpritId
            }
            onClose={() =>
              setIsSuspectModalOpen(
                false,
              )
            }
            onConfirm={
              setSelectedCulpritId
            }
          />
        )}
    </main>
  )
}