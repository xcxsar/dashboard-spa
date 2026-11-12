/** Atributos de accesibilidad y estado compartidos por los controles. */
export function controlProps({ id, error, hint, loading }) {
  return {
    id,
    className: 'input',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? `${id}-message` : undefined,
    'aria-busy': loading || undefined,
    readOnly: loading || undefined,
  }
}
