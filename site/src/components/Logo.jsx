// Marca da DitaTech: uma câmera de segurança dentro de um quadrado azul.
// "invertida" (quadrado branco, câmera azul) é usada sobre fundos azuis.
export function MarcaCamera({ tamanho = 36, invertida = false }) {
  const fundo = invertida ? '#fff' : '#1565c0'
  const frente = invertida ? '#1565c0' : '#fff'
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={fundo} />
      <g transform="translate(-1 2)">
        {/* suporte de parede */}
        <rect x="9" y="38" width="6" height="16" rx="2" fill={frente} />
        <path d="M15 46h9a3 3 0 0 0 3-3v-6" fill="none" stroke={frente} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* corpo da câmera, inclinado para baixo */}
        <g transform="rotate(18 30 28)">
          <rect x="11" y="15" width="40" height="5" rx="2.5" fill={frente} />
          <rect x="13" y="21" width="34" height="15" rx="4" fill={frente} />
          <rect x="45" y="22.5" width="6" height="12" rx="2" fill={frente} />
          <circle cx="48" cy="28.5" r="3.6" fill="#0d47a1" />
          <circle cx="49" cy="27.5" r="1.1" fill="#fff" />
          <circle cx="19" cy="28.5" r="1.8" fill={fundo} />
        </g>
      </g>
    </svg>
  )
}

export default function Logo({ claro = false }) {
  return (
    <span className={`logo-conteudo ${claro ? 'logo-claro' : ''}`}>
      <MarcaCamera invertida={claro} />
      <span>
        DitaTech <strong>Industrial</strong>
      </span>
    </span>
  )
}
