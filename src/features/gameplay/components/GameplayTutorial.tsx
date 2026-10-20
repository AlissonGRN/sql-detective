import { useState } from 'react'

interface GameplayTutorialProps { onClose: () => void }
const pages = [
  { title: 'Sua missão é investigar', body: 'O Inspetor apresenta um objetivo por vez. Encontre evidências nos registros e compare o que os dados mostram com os depoimentos.', action: 'Leia o objetivo. A tabela sugerida é um ponto de partida, não o único caminho.' },
  { title: 'Explore as tabelas', body: 'Abra as tabelas para conhecer colunas e registros. Os dados ajudam você a formular perguntas melhores.', action: 'Consultas exploratórias são permitidas. Se o resultado vier vazio, revise os filtros.' },
  { title: 'Arraste os blocos SQL', body: 'Arraste blocos da paleta para a área de montagem. Solte-os na ordem desejada. Você também pode clicar nos blocos e arrastar os blocos montados para reorganizá-los.', action: 'Comece com SELECT → * → FROM → tabela. Clique em um bloco montado para removê-lo.' },
  { title: 'Interprete antes de acusar', body: 'Execute a consulta e leia as linhas retornadas. Uma consulta válida pode não responder à pergunta; compare diferentes registros e depoimentos.', action: 'Uma acusação errada não encerra o caso. Volte aos dados e continue investigando.' },
]
export function GameplayTutorial({ onClose }: GameplayTutorialProps) {
  const [index, setIndex] = useState(0)
  const page = pages[index]
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-labelledby="tutorial-title"><section className="w-full max-w-xl border border-[#a18b68] bg-[#d9ccb0] p-6 text-[#29251f] shadow-2xl sm:p-8"><div className="mb-5 flex items-center justify-between"><span className="font-mono text-[10px] font-bold tracking-widest text-[#7b2020]">COMO JOGAR · {index + 1}/{pages.length}</span><button type="button" onClick={onClose} className="font-mono text-xs underline">PULAR TUTORIAL</button></div><h2 id="tutorial-title" className="mb-4 font-serif text-3xl font-bold">{page.title}</h2><p className="mb-5 text-base leading-7">{page.body}</p><div className="mb-7 border-l-4 border-[#7b2020] bg-black/5 p-4 text-sm leading-6"><strong>Experimente:</strong> {page.action}</div><div className="flex items-center justify-between gap-4"><button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="border border-[#9e8d72] px-4 py-3 font-mono text-xs disabled:opacity-30">VOLTAR</button><button type="button" onClick={() => index === pages.length - 1 ? onClose() : setIndex((value) => value + 1)} className="bg-[#7b2020] px-5 py-3 font-mono text-xs font-bold text-white">{index === pages.length - 1 ? 'COMEÇAR INVESTIGAÇÃO' : 'PRÓXIMO →'}</button></div></section></div>
}
