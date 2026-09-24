import { SqlBlock } from './SqlBlock'
import { SqlBlockPalette } from './SqlBlockPalette'

import { useSqlBuilder } from '../../hooks/useSqlBuilder'

import type {
  GameTable,
} from '../../types/database'

interface SqlBuilderProps {
  tables: GameTable[]

  onExecute: (
    query: string,
  ) => void
}

export function SqlBuilder({
  tables,
  onExecute,
}: SqlBuilderProps) {
  const {
    queryBlocks,
    query,

    addBlock,
    removeBlock,
    clearQuery,
  } = useSqlBuilder()

  const handleExecute = () => {
    if (!query) {
      return
    }

    onExecute(query)
  }

  return (
    <article
      className="
        relative
        bg-[#292824]
        p-6
        shadow-2xl

        before:absolute
        before:-top-5
        before:left-0
        before:h-6
        before:w-44
        before:rounded-t-md
        before:bg-[#292824]
      "
    >
      {/* HEADER */}

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
              text-[#837c6e]
            "
          >
            TERMINAL
          </p>

          <h2
            className="
              font-mono
              text-sm
              font-bold
            "
          >
            CONSULTA SQL
          </h2>
        </div>

        <span
          className="
            font-mono
            text-[9px]
            text-neutral-600
          "
        >
          SQL BUILDER
        </span>
      </header>

      {/* QUERY */}

      <section
        className="
          mb-6
          min-h-[130px]
          border-2
          border-dashed
          border-[#504c43]
          bg-[#181714]
          p-4
        "
      >
        {queryBlocks.length === 0 ? (
          <div
            className="
              flex
              min-h-[95px]
              items-center
              justify-center
            "
          >
            <p
              className="
                font-mono
                text-xs
                text-neutral-600
              "
            >
              Selecione os blocos para
              montar sua consulta...
            </p>
          </div>
        ) : (
          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {queryBlocks.map(
              (block) => (
                <SqlBlock
                  key={
                    block.instanceId
                  }
                  label={block.label}
                  type={block.type}
                  onClick={() =>
                    removeBlock(
                      block.instanceId,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </section>

      {/* SQL TEXT */}

      <div
        className="
          mb-6
          border-l-2
          border-[#7d2929]
          bg-black/10
          px-4
          py-3
        "
      >
        <p
          className="
            mb-1
            font-mono
            text-[8px]
            tracking-[0.18em]
            text-neutral-600
          "
        >
          SQL GERADO
        </p>

        <code
          className="
            break-all
            font-mono
            text-xs
            text-[#d5ccb9]
          "
        >
          {query || '-- consulta vazia'}
        </code>
      </div>

      {/* PALETA */}

      <SqlBlockPalette
        tables={tables}
        onAddBlock={addBlock}
      />

      {/* ACTIONS */}

      <footer
        className="
          mt-7
          flex
          justify-between
          gap-4
          border-t
          border-white/10
          pt-5
        "
      >
        <button
          type="button"
          onClick={clearQuery}
          disabled={
            queryBlocks.length === 0
          }
          className="
            border
            border-[#625c50]
            px-5
            py-3

            font-mono
            text-xs
            font-bold
            text-[#aaa18e]

            transition

            hover:bg-white/5

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          LIMPAR
        </button>

        <button
          type="button"
          onClick={handleExecute}
          disabled={!query}
          className="
            bg-[#7d2929]
            px-7
            py-3

            font-mono
            text-xs
            font-bold
            text-[#f1e8d6]

            transition

            hover:bg-[#963232]

            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          EXECUTAR CONSULTA →
        </button>
      </footer>
    </article>
  )
}