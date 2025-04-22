export const config = {
  siteName: "oBoRo Store",
  siteDescription: "Una forma moderna y visualmente cautivadora de explorar artículos únicos",
  notionDatabaseId: process.env.NOTION_DATABASE_ID,
  currency: "USD",
  locale: "es-ES",
  navLinks: [
    { name: "Inicio", path: "/" },
    { name: "Productos", path: "/productos" },
  ],
  categories: ["All", "Ropa", "Accesorios", "Calzado", "Hogar"],
  contactWhatsApp: "+1234567890",
}
