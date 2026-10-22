// Campo de formulário com rótulo, marcação de obrigatório (RNF007) e mensagem de erro (RNF006).
export default function Campo({ rotulo, nome, erro, obrigatorio, tipo = 'text', children, ...props }) {
  const id = `campo-${nome}`
  return (
    <div className="campo">
      <label htmlFor={id}>
        {rotulo} {obrigatorio && <span className="obrigatorio" aria-label="obrigatório">*</span>}
      </label>
      {children ? (
        children({ id, name: nome, 'aria-invalid': !!erro })
      ) : tipo === 'textarea' ? (
        <textarea id={id} name={nome} rows={4} aria-invalid={!!erro} {...props} />
      ) : (
        <input id={id} name={nome} type={tipo} aria-invalid={!!erro} {...props} />
      )}
      {erro && <span className="campo-erro">{erro}</span>}
    </div>
  )
}
