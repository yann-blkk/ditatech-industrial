import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Alerta, Botao, Campo, confirmar, s } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { CONTATO } from '../../data/solucoes'
import { atualizarPerfil } from '../../services/api'
import { cores } from '../../tema'
import { emailValido, telefoneValido, verificarObrigatorios } from '../../utils/validacao'

// Tela 8 — Perfil: dados do usuário (RF015), contato (RF023) e sair (RF016).
export default function Perfil() {
  const { usuario } = useAuth()
  if (!usuario) return <Visitante />
  return <MeuPerfil key={usuario.id} usuario={usuario} />
}

function Contato() {
  return (
    <View style={[s.card, { marginTop: 24 }]}>
      <Text style={{ fontWeight: '700', color: cores.azul, marginBottom: 8 }}>Fale com um especialista</Text>
      <Text style={s.textoSuave}>Telefone: {CONTATO.telefone}</Text>
      <Text style={s.textoSuave}>WhatsApp: {CONTATO.whatsapp}</Text>
      <Text style={s.textoSuave}>E-mail: {CONTATO.email}</Text>
      <Text style={s.textoSuave}>{CONTATO.horario}</Text>
      <Text style={{ color: cores.azul, marginTop: 10, fontWeight: '600' }} onPress={() => router.push('/creditos')}>
        Créditos das imagens →
      </Text>
    </View>
  )
}

function Visitante() {
  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo}>
      <View style={s.vazio}>
        <Ionicons name="person-circle-outline" size={56} color={cores.textoSuave} />
        <Text style={[s.textoSuave, { textAlign: 'center' }]}>Entre ou crie uma conta para ver seu perfil.</Text>
        <Botao titulo="Entrar" onPress={() => router.push('/login')} style={{ alignSelf: 'stretch' }} />
      </View>
      <Contato />
    </ScrollView>
  )
}

function MeuPerfil({ usuario }) {
  const { atualizar, sair } = useAuth()
  const [form, setForm] = useState({
    nome: usuario.nome,
    empresa: usuario.empresa,
    email: usuario.email,
    telefone: usuario.telefone,
    novaSenha: '',
  })
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState({ tipo: 'erro', texto: '' })
  const [salvando, setSalvando] = useState(false)

  const alterar = (campo) => (valor) => setForm({ ...form, [campo]: valor })

  async function salvar() {
    setMensagem({ tipo: 'erro', texto: '' })
    const e = verificarObrigatorios(form, ['nome', 'empresa', 'email', 'telefone'])
    if (form.email && !emailValido(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) e.telefone = 'Informe um telefone com DDD.'
    if (form.novaSenha && form.novaSenha.length < 6) e.novaSenha = 'Mínimo de 6 caracteres.'
    setErros(e)
    if (Object.keys(e).length) return

    setSalvando(true)
    try {
      atualizar(await atualizarPerfil(form))
      setMensagem({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso.' })
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message })
    } finally {
      setSalvando(false)
    }
  }

  async function handleSair() {
    if (await confirmar('Sair da conta', 'Deseja encerrar sua sessão?')) {
      await sair()
      router.replace('/login')
    }
  }

  return (
    <KeyboardAvoidingView style={s.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: cores.azul, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: cores.branco, fontSize: 30, fontWeight: '700' }}>{usuario.nome[0]}</Text>
          </View>
          <Text style={[s.titulo, { marginTop: 8, marginBottom: 0 }]}>{usuario.nome}</Text>
          <Text style={s.textoSuave}>{usuario.perfil === 'admin' ? 'Administrador' : usuario.empresa}</Text>
        </View>

        {usuario.perfil === 'admin' && (
          <Botao titulo="Painel administrativo" onPress={() => router.push('/admin')} style={{ marginBottom: 20 }} />
        )}

        <Text style={s.tituloSecao}>Meus dados</Text>
        <Alerta tipo={mensagem.tipo} texto={mensagem.texto} />
        <Campo rotulo="Nome" obrigatorio value={form.nome} onChangeText={alterar('nome')} erro={erros.nome} />
        <Campo rotulo="Empresa" obrigatorio value={form.empresa} onChangeText={alterar('empresa')} erro={erros.empresa} />
        <Campo rotulo="E-mail" obrigatorio value={form.email} onChangeText={alterar('email')} keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
        <Campo rotulo="Telefone" obrigatorio value={form.telefone} onChangeText={alterar('telefone')} keyboardType="phone-pad" erro={erros.telefone} />
        <Campo rotulo="Nova senha (opcional)" value={form.novaSenha} onChangeText={alterar('novaSenha')} secureTextEntry erro={erros.novaSenha} />
        <Botao titulo="Salvar alterações" onPress={salvar} carregando={salvando} />

        <Contato />

        <Botao titulo="Sair da conta" variante="perigo" onPress={handleSair} style={{ marginTop: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
