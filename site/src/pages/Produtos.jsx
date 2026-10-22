import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProdutoCard from '../components/ProdutoCard'
import { CATEGORIAS } from '../data/produtos'
import { listarProdutos } from '../services/api'

// Catálogo com busca por nome (RF005) e filtro por categoria (RF006).
export default function Produtos() {
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') || ''
  // O texto da busca fica em um estado local para a digitação não "travar".
  const [busca, setBusca] = useState(params.get('busca') || '')
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    listarProdutos({ busca, categoria }).then(setProdutos)
  }, [busca, categoria])

  function alterarBusca(valor) {
    setBusca(valor)
    alterarFiltro('busca', valor)
  }

  // Mantém busca e categoria na URL para o link poder ser compartilhado.
  function alterarFiltro(chave, valor) {
    const novos = new URLSearchParams(params)
    if (valor) novos.set(chave, valor)
    else novos.delete(chave)
    setParams(novos, { replace: true })
  }

  return (
    <div className="container pagina">
      <h1>Produtos e equipamentos</h1>
      <p className="subtitulo">Encontre o equipamento ideal para automatizar seu processo.</p>

      <div className="filtros">
        <input
          type="search"
          placeholder="Pesquisar por nome..."
          aria-label="Pesquisar produtos por nome"
          value={busca}
          onChange={(e) => alterarBusca(e.target.value)}
        />
        <div className="chips" role="group" aria-label="Filtrar por categoria">
          <button
            className={`chip ${!categoria ? 'chip-ativo' : ''}`}
            onClick={() => alterarFiltro('categoria', '')}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className={`chip ${categoria === c ? 'chip-ativo' : ''}`}
              onClick={() => alterarFiltro('categoria', c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="contador">{produtos.length} produto(s) encontrado(s)</p>

      {produtos.length === 0 ? (
        <div className="vazio">Nenhum produto encontrado. Tente outro nome ou categoria.</div>
      ) : (
        <div className="grade-3">
          {produtos.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </div>
  )
}
