import { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Alerta, Botao, Campo, s } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { criarSolicitacao, listarProdutos } from '../services/api'
import { cores } from '../tema'
import { emailValido, quantidadeValida, telefoneValido, verificarObrigatorios } from '../utils/validacao'

// Tela 6 — Solicitação de orçamento (RF009–RF012, RN001–RN003, RN012, RN014).
export default function Orcamento() {
  const { usuario, carregando } = useAuth()
  const { produto: produtoParam } = useLocalSearchParams()

  // RN001 — sem login, o usuário é levado para entrar/cadastrar e depois volta para cá.
  useEffect(() => {
    if (!carregando && !usuario) {
      const voltarPara = produtoParam ? `/orcamento?produto=${produtoParam}` : '/orcamento'
      router.replace({ pathname: '/login', params: { voltarPara } })
    }
  }, [carregando, usuario, produtoParam])

  if (!usuario) return null
  return <FormOrcamento usuario={usuario} produtoParam={produtoParam} />
}

function FormOrcamento({ usuario, produtoParam }) {
  const [produtos, setProdutos] = useState([])
  const [escolhendo, setEscolhendo] = useState(!produtoParam)
  // Os dados de contato já vêm preenchidos com o cadastro do cliente.
  const [form, setForm] = useState({
    produtoId: produtoParam || '',
    quantidade: '1',
    nome: usuario.nome,
    empresa: usuario.empresa,
    email: usuario.email,
    telefone: usuario.telefone,
    mensagem: '',
  })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    listarProdutos().then(setProdutos)
  }, [])

  const alterar = (campo) => (valor) => setForm({ ...form, [campo]: valor })
  const selecionado = produtos.find((p) => String(p.id) === String(form.produtoId))

  async function enviar() {
    setErroGeral('')
    const e = verificarObrigatorios(form, ['produtoId', 'quantidade', 'nome', 'email', 'telefone'])
    if (e.produtoId) e.produtoId = 'Selecione um produto.'
    if (form.quantidade && !quantidadeValida(form.quantidade)) e.quantidade = 'Informe um número inteiro maior que zero.'
    if (form.email && !emailValido(form.email)) e.email = 'Informe um e-mail válido.'
    if (form.telefone && !telefoneValido(form.telefone)) e.telefone = 'Informe um telefone com DDD.'
    setErros(e)
    if (Object.keys(e).length) return

    setEnviando(true)
    try {
      const solicitacao = await criarSolicitacao(form)
      router.replace({ pathname: '/confirmacao', params: { id: solicitacao.id } })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <KeyboardAvoidingView style={s.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={s.subtitulo}>
          Campos com <Text style={{ color: cores.erro }}>*</Text> são obrigatórios.
        </Text>
        <Alerta texto={erroGeral} />

        <Text style={s.rotulo}>
          Produto / equipamento <Text style={{ color: cores.erro }}>*</Text>
        </Text>
        {escolhendo ? (
          <View style={[s.card, { padding: 0 }, erros.produtoId && { borderColor: cores.erro }]}>
            {produtos.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => {
                  setForm({ ...form, produtoId: String(p.id) })
                  setEscolhendo(false)
                }}
                style={{ padding: 14, borderBottomWidth: 1, borderBottomColor: cores.borda }}
              >
                <Text style={{ color: cores.texto }}>{p.nome}</Text>
                <Text style={[s.textoSuave, { fontSize: 12 }]}>{p.categoria}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Pressable onPress={() => setEscolhendo(true)} style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
            <Ionicons name="cube-outline" size={22} color={cores.azul} />
            <Text style={{ flex: 1, fontWeight: '600', color: cores.azul }}>{selecionado?.nome || 'Selecione um produto'}</Text>
            <Text style={{ color: cores.azul }}>Trocar</Text>
          </Pressable>
        )}
        {erros.produtoId ? <Text style={[s.erro, { marginTop: -6, marginBottom: 12 }]}>{erros.produtoId}</Text> : null}

        <Campo rotulo="Quantidade" obrigatorio value={form.quantidade} onChangeText={alterar('quantidade')} keyboardType="number-pad" erro={erros.quantidade} />
        <Campo rotulo="Nome" obrigatorio value={form.nome} onChangeText={alterar('nome')} erro={erros.nome} />
        <Campo rotulo="Empresa" value={form.empresa} onChangeText={alterar('empresa')} />
        <Campo rotulo="E-mail" obrigatorio value={form.email} onChangeText={alterar('email')} keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
        <Campo rotulo="Telefone" obrigatorio value={form.telefone} onChangeText={alterar('telefone')} keyboardType="phone-pad" erro={erros.telefone} />
        <Campo rotulo="Descreva sua necessidade" value={form.mensagem} onChangeText={alterar('mensagem')} multiline placeholder="Aplicação, ambiente, prazo desejado..." />

        <Botao titulo="Enviar solicitação" onPress={enviar} carregando={enviando} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
