import { fotoDoProduto } from '../data/fotos'

// Ícone usado quando o produto não tem foto (ex.: produto novo cadastrado pelo admin).
const ICONES = {
  Sensores: '◉',
  'Controladores (CLP)': '▦',
  Robótica: '⚙',
  'Inversores e Motores': '⟳',
  'IHM e Supervisão': '▭',
  Atuadores: '⇄',
}

export default function ProdutoImagem({ produto, grande = false, credito = false }) {
  const foto = fotoDoProduto(produto.id)
  const classe = `produto-imagem ${grande ? 'produto-imagem-grande' : ''}`

  if (!foto) {
    return (
      <div className={classe} aria-hidden="true">
        <span>{ICONES[produto.categoria] || '⚙'}</span>
      </div>
    )
  }

  return (
    <figure className="produto-figura">
      <div className={classe}>
        <img src={foto.src} alt={produto.nome} loading="lazy" />
      </div>
      {credito && (
        <figcaption className="credito">
          Foto: {foto.autor} ·{' '}
          <a href={foto.fonte} target="_blank" rel="noreferrer">
            {foto.licenca}
          </a>{' '}
          · imagem ilustrativa
        </figcaption>
      )}
    </figure>
  )
}
