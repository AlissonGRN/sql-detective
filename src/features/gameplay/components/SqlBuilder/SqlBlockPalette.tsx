import {
  useState,
} from 'react'

import { SqlBlock } from './SqlBlock'

import type {
  GameTable,
} from '../../types/database'

import type {
  SqlBlockDefinition,
} from '../../types/sql'

interface SqlBlockPaletteProps {
  tables: GameTable[]

  onAddBlock: (
    block: SqlBlockDefinition,
  ) => void
}

const keywords: SqlBlockDefinition[] = [
  {
    type: 'keyword',
    label: 'SELECT',
    value: 'SELECT',
  },
  {
    type: 'keyword',
    label: 'FROM',
    value: 'FROM',
  },
  {
    type: 'keyword',
    label: 'WHERE',
    value: 'WHERE',
  },
  {
    type: 'keyword',
    label: 'JOIN',
    value: 'JOIN',
  },
  {
    type: 'keyword',
    label: 'ON',
    value: 'ON',
  },
  {
    type: 'keyword',
    label: 'AND',
    value: 'AND',
  },
  {
    type: 'keyword',
    label: 'OR',
    value: 'OR',
  },
  {
    type: 'keyword',
    label: 'ORDER BY',
    value: 'ORDER BY',
  },
]

const operators: SqlBlockDefinition[] = [
  {
    type: 'operator',
    label: '=',
    value: '=',
  },
  {
    type: 'operator',
    label: '!=',
    value: '!=',
  },
  {
    type: 'operator',
    label: '>',
    value: '>',
  },
  {
    type: 'operator',
    label: '<',
    value: '<',
  },
  {
    type: 'operator',
    label: '>=',
    value: '>=',
  },
  {
    type: 'operator',
    label: '<=',
    value: '<=',
  },
]

const symbols: SqlBlockDefinition[] = [
  {
    type: 'column',
    label: '*',
    value: '*',
  },
  {
    type: 'symbol',
    label: ',',
    value: ',',
  },
  {
    type: 'symbol',
    label: ';',
    value: ';',
  },
  {
    type: 'symbol',
    label: '(',
    value: '(',
  },
  {
    type: 'symbol',
    label: ')',
    value: ')',
  },
]

export function SqlBlockPalette({
  tables,
  onAddBlock,
}: SqlBlockPaletteProps) {
  const [
    customValue,
    setCustomValue,
  ] = useState('')

  const tableBlocks =
    tables.map<SqlBlockDefinition>(
      (table) => ({
        type: 'table',
        label: table.name,
        value: table.name,
      }),
    )

  const columnBlocks =
    tables.flatMap(
      (table) =>
        table.columns.map<SqlBlockDefinition>(
          (column) => ({
            type: 'column',

            label:
              `${table.name}.${column.name}`,

            value:
              `${table.name}.${column.name}`,
          }),
        ),
    )

  const handleAddValue = () => {
    const value =
      customValue.trim()

    if (!value) {
      return
    }

    onAddBlock({
      type: 'value',
      label: value,
      value,
    })

    setCustomValue('')
  }

  return (
    <div className="space-y-5">

      <PaletteGroup title="COMANDOS">
        {keywords.map((block) => (
          <SqlBlock
            key={block.value}
            {...block}
            onClick={() =>
              onAddBlock(block)
            }
          />
        ))}
      </PaletteGroup>

      <PaletteGroup title="TABELAS">
        {tableBlocks.map((block) => (
          <SqlBlock
            key={block.value}
            {...block}
            onClick={() =>
              onAddBlock(block)
            }
          />
        ))}
      </PaletteGroup>

      <PaletteGroup title="COLUNAS">
        {columnBlocks.map((block) => (
          <SqlBlock
            key={block.value}
            {...block}
            onClick={() =>
              onAddBlock(block)
            }
          />
        ))}
      </PaletteGroup>

      <PaletteGroup title="OPERADORES">
        {operators.map((block) => (
          <SqlBlock
            key={block.value}
            {...block}
            onClick={() =>
              onAddBlock(block)
            }
          />
        ))}
      </PaletteGroup>

      <PaletteGroup title="SÍMBOLOS">
        {symbols.map((block) => (
          <SqlBlock
            key={`${block.type}-${block.value}`}
            {...block}
            onClick={() =>
              onAddBlock(block)
            }
          />
        ))}
      </PaletteGroup>

      {/* VALOR PERSONALIZADO */}

      <div>
        <p
          className="
            mb-2
            font-mono
            text-[9px]
            tracking-[0.18em]
            text-[#837c6e]
          "
        >
          VALOR
        </p>

        <div
          className="
            flex
            max-w-sm
            gap-2
          "
        >
          <input
            type="text"
            value={customValue}
            onChange={(event) =>
              setCustomValue(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter'
              ) {
                handleAddValue()
              }
            }}
            placeholder="'20:30'"
            className="
              min-w-0
              flex-1
              border
              border-[#555046]
              bg-[#1a1916]
              px-3
              py-2

              font-mono
              text-xs
              text-[#e7deca]

              outline-none

              placeholder:text-neutral-700

              focus:border-[#7d2929]
            "
          />

          <button
            type="button"
            onClick={handleAddValue}
            className="
              border
              border-[#625c50]
              px-4

              font-mono
              text-[10px]
              font-bold
              text-[#b7ad99]

              transition

              hover:bg-white/5
            "
          >
            ADICIONAR
          </button>
        </div>

        <p
          className="
            mt-2
            font-mono
            text-[8px]
            text-neutral-600
          "
        >
          Strings devem incluir aspas,
          por exemplo: '20:30'
        </p>
      </div>

    </div>
  )
}

interface PaletteGroupProps {
  title: string
  children: React.ReactNode
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
          text-[9px]
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