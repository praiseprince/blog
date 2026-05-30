import { getCollection, type CollectionEntry } from 'astro:content';
import { kindLabel, shortDate } from './posts';

export type Friend = CollectionEntry<'friends'>;

// Re-export so friend pages can use the same kind/date helpers as the archive.
export { kindLabel, shortDate };

// Effective sort key: explicit `order` wins, then pinned entries float near the
// top, then everything else falls to 100 (sorted newest-first within that band).
function sortKey(f: Friend): number {
  if (typeof f.data.order === 'number') return f.data.order;
  return f.data.pinned ? 1 : 100;
}

export function isTemplate(f: Friend): boolean {
  return f.data.order === 0;
}

export async function getAllFriends(): Promise<Friend[]> {
  const friends = await getCollection('friends');
  return friends
    .filter(f => !f.data.draft)
    .sort((a, b) => {
      const ka = sortKey(a);
      const kb = sortKey(b);
      if (ka !== kb) return ka - kb;
      return b.data.date.getTime() - a.data.date.getTime();
    });
}

export function friendUrl(f: Friend): string {
  return `/friends/${f.id.replace(/\.(md|mdx)$/, '')}/`;
}

// Group real (non-template) friend entries by exact author string, newest-first
// inside each group, with groups ordered by their most recent entry.
export function groupByAuthor(friends: Friend[]): Array<{ author: string; entries: Friend[] }> {
  const map = new Map<string, Friend[]>();
  for (const f of friends) {
    if (isTemplate(f)) continue;
    if (!map.has(f.data.author)) map.set(f.data.author, []);
    map.get(f.data.author)!.push(f);
  }
  return [...map.entries()]
    .map(([author, entries]) => ({
      author,
      entries: entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime()),
    }))
    .sort((a, b) => b.entries[0].data.date.getTime() - a.entries[0].data.date.getTime());
}
