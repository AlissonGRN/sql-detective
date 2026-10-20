import type {
  ReactNode,
} from 'react'

import { SqlBlock } from './SqlBlock'

import type {
  GameTable,
} from '../../types/database'

import type {
  SqlBlockDefinition,
} from '../../types/sql'

import type {
  SqlPaletteConfig,
} from '../../../../shared/types/gameplay'

interface SqlBlockPaletteProps {
  tables: GameTable[]

  config: SqlPaletteConfig

  onAddBlock: (
    block: SqlBlockDefinition,
  ) => void
}

export function SqlBlockPalette({
  tables,
  config,
  onAddBlock,
}: SqlBlockPaletteProps) {
  const keywordBlocks =
    config.keywords.map<SqlBlockDefinition>(
      (value) => ({
        type: 'keyword',
        label: value,
        value,
      }),
    )

  const tableBlocks =
    config.tables
      .filter((tableName) =>
        tables.some(
          (table) =>
            table.name ===
            tableName,
        ),
      )
      .map<SqlBlockDefinition>(
        (value) => ({
          type: 'table',
          label: value,
          value,
        }),
      )

  const columnBlocks =
    config.columns.map<SqlBlockDefinition>(
      (value) => ({
        type: 'column',
        label: value,
        value,
      }),
    )

  const operatorBlocks =
    config.operators.map<SqlBlockDefinition>(
      (value) => ({
        type: 'operator',
        label: value,
        value,
      }),
    )

  const valueBlocks =
    config.values.map<SqlBlockDefinition>(
      (value) => ({
        type: 'value',
        label: value,
        value,
      }),
    )

  return (
    <div className="space-y-4">

      <PaletteGroup title="COMANDOS">
        {keywordBlocks.map(
          (block) => (
            <SqlBlock
              key={block.value}
              {...block}
              onClick={() => onAddBlock(block)}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = 'copy'
                event.dataTransfer.setData('application/x-sql-block', JSON.stringify(block))
              }
            />
          ),
        )}
      </PaletteGroup>

      <PaletteGroup title="TABELAS">
        {tableBlocks.map(
          (block) => (
            <SqlBlock
              key={block.value}
              {...block}
              onClick={() =>
                onAddBlock(block)
              }
            />
          ),
        )}
      </PaletteGroup>

      <PaletteGroup title="COLUNAS">
        {columnBlocks.map(
          (block) => (
            <SqlBlock
              key={block.value}
              {...block}
              onClick={() =>
                onAddBlock(block)
              }
            />
          ),
        )}
      </PaletteGroup>

      <PaletteGroup title="OPERADORES">
        {operatorBlocks.map(
          (block) => (
            <SqlBlock
              key={block.value}
              {...block}
              onClick={() =>
                onAddBlock(block)
              }
            />
          ),
        )}
      </PaletteGroup>

      <PaletteGroup title="VALORES">
        {valueBlocks.map(
          (block) => (
            <SqlBlock
              key={block.value}
              {...block}
              onClick={() =>
                onAddBlock(block)
              }
            />
          ),
        )}
      </PaletteGroup>

    </div>
  )
}

interface PaletteGroupProps {
  title: string
  children: ReactNode
}

function PaletteGroup({
  title,
  children,
}: PaletteGroupProps) {
  return (
    <div>
      <p
        className="
          mb-2
          font-mono
          text-[8px]
          tracking-[0.18em]
          text-[#837c6e]
        "
      >
        {title}
      </p>

      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {children}
      </div>
    </div>
  )
}