# Guía de Uso de Notion como CMS

Esta guía explica cómo utilizar Notion como sistema de gestión de contenido (CMS) para el sitio web oBoRo.

## Requisitos

- Cuenta de Notion
- Acceso a la base de datos de productos de oBoRo
- Token de API de Notion (para desarrolladores)

## Estructura de la Base de Datos

La base de datos de productos en Notion contiene las siguientes propiedades:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| Name (Nombre) | Title | Nombre del producto (requerido) |
| Price (Precio) | Number | Precio del producto en ARS |
| Description (Descripción) | Text | Descripción detallada del producto |
| Images (Imágenes) | Files & Media | Imágenes del producto (múltiples permitidas) |
| Category (Categoría) | Select | Categoría del producto |
| InStock (En Stock) | Checkbox | Marcar si el producto está disponible |
| Size (Talle) | Select | Talle del producto (S, M, L, XL, etc.) |

## Cómo Agregar un Nuevo Producto

1. Abre la base de datos de productos en Notion
2. Haz clic en el botón "+ New" para agregar un nuevo producto
3. Completa los campos requeridos:
   - **Name**: Nombre descriptivo del producto
   - **Price**: Precio en pesos argentinos (solo el número)
   - **Description**: Descripción detallada del producto
   - **Images**: Sube imágenes o proporciona URLs
   - **Category**: Selecciona una categoría existente o crea una nueva
   - **InStock**: Marca si el producto está disponible
   - **Size**: Selecciona el talle disponible

## Cómo Editar un Producto Existente

1. Abre la base de datos y encuentra el producto que deseas editar
2. Haz clic en el producto para abrir su página
3. Modifica los campos necesarios
4. Los cambios se guardan automáticamente
5. El sitio web se actualizará con los nuevos datos (puede tomar hasta 5 minutos)

## Cómo Marcar un Producto como Agotado

1. Abre el producto en Notion
2. Desmarca la casilla "InStock"
3. El producto aparecerá como "Agotado" en el sitio web

## Prácticas Recomendadas

1. **Imágenes**: Utiliza imágenes de alta calidad con fondo blanco o transparente
   - Tamaño recomendado: 1200x1200 píxeles
   - Formato: JPG o PNG

2. **Descripciones**: Sé detallado pero conciso
   - Incluye material, dimensiones y características especiales
   - Usa párrafos cortos para mejor legibilidad

3. **Categorías**: Mantén las categorías consistentes
   - No crees categorías nuevas innecesariamente
   - Consulta con el equipo antes de crear nuevas categorías

## Solución de Problemas

Si encuentras algún problema con la integración de Notion:

1. Verifica que todos los campos requeridos estén completos
2. Asegúrate de que las imágenes sean accesibles públicamente
3. Contacta al equipo técnico si los cambios no aparecen después de 10 minutos

## Recursos Adicionales

- [Documentación oficial de Notion](https://developers.notion.com/)
- [Guía de formatos de texto en Notion](https://www.notion.so/help/formatting)
