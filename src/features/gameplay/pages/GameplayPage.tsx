import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'

import type { GameCase } from '../../cases/types/case'
import { getCaseById } from '../../cases/services/caseService'
import { AccusationResultModal } from '../components/AccusationResultModal'
import { DatabaseExplorer } from '../components/DatabaseExplorer'
import { GameHeader } from '../components/GameHeader'
import { GameplayTutorial } from '../components/GameplayTutorial'
import { QueryResults } from '../components/QueryResults'
import { SqlBuilder } from '../components/SqlBuilder/SqlBuilder'
import { SuspectModal } from '../components/SuspectModal'
import { useInvestigationProgress } from '../hooks/useInvestigationProgress'
import { useScenarioDatabase } from '../hooks/useScenarioDatabase'
import { executeSelectQuery } from '../services/sqlEngine'
import { evaluateInvestigationQuery } from '../services/investigationValidation'
import { getFriendlySqlError } from '../services/sqlErrorService'
import { getInitialScenarioForCase } from '../services/scenarioService'
import { getSolutionByScenarioId } from '../services/solutionService'

import type { GameScenario } from '../types/database'
import type { SqlQueryResult } from '../types/query'

interface AccusationResult {
  correct: boolean
  suspectName: string
  explanation?: string
  evidence?: string[]
}

const tutorialStorageKey = 'sql-detective-learning-guide-v2'

export function GameplayPage() {
  const { caseId } = useParams<{ caseId: string }>()
  if (!caseId) return <Navigate to="/cases" replace />

  const gameCase = getCaseById(caseId)
  const scenario = getInitialScenarioForCase(caseId)
  if (!gameCase || !scenario) return <Navigate to="/cases" replace />

  return <GameplayContent gameCase={gameCase} scenario={scenario} />
}

interface GameplayContentProps {
  gameCase: GameCase
  scenario: GameScenario
}

function GameplayContent({ gameCase, scenario }: GameplayContentProps) {
  const navigate = useNavigate()
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      return localStorage.getItem(tutorialStorageKey) !== 'yes'
    } catch {
      return true
    }
  })
  const [showDatabase, setShowDatabase] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [caseCompleted, setCaseCompleted] = useState(false)
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)
  const [isSuspectModalOpen, setIsSuspectModalOpen] = useState(false)
  const [selectedCulpritId, setSelectedCulpritId] = useState<number | null>(null)
  const [accusationResult, setAccusationResult] = useState<AccusationResult | null>(null)

  const { database, isLoading: isDatabaseLoading, error: databaseError } = useScenarioDatabase(scenario)
  const { currentStep, currentStepIndex, registerSuccessfulQuery } = useInvestigationProgress({
    scenarioId: scenario.id,
    guide: gameCase.gameplay.guide,
    tableNames: scenario.tables.map(table => table.name),
  })

  const canAccuse = currentStep?.id === 'accusation'
  const suspectsTable = scenario.tables.find(table => table.name === 'suspects')

  const closeTutorial = () => {
    setShowTutorial(false)
    try {
      localStorage.setItem(tutorialStorageKey, 'yes')
    } catch {
      // O guia continua acessível durante esta sessão.
    }
  }

  const handleExecuteQuery = (query: string) => {
    setQueryError(null)
    setQueryResult(null)
    setFeedback(null)

    if (!database) {
      setQueryError('O banco de dados ainda está sendo preparado.')
      return
    }
    if (!currentStep || canAccuse) return

    try {
      const result = executeSelectQuery(database, query)
      setQueryResult(result)
      const evaluation = evaluateInvestigationQuery(currentStep, query, result)
      setFeedback(evaluation.message)
      if (evaluation.success && evaluation.consultedTables.length > 0) {
        registerSuccessfulQuery(evaluation.consultedTables)
      }
    } catch (error: unknown) {
      setQueryError(getFriendlySqlError(error))
    }
  }

  const handleAccuse = (suspectId: number) => {
    if (!canAccuse) return
    setSelectedCulpritId(suspectId)

    const solution = getSolutionByScenarioId(scenario.id)
    if (!solution || !suspectsTable) return

    const suspect = suspectsTable.rows.find(row => Number(row.id) === suspectId)
    const suspectName = String(suspect?.name ?? 'Suspeito')
    const correct = suspectId === solution.culpritId
    if (correct) setCaseCompleted(true)

    setAccusationResult({
      correct,
      suspectName,
      explanation: correct ? solution.explanation : undefined,
      evidence: correct ? solution.evidence : undefined,
    })
  }

  if (!currentStep) return null

  const totalQuerySteps = Math.max(gameCase.gameplay.guide.steps.length - 1, 1)
  const progress = Math.min(100, Math.round((currentStepIndex / totalQuerySteps) * 100))

  return (
    <main className="min-h-screen bg-[#151512] px-4 py-5 text-[#e6dfcc] sm:px-6 md:px-8">
      <div className="mx-auto max-w-5xl">
        <GameHeader
          caseNumber={gameCase.number}
          caseTitle={gameCase.title}
          canAccuse={canAccuse}
          completedSteps={currentStepIndex}
          totalSteps={totalQuerySteps}
          onAnalyzeSuspects={() => setIsSuspectModalOpen(true)}
          onOpenHelp={() => setShowTutorial(true)}
        />

        <section className="mb-5 border-l-4 border-[#c5a56e] bg-[#292824] px-4 py-5 sm:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#c5a56e]">
              {canAccuse ? 'INVESTIGAÇÃO CONCLUÍDA' : 'MISSÃO ATUAL'}
            </span>
            <span className="font-mono text-[10px] text-[#bdb19e]">
              {canAccuse ? 'Etapas concluídas' : `Etapa ${currentStepIndex + 1} de ${totalQuerySteps}`}
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#504c43]" role="progressbar" aria-label="Progresso da investigação" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full bg-[#8ca47d] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <h2 className="mb-2 font-serif text-xl font-bold text-[#e6dfcc] sm:text-2xl">{currentStep.title}</h2>
          <p className="max-w-3xl text-sm leading-6 text-[#d9ccb0]">{currentStep.objective}</p>
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="mb-1 font-mono text-[9px] font-bold tracking-widest text-[#c5a56e]">{currentStep.concept}</p>
            <p className="text-xs leading-5 text-[#bdb19e]">{currentStep.explanation}</p>
          </div>
          {currentStep.suggestedTable && !canAccuse && (
            <p className="mt-3 text-xs text-[#bdb19e]">
              Comece pela tabela <strong className="font-mono text-[#c5a56e]">{currentStep.suggestedTable}</strong>.
            </p>
          )}
        </section>

        {!canAccuse && (
          <div className="mb-5 overflow-hidden border border-[#625c50] bg-[#292824]">
            <button
              type="button"
              aria-expanded={showDatabase}
              aria-controls="database-explorer-panel"
              onClick={() => setShowDatabase(open => !open)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <span>
                <span className="block font-mono text-xs font-bold text-[#e6dfcc]">Explorar banco de dados</span>
                <span className="mt-1 block text-xs text-[#bdb19e]">
                  {scenario.tables.length} tabelas · abra uma tabela para consultar suas colunas e registros
                </span>
              </span>
              <span className="font-mono text-xs text-[#c5a56e]">{showDatabase ? 'FECHAR −' : 'ABRIR +'}</span>
            </button>
            {showDatabase && (
              <div id="database-explorer-panel" className="border-t border-white/10 p-3 sm:p-4">
                <DatabaseExplorer databaseName="Banco da investigação" tables={scenario.tables} suggestedTable={currentStep.suggestedTable} />
              </div>
            )}
          </div>
        )}

        {!canAccuse && (
          <SqlBuilder
            key={currentStep.id}
            tables={scenario.tables}
            paletteConfig={currentStep.sqlPalette}
            disabled={isDatabaseLoading || Boolean(databaseError)}
            onExecute={handleExecuteQuery}
          />
        )}

        {feedback && (
          <div role="status" className="mt-4 border-l-2 border-[#8ca47d] bg-[#292824] px-4 py-3">
            <p className="mb-1 font-mono text-[9px] font-bold tracking-widest text-[#c5a56e]">FEEDBACK DA ETAPA</p>
            <p className="text-sm leading-5 text-[#e6dfcc]">{feedback}</p>
          </div>
        )}

        {(queryResult || queryError || databaseError || isDatabaseLoading || canAccuse) && (
          <div className="mt-5">
            {canAccuse && (
              <p className="mb-3 border border-[#625c50] bg-[#292824] px-4 py-3 text-sm leading-6 text-[#d9ccb0]">
                Você concluiu as consultas desta investigação. Revise as evidências e use <strong className="text-[#c5a56e]">Analisar suspeitos</strong> para apresentar sua conclusão.
              </p>
            )}
            <QueryResults result={queryResult} error={queryError ?? databaseError} isDatabaseLoading={isDatabaseLoading} />
          </div>
        )}
      </div>

      {showTutorial && <GameplayTutorial onClose={closeTutorial} />}

      {isSuspectModalOpen && canAccuse && suspectsTable && (
        <SuspectModal
          suspects={suspectsTable.rows}
          initialSelectedId={selectedCulpritId}
          onClose={() => setIsSuspectModalOpen(false)}
          onConfirm={handleAccuse}
        />
      )}

      {accusationResult && (
        <AccusationResultModal
          correct={accusationResult.correct}
          suspectName={accusationResult.suspectName}
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
