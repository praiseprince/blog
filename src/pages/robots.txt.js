import { getSiteUrl } from '../lib/siteUrl.js';

export function GET() {
  const sitemapUrl = new URL('/sitemap.xml', getSiteUrl()).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
