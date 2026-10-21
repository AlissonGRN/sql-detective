import { Link } from 'react-router'

const lessons = [
  { title: '1. Entenda a missão', body: 'Cada caso apresenta um crime e um objetivo por etapa. Leia a pergunta atual e pense em quais registros podem ajudar a respondê-la. A tabela sugerida é apenas um ponto de partida.' },
  { title: '2. Explore as tabelas', body: 'Abra o banco de dados para conhecer as tabelas, colunas e registros disponíveis. Consultas exploratórias são permitidas; use os dados para formular novas perguntas.' },
  { title: '3. Monte uma consulta SQL', body: 'SELECT escolhe as colunas; FROM indica a tabela; WHERE filtra registros; JOIN combina tabelas relacionadas usando ON. Arraste os blocos para a área de montagem ou clique neles. Você também pode arrastar os blocos montados para reorganizar a consulta.' },
  { title: '4. Execute e interprete', body: 'Execute a consulta e leia os resultados exibidos. Uma consulta sem erro ainda pode não responder à pergunta. Se nenhuma linha aparecer, revise os filtros ou tente outra abordagem.' },
  { title: '5. Conecte as evidências', body: 'Compare horários, acessos, câmeras, pagamentos e depoimentos. Procure contradições e relações entre registros. Sua conclusão deve se apoiar em evidências, não em suposições.' },
  { title: '6. Apresente sua conclusão', body: 'Conclua as etapas da investigação e use Analisar Suspeitos para apresentar uma acusação. Se escolher a pessoa errada, o caso continua aberto: volte aos dados e investigue mais.' },
]

export function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#151512] px-5 py-8 text-[#e8e1d2] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="font-mono text-xs text-neutral-500 transition hover:text-white">← MENU PRINCIPAL</Link>
        <header className="mb-12 mt-16">
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[#9e3030]">MANUAL DO INVESTIGADOR</p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Como jogar</h1>
          <p className="mt-4 max-w-2xl leading-7 text-neutral-400">Um guia único para entender a investigação e usar o construtor SQL. O objetivo não é adivinhar: é analisar os registros e chegar a uma conclusão sustentada por evidências.</p>
        </header>
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <article key={lesson.title} className="grid gap-3 border border-[#39372f] bg-[#25241f] p-5 sm:grid-cols-[64px_1fr]">
              <p className="font-mono text-sm text-[#c5a56e]">{String(index + 1).padStart(2, '0')}</p>
              <div>
                <h2 className="mb-2 font-serif text-xl font-bold">{lesson.title.replace(/^\d+\. /, '')}</h2>
                <p className="text-sm leading-6 text-[#c5bdad]">{lesson.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/cases" className="inline-block bg-[#7b2020] px-6 py-3 font-mono text-xs font-bold text-white">ESCOLHER UM CASO →</Link>
        </div>
      </div>
    </main>
  )
}
