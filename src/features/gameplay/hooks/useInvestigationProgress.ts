import { useCallback, useState } from 'react'
import type { InvestigationGuideConfig } from '../../../shared/types/gameplay'

export function useInvestigationProgress({
  guide,
}: {
  scenarioId: string
  guide: InvestigationGuideConfig
  tableNames: string[]
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [consultedTables, setConsultedTables] = useState<Set<string>>(new Set())

  const currentStep = guide.steps[currentStepIndex]

  const registerSuccessfulQuery = useCallback((tableName: string) => {
    const step = guide.steps[currentStepIndex]
    if (!step || !step.requiredTables.includes(tableName)) return false

    const updated = new Set(consultedTables)
    updated.add(tableName)
    setConsultedTables(updated)

    if (step.requiredTables.every((name) => updated.has(name))) {
      setCurrentStepIndex((index) => Math.min(index + 1, guide.steps.length - 1))
      setConsultedTables(new Set())
      return true
    }
    return false
  }, [guide.steps, currentStepIndex, consultedTables])

  return { currentStep, currentStepIndex, consultedTables, registerSuccessfulQuery }
}
