import { useState } from 'react'
import { Link } from 'react-router-dom'
import Campo from '../components/Campo'
import { recuperarSenha } from '../services/api'

// Recuperação de senha (RF003) — simulada.
export default function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  async function enviar(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    try {
      setMensagem(await recuperarSenha(email))
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="container pagina pagina-auth">
      <form className="card card-corpo" onSubmit={enviar} noValidate>
        <h1>Recuperar senha</h1>
        <p className="subtitulo">Informe seu e-mail para receber as instruções.</p>
        {mensagem && <div className="alerta alerta-sucesso">{mensagem}</div>}
        <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio value={email} onChange={(e) => setEmail(e.target.value)} erro={erro} />
        <button className="botao botao-bloco" type="submit">Enviar instruções</button>
        <div className="links-auth">
          <Link to="/login">← Voltar ao login</Link>
        </div>
      </form>
    </div>
  )
}
