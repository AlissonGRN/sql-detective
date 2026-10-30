import type { SqlQueryResult } from '../types/query'

interface QueryResultsProps {
  result: SqlQueryResult | null
  error: string | null
  isDatabaseLoading: boolean
}

export function QueryResults({ result, error, isDatabaseLoading }: QueryResultsProps) {
  return (
    <section className="border border-[#625c50] bg-[#d9ccb0] p-4 text-[#28241d] shadow-xl sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-[#786d59]">RESULTADO DA ÚLTIMA CONSULTA</p>
          <h2 className="font-serif text-xl font-bold sm:text-2xl">Dados retornados</h2>
        </div>
        {result && !error && <span className="font-mono text-[10px] text-[#786d59]">{result.rows.length} {result.rows.length === 1 ? 'registro' : 'registros'}</span>}
      </header>
      {isDatabaseLoading && <EmptyState>Preparando banco de dados...</EmptyState>}
      {!isDatabaseLoading && error && (
        <div className="border border-[#7b2020] bg-[#7b2020]/10 p-4">
          <p className="mb-1 font-mono text-[9px] font-bold tracking-widest text-[#7b2020]">ERRO NA CONSULTA</p>
          <p className="font-mono text-xs leading-5">{error}</p>
        </div>
      )}
      {!isDatabaseLoading && !error && !result && <EmptyState>Execute sua consulta para ver os registros aqui.</EmptyState>}
      {!isDatabaseLoading && !error && result && result.rows.length === 0 && <EmptyState>Nenhum registro encontrado. Confira os filtros e tente novamente.</EmptyState>}
      {!isDatabaseLoading && !error && result && result.rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse font-mono text-xs">
            <thead><tr>{result.columns.map(column => <th key={column} className="whitespace-nowrap border border-[#46423a] bg-[#302e29] px-3 py-3 text-left text-[#eee5d2]">{column}</th>)}</tr></thead>
            <tbody>
              {result.rows.map((row,rowIndex) => (
                <tr key={rowIndex} className="hover:bg-black/5">
                  {row.map((value,columnIndex) => <td key={columnIndex} className="border border-[#b3a78d] px-3 py-3 align-top">{value === null ? 'NULL' : value}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[110px] items-center justify-center border border-dashed border-[#aa9d84] px-4 py-5 text-center"><p className="text-xs leading-5 text-[#8a7f6c]">{children}</p></div>
}
