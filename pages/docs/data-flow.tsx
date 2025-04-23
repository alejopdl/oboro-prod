import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import DataFlowDiagram from '@/docs/data-flow-diagram'
import { config } from '@/data/config'

/**
 * Data Flow documentation page that explains the architecture and data flow in detail.
 * 
 * @returns JSX Element
 */
export default function DataFlowDocumentation() {
  return (
    <>
      <Head>
        <title>oBoRo - Flujo de Datos</title>
        <meta name="description" content="Documentación del flujo de datos en la plataforma oBoRo para el mercado argentino" />
      </Head>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav className="mb-6">
          <Link href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Volver a Documentación
          </Link>
        </nav>
        
        <h1 className="text-3xl font-bold mb-6">Flujo de Datos</h1>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Diagrama de Flujo de Datos</h2>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <DataFlowDiagram />
            <p className="text-sm text-center mt-4 text-gray-500">
              Este diagrama muestra cómo fluyen los datos desde Notion hasta la interfaz de usuario en Argentina.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Flujo de Datos para Productos
            </h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">Base de Datos Notion:</span> Los productos son cargados y 
                mantenidos en Notion con todos los detalles (nombre, precio en ARS, descripción, imágenes, categoría, talle, disponibilidad)
              </li>
              <li>
                <span className="font-medium">Construcción del Sitio:</span> Durante el proceso de build, 
                Next.js solicita los datos usando getStaticProps para páginas estáticas como la página principal
              </li>
              <li>
                <span className="font-medium">API Routes:</span> Para búsquedas y filtrados dinámicos, 
                se utilizan rutas de API que consultan directamente a la API de Notion
              </li>
              <li>
                <span className="font-medium">Componentes:</span> Los datos se procesan y se pasan a 
                componentes como ProductCard y ProductGrid para su visualización
              </li>
              <li>
                <span className="font-medium">Interacción del Cliente:</span> Cuando un usuario navega por el sitio, 
                los componentes del cliente manejan filtros, búsquedas, y la visualización de detalles
              </li>
            </ol>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Flujo de Contacto vía WhatsApp
            </h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">Vista Detallada del Producto:</span> El usuario navega a la 
                página del producto y visualiza información detallada
              </li>
              <li>
                <span className="font-medium">Interés de Compra:</span> Si el producto no está marcado como "Agotado",
                el usuario puede hacer clic en "Consultar por WhatsApp"
              </li>
              <li>
                <span className="font-medium">Generación del Mensaje:</span> El sistema prepara un mensaje 
                predefinido con el nombre del producto, talle, precio y un enlace a la página del producto
              </li>
              <li>
                <span className="font-medium">Redirección a WhatsApp:</span> El usuario es redirigido a WhatsApp 
                Web o la aplicación móvil con el mensaje pre-cargado
              </li>
              <li>
                <span className="font-medium">Atención Personalizada:</span> El vendedor recibe la consulta 
                y puede continuar la conversación para concretar la venta
              </li>
            </ol>
          </section>
        </div>

        <div className="mb-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Adaptaciones para el Mercado Argentino</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Contenido en Español Argentino</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Todos los textos de la plataforma están en español argentino, incluyendo términos como "Agotado" para productos sin stock,
                "Consultar" para iniciar comunicación, y categorías adaptadas al mercado local.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Moneda Local</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Todos los precios se muestran en Pesos Argentinos (ARS) y se formatean según las convenciones locales.
                Ejemplo: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(1999.99)}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Integración con WhatsApp</h3>
              <p className="text-gray-700 dark:text-gray-300">
                En lugar de implementar un carrito de compras tradicional, la plataforma facilita la comunicación
                directa con el vendedor a través de WhatsApp, que es el método de comunicación preferido en Argentina
                para compras a pequeños y medianos comercios.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Tiempos de Respuesta</h3>
              <p className="text-gray-700 dark:text-gray-300">
                El sistema está optimizado para facilitar respuestas rápidas durante el horario comercial argentino (GMT-3),
                mostrando indicadores de disponibilidad del vendedor.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Beneficios del Enfoque Headless CMS</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              Los datos del producto se pueden actualizar fácilmente en Notion sin necesidad de tocar el código
            </li>
            <li>
              Las categorías, precios y disponibilidad pueden ser actualizadas en tiempo real y reflejadas en el sitio
            </li>
            <li>
              La estructura facilita la internacionalización futura a otros mercados latinoamericanos
            </li>
            <li>
              El rendimiento optimizado permite cargas rápidas incluso en conexiones móviles limitadas,
              algo crucial para el mercado argentino
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
