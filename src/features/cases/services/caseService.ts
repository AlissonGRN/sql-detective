import casesData from '../data/cases.json'

import type {
  GameCase,
} from '../types/case'

const cases =
  casesData as GameCase[]

export function getCases(): GameCase[] {
  return cases
}

export function getCaseById(
  caseId: string,
): GameCase | undefined {
  return cases.find(
    (gameCase) =>
      gameCase.id === caseId,
  )
}