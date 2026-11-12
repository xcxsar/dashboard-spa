import { useRef } from 'react'
import { CURRENT_USER } from '../../data/mock.js'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { useCaptureLoading } from '../ui/captureLoading.js'
import { Icon } from '../ui/Icon.jsx'
import { IconButton } from '../ui/IconButton.jsx'
import { Spinner } from '../ui/Spinner.jsx'

const NAV = [
  { section: 'overview', href: '#/', label: 'Vista general', icon: 'home' },
  { section: 'instances', href: '#/instancias', label: 'Instancias', icon: 'server' },
  { section: 'alerts', href: '#/alertas', label: 'Alertas', icon: 'bell' },
]

/**
 * Zona 1 · Sidebar: persistente en escritorio (≥1024 px) y retráctil en
 * móvil/tableta, donde se comporta como panel modal con foco atrapado.
 */
export function Sidebar({ section, alertCount, open, overlay, onClose }) {
  const ref = useRef(null)
  const modal = overlay && open
  const loading = useCaptureLoading()
  useFocusTrap(ref, modal, { onEscape: onClose })

  return (
    <>
      <div className={`scrim sidebar-scrim${modal ? ' is-visible' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        ref={ref}
        id="sidebar"
        className={`sidebar${open ? ' is-open' : ''}`}
        aria-label="Menú principal"
        role={overlay ? 'dialog' : undefined}
        aria-modal={modal || undefined}
        inert={overlay && !open ? true : undefined}
      >
        <div className="sidebar-head">
          <a className="brand" href="#/">
            <span className="brand-logo">
              <Icon name="cloud" />
            </span>
            <span className="brand-text">
              <span className="brand-name">CloudOps</span>
              <span className="brand-tagline">Monitoreo de infraestructura</span>
            </span>
          </a>
          <IconButton icon="x" label="Cerrar menú" className="sidebar-close" onClick={onClose} />
        </div>

        <nav aria-label="Secciones">
          <p className="sidebar-section">MENÚ</p>
          <ul className="nav-list">
            {NAV.map((item) => (
              <li key={item.section}>
                <a
                  className={`nav-link${loading ? ' is-loading' : ''}`}
                  href={item.href}
                  aria-current={section === item.section ? 'page' : undefined}
                  aria-busy={loading || undefined}
                  aria-disabled={loading || undefined}
                >
                  {loading ? <Spinner /> : <Icon name={item.icon} />}
                  <span className="nav-label">{item.label}</span>
                  {item.section === 'alerts' && alertCount > 0 && (
                    <span className="badge">
                      {alertCount}
                      <span className="sr-only"> activas</span>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-user">
          <span className="avatar" aria-hidden="true">
            {CURRENT_USER.initials}
          </span>
          <span className="user-meta">
            <strong>{CURRENT_USER.name}</strong>
            <small>{CURRENT_USER.role}</small>
          </span>
        </div>
      </aside>
    </>
  )
}
