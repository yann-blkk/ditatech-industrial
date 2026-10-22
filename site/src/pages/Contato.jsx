import { useState } from 'react'
import Campo from '../components/Campo'
import { CONTATO } from '../data/solucoes'
import { emailValido, verificarObrigatorios } from '../utils/validacao'

// Informações de contato (RF023) e formulário para falar com especialista.
export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
  const [erros, setErros] = useState({})
  const [enviado, setEnviado] = useState(false)

  const alterar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  function enviar(e) {
    e.preventDefault()
    const novosErros = verificarObrigatorios(form, ['nome', 'email', 'mensagem'])
    if (form.email && !emailValido(form.email)) novosErros.email = 'Informe um e-mail válido.'
    setErros(novosErros)
    if (Object.keys(novosErros).length === 0) {
      setEnviado(true)
      setForm({ nome: '', email: '', assunto: '', mensagem: '' })
    }
  }

  return (
    <div className="container pagina">
      <h1>Contato</h1>
      <p className="subtitulo">Fale com um especialista da DitaTech.</p>

      <div className="duas-colunas">
        <div className="card card-corpo">
          <h2 className="titulo-pequeno">Nossos canais</h2>
          <dl className="info">
            <dt>Telefone</dt><dd>{CONTATO.telefone}</dd>
            <dt>WhatsApp</dt><dd>{CONTATO.whatsapp}</dd>
            <dt>E-mail</dt><dd>{CONTATO.email}</dd>
            <dt>Endereço</dt><dd>{CONTATO.endereco}</dd>
            <dt>Atendimento</dt><dd>{CONTATO.horario}</dd>
          </dl>
        </div>

        <form className="card card-corpo" onSubmit={enviar} noValidate>
          <h2 className="titulo-pequeno">Envie uma mensagem</h2>
          {enviado && (
            <div className="alerta alerta-sucesso">
              Mensagem enviada! Um especialista entrará em contato em breve.
            </div>
          )}
          <Campo rotulo="Nome" nome="nome" obrigatorio value={form.nome} onChange={alterar} erro={erros.nome} />
          <Campo rotulo="E-mail" nome="email" tipo="email" obrigatorio value={form.email} onChange={alterar} erro={erros.email} />
          <Campo rotulo="Assunto" nome="assunto" value={form.assunto} onChange={alterar} />
          <Campo rotulo="Mensagem" nome="mensagem" tipo="textarea" obrigatorio value={form.mensagem} onChange={alterar} erro={erros.mensagem} />
          <button className="botao" type="submit">Enviar mensagem</button>
        </form>
      </div>
    </div>
  )
}
