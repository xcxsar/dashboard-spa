// Datos simulados tomados de los prototipos de Figma (página "Prototipo").

export const CURRENT_USER = { name: 'Andrés Morales', role: 'Ingeniero Cloud', initials: 'AM' }

export const INSTANCE_TYPES = ['m5.large', 'm5.xlarge', 'm5.2xlarge', 'c5.xlarge', 'c5.2xlarge', 'r5.2xlarge']

export const REGIONS = ['us-east-1', 'us-west-2', 'sa-east-1']

// Serie de 6 h con un pico tras el deploy (gráfico "CPU · últimas 6 h")
const API_PAGOS_CPU = [44, 46, 45, 48, 47, 50, 49, 52, 51, 55, 58, 63, 70, 76, 81, 86, 89, 91, 93, 92]

// Serie estable alrededor del valor actual para el resto de instancias
function steadySeries(value) {
  const wave = [-6, -4, -5, -2, -3, 0, -1, 1, 0, 2, -1, 1, 2, 0, 1, -1, 2, 1, 0, 0]
  return wave.map((delta) => Math.max(0, Math.min(100, value + delta)))
}

const defaultConfig = (instanceType) => ({
  instanceType,
  minReplicas: 2,
  maxReplicas: 6,
  cpuThreshold: 85,
  autoscaling: true,
  pagerduty: true,
  applyOn: '',
  note: '',
})

function instance(data) {
  return {
    status: 'running',
    cpuSeries: steadySeries(data.cpu),
    trends: {},
    dependents: [],
    deployMarker: null,
    ...data,
    config: defaultConfig(data.type),
  }
}

export const INSTANCES = [
  instance({
    id: 'api-pagos-03', service: 'Pagos', region: 'us-east-1', zone: 'us-east-1a', ip: '10.0.3.27', type: 'm5.xlarge',
    uptime: 'activa hace 12 días', cpu: 92, mem: 78, disk: 54, latency: 340,
    cpuSeries: API_PAGOS_CPU,
    trends: { cpu: '▲ 30 % en la última hora', mem: '▲ 6 % en la última hora', disk: 'Sin cambios', latency: '▲ 120 ms vs. promedio' },
    dependents: ['checkout', 'conciliación'],
    deployMarker: { position: 0.525, note: 'Línea vertical: deploy v2.14.0 (hace 48 min). El pico de CPU empieza después del despliegue.' },
  }),
  instance({ id: 'web-front-01', service: 'Frontend', region: 'us-east-1', zone: 'us-east-1a', ip: '10.0.1.8', type: 'c5.xlarge', uptime: 'activa hace 6 días', cpu: 81, mem: 64, disk: 33, latency: 290 }),
  instance({ id: 'db-replica-02', service: 'Base de datos', region: 'us-west-2', zone: 'us-west-2b', ip: '10.1.4.20', type: 'r5.2xlarge', uptime: 'activa hace 31 días', cpu: 45, mem: 86, disk: 85, latency: 18 }),
  instance({ id: 'api-pagos-01', service: 'Pagos', region: 'us-east-1', zone: 'us-east-1b', ip: '10.0.3.11', type: 'm5.xlarge', uptime: 'activa hace 12 días', cpu: 58, mem: 61, disk: 41, latency: 120 }),
  instance({ id: 'web-front-02', service: 'Frontend', region: 'us-west-2', zone: 'us-west-2a', ip: '10.1.1.9', type: 'c5.xlarge', uptime: 'activa hace 6 días', cpu: 47, mem: 52, disk: 30, latency: 140 }),
  instance({ id: 'worker-batch-07', service: 'Procesamiento', region: 'sa-east-1', zone: 'sa-east-1a', ip: '10.2.6.7', type: 'c5.2xlarge', uptime: 'activa hace 3 días', cpu: 38, mem: 52, disk: 47, latency: 95 }),
  instance({ id: 'auth-svc-01', service: 'Autenticación', region: 'us-east-1', zone: 'us-east-1c', ip: '10.0.2.14', type: 'm5.large', uptime: 'activa hace 20 días', cpu: 33, mem: 48, disk: 22, latency: 60 }),
  instance({ id: 'queue-broker-01', service: 'Mensajería', region: 'sa-east-1', zone: 'sa-east-1b', ip: '10.2.5.3', type: 'm5.large', uptime: 'activa hace 9 días', cpu: 26, mem: 44, disk: 29, latency: 12 }),
]

export const ALERTS = [
  { id: 'al-1', severity: 'crit', title: 'CPU > 90 % sostenido durante 10 min', instanceId: 'api-pagos-03', region: 'us-east-1', time: 'hace 2 min', silenced: false },
  { id: 'al-2', severity: 'warn', title: 'Latencia p95 > 250 ms', instanceId: 'web-front-01', region: 'us-east-1', time: 'hace 9 min', silenced: false },
  { id: 'al-3', severity: 'warn', title: 'Memoria al 86 %', instanceId: 'db-replica-02', region: 'us-west-2', time: 'hace 21 min', silenced: false },
  { id: 'al-4', severity: 'warn', title: 'Errores 5xx por encima del 2 %', instanceId: 'web-front-02', region: 'us-west-2', time: 'hace 34 min', silenced: false },
]

export const EVENTS = {
  'api-pagos-03': [
    { id: 'ev-1', tone: 'crit', text: 'CPU superó el umbral de 85 %', time: 'hace 14 min' },
    { id: 'ev-2', tone: 'accent', text: 'Deploy v2.14.0 aplicado', time: 'hace 48 min' },
    { id: 'ev-3', tone: 'muted', text: 'Escalado automático: +2 réplicas', time: 'hace 1 h' },
  ],
}

// KPIs globales de la vista general (valores del prototipo)
export const OVERVIEW_KPIS = [
  { id: 'cpu', label: 'CPU promedio', value: '62', unit: '%', trend: '▲ 4 % vs. ayer', series: [48, 52, 50, 55, 58, 54, 60, 57, 62, 59, 64, 61, 66, 63, 60, 65, 62, 68, 64, 62] },
  { id: 'mem', label: 'Memoria promedio', value: '68', unit: '%', trend: '▲ 2 % vs. ayer', series: [60, 61, 63, 62, 64, 65, 64, 66, 67, 66, 68, 67, 69, 68, 67, 69, 68, 70, 69, 68] },
  { id: 'net', label: 'Tráfico de red', value: '2,4', unit: 'Gb/s', trend: '▼ 8 % vs. ayer', series: [62, 60, 58, 61, 57, 55, 56, 54, 55, 52, 53, 51, 52, 50, 51, 49, 50, 48, 49, 47] },
]

// Series de 24 h del gráfico "CPU y memoria" (20 puntos)
export const CPU_24H = OVERVIEW_KPIS[0].series
export const MEM_24H = OVERVIEW_KPIS[1].series

export const TIME_RANGES = [
  { id: '15m', label: '15 min', points: 4 },
  { id: '1h', label: '1 h', points: 6 },
  { id: '6h', label: '6 h', points: 10 },
  { id: '24h', label: '24 h', points: 20 },
]

const HEALTH = {
  terminated: { tone: 'off', label: 'Terminada', rank: 5 },
  terminating: { tone: 'busy', label: 'Terminando…', rank: 4 },
  restarting: { tone: 'info', label: 'Reiniciando…', rank: 3 },
  crit: { tone: 'crit', label: 'Crítico', rank: 0 },
  warn: { tone: 'warn', label: 'Advertencia', rank: 1 },
  ok: { tone: 'ok', label: 'Correcto', rank: 2 },
}

export function getHealth(instance) {
  if (instance.status !== 'running') return { key: instance.status, ...HEALTH[instance.status] }
  const peak = Math.max(instance.cpu, instance.mem)
  const key = peak >= 90 ? 'crit' : peak >= 80 ? 'warn' : 'ok'
  return { key, ...HEALTH[key] }
}

export const SEVERITY = {
  crit: { tone: 'crit', label: 'Crítica' },
  warn: { tone: 'warn', label: 'Advertencia' },
}

export function meterTone(value) {
  if (value >= 90) return 'crit'
  if (value >= 80) return 'warn'
  return null
}
