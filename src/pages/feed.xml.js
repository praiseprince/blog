import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/posts';
import { getAllFriends, friendUrl, isTemplate } from '../lib/friends';
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
  // Friend posts join the feed too. The template (order:0) is excluded unless it
  // intentionally opts in via `showInFeed: true`.
  const friends = (await getAllFriends())
    .filter(f => !isTemplate(f) || f.data.showInFeed);

  const postItems = posts.map(p => ({
    title: stripHtml(p.data.title),
    link: `/posts/${p.id.replace(/\.(md|mdx)$/, '')}/`,
    pubDate: p.data.date,
    description: stripHtml(p.data.excerpt ?? ''),
    categories: p.data.tags ?? [],
    author: site.authorName,
  }));

  const friendItems = friends.map(f => {
    const by = stripHtml(f.data.author);
    const excerpt = stripHtml(f.data.excerpt ?? '');
    return {
      title: stripHtml(f.data.title),
      link: friendUrl(f),
      pubDate: f.data.date,
      description: `By ${by}${excerpt ? ` — ${excerpt}` : ''}`,
      categories: ['friends', ...(f.data.tags ?? [])],
      author: by,
    };
  });

  const items = [...postItems, ...friendItems]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.siteTitle,
    description: site.rssDescription,
    site: context.site,
    items,
    customData: `<language>en</language><managingEditor>${escapeXml(site.authorName)}</managingEditor>`,
    stylesheet: '/feed.xsl',
  });
}
