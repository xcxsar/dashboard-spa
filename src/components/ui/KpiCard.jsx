import { Icon } from './Icon.jsx'
import { Sparkline } from './LineChart.jsx'

/** Tarjeta de estado. Con `href` se vuelve un enlace (tarjeta interactiva). */
export function KpiCard({ label, value, unit, trend, tone, series, href, className = '' }) {
  const Tag = href ? 'a' : 'article'
  return (
    <Tag className={`card kpi${href ? ' card-interactive' : ''}${tone ? ` tone-${tone}` : ''} ${className}`} href={href}>
      <div className="kpi-head">
        <span>{label}</span>
        <Icon name="chart" size={16} />
      </div>
      <p className="kpi-value">
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </p>
      {trend && <p className="kpi-trend">{trend}</p>}
      {series && <Sparkline values={series} />}
    </Tag>
  )
}
