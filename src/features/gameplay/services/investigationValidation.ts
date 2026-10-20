import type { SqlQueryResult } from '../types/query'
import type { InvestigationStepConfig } from '../../../shared/types/gameplay'

export interface InvestigationFeedback {
  success: boolean
  message: string
  consultedTable: string | null
}

export function evaluateInvestigationQuery(
  step: InvestigationStepConfig,
  query: string,
  result: SqlQueryResult,
): InvestigationFeedback {
  const consultedTable =
    step.requiredTables.find((table) =>
      new RegExp(`\\b(?:FROM|JOIN)\\s+["\x60\\[]?${escapeRegExp(table)}\\b`, 'i').test(query),
    ) ?? null

  if (!consultedTable) {
    return {
      success: false,
      consultedTable: null,
      message: 'Consulta executada e mantida como exploração. Ela ainda não confirma o objetivo atual: confira a tabela sugerida pelo Inspetor ou continue investigando por outro caminho.',
    }
  }

  if (step.validation) {
    if (step.validation.requireWhere && !/\bWHERE\b/i.test(query)) {
      return {
        success: false,
        consultedTable,
        message: 'Você encontrou a tabela, mas ainda precisa filtrar os registros com WHERE.',
      }
    }

    const columnIndex = result.columns.findIndex(
      (column) => column.toLowerCase() === step.validation?.column.toLowerCase(),
    )

    if (columnIndex === -1) {
      return {
        success: false,
        consultedTable,
        message: `Inclua a coluna "${step.validation.column}" no SELECT para conferir os suspeitos encontrados.`,
      }
    }

    const actual = [...new Set(result.rows.map((row) => String(row[columnIndex])))].sort()
    const expected = [...new Set(step.validation.expectedValues.map(String))].sort()

    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      return {
        success: false,
        consultedTable,
        message: 'Consulta válida, mas os resultados ainda não correspondem ao objetivo. Revise o filtro e tente novamente.',
      }
    }
  } else if (result.rows.length === 0) {
    return {
      success: false,
      consultedTable,
      message: 'A consulta é válida, mas não retornou registros. Revise os filtros ou teste outra consulta; explorar faz parte da investigação.',
    }
  }

  return {
    success: true,
    consultedTable,
    message: 'Dados relevantes encontrados. O Inspetor atualizou a investigação.',
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^\x24{}()|[\]\\]/g, '\\$&')
}
