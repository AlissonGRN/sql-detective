import type {
  SqlBlockType,
} from '../../types/sql'

interface SqlBlockProps {
  label: string
  type: SqlBlockType
  onClick?: () => void
}

const blockStyles:
  Record<SqlBlockType, string> = {
  keyword: `
      bg-[#7d2929]
      text-[#f1e8d6]
    `,

  table: `
      bg-[#486171]
      text-[#edf0f2]
    `,

  column: `
      bg-[#ddd3bc]
      text-[#28241d]
    `,

  operator: `
      bg-[#6b5e45]
      text-white
    `,

  value: `
      bg-[#52704f]
      text-white
    `,

  symbol: `
      bg-[#555149]
      text-white
    `,
}

export function SqlBlock({
  label,
  type,
  onClick,
}: SqlBlockProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${blockStyles[type]}

        whitespace-nowrap
        px-3
        py-2

        font-mono
        text-[11px]
        font-bold

        shadow

        transition
        duration-150

        hover:-translate-y-0.5
        hover:brightness-110
      `}
    >
      {label}
    </button>
  )
}