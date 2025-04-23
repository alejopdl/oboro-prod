/**
 * Site configuration settings.
 *
 * @remarks Contains site-wide settings and constants for the application
 */
export const config = {
  locale: 'es-AR',
  currency: 'ARS',
  siteName: 'oBoRo',
  siteUrl: 'https://oboro.vercel.app',
  siteDescription: 'Tienda de ropa y accesorios de calidad',
  defaultImage: '/images/placeholder.jpg',
  author: {
    name: 'oBoRo Team',
    email: 'contacto@oboro.com',
  },
  social: {
    instagram: 'https://instagram.com/oboro',
    whatsapp: 'https://wa.me/5491155555555',
  },
  navLinks: [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ],
}
