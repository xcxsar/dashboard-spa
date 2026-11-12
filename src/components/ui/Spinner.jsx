import { Icon } from './Icon.jsx'

export function Spinner({ className = '' }) {
  return (
    <span className={`spinner ${className}`} aria-hidden="true">
      <Icon name="spinner" size={18} />
    </span>
  )
}
