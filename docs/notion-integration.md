# Integración de Notion como CMS

Este documento técnico explica cómo se implementó la integración con Notion como CMS para el proyecto oBoRo.

## Arquitectura de la Integración

La integración con Notion sigue estos principios:

1. **Seguridad**: El token de API de Notion permanece seguro en variables de entorno del servidor
2. **Rendimiento**: Se implementan patrones para minimizar las llamadas a la API
3. **Tipado**: Todas las estructuras de datos están tipadas con TypeScript
4. **Manejo de errores**: Se capturan errores para mantener la experiencia del usuario

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│   Notion  │◄────┤ Server    │◄────┤  Cliente  │
│  Database │     │ Components│     │ (Browser) │
└───────────┘     └───────────┘     └───────────┘
```

## Estructura de Datos

La interfaz `Product` define la estructura de los productos:

```typescript
// La interfaz Product refleja exactamente la estructura de nuestra base de datos en Notion
export interface Product {
  // Campos básicos del producto
  id: string           // ID único del producto (generado por Notion)
  name: string         // Nombre del producto (columna Name en Notion)
  price: number        // Precio en pesos (columna Price en Notion)
  description: string  // Descripción detallada (columna Description en Notion)
  images: string[]     // URLs de las imágenes (columna Images en Notion)
  category: string     // Categoría del producto (columna Category en Notion)
  inStock: boolean     // Si está disponible (columna InStock en Notion, EXACTAMENTE con esta capitalización)
  size?: string        // Talle opcional (columna Size en Notion)
  
  // Campos del sistema de drops - NOMBRES EXACTOS como en la base de datos
  level: number       // Nivel del producto (columna Level en Notion)
  blocked: boolean    // Si está bloqueado (columna Block en Notion - ¡no "Blocked"!)
  dropId: string      // Identificador del drop (columna DropID en Notion - ¡notar la "ID" en mayúsculas!)
  
  // Metadatos adicionales
  createdTime?: string  // Fecha de creación
  lastEditedTime?: string // Fecha de última edición
}
```

## Implementación

### 1. Cliente de Notion API (`lib/notion.ts`)

- Inicializa el cliente de Notion con el token de API
- Define funciones para obtener datos (productos)
- Convierte los datos de Notion al formato de nuestra aplicación
- Mapea propiedades especiales del sistema de drops (level, blocked, dropId)

### 2. Componentes del Servidor (`app/page.tsx`)

- Implementa funciones asíncronas para obtener datos en tiempo de renderizado
- Maneja casos de error y estados de carga
- Pasa los datos como props a componentes de cliente

### 3. Componentes de Cliente

- Muestran los datos de los productos
- Implementan interactividad (hover, click, etc.)
- Manejan estados de carga y errores

## Flujo de Datos

1. **Obtención de Datos**: 
   - La página principal es un componente de servidor que llama a la API de Notion a través de `lib/notion.ts`
   - El endpoint `/api/test-notion.ts` permite verificar la conexión a la base de datos de Notion
   - La función `getAllProducts()` obtiene todos los productos con sus propiedades
   - Los datos incluyen campos básicos y campos especiales del sistema de drops (level, blocked, dropId)

2. **Renderizado**:
   - Los datos se procesan y convierten al formato correcto
   - Se agrupan productos por drop y nivel
   - Se calculan los estados de desbloqueo según los niveles
   - Se pasan a componentes como `ProductShowcase` con información de drops disponibles

3. **Interactividad**:
   - El componente `DropSelector` permite cambiar entre diferentes drops
   - El `ProductShowcase` filtra y organiza productos según el drop seleccionado
   - La lógica de desbloqueo por niveles se aplica en tiempo real

## Pruebas

Se implementaron pruebas para:

1. **Funciones de API** (`lib/__tests__/notion.test.ts`):
   - Verificar que se obtengan correctamente los productos
   - Comprobar el manejo de errores
   - Asegurar que el formato de datos sea correcto

2. **Componentes de página** (`app/__tests__/page.test.tsx`):
   - Probar que la página renderice correctamente los productos
   - Verificar el manejo de errores
   - Comprobar el funcionamiento con listas vacías

3. **Componentes del sistema de drops** (`components/__tests__/drop-selector.test.tsx`):
   - Verificar la correcta renderización de opciones de drops
   - Comprobar los indicadores visuales del drop seleccionado
   - Validar los estilos de los botones según su estado

## Variables de Entorno Requeridas

```
NOTION_API_KEY=<tu-token-api>
NOTION_DATABASE_ID=<id-de-la-base-de-datos>
```

## Mejoras Futuras

- Implementar caché para reducir las llamadas a la API
- Añadir webhooks para actualización en tiempo real
- Implementar paginación para grandes conjuntos de datos
- Optimizar la obtención de imágenes
- **Mejoras al sistema de drops**:
  - Implementar filtrado de drops en el lado del servidor para mejor SEO
  - Añadir páginas de destino específicas para cada drop
  - Implementar contadores regresivos para próximos drops
  - Añadir notificaciones por correo para nuevos lanzamientos

## Recursos

- [Documentación oficial de Notion API](https://developers.notion.com/)
- [Guía de integración de Next.js con CMSs](https://nextjs.org/docs/app/building-your-application/data-fetching)
