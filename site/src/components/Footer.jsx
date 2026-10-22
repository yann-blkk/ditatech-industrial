import { Link } from 'react-router-dom'
import { CONTATO } from '../data/solucoes'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grade">
        <div>
          <Logo claro />
          <p>Soluções de automação para a indústria 4.0.</p>
        </div>
        <div>
          <p className="footer-titulo">Navegação</p>
          <Link to="/produtos">Produtos</Link>
          <Link to="/solucoes">Soluções</Link>
          <Link to="/sobre">Sobre a empresa</Link>
          <Link to="/orcamento">Solicitar orçamento</Link>
          <Link to="/creditos">Créditos das imagens</Link>
        </div>
        <div>
          <p className="footer-titulo">Contato</p>
          <p>{CONTATO.telefone}</p>
          <p>{CONTATO.email}</p>
        </div>
      </div>
      <p className="container footer-copy">© 2026 DitaTech Industrial — empresa fictícia (Trabalho Integrador SESI).</p>
    </footer>
  )
}
