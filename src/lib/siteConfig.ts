import { readSiteMarkdown } from './siteMarkdown';

const DEFAULT_SITE_TITLE = 'Site';

export function getSiteConfig() {
  const about = readSiteMarkdown('about.md');
  const data = about.data;
  const siteTitle = data.siteTitle ?? DEFAULT_SITE_TITLE;

  return {
    siteTitle,
    siteTitleHtml: data.siteTitleHtml ?? siteTitle,
    siteSubtitle: data.siteSubtitle ?? '',
    siteDescription: data.siteDescription ?? siteTitle,
    rssDescription: data.rssDescription ?? data.siteDescription ?? `${siteTitle}.`,
    authorName: data.authorName ?? 'Author',
    authorShort: data.authorShort ?? data.authorName ?? 'Author',
    homeLocation: data.homeLocation ?? '',
    deskQuote: data.deskQuote ?? '',
    deskQuoteAuthor: data.deskQuoteAuthor ?? '',
  };
}

export function pageTitle(title: string) {
  return `${title} — ${getSiteConfig().siteTitle}`;
}
