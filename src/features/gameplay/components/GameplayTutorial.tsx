import { useState } from 'react'

interface GameplayTutorialProps {
  onClose: () => void
}

const pages = [
  {
    title: 'Uma missão por vez',
    body: 'Cada etapa apresenta uma tarefa pequena e explica o conceito SQL necessário. Siga a missão atual; você não precisa resolver toda a investigação de uma vez.',
    tip: 'Leia o objetivo e a explicação antes de montar a consulta. A tabela sugerida é um bom ponto de partida.',
  },
  {
    title: 'Conheça o banco de dados',
    body: 'O banco reúne tabelas. Cada tabela guarda registros, organizados em colunas. Abra “Explorar banco de dados” para ver exemplos e descobrir os nomes das colunas.',
    tip: 'Antes de montar a consulta, observe qual tabela guarda a informação pedida na missão.',
  },
  {
    title: 'Monte a consulta com blocos',
    body: 'Clique nos blocos disponíveis na ordem em que devem aparecer na consulta. Também é possível arrastá-los. Os blocos disponíveis mudam conforme o conteúdo da etapa.',
    tip: 'Comece com SELECT, escolha as colunas, adicione FROM e a tabela. Clique em um bloco já colocado para removê-lo.',
    example: 'SELECT *\nFROM suspects;',
  },
  {
    title: 'Execute e interprete',
    body: 'Clique em “Executar consulta” e leia as linhas retornadas. Uma consulta pode funcionar, mas ainda não responder à missão. O feedback explica o que falta ajustar.',
    tip: 'SELECT escolhe as informações, FROM escolhe a tabela e WHERE filtra os registros. AND combina duas condições. JOIN e ON aparecem apenas quando você chegar ao caso de relacionamentos.',
  },
]

export function GameplayTutorial({ onClose }: GameplayTutorialProps) {
  const [index, setIndex] = useState(0)
  const page = pages[index]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="w-full max-w-xl border border-[#a18b68] bg-[#d9ccb0] p-5 text-[#29251f] shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-bold tracking-widest text-[#7b2020]">GUIA RÁPIDO · {index + 1}/{pages.length}</span>
          <button type="button" onClick={onClose} className="font-mono text-xs underline">FECHAR</button>
        </div>
        <h2 id="tutorial-title" className="mb-3 font-serif text-2xl font-bold sm:text-3xl">{page.title}</h2>
        <p className="mb-5 text-sm leading-6 sm:text-base sm:leading-7">{page.body}</p>
        {page.example && (
          <pre className="mb-5 overflow-x-auto bg-[#292824] p-4 font-mono text-sm leading-6 text-[#e6dfcc]"><code>{page.example}</code></pre>
        )}
        <div className="mb-7 border-l-4 border-[#7b2020] bg-black/5 p-4 text-sm leading-6"><strong>Dica:</strong> {page.tip}</div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0} className="border border-[#9e8d72] px-4 py-3 font-mono text-xs disabled:opacity-30">ANTERIOR</button>
          <button type="button" onClick={() => index === pages.length - 1 ? onClose() : setIndex(value => value + 1)} className="bg-[#7b2020] px-5 py-3 font-mono text-xs font-bold text-white">
            {index === pages.length - 1 ? 'COMEÇAR' : 'PRÓXIMO →'}
          </button>
        </div>
      </section>
    </div>
  )
}
