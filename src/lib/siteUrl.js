import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_SITE_URL = 'http://localhost:4321';

function readSiteUrlFromAbout() {
  const filePath = path.join(process.cwd(), 'src', 'site', 'about.md');

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) return undefined;

    const line = frontmatter[1]
      .split('\n')
      .map(entry => entry.trim())
      .find(entry => entry.startsWith('siteUrl:'));

    if (!line) return undefined;
    return line
      .replace(/^siteUrl:\s*/, '')
      .trim()
      .replace(/^"(.*)"$/, '$1')
      .replace(/^'(.*)'$/, '$1');
  } catch {
    return undefined;
  }
}

export function getSiteUrl() {
  const raw = readSiteUrlFromAbout()?.trim() || DEFAULT_SITE_URL;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withProtocol).toString().replace(/\/$/, '');
}
