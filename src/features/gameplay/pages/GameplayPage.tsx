import {
  useEffect,
  useRef,
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
import { GameplayTutorial } from '../components/GameplayTutorial'
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
  evidence?: string[]
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
  const [showTutorial, setShowTutorial] = useState(() => {
    try { return localStorage.getItem('sql-detective-tutorial-completed') !== 'yes' } catch { return true }
  })
  const closeTutorial = () => {
    setShowTutorial(false)
    try { localStorage.setItem('sql-detective-tutorial-completed', 'yes') } catch { /* storage may be unavailable */ }
  }
  const [feedback, setFeedback] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const [showDatabase, setShowDatabase] = useState(false)
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

  useEffect(() => {
    if (queryResult || queryError) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [queryResult, queryError])

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
    consultedTables,

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
        if (evaluation.success && evaluation.consultedTables.length > 0) {
          registerSuccessfulQuery(evaluation.consultedTables)
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

      explanation: correct ? solution.explanation : undefined,
      evidence: correct ? solution.evidence : undefined,
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

        <section className="mb-6 border-l-4 border-[#c5a56e] bg-[#292824] px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold tracking-widest text-[#c5a56e]">SUA MISSÃO · ETAPA {currentStepIndex + 1}</span>
                <span className="border border-[#504c43] px-2 py-1 font-mono text-[9px] text-[#bdb19e]">{currentStepIndex + 1} de {gameCase.gameplay.guide.steps.length}</span>
              </div>
              <h2 className="mb-2 font-serif text-xl font-bold text-[#e6dfcc]">{currentStep.title}</h2>
              <p className="max-w-3xl text-sm leading-6 text-[#d9ccb0]">{currentStep.objective}</p>
              {currentStep.suggestedTable && <p className="mt-3 text-xs text-[#bdb19e]">Ponto de partida sugerido: <strong className="font-mono text-[#c5a56e]">{currentStep.suggestedTable}</strong></p>}
            </div>
            <button type="button" onClick={() => setShowTutorial(true)} className="shrink-0 self-start border border-[#625c50] px-4 py-2 font-mono text-xs text-[#e6dfcc] transition hover:bg-white/5">? Como jogar</button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs text-[#bdb19e]">
            <span className="font-mono text-[#c5a56e]">PRÓXIMOS PASSOS</span><span>1. Explore os dados</span><span aria-hidden="true">→</span><span>2. Monte a consulta</span><span aria-hidden="true">→</span><span>3. Analise o resultado</span>
          </div>
        </section>

        <div className="mb-10">
          <button type="button" aria-expanded={showDatabase} aria-controls="database-explorer-panel" onClick={() => setShowDatabase((open) => !open)} className="flex w-full items-center justify-between gap-3 border border-[#625c50] bg-[#292824] px-4 py-3 text-left transition hover:border-[#c5a56e]">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#40392c] text-[#c5a56e]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg></span>
              <span><span className="block font-mono text-xs font-bold text-[#e6dfcc]">Explorar banco de dados</span><span className="mt-1 block text-xs text-[#bdb19e]">{scenario.tables.length} tabelas disponíveis{currentStep.suggestedTable ? ` · sugestão: ${currentStep.suggestedTable}` : ''}</span></span>
            </span>
            <span className="font-mono text-xs text-[#c5a56e]">{showDatabase ? 'FECHAR −' : 'ABRIR +'}</span>
          </button>
          {showDatabase && <div id="database-explorer-panel" className="mt-2 max-w-3xl"><DatabaseExplorer databaseName="bell_db" tables={scenario.tables} suggestedTable={currentStep.suggestedTable} /></div>}
        </div>

        <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-5">
            <SqlBuilder tables={scenario.tables} paletteConfig={currentStep.sqlPalette} disabled={isDatabaseLoading || Boolean(databaseError)} onExecute={handleExecuteQuery} />
            {feedback && <div role="status" className="border-l-2 border-[#b79762] bg-[#282824] px-4 py-3"><p className="mb-1 font-mono text-[9px] font-bold tracking-widest text-[#c5a56e]">ANÁLISE DA CONSULTA</p><p className="text-sm leading-5 text-[#e6dfcc]">{feedback}</p></div>}
            <div ref={resultsRef} className="scroll-mt-6" aria-live="polite">
              <QueryResults result={queryResult} error={queryError ?? databaseError} isDatabaseLoading={isDatabaseLoading} />
            </div>
          </div>
          <div className="xl:sticky xl:top-5"><InvestigationGuide config={gameCase.gameplay.guide} currentStepIndex={currentStepIndex} consultedTables={consultedTables} /></div>
        </section>
      </div>

      {showTutorial && <GameplayTutorial onClose={closeTutorial} />}

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
          explanation={accusationResult.explanation}
          evidence={accusationResult.evidence}
          onClose={() => {
            setAccusationResult(null)
            if (caseCompleted) navigate('/cases')
          }}
        />
      )}
    </main>
  )
}