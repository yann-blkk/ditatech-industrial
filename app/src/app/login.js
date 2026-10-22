import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router, useLocalSearchParams } from 'expo-router'
import Logo from '../components/Logo'
import { Alerta, Botao, Campo, s } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { cores } from '../tema'
import { verificarObrigatorios } from '../utils/validacao'

// Tela 2 — Login (RF002). Se veio de uma tela protegida, volta para ela depois.
export default function Login() {
  const { entrar } = useAuth()
  const { voltarPara } = useLocalSearchParams()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar() {
    setErroGeral('')
    const novosErros = verificarObrigatorios(form, ['email', 'senha'])
    setErros(novosErros)
    if (Object.keys(novosErros).length) return

    setEnviando(true)
    try {
      await entrar(form.email, form.senha)
      if (voltarPara) router.replace(voltarPara)
      else if (router.canGoBack()) router.back() // veio do Perfil ou de outra tela
      else router.replace('/inicio') // veio da Splash
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <SafeAreaView style={[s.tela, { backgroundColor: cores.azul }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          <View style={estilos.logo}>
            <Logo tamanho={44} claro />
          </View>

          <View style={[s.card, { padding: 20 }]}>
            <Text style={s.titulo}>Entrar</Text>
            <Text style={s.subtitulo}>Acesse sua conta para solicitar e acompanhar orçamentos.</Text>

            {voltarPara ? <Alerta tipo="info" texto="Faça login ou cadastre-se para continuar." /> : null}
            <Alerta texto={erroGeral} />

            <Campo
              rotulo="E-mail"
              obrigatorio
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              erro={erros.email}
            />
            <Campo
              rotulo="Senha"
              obrigatorio
              value={form.senha}
              onChangeText={(senha) => setForm({ ...form, senha })}
              secureTextEntry
              erro={erros.senha}
            />

            <Botao titulo="Entrar" onPress={enviar} carregando={enviando} />

            <View style={estilos.links}>
              <Link href="/recuperar-senha" style={estilos.link}>Esqueci minha senha</Link>
              <Link href={{ pathname: '/cadastro', params: voltarPara ? { voltarPara } : {} }} style={estilos.link}>
                Criar conta
              </Link>
            </View>

            <Text style={estilos.dica}>
              Demonstração — cliente: cliente@empresa.com.br / cliente123{'\n'}
              Administrador: admin@ditatech.com.br / admin123
            </Text>
          </View>

          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/inicio'))} style={{ padding: 12 }}>
            <Text style={estilos.explorar}>Explorar produtos sem entrar →</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  logo: { alignItems: 'center', marginBottom: 24 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  link: { color: cores.azul, fontWeight: '600' },
  dica: { color: cores.textoSuave, fontSize: 12, marginTop: 16 },
  explorar: { color: '#d6e0ea', textAlign: 'center', fontWeight: '600' },
})
