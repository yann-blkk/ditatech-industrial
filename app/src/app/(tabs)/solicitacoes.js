import { useCallback, useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Botao, StatusBadge, s } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { minhasSolicitacoes } from '../../services/api'
import { cores } from '../../tema'

// Tela 7 — Minhas solicitações: histórico e acompanhamento (RF013, RF014, RN015).
export default function Solicitacoes() {
  const { usuario } = useAuth()
  const [lista, setLista] = useState(null)

  useFocusEffect(
    useCallback(() => {
      if (usuario) minhasSolicitacoes().then(setLista)
    }, [usuario]),
  )

  if (!usuario) {
    return (
      <View style={[s.tela, s.vazio, { justifyContent: 'center' }]}>
        <Ionicons name="lock-closed-outline" size={40} color={cores.textoSuave} />
        <Text style={[s.textoSuave, { textAlign: 'center' }]}>
          Entre na sua conta para acompanhar suas solicitações.
        </Text>
        <Botao titulo="Entrar" onPress={() => router.push('/login')} />
      </View>
    )
  }

  return (
    <FlatList
      style={s.tela}
      contentContainerStyle={s.conteudo}
      data={lista || []}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <Botao titulo="+ Nova solicitação" onPress={() => router.push('/orcamento')} style={{ marginBottom: 16 }} />
      }
      ListEmptyComponent={
        lista && (
          <View style={s.vazio}>
            <Ionicons name="document-text-outline" size={40} color={cores.textoSuave} />
            <Text style={s.textoSuave}>Você ainda não fez nenhuma solicitação.</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}
          onPress={() => router.push(`/solicitacao/${item.id}`)}
          accessibilityRole="button"
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontWeight: '700', color: cores.azul }}>Solicitação #{item.id}</Text>
            <Text style={[s.textoSuave, { fontSize: 13 }]}>
              {new Date(item.criadaEm).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <Text style={{ color: cores.texto, marginBottom: 8 }}>
            {item.produtoNome} · {item.quantidade} un.
          </Text>
          <StatusBadge status={item.status} />
        </Pressable>
      )}
    />
  )
}
