import { useEffect, useRef } from 'react'
import { navigate } from '../../hooks/useHashRoute.js'
import { useCaptureLoading } from '../ui/captureLoading.js'
import { Icon } from '../ui/Icon.jsx'
import { IconButton } from '../ui/IconButton.jsx'
import { Spinner } from '../ui/Spinner.jsx'
import { Breadcrumbs } from './Breadcrumbs.jsx'
import { LiveIndicator } from './LiveIndicator.jsx'

/** Zona 1 · Header fijo: menú, ubicación, búsqueda, estado en vivo, tema y alertas. */
export function Header({ crumbs, menuOpen, onOpenMenu, isDark, onToggleTheme, alertCount }) {
  const searchRef = useRef(null)
  const loading = useCaptureLoading()

  // 5D · Atajo Ctrl/⌘ K para enfocar la búsqueda
  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        const input = searchRef.current
        if (input && input.getClientRects().length > 0) {
          event.preventDefault()
          input.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function onSearch(event) {
    event.preventDefault()
    const query = searchRef.current.value.trim()
    navigate(query ? `/instancias?q=${encodeURIComponent(query)}` : '/instancias')
  }

  return (
    <header className="header">
      <IconButton
        icon="menu"
        label="Abrir menú"
        className="menu-button"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
        onClick={onOpenMenu}
      />

      <div className="header-title">
        <Breadcrumbs items={crumbs} />
      </div>

      <form className={`search${loading ? ' is-loading' : ''}`} role="search" onSubmit={onSearch} aria-busy={loading || undefined}>
        {loading ? <Spinner /> : <Icon name="search" size={16} />}
        <label htmlFor="global-search" className="sr-only">
          Buscar instancia, IP o servicio
        </label>
        <input ref={searchRef} id="global-search" type="search" placeholder="Buscar instancia, IP o servicio…" readOnly={loading || undefined} />
        {!loading && <kbd>Ctrl K</kbd>}
      </form>

      <div className="header-actions">
        <LiveIndicator />
        <button
          type="button"
          className={`theme-toggle${loading ? ' is-loading' : ''}`}
          aria-pressed={isDark}
          aria-busy={loading || undefined}
          disabled={loading}
          onClick={onToggleTheme}
        >
          {loading ? <Spinner /> : isDark ? <Icon name="moon" size={18} className="icon-moon" /> : <Icon name="sun" size={18} className="icon-sun" />}
          <span className="theme-toggle-label">Modo oscuro</span>
          <span className="sr-only">{isDark ? '(activado)' : '(desactivado)'}</span>
          <span className="switch" aria-hidden="true">
            <span className="switch-thumb" />
          </span>
        </button>
        <IconButton icon="bell" href="#/alertas" label={`Alertas: ${alertCount} activas`}>
          {alertCount > 0 && (
            <span className="badge" aria-hidden="true">
              {alertCount}
            </span>
          )}
        </IconButton>
      </div>
    </header>
  )
}
