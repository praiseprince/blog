import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const figure = z.object({
  src: z.string(),
  alt: z.string().optional().default(''),
  caption: z.string().optional(),
  ix: z.string().optional(),
  aspect: z.string().optional(),
  fit: z.enum(['cover', 'contain']).optional(),
  position: z.string().optional(),
  colspan: z.number().optional(),
  colstart: z.number().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['essay', 'photo', 'walk', 'fragment', 'technical']),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string().optional(),
    eyebrow: z.string().optional(),
    dek: z.string().optional(),
    location: z.string().optional(),
    readTime: z.string().optional(),
    wordCount: z.number().optional(),
    issueLabel: z.string().optional(),
    showOnHome: z.boolean().default(false),
    draft: z.boolean().default(false),

    cover: figure.optional(),
    // Auto-derived from date order in src/pages/posts/[...slug].astro — do not
    // set these by hand. Kept here only as the injection target + type.
    nextLabel: z.string().optional(),
    nextHref: z.string().optional(),

    // Essay
    lede: z.string().optional(),
    cited: z.array(z.object({
      author: z.string(),
      title: z.string(),
      year: z.string().optional(),
    })).optional(),

    // Photo
    roll: z.string().optional(),
    camera: z.string().optional(),
    film: z.string().optional(),
    coords: z.string().optional(),
    gallery: z.array(figure).optional(),
    rollNote: z.string().optional(),

    // Walk
    walkMeta: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
      distance: z.string().optional(),
      weather: z.string().optional(),
      route: z.string().optional(),
      notebook: z.string().optional(),
    }).optional(),
    timeline: z.array(z.object({
      time: z.string(),
      kind: z.enum(['prose', 'quote', 'figure', 'wide-figure', 'prose-wide', 'video', 'wide-video']),
      heading: z.string().optional(),
      body: z.string().optional(),
      aside: z.string().optional(),
      image: z.string().optional(),
      video: z.string().optional(),
      poster: z.string().optional(),
      aspect: z.string().optional(),
      fit: z.enum(['cover', 'contain']).optional(),
      position: z.string().optional(),
      caption: z.string().optional(),
      ix: z.string().optional(),
    })).optional(),
    coda: z.string().optional(),

    // Fragment
    fragmentNumber: z.string().optional(),
    intro: z.string().optional(),
    items: z.array(z.object({
      number: z.string(),
      meta: z.string().optional(),
      kind: z.enum(['quote', 'prose', 'photo', 'note', 'poem', 'screen-grab', 'mono']),
      content: z.string().optional(),
      caption: z.string().optional(),
      image: z.string().optional(),
      aspect: z.string().optional(),
      fit: z.enum(['cover', 'contain']).optional(),
      position: z.string().optional(),
      colspan: z.number().default(6),
      tone: z.enum(['plain', 'card', 'rule', 'accent', 'inverse']).optional(),
      rotate: z.number().optional(),
    })).optional(),

    // Technical
    techMeta: z.object({
      readTime: z.string().optional(),
      lang: z.string().optional(),
      lastEdit: z.string().optional(),
      stamp: z.string().optional(),
    }).optional(),
    marginalia: z.array(z.object({
      kind: z.enum(['note', 'math', 'figure', 'variants']),
      body: z.string().optional(),
      math: z.string().optional(),
      mathLabel: z.string().optional(),
      image: z.string().optional(),
      caption: z.string().optional(),
      ix: z.string().optional(),
      label: z.string().optional(),
    })).optional(),
  }),
});

const mediaBase = {
  title: z.string(),
  status: z.enum(['consuming', 'finished', 'stalled', 'queued', 'abandoned']),
  rating: z.number().min(1).max(5).optional(),
  note: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  firstAt: z.coerce.date().optional(),
  lastAt: z.coerce.date().optional(),
  consumptionCount: z.number().default(1),
  order: z.number().default(0),
  log: z.array(z.object({
    date: z.coerce.date(),
    note: z.string().optional(),
  })).optional(),
};

const bookSchema = z.object({
  kind: z.literal('book'),
  ...mediaBase,
  author: z.string(),
  year: z.string().optional(),
  pages: z.number().optional(),
  currentPage: z.number().optional(),
  spine: z.string().optional(),
  tone: z.enum(['1', '2', '3', '4']).default('1'),
});

const filmSchema = z.object({
  kind: z.literal('film'),
  ...mediaBase,
  director: z.string(),
  year: z.string(),
  runtime: z.string().optional(),
  language: z.string().optional(),
});

const showSchema = z.object({
  kind: z.literal('show'),
  ...mediaBase,
  creator: z.string(),
  year: z.string(),
  currentSeason: z.number().optional(),
  currentEpisode: z.number().optional(),
  network: z.string().optional(),
});

const albumSchema = z.object({
  kind: z.literal('album'),
  ...mediaBase,
  artist: z.string(),
  year: z.string(),
  length: z.string().optional(),
  label: z.string().optional(),
});

const trackSchema = z.object({
  kind: z.literal('track'),
  ...mediaBase,
  artist: z.string(),
  album: z.string().optional(),
  year: z.string().optional(),
  duration: z.string().optional(),
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/media' }),
  schema: z.discriminatedUnion('kind', [
    bookSchema, filmSchema, showSchema, albumSchema, trackSchema,
  ]),
});

export const collections = { posts, media };
