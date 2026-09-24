import {
  useState,
} from 'react'

import type {
  InvestigationGuideConfig,
} from '../../../shared/types/gameplay'

interface InvestigationGuideProps {
  config: InvestigationGuideConfig
}

export function InvestigationGuide({
  config,
}: InvestigationGuideProps) {
  const [
    hintIndex,
    setHintIndex,
  ] = useState<number | null>(null)

  const currentHint =
    hintIndex !== null
      ? config.hints[hintIndex]
      : null

  const hasMoreHints =
    hintIndex === null ||
    hintIndex <
    config.hints.length - 1

  const handleShowHint = () => {
    if (
      config.hints.length === 0
    ) {
      return
    }

    setHintIndex((current) => {
      if (current === null) {
        return 0
      }

      return Math.min(
        current + 1,
        config.hints.length - 1,
      )
    })
  }

  return (
    <aside
      className="
        bg-[#d9ccb0]
        p-5
        text-[#28241d]
        shadow-2xl
      "
    >
      {/* HEADER */}

      <header
        className="
          mb-4
          border-b
          border-black/20
          pb-4
        "
      >
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <p
            className="
              font-mono
              text-[9px]
              font-bold
              tracking-[0.2em]
              text-[#7b2020]
            "
          >
            LINHA ATIVA
          </p>

          <span
            className="
              border
              border-[#8f826c]
              px-2
              py-1
              font-mono
              text-[8px]
              text-[#6b6151]
            "
          >
            {config.step} / {config.totalSteps}
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#292824]
              font-serif
              text-xs
              text-[#ded5c2]
            "
          >
            ID
          </div>

          <div>
            <p
              className="
                font-serif
                font-bold
              "
            >
              {config.npcName}
            </p>

            <p
              className="
                font-mono
                text-[8px]
                text-[#817663]
              "
            >
              INVESTIGAÇÃO EM ANDAMENTO
            </p>
          </div>
        </div>
      </header>

      {/* MENSAGEM */}

      <p
        className="
          mb-5
          border-l-4
          border-[#7b2020]
          pl-3
          font-serif
          text-sm
          italic
          leading-5
          text-[#4d4539]
        "
      >
        “{config.message}”
      </p>

      {/* OBJETIVO */}

      <div className="mb-4">
        <p
          className="
            mb-1
            font-mono
            text-[8px]
            tracking-[0.18em]
            text-[#786d59]
          "
        >
          OBJETIVO ATUAL
        </p>

        <h2
          className="
            font-serif
            text-lg
            font-bold
          "
        >
          {config.title}
        </h2>

        <p
          className="
            mt-2
            font-serif
            text-sm
            leading-5
            text-[#51493d]
          "
        >
          {config.objective}
        </p>
      </div>

      {/* PRÓXIMO PASSO */}

      <div
        className="
          mb-5
          border
          border-[#aa9d84]
          bg-black/[0.03]
          p-3
        "
      >
        <p
          className="
            mb-1
            font-mono
            text-[8px]
            tracking-[0.18em]
            text-[#786d59]
          "
        >
          SUGESTÃO
        </p>

        <p
          className="
            font-serif
            text-sm
          "
        >
          Comece pela tabela{' '}
          <strong>
            {config.suggestedTable}
          </strong>.
        </p>
      </div>

      {/* HINT */}

      {currentHint && (
        <div
          className="
            mb-3
            border-l-2
            border-[#7b2020]
            bg-[#c8ba98]/30
            px-3
            py-3
          "
        >
          <p
            className="
              mb-1
              font-mono
              text-[8px]
              font-bold
              text-[#7b2020]
            "
          >
            DICA {(hintIndex ?? 0) + 1}
          </p>

          <p
            className="
              font-serif
              text-sm
              leading-5
              text-[#52493d]
            "
          >
            {currentHint}
          </p>
        </div>
      )}

      {config.hints.length > 0 && (
        <button
          type="button"
          onClick={handleShowHint}
          disabled={!hasMoreHints}
          className="
            w-full
            border
            border-[#7b2020]
            px-4
            py-2
            font-mono
            text-[9px]
            font-bold
            text-[#7b2020]
            transition

            hover:bg-[#7b2020]
            hover:text-white

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {hintIndex === null
            ? 'PEDIR DICA'
            : hasMoreHints
              ? 'PRÓXIMA DICA'
              : 'TODAS AS DICAS EXIBIDAS'}
        </button>
      )}
    </aside>
  )
}