export function getFriendlySqlError(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return 'Não foi possível executar a consulta.'
  }

  const message =
    error.message

  const missingTable =
    message.match(
      /no such table:\s*(.+)/i,
    )

  if (missingTable) {
    return `A tabela "${missingTable[1]}" não existe. Verifique as tabelas disponíveis no banco de dados.`
  }

  const missingColumn =
    message.match(
      /no such column:\s*(.+)/i,
    )

  if (missingColumn) {
    return `A coluna "${missingColumn[1]}" não existe. Confira os nomes das colunas no explorador do banco.`
  }

  const ambiguousColumn =
    message.match(
      /ambiguous column name:\s*(.+)/i,
    )

  if (ambiguousColumn) {
    return `A coluna "${ambiguousColumn[1]}" existe em mais de uma tabela. Informe também o nome da tabela.`
  }

  if (
    /syntax error/i.test(message)
  ) {
    return 'Há um erro de sintaxe na consulta. Verifique a ordem e a combinação dos blocos SQL.'
  }

  if (
    /only consultas SELECT/i.test(
      message,
    )
  ) {
    return message
  }

  return message
}