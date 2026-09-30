export interface SqlPaletteConfig {
  keywords: string[]
  tables: string[]
  columns: string[]
  operators: string[]
  values: string[]
}

export interface InvestigationStepConfig {
  id: string

  title: string
  message: string
  objective: string

  suggestedTable?: string

  requiredTables: string[]

  hints: string[]

  sqlPalette: SqlPaletteConfig
}

export interface InvestigationGuideConfig {
  npcName: string

  steps: InvestigationStepConfig[]
}

export interface GameplayConfig {
  guide: InvestigationGuideConfig
}