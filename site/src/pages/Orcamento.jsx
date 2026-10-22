import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Campo from '../components/Campo'
import { useAuth } from '../context/AuthContext'
import { criarSolicitacao, listarProdutos } from '../services/api'
import { emailValido, quantidadeValida, telefoneValido, verificarObrigatorios } from '../utils/validacao'

// Formulário de solicitação de orçamento (RF009–RF012, RN001–RN003, RN012, RN014).
// Esta página só é aberta por usuários logados (ver RotaProtegida em App.jsx).
export default function Orcamento() {
  const { usuario } = useAuth()
  const [params] = useSearchParams()
  const navegar = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState({
    produtoId: params.get('produto') || '',
    quantidade: '1',
    nome: usuario?.nome || '',
    empresa: usuario?.empresa || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    mensagem: '',
  })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    listarProdutos().then(setProdutos)
  }, [])

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function validar() {
    const e = verificarObrigatorios(form, ['produtoId', 'quantidade', 'nome', 'email', 'telefone'])
    if (form.quantidade && !quantidadeValida(form.quantidade)) {
      e.quantidade = 'Informe um número inteiro maior que zero.'
    }
    if (form.email && !emailValido(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) e.telefone = 'Informe um telefone com DDD.'
    return e
  }

  async function enviar(e) {
    e.preventDefault()
    setErroGeral('')
    const novosErros = validar()
    setErros(novosErros)
    if (Object.keys(novosErros).length) return

    setEnviando(true)
    try {
      const solicitacao = await criarSolicitacao(form)
      navegar('/orcamento/confirmacao', { state: { solicitacao } })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container pagina pagina-estreita">
      <h1>Solicitar orçamento</h1>
      <p className="subtitulo">
        Preencha os dados abaixo. Campos com <span className="obrigatorio">*</span> são obrigatórios.
      </p>

      <form className="card card-corpo" onSubmit={enviar} noValidate>
        {erroGeral && <div className="alerta alerta-erro">{erroGeral}</div>}

        <Campo rotulo="Produto / equipamento" nome="produtoId" obrigatorio erro={erros.produtoId}>
          {(props) => (
            <select {...props} value={form.produtoId} onChange={alterar}>
              <option value="">Selecione um produto</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          )}
        </Campo>

        <Campo rotulo="Quantidade" nome="quantidade" tipo="number" min="1" step="1" obrigatorio value={form.quantidade} onChange={alterar} erro={erros.quantidade} />

        <div className="duas-colunas">
          <Campo rotulo="Nome" nome="nome" obrigatorio value={form.nome} onChange={alterar} erro={erros.nome} />
          <Campo rotulo="Empresa" nome="empresa" value={form.empresa} onChange={alterar} />
          <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio value={form.email} onChange={alterar} erro={erros.email} />
          <Campo rotulo="Telefone" nome="telefone" tipo="tel" obrigatorio value={form.telefone} onChange={alterar} erro={erros.telefone} />
        </div>

        <Campo
          rotulo="Descreva sua necessidade"
          nome="mensagem"
          tipo="textarea"
          placeholder="Ex.: aplicação, ambiente de instalação, prazo desejado..."
          value={form.mensagem}
          onChange={alterar}
        />

        <button className="botao" type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar solicitação'}
        </button>
      </form>
    </div>
  )
}
