import {
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router'

import { CaseBriefingModal } from '../components/CaseBriefingModal'
import { CaseCard } from '../components/CaseCard'

import {
  getCases,
} from '../services/caseService'

import type {
  GameCase,
} from '../types/case'

export function CasesPage() {
  const navigate = useNavigate()

  const cases = getCases()

  const [
    selectedCase,
    setSelectedCase,
  ] = useState<GameCase | null>(null)

  const handleSelectCase = (
    gameCase: GameCase,
  ) => {
    setSelectedCase(gameCase)
  }

  const handleCloseModal = () => {
    setSelectedCase(null)
  }

  const handleStartCase = () => {
    if (!selectedCase) {
      return
    }

    navigate(
      `/cases/${selectedCase.id}`,
    )
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#151512]
        px-5
        py-8
        text-[#e5ddca]
        md:px-10
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        {/* HEADER */}

        <header
          className="
            mb-16
            flex
            items-center
            justify-between
          "
        >
          <Link
            to="/"
            className="
              font-mono
              text-xs
              text-neutral-500
              transition
              hover:text-neutral-200
            "
          >
            ← MENU PRINCIPAL
          </Link>

          <div
            className="
              font-serif
              text-lg
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

        {/* TITLE */}

        <section className="mb-16">
          <p
            className="
              mb-3
              font-mono
              text-xs
              font-bold
              tracking-[0.25em]
              text-[#a33b3b]
            "
          >
            ARQUIVO CENTRAL
          </p>

          <h1
            className="
              mb-4
              font-serif
              text-4xl
              font-bold
              md:text-5xl
            "
          >
            Casos disponíveis
          </h1>

          <p
            className="
              max-w-xl
              font-mono
              text-sm
              leading-6
              text-neutral-500
            "
          >
            Selecione um arquivo para
            receber o briefing da
            investigação.
          </p>
        </section>

        {/* ARCHIVE */}

        <section
          className="
            relative
            border
            border-[#39372f]
            bg-[#25241f]
            px-6
            py-14
            shadow-2xl
            md:px-10
          "
        >
          <div
            className="
              absolute
              -top-5
              left-8
              bg-[#b79762]
              px-6
              py-3
              font-mono
              text-xs
              font-bold
              tracking-[0.15em]
              text-[#29231a]
            "
          >
            ARQUIVOS DE INVESTIGAÇÃO
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-x-8
              gap-y-14
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {cases.map((gameCase) => (
              <CaseCard
                key={gameCase.id}
                gameCase={gameCase}
                onSelect={
                  handleSelectCase
                }
              />
            ))}
          </div>

          <footer
            className="
              mt-12
              flex
              justify-between
              border-t
              border-[#3c3a33]
              pt-6
              font-mono
              text-[9px]
              text-neutral-600
            "
          >
            <span>
              DIVISÃO DE CRIMES ESPECIAIS
            </span>

            <span>
              SQL DETECTIVE
            </span>
          </footer>
        </section>
      </div>

      {selectedCase && (
        <CaseBriefingModal
          gameCase={selectedCase}
          onClose={handleCloseModal}
          onStart={handleStartCase}
        />
      )}
    </main>
  )
}