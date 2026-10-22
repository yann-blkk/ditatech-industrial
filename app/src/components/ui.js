// Componentes visuais reutilizados nas telas do app.
import { ActivityIndicator, Alert, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { cores, raio } from '../tema'
import { fotoDoProduto } from '../data/fotos'

export function Botao({ titulo, onPress, variante = 'primario', carregando, disabled, style }) {
  const estilo = estilosBotao[variante]
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || carregando}
      style={({ pressed }) => [s.botao, estilo.caixa, pressed && { opacity: 0.8 }, (disabled || carregando) && { opacity: 0.6 }, style]}
    >
      {carregando ? (
        <ActivityIndicator color={estilo.texto.color} />
      ) : (
        <Text style={[s.botaoTexto, estilo.texto]}>{titulo}</Text>
      )}
    </Pressable>
  )
}

const estilosBotao = {
  primario: { caixa: { backgroundColor: cores.azul, borderColor: cores.azul }, texto: { color: cores.branco } },
  contorno: { caixa: { backgroundColor: cores.branco, borderColor: cores.azulBorda }, texto: { color: cores.azul } },
  perigo: { caixa: { backgroundColor: cores.branco, borderColor: '#f1b8b8' }, texto: { color: cores.erro } },
  claro: { caixa: { backgroundColor: cores.branco, borderColor: cores.branco }, texto: { color: cores.azul } },
}

// Campo com rótulo, asterisco de obrigatório (RNF007) e mensagem de erro (RNF006).
export function Campo({ rotulo, obrigatorio, erro, multiline, ...props }) {
  return (
    <View style={s.campo}>
      <Text style={s.rotulo}>
        {rotulo} {obrigatorio && <Text style={{ color: cores.erro }}>*</Text>}
      </Text>
      <TextInput
        placeholderTextColor="#9aa3ad"
        style={[s.input, multiline && s.inputMultilinha, erro && { borderColor: cores.erro }]}
        multiline={multiline}
        accessibilityLabel={rotulo}
        {...props}
      />
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  )
}

export function Alerta({ tipo = 'erro', texto }) {
  if (!texto) return null
  const cor = { erro: ['#fdecec', cores.erro], sucesso: ['#e8f5e9', cores.sucesso], info: [cores.azulClaro, cores.azulEscuro] }[tipo]
  return (
    <View style={[s.alerta, { backgroundColor: cor[0] }]}>
      <Text style={{ color: cor[1] }}>{texto}</Text>
    </View>
  )
}

const CORES_STATUS = {
  Solicitada: ['#eef1f4', '#374151'],
  'Em análise': ['#fff4e0', '#9a5b00'],
  'Orçamento enviado': [cores.azulClaro, cores.azulEscuro],
  Aprovada: [cores.azulClaro, cores.azulEscuro],
  'Em execução': [cores.azulClaro, cores.azulEscuro],
  Concluída: ['#e8f5e9', cores.sucesso],
  Cancelada: ['#fdecec', cores.erro],
}

export function StatusBadge({ status }) {
  const [fundo, cor] = CORES_STATUS[status] || CORES_STATUS.Solicitada
  return (
    <View style={[s.status, { backgroundColor: fundo }]}>
      <Text style={[s.statusTexto, { color: cor }]}>{status}</Text>
    </View>
  )
}

const ICONES = {
  Sensores: 'radio-button-on-outline',
  'Controladores (CLP)': 'hardware-chip-outline',
  Robótica: 'construct-outline',
  'Inversores e Motores': 'sync-outline',
  'IHM e Supervisão': 'tablet-landscape-outline',
  Atuadores: 'swap-horizontal-outline',
}

// Mostra a foto do produto; sem foto (produto novo), mostra um ícone da categoria.
export function ProdutoImagem({ produto, altura = 110, credito = false }) {
  const foto = fotoDoProduto(produto.id)
  return (
    <View>
      <View style={[s.imagem, { height: altura }]}>
        {foto ? (
          <Image source={foto.src} style={{ width: '100%', height: '100%' }} resizeMode="contain" accessibilityLabel={produto.nome} />
        ) : (
          <Ionicons name={ICONES[produto.categoria] || 'cog-outline'} size={altura / 2.4} color={cores.azul} />
        )}
      </View>
      {credito && foto ? (
        <Text style={{ fontSize: 11, color: cores.textoSuave, marginTop: 4 }}>
          Foto: {foto.autor} · {foto.licenca} · imagem ilustrativa
        </Text>
      ) : null}
    </View>
  )
}

export function Etiqueta({ texto }) {
  return (
    <View style={s.etiqueta}>
      <Text style={s.etiquetaTexto}>{texto}</Text>
    </View>
  )
}

// Pergunta de confirmação que funciona no celular e no navegador.
export function confirmar(titulo, mensagem) {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`))
  return new Promise((resolve) =>
    Alert.alert(titulo, mensagem, [
      { text: 'Não', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Sim', style: 'destructive', onPress: () => resolve(true) },
    ]),
  )
}

export const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: '700', color: cores.azulEscuro, marginBottom: 4 },
  subtitulo: { fontSize: 15, color: cores.textoSuave, marginBottom: 16 },
  tituloSecao: { fontSize: 18, fontWeight: '700', color: cores.azulEscuro, marginTop: 24, marginBottom: 12 },
  textoSuave: { color: cores.textoSuave },
  card: { backgroundColor: cores.branco, borderRadius: raio, borderWidth: 1, borderColor: cores.borda, padding: 16, marginBottom: 12 },
  botao: { borderWidth: 2, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  botaoTexto: { fontWeight: '700', fontSize: 15 },
  campo: { marginBottom: 14 },
  rotulo: { fontWeight: '600', fontSize: 14, color: cores.texto, marginBottom: 6 },
  input: { backgroundColor: cores.branco, borderWidth: 1, borderColor: '#c9d6e6', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: cores.texto },
  inputMultilinha: { minHeight: 96, textAlignVertical: 'top' },
  erro: { color: cores.erro, fontSize: 13, marginTop: 4 },
  alerta: { borderRadius: 8, padding: 12, marginBottom: 14 },
  status: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  statusTexto: { fontSize: 12, fontWeight: '700' },
  imagem: { backgroundColor: cores.branco, borderRadius: 8, borderWidth: 1, borderColor: cores.borda, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  etiqueta: { alignSelf: 'flex-start', backgroundColor: cores.azulClaro, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2, marginBottom: 6 },
  etiquetaTexto: { color: cores.azul, fontSize: 12, fontWeight: '700' },
  linhaInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: cores.borda, gap: 12 },
  infoChave: { color: cores.textoSuave, fontWeight: '600', flexShrink: 0 },
  infoValor: { color: cores.texto, flex: 1, textAlign: 'right' },
  vazio: { alignItems: 'center', padding: 32, gap: 12 },
})

export function LinhaInfo({ chave, valor }) {
  return (
    <View style={s.linhaInfo}>
      <Text style={s.infoChave}>{chave}</Text>
      <Text style={s.infoValor}>{valor}</Text>
    </View>
  )
}
