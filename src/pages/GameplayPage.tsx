import { Link } from 'react-router'

export function GameplayPage() {
  return (
    <main className="min-h-screen bg-[#151512] p-10 text-[#e8e1d2]">
      <Link
        to="/cases"
        className="font-mono text-xs text-neutral-500 hover:text-white"
      >
        ← ARQUIVO DE CASOS
      </Link>

      <h1 className="mt-10 font-serif text-4xl font-bold">
        O Quadro Desaparecido
      </h1>

      <p className="mt-4 font-mono text-neutral-500">
        Tela de investigação
      </p>
    </main>
  )
}