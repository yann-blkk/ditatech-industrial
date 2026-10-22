import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from '../context/AuthContext'
import { cores } from '../tema'

// As abas ficam sempre "por baixo" das outras telas, então sempre existe um botão de voltar,
// mesmo quando o app é aberto direto em uma tela interna.
export const unstable_settings = { anchor: '(tabs)' }

// Navegação principal do app (pilha de telas). As abas ficam em (tabs)/_layout.js.
export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.azul },
          headerTintColor: cores.branco,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: cores.fundo },
          headerBackTitle: 'Voltar',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="recuperar-senha" options={{ title: 'Recuperar senha' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="produto/[id]" options={{ title: 'Detalhes do produto' }} />
        <Stack.Screen name="orcamento" options={{ title: 'Solicitar orçamento' }} />
        <Stack.Screen name="confirmacao" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="solicitacao/[id]" options={{ title: 'Solicitação' }} />
        <Stack.Screen name="admin" options={{ title: 'Painel administrativo' }} />
        <Stack.Screen name="creditos" options={{ title: 'Créditos das imagens' }} />
      </Stack>
    </AuthProvider>
  )
}
