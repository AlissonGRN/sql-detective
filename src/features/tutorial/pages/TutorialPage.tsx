import { Link } from 'react-router'

export function TutorialPage() {
  return (
    <main
      className="
        min-h-screen
        bg-[#151512]
        px-8
        py-10
        text-[#e8e1d2]
      "
    >
      <Link
        to="/"
        className="
          font-mono
          text-xs
          text-neutral-500
          transition
          hover:text-white
        "
      >
        ← MENU PRINCIPAL
      </Link>

      <div className="mx-auto mt-20 max-w-3xl">
        <p
          className="
            mb-2
            font-mono
            text-xs
            tracking-[0.2em]
            text-[#9e3030]
          "
        >
          TREINAMENTO
        </p>

        <h1 className="font-serif text-4xl font-bold">
          Tutorial
        </h1>

        <p className="mt-4 text-neutral-500">
          O tutorial será implementado posteriormente.
        </p>
      </div>
    </main>
  )
}