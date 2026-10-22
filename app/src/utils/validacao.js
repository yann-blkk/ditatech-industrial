// Funções de validação usadas nos formulários (RNF010, RN003, RN011, RN012).

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim())
}

export function quantidadeValida(valor) {
  const n = Number(valor)
  return Number.isInteger(n) && n > 0
}

export function telefoneValido(telefone) {
  const numeros = String(telefone).replace(/\D/g, '')
  return numeros.length >= 10 && numeros.length <= 11
}

// Recebe { campo: valor } e uma lista de campos obrigatórios.
// Devolve { campo: 'mensagem' } para os campos vazios.
export function verificarObrigatorios(dados, campos) {
  const erros = {}
  campos.forEach((campo) => {
    if (dados[campo] === undefined || String(dados[campo]).trim() === '') {
      erros[campo] = 'Campo obrigatório.'
    }
  })
  return erros
}
