import Link from "next/link"
import { config } from "@/data/config"
import { Instagram, Facebook, Twitter } from "lucide-react"

/**
 * Footer component for the site.
 * 
 * @remarks
 * Features site information, navigation links, and social media links.
 * Includes dynamic year calculation and proper accessibility attributes.
 * 
 * @returns JSX Element - The footer component
 */
export const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pie de página</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{config.siteName}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xs">{config.siteDescription}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Enlaces</h3>
            <nav aria-label="Enlaces de pie de página">
              <ul className="space-y-2">
                {config.navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contáctanos</h4>
              <a 
                href={config.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} {config.siteName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
