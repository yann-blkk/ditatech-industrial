import { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import { Alerta, Botao, Campo, s } from '../components/ui'
import { recuperarSenha } from '../services/api'

// Recuperação de senha (RF003) — simulada.
export default function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    setErro('')
    setMensagem('')
    setEnviando(true)
    try {
      setMensagem(await recuperarSenha(email))
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={s.subtitulo}>Informe o e-mail da sua conta para receber as instruções.</Text>
      <Alerta tipo="sucesso" texto={mensagem} />
      <Campo rotulo="E-mail" obrigatorio value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" erro={erro} />
      <Botao titulo="Enviar instruções" onPress={enviar} carregando={enviando} />
    </ScrollView>
  )
}
