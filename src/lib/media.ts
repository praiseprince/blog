import { getCollection, type CollectionEntry } from 'astro:content';

export type Media = CollectionEntry<'media'>;
export type MediaKind = Media['data']['kind'];
export type MediaStatus = Media['data']['status'];

export const KIND_ORDER: MediaKind[] = ['book', 'film', 'show', 'album', 'track'];

export const SECTION_LABEL: Record<MediaKind, string> = {
  book:  'Books',
  film:  'Films',
  show:  'TV shows',
  album: 'Albums',
  track: 'Songs',
};

// Each kind has its own status set (enforced by the schema). The shared
// "queued" slug reads as "In queue" for books/films and "Up next" for
// shows/albums — hence the per-kind label map rather than a flat one.
export const STATUS_LABEL: Record<MediaKind, Partial<Record<MediaStatus, string>>> = {
  book:  { reading: 'Reading',   read: 'Read',       queued: 'In queue' },
  film:  { watched: 'Watched',                       queued: 'In queue' },
  show:  { watching: 'Watching', watched: 'Watched', queued: 'Up next' },
  album: { listened: 'Listened',                     queued: 'Up next' },
  track: { repeat: 'On repeat' },
};

// Global display/sort order: in-progress first, then done, then queued.
const STATUS_ORDER: MediaStatus[] = ['reading', 'watching', 'repeat', 'read', 'watched', 'listened', 'queued'];

export async function getAllMedia(): Promise<Media[]> {
  const all = await getCollection('media');
  return all.sort((a, b) => {
    // primary: kind order
    const ka = KIND_ORDER.indexOf(a.data.kind);
    const kb = KIND_ORDER.indexOf(b.data.kind);
    if (ka !== kb) return ka - kb;
    // secondary: status order
    const sa = STATUS_ORDER.indexOf(a.data.status);
    const sb = STATUS_ORDER.indexOf(b.data.status);
    if (sa !== sb) return sa - sb;
    // tertiary: manual order
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    // last: most-recent first
    const la = a.data.lastAt?.getTime() ?? 0;
    const lb = b.data.lastAt?.getTime() ?? 0;
    return lb - la;
  });
}

export function mediaUrl(m: Media): string {
  return `/desk/${m.id.replace(/\.(md|mdx)$/, '')}/`;
}

export function groupByKind(items: Media[]): Map<MediaKind, Media[]> {
  const map = new Map<MediaKind, Media[]>();
  for (const k of KIND_ORDER) map.set(k, []);
  for (const m of items) map.get(m.data.kind)!.push(m);
  return map;
}

export function groupByStatus(items: Media[]): Map<MediaStatus, Media[]> {
  const map = new Map<MediaStatus, Media[]>();
  for (const s of STATUS_ORDER) map.set(s, []);
  for (const m of items) map.get(m.data.status)!.push(m);
  // remove empty statuses
  for (const [s, list] of map) if (list.length === 0) map.delete(s);
  return map;
}

export function starRow(rating?: number): string {
  if (!rating) return '';
  const filled = '▣'.repeat(rating);
  const empty = '◇'.repeat(5 - rating);
  return filled + empty;
}

export function shortDate(d?: Date): string {
  if (!d) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ’${String(d.getFullYear()).slice(-2)}`;
}
