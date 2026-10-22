// "API" simulada da DitaTech Industrial.
// Os dados ficam no localStorage do navegador, então o site funciona sem servidor.
// Todas as funções são assíncronas, como seriam com uma API real (fetch),
// para facilitar a troca por um back-end no futuro.

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

function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave)
    return valor ? JSON.parse(valor) : padrao
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

function esperar(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// A senha nunca é salva em texto puro (RNF005): guardamos apenas o hash SHA-256.
async function gerarHash(texto) {
  // crypto.subtle só existe em https ou localhost; fora disso usamos um hash simples.
  if (!globalThis.crypto?.subtle) {
    let h = 0
    for (const c of texto) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0
    return 'simples-' + (h >>> 0).toString(16)
  }
  const dados = new TextEncoder().encode(texto)
  const hash = await crypto.subtle.digest('SHA-256', dados)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function semSenha(usuario) {
  if (!usuario) return null
  const { senhaHash: _senhaHash, ...resto } = usuario
  return resto
}

// Cria os dados de demonstração na primeira vez que o site é aberto.
async function prepararDados() {
  if (!localStorage.getItem(CHAVES.produtos)) {
    gravar(CHAVES.produtos, PRODUTOS_INICIAIS)
  }
  if (!localStorage.getItem(CHAVES.usuarios)) {
    gravar(CHAVES.usuarios, [
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
  if (!localStorage.getItem(CHAVES.solicitacoes)) {
    gravar(CHAVES.solicitacoes, [
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

  const usuarios = ler(CHAVES.usuarios, [])
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
  gravar(CHAVES.usuarios, [...usuarios, novo])
  gravar(CHAVES.sessao, novo.id)
  return semSenha(novo)
}

export async function login(email, senha) {
  await pronto
  await esperar()
  if (!email || !senha) throw new Error('Informe e-mail e senha.')
  const usuarios = ler(CHAVES.usuarios, [])
  const hash = await gerarHash(senha)
  const usuario = usuarios.find(
    (u) => u.email === email.trim().toLowerCase() && u.senhaHash === hash,
  )
  if (!usuario) throw new Error('E-mail ou senha incorretos.')
  gravar(CHAVES.sessao, usuario.id)
  return semSenha(usuario)
}

export async function logout() {
  localStorage.removeItem(CHAVES.sessao)
}

export async function usuarioAtual() {
  await pronto
  const id = ler(CHAVES.sessao, null)
  if (!id) return null
  return semSenha(ler(CHAVES.usuarios, []).find((u) => u.id === id))
}

// Simulação: em um sistema real, um e-mail com link seria enviado.
export async function recuperarSenha(email) {
  await pronto
  await esperar()
  if (!emailValido(email)) throw new Error('Informe um e-mail válido.')
  // Por segurança, a resposta é a mesma exista ou não o e-mail.
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

  const usuarios = ler(CHAVES.usuarios, [])
  const email = dados.email.trim().toLowerCase()
  if (usuarios.some((u) => u.email === email && u.id !== atual.id)) {
    throw new Error('Este e-mail já está em uso por outra conta.')
  }

  let atualizado
  const lista = await Promise.all(
    usuarios.map(async (u) => {
      if (u.id !== atual.id) return u
      atualizado = {
        ...u,
        nome: dados.nome.trim(),
        empresa: dados.empresa.trim(),
        email,
        telefone: dados.telefone.trim(),
        ...(dados.novaSenha ? { senhaHash: await gerarHash(dados.novaSenha) } : {}),
      }
      return atualizado
    }),
  )
  gravar(CHAVES.usuarios, lista)
  return semSenha(atualizado)
}

// ---------- produtos (RF004–RF008, RF017–RF019) ----------

export async function listarProdutos({ busca = '', categoria = '' } = {}) {
  await pronto
  const termo = busca.trim().toLowerCase()
  return ler(CHAVES.produtos, []).filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      (!termo || p.nome.toLowerCase().includes(termo)),
  )
}

export async function buscarProduto(id) {
  await pronto
  return ler(CHAVES.produtos, []).find((p) => p.id === Number(id)) || null
}

async function exigirAdmin() {
  const usuario = await usuarioAtual()
  if (!usuario || usuario.perfil !== 'admin') {
    throw new Error('Acesso permitido apenas para administradores.') // RN008, RN013
  }
}

export async function salvarProduto(produto) {
  await exigirAdmin()
  const erros = verificarObrigatorios(produto, ['nome', 'categoria', 'resumo', 'descricao'])
  if (Object.keys(erros).length) throw new Error('Preencha nome, categoria, resumo e descrição.')
  const produtos = ler(CHAVES.produtos, [])
  if (produto.id) {
    gravar(CHAVES.produtos, produtos.map((p) => (p.id === produto.id ? produto : p)))
    return produto
  }
  // Ids novos começam em 101 para não reaproveitar as fotos dos produtos iniciais.
  const novo = { ...produto, id: Math.max(100, ...produtos.map((p) => p.id)) + 1 }
  gravar(CHAVES.produtos, [...produtos, novo])
  return novo
}

export async function removerProduto(id) {
  await exigirAdmin()
  gravar(CHAVES.produtos, ler(CHAVES.produtos, []).filter((p) => p.id !== id))
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

  const solicitacoes = ler(CHAVES.solicitacoes, [])
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
  gravar(CHAVES.solicitacoes, [...solicitacoes, nova])
  return nova // RN014 — só retorna (e a tela confirma) depois de registrar
}

// RN015 — o cliente vê apenas as próprias solicitações
export async function minhasSolicitacoes() {
  const usuario = await usuarioAtual()
  if (!usuario) throw new Error('Faça login para continuar.')
  return ler(CHAVES.solicitacoes, [])
    .filter((s) => s.usuarioId === usuario.id)
    .sort((a, b) => b.id - a.id)
}

export async function buscarSolicitacao(id) {
  const usuario = await usuarioAtual()
  if (!usuario) throw new Error('Faça login para continuar.')
  const s = ler(CHAVES.solicitacoes, []).find((x) => x.id === Number(id))
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
  if (!podeAlterar(atual)) {
    throw new Error('Esta solicitação não pode mais ser alterada.')
  }
  await esperar()
  validarSolicitacao({ ...atual, ...dados })
  const lista = ler(CHAVES.solicitacoes, []).map((s) =>
    s.id === atual.id
      ? { ...s, quantidade: Number(dados.quantidade), mensagem: (dados.mensagem || '').trim() }
      : s,
  )
  gravar(CHAVES.solicitacoes, lista)
}

// RN005 — cancelar apenas se "Solicitada" ou "Em análise"
export async function cancelarSolicitacao(id) {
  const atual = await buscarSolicitacao(id)
  if (!podeAlterar(atual)) {
    throw new Error('Esta solicitação não pode mais ser cancelada.')
  }
  mudarStatus(atual.id, STATUS_CANCELADA)
}

function mudarStatus(id, status) {
  const agora = new Date().toISOString()
  const lista = ler(CHAVES.solicitacoes, []).map((s) =>
    s.id === id ? { ...s, status, historico: [...s.historico, { status, data: agora }] } : s,
  )
  gravar(CHAVES.solicitacoes, lista)
}

// RF020 — administrador consulta todas as solicitações
export async function todasSolicitacoes() {
  await exigirAdmin()
  return ler(CHAVES.solicitacoes, []).sort((a, b) => b.id - a.id)
}

// RF021 / RN007 — somente o administrador altera o status
export async function alterarStatus(id, status) {
  await exigirAdmin()
  if (![...STATUS, STATUS_CANCELADA].includes(status)) throw new Error('Status inválido.')
  mudarStatus(Number(id), status)
}
