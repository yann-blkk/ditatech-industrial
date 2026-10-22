import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Botao, LinhaInfo, StatusBadge, s } from '../components/ui'
import { buscarSolicitacao } from '../services/api'
import { cores } from '../tema'

// Confirmação exibida depois que a solicitação foi registrada (RF024, RN014).
export default function Confirmacao() {
  const { id } = useLocalSearchParams()
  const [sol, setSol] = useState(null)

  useEffect(() => {
    buscarSolicitacao(id).then(setSol).catch(() => router.replace('/solicitacoes'))
  }, [id])

  if (!sol) return null

  return (
    <SafeAreaView style={[s.tela, estilos.centro]}>
      <View style={estilos.icone}>
        <Ionicons name="checkmark" size={44} color={cores.sucesso} />
      </View>
      <Text style={[s.titulo, { textAlign: 'center' }]}>Solicitação enviada!</Text>
      <Text style={[s.subtitulo, { textAlign: 'center' }]}>
        Sua solicitação #{sol.id} foi registrada. Você receberá o orçamento em {sol.email}.
      </Text>

      <View style={[s.card, { alignSelf: 'stretch' }]}>
        <LinhaInfo chave="Produto" valor={sol.produtoNome} />
        <LinhaInfo chave="Quantidade" valor={String(sol.quantidade)} />
        <View style={[s.linhaInfo, { borderBottomWidth: 0, alignItems: 'center' }]}>
          <Text style={s.infoChave}>Status</Text>
          <StatusBadge status={sol.status} />
        </View>
      </View>

      <View style={{ alignSelf: 'stretch', gap: 10 }}>
        <Botao titulo="Acompanhar solicitação" onPress={() => router.replace(`/solicitacao/${sol.id}`)} />
        <Botao titulo="Voltar ao início" variante="contorno" onPress={() => router.dismissTo('/inicio')} />
      </View>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  icone: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e8f6ed', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
})
