# Diagramas para la Documentación de oBoRo

Este directorio contiene componentes de diagramas interactivos utilizados en las páginas de documentación de oBoRo.

## Componentes Disponibles

Los siguientes diagramas están disponibles para mostrar diferentes aspectos de la arquitectura y flujo de datos:

1. **data-flow-diagram.tsx**: Visualiza el flujo de datos desde Notion hasta la interfaz de usuario, adaptado para el mercado argentino.

2. **architecture-diagram.tsx**: Muestra la arquitectura técnica general del proyecto incluyendo la integración de Next.js, API Routes y el despliegue en Vercel.

3. **folder-structure-diagram.tsx**: Presenta la estructura de carpetas del proyecto de forma interactiva, permitiendo expandir y colapsar directorios.

## Cómo Utilizar

Para incluir cualquiera de estos diagramas en una página de documentación:

```tsx
import DataFlowDiagram from '@/docs/data-flow-diagram'
import ArchitectureDiagram from '@/docs/architecture-diagram'
import FolderStructureDiagram from '@/docs/folder-structure-diagram'

// Luego, dentro de tu componente:
<DataFlowDiagram />
<ArchitectureDiagram />
<FolderStructureDiagram />
```

## Adaptaciones para el Mercado Argentino

Los diagramas y la documentación han sido adaptados para:

- Utilizar terminología en español argentino
- Reflejar el flujo de contacto vía WhatsApp en lugar de carritos de compra tradicionales
- Mostrar precios en Pesos Argentinos (ARS)
- Incluir etiquetas como "Agotado" para productos sin stock

## Mejoras Futuras

Posibles mejoras para estos diagramas:

- Agregar versiones interactivas con animaciones
- Crear versiones estáticas para exportar como imágenes
- Implementar temas claros/oscuros para mejor accesibilidad

## Documentación Principal

Las páginas completas de documentación se encuentran en:

- `/pages/docs/index.tsx` - Página principal
- `/pages/docs/architecture.tsx` - Documentación de arquitectura
- `/pages/docs/data-flow.tsx` - Documentación del flujo de datos
- `/pages/docs/components.tsx` - Documentación de componentes
