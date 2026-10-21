import { useState } from 'react'
import type { DragEvent } from 'react'
import { SqlBlock } from './SqlBlock'
import { SqlBlockPalette } from './SqlBlockPalette'

import { useSqlBuilder } from '../../hooks/useSqlBuilder'

import type {
  GameTable,
} from '../../types/database'

import type {
  SqlPaletteConfig,
} from '../../../../shared/types/gameplay'

interface SqlBuilderProps {
  tables: GameTable[]

  paletteConfig: SqlPaletteConfig

  disabled?: boolean

  onExecute: (
    query: string,
  ) => void
}

export function SqlBuilder({
  tables,
  paletteConfig,
  disabled = false,
  onExecute,
}: SqlBuilderProps) {
  const {
    queryBlocks,
    query,

    addBlock,
    addBlockAt,
    moveBlock,
    removeBlock,
    clearQuery,
  } = useSqlBuilder()

  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const handleDrop = (event: DragEvent<HTMLElement>, targetIndex = queryBlocks.length) => {
    event.preventDefault()
    event.stopPropagation()
    setDropIndex(null)
    const existingId = event.dataTransfer.getData('application/x-sql-block-instance')
    if (existingId) {
      moveBlock(existingId, targetIndex)
      return
    }
    const rawBlock = event.dataTransfer.getData('application/x-sql-block')
    if (!rawBlock) return
    try {
      const droppedBlock = JSON.parse(rawBlock) as { type: 'keyword' | 'table' | 'column' | 'operator' | 'value' | 'symbol'; label: string; value: string }
      if (droppedBlock.type && droppedBlock.label && droppedBlock.value) addBlockAt(droppedBlock, targetIndex)
    } catch {
      // Ignore data that is not a SQL block.
    }
  }

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

      <details className="mb-4 border-l-2 border-[#c5a56e] bg-[#181714] px-4 py-3 text-xs leading-5 text-[#d9ccb0]">
        <summary className="cursor-pointer font-mono text-[10px] font-bold text-[#c5a56e]">COMO USAR OS BLOCOS SQL <span className="ml-2 text-[#837c6e]">ABRIR</span></summary>
        <p className="mt-3">Arraste os blocos da paleta para a área de montagem ou clique neles para adicioná-los. Arraste os blocos montados para reorganizar a consulta e clique em um bloco para removê-lo. Depois, selecione “Executar consulta” para analisar os resultados.</p>
      </details>

      {/* QUERY */}

      <section
        onDragOver={(event) => { event.preventDefault(); setDropIndex(queryBlocks.length) }}
        onDragLeave={() => setDropIndex(null)}
        onDrop={(event) => handleDrop(event)}
        className="
          mb-5
          min-h-[115px]
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
              min-h-[80px]
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
              Arraste blocos SQL para cá ou clique nos blocos da paleta abaixo.
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
                  key={block.instanceId}
                  label={block.label}
                  type={block.type}
                  draggable
                  onClick={() => removeBlock(block.instanceId)}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('application/x-sql-block-instance', block.instanceId)
                  }}
                  onDragOver={(event) => { event.preventDefault(); setDropIndex(queryBlocks.findIndex((item) => item.instanceId === block.instanceId)) }}
                  onDrop={(event) => handleDrop(event, queryBlocks.findIndex((item) => item.instanceId === block.instanceId))}
                  isDropTarget={dropIndex === queryBlocks.findIndex((item) => item.instanceId === block.instanceId)}
                />
              ),
            )}
          </div>
        )}
      </section>

      {/* SQL GERADO */}

      <div
        className="
          mb-5
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

      <SqlBlockPalette
        tables={tables}
        config={paletteConfig}
        onAddBlock={addBlock}
      />

      <footer
        className="
          mt-6
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
          disabled={!query || disabled}
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
          2 · EXECUTAR CONSULTA →
        </button>
      </footer>

      <p className="mt-3 text-right text-[11px] leading-5 text-[#bdb19e]">Após executar, a tela irá até os resultados exibidos abaixo deste editor.</p>
    </article>
  )
}