import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import DataFlowDiagram from '@/docs/data-flow-diagram'

/**
 * Documentation landing page that provides an overview of the project architecture and components.
 * 
 * @returns JSX Element
 */
export default function DocumentationIndex() {
  return (
    <>
      <Head>
        <title>oBoRo - Documentación Técnica</title>
        <meta name="description" content="Documentación técnica para la tienda online oBoRo" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Documentación Técnica</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link href="/docs/architecture" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Arquitectura</h2>
            <p className="text-gray-600 dark:text-gray-300">Visión general de la arquitectura del proyecto y sus componentes.</p>
          </Link>
          
          <Link href="/docs/data-flow" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Flujo de Datos</h2>
            <p className="text-gray-600 dark:text-gray-300">Cómo fluyen los datos entre el CMS Notion y la aplicación.</p>
          </Link>
          
          <Link href="/docs/components" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Componentes</h2>
            <p className="text-gray-600 dark:text-gray-300">Documentación de los principales componentes de UI.</p>
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Flujo de Datos</h2>
          <p className="mb-6">
            Este diagrama muestra cómo fluye la información desde la base de datos en Notion hasta la interfaz de usuario, 
            incluyendo cómo se procesan los datos para la tienda con enfoque en el mercado argentino.
          </p>
          
          <DataFlowDiagram />
          
          <div className="mt-8 bg-blue-50 dark:bg-blue-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Adaptaciones para el Mercado Argentino</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Todos los textos de la plataforma están en español argentino</li>
              <li>Precios mostrados en Pesos Argentinos (ARS)</li>
              <li>Integración con WhatsApp para consultas directas sobre productos</li>
              <li>Etiquetas de "Agotado" en lugar de "Sin Stock" para indicar productos no disponibles</li>
              <li>Categorías específicas adaptadas al mercado local de indumentaria y accesorios</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}
