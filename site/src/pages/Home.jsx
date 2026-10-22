import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProdutoCard from '../components/ProdutoCard'
import { listarProdutos } from '../services/api'
import { SOLUCOES } from '../data/solucoes'

export default function Home() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    listarProdutos().then((lista) => setDestaques(lista.slice(0, 3)))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="container hero-conteudo">
          <div>
            <span className="hero-tag">Indústria 4.0 e Automação Industrial</span>
            <h1>Automação industrial em um só lugar</h1>
            <p>
              Consulte sensores, CLPs, robôs e outros equipamentos, compare especificações técnicas e
              solicite orçamentos sem sair da plataforma. Depois, acompanhe cada pedido pela sua conta.
            </p>
            <div className="hero-acoes">
              <Link to="/produtos" className="botao">Ver produtos</Link>
              <Link to="/orcamento" className="botao botao-claro">Solicitar orçamento</Link>
            </div>
          </div>
          <img className="hero-imagem" src="/produtos/robo-colaborativo.jpg" alt="Robô colaborativo em uma bancada de trabalho" />
        </div>
      </section>

      <section className="container secao">
        <div className="grade-3">
          <div className="destaque">
            <strong>1. Consulte</strong>
            <p>Pesquise produtos por nome e filtre por categoria.</p>
          </div>
          <div className="destaque">
            <strong>2. Solicite</strong>
            <p>Escolha o equipamento, informe a quantidade e envie seu pedido de orçamento.</p>
          </div>
          <div className="destaque">
            <strong>3. Acompanhe</strong>
            <p>Veja o status da solicitação, da análise até a conclusão.</p>
          </div>
        </div>
      </section>

      <section className="container secao">
        <div className="secao-topo">
          <h2>Produtos em destaque</h2>
          <Link to="/produtos">Ver todos →</Link>
        </div>
        <div className="grade-3">
          {destaques.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
      </section>

      <section className="container secao">
        <div className="secao-topo">
          <h2>Nossas soluções</h2>
          <Link to="/solucoes">Conhecer soluções →</Link>
        </div>
        <div className="grade-3">
          {SOLUCOES.slice(0, 3).map((s) => (
            <div key={s.id} className="card card-corpo">
              <h3>{s.titulo}</h3>
              <p>{s.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container secao">
        <div className="chamada">
          <div>
            <h2>Precisa de ajuda para escolher?</h2>
            <p>Fale com um especialista da DitaTech e encontre a solução certa para sua linha.</p>
          </div>
          <Link to="/contato" className="botao botao-claro">Falar com especialista</Link>
        </div>
      </section>
    </>
  )
}
