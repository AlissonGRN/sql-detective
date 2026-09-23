export type CaseDifficulty =
  | 'Iniciante'
  | 'Básico'
  | 'Intermediário'
  | 'Avançado'

export interface CaseBriefing {
  npcName: string
  npcRole: string

  location: string
  crime: string
  time: string

  speech: string
  mission: string
}

export interface GameCase {
  id: string
  number: string
  title: string

  difficulty: CaseDifficulty

  description: string

  concepts: string[]

  available: boolean

  briefing: CaseBriefing
}