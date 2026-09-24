export interface InvestigationGuideConfig {
  npcName: string

  step: number
  totalSteps: number

  title: string
  message: string
  objective: string

  suggestedTable: string

  hints: string[]
}

export interface SqlPaletteConfig {
  keywords: string[]
  tables: string[]
  columns: string[]
  operators: string[]
  values: string[]
}

export interface GameplayConfig {
  guide: InvestigationGuideConfig
  sqlPalette: SqlPaletteConfig
}