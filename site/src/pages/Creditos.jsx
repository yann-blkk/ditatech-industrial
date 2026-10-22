import { FOTOS } from '../data/fotos'
import { PRODUTOS_INICIAIS } from '../data/produtos'

// Créditos das fotos (exigência das licenças Creative Commons).
export default function Creditos() {
  return (
    <div className="container pagina pagina-estreita">
      <h1>Créditos das imagens</h1>
      <p className="subtitulo">
        As fotos dos produtos são ilustrativas e foram obtidas no Wikimedia Commons e no Flickr,
        sob licenças Creative Commons. As marcas que aparecem nas fotos pertencem aos seus donos.
      </p>
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Autor</th>
              <th>Licença</th>
              <th>Fonte</th>
            </tr>
          </thead>
          <tbody>
            {PRODUTOS_INICIAIS.map((p) => {
              const f = FOTOS[p.id]
              if (!f) return null
              return (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{f.autor}</td>
                  <td><a href={f.licencaUrl} target="_blank" rel="noreferrer">{f.licenca}</a></td>
                  <td><a href={f.fonte} target="_blank" rel="noreferrer">Ver original</a></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
