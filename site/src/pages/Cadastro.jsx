import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import { useAuth } from '../context/AuthContext'
import { emailValido, telefoneValido, verificarObrigatorios } from '../utils/validacao'

// Cadastro de cliente (RF001, RN010, RN011, RN012).
export default function Cadastro() {
  const { cadastrar } = useAuth()
  const navegar = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', telefone: '', senha: '', confirmar: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function validar() {
    const e = verificarObrigatorios(form, ['nome', 'empresa', 'email', 'telefone', 'senha', 'confirmar'])
    if (form.email && !emailValido(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) e.telefone = 'Informe um telefone com DDD.'
    if (form.senha && form.senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres.'
    if (form.confirmar && form.confirmar !== form.senha) e.confirmar = 'As senhas não conferem.'
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
      await cadastrar(form)
      navegar(state?.voltarPara || '/minha-conta', { replace: true })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container pagina pagina-auth">
      <form className="card card-corpo" onSubmit={enviar} noValidate>
        <h1>Criar conta</h1>
        <p className="subtitulo">Cadastre sua empresa para solicitar e acompanhar orçamentos.</p>
        {erroGeral && <div className="alerta alerta-erro">{erroGeral}</div>}

        <Campo rotulo="Nome completo" nome="nome" obrigatorio value={form.nome} onChange={alterar} erro={erros.nome} />
        <Campo rotulo="Empresa" nome="empresa" obrigatorio value={form.empresa} onChange={alterar} erro={erros.empresa} />
        <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio autoComplete="email" value={form.email} onChange={alterar} erro={erros.email} />
        <Campo rotulo="Telefone" nome="telefone" tipo="tel" obrigatorio placeholder="(11) 90000-0000" value={form.telefone} onChange={alterar} erro={erros.telefone} />
        <Campo rotulo="Senha" nome="senha" tipo="password" obrigatorio autoComplete="new-password" value={form.senha} onChange={alterar} erro={erros.senha} />
        <Campo rotulo="Confirmar senha" nome="confirmar" tipo="password" obrigatorio autoComplete="new-password" value={form.confirmar} onChange={alterar} erro={erros.confirmar} />

        <button className="botao botao-bloco" type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <div className="links-auth">
          <span>Já tem conta?</span>
          <Link to="/login" state={state}>Entrar</Link>
        </div>
      </form>
    </div>
  )
}
