import { useCallback, useEffect, useState } from 'react'
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { Alerta, StatusBadge, s } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { STATUS, STATUS_CANCELADA, alterarStatus, todasSolicitacoes } from '../services/api'
import { cores } from '../tema'

// Painel do administrador no app: consultar solicitações e alterar status (RF020, RF021, RN007, RN013).
// O cadastro de produtos (RF017–RF019) fica no site, onde há mais espaço para os formulários.
const TODOS = [...STATUS, STATUS_CANCELADA]

export default function Admin() {
  const { usuario, carregando } = useAuth()
  const [lista, setLista] = useState([])
  const [aberta, setAberta] = useState(null)
  const [aviso, setAviso] = useState('')

  const ehAdmin = usuario?.perfil === 'admin'

  // RN013 — apenas administradores
  useEffect(() => {
    if (!carregando && !ehAdmin) router.back()
  }, [carregando, ehAdmin])

  const carregar = useCallback(() => {
    if (ehAdmin) todasSolicitacoes().then(setLista)
  }, [ehAdmin])

  useFocusEffect(
    useCallback(() => {
      carregar()
    }, [carregar]),
  )

  async function mudar(id, status) {
    await alterarStatus(id, status)
    setAviso(`Solicitação #${id} alterada para “${status}”.`)
    carregar()
  }

  if (!ehAdmin) return null

  return (
    <FlatList
      style={s.tela}
      contentContainerStyle={s.conteudo}
      data={lista}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <>
          <Text style={s.subtitulo}>{lista.length} solicitação(ões). Toque em uma para alterar o status.</Text>
          <Alerta tipo="sucesso" texto={aviso} />
        </>
      }
      renderItem={({ item }) => (
        <View style={s.card}>
          <Pressable onPress={() => setAberta(aberta === item.id ? null : item.id)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontWeight: '700', color: cores.azul }}>#{item.id} · {item.nome}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={{ color: cores.texto }}>{item.produtoNome} · {item.quantidade} un.</Text>
            <Text style={[s.textoSuave, { fontSize: 13 }]}>{item.empresa} · {item.telefone}</Text>
            {item.mensagem ? <Text style={[s.textoSuave, { fontSize: 13, marginTop: 4 }]}>“{item.mensagem}”</Text> : null}
          </Pressable>

          {aberta === item.id && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginTop: 12 }}>
              {TODOS.map((st) => {
                const atual = st === item.status
                return (
                  <Pressable
                    key={st}
                    disabled={atual}
                    onPress={() => mudar(item.id, st)}
                    style={{
                      borderWidth: 1,
                      borderColor: atual ? cores.azul : cores.borda,
                      backgroundColor: atual ? cores.azul : cores.branco,
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: atual ? cores.branco : cores.texto }}>{st}</Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          )}
        </View>
      )}
    />
  )
}
