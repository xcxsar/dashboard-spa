# CloudOps · Dashboard SPA

Panel de control responsivo para monitorear servidores e instancias cloud. Muestra métricas, permite configurar servicios desde un drawer y ejecutar acciones críticas con confirmación segura. Hecho con React + Vite, sin dependencias de UI.

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint     # oxlint
```

## Arquitectura

- **Mobile-first**: estilos base para móvil, con `@media (min-width: 768px)` para tableta y `1024px` para escritorio.
- **CSS Grid** para el layout macro (`src/styles/layout.css`) y para la vista de métricas en **Bento Grid**. **Flexbox** para los componentes de una dirección.
- **Tres zonas**:
  1. **Navegación**: header fijo y sidebar persistente o retráctil.
  2. **Contenido dinámico**: KPIs, gráficas y tabla con filtros y paginación.
  3. **Interacción**: drawer de configuración y modal de confirmación.
- **Estados** Default, Hover, Focus, Disabled y Loading en botones y campos.
- **Modo oscuro** con variables CSS, `prefers-color-scheme` y un toggle manual.

```
src/
  styles/        tokens, base, layout y componentes
  data/          datos simulados (de los prototipos de Figma)
  hooks/         rutas por hash, tema, media queries, foco, notificaciones
  components/    layout (Zona 1), ui, overlays (Zona 3), tabla y alertas
  views/         Vista general, Instancias, Alertas, Detalle
```

## Documentación

- [Reporte](docs/reporte.md): las 5 dimensiones del Diseño de Interacción y capturas de cada control en sus estados Default, Hover, Focus, Disabled y Loading, en modo claro y oscuro.
