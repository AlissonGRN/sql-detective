import { Link } from 'react-router'

interface GameHeaderProps {
  caseNumber: string
  caseTitle: string
}

export function GameHeader({
  caseNumber,
  caseTitle,
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

      <div
        className="
          font-serif
          font-bold
          tracking-[0.2em]
        "
      >
        SQL{' '}
        <span className="text-[#9e3030]">
          DETECTIVE
        </span>
      </div>
    </header>
  )
}