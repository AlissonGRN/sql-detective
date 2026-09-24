export type SqlBlockType =
  | 'keyword'
  | 'table'
  | 'column'
  | 'operator'
  | 'value'
  | 'symbol'

export interface SqlBlockDefinition {
  type: SqlBlockType
  label: string
  value: string
}

export interface SqlQueryBlock
  extends SqlBlockDefinition {
  instanceId: string
}