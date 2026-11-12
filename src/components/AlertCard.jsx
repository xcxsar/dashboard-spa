import { SEVERITY } from '../data/mock.js'
import { Button, ButtonLink } from './ui/Button.jsx'
import { StatusChip } from './ui/StatusChip.jsx'

export function AlertCard({ alert, onSilence }) {
  const severity = SEVERITY[alert.severity]
  return (
    <article className="card alert-card card-interactive">
      <div className="alert-card-head">
        <StatusChip tone={severity.tone}>{severity.label}</StatusChip>
        <time>{alert.time}</time>
      </div>
      <h3>{alert.title}</h3>
      <p>
        {alert.instanceId} · {alert.region}
      </p>
      <div className="button-group">
        <ButtonLink href={`#/instancias/${alert.instanceId}`}>Ver detalle</ButtonLink>
        {!alert.silenced && (
          <Button variant="ghost" onClick={() => onSilence(alert)}>
            Silenciar
          </Button>
        )}
      </div>
    </article>
  )
}
