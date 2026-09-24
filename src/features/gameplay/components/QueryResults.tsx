import type {
  SqlQueryResult,
} from '../types/query'

interface QueryResultsProps {
  result: SqlQueryResult | null

  error: string | null

  isDatabaseLoading: boolean
}

export function QueryResults({
  result,
  error,
  isDatabaseLoading,
}: QueryResultsProps) {
  return (
    <section
      className="
        relative
        min-h-[250px]
        bg-[#d9ccb0]
        p-6
        text-[#28241d]
        shadow-2xl

        before:absolute
        before:-top-5
        before:left-0
        before:h-6
        before:w-40
        before:rounded-t-md
        before:bg-[#c5a56e]
      "
    >
      <header
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >
        <div>
          <p
            className="
              mb-1
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-[#786d59]
            "
          >
            SAÍDA DO SISTEMA
          </p>

          <h2
            className="
              font-serif
              text-2xl
              font-bold
            "
          >
            Resultado
          </h2>
        </div>

        {result && !error && (
          <span
            className="
              font-mono
              text-[9px]
              text-[#786d59]
            "
          >
            {result.rows.length}{' '}
            registros
          </span>
        )}
      </header>

      {isDatabaseLoading && (
        <EmptyState>
          Preparando banco de dados...
        </EmptyState>
      )}

      {!isDatabaseLoading &&
        error && (
          <div
            className="
              border
              border-[#7b2020]
              bg-[#7b2020]/10
              p-4
            "
          >
            <p
              className="
                mb-1
                font-mono
                text-[9px]
                font-bold
                tracking-[0.15em]
                text-[#7b2020]
              "
            >
              ERRO NA CONSULTA
            </p>

            <p
              className="
                font-mono
                text-xs
                leading-5
              "
            >
              {error}
            </p>
          </div>
        )}

      {!isDatabaseLoading &&
        !error &&
        !result && (
          <EmptyState>
            Execute uma consulta para
            visualizar os resultados.
          </EmptyState>
        )}

      {!isDatabaseLoading &&
        !error &&
        result &&
        result.rows.length === 0 && (
          <EmptyState>
            A consulta foi executada,
            mas não encontrou registros.
          </EmptyState>
        )}

      {!isDatabaseLoading &&
        !error &&
        result &&
        result.rows.length > 0 && (
          <div
            className="
              overflow-x-auto
            "
          >
            <table
              className="
                min-w-full
                border-collapse
                font-mono
                text-xs
              "
            >
              <thead>
                <tr>
                  {result.columns.map(
                    (column) => (
                      <th
                        key={column}
                        className="
                          whitespace-nowrap
                          border
                          border-[#46423a]
                          bg-[#302e29]
                          px-4
                          py-3
                          text-left
                          text-[#eee5d2]
                        "
                      >
                        {column}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {result.rows.map(
                  (
                    row,
                    rowIndex,
                  ) => (
                    <tr
                      key={rowIndex}
                      className="
                        hover:bg-black/5
                      "
                    >
                      {row.map(
                        (
                          value,
                          columnIndex,
                        ) => (
                          <td
                            key={
                              columnIndex
                            }
                            className="
                              border
                              border-[#b3a78d]
                              px-4
                              py-3
                            "
                          >
                            {value ===
                              null
                              ? 'NULL'
                              : value}
                          </td>
                        ),
                      )}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
    </section>
  )
}

interface EmptyStateProps {
  children: React.ReactNode
}

function EmptyState({
  children,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        min-h-[150px]
        items-center
        justify-center
        border
        border-dashed
        border-[#aa9d84]
      "
    >
      <p
        className="
          font-mono
          text-xs
          text-[#8a7f6c]
        "
      >
        {children}
      </p>
    </div>
  )
}