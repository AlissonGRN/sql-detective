import type {
  GameCase,
} from '../types/case'

interface CaseCardProps {
  gameCase: GameCase
  onSelect: (gameCase: GameCase) => void
}

export function CaseCard({
  gameCase,
  onSelect,
}: CaseCardProps) {
  const handleClick = () => {
    if (!gameCase.available) {
      return
    }

    onSelect(gameCase)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!gameCase.available}
      className={`
        relative
        min-h-[320px]
        w-full
        bg-[#c5a56e]
        p-7
        text-left
        text-[#28231b]
        shadow-xl
        transition
        duration-200

        before:absolute
        before:-top-5
        before:left-0
        before:h-6
        before:w-28
        before:rounded-t-md
        before:bg-[#c5a56e]

        ${gameCase.available
          ? `
                cursor-pointer
                hover:-translate-y-2
                hover:-rotate-1
                hover:shadow-2xl
              `
          : `
                cursor-not-allowed
                opacity-40
                grayscale
              `
        }
      `}
    >
      <div
        className="
          mb-10
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <span
          className="
            font-mono
            text-[10px]
            tracking-[0.2em]
            text-[#62543f]
          "
        >
          {gameCase.number}
        </span>

        <span
          className="
            rotate-6
            border-2
            border-[#7b2020]
            px-2
            py-1
            font-mono
            text-[9px]
            font-bold
            text-[#7b2020]
          "
        >
          {gameCase.available
            ? 'ABERTO'
            : 'BLOQUEADO'}
        </span>
      </div>

      <h2
        className="
          mb-4
          max-w-[220px]
          font-serif
          text-2xl
          font-bold
          leading-tight
        "
      >
        {gameCase.title}
      </h2>

      <p
        className="
          font-mono
          text-xs
          leading-5
          text-[#594d3b]
        "
      >
        {gameCase.description}
      </p>

      <div
        className="
          absolute
          bottom-7
          left-7
          right-7
          flex
          items-end
          justify-between
          gap-3
        "
      >
        <span
          className="
            border
            border-[#6c5d47]
            px-2
            py-1
            font-mono
            text-[9px]
          "
        >
          {gameCase.difficulty.toUpperCase()}
        </span>

        {gameCase.available && (
          <span
            className="
              font-mono
              text-[9px]
              font-bold
              text-[#7b2020]
            "
          >
            ABRIR ARQUIVO →
          </span>
        )}
      </div>
    </button>
  )
}