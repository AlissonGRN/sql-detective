import { MenuOption } from '../components/MenuOption'
import { menuOptions } from '../data/menuOptions'

export function MainMenuPage() {
  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#151512]
        px-5
        py-10
        text-[#28231c]
      "
    >
      <section
        className="
          relative
          mx-auto
          flex
          min-h-[760px]
          max-w-6xl
          items-center
          justify-center
        "
      >
        {/* =================================================
            RECORTE DE JORNAL
        ================================================== */}

        <article
          className="
            absolute
            left-0
            top-10
            hidden
            h-[230px]
            w-[340px]
            -rotate-6
            bg-[#d8d0bb]
            p-5
            opacity-80
            shadow-2xl
            lg:block
          "
        >
          <header
            className="
              mb-3
              border-b-[3px]
              border-[#37342e]
              pb-2
              text-center
              font-serif
              text-2xl
              font-bold
            "
          >
            THE DAILY REPORT
          </header>

          <h2
            className="
              mb-3
              font-serif
              text-lg
              font-bold
              uppercase
            "
          >
            Obra desaparece de museu
          </h2>

          <p
            className="
              columns-2
              gap-4
              font-serif
              text-[11px]
              leading-4
              text-[#49443a]
            "
          >
            Uma investigação foi iniciada após o
            desaparecimento de uma importante obra durante
            a noite. Registros digitais, câmeras e
            depoimentos estão sendo analisados. Nenhum
            suspeito foi oficialmente acusado.
          </p>
        </article>

        {/* =================================================
            FOTO DECORATIVA
        ================================================== */}

        <article
          className="
            absolute
            right-10
            top-20
            hidden
            w-[190px]
            rotate-6
            bg-[#ebe4d3]
            p-3
            pb-8
            shadow-2xl
            lg:block
          "
        >
          <div
            className="
              flex
              h-[160px]
              items-center
              justify-center
              bg-[#77766e]
              font-serif
              text-xs
              text-[#d3cfc2]
            "
          >
            EVIDÊNCIA
          </div>

          <p
            className="
              mt-3
              text-center
              font-mono
              text-[10px]
            "
          >
            ARQUIVO 04-B
          </p>
        </article>

        {/* =================================================
            DOCUMENTO AO FUNDO
        ================================================== */}

        <article
          className="
            absolute
            bottom-8
            right-0
            hidden
            h-[280px]
            w-[220px]
            -rotate-3
            bg-[#bbb29d]
            p-6
            opacity-50
            shadow-2xl
            lg:block
          "
        >
          <h3
            className="
              mb-5
              border-b
              border-[#625c50]
              pb-2
              font-mono
              text-xs
              font-bold
            "
          >
            RELATÓRIO
          </h3>

          <div className="space-y-4">
            <div className="h-1.5 bg-black/20" />
            <div className="h-1.5 bg-black/20" />
            <div className="h-1.5 w-2/3 bg-black/20" />

            <div className="pt-4">
              <div className="mb-4 h-1.5 bg-black/20" />
              <div className="mb-4 h-1.5 w-3/4 bg-black/20" />
              <div className="h-1.5 bg-black/20" />
            </div>
          </div>
        </article>

        {/* =================================================
            PASTA PRINCIPAL
        ================================================== */}

        <section
          className="
            relative
            z-10
            w-full
            max-w-[580px]
            -rotate-1
            bg-[#c7a66d]
            px-8
            pb-10
            pt-16
            shadow-[0_25px_60px_rgba(0,0,0,0.55)]
            md:px-14
          "
        >
          {/* Aba da pasta */}

          <div
            className="
              absolute
              -top-7
              left-0
              h-8
              w-48
              rounded-t-md
              bg-[#c7a66d]
            "
          />

          {/* Clipe */}

          <div
            className="
              absolute
              left-[-9px]
              top-36
              h-16
              w-4
              rounded-full
              border-[3px]
              border-[#777]
              opacity-70
            "
          />

          {/* Carimbo */}

          <div
            className="
              absolute
              right-8
              top-10
              rotate-12
              border-[3px]
              border-[#781e1eb3]
              px-3
              py-2
              font-mono
              text-[10px]
              font-bold
              tracking-[0.15em]
              text-[#781e1ecc]
            "
          >
            CONFIDENCIAL
          </div>

          {/* Cabeçalho */}

          <p
            className="
              mb-6
              font-mono
              text-[11px]
              tracking-[0.25em]
              text-[#554831]
            "
          >
            DIVISÃO DE INVESTIGAÇÕES
          </p>

          <h1
            className="
              mb-4
              font-serif
              text-5xl
              font-bold
              uppercase
              leading-[0.9]
              text-[#201d18]
              md:text-6xl
            "
          >
            SQL
            <span
              className="
                block
                text-[#7b2020]
              "
            >
              Detective
            </span>
          </h1>

          <p
            className="
              mb-9
              max-w-md
              font-mono
              text-xs
              leading-5
              text-[#594d39]
            "
          >
            Consulte os dados. Analise os registros.
            Descubra o que realmente aconteceu.
          </p>

          {/* Menu */}

          <nav className="flex flex-col gap-3">
            {menuOptions.map((option) => (
              <MenuOption
                key={option.to}
                label={option.label}
                to={option.to}
                primary={option.primary}
              />
            ))}
          </nav>

          {/* Rodapé */}

          <footer
            className="
              mt-8
              flex
              items-center
              justify-between
              border-t
              border-black/20
              pt-4
              font-mono
              text-[9px]
              text-[#675a43]
            "
          >
            <span>
              ARQUIVO: SQLD-001
            </span>

            <span>
              ACESSO AUTORIZADO
            </span>
          </footer>
        </section>
      </section>
    </main>
  )
}