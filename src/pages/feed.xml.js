import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/posts';
import { getSiteConfig } from '../lib/siteConfig';

function stripHtml(s) {
  if (!s) return '';
  return s
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&shy;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(context) {
  const site = getSiteConfig();
  const posts = await getAllPosts();
  const items = posts
    .map(p => ({
      title: stripHtml(p.data.title),
      link: `/posts/${p.id.replace(/\.(md|mdx)$/, '')}/`,
      pubDate: p.data.date,
      description: stripHtml(p.data.excerpt ?? ''),
      categories: p.data.tags ?? [],
    }));

  return rss({
    title: site.siteTitle,
    description: site.rssDescription,
    site: context.site,
    items,
    customData: `<language>en</language><managingEditor>${escapeXml(site.authorName)}</managingEditor>`,
    stylesheet: '/feed.xsl',
  });
}
