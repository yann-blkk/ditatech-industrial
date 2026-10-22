import { useEffect, useState } from 'react'
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProdutoCard from '../../components/ProdutoCard'
import { s } from '../../components/ui'
import { CATEGORIAS } from '../../data/produtos'
import { listarProdutos } from '../../services/api'
import { cores } from '../../tema'

// Tela 4 — Catálogo com busca por nome (RF005) e filtro por categoria (RF006).
export default function Produtos() {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
    listarProdutos({ busca, categoria }).then(setProdutos)
  }, [busca, categoria])

  return (
    <View style={s.tela}>
      <View style={estilos.topo}>
        <View style={estilos.busca}>
          <Ionicons name="search" size={18} color={cores.textoSuave} />
          <TextInput
            style={estilos.buscaInput}
            placeholder="Pesquisar por nome..."
            placeholderTextColor="#9aa3ad"
            value={busca}
            onChangeText={setBusca}
            accessibilityLabel="Pesquisar produtos por nome"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
          {['', ...CATEGORIAS].map((c) => {
            const ativo = categoria === c
            return (
              <Pressable key={c || 'todas'} onPress={() => setCategoria(c)} style={[estilos.chip, ativo && estilos.chipAtivo]}>
                <Text style={[estilos.chipTexto, ativo && { color: cores.branco }]}>{c || 'Todas'}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => <ProdutoCard produto={item} />}
        contentContainerStyle={s.conteudo}
        ListHeaderComponent={<Text style={[s.textoSuave, { marginBottom: 10 }]}>{produtos.length} produto(s)</Text>}
        ListEmptyComponent={
          <View style={s.vazio}>
            <Ionicons name="search-outline" size={36} color={cores.textoSuave} />
            <Text style={s.textoSuave}>Nenhum produto encontrado.</Text>
          </View>
        }
      />
    </View>
  )
}

const estilos = StyleSheet.create({
  topo: { backgroundColor: cores.branco, paddingLeft: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.borda, gap: 10 },
  busca: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#cbd2da', borderRadius: 8, paddingHorizontal: 12, marginRight: 16 },
  buscaInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: cores.texto },
  chip: { borderWidth: 1, borderColor: cores.borda, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: cores.branco },
  chipAtivo: { backgroundColor: cores.azul, borderColor: cores.azul },
  chipTexto: { fontSize: 13, color: cores.texto },
})
