import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Botao, Etiqueta, LinhaInfo, ProdutoImagem, s } from '../../components/ui'
import { buscarProduto } from '../../services/api'
import { cores } from '../../tema'

// Tela 5 — Detalhes e especificações técnicas do produto (RF007, RF008).
export default function ProdutoDetalhe() {
  const { id } = useLocalSearchParams()
  const [produto, setProduto] = useState(undefined)

  useEffect(() => {
    buscarProduto(id).then(setProduto)
  }, [id])

  if (produto === undefined) return null
  if (!produto) {
    return (
      <View style={[s.tela, s.vazio]}>
        <Text style={s.textoSuave}>Produto não encontrado.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={s.tela} edges={['bottom']}>
      <Stack.Screen options={{ title: produto.nome }} />
      <ScrollView contentContainerStyle={s.conteudo}>
        <ProdutoImagem produto={produto} altura={220} credito />
        <View style={{ marginTop: 16 }}>
          <Etiqueta texto={produto.categoria} />
          <Text style={s.titulo}>{produto.nome}</Text>
          <Text style={{ color: cores.texto, lineHeight: 22 }}>{produto.descricao}</Text>
        </View>

        {produto.caracteristicas?.length > 0 && (
          <>
            <Text style={s.tituloSecao}>Características</Text>
            {produto.caracteristicas.map((c) => (
              <Text key={c} style={{ color: cores.texto, marginBottom: 4 }}>• {c}</Text>
            ))}
          </>
        )}

        {produto.especificacoes && Object.keys(produto.especificacoes).length > 0 && (
          <>
            <Text style={s.tituloSecao}>Especificações técnicas</Text>
            <View style={s.card}>
              {Object.entries(produto.especificacoes).map(([chave, valor]) => (
                <LinhaInfo key={chave} chave={chave} valor={valor} />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: cores.borda, backgroundColor: cores.branco }}>
        <Botao titulo="Solicitar orçamento" onPress={() => router.push(`/orcamento?produto=${produto.id}`)} />
      </View>
    </SafeAreaView>
  )
}
