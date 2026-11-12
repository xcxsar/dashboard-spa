import { getHealth, meterTone } from '../data/mock.js'
import { navigate } from '../hooks/useHashRoute.js'
import { Icon } from './ui/Icon.jsx'
import { StatusChip } from './ui/StatusChip.jsx'

function Meter({ value, series }) {
  const tone = meterTone(value)
  const color = tone ? `tone-${tone}` : series ? 'series-2' : ''
  return (
    <span className="meter-track" aria-hidden="true">
      <span className={`meter-fill ${color}`} style={{ width: `${value}%` }} />
    </span>
  )
}

/** Tabla en tableta/escritorio; tarjetas apiladas en móvil (mismo contenido). */
export function InstanceTable({ instances, caption }) {
  if (instances.length === 0) return <p className="empty">No hay instancias que coincidan con los filtros.</p>

  return (
    <>
      <table className="table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Instancia</th>
            <th scope="col">Estado</th>
            <th scope="col">CPU</th>
            <th scope="col">Memoria</th>
            <th scope="col">Región</th>
            <th scope="col">
              <span className="sr-only">Abrir</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {instances.map((instance) => {
            const health = getHealth(instance)
            const off = instance.status === 'terminated'
            return (
              <tr key={instance.id} className={off ? 'is-off' : undefined} onClick={() => navigate(`/instancias/${instance.id}`)}>
                <td className="cell-name">
                  <a href={`#/instancias/${instance.id}`} onClick={(event) => event.stopPropagation()}>
                    {instance.id}
                  </a>
                  <span className="cell-sub">{instance.service}</span>
                </td>
                <td>
                  <StatusChip tone={health.tone}>{health.label}</StatusChip>
                </td>
                <td>
                  <span className="meter">
                    <Meter value={off ? 0 : instance.cpu} />
                    <span className="meter-value">{off ? 0 : instance.cpu} %</span>
                  </span>
                </td>
                <td>{off ? 0 : instance.mem} %</td>
                <td>{instance.region}</td>
                <td aria-hidden="true">
                  <Icon name="chevronRight" size={18} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ul className="instance-cards">
        {instances.map((instance) => {
          const health = getHealth(instance)
          const off = instance.status === 'terminated'
          return (
            <li key={instance.id}>
              <a className={`instance-card card-interactive${off ? ' is-off' : ''}`} href={`#/instancias/${instance.id}`}>
                <span className="instance-card-head">
                  <span>
                    <span className="instance-card-name">{instance.id}</span>
                    <span className="cell-sub">
                      {instance.service} · {instance.region}
                    </span>
                  </span>
                  <StatusChip tone={health.tone}>{health.label}</StatusChip>
                </span>
                <span className="instance-card-metrics">
                  <span className="meter">
                    <span className="meter-label">
                      CPU <b>{off ? 0 : instance.cpu} %</b>
                    </span>
                    <Meter value={off ? 0 : instance.cpu} />
                  </span>
                  <span className="meter">
                    <span className="meter-label">
                      Memoria <b>{off ? 0 : instance.mem} %</b>
                    </span>
                    <Meter value={off ? 0 : instance.mem} series />
                  </span>
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </>
  )
}
