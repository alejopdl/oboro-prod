import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import ArchitectureDiagram from '@/docs/architecture-diagram'
import FolderStructureDiagram from '@/docs/folder-structure-diagram'

/**
 * Architecture documentation page that explains the technical architecture of the project.
 * 
 * @returns JSX Element
 */
export default function ArchitectureDocumentation() {
  return (
    <>
      <Head>
        <title>oBoRo - Arquitectura</title>
        <meta name="description" content="Documentación de la arquitectura técnica de la plataforma oBoRo" />
      </Head>
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav className="mb-6">
          <Link href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">
            &larr; Volver a Documentación
          </Link>
        </nav>
        
        <h1 className="text-3xl font-bold mb-6">Arquitectura Técnica</h1>

        <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Visión General</h2>
          
          <div className="mb-6">
            <ArchitectureDiagram />
            <p className="text-sm text-center mt-2 text-gray-500">Diagrama de arquitectura del sistema</p>
          </div>
          <p className="mb-4">
            La plataforma oBoRo está construida utilizando una arquitectura moderna basada en Next.js
            con un enfoque de renderizado híbrido para optimizar tanto el rendimiento como la experiencia del usuario.
            Utiliza Notion como CMS headless para gestionar el contenido y los productos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Next.js 15.2.4</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Framer Motion</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <h3 className="font-semibold mb-2">Backend</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Next.js API Routes</li>
                <li>Notion API</li>
                <li>Vercel Serverless Functions</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <h3 className="font-semibold mb-2">Infraestructura</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Vercel Deployment</li>
                <li>GitHub CI/CD</li>
                <li>Jest & Testing Library</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estrategia de Renderizado</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              La plataforma utiliza un enfoque híbrido de renderizado para 
              optimizar tanto SEO como rendimiento:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">Generación Estática (SSG):</span> Para 
                páginas que no cambian frecuentemente como la página principal y listados generales
              </li>
              <li>
                <span className="font-medium">Renderizado del Lado del Servidor (SSR):</span> Para 
                páginas con contenido dinámico como resultados de búsqueda
              </li>
              <li>
                <span className="font-medium">Renderizado del Lado del Cliente (CSR):</span> Para 
                componentes interactivos como filtros y elementos de UI dinámicos
              </li>
              <li>
                <span className="font-medium">ISR (Incremental Static Regeneration):</span> Para 
                actualizar páginas estáticas cuando hay cambios en el CMS sin necesidad de reconstruir todo el sitio
              </li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Estructura del Proyecto</h2>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto max-h-[500px]">
              <FolderStructureDiagram />
            </div>
          </section>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Adaptaciones para el Mercado Argentino</h2>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Optimización de Rendimiento</h3>
              <p className="text-gray-700 dark:text-gray-300">
                La infraestructura está optimizada para conexiones de internet variables, comunes en Argentina,
                mediante:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                <li>Optimización de imágenes con Next.js Image</li>
                <li>Lazy loading de contenido fuera de pantalla</li>
                <li>Code splitting para reducir el tamaño del bundle inicial</li>
                <li>Caching agresivo para reducir solicitudes a la API</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Localización</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Toda la interfaz está en español argentino, con:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                <li>Formato de precios en Pesos Argentinos (ARS)</li>
                <li>Terminología local (ej. "Agotado" para productos sin stock)</li>
                <li>Adaptación de categorías al mercado local</li>
                <li>Integración con WhatsApp Business API para comunicación directa</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Diseño Responsivo</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Diseño completamente responsivo optimizado para dispositivos móviles,
                considerando que aproximadamente el 75% de los usuarios argentinos
                navegan principalmente desde sus smartphones.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Estándares de Desarrollo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Calidad de Código</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>TypeScript para tipado estático</li>
                <li>ESLint para análisis estático de código</li>
                <li>Prettier para formateo consistente</li>
                <li>Husky para hooks de pre-commit</li>
                <li>Tests unitarios con Jest</li>
                <li>Tests de componentes con React Testing Library</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Accesibilidad</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                <li>Cumplimiento de WCAG 2.1 nivel AA</li>
                <li>Soporte para lectores de pantalla</li>
                <li>Contraste adecuado de colores</li>
                <li>Navegación por teclado</li>
                <li>Soporte para reduced-motion</li>
                <li>Textos alternativos para todas las imágenes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
