import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type {
  InvestigationGuideConfig,
} from '../../../shared/types/gameplay'

interface UseInvestigationProgressParams {
  scenarioId: string

  guide: InvestigationGuideConfig

  tableNames: string[]
}

export function useInvestigationProgress({
  scenarioId,
  guide,
  tableNames,
}: UseInvestigationProgressParams) {
  const [
    queriedTables,
    setQueriedTables,
  ] = useState<Set<string>>(
    new Set(),
  )

  useEffect(() => {
    setQueriedTables(
      new Set(),
    )
  }, [scenarioId])

  const registerSuccessfulQuery =
    useCallback(
      (query: string) => {
        const referencedTables =
          getReferencedTables(
            query,
            tableNames,
          )

        if (
          referencedTables.length ===
          0
        ) {
          return
        }

        setQueriedTables(
          (current) => {
            const next =
              new Set(current)

            referencedTables.forEach(
              (table) =>
                next.add(table),
            )

            return next
          },
        )
      },
      [tableNames],
    )

  const currentStepIndex =
    useMemo(() => {
      const steps =
        guide.steps

      if (steps.length === 0) {
        return 0
      }

      for (
        let index = 0;
        index <
        steps.length - 1;
        index++
      ) {
        const step =
          steps[index]

        const completed =
          step.requiredTables.every(
            (table) =>
              queriedTables.has(
                table,
              ),
          )

        if (!completed) {
          return index
        }
      }

      return steps.length - 1
    }, [
      guide.steps,
      queriedTables,
    ])

  const currentStep =
    guide.steps[
    currentStepIndex
    ]

  return {
    queriedTables,

    currentStep,
    currentStepIndex,

    registerSuccessfulQuery,
  }
}

function getReferencedTables(
  query: string,
  tableNames: string[],
) {
  return tableNames.filter(
    (tableName) => {
      const escapedName =
        escapeRegExp(
          tableName,
        )

      const pattern =
        new RegExp(
          `\\b${escapedName}\\b`,
          'i',
        )

      return pattern.test(query)
    },
  )
}

function escapeRegExp(
  value: string,
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )
}