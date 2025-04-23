# Action Plan: Implementing oBoRo's Drop System

Este plan describe los pasos para implementar el sistema de "drops" para oBoRo, destacando dependencias, impactos y consideraciones para cada paso.

## Fase 1: Actualizaciones del Modelo de Datos

### 1.1 Actualizar Interfaz de Producto
**Archivo**: `/types/product.ts`
```typescript
export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  inStock: boolean
  size?: string
  // Nuevos campos
  level: number
  blocked: boolean
  dropId: string
  // Campos opcionales existentes
  soldOut?: boolean
  locked?: boolean
  createdTime?: string
  lastEditedTime?: string
}
```
**Impacto**: 
- Todos los componentes que usan el tipo Product deberán manejar los nuevos campos
- Los archivos de prueba necesitarán actualizaciones para incluir datos de prueba para estos campos

## Fase 2: Actualizaciones de Integración con Notion

### 2.1 Actualizar Integración de API de Notion
**Archivo**: `/lib/notion.ts`
```typescript
// Actualizar función getAllProducts para incluir nuevos campos
export async function getAllProducts(): Promise<Product[]> {
  // ...código existente
  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties.Name.title[0]?.plain_text || '',
    price: page.properties.Price.number || 0,
    description: page.properties.Description.rich_text[0]?.plain_text || '',
    images: page.properties.Images.files?.map((file: any) => 
      file.file?.url || file.external?.url || ''
    ) || [],
    category: page.properties.Category.select?.name || '',
    inStock: page.properties.InStock.checkbox || false,
    size: page.properties.Size.select?.name || undefined,
    // Nuevos campos
    level: page.properties.Level.number || 1,
    blocked: page.properties.Blocked.checkbox || false,
    dropId: page.properties.Select.select?.name || 'DROP1',
    // Metadatos
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  }));
  // ...resto de la función
}
```
**Impacto**: 
- La API ahora devolverá los nuevos campos desde la base de datos Notion
- Las pruebas para la integración de Notion necesitarán actualización para incluir estos campos

### 2.2 Actualizar Pruebas de Notion
**Archivo**: `/lib/__tests__/notion.test.ts`
```typescript
// Actualizar productos simulados para incluir nuevos campos
const mockProducts = [
  {
    id: 'testid1',
    // ...campos existentes
    level: 1,
    blocked: false,
    dropId: 'DROP1',
  },
  // ...otros productos simulados
];
```
**Impacto**:
- Asegura que las pruebas sigan pasando con la estructura de datos actualizada

## Fase 3: Componentes de UI

### 3.1 Crear Componente Selector de Drops
**Archivo**: `/components/drop-selector.tsx`
```typescript
"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface DropSelectorProps {
  availableDrops: string[]
  currentDrop: string
}

export default function DropSelector({ availableDrops, currentDrop }: DropSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleDropChange = (dropId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('drop', dropId)
    router.push(`/?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <p className="font-medium mr-2">Seleccionar Drop:</p>
      {availableDrops.map(drop => (
        <button 
          key={drop}
          onClick={() => handleDropChange(drop)}
          className={`px-4 py-2 rounded-md ${
            currentDrop === drop 
              ? 'bg-black text-white dark:bg-white dark:text-black' 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          {drop}
        </button>
      ))}
    </div>
  )
}
```
**Impacto**:
- Agrega UI para que los usuarios cambien entre diferentes drops
- Usa parámetros URL para mantener el estado entre cargas de página

### 3.2 Actualizar Componente ProductCard
**Archivo**: `/components/ProductCard.tsx`
```typescript
// Actualizar para manejar el estado de bloqueo
interface ProductCardProps {
  product: Product
  soldOut?: boolean
  locked?: boolean
  onProductSold?: () => void
}

export default function ProductCard({ 
  product, 
  soldOut, 
  locked, 
  onProductSold 
}: ProductCardProps) {
  // ...código existente
  return (
    <div className={`relative ${locked ? 'opacity-70' : ''}`}>
      {/* Contenido existente de la tarjeta de producto */}
      
      {soldOut && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Agotado
          </span>
        </div>
      )}
      
      {locked && !soldOut && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
          <div className="text-center text-white">
            <Lock className="mx-auto mb-2" />
            <span className="text-sm">Bloqueado</span>
          </div>
        </div>
      )}
    </div>
  )
}
```
**Impacto**:
- Actualiza la tarjeta de producto para indicar visualmente el estado bloqueado
- Las pruebas existentes necesitarán actualización para manejar este estado

### 3.3 Actualizar Componente ProductShowcase
**Archivo**: `/components/product-showcase.tsx`
```typescript
// Actualización extensa para manejar productos por nivel
interface ProductShowcaseProps {
  products: Product[]
  dropId: string
}

export default function ProductShowcase({ products, dropId }: ProductShowcaseProps) {
  // ... estado existente y hooks
  
  // Agrupar productos por nivel
  const productsByLevel = products.reduce((acc, product) => {
    const level = product.level
    if (!acc[level]) acc[level] = []
    acc[level].push(product)
    return acc
  }, {} as Record<number, Product[]>)
  
  // Obtener números de nivel ordenados
  const levels = Object.keys(productsByLevel)
    .map(Number)
    .sort((a, b) => a - b)
  
  // Función para verificar si un producto debe estar desbloqueado
  const isProductUnlocked = (product: Product, allProducts: Product[]) => {
    // Siempre desbloqueado si no está bloqueado en la base de datos
    if (!product.blocked) return true
    
    // Verificar si todos los niveles anteriores están agotados
    const currentLevel = product.level
    
    for (const level of levels) {
      // Solo verificar niveles anteriores al actual
      if (level >= currentLevel) break
      
      // Si algún producto en niveles anteriores aún tiene stock, mantener bloqueado
      const productsInLevel = productsByLevel[level] || []
      const anyInStock = productsInLevel.some(p => p.inStock)
      
      if (anyInStock) return false
    }
    
    // Todos los niveles anteriores agotados, se puede desbloquear
    return true
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Drop: {dropId}</h2>
      
      {/* Renderizar productos por nivel */}
      {levels.map(level => (
        <div key={level} className="mb-16">
          <h3 className="text-xl font-semibold mb-4">Nivel {level}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsByLevel[level].map(product => {
              const unlocked = isProductUnlocked(product, products)
              
              return (
                <div 
                  key={product.id}
                  className="relative"
                  ref={el => {
                    if (productRefs.current.length <= product.level) {
                      productRefs.current[product.level] = el
                    }
                  }}
                >
                  <ProductCard 
                    product={product} 
                    soldOut={!product.inStock}
                    locked={!unlocked}
                    onProductSold={() => markProductAsSold(product.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
```
**Impacto**:
- Cambio importante en la lógica de visualización de productos
- Agrupa productos por nivel y los renderiza en consecuencia
- Implementa lógica para determinar cuándo un producto debe estar desbloqueado

## Fase 4: Integración en la Página Principal

### 4.1 Actualizar Página Principal
**Archivo**: `/app/page.tsx`
```typescript
// Actualizar página principal para manejar filtrado de drops
import { getAllProducts } from "@/lib/notion"
import DropSelector from "@/components/drop-selector"
// ... otras importaciones

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { drop?: string } 
}) {
  try {
    // Obtener todos los productos de Notion
    const allProducts = await getAllProducts()
    
    // Obtener todos los drops disponibles
    const availableDrops = [...new Set(allProducts.map(product => product.dropId))]
    
    // Seleccionar drop actual (usar el primero como predeterminado si no se especifica ninguno)
    const currentDrop = searchParams.drop || availableDrops[0]
    
    // Filtrar productos por el drop seleccionado
    const products = allProducts
      .filter(product => product.dropId === currentDrop)
      .sort((a, b) => a.level - b.level) // Ordenar por nivel
    
    return (
      <>
        <SkipLink />
        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">
            <ResourcePrefetcher products={products} />
            <ChladniBackground />
            <Header />
            <DropSelector 
              availableDrops={availableDrops} 
              currentDrop={currentDrop}
            />
            <ProductShowcase 
              products={products} 
              dropId={currentDrop}
            />
            <BackToTop />
          </main>
        </ErrorBoundary>
      </>
    )
  } catch (error) {
    // Manejo de errores como antes
    console.error('Error fetching products from Notion:', error);
    
    return (
      <>
        <SkipLink />
        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">
            <ChladniBackground />
            <Header />
            <ErrorDisplay error={error instanceof Error ? error : new Error('Error desconocido al cargar los productos')} />
            <BackToTop />
          </main>
        </ErrorBoundary>
      </>
    )
  }
}
```
**Impacto**:
- La página principal ahora muestra productos filtrados por drop
- Usa searchParams para mantener el drop seleccionado entre actualizaciones
- Necesitará actualizar las pruebas para la página principal

### 4.2 Actualizar Pruebas de la Página Principal
**Archivo**: `/app/__tests__/page.test.tsx`
```typescript
// Actualizar pruebas para manejar selección de drops
// Productos simulados con diferentes drops y niveles
```
**Impacto**:
- Asegura que las pruebas cubran la nueva funcionalidad

## Fase 5: Pruebas y Documentación

### 5.1 Agregar Pruebas Especializadas

**Archivo**: `/components/__tests__/drop-selector.test.tsx` (nuevo)
```typescript
// Nuevo archivo de prueba para el componente selector de drops
```

**Archivo**: `/components/__tests__/product-showcase.test.tsx` (actualizar si existe, o nuevo)
```typescript
// Probar agrupación por nivel y estados bloqueados/desbloqueados
```

**Impacto**:
- Asegura que los nuevos componentes y funcionalidades estén adecuadamente probados

### 5.2 Actualizar Documentación

**Archivo**: `/docs/notion-cms-guide.md`
```markdown
# Sección actualizada sobre el Sistema de Drops

## Campos del Sistema de Drops

- **Level**: Campo numérico que indica el orden de visualización (1, 2, 3, etc.)
- **Blocked**: Campo de checkbox que indica si el ítem está inicialmente bloqueado
- **Select (DropID)**: Campo de selección para indicar a qué colección de drops pertenece el ítem

## Cómo Funcionan los Drops

1. Los productos se organizan en "Drops" (colecciones)
2. Dentro de cada drop, los productos tienen "Niveles" que controlan el orden de visualización
3. Los productos pueden estar "Bloqueados" (bloqueados hasta que los niveles anteriores se agoten)
4. Cuando todos los productos en un nivel se agotan, el siguiente nivel se desbloquea
```

**Impacto**:
- Asegura que los editores entiendan cómo usar el sistema de drops en Notion

## Consideraciones de Implementación

### Impactos en la Estructura de Datos
1. **Interfaz de Producto**: Todo el código que use la interfaz Product necesitará actualizaciones de verificación de tipos
2. **API de Notion**: Asegúrate de que todos los campos existan en tu base de datos Notion antes de implementar cambios
3. **Datos de Prueba**: Actualiza todos los datos de prueba en todo el código base

### Consideraciones de UI/UX
1. **Responsividad Móvil**: Asegúrate de que el selector de drops funcione bien en pantallas más pequeñas
2. **Estados de Carga**: Agrega estados de carga adecuados al cambiar entre drops
3. **Accesibilidad**: Asegúrate de que los indicadores de bloqueo tengan el contraste adecuado y atributos aria
4. **Estados de Error**: Maneja casos donde un drop no tiene productos

### Consideraciones de Rendimiento
1. **Obtención de Datos**: Ahora estás obteniendo todos los productos y luego filtrando del lado del cliente - monitorea el rendimiento
2. **Revalidación**: Configura una estrategia adecuada de ISR o revalidación para la página principal
3. **Carga de Imágenes**: Con potencialmente más productos, asegúrate de que la carga diferida esté funcionando correctamente

### Consideraciones de Prueba
1. **Casos Límite**: Prueba con drops vacíos, todos los ítems agotados, sin ítems bloqueados
2. **Gestión de Estado**: Prueba que el desbloqueo de productos funcione correctamente a medida que los ítems se agotan
3. **Parámetros URL**: Asegúrate de que la selección de drops persista correctamente entre cargas de página

## Pasos de Implementación (Secuencial)

1. **Configurar Base de Datos Notion**:
   - Agregar los nuevos campos a tu base de datos Notion
   - Poblar con datos de prueba de diferentes drops

2. **Actualizar Definiciones de Tipo**:
   - Actualizar interfaz Product con nuevos campos
   - Actualizar cualquier dato de prueba usado en las pruebas

3. **Actualizar Integración de Notion**:
   - Modificar la función getAllProducts para devolver nuevos campos
   - Actualizar pruebas para verificar que se devuelvan los nuevos campos

4. **Crear Componentes UI**:
   - Implementar el componente DropSelector
   - Actualizar ProductCard para manejar estado bloqueado
   - Actualizar ProductShowcase para agrupar por nivel

5. **Actualizar Página Principal**:
   - Modificar para aceptar y manejar selección de drops
   - Agregar manejo de parámetros URL para drop seleccionado
   - Implementar lógica de filtrado

6. **Pruebas**:
   - Actualizar pruebas existentes
   - Agregar nuevas pruebas para selección de drops, agrupación por nivel y desbloqueo
   - Probar en diferentes dispositivos y tamaños de pantalla

7. **Documentación**:
   - Actualizar documentación para las nuevas características
   - Crear guías visuales para que los editores entiendan el sistema de drops
