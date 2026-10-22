import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import RotaProtegida from './components/RotaProtegida'
import { AuthProvider } from './context/AuthContext'
import Admin from './pages/Admin'
import Cadastro from './pages/Cadastro'
import Confirmacao from './pages/Confirmacao'
import Contato from './pages/Contato'
import Creditos from './pages/Creditos'
import Home from './pages/Home'
import Login from './pages/Login'
import MinhaConta from './pages/MinhaConta'
import Orcamento from './pages/Orcamento'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import Produtos from './pages/Produtos'
import RecuperarSenha from './pages/RecuperarSenha'
import Sobre from './pages/Sobre'
import Solucoes from './pages/Solucoes'
import SolicitacaoDetalhe from './pages/SolicitacaoDetalhe'

// Volta ao topo ao trocar de página.
function RolarParaTopo() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RolarParaTopo />
        <Header />
        <main>
          <Routes>
            {/* Área pública */}
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
            <Route path="/solucoes" element={<Solucoes />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />

            {/* Área do cliente — exige login (RN001, RN009) */}
            <Route path="/orcamento" element={<RotaProtegida><Orcamento /></RotaProtegida>} />
            <Route path="/orcamento/confirmacao" element={<RotaProtegida><Confirmacao /></RotaProtegida>} />
            <Route path="/minha-conta" element={<RotaProtegida><MinhaConta /></RotaProtegida>} />
            <Route path="/minha-conta/solicitacoes/:id" element={<RotaProtegida><SolicitacaoDetalhe /></RotaProtegida>} />

            {/* Área administrativa — exige perfil admin (RN013) */}
            <Route path="/admin" element={<RotaProtegida somenteAdmin><Admin /></RotaProtegida>} />

            <Route
              path="*"
              element={
                <div className="container pagina">
                  <h1>Página não encontrada</h1>
                  <Link to="/">← Voltar ao início</Link>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
