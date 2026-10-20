import type { DragEvent } from 'react'
import type { SqlBlockType } from '../../types/sql'

interface SqlBlockProps {
  label: string
  type: SqlBlockType
  onClick?: () => void
  draggable?: boolean
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void
  onDragOver?: (event: DragEvent<HTMLButtonElement>) => void
  onDrop?: (event: DragEvent<HTMLButtonElement>) => void
  isDropTarget?: boolean
}

const blockStyles: Record<SqlBlockType, string> = {
  keyword: 'bg-[#7d2929] text-[#f1e8d6]',
  table: 'bg-[#486171] text-[#edf0f2]',
  column: 'bg-[#ddd3bc] text-[#28241d]',
  operator: 'bg-[#6b5e45] text-white',
  value: 'bg-[#52704f] text-white',
  symbol: 'bg-[#555149] text-white',
}

export function SqlBlock({ label, type, onClick, draggable = false, onDragStart, onDragOver, onDrop, isDropTarget = false }: SqlBlockProps) {
  return (
    <button type="button" onClick={onClick} draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      aria-label={draggable ? `Bloco SQL ${label}. Arraste para montar ou reordenar a consulta.` : label}
      className={`${blockStyles[type]} whitespace-nowrap px-3 py-2 font-mono text-[11px] font-bold shadow transition duration-150 hover:-translate-y-0.5 hover:brightness-110 ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${isDropTarget ? 'outline outline-2 outline-offset-2 outline-[#c5a56e]' : ''}`}>
      {label}
    </button>
  )
}
