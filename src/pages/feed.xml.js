import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

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

export async function GET(context) {
  const posts = await getCollection('posts');
  const items = posts
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map(p => ({
      title: stripHtml(p.data.title),
      link: `/posts/${p.id.replace(/\.(md|mdx)$/, '')}/`,
      pubDate: p.data.date,
      description: stripHtml(p.data.excerpt ?? ''),
      categories: p.data.tags ?? [],
    }));

  return rss({
    title: 'Postcards from Far Away',
    description: "A field journal of one engineer's intellectual life. Personal editorial site by Praise Prince.",
    site: context.site,
    items,
    customData: '<language>en</language>',
    stylesheet: '/feed.xsl',
  });
}
