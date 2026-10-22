import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Bloqueia páginas que exigem login (RN009) ou perfil de administrador (RN013).
export default function RotaProtegida({ children, somenteAdmin = false }) {
  const { usuario, carregando } = useAuth()
  const local = useLocation()

  if (carregando) return <p className="container pagina">Carregando...</p>

  if (!usuario) {
    // Depois do login, o usuário volta para a página que tentou acessar.
    return <Navigate to="/login" replace state={{ voltarPara: local.pathname + local.search }} />
  }

  if (somenteAdmin && usuario.perfil !== 'admin') {
    return (
      <div className="container pagina">
        <h1>Acesso negado</h1>
        <p>Esta área é exclusiva para administradores.</p>
      </div>
    )
  }

  return children
}
