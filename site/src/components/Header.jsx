import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Header() {
  const { usuario, sair } = useAuth()
  const [aberto, setAberto] = useState(false)
  const navegar = useNavigate()

  const fechar = () => setAberto(false)

  async function handleSair() {
    await sair()
    fechar()
    navegar('/')
  }

  return (
    <header className="header">
      <div className="container header-conteudo">
        <Link to="/" className="logo" onClick={fechar}>
          <Logo />
        </Link>

        <button
          className="menu-botao"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          onClick={() => setAberto(!aberto)}
        >
          ☰
        </button>

        <nav className={`nav ${aberto ? 'nav-aberta' : ''}`} onClick={fechar}>
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink to="/solucoes">Soluções</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/contato">Contato</NavLink>

          {usuario?.perfil === 'admin' && <NavLink to="/admin">Painel admin</NavLink>}
          {usuario?.perfil === 'cliente' && <NavLink to="/minha-conta">Minha conta</NavLink>}

          {usuario ? (
            <button className="botao botao-contorno botao-pequeno" onClick={handleSair}>
              Sair
            </button>
          ) : (
            <Link to="/login" className="botao botao-pequeno">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
