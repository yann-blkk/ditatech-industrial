import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Campo from '../components/Campo'
import StatusBadge from '../components/StatusBadge'
import {
  STATUS,
  STATUS_CANCELADA,
  buscarSolicitacao,
  cancelarSolicitacao,
  editarSolicitacao,
  podeAlterar,
} from '../services/api'
import { quantidadeValida } from '../utils/validacao'

// Acompanhamento da solicitação (RF013), com edição (RN004) e cancelamento (RN005).
export default function SolicitacaoDetalhe() {
  const { id } = useParams()
  const [s, setS] = useState(null)
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ quantidade: '', mensagem: '' })
  const [erroQtd, setErroQtd] = useState('')
  const [aviso, setAviso] = useState('')

  const carregar = useCallback(() => {
    buscarSolicitacao(id)
      .then((dados) => {
        setS(dados)
        setForm({ quantidade: String(dados.quantidade), mensagem: dados.mensagem })
      })
      .catch((e) => setErro(e.message))
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function salvar(e) {
    e.preventDefault()
    if (!quantidadeValida(form.quantidade)) {
      setErroQtd('Informe um número inteiro maior que zero.')
      return
    }
    setErroQtd('')
    try {
      await editarSolicitacao(s.id, form)
      setEditando(false)
      setAviso('Solicitação atualizada.')
      carregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function cancelar() {
    if (!window.confirm(`Cancelar a solicitação #${s.id}?`)) return
    try {
      await cancelarSolicitacao(s.id)
      setAviso('Solicitação cancelada.')
      carregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  if (erro && !s) {
    return (
      <div className="container pagina">
        <div className="alerta alerta-erro">{erro}</div>
        <Link to="/minha-conta">← Voltar</Link>
      </div>
    )
  }
  if (!s) return <p className="container pagina">Carregando...</p>

  const cancelada = s.status === STATUS_CANCELADA
  const etapaAtual = STATUS.indexOf(s.status)

  return (
    <div className="container pagina pagina-estreita">
      <Link to="/minha-conta" className="voltar">← Minhas solicitações</Link>

      <div className="secao-topo">
        <h1>Solicitação #{s.id}</h1>
        <StatusBadge status={s.status} />
      </div>

      {aviso && <div className="alerta alerta-sucesso">{aviso}</div>}
      {erro && <div className="alerta alerta-erro">{erro}</div>}

      {!cancelada && (
        <ol className="linha-tempo" aria-label="Andamento da solicitação">
          {STATUS.map((st, i) => (
            <li key={st} className={i <= etapaAtual ? 'etapa-feita' : ''}>
              <span className="etapa-ponto" />
              {st}
            </li>
          ))}
        </ol>
      )}

      <div className="card card-corpo">
        {editando ? (
          <form onSubmit={salvar} noValidate>
            <Campo rotulo="Quantidade" nome="quantidade" tipo="number" min="1" obrigatorio value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} erro={erroQtd} />
            <Campo rotulo="Descrição da necessidade" nome="mensagem" tipo="textarea" value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} />
            <div className="acoes">
              <button className="botao" type="submit">Salvar</button>
              <button className="botao botao-contorno" type="button" onClick={() => setEditando(false)}>Desistir</button>
            </div>
          </form>
        ) : (
          <>
            <dl className="info">
              <dt>Produto</dt><dd><Link to={`/produtos/${s.produtoId}`}>{s.produtoNome}</Link></dd>
              <dt>Quantidade</dt><dd>{s.quantidade}</dd>
              <dt>Data</dt><dd>{new Date(s.criadaEm).toLocaleString('pt-BR')}</dd>
              <dt>Contato</dt><dd>{s.nome} — {s.email} — {s.telefone}</dd>
              {s.empresa && (<><dt>Empresa</dt><dd>{s.empresa}</dd></>)}
              <dt>Necessidade</dt><dd>{s.mensagem || '—'}</dd>
            </dl>

            {podeAlterar(s) ? (
              <div className="acoes">
                <button className="botao" onClick={() => setEditando(true)}>Alterar solicitação</button>
                <button className="botao botao-perigo" onClick={cancelar}>Cancelar solicitação</button>
              </div>
            ) : (
              !cancelada && (
                <p className="dica">
                  A solicitação já avançou para “{s.status}” e não pode mais ser alterada ou cancelada.
                </p>
              )
            )}
          </>
        )}
      </div>

      <section className="secao">
        <h2 className="titulo-pequeno">Histórico</h2>
        <ul className="historico">
          {[...s.historico].reverse().map((h, i) => (
            <li key={i}>
              <StatusBadge status={h.status} />
              <span>{new Date(h.data).toLocaleString('pt-BR')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
