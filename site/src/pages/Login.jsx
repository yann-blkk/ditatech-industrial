import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import { useAuth } from '../context/AuthContext'
import { verificarObrigatorios } from '../utils/validacao'

// Login (RF002). Se o usuário veio de uma página protegida, volta para ela.
export default function Login() {
  const { entrar } = useAuth()
  const navegar = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function enviar(e) {
    e.preventDefault()
    setErroGeral('')
    const novosErros = verificarObrigatorios(form, ['email', 'senha'])
    setErros(novosErros)
    if (Object.keys(novosErros).length) return

    setEnviando(true)
    try {
      const usuario = await entrar(form.email, form.senha)
      const destino = state?.voltarPara || (usuario.perfil === 'admin' ? '/admin' : '/minha-conta')
      navegar(destino, { replace: true })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container pagina pagina-auth">
      <form className="card card-corpo" onSubmit={enviar} noValidate>
        <h1>Entrar</h1>
        {state?.voltarPara && (
          <div className="alerta alerta-info">
            Faça login ou cadastre-se para continuar.
          </div>
        )}
        {erroGeral && <div className="alerta alerta-erro">{erroGeral}</div>}

        <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio autoComplete="email" value={form.email} onChange={alterar} erro={erros.email} />
        <Campo rotulo="Senha" nome="senha" tipo="password" obrigatorio autoComplete="current-password" value={form.senha} onChange={alterar} erro={erros.senha} />

        <button className="botao botao-bloco" type="submit" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="links-auth">
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
          <Link to="/cadastro" state={state}>Criar conta</Link>
        </div>

        <p className="dica">
          Demonstração — cliente: <code>cliente@empresa.com.br</code> / <code>cliente123</code>
          <br />
          Administrador: <code>admin@ditatech.com.br</code> / <code>admin123</code>
        </p>
      </form>
    </div>
  )
}
