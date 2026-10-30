import { Link } from 'react-router'

interface GameHeaderProps {
  caseNumber: string
  caseTitle: string
  onAnalyzeSuspects: () => void
  onOpenHelp: () => void
  canAccuse: boolean
  completedSteps: number
  totalSteps: number
}

export function GameHeader({ caseNumber, caseTitle, onAnalyzeSuspects, onOpenHelp, canAccuse, completedSteps, totalSteps }: GameHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <Link to="/cases" className="font-mono text-xs text-neutral-500 transition hover:text-neutral-200">← CASOS</Link>
      <div className="min-w-0 text-left sm:text-center">
        <p className="font-mono text-[9px] tracking-[0.2em] text-[#837c6e]">{caseNumber}</p>
        <h1 className="font-serif text-xl font-bold text-[#e6dfcc]">{caseTitle}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onOpenHelp} className="border border-[#625c50] px-3 py-3 font-mono text-[10px] font-bold text-[#d9ccb0] transition hover:border-[#c5a56e]">AJUDA</button>
        <button type="button" onClick={onAnalyzeSuspects} disabled={!canAccuse} title={canAccuse ? "Apresentar conclusão" : "Conclua as etapas para apresentar a acusação"} className="bg-[#c5a56e] px-4 py-3 font-mono text-[10px] font-bold text-[#28231b] transition hover:bg-[#d1b276] disabled:cursor-not-allowed disabled:opacity-40">
          {canAccuse ? 'ANALISAR SUSPEITOS' : `${completedSteps}/${totalSteps} ETAPAS`}
        </button>
      </div>
    </header>
  )
}
