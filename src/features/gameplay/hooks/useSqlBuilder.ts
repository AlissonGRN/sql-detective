import { useMemo, useRef, useState } from 'react'
import type { SqlBlockDefinition, SqlQueryBlock } from '../types/sql'

export function useSqlBuilder() {
  const [queryBlocks, setQueryBlocks] = useState<SqlQueryBlock[]>([])
  const nextId = useRef(0)

  const addBlockAt = (block: SqlBlockDefinition, index?: number) => {
    nextId.current += 1
    const queryBlock: SqlQueryBlock = { ...block, instanceId: `sql-block-${nextId.current}` }
    setQueryBlocks((current) => {
      const next = [...current]
      const position = index === undefined ? next.length : Math.max(0, Math.min(index, next.length))
      next.splice(position, 0, queryBlock)
      return next
    })
  }
  const addBlock = (block: SqlBlockDefinition) => addBlockAt(block)
  const moveBlock = (instanceId: string, targetIndex: number) => {
    setQueryBlocks((current) => {
      const sourceIndex = current.findIndex((block) => block.instanceId === instanceId)
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return current
      const next = [...current]
      const [moving] = next.splice(sourceIndex, 1)
      const adjustedIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
      next.splice(Math.max(0, Math.min(adjustedIndex, next.length)), 0, moving)
      return next
    })
  }
  const removeBlock = (instanceId: string) => setQueryBlocks((current) => current.filter((block) => block.instanceId !== instanceId))
  const clearQuery = () => setQueryBlocks([])
  const query = useMemo(() => formatSqlQuery(queryBlocks), [queryBlocks])
  return { queryBlocks, query, addBlock, addBlockAt, moveBlock, removeBlock, clearQuery }
}

function formatSqlQuery(blocks: SqlQueryBlock[]) {
  return blocks.map((block) => block.value).join(' ')
    .replace(/\s+,/g, ',').replace(/\s+;/g, ';')
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim()
}
