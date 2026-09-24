import { Link } from 'react-router'

interface GameHeaderProps {
  caseNumber: string
  caseTitle: string

  onAnalyzeSuspects: () => void
}

export function GameHeader({
  caseNumber,
  caseTitle,
  onAnalyzeSuspects,
}: GameHeaderProps) {
  return (
    <header
      className="
        mb-10
        flex
        items-center
        justify-between
        gap-5
      "
    >
      <Link
        to="/cases"
        className="
          font-mono
          text-xs
          text-neutral-500
          transition
          hover:text-neutral-200
        "
      >
        ← ARQUIVO DE CASOS
      </Link>

      <div className="text-center">
        <p
          className="
            font-mono
            text-[9px]
            tracking-[0.25em]
            text-neutral-600
          "
        >
          {caseNumber}
        </p>

        <h1
          className="
            font-serif
            text-xl
            font-bold
          "
        >
          {caseTitle}
        </h1>
      </div>

      <button
        type="button"
        onClick={onAnalyzeSuspects}
        className="
          flex
          items-center
          gap-2
          bg-[#c5a56e]
          px-4
          py-3
          font-mono
          text-[10px]
          font-bold
          text-[#28231b]
          shadow
          transition

          hover:bg-[#d1b276]
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path
            d="m20 20-3.5-3.5"
          />
        </svg>

        ANALISAR SUSPEITOS
      </button>
    </header>
  )
}