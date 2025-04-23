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
| Level (Nivel) | Number | Nivel del producto dentro de un drop (1, 2, 3, etc.) |
| Blocked (Bloqueado) | Checkbox | Marcar si el producto debe bloquearse hasta que se agoten los de nivel inferior |
| DropId (ID de Drop) | Select | Colección a la que pertenece el producto (ej. "DROP1", "MiniDROP2") |

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
   - **Level**: Asigna un nivel al producto (1, 2, 3, etc.)
   - **Blocked**: Marca si el producto debe estar bloqueado inicialmente
   - **DropId**: Selecciona a qué colección o "drop" pertenece el producto

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

4. **Sistema de Drops**: Estructura tus productos adecuadamente
   - Asigna niveles consecutivos empezando desde 1
   - Mantén los IDs de drop consistentes y descriptivos
   - Marca como bloqueados todos los productos de nivel 2 o superior

## Solución de Problemas

Si encuentras algún problema con la integración de Notion:

1. Verifica que todos los campos requeridos estén completos
2. Asegúrate de que las imágenes sean accesibles públicamente
3. Contacta al equipo técnico si los cambios no aparecen después de 10 minutos

## Sistema de Drops

El sistema de drops permite organizar productos en colecciones y desbloquearlos por niveles:

1. **Crear un nuevo Drop**:
   - Agrega una nueva opción en la propiedad Select "DropId"
   - Usa nombres descriptivos y consistentes (ej. "DROP1", "MiniDROP2")

2. **Configurar niveles**:
   - **Nivel 1**: Productos disponibles inmediatamente (si están en stock)
   - **Nivel 2+**: Productos que solo se desbloquean cuando se agotan los de nivel inferior

3. **Configurar bloqueo**:
   - Marca la casilla "Blocked" para productos de nivel 2 o superior
   - Los productos de nivel 1 nunca deben estar bloqueados

4. **Prueba la configuración**:
   - Verifica que los productos aparecen correctamente en el sitio web
   - Comprueba que el sistema de desbloqueo funciona como se espera

Consulta la documentación detallada en `docs/drop-system.md` para más información.

## Recursos Adicionales

- [Documentación oficial de Notion](https://developers.notion.com/)
- [Guía de formatos de texto en Notion](https://www.notion.so/help/formatting)
- [Guía del sistema de Drops](../docs/drop-system.md)
