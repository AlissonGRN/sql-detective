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
}

export function DatabaseExplorer({
  databaseName,
  tables,
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
            {tables.length} tabelas disponíveis
          </p>
        </header>

        <div
          className="
            max-h-[650px]
            space-y-3
            overflow-y-auto
            pr-1
          "
        >
          {tables.map((table) => (
            <button
              key={table.name}
              type="button"
              onClick={() =>
                handleSelectTable(
                  table,
                )
              }
              className="
                group
                w-full
                border
                border-[#aa9d84]
                text-left
                transition
                hover:-translate-y-0.5
                hover:border-[#756955]
                hover:shadow-md
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  bg-[#302e29]
                  px-3
                  py-2
                  text-[#e8dfcc]
                "
              >
                <strong
                  className="
                    font-mono
                    text-xs
                  "
                >
                  {table.name}
                </strong>

                <span
                  className="
                    font-mono
                    text-[9px]
                    text-neutral-500
                  "
                >
                  {table.rows.length}
                </span>
              </div>

              <div
                className="
                  px-3
                  py-3
                "
              >
                <p
                  className="
                    mb-3
                    font-serif
                    text-[11px]
                    leading-4
                    text-[#665c4d]
                  "
                >
                  {table.description}
                </p>

                <div
                  className="
                    flex
                    flex-wrap
                    gap-1
                  "
                >
                  {table.columns.map(
                    (column) => (
                      <span
                        key={
                          column.name
                        }
                        className="
                          bg-black/5
                          px-2
                          py-1
                          font-mono
                          text-[8px]
                          text-[#665c4d]
                        "
                      >
                        {column.name}
                      </span>
                    ),
                  )}
                </div>

                <div
                  className="
                    mt-3
                    text-right
                    font-mono
                    text-[8px]
                    font-bold
                    text-[#7b2020]
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                >
                  VISUALIZAR →
                </div>
              </div>
            </button>
          ))}
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