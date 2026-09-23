export type SqlDataType =
  | 'INTEGER'
  | 'TEXT'
  | 'REAL'

export type DatabaseValue =
  | string
  | number
  | null

export type DatabaseRow =
  Record<string, DatabaseValue>

export interface DatabaseColumn {
  name: string
  type: SqlDataType
}

export interface GameTable {
  name: string

  description: string

  columns: DatabaseColumn[]

  rows: DatabaseRow[]
}

export interface GameScenario {
  id: string

  caseId: string

  isDefault: boolean

  tables: GameTable[]
}