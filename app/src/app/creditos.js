import { Linking, Pressable, ScrollView, Text } from 'react-native'
import { s } from '../components/ui'
import { FOTOS } from '../data/fotos'
import { PRODUTOS_INICIAIS } from '../data/produtos'
import { cores } from '../tema'

// Créditos das fotos dos produtos (exigência das licenças Creative Commons).
export default function Creditos() {
  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo}>
      <Text style={s.subtitulo}>
        As fotos dos produtos são ilustrativas e foram obtidas no Wikimedia Commons e no Flickr, sob
        licenças Creative Commons. As marcas que aparecem nas fotos pertencem aos seus donos.
      </Text>
      {PRODUTOS_INICIAIS.filter((p) => FOTOS[p.id]).map((p) => {
        const f = FOTOS[p.id]
        return (
          <Pressable key={p.id} style={s.card} onPress={() => Linking.openURL(f.fonte)} accessibilityRole="link">
            <Text style={{ fontWeight: '700', color: cores.azulEscuro }}>{p.nome}</Text>
            <Text style={s.textoSuave}>Autor: {f.autor}</Text>
            <Text style={s.textoSuave}>Licença: {f.licenca}</Text>
            <Text style={{ color: cores.azul, marginTop: 4 }}>Ver original →</Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
