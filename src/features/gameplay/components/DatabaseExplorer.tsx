import {
  useState,
} from 'react'

import { TablePreviewModal } from './TablePreviewModal'

import type {
  GameTable,
} from '../types/database'

interface DatabaseExplorerProps {
  databaseName: string
  tables: GameTable[]

  suggestedTable?: string
}

export function DatabaseExplorer({
  databaseName,
  tables,
  suggestedTable,
}: DatabaseExplorerProps) {
  const [
    selectedTable,
    setSelectedTable,
  ] = useState<GameTable | null>(null)

  const handleSelectTable = (
    table: GameTable,
  ) => {
    setSelectedTable(table)
  }

  const handleCloseTable = () => {
    setSelectedTable(null)
  }

  return (
    <>
      <aside
        className="
          bg-[#d9ccb0]
          p-5
          text-[#28241d]
          shadow-2xl
        "
      >
        <header
          className="
            mb-5
            border-b
            border-black/20
            pb-3
          "
        >
          <p
            className="
              mb-1
              font-mono
              text-[9px]
              tracking-[0.2em]
              text-[#766b59]
            "
          >
            {databaseName.toUpperCase()}
          </p>

          <h2
            className="
              font-serif
              text-xl
              font-bold
            "
          >
            Banco de dados
          </h2>

          <p
            className="
              mt-2
              font-mono
              text-[9px]
              text-[#817663]
            "
          >
            {tables.length} tabelas
          </p>
          <p className="mt-3 border-l-2 border-[#7b2020] pl-2 font-serif text-xs leading-4 text-[#51493d]">Clique em uma tabela para ver exemplos dos registros e descobrir quais informações ela guarda.</p>
        </header>

        <div
          className="
            max-h-[680px]
            space-y-2
            overflow-y-auto
            pr-1
          "
        >
          {tables.map((table) => {
            const isSuggested =
              table.name ===
              suggestedTable

            return (
              <button
                key={table.name}
                type="button"
                onClick={() =>
                  handleSelectTable(
                    table,
                  )
                }
                className={`
                  w-full
                  border
                  text-left
                  transition

                  hover:border-[#756955]

                  ${isSuggested
                    ? `
                          border-2
                          border-[#7b2020]
                        `
                    : `
                          border-[#aa9d84]
                        `
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    bg-[#302e29]
                    px-3
                    py-2
                  "
                >
                  <strong
                    className="
                      font-mono
                      text-xs
                      text-[#e8dfcc]
                    "
                  >
                    {table.name}
                  </strong>

                  {isSuggested ? (
                    <span
                      className="
                        font-mono
                        text-[7px]
                        font-bold
                        text-[#dca5a5]
                      "
                    >
                      SUGERIDA
                    </span>
                  ) : (
                    <span
                      className="
                        font-mono
                        text-[8px]
                        text-neutral-500
                      "
                    >
                      {table.rows.length} registros
                    </span>
                  )}
                </div>

                <div
                  className="
                    px-3
                    py-2
                  "
                >
                  <p
                    className="
                      truncate
                      font-mono
                      text-[8px]
                      text-[#665c4d]
                    "
                  >
                    {table.columns
                      .map(
                        (column) =>
                          column.name,
                      )
                      .join(' · ')}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {selectedTable && (
        <TablePreviewModal
          table={selectedTable}
          onClose={
            handleCloseTable
          }
        />
      )}
    </>
  )
}