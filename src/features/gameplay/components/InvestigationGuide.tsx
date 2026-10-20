import type { InvestigationGuideConfig } from '../../../shared/types/gameplay'

interface InvestigationGuideProps {
  config: InvestigationGuideConfig
  currentStepIndex: number
  consultedTables: Set<string>
}

export function InvestigationGuide({ config, currentStepIndex, consultedTables }: InvestigationGuideProps) {
  const step = config.steps[currentStepIndex]
  if (!step) return null

  return (
    <aside className="bg-[#d9ccb0] p-5 text-[#28241d] shadow-2xl">
      <header className="mb-4 border-b border-black/20 pb-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] font-bold tracking-[0.2em] text-[#7b2020]">LINHA ATIVA</p>
          <span className="border border-[#8f826c] px-2 py-1 font-mono text-[8px] text-[#6b6151]">{currentStepIndex + 1} / {config.steps.length}</span>
        </div>
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#292824] font-serif text-xs text-[#ded5c2]">ID</div><div><p className="font-serif font-bold">{config.npcName}</p><p className="font-mono text-[8px] text-[#817663]">INVESTIGAÇÃO EM ANDAMENTO</p></div></div>
      </header>
      <div className="mb-5 border border-[#aa9d84] bg-[#c8ba98]/35 p-3">
        <p className="mb-2 font-mono text-[9px] font-bold tracking-[0.15em] text-[#7b2020]">COMO COMEÇAR</p>
        <ol className="space-y-2 font-serif text-sm leading-5 text-[#51493d]">
          <li className="flex gap-2"><span className="font-mono font-bold text-[#7b2020]">1.</span><span>Leia o objetivo desta etapa.</span></li>
          <li className="flex gap-2"><span className="font-mono font-bold text-[#7b2020]">2.</span><span>{step.suggestedTable ? <>Explore a tabela <strong>{step.suggestedTable}</strong> à esquerda.</> : 'Escolha tabelas que ajudem a responder à pergunta.'}</span></li>
          <li className="flex gap-2"><span className="font-mono font-bold text-[#7b2020]">3.</span><span>Arraste os blocos SQL para montar uma consulta e execute-a.</span></li>
          <li className="flex gap-2"><span className="font-mono font-bold text-[#7b2020]">4.</span><span>Leia os resultados e compare-os com os outros registros. Explorar é permitido.</span></li>
        </ol>
      </div>
      <p className="mb-5 border-l-4 border-[#7b2020] pl-3 font-serif text-sm italic leading-5 text-[#4d4539]">“{step.message}”</p>
      <div className="mb-4"><p className="mb-1 font-mono text-[8px] tracking-[0.18em] text-[#786d59]">OBJETIVO ATUAL</p><h2 className="font-serif text-lg font-bold">{step.title}</h2><p className="mt-2 font-serif text-sm leading-5 text-[#51493d]">{step.objective}</p></div>
      {step.requiredTables.length > 0 && <div className="mb-5 border-t border-black/15 pt-4"><p className="mb-2 font-mono text-[8px] font-bold tracking-[0.16em] text-[#786d59]">REGISTROS A CONFERIR</p><ul className="space-y-2">{step.requiredTables.map((tableName) => { const consulted = consultedTables.has(tableName); return <li key={tableName} className="flex items-center gap-2 font-mono text-[10px]"><span aria-hidden="true" className={consulted ? 'flex h-4 w-4 items-center justify-center bg-[#365c43] text-white' : 'flex h-4 w-4 items-center justify-center border border-[#8f826c] text-[#786d59]'}>{consulted ? '✓' : '·'}</span><span className={consulted ? 'text-[#365c43] line-through' : 'text-[#51493d]'}>{tableName}</span><span className="ml-auto text-[8px] text-[#786d59]">{consulted ? 'CONSULTADA' : 'PENDENTE'}</span></li> })}</ul><p className="mt-2 font-serif text-xs leading-4 text-[#786d59]">A lista orienta a investigação, mas você pode explorar outras tabelas.</p></div>}
      {step.suggestedTable && <div className="border border-[#aa9d84] bg-black/[0.03] p-3"><p className="mb-1 font-mono text-[8px] tracking-[0.18em] text-[#786d59]">PONTO DE PARTIDA</p><p className="font-serif text-sm">A tabela <strong>{step.suggestedTable}</strong> pode ajudar a iniciar a busca.</p></div>}
    </aside>
  )
}
