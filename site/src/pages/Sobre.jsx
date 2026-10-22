export default function Sobre() {
  return (
    <div className="container pagina">
      <h1>Sobre a DitaTech Industrial</h1>
      <p className="subtitulo">
        Somos especialistas em soluções de automação para ambientes industriais.
      </p>

      <p>
        A DitaTech Industrial nasceu para aproximar as empresas das tecnologias da Indústria 4.0.
        Reunimos em uma única plataforma sensores, controladores, robôs e sistemas de supervisão,
        com informações técnicas claras e um processo de orçamento simples e rastreável.
      </p>
      <p>
        Nossa equipe de engenheiros e técnicos acompanha cada projeto, da escolha do equipamento à
        implantação na linha de produção.
      </p>

      <div className="grade-3 secao">
        <div className="card card-corpo">
          <h3>Missão</h3>
          <p>Facilitar o acesso das indústrias a soluções de automação confiáveis e eficientes.</p>
        </div>
        <div className="card card-corpo">
          <h3>Visão</h3>
          <p>Ser referência regional em automação industrial e transformação digital da produção.</p>
        </div>
        <div className="card card-corpo">
          <h3>Valores</h3>
          <ul className="lista">
            <li>Segurança em primeiro lugar</li>
            <li>Transparência com o cliente</li>
            <li>Inovação com responsabilidade</li>
          </ul>
        </div>
      </div>

      <section className="secao">
        <h2>Em números</h2>
        <div className="grade-3">
          <div className="numero"><strong>+300</strong><span>projetos entregues</span></div>
          <div className="numero"><strong>+120</strong><span>clientes industriais</span></div>
          <div className="numero"><strong>15</strong><span>anos de experiência</span></div>
        </div>
      </section>
    </div>
  )
}
