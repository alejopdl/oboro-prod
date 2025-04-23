import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

/**
 * Components documentation page that explains the main UI components used in the project.
 * Written with clear explanations for beginners.
 * 
 * @returns JSX Element
 */
export default function ComponentsDocumentation() {
  return (
    <>
      <Head>
        <title>oBoRo - Componentes</title>
        <meta name="description" content="Documentación de los componentes UI de la plataforma oBoRo" />
      </Head>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav className="mb-6">
          <Link href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Volver a Documentación
          </Link>
        </nav>
        
        <h1 className="text-3xl font-bold mb-6">Componentes UI</h1>
        
        <p className="mb-8 text-lg">
          Estos componentes son los bloques de construcción fundamentales de nuestra tienda online.
          Cada componente está diseñado para ser reutilizable, accesible y específicamente adaptado
          para el mercado argentino.
        </p>

        {/* ProductCard Component */}
        <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4" id="product-card">ProductCard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">¿Qué hace?</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Muestra la información de un producto individual con:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Imagen del producto</li>
                <li>Nombre del producto</li>
                <li>Precio en Pesos Argentinos</li>
                <li>Categoría</li>
                <li>Talle disponible</li>
                <li>Estado de disponibilidad ("Agotado" si está sin stock)</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2">Cómo usarlo</h3>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto"><code>{`<ProductCard 
  product={producto} 
  isActive={true} 
/>`}</code></pre>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-sm">
                  <strong>Para principiantes:</strong> Piensa en esta tarjeta como una ficha individual de producto, 
                  similar a las que verías en MercadoLibre o cualquier tienda online.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Propiedades (Props)</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-sm">product: <span className="text-green-600 dark:text-green-400">Product</span> (obligatorio)</p>
                  <p className="text-sm pl-4">Objeto con los datos del producto a mostrar</p>
                </div>
                
                <div>
                  <p className="font-mono text-sm">isActive?: <span className="text-blue-600 dark:text-blue-400">boolean</span> (opcional)</p>
                  <p className="text-sm pl-4">Indica si la tarjeta está activa/seleccionada</p>
                </div>
                
                <div>
                  <p className="font-mono text-sm">panelPosition?: <span className="text-purple-600 dark:text-purple-400">string</span> (opcional)</p>
                  <p className="text-sm pl-4">Posición del panel ('left' o 'right')</p>
                </div>
                
                <div>
                  <p className="font-mono text-sm">index?: <span className="text-yellow-600 dark:text-yellow-400">number</span> (opcional)</p>
                  <p className="text-sm pl-4">Índice del producto en la lista</p>
                </div>
                
                <div>
                  <p className="font-mono text-sm">previousProductSold?: <span className="text-blue-600 dark:text-blue-400">boolean</span> (opcional)</p>
                  <p className="text-sm pl-4">Si el producto anterior en la lista está agotado</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ProductGrid Component */}
        <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4" id="product-grid">ProductGrid</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">¿Qué hace?</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Organiza múltiples ProductCards en una cuadrícula responsiva. Características:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Disposición adaptable: 1 columna en móvil, 2 en tablet, 3 en escritorio</li>
                <li>Maneja estado vacío cuando no hay productos</li>
                <li>Asigna una key única a cada producto para optimizar renders</li>
                <li>Accesible para lectores de pantalla con atributos ARIA</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2">Cómo usarlo</h3>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto"><code>{`<ProductGrid 
  products={listaDeProductos} 
/>`}</code></pre>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-sm">
                  <strong>Para principiantes:</strong> Este componente es como una estantería que organiza 
                  todas las tarjetas de productos. Se adapta según el tamaño de la pantalla para mostrar 
                  más o menos columnas.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Propiedades (Props)</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-sm">products: <span className="text-green-600 dark:text-green-400">Product[]</span> (obligatorio)</p>
                  <p className="text-sm pl-4">Array con los productos a mostrar en la cuadrícula</p>
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-2">Lógica interna</h3>
                <p className="text-sm">
                  El componente detecta automáticamente si products está vacío y muestra un grid vacío.
                  Utiliza <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">data-testid="product-grid"</code> para facilitar pruebas automatizadas.
                </p>
                
                <h3 className="text-lg font-medium mt-6 mb-2">CSS Classes</h3>
                <p className="text-sm">
                  Utiliza las siguientes clases de Tailwind:
                </p>
                <pre className="text-xs mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-md overflow-x-auto">
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ProductShowcase Component */}
        <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4" id="product-showcase">ProductShowcase</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">¿Qué hace?</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Muestra productos en un formato enriquecido con desplazamiento y efectos visuales:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
                <li>Efectos de animación al desplazarse (con soporte para preferencias de movimiento reducido)</li>
                <li>Carga perezosa de productos al entrar en la vista</li>
                <li>Elementos visuales conectores entre productos</li>
                <li>Destaca el producto actualmente visible</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2">Cómo usarlo</h3>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
                <pre className="text-sm overflow-x-auto"><code>{`<ProductShowcase 
  products={productosDestacados} 
/>`}</code></pre>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                <p className="text-sm">
                  <strong>Para principiantes:</strong> Este componente crea una experiencia visual más atractiva
                  para mostrar productos destacados. Piensa en él como un "carrusel mejorado" que se activa
                  mientras el usuario se desplaza por la página.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">Características técnicas</h3>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-medium">Hooks utilizados:</span> useState, useRef, useEffect, useMemo
                </p>
                
                <p>
                  <span className="font-medium">Animaciones:</span> Usa Framer Motion para las transiciones suaves
                </p>
                
                <p>
                  <span className="font-medium">Lazy loading:</span> Observador de intersección para cargar componentes
                  solo cuando entran en la vista
                </p>
                
                <p>
                  <span className="font-medium">Rendimiento:</span> Utiliza useRef para evitar re-renders innecesarios
                  y useMemo para cálculos costosos
                </p>
                
                <p className="italic mt-4">
                  Este componente es más avanzado y demuestra prácticas de optimización de rendimiento para
                  experiencias interactivas en React.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">¿Necesitas más ayuda?</h2>
          <p className="mb-4">Si eres principiante, aquí tienes algunos recursos para entender mejor estos componentes:</p>
          
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Props en React:</strong> Son como parámetros que pasas a una función, permiten que los componentes
              reciban datos y sean configurables.
            </li>
            <li>
              <strong>TypeScript:</strong> Añade tipos a JavaScript, lo que ayuda a evitar errores comunes y mejora
              la documentación del código.
            </li>
            <li>
              <strong>Componentes:</strong> Son bloques de construcción reutilizables, como piezas de Lego
              que puedes combinar para crear interfaces complejas.
            </li>
          </ul>
          
          <p>
            Revisa los archivos de código en la carpeta <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">components/</code> para ver la implementación
            completa de cada componente.
          </p>
        </div>
      </main>
    </>
  )
}
