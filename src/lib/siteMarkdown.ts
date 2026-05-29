import fs from 'node:fs';
import path from 'node:path';

type SiteMarkdown = {
  data: Record<string, string>;
  sections: Record<string, string>;
};

function parseFrontmatter(source: string) {
  if (!source.startsWith('---')) return { data: {}, body: source };

  const end = source.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: source };

  const raw = source.slice(3, end).trim();
  const body = source.slice(end + 4).trim();
  const data: Record<string, string> = {};

  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    data[key] = value.trim().replace(/^"(.*)"$/, '$1');
  }

  return { data, body };
}

function parseSections(body: string) {
  const sections: Record<string, string> = {};
  const parts = body.split(/^##\s+(.+)$/m);
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i].trim().toLowerCase();
    sections[key] = parts[i + 1]?.trim() ?? '';
  }
  return sections;
}

export function inlineMarkdown(value = '') {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="border-bottom: 1px solid var(--accent);">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function markdownParagraphs(value = '') {
  return value
    .split(/\n{2,}/)
    .map(block => block.trim().replace(/\n+/g, ' '))
    .filter(Boolean)
    .map(inlineMarkdown);
}

export function readSiteMarkdown(fileName: string): SiteMarkdown {
  const filePath = path.join(process.cwd(), 'src', 'site', fileName);
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontmatter(source);
  return { data, sections: parseSections(body) };
}
