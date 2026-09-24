import {
  useMemo,
  useRef,
  useState,
} from 'react'

import type {
  SqlBlockDefinition,
  SqlQueryBlock,
} from '../types/sql'

export function useSqlBuilder() {
  const [
    queryBlocks,
    setQueryBlocks,
  ] = useState<SqlQueryBlock[]>([])

  const nextId = useRef(0)

  const addBlock = (
    block: SqlBlockDefinition,
  ) => {
    nextId.current += 1

    const queryBlock: SqlQueryBlock = {
      ...block,
      instanceId: `sql-block-${nextId.current}`,
    }

    setQueryBlocks(
      (currentBlocks) => [
        ...currentBlocks,
        queryBlock,
      ],
    )
  }

  const removeBlock = (
    instanceId: string,
  ) => {
    setQueryBlocks(
      (currentBlocks) =>
        currentBlocks.filter(
          (block) =>
            block.instanceId !==
            instanceId,
        ),
    )
  }

  const clearQuery = () => {
    setQueryBlocks([])
  }

  const query = useMemo(() => {
    return formatSqlQuery(
      queryBlocks,
    )
  }, [queryBlocks])

  return {
    queryBlocks,
    query,

    addBlock,
    removeBlock,
    clearQuery,
  }
}

function formatSqlQuery(
  blocks: SqlQueryBlock[],
) {
  return blocks
    .map((block) => block.value)
    .join(' ')
    .replace(/\s+,/g, ',')
    .replace(/\s+;/g, ';')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim()
}