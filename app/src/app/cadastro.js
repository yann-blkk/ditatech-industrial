import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Alerta, Botao, Campo, s } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { emailValido, telefoneValido, verificarObrigatorios } from '../utils/validacao'

// Cadastro de cliente (RF001, RN010, RN011, RN012).
export default function Cadastro() {
  const { cadastrar } = useAuth()
  const { voltarPara } = useLocalSearchParams()
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', telefone: '', senha: '', confirmar: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  const alterar = (campo) => (valor) => setForm({ ...form, [campo]: valor })

  async function enviar() {
    setErroGeral('')
    const e = verificarObrigatorios(form, ['nome', 'empresa', 'email', 'telefone', 'senha', 'confirmar'])
    if (form.email && !emailValido(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) e.telefone = 'Informe um telefone com DDD.'
    if (form.senha && form.senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres.'
    if (form.confirmar && form.confirmar !== form.senha) e.confirmar = 'As senhas não conferem.'
    setErros(e)
    if (Object.keys(e).length) return

    setEnviando(true)
    try {
      await cadastrar(form)
      // Fecha as telas de cadastro e login e volta para onde o usuário estava.
      if (voltarPara) {
        router.dismiss(1) // sai do cadastro
        router.replace(voltarPara) // troca o login pela tela que exigiu o login
      } else {
        router.dismissTo('/inicio')
      }
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Alerta texto={erroGeral} />
        <Campo rotulo="Nome completo" obrigatorio value={form.nome} onChangeText={alterar('nome')} erro={erros.nome} />
        <Campo rotulo="Empresa" obrigatorio value={form.empresa} onChangeText={alterar('empresa')} erro={erros.empresa} />
        <Campo rotulo="E-mail" obrigatorio value={form.email} onChangeText={alterar('email')} keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
        <Campo rotulo="Telefone" obrigatorio value={form.telefone} onChangeText={alterar('telefone')} keyboardType="phone-pad" placeholder="(11) 90000-0000" erro={erros.telefone} />
        <Campo rotulo="Senha" obrigatorio value={form.senha} onChangeText={alterar('senha')} secureTextEntry erro={erros.senha} />
        <Campo rotulo="Confirmar senha" obrigatorio value={form.confirmar} onChangeText={alterar('confirmar')} secureTextEntry erro={erros.confirmar} />
        <Botao titulo="Cadastrar" onPress={enviar} carregando={enviando} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
