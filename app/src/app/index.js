import { useEffect, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { MarcaCamera } from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { cores } from '../tema'

const DURACAO = 1800

// Tela 1 — Splash: logo com a câmera e barra de carregamento enquanto o app lê a sessão salva.
export default function Splash() {
  const { usuario, carregando } = useAuth()
  const [tempoMinimo, setTempoMinimo] = useState(false)
  // Valores das animações (criados uma única vez).
  const [entrada] = useState(() => new Animated.Value(0))
  const [progresso] = useState(() => new Animated.Value(0))

  useEffect(() => {
    // O logo aparece crescendo e a barra enche durante o carregamento.
    Animated.timing(entrada, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }).start()
    Animated.timing(progresso, { toValue: 1, duration: DURACAO, easing: Easing.inOut(Easing.quad), useNativeDriver: false }).start()
    const t = setTimeout(() => setTempoMinimo(true), DURACAO)
    return () => clearTimeout(t)
  }, [entrada, progresso])

  useEffect(() => {
    if (tempoMinimo && !carregando) {
      router.replace(usuario ? '/inicio' : '/login')
    }
  }, [tempoMinimo, carregando, usuario])

  const largura = progresso.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })

  return (
    <View style={estilos.tela}>
      <View style={estilos.centro}>
        <Animated.View style={{ opacity: entrada, transform: [{ scale: entrada.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }}>
          <View style={estilos.sombra}>
            <MarcaCamera tamanho={120} />
          </View>
        </Animated.View>

        <Text style={estilos.nome}>
          DitaTech <Text style={estilos.nomeDestaque}>Industrial</Text>
        </Text>
        <Text style={estilos.slogan}>Soluções em automação industrial</Text>

        <View style={estilos.barra} accessibilityRole="progressbar" accessibilityLabel="Carregando">
          <Animated.View style={[estilos.barraCheia, { width: largura }]} />
        </View>
        <Text style={estilos.carregando}>Carregando...</Text>
      </View>

      <Text style={estilos.rodape}>Indústria 4.0 · Visão, controle e robótica</Text>
    </View>
  )
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.branco, alignItems: 'center', justifyContent: 'space-between', padding: 24 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  sombra: { borderRadius: 28, shadowColor: cores.azul, shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10, backgroundColor: cores.azul },
  nome: { fontSize: 30, fontWeight: '800', color: cores.azulEscuro, marginTop: 24 },
  nomeDestaque: { color: cores.azul, fontWeight: '400' },
  slogan: { color: cores.textoSuave, marginTop: 6, fontSize: 15 },
  barra: { width: '60%', maxWidth: 240, height: 6, borderRadius: 3, backgroundColor: cores.azulClaro, marginTop: 40, overflow: 'hidden' },
  barraCheia: { height: '100%', backgroundColor: cores.azul, borderRadius: 3 },
  carregando: { color: cores.textoSuave, fontSize: 13, marginTop: 10 },
  rodape: { color: cores.textoSuave, fontSize: 12, marginBottom: 8 },
})
