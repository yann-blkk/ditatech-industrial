import { Text, View } from 'react-native'
import Svg, { Circle, G, Path, Rect } from 'react-native-svg'
import { cores } from '../tema'

// Marca da DitaTech: uma câmera de segurança dentro de um quadrado azul.
// "invertida" (quadrado branco, câmera azul) é usada sobre fundos azuis.
export function MarcaCamera({ tamanho = 40, invertida = false }) {
  const fundo = invertida ? '#fff' : cores.azul
  const frente = invertida ? cores.azul : '#fff'
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 64 64">
      <Rect width="64" height="64" rx="14" fill={fundo} />
      <G transform="translate(-1 2)">
        {/* suporte de parede */}
        <Rect x="9" y="38" width="6" height="16" rx="2" fill={frente} />
        <Path d="M15 46h9a3 3 0 0 0 3-3v-6" fill="none" stroke={frente} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* corpo da câmera, inclinado para baixo */}
        <G transform="rotate(18 30 28)">
          <Rect x="11" y="15" width="40" height="5" rx="2.5" fill={frente} />
          <Rect x="13" y="21" width="34" height="15" rx="4" fill={frente} />
          <Rect x="45" y="22.5" width="6" height="12" rx="2" fill={frente} />
          <Circle cx="48" cy="28.5" r="3.6" fill={cores.azulEscuro} />
          <Circle cx="49" cy="27.5" r="1.1" fill="#fff" />
          <Circle cx="19" cy="28.5" r="1.8" fill={fundo} />
        </G>
      </G>
    </Svg>
  )
}

// Marca + nome, na horizontal.
export default function Logo({ tamanho = 36, claro = false }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <MarcaCamera tamanho={tamanho} invertida={claro} />
      <Text style={{ fontSize: tamanho * 0.6, fontWeight: '700', color: claro ? cores.branco : cores.azulEscuro }}>
        DitaTech <Text style={{ color: claro ? cores.branco : cores.azul, fontWeight: '400' }}>Industrial</Text>
      </Text>
    </View>
  )
}
