import {
  useEffect,
  useState,
} from 'react'

import type {
  DatabaseRow,
} from '../types/database'

interface SuspectModalProps {
  suspects: DatabaseRow[]

  initialSelectedId?: number | null

  onClose: () => void

  onConfirm: (
    suspectId: number,
  ) => void
}

export function SuspectModal({
  suspects,
  initialSelectedId = null,
  onClose,
  onConfirm,
}: SuspectModalProps) {
  const [
    selectedId,
    setSelectedId,
  ] = useState<number | null>(
    initialSelectedId,
  )

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

  const handleConfirm = () => {
    if (selectedId === null) {
      return
    }

    onConfirm(selectedId)
    onClose()
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
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
          w-full
          max-w-3xl
          bg-[#d9ccb0]
          p-7
          text-[#28241d]
          shadow-2xl
        "
      >
        <header
          className="
            mb-6
            flex
            items-start
            justify-between
          "
        >
          <div>
            <p
              className="
                mb-1
                font-mono
                text-[9px]
                font-bold
                tracking-[0.2em]
                text-[#7b2020]
              "
            >
              ARQUIVO DE SUSPEITOS
            </p>

            <h2
              className="
                font-serif
                text-3xl
                font-bold
              "
            >
              Quem você considera culpado?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              font-mono
              text-sm
              text-[#756a58]
              hover:text-[#7b2020]
            "
          >
            ✕
          </button>
        </header>

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          {suspects.map((suspect) => {
            const id =
              Number(suspect.id)

            const isSelected =
              selectedId === id

            return (
              <button
                key={id}
                type="button"
                onClick={() =>
                  setSelectedId(id)
                }
                className={`
                  border
                  p-4
                  text-left
                  transition

                  ${isSelected
                    ? `
                          border-[#7b2020]
                          bg-[#7b2020]/10
                        `
                    : `
                          border-[#afa287]
                          hover:bg-black/5
                        `
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className={`
                      mt-1
                      h-4
                      w-4
                      shrink-0
                      rounded-full
                      border
                      border-[#6b6151]

                      ${isSelected
                        ? 'bg-[#7b2020]'
                        : ''
                      }
                    `}
                  />

                  <div>
                    <strong
                      className="
                        font-serif
                        text-lg
                      "
                    >
                      {String(
                        suspect.name ??
                        'Sem nome',
                      )}
                    </strong>

                    <p
                      className="
                        font-mono
                        text-[10px]
                        text-[#706554]
                      "
                    >
                      {String(
                        suspect.occupation ??
                        '',
                      )}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <footer
          className="
            mt-7
            flex
            justify-end
            gap-3
            border-t
            border-black/20
            pt-5
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              border
              border-[#786d5a]
              px-5
              py-3
              font-mono
              text-xs
              font-bold
            "
          >
            VOLTAR
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              selectedId === null
            }
            className="
              bg-[#7b2020]
              px-6
              py-3
              font-mono
              text-xs
              font-bold
              text-white

              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            MARCAR COMO CULPADO
          </button>
        </footer>
      </section>
    </div>
  )
}