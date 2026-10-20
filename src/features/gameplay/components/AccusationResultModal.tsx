interface AccusationResultModalProps {
  correct: boolean

  suspectName: string

  explanation?: string
  evidence?: string[]

  onClose: () => void
}

export function AccusationResultModal({
  correct,
  suspectName,
  explanation,
  evidence = [],
  onClose,
}: AccusationResultModalProps) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        flex
        items-center
        justify-center
        bg-black/80
        p-5
        backdrop-blur-sm
      "
    >
      <section
        className="
          w-full
          max-w-xl
          bg-[#d9ccb0]
          p-7
          text-[#28241d]
          shadow-2xl
        "
      >
        <p
          className={`
            mb-2
            font-mono
            text-[9px]
            font-bold
            tracking-[0.2em]

            ${correct
              ? 'text-[#496446]'
              : 'text-[#7b2020]'
            }
          `}
        >
          {correct
            ? 'CASO RESOLVIDO'
            : 'ACUSAÇÃO INCONCLUSIVA'}
        </p>

        <h2
          className="
            mb-4
            font-serif
            text-3xl
            font-bold
          "
        >
          {correct
            ? `${suspectName} é o culpado.`
            : `As evidências não confirmam ${suspectName}.`}
        </h2>

        {correct ? (
          <p
            className="
              font-serif
              text-sm
              leading-6
              text-[#51493d]
            "
          >
            {explanation}
          </p>
        ) : (
          <p
            className="
              font-serif
              text-sm
              leading-6
              text-[#51493d]
            "
          >
            Continue investigando os
            registros antes de fazer
            uma nova acusação.
          </p>
        )}

        {correct && evidence.length > 0 && (
          <div className="mt-5 border-t border-black/15 pt-4">
            <p className="mb-2 font-mono text-[9px] font-bold tracking-[0.15em] text-[#496446]">EVIDÊNCIAS DECISIVAS</p>
            <ul className="list-disc space-y-1 pl-5 font-serif text-sm leading-5 text-[#51493d]">
              {evidence.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        )}

        <div
          className="
            mt-7
            flex
            justify-end
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              bg-[#292824]
              px-6
              py-3
              font-mono
              text-xs
              font-bold
              text-[#eee5d2]
            "
          >
            {correct
              ? 'VOLTAR AOS CASOS'
              : 'VOLTAR À INVESTIGAÇÃO'}
          </button>
        </div>
      </section>
    </div>
  )
}