import type { ReactNode } from 'react'
import { SqlBlock } from './SqlBlock'
import type { GameTable } from '../../types/database'
import type { SqlBlockDefinition } from '../../types/sql'
import type { SqlPaletteConfig } from '../../../../shared/types/gameplay'

interface SqlBlockPaletteProps {
  tables: GameTable[]
  config: SqlPaletteConfig
  onAddBlock: (block: SqlBlockDefinition) => void
}

export function SqlBlockPalette({ tables, config, onAddBlock }: SqlBlockPaletteProps) {
  const keywordBlocks = config.keywords.map<SqlBlockDefinition>(value => ({ type: 'keyword', label: value, value }))
  const tableBlocks = config.tables.filter(tableName => tables.some(table => table.name === tableName)).map<SqlBlockDefinition>(value => ({ type: 'table', label: value, value }))
  const columnBlocks = config.columns.map<SqlBlockDefinition>(value => ({ type: 'column', label: value, value }))
  const operatorBlocks = config.operators.map<SqlBlockDefinition>(value => ({ type: 'operator', label: value, value }))
  const valueBlocks = config.values.map<SqlBlockDefinition>(value => ({ type: 'value', label: value, value }))
  const symbolBlocks = (config.symbols ?? []).map<SqlBlockDefinition>(value => ({ type: 'symbol', label: value, value }))

  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-[#c5a56e]">BLOCOS DISPONÍVEIS NESTA ETAPA</p>
      <PaletteGroup title="COMANDOS" items={keywordBlocks} onAddBlock={onAddBlock} />
      <PaletteGroup title="TABELAS" items={tableBlocks} onAddBlock={onAddBlock} />
      <PaletteGroup title="COLUNAS" items={columnBlocks} onAddBlock={onAddBlock} />
      <PaletteGroup title="OPERADORES" items={operatorBlocks} onAddBlock={onAddBlock} />
      <PaletteGroup title="VALORES" items={valueBlocks} onAddBlock={onAddBlock} />
      <PaletteGroup title="SÍMBOLOS" items={symbolBlocks} onAddBlock={onAddBlock} />
    </div>
  )
}

interface PaletteGroupProps {
  title: string
  items: SqlBlockDefinition[]
  onAddBlock: (block: SqlBlockDefinition) => void
}

function PaletteGroup({ title, items, onAddBlock }: PaletteGroupProps) {
  if (items.length === 0) return null

  return (
    <section>
      <p className="mb-2 font-mono text-[9px] font-semibold tracking-widest text-[#837c6e]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(block => (
          <SqlBlock
            key={`${block.type}-${block.value}`}
            {...block}
            onClick={() => onAddBlock(block)}
            draggable
            onDragStart={event => {
              event.dataTransfer.effectAllowed = 'copy'
              event.dataTransfer.setData('application/x-sql-block', JSON.stringify(block))
            }}
          />
        ))}
      </div>
    </section>
  )
}
