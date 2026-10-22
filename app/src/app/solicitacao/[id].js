import { useCallback, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { Alerta, Botao, Campo, LinhaInfo, StatusBadge, confirmar, s } from '../../components/ui'
import {
  STATUS,
  STATUS_CANCELADA,
  buscarSolicitacao,
  cancelarSolicitacao,
  editarSolicitacao,
  podeAlterar,
} from '../../services/api'
import { cores } from '../../tema'
import { quantidadeValida } from '../../utils/validacao'

// Detalhes e acompanhamento da solicitação (RF013), com edição (RN004) e cancelamento (RN005).
export default function SolicitacaoDetalhe() {
  const { id } = useLocalSearchParams()
  const [sol, setSol] = useState(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ quantidade: '', mensagem: '' })
  const [erroQtd, setErroQtd] = useState('')

  const carregar = useCallback(() => {
    buscarSolicitacao(id)
      .then((dados) => {
        setSol(dados)
        setForm({ quantidade: String(dados.quantidade), mensagem: dados.mensagem })
      })
      .catch((e) => setErro(e.message))
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function salvar() {
    if (!quantidadeValida(form.quantidade)) {
      setErroQtd('Informe um número inteiro maior que zero.')
      return
    }
    setErroQtd('')
    try {
      await editarSolicitacao(sol.id, form)
      setEditando(false)
      setAviso('Solicitação atualizada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function cancelar() {
    if (!(await confirmar('Cancelar solicitação', `Deseja cancelar a solicitação #${sol.id}?`))) return
    try {
      await cancelarSolicitacao(sol.id)
      setAviso('Solicitação cancelada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  if (!sol) {
    return (
      <View style={[s.tela, s.conteudo]}>
        <Alerta texto={erro} />
      </View>
    )
  }

  const cancelada = sol.status === STATUS_CANCELADA
  const etapaAtual = STATUS.indexOf(sol.status)

  return (
    <ScrollView style={s.tela} contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: `Solicitação #${sol.id}` }} />

      <Alerta tipo="sucesso" texto={aviso} />
      <Alerta texto={erro} />

      <View style={[s.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={{ fontWeight: '700', color: cores.azul }}>Status atual</Text>
        <StatusBadge status={sol.status} />
      </View>

      {!cancelada && (
        <View style={s.card}>
          <Text style={{ fontWeight: '700', color: cores.azul, marginBottom: 10 }}>Andamento</Text>
          {STATUS.map((st, i) => {
            const feita = i <= etapaAtual
            return (
              <View key={st} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 }}>
                <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: feita ? cores.azul : cores.borda }} />
                <Text style={{ color: feita ? cores.azul : cores.textoSuave, fontWeight: feita ? '700' : '400' }}>{st}</Text>
              </View>
            )
          })}
        </View>
      )}

      {editando ? (
        <View style={s.card}>
          <Campo rotulo="Quantidade" obrigatorio value={form.quantidade} onChangeText={(quantidade) => setForm({ ...form, quantidade })} keyboardType="number-pad" erro={erroQtd} />
          <Campo rotulo="Descrição da necessidade" value={form.mensagem} onChangeText={(mensagem) => setForm({ ...form, mensagem })} multiline />
          <View style={{ gap: 10 }}>
            <Botao titulo="Salvar" onPress={salvar} />
            <Botao titulo="Desistir" variante="contorno" onPress={() => setEditando(false)} />
          </View>
        </View>
      ) : (
        <View style={s.card}>
          <LinhaInfo chave="Produto" valor={sol.produtoNome} />
          <LinhaInfo chave="Quantidade" valor={String(sol.quantidade)} />
          <LinhaInfo chave="Data" valor={new Date(sol.criadaEm).toLocaleDateString('pt-BR')} />
          <LinhaInfo chave="Contato" valor={`${sol.nome}\n${sol.email}\n${sol.telefone}`} />
          <LinhaInfo chave="Necessidade" valor={sol.mensagem || '—'} />
        </View>
      )}

      {!editando && podeAlterar(sol) && (
        <View style={{ gap: 10 }}>
          <Botao titulo="Alterar solicitação" onPress={() => setEditando(true)} />
          <Botao titulo="Cancelar solicitação" variante="perigo" onPress={cancelar} />
        </View>
      )}
      {!podeAlterar(sol) && !cancelada && (
        <Text style={[s.textoSuave, { fontSize: 13 }]}>
          A solicitação já avançou para “{sol.status}” e não pode mais ser alterada ou cancelada.
        </Text>
      )}

      <Text style={s.tituloSecao}>Histórico</Text>
      {[...sol.historico].reverse().map((h, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 }}>
          <StatusBadge status={h.status} />
          <Text style={[s.textoSuave, { fontSize: 13 }]}>{new Date(h.data).toLocaleString('pt-BR')}</Text>
        </View>
      ))}
    </ScrollView>
  )
}
