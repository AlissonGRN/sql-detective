import {
  useEffect,
} from 'react'

import type {
  GameTable,
} from '../types/database'

interface TablePreviewModalProps {
  table: GameTable
  onClose: () => void
}

export function TablePreviewModal({
  table,
  onClose,
}: TablePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.body.style.overflow =
      'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/80
        p-5
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="
          flex
          max-h-[85vh]
          w-full
          max-w-5xl
          flex-col
          bg-[#d9ccb0]
          text-[#28241d]
          shadow-2xl
        "
      >
        {/* HEADER */}

        <header
          className="
            flex
            items-start
            justify-between
            gap-5
            border-b
            border-black/20
            px-6
            py-5
          "
        >
          <div>
            <p
              className="
                mb-1
                font-mono
                text-[9px]
                tracking-[0.2em]
                text-[#7b2020]
              "
            >
              TABELA
            </p>

            <h2
              id="table-title"
              className="
                font-serif
                text-3xl
                font-bold
              "
            >
              {table.name}
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                font-serif
                text-sm
                leading-5
                text-[#645a49]
              "
            >
              {table.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              font-mono
              text-sm
              text-[#746957]
              transition
              hover:text-[#7b2020]
            "
          >
            ✕
          </button>
        </header>

        {/* METADATA */}

        <div
          className="
            flex
            flex-wrap
            gap-4
            border-b
            border-black/15
            px-6
            py-3
            font-mono
            text-[10px]
            text-[#6f6554]
          "
        >
          <span>
            {table.columns.length} colunas
          </span>

          <span>
            {table.rows.length} registros
          </span>
        </div>

        {/* TABLE */}

        <div
          className="
            flex-1
            overflow-auto
            p-6
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
                {table.columns.map(
                  (column) => (
                    <th
                      key={column.name}
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
                      <div>
                        {column.name}
                      </div>

                      <div
                        className="
                          mt-1
                          text-[8px]
                          font-normal
                          text-neutral-500
                        "
                      >
                        {column.type}
                      </div>
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {table.rows.map(
                (row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="
                      transition
                      hover:bg-black/5
                    "
                  >
                    {table.columns.map(
                      (column) => (
                        <td
                          key={
                            column.name
                          }
                          className="
                            max-w-[350px]
                            border
                            border-[#b3a78d]
                            px-4
                            py-3
                            align-top
                          "
                        >
                          {formatDatabaseValue(
                            row[
                            column.name
                            ],
                          )}
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}

        <footer
          className="
            flex
            justify-end
            border-t
            border-black/20
            px-6
            py-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              border
              border-[#756a58]
              px-5
              py-3
              font-mono
              text-xs
              font-bold
              text-[#5e5547]
              transition
              hover:bg-black/5
            "
          >
            FECHAR
          </button>
        </footer>
      </section>
    </div>
  )
}

function formatDatabaseValue(
  value: string | number | null,
) {
  if (value === null) {
    return (
      <span className="text-neutral-500">
        NULL
      </span>
    )
  }

  return String(value)
}