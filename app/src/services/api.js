// "API" simulada do aplicativo DitaTech Industrial.
// Mesmas regras do site, mas os dados ficam salvos no aparelho (AsyncStorage).
// Todas as funções são assíncronas, como seriam com uma API real.

import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'
import { PRODUTOS_INICIAIS } from '../data/produtos'
import { emailValido, quantidadeValida, verificarObrigatorios } from '../utils/validacao'

const CHAVES = {
  usuarios: 'ditatech_usuarios',
  sessao: 'ditatech_sessao',
  produtos: 'ditatech_produtos',
  solicitacoes: 'ditatech_solicitacoes',
}

// Fluxo de status (RN006). "Cancelada" é usado quando o cliente cancela (RN005).
export const STATUS = [
  'Solicitada',
  'Em análise',
  'Orçamento enviado',
  'Aprovada',
  'Em execução',
  'Concluída',
]
export const STATUS_CANCELADA = 'Cancelada'
const STATUS_EDITAVEIS = ['Solicitada', 'Em análise'] // RN004 e RN005

// ---------- utilitários internos ----------

async function ler(chave, padrao) {
  try {
    const valor = await AsyncStorage.getItem(chave)
    return valor ? JSON.parse(valor) : padrao
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  return AsyncStorage.setItem(chave, JSON.stringify(valor))
}

function esperar(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// A senha nunca é salva em texto puro (RNF005): guardamos apenas o hash SHA-256.
function gerarHash(texto) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, texto)
}

function semSenha(usuario) {
  if (!usuario) return null
  const { senhaHash: _senhaHash, ...resto } = usuario
  return resto
}

// Cria os dados de demonstração na primeira vez que o app é aberto.
async function prepararDados() {
  if (!(await AsyncStorage.getItem(CHAVES.produtos))) {
    await gravar(CHAVES.produtos, PRODUTOS_INICIAIS)
  }
  if (!(await AsyncStorage.getItem(CHAVES.usuarios))) {
    await gravar(CHAVES.usuarios, [
      {
        id: 1,
        nome: 'Administrador DitaTech',
        empresa: 'DitaTech Industrial',
        email: 'admin@ditatech.com.br',
        telefone: '(11) 4002-8922',
        perfil: 'admin',
        senhaHash: await gerarHash('admin123'),
      },
      {
        id: 2,
        nome: 'Cliente Demonstração',
        empresa: 'Metalúrgica Exemplo Ltda.',
        email: 'cliente@empresa.com.br',
        telefone: '(11) 91234-5678',
        perfil: 'cliente',
        senhaHash: await gerarHash('cliente123'),
      },
    ])
  }
  if (!(await AsyncStorage.getItem(CHAVES.solicitacoes))) {
    await gravar(CHAVES.solicitacoes, [
      {
        id: 1024,
        usuarioId: 2,
        produtoId: 3,
        produtoNome: 'CLP Compacto DT-1200',
        quantidade: 2,
        nome: 'Cliente Demonstração',
        empresa: 'Metalúrgica Exemplo Ltda.',
        email: 'cliente@empresa.com.br',
        telefone: '(11) 91234-5678',
        mensagem: 'Automação de uma prensa hidráulica.',
        status: 'Em análise',
        criadaEm: '2026-10-10T10:00:00.000Z',
        historico: [
          { status: 'Solicitada', data: '2026-10-10T10:00:00.000Z' },
          { status: 'Em análise', data: '2026-10-11T14:30:00.000Z' },
        ],
      },
    ])
  }
}

const pronto = prepararDados()

// ---------- autenticação (RF001, RF002, RF003, RF016) ----------

export async function cadastrar(dados) {
  await pronto
  await esperar()
  const erros = verificarObrigatorios(dados, ['nome', 'empresa', 'email', 'telefone', 'senha'])
  if (Object.keys(erros).length) throw new Error('Preencha todos os campos obrigatórios.')
  if (!emailValido(dados.email)) throw new Error('Informe um e-mail válido.') // RN011
  if (dados.senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.')

  const usuarios = await ler(CHAVES.usuarios, [])
  const email = dados.email.trim().toLowerCase()
  if (usuarios.some((u) => u.email === email)) {
    throw new Error('Este e-mail já está cadastrado.') // RN010
  }

  const novo = {
    id: Date.now(),
    nome: dados.nome.trim(),
    empresa: dados.empresa.trim(),
    email,
    telefone: dados.telefone.trim(),
    perfil: 'cliente',
    senhaHash: await gerarHash(dados.senha),
  }
  await gravar(CHAVES.usuarios, [...usuarios, novo])
  await gravar(CHAVES.sessao, novo.id)
  return semSenha(novo)
}

export async function login(email, senha) {
  await pronto
  await esperar()
  if (!email || !senha) throw new Error('Informe e-mail e senha.')
  const usuarios = await ler(CHAVES.usuarios, [])
  const hash = await gerarHash(senha)
  const usuario = usuarios.find(
    (u) => u.email === email.trim().toLowerCase() && u.senhaHash === hash,
  )
  if (!usuario) throw new Error('E-mail ou senha incorretos.')
  await gravar(CHAVES.sessao, usuario.id)
  return semSenha(usuario)
}

export async function logout() {
  await AsyncStorage.removeItem(CHAVES.sessao)
}

export async function usuarioAtual() {
  await pronto
  const id = await ler(CHAVES.sessao, null)
  if (!id) return null
  const usuarios = await ler(CHAVES.usuarios, [])
  return semSenha(usuarios.find((u) => u.id === id))
}

// Simulação: em um sistema real, um e-mail com link seria enviado.
export async function recuperarSenha(email) {
  await esperar()
  if (!emailValido(email)) throw new Error('Informe um e-mail válido.')
  return 'Se o e-mail estiver cadastrado, você receberá as instruções para criar uma nova senha.'
}

// RF015 — alterar dados cadastrais
export async function atualizarPerfil(dados) {
  const atual = await usuarioAtual()
  if (!atual) throw new Error('Faça login para continuar.') // RN009
  await esperar()
  const erros = verificarObrigatorios(dados, ['nome', 'empresa', 'email', 'telefone'])
  if (Object.keys(erros).length) throw new Error('Preencha todos os campos obrigatórios.')
  if (!emailValido(dados.email)) throw new Error('Informe um e-mail válido.')

  const usuarios = await ler(CHAVES.usuarios, [])
  const email = dados.email.trim().toLowerCase()
  if (usuarios.some((u) => u.email === email && u.id !== atual.id)) {
    throw new Error('Este e-mail já está em uso por outra conta.')
  }

  const novoHash = dados.novaSenha ? await gerarHash(dados.novaSenha) : null
  let atualizado
  const lista = usuarios.map((u) => {
    if (u.id !== atual.id) return u
    atualizado = {
      ...u,
      nome: dados.nome.trim(),
      empresa: dados.empresa.trim(),
      email,
      telefone: dados.telefone.trim(),
      ...(novoHash ? { senhaHash: novoHash } : {}),
    }
    return atualizado
  })
  await gravar(CHAVES.usuarios, lista)
  return semSenha(atualizado)
}

// ---------- produtos (RF004–RF008) ----------

export async function listarProdutos({ busca = '', categoria = '' } = {}) {
  await pronto
  const termo = busca.trim().toLowerCase()
  const produtos = await ler(CHAVES.produtos, [])
  return produtos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!termo || p.nome.toLowerCase().includes(termo)),
  )
}

export async function buscarProduto(id) {
  await pronto
  const produtos = await ler(CHAVES.produtos, [])
  return produtos.find((p) => p.id === Number(id)) || null
}

async function exigirAdmin() {
  const usuario = await usuarioAtual()
  if (!usuario || usuario.perfil !== 'admin') {
    throw new Error('Acesso permitido apenas para administradores.') // RN007, RN013
  }
}

// ---------- solicitações de orçamento (RF009–RF014, RF020, RF021) ----------

function validarSolicitacao(dados) {
  // RN002 / RN012 — campos obrigatórios
  const erros = verificarObrigatorios(dados, ['produtoId', 'quantidade', 'nome', 'email', 'telefone'])
  if (Object.keys(erros).length) throw new Error('Preencha todos os campos obrigatórios.')
  // RN003 — quantidade inteira maior que zero
  if (!quantidadeValida(dados.quantidade)) {
    throw new Error('A quantidade deve ser um número inteiro maior que zero.')
  }
  if (!emailValido(dados.email)) throw new Error('Informe um e-mail válido.')
}

export async function criarSolicitacao(dados) {
  const usuario = await usuarioAtual()
  if (!usuario) throw new Error('Faça login ou cadastre-se para solicitar um orçamento.') // RN001
  await esperar()
  validarSolicitacao(dados)

  const produto = await buscarProduto(dados.produtoId)
  if (!produto) throw new Error('Produto não encontrado.')

  const solicitacoes = await ler(CHAVES.solicitacoes, [])
  const agora = new Date().toISOString()
  const nova = {
    id: Math.max(1000, ...solicitacoes.map((s) => s.id)) + 1,
    usuarioId: usuario.id, // RN015 — vincula a solicitação ao cliente
    produtoId: produto.id,
    produtoNome: produto.nome,
    quantidade: Number(dados.quantidade),
    nome: dados.nome.trim(),
    empresa: (dados.empresa || '').trim(),
    email: dados.email.trim(),
    telefone: dados.telefone.trim(),
    mensagem: (dados.mensagem || '').trim(),
    status: 'Solicitada', // RN006 — status inicial automático
    criadaEm: agora,
    historico: [{ status: 'Solicitada', data: agora }],
  }
  await gravar(CHAVES.solicitacoes, [...solicitacoes, nova])
  return nova // RN014 — a confirmação só aparece depois de registrar
}

// RN015 — o cliente vê apenas as próprias solicitações
export async function minhasSolicitacoes() {
  const usuario = await usuarioAtual()
  if (!usuario) throw new Error('Faça login para continuar.')
  const lista = await ler(CHAVES.solicitacoes, [])
  return lista.filter((s) => s.usuarioId === usuario.id).sort((a, b) => b.id - a.id)
}

export async function buscarSolicitacao(id) {
  const usuario = await usuarioAtual()
  if (!usuario) throw new Error('Faça login para continuar.')
  const lista = await ler(CHAVES.solicitacoes, [])
  const s = lista.find((x) => x.id === Number(id))
  if (!s || (usuario.perfil !== 'admin' && s.usuarioId !== usuario.id)) {
    throw new Error('Solicitação não encontrada.')
  }
  return s
}

export function podeAlterar(solicitacao) {
  return STATUS_EDITAVEIS.includes(solicitacao.status)
}

// RN004 — alterar apenas se "Solicitada" ou "Em análise"
export async function editarSolicitacao(id, dados) {
  const atual = await buscarSolicitacao(id)
  if (!podeAlterar(atual)) throw new Error('Esta solicitação não pode mais ser alterada.')
  await esperar()
  validarSolicitacao({ ...atual, ...dados })
  const lista = await ler(CHAVES.solicitacoes, [])
  await gravar(
    CHAVES.solicitacoes,
    lista.map((s) =>
      s.id === atual.id
        ? { ...s, quantidade: Number(dados.quantidade), mensagem: (dados.mensagem || '').trim() }
        : s,
    ),
  )
}

// RN005 — cancelar apenas se "Solicitada" ou "Em análise"
export async function cancelarSolicitacao(id) {
  const atual = await buscarSolicitacao(id)
  if (!podeAlterar(atual)) throw new Error('Esta solicitação não pode mais ser cancelada.')
  await mudarStatus(atual.id, STATUS_CANCELADA)
}

async function mudarStatus(id, status) {
  const agora = new Date().toISOString()
  const lista = await ler(CHAVES.solicitacoes, [])
  await gravar(
    CHAVES.solicitacoes,
    lista.map((s) =>
      s.id === id ? { ...s, status, historico: [...s.historico, { status, data: agora }] } : s,
    ),
  )
}

// RF020 — administrador consulta todas as solicitações
export async function todasSolicitacoes() {
  await exigirAdmin()
  const lista = await ler(CHAVES.solicitacoes, [])
  return lista.sort((a, b) => b.id - a.id)
}

// RF021 / RN007 — somente o administrador altera o status
export async function alterarStatus(id, status) {
  await exigirAdmin()
  if (![...STATUS, STATUS_CANCELADA].includes(status)) throw new Error('Status inválido.')
  await mudarStatus(Number(id), status)
}
