import { Link } from 'react-router-dom'
import { SOLUCOES } from '../data/solucoes'

// Soluções de automação oferecidas (RF022).
export default function Solucoes() {
  return (
    <div className="container pagina">
      <h1>Soluções de automação</h1>
      <p className="subtitulo">Projetos completos para diferentes necessidades da indústria.</p>

      <div className="lista-solucoes">
        {SOLUCOES.map((s) => (
          <article key={s.id} className="card card-corpo solucao">
            <h2>{s.titulo}</h2>
            <p>{s.descricao}</p>
            <div className="chips">
              {s.aplicacoes.map((a) => (
                <span key={a} className="etiqueta">{a}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="chamada secao">
        <div>
          <h2>Quer uma demonstração?</h2>
          <p>Nossos especialistas apresentam a solução aplicada ao seu processo.</p>
        </div>
        <Link to="/contato" className="botao botao-claro">Falar com especialista</Link>
      </div>
    </div>
  )
}
