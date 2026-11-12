import { useCaptureLoading } from './captureLoading.js'
import { Icon } from './Icon.jsx'
import { Spinner } from './Spinner.jsx'

function classes(variant, block, loading, className) {
  return ['btn', `btn-${variant}`, block && 'btn-block', loading && 'is-loading', className].filter(Boolean).join(' ')
}

/**
 * Estados: Default · Hover · Focus (:focus-visible) · Disabled · Loading.
 * En Loading el botón queda deshabilitado (bloquea el reenvío) y muestra un spinner.
 */
export function Button({ variant = 'secondary', icon, loading: loadingProp = false, disabled = false, block = false, className, type = 'button', children, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  return (
    <button
      type={type}
      className={classes(variant, block, loading, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  )
}

export function ButtonLink({ variant = 'secondary', icon, iconEnd, block = false, className, children, ...props }) {
  // TEMPORAL (capturas): con Alt+Shift+L los enlaces con aspecto de botón también muestran Loading
  const loading = useCaptureLoading()
  return (
    <a className={classes(variant, block, loading, className)} aria-busy={loading || undefined} aria-disabled={loading || undefined} {...props}>
      {loading ? <Spinner /> : icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {!loading && iconEnd && <Icon name={iconEnd} size={18} />}
    </a>
  )
}
