import type { SqlQueryResult } from '../types/query'
import type { InvestigationStepConfig } from '../../../shared/types/gameplay'

export interface InvestigationFeedback {
  success: boolean
  message: string
  consultedTables: string[]
}

export function evaluateInvestigationQuery(step: InvestigationStepConfig, query: string, result: SqlQueryResult): InvestigationFeedback {
  const normalized = query.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim()
  const normalizedForConditions = normalizeConditionSpacing(normalized)
  const tableMatches = [...normalized.matchAll(/\b(?:FROM|JOIN)\s+([a-zA-Z_]\w*)/gi)]
  const tableNames = tableMatches.map(match => match[1].toLowerCase())
  const consultedTables = step.requiredTables.filter(table => tableNames.includes(table.toLowerCase()))
  const missingTables = step.requiredTables.filter(table => !tableNames.includes(table.toLowerCase()))

  if (missingTables.length > 0) {
    return { success: false, consultedTables, message: `Inclua também a tabela ${missingTables.join(' e ')} para completar esta etapa.` }
  }

  const validation = step.validation
  if (validation) {
    for (const keyword of validation.requiredKeywords ?? []) {
      const pattern = new RegExp('\\b' + escapeRegExp(keyword) + '\\b', 'i')
      if (!pattern.test(normalized)) {
        return { success: false, consultedTables, message: `Use o bloco ${keyword.toUpperCase()} para praticar o conceito desta etapa.` }
      }
    }

    if (validation.requireWhere && !/\bWHERE\b/i.test(normalized)) {
      return { success: false, consultedTables, message: 'Esta etapa precisa de um filtro. Adicione o bloco WHERE e informe a condição.' }
    }

    if (validation.requiredConditions?.length) {
      const missingConditions = validation.requiredConditions.filter(condition => {
        return !normalizedForConditions.includes(normalizeConditionSpacing(condition))
      })
      if (missingConditions.length > 0) {
        return { success: false, consultedTables, message: 'Confira o campo, o operador e o valor usados no filtro ou no relacionamento desta etapa.' }
      }
    }

    if (validation.requiredSelectItems?.length) {
      const selectClause = normalized.match(/\bSELECT\b([\s\S]*?)\bFROM\b/i)?.[1] ?? ''
      const selectedItems = selectClause.split(',').map(item => item.trim().toLowerCase())
      const missingItems = validation.requiredSelectItems.filter(item => !selectedItems.includes(item.toLowerCase()))
      if (missingItems.length > 0) {
        return { success: false, consultedTables, message: `No SELECT, inclua também: ${missingItems.join(', ')}.` }
      }
    }

    if (validation.expectedColumns?.length) {
      const actualColumns = result.columns.map(column => column.toLowerCase().split('.').pop() ?? column.toLowerCase())
      const missingColumns = validation.expectedColumns.filter(column => !actualColumns.includes(column.toLowerCase()))
      if (missingColumns.length > 0) {
        return { success: false, consultedTables, message: `O resultado precisa mostrar as colunas ${missingColumns.join(' e ')}. Confira os blocos selecionados.` }
      }
    }

    if (validation.expectedRowCount !== undefined && result.rows.length !== validation.expectedRowCount) {
      return { success: false, consultedTables, message: `A consulta retornou ${result.rows.length} registro(s). Revise os blocos e os filtros desta etapa.` }
    }

    if (validation.column && validation.expectedValues) {
      const expectedColumn = validation.column.toLowerCase()
      const columnIndex = result.columns.findIndex(column => {
        const normalizedColumn = column.toLowerCase().split('.').pop() ?? column.toLowerCase()
        return normalizedColumn === expectedColumn
      })

      if (columnIndex === -1) {
        return { success: false, consultedTables, message: `O resultado precisa mostrar a coluna ${validation.column}. Inclua-a no SELECT ou use *.` }
      }

      const actual = [...new Set(result.rows.map(row => String(row[columnIndex])))].sort()
      const expected = [...new Set(validation.expectedValues.map(String))].sort()
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        return { success: false, consultedTables, message: 'O resultado ainda não corresponde à missão. Confira os valores retornados e ajuste a consulta.' }
      }
    } else if (result.rows.length === 0) {
      return { success: false, consultedTables, message: 'A consulta não encontrou registros. Confira os valores e os filtros utilizados.' }
    }
  } else if (result.rows.length === 0) {
    return { success: false, consultedTables, message: 'A consulta não encontrou registros. Confira os valores e os filtros utilizados.' }
  }

  return {
    success: true,
    consultedTables,
    message: 'Consulta correta para esta etapa. Observe os registros encontrados: eles são pistas para a investigação.',
  }
}

function normalizeConditionSpacing(value: string) {
  return value
    .toLowerCase()
    .replace(/\s*(>=|<=|<>|!=|=|>|<)\s*/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value: string) {
  const special = '.+*?^$()[]{}|\\'
  return [...value].map(character => special.includes(character) ? '\\' + character : character).join('')
}
