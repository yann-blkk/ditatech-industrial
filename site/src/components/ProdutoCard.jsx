import { Link } from 'react-router-dom'
import ProdutoImagem from './ProdutoImagem'

export default function ProdutoCard({ produto }) {
  return (
    <article className="card produto-card">
      <ProdutoImagem produto={produto} />
      <div className="card-corpo">
        <span className="etiqueta">{produto.categoria}</span>
        <h3>{produto.nome}</h3>
        <p>{produto.resumo}</p>
        <Link to={`/produtos/${produto.id}`} className="botao botao-contorno botao-bloco">
          Ver detalhes
        </Link>
      </div>
    </article>
  )
}
