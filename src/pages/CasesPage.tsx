import { Link } from 'react-router'

export function CasesPage() {
  return (
    <main className="min-h-screen bg-[#151512] p-10 text-[#e8e1d2]">
      <h1 className="font-serif text-4xl font-bold">
        Arquivo de Casos
      </h1>

      <p className="mt-3 font-mono text-sm text-neutral-500">
        Selecione uma investigação.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          to="/cases/case-001"
          className="bg-[#c5a56e] p-6 text-[#28231b]"
        >
          <p className="font-mono text-xs">
            CASO #001
          </p>

          <h2 className="mt-4 font-serif text-2xl font-bold">
            O Quadro Desaparecido
          </h2>
        </Link>
      </div>
    </main>
  )
}