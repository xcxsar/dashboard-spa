import { useCaptureLoading } from './captureLoading.js'
import { Icon } from './Icon.jsx'
import { Spinner } from './Spinner.jsx'

/**
 * Botón (o enlace, con `href`) de solo ícono.
 * Estados: Default · Hover · Focus · Disabled · Loading (spinner en lugar del ícono).
 */
export function IconButton({ icon, label, href, loading: loadingProp = false, disabled = false, className = '', children, ...props }) {
  const loading = useCaptureLoading(loadingProp)
  const classes = ['icon-button', loading && 'is-loading', className].filter(Boolean).join(' ')
  const content = (
    <>
      {loading ? <Spinner /> : <Icon name={icon} />}
      {children}
    </>
  )

  if (href) {
    return (
      <a className={classes} href={href} aria-label={label} aria-busy={loading || undefined} aria-disabled={loading || undefined} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} aria-label={label} aria-busy={loading || undefined} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}
