import { Tabs } from 'expo-router/js-tabs'
import { Ionicons } from '@expo/vector-icons'
import { cores } from '../../tema'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.azul },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: cores.azul,
        tabBarInactiveTintColor: '#8a94a0',
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Início',
          headerTitle: 'DitaTech Industrial',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'Solicitações',
          headerTitle: 'Minhas solicitações',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
