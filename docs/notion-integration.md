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
export interface Product {
  id: string
  name: string
  price: number
  size?: string
  images: string[]
  soldOut: boolean
  locked?: boolean
  description: string
  category: string
  inStock?: boolean
}
```

## Implementación

### 1. Cliente de Notion API (`lib/notion.ts`)

- Inicializa el cliente de Notion con el token de API
- Define funciones para obtener datos (productos)
- Convierte los datos de Notion al formato de nuestra aplicación

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
   - La página principal es un componente de servidor que llama a `getAllProducts()`
   - Los datos se obtienen directamente de Notion durante el renderizado en el servidor

2. **Renderizado**:
   - Los datos se procesan y convierten al formato correcto
   - Se pasan a componentes como `ProductShowcase`

3. **Interactividad**:
   - Componentes del lado del cliente manejan interacciones sin necesidad de recargar

## Pruebas

Se implementaron pruebas para:

1. **Funciones de API** (`lib/__tests__/notion.test.ts`):
   - Verificar que se obtengan correctamente los productos
   - Comprobar el manejo de errores
   - Asegurar que el formato de datos sea correcto

2. **Componentes** (`app/__tests__/page.test.tsx`):
   - Probar que la página renderice correctamente los productos
   - Verificar el manejo de errores
   - Comprobar el funcionamiento con listas vacías

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

## Recursos

- [Documentación oficial de Notion API](https://developers.notion.com/)
- [Guía de integración de Next.js con CMSs](https://nextjs.org/docs/app/building-your-application/data-fetching)
