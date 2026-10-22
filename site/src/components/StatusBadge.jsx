// Etiqueta colorida com o status da solicitação.
const CLASSES = {
  Solicitada: 'status-neutro',
  'Em análise': 'status-alerta',
  'Orçamento enviado': 'status-info',
  Aprovada: 'status-info',
  'Em execução': 'status-info',
  Concluída: 'status-sucesso',
  Cancelada: 'status-erro',
}

export default function StatusBadge({ status }) {
  return <span className={`status ${CLASSES[status] || 'status-neutro'}`}>{status}</span>
}
