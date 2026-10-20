import { useState } from 'react'

interface GameplayTutorialProps {
  onClose: () => void
}

const pages = [
  {
    title: 'Sua missão é investigar',
    body: 'O Inspetor Duarte apresenta um objetivo por vez. Você deve encontrar pistas nos registros do banco de dados e descobrir quem está mentindo.',
    action: 'Leia o objetivo atual e abra a tabela sugerida para conhecer suas colunas.',
  },
  {
    title: 'Monte sua primeira consulta',
    body: 'Clique nos blocos na ordem SELECT → * → FROM → nome_da_tabela. Os blocos aparecem na área de montagem, e o SQL gerado é exibido logo abaixo.',
    action: 'Depois, use WHERE, uma coluna, um operador e um valor para filtrar os registros.',
  },
  {
    title: 'Execute, observe e avance',
    body: 'Clique em EXECUTAR CONSULTA. O resultado aparecerá abaixo dos blocos. Quando a consulta responder ao objetivo, a investigação avança. Se não funcionar, leia a mensagem e tente novamente.',
    action: 'Se estiver perdido, use PEDIR DICA no painel do Inspetor. Você só poderá acusar alguém depois de investigar.',
  },
]

export function GameplayTutorial({ onClose }: GameplayTutorialProps) {
  const [index, setIndex] = useState(0)
  const page = pages[index]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="w-full max-w-xl border border-[#a18b68] bg-[#d9ccb0] p-6 text-[#29251f] shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-widest text-[#7b2020]">COMO JOGAR · {index + 1}/{pages.length}</span>
          <button type="button" onClick={onClose} className="font-mono text-xs underline">PULAR TUTORIAL</button>
        </div>
        <h2 id="tutorial-title" className="mb-4 font-serif text-3xl font-bold">{page.title}</h2>
        <p className="mb-5 text-base leading-7">{page.body}</p>
        <div className="mb-7 border-l-4 border-[#7b2020] bg-black/5 p-4 text-sm leading-6">
          <strong>O que fazer:</strong> {page.action}
        </div>
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="border border-[#9e8d72] px-4 py-3 font-mono text-xs disabled:opacity-30">VOLTAR</button>
          <button type="button" onClick={() => index === pages.length - 1 ? onClose() : setIndex((value) => value + 1)} className="bg-[#7b2020] px-5 py-3 font-mono text-xs font-bold text-white">{index === pages.length - 1 ? 'COMEÇAR INVESTIGAÇÃO' : 'PRÓXIMO →'}</button>
        </div>
      </section>
    </div>
  )
}
