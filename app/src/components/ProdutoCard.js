import { Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Etiqueta, ProdutoImagem, s } from './ui'
import { cores } from '../tema'

export default function ProdutoCard({ produto }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/produto/${produto.id}`)}
      style={({ pressed }) => [s.card, { flexDirection: 'row', gap: 12, alignItems: 'center' }, pressed && { opacity: 0.85 }]}
    >
      <View style={{ width: 84 }}>
        <ProdutoImagem produto={produto} altura={72} />
      </View>
      <View style={{ flex: 1 }}>
        <Etiqueta texto={produto.categoria} />
        <Text style={{ fontWeight: '700', fontSize: 16, color: cores.azul }}>{produto.nome}</Text>
        <Text style={[s.textoSuave, { fontSize: 13 }]} numberOfLines={2}>
          {produto.resumo}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
    </Pressable>
  )
}
