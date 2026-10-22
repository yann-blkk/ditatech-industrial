import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProdutoImagem from '../components/ProdutoImagem'
import { buscarProduto } from '../services/api'

// Detalhes e especificações técnicas do produto (RF007, RF008).
export default function ProdutoDetalhe() {
  const { id } = useParams()
  const [produto, setProduto] = useState(undefined)

  useEffect(() => {
    buscarProduto(id).then(setProduto)
  }, [id])

  if (produto === undefined) return <p className="container pagina">Carregando...</p>

  if (!produto) {
    return (
      <div className="container pagina">
        <h1>Produto não encontrado</h1>
        <Link to="/produtos">← Voltar aos produtos</Link>
      </div>
    )
  }

  return (
    <div className="container pagina">
      <Link to="/produtos" className="voltar">← Voltar aos produtos</Link>

      <div className="detalhe">
        <ProdutoImagem produto={produto} grande credito />

        <div>
          <span className="etiqueta">{produto.categoria}</span>
          <h1>{produto.nome}</h1>
          <p>{produto.descricao}</p>

          {produto.caracteristicas?.length > 0 && (
            <>
              <h2 className="titulo-pequeno">Características</h2>
              <ul className="lista">
                {produto.caracteristicas.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}

          <Link to={`/orcamento?produto=${produto.id}`} className="botao">
            Solicitar orçamento
          </Link>
        </div>
      </div>

      {produto.especificacoes && Object.keys(produto.especificacoes).length > 0 && (
        <section className="secao">
          <h2>Especificações técnicas</h2>
          <table className="tabela">
            <tbody>
              {Object.entries(produto.especificacoes).map(([chave, valor]) => (
                <tr key={chave}>
                  <th>{chave}</th>
                  <td>{valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
