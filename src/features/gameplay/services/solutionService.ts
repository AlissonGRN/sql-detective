import type {
  ScenarioSolution,
} from '../types/solution'

const solutionModules =
  import.meta.glob(
    '../data/solutions/*.json',
    {
      eager: true,
      import: 'default',
    },
  ) as Record<
    string,
    ScenarioSolution
  >

const solutions =
  Object.values(
    solutionModules,
  )

export function getSolutionByScenarioId(
  scenarioId: string,
) {
  return solutions.find(
    (solution) =>
      solution.scenarioId ===
      scenarioId,
  )
}