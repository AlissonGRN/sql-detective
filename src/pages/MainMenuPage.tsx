import { Link } from 'react-router'

export function MainMenuPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#151512] text-[#e8e1d2]">
      <div className="text-center">
        <h1 className="font-serif text-5xl font-bold">
          SQL <span className="text-[#9e3030]">Detective</span>
        </h1>

        <p className="mt-4 font-mono text-sm text-neutral-500">
          Investigue. Consulte os dados. Encontre o culpado.
        </p>

        <Link
          to="/cases"
          className="mt-8 inline-block bg-[#7d2929] px-6 py-3 font-mono text-sm font-bold transition hover:bg-[#963232]"
        >
          INICIAR INVESTIGAÇÃO
        </Link>
      </div>
    </main>
  )
}