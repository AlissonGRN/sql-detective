export type QueryValue =
  | string
  | number
  | null

export interface SqlQueryResult {
  columns: string[]
  rows: QueryValue[][]
}