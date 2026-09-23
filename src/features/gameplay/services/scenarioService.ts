import type {
  GameScenario,
} from '../types/database'

const scenarioModules =
  import.meta.glob(
    '../data/scenarios/*.json',
    {
      eager: true,
      import: 'default',
    },
  ) as Record<string, GameScenario>

const scenarios =
  Object.values(scenarioModules)

export function getScenariosByCaseId(
  caseId: string,
): GameScenario[] {
  return scenarios.filter(
    (scenario) =>
      scenario.caseId === caseId,
  )
}

export function getScenarioById(
  scenarioId: string,
): GameScenario | undefined {
  return scenarios.find(
    (scenario) =>
      scenario.id === scenarioId,
  )
}

export function getInitialScenarioForCase(
  caseId: string,
): GameScenario | undefined {
  const caseScenarios =
    getScenariosByCaseId(caseId)

  return (
    caseScenarios.find(
      (scenario) =>
        scenario.isDefault,
    ) ?? caseScenarios[0]
  )
}