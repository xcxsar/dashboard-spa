import { useState } from 'react'
import { AlertCard } from '../components/AlertCard.jsx'
import { Icon } from '../components/ui/Icon.jsx'
import { Segmented } from '../components/ui/Segmented.jsx'

export function Alerts({ alerts, onSilence }) {
  const [filter, setFilter] = useState('all')
  const active = alerts.filter((a) => !a.silenced)
  const silenced = alerts.filter((a) => a.silenced)
  const filters = [
    { id: 'all', label: `Todas (${active.length})`, list: active },
    { id: 'crit', label: `Críticas (${active.filter((a) => a.severity === 'crit').length})`, list: active.filter((a) => a.severity === 'crit') },
    { id: 'warn', label: `Advertencias (${active.filter((a) => a.severity === 'warn').length})`, list: active.filter((a) => a.severity === 'warn') },
    { id: 'silenced', label: `Silenciadas (${silenced.length})`, list: silenced },
  ]
  const current = filters.find((f) => f.id === filter)

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-titles">
          <h1 id="page-title" tabIndex={-1}>
            Alertas
          </h1>
          <p className="page-subtitle">{active.length} activas · ordenadas por severidad y antigüedad</p>
        </div>
      </header>

      <Segmented label="Filtrar por severidad" options={filters} value={filter} onChange={setFilter} />

      {current.list.length === 0 ? (
        <p className="empty">No hay alertas en esta categoría.</p>
      ) : (
        <div className="alert-grid">
          {current.list.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onSilence={onSilence} />
          ))}
        </div>
      )}

      <p className="tip">
        <Icon name="alert" size={18} />
        Las alertas silenciadas vuelven a notificarse si la condición persiste más de 1 h.
      </p>
    </div>
  )
}
