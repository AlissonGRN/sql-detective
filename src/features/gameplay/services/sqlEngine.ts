import initSqlJs, {
  type Database,
} from 'sql.js'

import type {
  DatabaseValue,
  GameScenario,
  GameTable,
} from '../types/database'

import type {
  QueryValue,
  SqlQueryResult,
} from '../types/query'

let sqlPromise:
  ReturnType<typeof initSqlJs> | null =
  null

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: () =>
        `${import.meta.env.BASE_URL}sql-wasm.wasm`,
    })
  }

  return sqlPromise
}

export async function createScenarioDatabase(
  scenario: GameScenario,
): Promise<Database> {
  const SQL = await getSql()

  const database =
    new SQL.Database()

  for (const table of scenario.tables) {
    createTable(
      database,
      table,
    )

    insertRows(
      database,
      table,
    )
  }

  return database
}

export function executeSelectQuery(
  database: Database,
  query: string,
): SqlQueryResult {
  const normalizedQuery =
    normalizeQuery(query)

  validateReadOnlyQuery(
    normalizedQuery,
  )

  const results =
    database.exec(
      normalizedQuery,
    )

  if (results.length === 0) {
    return {
      columns: [],
      rows: [],
    }
  }

  const result = results[0]

  return {
    columns: result.columns,

    rows: result.values.map(
      (row) =>
        row.map(
          normalizeResultValue,
        ),
    ),
  }
}

function createTable(
  database: Database,
  table: GameTable,
) {
  const tableName =
    quoteIdentifier(
      table.name,
    )

  const columns =
    table.columns
      .map((column) => {
        const name =
          quoteIdentifier(
            column.name,
          )

        return `${name} ${column.type}`
      })
      .join(', ')

  const query =
    `CREATE TABLE ${tableName} (${columns});`

  database.run(query)
}

function insertRows(
  database: Database,
  table: GameTable,
) {
  if (table.rows.length === 0) {
    return
  }

  const tableName =
    quoteIdentifier(
      table.name,
    )

  const columnNames =
    table.columns.map(
      (column) =>
        quoteIdentifier(
          column.name,
        ),
    )

  const placeholders =
    table.columns
      .map(() => '?')
      .join(', ')

  const query = `
    INSERT INTO ${tableName}
    (${columnNames.join(', ')})
    VALUES (${placeholders});
  `

  for (const row of table.rows) {
    const values:
      DatabaseValue[] =
      table.columns.map(
        (column) =>
          row[column.name] ??
          null,
      )

    database.run(
      query,
      values,
    )
  }
}

function normalizeQuery(
  query: string,
) {
  return query
    .trim()
    .replace(
      /;\s*$/,
      '',
    )
}

function validateReadOnlyQuery(
  query: string,
) {
  if (!query) {
    throw new Error(
      'A consulta está vazia.',
    )
  }

  if (
    !/^SELECT\b/i.test(query)
  ) {
    throw new Error(
      'Nesta investigação apenas consultas SELECT são permitidas.',
    )
  }

  if (query.includes(';')) {
    throw new Error(
      'Execute apenas uma consulta por vez.',
    )
  }
}

function quoteIdentifier(
  identifier: string,
) {
  const safeIdentifier =
    identifier.replace(
      /"/g,
      '""',
    )

  return `"${safeIdentifier}"`
}

function normalizeResultValue(
  value:
    | string
    | number
    | Uint8Array
    | null,
): QueryValue {
  if (value instanceof Uint8Array) {
    return '[BLOB]'
  }

  return value
}