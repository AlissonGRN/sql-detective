import {
  useEffect,
  useState,
} from 'react'

import type {
  Database,
} from 'sql.js'

import {
  createScenarioDatabase,
} from '../services/sqlEngine'

import type {
  GameScenario,
} from '../types/database'

export function useScenarioDatabase(
  scenario: GameScenario,
) {
  const [
    database,
    setDatabase,
  ] = useState<Database | null>(
    null,
  )

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  )

  useEffect(() => {
    let cancelled = false

    let currentDatabase:
      Database | null = null

    setDatabase(null)
    setIsLoading(true)
    setError(null)

    createScenarioDatabase(
      scenario,
    )
      .then((db) => {
        currentDatabase = db

        if (cancelled) {
          db.close()
          return
        }

        setDatabase(db)
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o banco.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true

      currentDatabase?.close()
    }
  }, [scenario])

  return {
    database,
    isLoading,
    error,
  }
}