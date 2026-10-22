import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)

// Guarda o usuário logado e disponibiliza login/logout para todas as telas.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.usuarioAtual().then((u) => {
      setUsuario(u)
      setCarregando(false)
    })
  }, [])

  const valor = {
    usuario,
    carregando,
    async entrar(email, senha) {
      const u = await api.login(email, senha)
      setUsuario(u)
      return u
    },
    async cadastrar(dados) {
      const u = await api.cadastrar(dados)
      setUsuario(u)
      return u
    },
    async sair() {
      await api.logout()
      setUsuario(null)
    },
    atualizar: setUsuario,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
