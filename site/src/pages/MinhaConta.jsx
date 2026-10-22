import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { atualizarPerfil, minhasSolicitacoes } from '../services/api'
import { emailValido, telefoneValido, verificarObrigatorios } from '../utils/validacao'

// Área do cliente: solicitações (RF013, RF014), dados cadastrais (RF015) e sair (RF016).
export default function MinhaConta() {
  const { usuario, sair } = useAuth()
  const navegar = useNavigate()
  const [aba, setAba] = useState('solicitacoes')

  async function handleSair() {
    await sair()
    navegar('/')
  }

  return (
    <div className="container pagina">
      <div className="secao-topo">
        <div>
          <h1>Olá, {usuario.nome.split(' ')[0]}</h1>
          <p className="subtitulo">{usuario.empresa}</p>
        </div>
        <button className="botao botao-contorno" onClick={handleSair}>Sair da conta</button>
      </div>

      <div className="abas" role="tablist">
        <button role="tab" aria-selected={aba === 'solicitacoes'} className={aba === 'solicitacoes' ? 'aba-ativa' : ''} onClick={() => setAba('solicitacoes')}>
          Minhas solicitações
        </button>
        <button role="tab" aria-selected={aba === 'dados'} className={aba === 'dados' ? 'aba-ativa' : ''} onClick={() => setAba('dados')}>
          Meus dados
        </button>
      </div>

      {aba === 'solicitacoes' ? <ListaSolicitacoes /> : <MeusDados />}
    </div>
  )
}

function ListaSolicitacoes() {
  const [lista, setLista] = useState(null)

  useEffect(() => {
    minhasSolicitacoes().then(setLista)
  }, [])

  if (!lista) return <p>Carregando...</p>

  if (lista.length === 0) {
    return (
      <div className="vazio">
        <p>Você ainda não fez nenhuma solicitação.</p>
        <Link to="/produtos" className="botao">Ver produtos</Link>
      </div>
    )
  }

  return (
    <>
      <div className="secao-topo">
        <p className="contador">{lista.length} solicitação(ões)</p>
        <Link to="/orcamento" className="botao botao-pequeno">+ Nova solicitação</Link>
      </div>
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Produto</th>
              <th>Qtd.</th>
              <th>Data</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((s) => (
              <tr key={s.id}>
                <td>#{s.id}</td>
                <td>{s.produtoNome}</td>
                <td>{s.quantidade}</td>
                <td>{new Date(s.criadaEm).toLocaleDateString('pt-BR')}</td>
                <td><StatusBadge status={s.status} /></td>
                <td><Link to={`/minha-conta/solicitacoes/${s.id}`}>Detalhes</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function MeusDados() {
  const { usuario, atualizar } = useAuth()
  const [form, setForm] = useState({
    nome: usuario.nome,
    empresa: usuario.empresa,
    email: usuario.email,
    telefone: usuario.telefone,
    novaSenha: '',
  })
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function salvar(e) {
    e.preventDefault()
    setMensagem({ tipo: '', texto: '' })
    const novosErros = verificarObrigatorios(form, ['nome', 'empresa', 'email', 'telefone'])
    if (form.email && !emailValido(form.email)) novosErros.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) novosErros.telefone = 'Informe um telefone com DDD.'
    if (form.novaSenha && form.novaSenha.length < 6) novosErros.novaSenha = 'Mínimo de 6 caracteres.'
    setErros(novosErros)
    if (Object.keys(novosErros).length) return

    try {
      const u = await atualizarPerfil(form)
      atualizar(u)
      setForm({ ...form, novaSenha: '' })
      setMensagem({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso.' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    }
  }

  return (
    <form className="card card-corpo pagina-estreita" onSubmit={salvar} noValidate>
      {mensagem.texto && <div className={`alerta alerta-${mensagem.tipo}`}>{mensagem.texto}</div>}
      <Campo rotulo="Nome" nome="nome" obrigatorio value={form.nome} onChange={alterar} erro={erros.nome} />
      <Campo rotulo="Empresa" nome="empresa" obrigatorio value={form.empresa} onChange={alterar} erro={erros.empresa} />
      <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio value={form.email} onChange={alterar} erro={erros.email} />
      <Campo rotulo="Telefone" nome="telefone" tipo="tel" obrigatorio value={form.telefone} onChange={alterar} erro={erros.telefone} />
      <Campo rotulo="Nova senha (opcional)" nome="novaSenha" tipo="password" autoComplete="new-password" value={form.novaSenha} onChange={alterar} erro={erros.novaSenha} />
      <button className="botao" type="submit">Salvar alterações</button>
    </form>
  )
}
