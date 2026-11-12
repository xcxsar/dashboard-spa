function points(values, max) {
  const step = 100 / Math.max(values.length - 1, 1)
  return values.map((value, index) => `${(index * step).toFixed(2)},${(100 - (value / max) * 100).toFixed(2)}`).join(' ')
}

/**
 * Gráfico de series de tiempo en SVG.
 * series: [{ name, values }] — se colorean con --chart-1 y --chart-2.
 */
export function LineChart({ series, max = 100, threshold, marker, label }) {
  const summary = series.map((s) => `${s.name} ${Math.round(s.values.at(-1))} %`).join(', ')
  return (
    <figure className="chart">
      <div className="chart-plot">
        <div className="chart-y" aria-hidden="true">
          {[1, 0.75, 0.5, 0.25, 0].map((f) => (
            <span key={f}>{Math.round(max * f)}</span>
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${label}. Último valor: ${summary}`}>
          {[25, 50, 75].map((y) => (
            <line key={y} className="chart-grid" x1="0" x2="100" y1={y} y2={y} />
          ))}
          {threshold != null && (
            <line className="chart-threshold" x1="0" x2="100" y1={100 - (threshold / max) * 100} y2={100 - (threshold / max) * 100} />
          )}
          {marker != null && <line className="chart-marker" x1={marker * 100} x2={marker * 100} y1="0" y2="100" />}
          {series.map((s, index) => (
            <polyline key={s.name} className={`chart-line series-${index + 1}`} points={points(s.values, max)} />
          ))}
        </svg>
      </div>
    </figure>
  )
}

export function Sparkline({ values }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = 100 / Math.max(values.length - 1, 1)
  const path = values.map((v, i) => `${(i * step).toFixed(2)},${(26 - ((v - min) / range) * 22).toFixed(2)}`).join(' ')
  return (
    <svg className="sparkline" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
