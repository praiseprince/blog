import { getAllMedia, mediaUrl } from '../lib/media';
import { getAllPosts, getAllTags, postUrl } from '../lib/posts';
import { getAllFriends, friendUrl } from '../lib/friends';
import { readSiteMarkdown } from '../lib/siteMarkdown';
import { getSiteUrl } from '../lib/siteUrl.js';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toAbsoluteUrl(pathname, site) {
  return new URL(pathname, site).toString();
}

function dateOnly(date) {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

function latestDate(dates) {
  const times = dates.map(d => d?.getTime?.() ?? 0).filter(Boolean);
  return times.length ? new Date(Math.max(...times)) : undefined;
}

function urlEntry({ loc, lastmod }, site) {
  const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
  return `  <url>\n    <loc>${escapeXml(toAbsoluteUrl(loc, site))}</loc>${lastmodTag}\n  </url>`;
}

export async function GET(context) {
  const site = context.site ?? new URL(getSiteUrl());
  const about = readSiteMarkdown('about.md');
  const friendsTemplate = readSiteMarkdown('friends-template.md');
  const posts = await getAllPosts();
  const friends = await getAllFriends();
  const media = await getAllMedia();
  const tags = await getAllTags();
  const siteLastmod = dateOnly(latestDate([
    ...posts.map(post => post.data.date),
    ...media.map(item => item.data.lastAt ?? item.data.firstAt),
  ]));
  const mediaLastmod = dateOnly(latestDate(media.map(item => item.data.lastAt ?? item.data.firstAt)));
  const friendsLastmod = dateOnly(latestDate(friends.map(f => f.data.date)));

  const entries = [
    { loc: '/', lastmod: siteLastmod },
    { loc: '/archive/', lastmod: siteLastmod },
    { loc: '/desk/', lastmod: mediaLastmod },
    { loc: '/friends/', lastmod: friendsLastmod },
    { loc: '/friends/how-to-send-a-post/', lastmod: dateOnly(friendsTemplate.data.date ? new Date(friendsTemplate.data.date) : undefined) },
    { loc: '/about/', lastmod: about.data.lastmod },
    ...posts.map(post => ({
      loc: postUrl(post),
      lastmod: dateOnly(post.data.date),
    })),
    ...friends.map(f => ({
      loc: friendUrl(f),
      lastmod: dateOnly(f.data.date),
    })),
    ...media.map(item => ({
      loc: mediaUrl(item),
      lastmod: dateOnly(item.data.lastAt ?? item.data.firstAt),
    })),
    ...[...tags.entries()].map(([tag, taggedPosts]) => ({
      loc: `/tags/${tag}/`,
      lastmod: dateOnly(latestDate(taggedPosts.map(post => post.data.date))),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entry => urlEntry(entry, site)).join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
