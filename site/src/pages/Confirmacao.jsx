import { Link, Navigate, useLocation } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'

// Confirmação exibida depois que a solicitação foi registrada (RF024, RN014).
export default function Confirmacao() {
  const { state } = useLocation()
  const s = state?.solicitacao
  if (!s) return <Navigate to="/minha-conta" replace />

  return (
    <div className="container pagina pagina-estreita">
      <div className="card card-corpo confirmacao">
        <div className="confirmacao-icone" aria-hidden="true">✓</div>
        <h1>Solicitação enviada!</h1>
        <p>
          Sua solicitação <strong>#{s.id}</strong> foi registrada. Nossa equipe vai analisar e enviar
          o orçamento pelo e-mail <strong>{s.email}</strong>.
        </p>
        <dl className="info">
          <dt>Produto</dt><dd>{s.produtoNome}</dd>
          <dt>Quantidade</dt><dd>{s.quantidade}</dd>
          <dt>Status</dt><dd><StatusBadge status={s.status} /></dd>
        </dl>
        <div className="acoes">
          <Link to={`/minha-conta/solicitacoes/${s.id}`} className="botao">Acompanhar solicitação</Link>
          <Link to="/produtos" className="botao botao-contorno">Continuar navegando</Link>
        </div>
      </div>
    </div>
  )
}
