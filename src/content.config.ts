import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const figure = z.object({
  src: z.string(),
  alt: z.string().optional().default(''),
  caption: z.string().optional(),
  ix: z.string().optional(),
  aspect: z.string().optional(),
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

    cover: figure.optional(),
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
      kind: z.enum(['prose', 'quote', 'figure', 'wide-figure', 'prose-wide']),
      heading: z.string().optional(),
      body: z.string().optional(),
      aside: z.string().optional(),
      image: z.string().optional(),
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

const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.string().optional(),
    status: z.enum(['active', 'stalled', 'finished']),
    spine: z.string(),
    tone: z.enum(['1', '2', '3', '4']).default('1'),
    note: z.string(),
    stars: z.string().optional(),
    progress: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { posts, books };
