/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://oboro-prod.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://oboro-prod.vercel.app'}/server-sitemap.xml`,
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
    ],
  },
  exclude: ['/api/*', '/admin/*', '/servidor/*', '/404', '/500'],
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
}
