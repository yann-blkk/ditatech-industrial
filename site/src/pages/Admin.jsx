import { useEffect, useState } from 'react'
import Campo from '../components/Campo'
import StatusBadge from '../components/StatusBadge'
import { CATEGORIAS } from '../data/produtos'
import {
  STATUS,
  STATUS_CANCELADA,
  alterarStatus,
  listarProdutos,
  removerProduto,
  salvarProduto,
  todasSolicitacoes,
} from '../services/api'

// Área administrativa (RF017–RF021). Protegida por perfil em App.jsx (RN013).
export default function Admin() {
  const [aba, setAba] = useState('solicitacoes')

  return (
    <div className="container pagina">
      <h1>Painel administrativo</h1>
      <div className="abas" role="tablist">
        <button role="tab" aria-selected={aba === 'solicitacoes'} className={aba === 'solicitacoes' ? 'aba-ativa' : ''} onClick={() => setAba('solicitacoes')}>
          Solicitações
        </button>
        <button role="tab" aria-selected={aba === 'produtos'} className={aba === 'produtos' ? 'aba-ativa' : ''} onClick={() => setAba('produtos')}>
          Produtos
        </button>
      </div>
      {aba === 'solicitacoes' ? <AdminSolicitacoes /> : <AdminProdutos />}
    </div>
  )
}

function AdminSolicitacoes() {
  const [lista, setLista] = useState([])
  const [filtro, setFiltro] = useState('')
  const [aviso, setAviso] = useState('')

  const carregar = () => todasSolicitacoes().then(setLista)
  useEffect(() => {
    carregar()
  }, [])

  async function mudar(id, status) {
    await alterarStatus(id, status)
    setAviso(`Solicitação #${id} alterada para “${status}”.`)
    carregar()
  }

  const visiveis = filtro ? lista.filter((s) => s.status === filtro) : lista

  return (
    <>
      {aviso && <div className="alerta alerta-sucesso">{aviso}</div>}
      <div className="filtros">
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          {[...STATUS, STATUS_CANCELADA].map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
      </div>
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Mensagem</th>
              <th>Status</th>
              <th>Alterar status</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((s) => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td>
                  {s.nome}
                  <br />
                  <small>{s.empresa} · {s.email} · {s.telefone}</small>
                </td>
                <td>{s.produtoNome}</td>
                <td>{s.quantidade}</td>
                <td><small>{s.mensagem || '—'}</small></td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  <select value={s.status} onChange={(e) => mudar(s.id, e.target.value)} aria-label={`Status da solicitação ${s.id}`}>
                    {[...STATUS, STATUS_CANCELADA].map((st) => (
                      <option key={st}>{st}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visiveis.length === 0 && <div className="vazio">Nenhuma solicitação.</div>}
      </div>
    </>
  )
}

const PRODUTO_VAZIO = { nome: '', categoria: '', resumo: '', descricao: '', caracteristicas: '', especificacoes: '' }

// Converte o produto para o formato do formulário (listas viram texto, uma linha por item).
function paraFormulario(p) {
  return {
    ...p,
    caracteristicas: (p.caracteristicas || []).join('\n'),
    especificacoes: Object.entries(p.especificacoes || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n'),
  }
}

function deFormulario(f) {
  const linhas = (texto) => texto.split('\n').map((l) => l.trim()).filter(Boolean)
  const especificacoes = {}
  linhas(f.especificacoes).forEach((linha) => {
    const [chave, ...resto] = linha.split(':')
    if (resto.length) especificacoes[chave.trim()] = resto.join(':').trim()
  })
  return { ...f, caracteristicas: linhas(f.caracteristicas), especificacoes }
}

function AdminProdutos() {
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState(null) // null = formulário fechado
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  const carregar = () => listarProdutos().then(setProdutos)
  useEffect(() => {
    carregar()
  }, [])

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    try {
      await salvarProduto(deFormulario(form))
      setAviso(form.id ? 'Produto alterado.' : 'Produto cadastrado.')
      setForm(null)
      carregar()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function remover(p) {
    if (!window.confirm(`Remover "${p.nome}" do catálogo?`)) return
    await removerProduto(p.id)
    setAviso('Produto removido.')
    carregar()
  }

  if (form) {
    return (
      <form className="card card-corpo pagina-estreita" onSubmit={salvar} noValidate>
        <h2>{form.id ? 'Alterar produto' : 'Novo produto'}</h2>
        {erro && <div className="alerta alerta-erro">{erro}</div>}
        <Campo rotulo="Nome" nome="nome" obrigatorio value={form.nome} onChange={alterar} />
        <Campo rotulo="Categoria" nome="categoria" obrigatorio>
          {(props) => (
            <select {...props} value={form.categoria} onChange={alterar}>
              <option value="">Selecione</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
        </Campo>
        <Campo rotulo="Resumo" nome="resumo" obrigatorio value={form.resumo} onChange={alterar} />
        <Campo rotulo="Descrição" nome="descricao" tipo="textarea" obrigatorio value={form.descricao} onChange={alterar} />
        <Campo rotulo="Características (uma por linha)" nome="caracteristicas" tipo="textarea" value={form.caracteristicas} onChange={alterar} />
        <Campo rotulo="Especificações (uma por linha, no formato Nome: valor)" nome="especificacoes" tipo="textarea" placeholder="Alimentação: 24 Vcc" value={form.especificacoes} onChange={alterar} />
        <div className="acoes">
          <button className="botao" type="submit">Salvar</button>
          <button className="botao botao-contorno" type="button" onClick={() => setForm(null)}>Cancelar</button>
        </div>
      </form>
    )
  }

  return (
    <>
      {aviso && <div className="alerta alerta-sucesso">{aviso}</div>}
      <div className="secao-topo">
        <p className="contador">{produtos.length} produto(s)</p>
        <button className="botao botao-pequeno" onClick={() => { setAviso(''); setErro(''); setForm(PRODUTO_VAZIO) }}>
          + Novo produto
        </button>
      </div>
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.categoria}</td>
                <td className="acoes-tabela">
                  <button className="link" onClick={() => { setAviso(''); setErro(''); setForm(paraFormulario(p)) }}>Editar</button>
                  <button className="link link-perigo" onClick={() => remover(p)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
