import type { InvestigationGuideConfig } from '../../../shared/types/gameplay'

interface InvestigationGuideProps {
  config: InvestigationGuideConfig
  currentStepIndex: number
  consultedTables: Set<string>
}

export function InvestigationGuide({ config, currentStepIndex, consultedTables }: InvestigationGuideProps) {
  const step = config.steps[currentStepIndex]
  if (!step) return null

  const requiredTables = step.requiredTables
  const completedTables = requiredTables.filter((table) => consultedTables.has(table)).length

  return (
    <aside className="border border-[#625c50] bg-[#292824] text-[#e6dfcc]">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="mb-1 font-mono text-[9px] font-bold tracking-[0.18em] text-[#c5a56e]">PAINEL DA INVESTIGAÇÃO</p>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold">{config.npcName}</h2>
          <span className="font-mono text-[10px] text-[#bdb19e]">{currentStepIndex + 1}/{config.steps.length}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#bdb19e]">Acompanhe o que falta verificar durante o caso.</p>
      </div>

      {requiredTables.length > 0 && (
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="font-mono text-[9px] font-bold tracking-widest text-[#c5a56e]">TABELAS DA ETAPA</p>
            <span className="font-mono text-[10px] text-[#bdb19e]">{completedTables}/{requiredTables.length}</span>
          </div>
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#504c43]">
            <div className="h-full bg-[#7d9876] transition-all" style={{ width: `${(completedTables / requiredTables.length) * 100}%` }} />
          </div>
          <ul className="space-y-2">
            {requiredTables.map((tableName) => {
              const consulted = consultedTables.has(tableName)
              return <li key={tableName} className="flex items-center gap-2 text-xs"><span aria-hidden="true" className={consulted ? 'flex h-4 w-4 items-center justify-center rounded-full bg-[#365c43] text-white' : 'flex h-4 w-4 items-center justify-center rounded-full border border-[#625c50] text-[#bdb19e]'}>{consulted ? '✓' : '·'}</span><span className={consulted ? 'text-[#9bb49a]' : 'text-[#d9ccb0]'}>{tableName}</span><span className="ml-auto text-[9px] text-[#bdb19e]">{consulted ? 'VERIFICADA' : 'PENDENTE'}</span></li>
            })}
          </ul>
        </div>
      )}

      <details className="border-t border-white/10">
        <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[10px] font-bold tracking-wider text-[#c5a56e] hover:bg-white/5">LER ORIENTAÇÃO DO INVESTIGADOR <span className="float-right">+</span></summary>
        <div className="space-y-3 px-4 pb-4">
          <p className="font-serif text-sm italic leading-5 text-[#d9ccb0]">“{step.message}”</p>
          <p className="text-xs leading-5 text-[#bdb19e]">Você pode explorar outras tabelas além das sugeridas. Procure relações entre os registros e use os resultados para decidir o próximo passo.</p>
        </div>
      </details>
    </aside>
  )
}
