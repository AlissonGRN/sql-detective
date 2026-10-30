import { useState } from 'react'
import type { DragEvent } from 'react'
import { SqlBlock } from './SqlBlock'
import { SqlBlockPalette } from './SqlBlockPalette'
import { useSqlBuilder } from '../../hooks/useSqlBuilder'
import type { GameTable } from '../../types/database'
import type { SqlPaletteConfig } from '../../../../shared/types/gameplay'

interface SqlBuilderProps {
  tables: GameTable[]
  paletteConfig: SqlPaletteConfig
  disabled?: boolean
  onExecute: (query: string) => void
}

export function SqlBuilder({ tables, paletteConfig, disabled = false, onExecute }: SqlBuilderProps) {
  const { queryBlocks, query, addBlockAt, moveBlock, removeBlock, clearQuery } = useSqlBuilder()
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
      const droppedBlock = JSON.parse(rawBlock) as {
        type: 'keyword' | 'table' | 'column' | 'operator' | 'value' | 'symbol'
        label: string
        value: string
      }
      if (droppedBlock.type && droppedBlock.label && droppedBlock.value) addBlockAt(droppedBlock, targetIndex)
    } catch {
      // Ignora dados que não correspondem a um bloco SQL.
    }
  }

  return (
    <article className="border border-[#625c50] bg-[#292824] p-4 shadow-xl sm:p-6">
      <header className="mb-4">
        <p className="mb-1 font-mono text-[9px] font-bold tracking-[0.2em] text-[#c5a56e]">MONTE SUA CONSULTA</p>
        <h2 className="font-serif text-xl font-bold text-[#e6dfcc]">Programação em blocos</h2>
        <p className="mt-2 text-xs leading-5 text-[#bdb19e]">
          Clique nos blocos abaixo na ordem em que devem aparecer na consulta. Também é possível arrastá-los.
        </p>
      </header>

      <section
        onDragOver={event => { event.preventDefault(); setDropIndex(queryBlocks.length) }}
        onDragLeave={() => setDropIndex(null)}
        onDrop={event => handleDrop(event)}
        className="mb-4 min-h-[88px] border-2 border-dashed border-[#625c50] bg-[#181714] p-3 sm:p-4"
        aria-label="Área de montagem da consulta SQL"
      >
        {queryBlocks.length === 0 ? (
          <div className="flex min-h-[56px] items-center justify-center text-center">
            <p className="text-xs leading-5 text-[#837c6e]">Sua consulta começa aqui. Selecione os blocos na ordem correta.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {queryBlocks.map(block => {
              const index = queryBlocks.findIndex(item => item.instanceId === block.instanceId)
              return (
                <SqlBlock
                  key={block.instanceId}
                  label={block.label}
                  type={block.type}
                  draggable
                  onClick={() => removeBlock(block.instanceId)}
                  onDragStart={event => {
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('application/x-sql-block-instance', block.instanceId)
                  }}
                  onDragOver={event => { event.preventDefault(); setDropIndex(index) }}
                  onDrop={event => handleDrop(event, index)}
                  isDropTarget={dropIndex === index}
                />
              )
            })}
          </div>
        )}
      </section>

      <div className="mb-5 border-l-2 border-[#c5a56e] bg-[#181714] px-3 py-3">
        <p className="mb-2 font-mono text-[9px] font-bold tracking-widest text-[#837c6e]">PRÉVIA DA CONSULTA</p>
        <code className="block break-words font-mono text-xs leading-6 text-[#e6dfcc]">{query || 'SELECT ...'}</code>
      </div>

      <SqlBlockPalette tables={tables} config={paletteConfig} onAddBlock={block => addBlockAt(block)} />

      <footer className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row">
        <button type="button" onClick={clearQuery} disabled={queryBlocks.length === 0} className="border border-[#625c50] px-4 py-3 font-mono text-xs font-bold text-[#bdb19e] transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30">
          LIMPAR BLOCOS
        </button>
        <button type="button" onClick={() => query && onExecute(query)} disabled={!query || disabled} className="bg-[#7d2929] px-6 py-3 font-mono text-xs font-bold text-[#f1e8d6] transition hover:bg-[#963232] disabled:cursor-not-allowed disabled:opacity-40">
          EXECUTAR CONSULTA →
        </button>
      </footer>
      <p className="mt-3 text-right text-[10px] text-[#837c6e]">Clique em um bloco montado para removê-lo.</p>
    </article>
  )
}
