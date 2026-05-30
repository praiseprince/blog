import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

const KIND_LABEL: Record<Post['data']['type'], string> = {
  essay: 'Essay',
  photo: 'Photograph',
  walk: 'Walk',
  fragment: 'Fragment',
  technical: 'Note',
};

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postUrl(post: Post): string {
  return `/posts/${post.id.replace(/\.(md|mdx)$/, '')}/`;
}

export function kindLabel(type: Post['data']['type']): string {
  return KIND_LABEL[type];
}

export function shortDate(d: Date): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const yr = String(d.getFullYear()).slice(-2);
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} ’${yr}`;
}

export async function getAllTags(): Promise<Map<string, Post[]>> {
  const posts = await getAllPosts();
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    for (const t of p.data.tags) {
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(p);
    }
  }
  return map;
}
