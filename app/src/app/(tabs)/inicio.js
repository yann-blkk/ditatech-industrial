import { useCallback, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import ProdutoCard from '../../components/ProdutoCard'
import { Botao, StatusBadge, s } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { SOLUCOES } from '../../data/solucoes'
import { listarProdutos, minhasSolicitacoes } from '../../services/api'
import { cores } from '../../tema'

// Tela 3 — Home: resumo das principais funcionalidades.
export default function Inicio() {
  const { usuario } = useAuth()
  const [destaques, setDestaques] = useState([])
  const [ultima, setUltima] = useState(null)

  // Recarrega sempre que a aba volta a ficar visível.
  useFocusEffect(
    useCallback(() => {
      listarProdutos().then((l) => setDestaques(l.slice(0, 3)))
      if (usuario) minhasSolicitacoes().then((l) => setUltima(l[0] || null))
      else setUltima(null)
    }, [usuario]),
  )

  const atalhos = [
    { icone: 'grid-outline', texto: 'Produtos', acao: () => router.push('/produtos') },
    { icone: 'calculator-outline', texto: 'Orçamento', acao: () => router.push('/orcamento') },
    { icone: 'document-text-outline', texto: 'Solicitações', acao: () => router.push('/solicitacoes') },
    { icone: 'person-outline', texto: 'Perfil', acao: () => router.push('/perfil') },
  ]

  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo}>
      <View style={estilos.boasVindas}>
        <Text style={estilos.ola}>{usuario ? `Olá, ${usuario.nome.split(' ')[0]}!` : 'Bem-vindo!'}</Text>
        <Text style={estilos.texto}>Encontre soluções de automação e solicite orçamentos pelo celular.</Text>
      </View>

      <View style={estilos.atalhos}>
        {atalhos.map((a) => (
          <Pressable key={a.texto} onPress={a.acao} style={estilos.atalho} accessibilityRole="button">
            <Ionicons name={a.icone} size={26} color={cores.azul} />
            <Text style={estilos.atalhoTexto}>{a.texto}</Text>
          </Pressable>
        ))}
      </View>

      {ultima && (
        <>
          <Text style={s.tituloSecao}>Última solicitação</Text>
          <Pressable style={s.card} onPress={() => router.push(`/solicitacao/${ultima.id}`)}>
            <Text style={{ fontWeight: '700', color: cores.azul, marginBottom: 4 }}>
              Solicitação #{ultima.id}
            </Text>
            <Text style={[s.textoSuave, { marginBottom: 8 }]}>
              {ultima.produtoNome} · {ultima.quantidade} un.
            </Text>
            <StatusBadge status={ultima.status} />
          </Pressable>
        </>
      )}

      <Text style={s.tituloSecao}>Produtos em destaque</Text>
      {destaques.map((p) => (
        <ProdutoCard key={p.id} produto={p} />
      ))}
      <Botao titulo="Ver todos os produtos" variante="contorno" onPress={() => router.push('/produtos')} />

      <Text style={s.tituloSecao}>Nossas soluções</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {SOLUCOES.map((sol) => (
          <View key={sol.id} style={[s.card, estilos.solucao]}>
            <Text style={{ fontWeight: '700', color: cores.azul, marginBottom: 6 }}>{sol.titulo}</Text>
            <Text style={[s.textoSuave, { fontSize: 13 }]} numberOfLines={4}>
              {sol.descricao}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  boasVindas: { backgroundColor: cores.azul, borderRadius: 12, padding: 18, marginBottom: 16 },
  ola: { color: cores.branco, fontSize: 22, fontWeight: '700', marginBottom: 4 },
  texto: { color: '#d6e0ea' },
  atalhos: { flexDirection: 'row', gap: 10 },
  atalho: { flex: 1, backgroundColor: cores.branco, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingVertical: 14, alignItems: 'center', gap: 6 },
  atalhoTexto: { fontSize: 12, fontWeight: '600', color: cores.texto },
  solucao: { width: 230, marginBottom: 0 },
})
