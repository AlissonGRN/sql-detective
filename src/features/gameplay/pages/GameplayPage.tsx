import {
  useState,
} from 'react'

import {
  Navigate,
  useNavigate,
  useParams,
} from 'react-router'

import type {
  GameCase,
} from '../../cases/types/case'

import {
  getCaseById,
} from '../../cases/services/caseService'

import { AccusationResultModal } from '../components/AccusationResultModal'
import { DatabaseExplorer } from '../components/DatabaseExplorer'
import { GameHeader } from '../components/GameHeader'
import { InvestigationGuide } from '../components/InvestigationGuide'
import { QueryResults } from '../components/QueryResults'
import { SqlBuilder } from '../components/SqlBuilder/SqlBuilder'
import { SuspectModal } from '../components/SuspectModal'

import {
  useInvestigationProgress,
} from '../hooks/useInvestigationProgress'

import {
  useScenarioDatabase,
} from '../hooks/useScenarioDatabase'

import {
  executeSelectQuery,
} from '../services/sqlEngine'

import { evaluateInvestigationQuery } from '../services/investigationValidation'

import {
  getFriendlySqlError,
} from '../services/sqlErrorService'

import {
  getInitialScenarioForCase,
} from '../services/scenarioService'

import {
  getSolutionByScenarioId,
} from '../services/solutionService'

import type {
  GameScenario,
} from '../types/database'

import type {
  SqlQueryResult,
} from '../types/query'

interface AccusationResult {
  correct: boolean

  suspectName: string

  explanation?: string
}

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
    <GameplayContent
      gameCase={gameCase}
      scenario={scenario}
    />
  )
}

interface GameplayContentProps {
  gameCase: GameCase
  scenario: GameScenario
}

function GameplayContent({
  gameCase,
  scenario,
}: GameplayContentProps) {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [caseCompleted, setCaseCompleted] = useState(false)
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
  ] = useState<number | null>(
    null,
  )

  const [
    accusationResult,
    setAccusationResult,
  ] =
    useState<AccusationResult | null>(
      null,
    )

  const {
    database,
    isLoading:
    isDatabaseLoading,
    error: databaseError,
  } = useScenarioDatabase(
    scenario,
  )

  const tableNames = scenario.tables.map((table) => table.name)

  const {
    currentStep,
    currentStepIndex,

    registerSuccessfulQuery,
  } =
    useInvestigationProgress({
      scenarioId:
        scenario.id,

      guide:
        gameCase.gameplay.guide,

      tableNames,
    })

  const canAccuse = currentStep?.id === 'accusation'

  const suspectsTable =
    scenario.tables.find(
      (table) =>
        table.name ===
        'suspects',
    )

  const handleExecuteQuery = (
    query: string,
  ) => {
    setQueryError(null)
    setQueryResult(null)
    setFeedback(null)

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

      if (currentStep.id !== 'accusation') {
        const evaluation = evaluateInvestigationQuery(currentStep, query, result)
        setFeedback(evaluation.message)
        if (evaluation.success && evaluation.consultedTable) {
          registerSuccessfulQuery(evaluation.consultedTable)
        }
      }
    } catch (error: unknown) {
      setQueryError(
        getFriendlySqlError(
          error,
        ),
      )
    }
  }

  const handleAccuse = (
    suspectId: number,
  ) => {
    if (!canAccuse) return
    setSelectedCulpritId(
      suspectId,
    )

    const solution =
      getSolutionByScenarioId(
        scenario.id,
      )

    if (
      !solution ||
      !suspectsTable
    ) {
      return
    }

    const suspect =
      suspectsTable.rows.find(
        (row) =>
          Number(row.id) ===
          suspectId,
      )

    const suspectName =
      String(
        suspect?.name ??
        'Suspeito',
      )

    const correct =
      suspectId ===
      solution.culpritId

    if (correct) setCaseCompleted(true)

    setAccusationResult({
      correct,

      suspectName,

      explanation:
        correct
          ? solution.explanation
          : undefined,
    })
  }

  if (!currentStep) {
    return null
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
          canAccuse={canAccuse}
          completedSteps={currentStepIndex}
          totalSteps={Math.max(gameCase.gameplay.guide.steps.length - 1, 0)}
          onAnalyzeSuspects={() => {
            if (canAccuse) setIsSuspectModalOpen(true)
          }}
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
            tables={
              scenario.tables
            }
            suggestedTable={
              currentStep
                .suggestedTable
            }
          />

          <div className="space-y-8">
            <SqlBuilder
              tables={
                scenario.tables
              }
              paletteConfig={
                currentStep
                  .sqlPalette
              }
              disabled={
                isDatabaseLoading ||
                Boolean(
                  databaseError,
                )
              }
              onExecute={
                handleExecuteQuery
              }
            />

            {feedback && (
              <p role="status" className="border-l-2 border-[#b79762] bg-[#282824] px-4 py-3 font-mono text-xs text-[#e6dfcc]">{feedback}</p>
            )}

            <QueryResults
              result={
                queryResult
              }
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
                gameCase
                  .gameplay
                  .guide
              }
              currentStepIndex={
                currentStepIndex
              }
            />
          </div>
        </section>
      </div>

      {isSuspectModalOpen &&
        canAccuse &&
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
              handleAccuse
            }
          />
        )}

      {accusationResult && (
        <AccusationResultModal
          correct={
            accusationResult.correct
          }
          suspectName={
            accusationResult
              .suspectName
          }
          explanation={
            accusationResult
              .explanation
          }
          onClose={() => {
            setAccusationResult(null)
            if (caseCompleted) navigate('/cases')
          }}
        />
      )}
    </main>
  )
}