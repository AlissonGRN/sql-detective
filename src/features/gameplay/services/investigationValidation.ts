import type { SqlQueryResult } from '../types/query'
import type { InvestigationStepConfig } from '../../../shared/types/gameplay'

export interface InvestigationFeedback {
  success: boolean
  message: string
  consultedTables: string[]
}

export function evaluateInvestigationQuery(step: InvestigationStepConfig, query: string, result: SqlQueryResult): InvestigationFeedback {
  const normalized = query.replace(/[\n\r]+/g, ' ')
  const tableMatches = [...normalized.matchAll(/\b(?:FROM|JOIN)\s+([a-zA-Z_]\w*)/gi)]
  const tableNames = tableMatches.map((match) => match[1].toLowerCase())
  const consultedTables = step.requiredTables.filter((table) => tableNames.includes(table.toLowerCase()))

  if (consultedTables.length === 0) {
    return { success: false, consultedTables: [], message: 'Consulta executada como exploração. Ela ainda não confirma o objetivo atual. Compare as tabelas disponíveis com a pergunta do Inspetor e tente outro caminho.' }
  }

  if (step.validation) {
    if (step.validation.requireWhere && !/\bWHERE\b/i.test(normalized)) {
      return { success: false, consultedTables, message: 'A consulta é válida, mas ainda está ampla demais para este objetivo. Experimente filtrar os registros com WHERE.' }
    }
    const expectedColumn = step.validation.column.toLowerCase()
    const aliasPattern = new RegExp('(?:[a-zA-Z_]\\w*\\.)?' + escapeRegExp(expectedColumn) + '\\s+AS\\s+([a-zA-Z_]\\w*)', 'i')
    const alias = normalized.match(aliasPattern)?.[1]?.toLowerCase()
    const outputColumn = alias ?? expectedColumn
    const columnIndex = result.columns.findIndex((column) => (column.toLowerCase().split('.').pop() ?? column.toLowerCase()) === outputColumn)
    if (columnIndex === -1) {
      return { success: false, consultedTables, message: 'A consulta ainda não mostra a coluna necessária para conferir o resultado. Inclua "' + step.validation.column + '" no SELECT ou use um alias claro.' }
    }
    const actual = [...new Set(result.rows.map((row) => String(row[columnIndex])))].sort()
    const expected = [...new Set(step.validation.expectedValues.map(String))].sort()
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      return { success: false, consultedTables, message: 'A consulta foi executada, mas o resultado ainda não corresponde ao objetivo. Confira os valores retornados e ajuste os filtros; você pode usar JOIN ou outra consulta equivalente.' }
    }
  } else if (result.rows.length === 0) {
    return { success: false, consultedTables, message: 'Consulta válida, mas sem registros. Revise os filtros ou experimente outra tabela; essa tentativa não encerra a investigação.' }
  }

  return { success: true, consultedTables, message: 'Resultado relevante encontrado. A investigação foi atualizada; continue conectando os registros e depoimentos.' }
}

function escapeRegExp(value: string) {
  const special = '.+*?^$()[]{}|\\'
  return [...value].map((character) => special.includes(character) ? '\\' + character : character).join('')
}
