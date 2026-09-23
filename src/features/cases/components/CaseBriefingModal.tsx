import {
  useEffect,
} from 'react'

import type {
  GameCase,
} from '../types/case'

interface CaseBriefingModalProps {
  gameCase: GameCase
  onClose: () => void
  onStart: () => void
}

export function CaseBriefingModal({
  gameCase,
  onClose,
  onStart,
}: CaseBriefingModalProps) {
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    document.body.style.overflow =
      'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/80
        p-5
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <section
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="
          relative
          grid
          w-full
          max-w-4xl
          overflow-hidden
          bg-[#d9ccb0]
          text-[#29251d]
          shadow-2xl

          md:grid-cols-[220px_1fr]
        "
      >
        {/* NPC */}

        <aside
          className="
            bg-[#292824]
            p-7
            text-[#ded5c2]
          "
        >
          <div
            className="
              mb-6
              -rotate-2
              bg-[#e2d8bd]
              p-2
              shadow-xl
            "
          >
            <div
              className="
                flex
                h-48
                items-center
                justify-center
                bg-[#45433c]
              "
            >
              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#aaa495]
                  font-serif
                  text-3xl
                  text-[#ccc5b5]
                "
              >
                ID
              </div>
            </div>
          </div>

          <p
            className="
              mb-1
              font-mono
              text-[9px]
              tracking-wider
              text-[#837f74]
            "
          >
            RESPONSÁVEL PELO CASO
          </p>

          <h3
            className="
              font-serif
              text-xl
              font-bold
            "
          >
            {gameCase.briefing.npcName}
          </h3>

          <p
            className="
              mt-1
              font-mono
              text-[9px]
              leading-4
              text-[#8f897c]
            "
          >
            {gameCase.briefing.npcRole}
          </p>
        </aside>

        {/* BRIEFING */}

        <div
          className="
            relative
            p-7
            md:p-10
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-5
              top-5
              font-mono
              text-sm
              text-[#776e5d]
              transition
              hover:text-[#7b2020]
            "
          >
            ✕
          </button>

          <div className="mb-7 pr-8">
            <p
              className="
                mb-2
                font-mono
                text-[9px]
                tracking-[0.2em]
                text-[#786d59]
              "
            >
              {gameCase.number}
            </p>

            <h2
              className="
                font-serif
                text-3xl
                font-bold
                md:text-4xl
              "
            >
              {gameCase.title}
            </h2>
          </div>

          {/* Fala */}

          <div
            className="
              mb-8
              border-l-4
              border-[#7b2020]
              pl-5
            "
          >
            <p
              className="
                mb-3
                font-mono
                text-[9px]
                font-bold
                tracking-[0.18em]
                text-[#7b2020]
              "
            >
              {gameCase.briefing.npcName.toUpperCase()}
            </p>

            <p
              className="
                font-serif
                text-base
                italic
                leading-7
                text-[#413a30]
              "
            >
              “{gameCase.briefing.speech}”
            </p>
          </div>

          {/* Informações */}

          <div
            className="
              mb-8
              grid
              grid-cols-2
              gap-5
              border-y
              border-black/20
              py-5

              lg:grid-cols-4
            "
          >
            <BriefingInfo
              label="LOCAL"
              value={
                gameCase.briefing.location
              }
            />

            <BriefingInfo
              label="OCORRÊNCIA"
              value={
                gameCase.briefing.crime
              }
            />

            <BriefingInfo
              label="HORÁRIO"
              value={
                gameCase.briefing.time
              }
            />

            <BriefingInfo
              label="DIFICULDADE"
              value={
                gameCase.difficulty
              }
            />
          </div>

          <div
            className="
              mb-8
              bg-black/5
              p-5
            "
          >
            <p
              className="
                mb-2
                font-mono
                text-[9px]
                font-bold
                tracking-[0.18em]
              "
            >
              SUA MISSÃO
            </p>

            <p
              className="
                font-serif
                text-sm
                leading-6
                text-[#51493c]
              "
            >
              {gameCase.briefing.mission}
            </p>
          </div>

          <div
            className="
              flex
              flex-col-reverse
              justify-end
              gap-3

              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                border
                border-[#766c59]
                px-5
                py-3
                font-mono
                text-xs
                font-bold
                text-[#625847]
                transition
                hover:bg-black/5
              "
            >
              VOLTAR
            </button>

            <button
              type="button"
              onClick={onStart}
              className="
                bg-[#7b2020]
                px-6
                py-3
                font-mono
                text-xs
                font-bold
                text-[#f0e8d6]
                transition
                hover:bg-[#922828]
              "
            >
              INICIAR INVESTIGAÇÃO →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

interface BriefingInfoProps {
  label: string
  value: string
}

function BriefingInfo({
  label,
  value,
}: BriefingInfoProps) {
  return (
    <div>
      <p
        className="
          mb-1
          font-mono
          text-[8px]
          tracking-widest
          text-[#887c67]
        "
      >
        {label}
      </p>

      <strong
        className="
          font-mono
          text-[11px]
        "
      >
        {value}
      </strong>
    </div>
  )
}