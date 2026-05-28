# Postcards from Far Away — Handoff Document

> A field journal of one engineer's intellectual life. Personal editorial site by Praise Prince.

This document exists so that any new contributor (human or agent) can pick the project up with full context. Read it first.

---

## 1. What this project is

**Postcards from Far Away** is a personal editorial site. Not a content-marketing blog, not a portfolio. The closest cultural references are independent magazines, art-school journals, and digital field notebooks. The aesthetic is editorial-print: strong typography, generous whitespace, four palette options, a distinct night mode that feels like a gallery rather than just inverted colors.

The voice is contemplative, slightly self-deprecating, observant. Lagos and Cambridge are the recurring geographies. The author is "Praise Prince" (the byline); the publication is "Postcards from Far Away" (the masthead).

### Author intent (from the original brief)

The site publishes:
- Point-and-shoot photography
- Fragments of thought
- Essays
- Observations from walks
- Philosophy / history / politics / religion reflections
- Technical curiosities (CS, engineering, physics)
- Visual references and archives
- Media consumed (books, films, shows, albums, tracks)

It is **explicitly** not meant to feel corporate, optimized, or "content creator." Slow over fast, local over global.

---

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5** | Purpose-built for content-heavy static sites |
| Output | Static SSG | No backend needed; content is files |
| Content | Markdown + frontmatter via **content collections** | Type-safe via Zod, file-based |
| Styling | Plain CSS + CSS custom properties | No framework; editorial design is bespoke |
| Syntax highlighting | Shiki with `css-variables` theme | Inherits the editorial palette |
| Video embeds | Custom `<Video>` component | Handles self-hosted MP4 + YouTube/Vimeo |
| Hosting target | Any static host (Cloudflare Pages / Vercel / Netlify) | Zero-cost serverless |

No database, no auth, no backend API. Build → static HTML/CSS/JS → upload.

### Why Astro specifically
- Native Markdown + content collections with Zod-typed frontmatter
- Zero JS by default — perfect for a reading-focused site
- Components are component-shaped (`.astro` files) without React's runtime overhead
- Compatible with Keystatic, Decap, Tina if/when a CMS is added

---

## 3. Project structure

```
/
├── astro.config.mjs          Astro config (site URL, tunnel allowlist, Shiki)
├── package.json
├── tsconfig.json
├── HANDOFF.md                ← you are here
├── public/
│   └── script.js             Theme toggle, masthead date, reading progress
├── src/
│   ├── content.config.ts     Zod schemas for posts + media collections
│   ├── styles/
│   │   └── global.css        Editorial design system (palettes, type, layout)
│   ├── content/
│   │   ├── posts/            Each .md = one post (essay/photo/walk/fragment/technical)
│   │   └── media/            Each .md = one media entry (book/film/show/album/track)
│   ├── lib/
│   │   ├── posts.ts          getAllPosts, getFeaturedPosts, kindLabel, helpers
│   │   └── media.ts          getAllMedia, mediaUrl, STATUS_LABEL, sort helpers
│   ├── components/
│   │   ├── BaseLayout.astro  Shared chrome (head/masthead/nav/colophon)
│   │   ├── Masthead.astro    Nameplate variants (home + default)
│   │   ├── SiteNav.astro     Hamburger nav on mobile, inline on desktop
│   │   ├── Colophon.astro    Footer
│   │   ├── Tag.astro         Tag pill
│   │   ├── Figure.astro      Generic figure with caption
│   │   ├── MediaCard.astro   Per-kind card for /desk/
│   │   └── Video.astro       Auto-detects local MP4 vs YouTube/Vimeo
│   ├── layouts/              One layout per post type
│   │   ├── EssayLayout.astro
│   │   ├── PhotoLayout.astro
│   │   ├── WalkLayout.astro
│   │   ├── FragmentLayout.astro
│   │   └── TechnicalLayout.astro
│   └── pages/
│       ├── index.astro       Homepage — Masthead-style; lead + side + tier + contact + desk strip + tags
│       ├── archive.astro     Filterable archive (kind + list/grid view)
│       ├── about.astro       Colophon
│       ├── desk.astro        /desk/ index (sectioned by kind, status-grouped, filter + sort)
│       ├── desk/[slug].astro Per-media-entry detail page (cover, meta, log, long review)
│       ├── posts/[...slug].astro  Dispatches to the right post layout by type
│       └── tags/[tag].astro  Auto-generated per-tag pages
└── design-reference/         Original HTML prototype (read-only; do not edit)
```

---

## 4. Content schema

All schemas live in `src/content.config.ts`. Two collections: **posts** (the publication itself) and **media** (the desk — things consumed).

### Posts schema

Common fields on every post:

```yaml
title: string                # supports inline HTML (em, strong, br)
type: essay | photo | walk | fragment | technical
date: ISO date
tags: string[]               # creates /tags/<tag>/ pages
excerpt: string              # shown on home + archive cards
eyebrow: string              # small uppercase label above the title
location: string
readTime: string
wordCount: number
featured: boolean            # if true, gets priority on homepage
featuredOrder: number        # lower = higher priority among featured
draft: boolean               # if true, hidden from build
nextLabel + nextHref         # manual "next entry" link at bottom
```

Type-specific fields:

- **essay**: `lede`, `cited` (array of {author, title, year}), `cover` (figure object)
- **photo**: `cover`, `roll`, `camera`, `film`, `coords`, `gallery` (array of figures with grid positions), `rollNote`
- **walk**: `walkMeta` (start, end, distance, weather, route, notebook), `timeline` (array of timeline entries — prose, quote, figure, wide-figure, video, wide-video), `coda`
- **fragment**: `fragmentNumber`, `intro`, `items` (array — quote, prose, photo, note, poem, screen-grab, mono — with tone variants)
- **technical**: `lede`, `techMeta` (readTime, lang, lastEdit, stamp), `marginalia` (note, math, variants, figure entries shown in the right rail)

The **markdown body** is rendered for essays + technical (long prose); for photos/walks/fragments the layout is mostly driven by structured frontmatter.

### Media schema (discriminated union)

```yaml
kind: book | film | show | album | track    # the discriminator
title, status, rating, note, tags, cover, firstAt, lastAt, consumptionCount, order, log[]
```

- **book**: `author, year, pages, currentPage, spine, tone (1-4)`
- **film**: `director, year, runtime, language`
- **show**: `creator, year, currentSeason, currentEpisode, network`
- **album**: `artist, year, length, label`
- **track**: `artist, album, year, duration`

`status` is one of: `consuming | finished | stalled | queued | abandoned`.
Labels per kind live in `src/lib/media.ts` (`STATUS_LABEL`). Convention: only "consuming" gets a kind-specific verb (Reading / Watching / In rotation / On repeat). Everything else (Finished / Stalled / Up next / Set aside) is uniform across kinds for clarity.

The **markdown body** of a media entry is the optional long-form review. Short-note entries leave the body empty. The `log[]` array supports periodic re-engagement entries (re-read, re-watch, re-listen), each with a date and optional note. Renders as a timeline on the detail page.

---

## 5. Authoring conventions (important)

### HTML inside frontmatter strings
The codebase currently allows `<em>`, `<strong>`, `<br/>`, `<a>` etc. inside frontmatter strings (titles, excerpts, captions, notes). These are rendered via `set:html`. **This is a known wart**. Eventually they should migrate to plain Markdown + a tiny inline renderer at render time. Acceptable as-is until that migration; flagged for cleanup.

### Tags
- Lowercase by default; capitalize only for proper nouns (`Bachelard`, `Calvino`).
- Use hyphens for multi-word tags (`slow-internet`, not `slow internet`).
- No tag-creation step: typing it in any post's `tags:` array auto-generates the `/tags/<tag>/` page on next build.
- Tags are currently only on posts. Media entries have a `tags` field too but their tags don't yet appear on `/tags/<tag>/` pages — that's a deliberate gap, can be wired up if wanted.

### Images
Currently served from external URLs (placeholder picsum). When real images come in, the plan is to co-locate them under `src/content/posts/<slug>/` and use Astro's `image()` schema helper for automatic optimization. **Not yet done.**

### Drafts
`draft: true` on a post hides it from the build. `getAllPosts()` filters drafts out.

### Featured posts
`featured: true` on a post bubbles it to the homepage lead. If multiple are featured, `featuredOrder` (lower = higher) decides the order. The side column on the homepage shows remaining featured posts first, then falls back to latest cross-kind.

### Slug
The slug is derived from the filename. Renaming a file changes the URL. (TODO: add explicit `slug` field for URL stability.)

---

## 6. Design system

Defined in `src/styles/global.css`.

**Type families:**
- Display: Instrument Serif (italic flourishes, nameplate, large headings)
- Body: Newsreader (literary serif with optical sizing — reading text)
- Sans / UI: Geist (nav, captions, metadata)
- Mono: JetBrains Mono (eyebrows, mono technical, code)

**Palettes (four):**
- `newsprint` — oxblood accent on warm paper (default)
- `archive` — cool blue-grey accent on stone paper
- `tumblr` — warm terracotta accent on cream paper
- `mono` — black-on-bone

**Themes:**
- `day` — paper feel, accent in full color
- `night` — gallery-charcoal background, warm amber accent, grain in screen-blend mode

Selected via the toggle in the nav; persisted via `localStorage` (keys: `pp-theme`, `pp-palette`). Initial state set inline at top of `<head>` by `/script.js` to avoid FOUC.

**Grid:** 12-column editorial grid (`.editorial-grid`). Most page-specific layouts use inline `grid-column: X / span Y` styles. **Pitfall**: those inline styles don't auto-collapse on mobile — each page needs explicit `@media (max-width: 720px)` overrides. Several have them; check before adding new ones.

---

## 7. Pages overview

- `/` — homepage. Lead (featured first, else latest essay/photo/walk) + side column (4 cross-kind) + 3-col tier + conditional contact sheet + currently-on-the-desk strip + tag cloud
- `/archive/` — full archive with kind filter + list/grid views. URL query `?kind=essay|photo|...` pre-selects a filter
- `/posts/<slug>/` — individual post (layout dispatched by `type`)
- `/desk/` — media index: sectioned by kind, status-grouped within. Filter bar (All / Books / Films / Shows / Albums / Tracks) + sort dropdown (Default by status / Recently updated / A→Z / Rating ▼ / Most revisited / Earliest first)
- `/desk/<slug>/` — media entry detail: big cover, metadata, log timeline (if any), full review body (if any)
- `/tags/<tag>/` — auto-generated per-tag listing
- `/about/` — colophon: bio, typography, ethos, equipment, contact

---

## 8. Components worth knowing

- **`<Video>`** — `src` prop. If YouTube/Vimeo URL → renders iframe via `youtube-nocookie.com` / `player.vimeo.com`. Otherwise renders native `<video>` with controls. Phone-responsive via aspect-ratio container.
- **`<MediaCard>`** — per-kind visual (book spine, 2:3 poster, 1:1 album square, track row). Adds `data-*` attributes for client-side filter/sort on the desk page.
- **`<SiteNav>`** — desktop = inline link row. Mobile = "Menu" hamburger button + dropdown.

---

## 9. Mobile responsiveness

Breakpoints used throughout:
- `900px` — homepage lead+side collapse to single column
- `800px` — most multi-column page layouts collapse
- `720px` — masthead secondary blocks hide, site nav becomes hamburger, page padding tightens
- `600px` — desk poster/square grids drop to 2 columns
- `420px` — extra tightening for narrow phones

**Known pitfall**: inline-styled `grid-column` items don't collapse without explicit media queries. Any new editorial-grid layout needs to add its own mobile rules.

---

## 10. Build / deploy

```bash
npm install
npm run dev       # http://localhost:4321 — hot reload
npm run build     # → dist/
npm run preview   # serves the built dist/ — needs a rebuild after each change
```

Deploy target is any static host. Cloudflare Pages and Vercel both auto-build on `git push` from the GitHub repo.

Git is at https://github.com/praiseprince/blog. Tagged `v1.0.0`. **Do not** add Claude attribution to commits or PRs (per repository convention — see `~/.claude/projects/-Users-june-Desktop-blog/memory/`).

---

## 11. Backlog (planned, not built)

### Keystatic CMS integration (priority — author asked for this)

**The vision:** stop touching the codebase after the design is locked. Open a web app on any device, write Markdown in a rich editor, hit save — content commits to git, site auto-deploys.

**Why Keystatic:** Astro-native, file-backed (writes Markdown to the repo), free, has both local and cloud-hosted admin UIs. Schema mirrors the existing Zod content collections, so per-type forms are generated automatically. Mobile-usable in any browser.

**What integration looks like (rough plan, not yet built):**

1. Install: `npm install @keystatic/core @keystatic/astro`
2. Add to `astro.config.mjs`:
   ```js
   import keystatic from '@keystatic/astro';
   import react from '@astrojs/react';
   export default defineConfig({
     integrations: [react(), keystatic()],
     output: 'hybrid',  // needs SSR for the admin route
   });
   ```
3. Create `keystatic.config.ts` declaring collections. Each Zod field maps to a Keystatic field type:
   - `z.string()` → `fields.text()`
   - `z.coerce.date()` → `fields.date()`
   - `z.enum([...])` → `fields.select({ options: [...] })`
   - `z.array(...)` → `fields.array(...)`
   - `z.object(...)` → `fields.object({...})`
   - `z.discriminatedUnion(...)` → `fields.conditional(...)` (for media collection)
   - Markdown body → `fields.markdoc()` or `fields.document()` (rich-text)
4. Add admin route: `src/pages/keystatic/[...params].astro`
5. Add API route: `src/pages/api/keystatic/[...params].ts`

**Layout primitives in the rich-text editor:**
Keystatic's `document` / `markdoc` fields let you register **custom components** that appear as insertable blocks in the editor. For this project that means:
- `Video` block — for embedding self-hosted or YouTube/Vimeo videos in any post body
- `Gallery` block — for image grids
- `Pullquote` block — for editorial pull-quotes
- `Marginalia` block — for technical notes' side rail

Each block is defined in `keystatic.config.ts` with its own fields, and renders in the live editor as a typed widget (not raw markup). The author clicks "+ Video" and gets a form, not a `<Video src="..." />` tag.

**Tradeoff with WordPress/Wix experience:**
- WordPress: edit → save → live in 0s (runtime server + database).
- Astro + Keystatic: edit → commit → automated rebuild → live in ~20-30s.
- The lag exists because the site is statically generated. With Cloudflare/Vercel webhooks, the rebuild is automated and free.

**What to defer until after Keystatic is wired:**
- Migration of HTML-in-frontmatter to Markdown-in-frontmatter. The rich-text widget produces clean Markdown by default, so the migration partially solves itself.

### Guest contributions section ("Letters from Friends" — needs naming)

Friends send the author content; author posts on their behalf, with friend's name as author. Naming candidates (author to pick):
- **Correspondences** — old-fashioned, intellectually warm, matches the publication's voice
- **Other postcards** — fits the "Postcards from Far Away" framing
- **Hand-delivered** — implies the friend brought it over
- **Dispatches** — more journalistic, less personal

Recommended implementation (when ready):
- Add `author` field to post schema. If absent → site owner (Praise Prince). If present → guest contribution.
- Author object: `{ name, bio (one line), link? (website), photo? }`
- New page `/correspondences/` (or chosen name) lists posts with non-default authors
- Guest posts surface on the homepage with a "Letter from X" eyebrow
- A tag `#correspondence` auto-collects them
- Open question for the author: do guest posts have their own visual treatment (different palette? margin note saying "guest"?) or do they look identical to author's posts?

### Photo gallery

Open question. Currently `/archive/?kind=photo` (grid view) shows the first 4 images per photo post — sort of works.

A dedicated `/gallery/` page would show **all** images across all photo posts, in a single wall, with captions, possibly filterable by year/tag/roll. Different in spirit from the editorial photo posts (which are about a story — a roll, a place, a moment). A gallery is about the collected eye over time.

Worth adding, probably after Keystatic. Defer for now.

### Image co-location + optimization

Currently all images are external picsum placeholders. When real images come in:
- Co-locate under `src/content/posts/<slug>/images/` (or similar)
- Add `image()` to schema for automatic Astro optimization (responsive srcsets, webp, lazy loading)
- Update the Figure / cover / gallery rendering to use Astro's `<Image>` component

### Other deferred items

- Slug stability (`slug` field separate from filename)
- Auto-derive next/previous post from date order (remove manual `nextHref`/`nextLabel`)
- Discriminated union for the posts schema (proper per-type field validation)
- RSS feed (`/feed.xml`)
- Sitemap
- Strip HTML from frontmatter strings → use Markdown + inline renderer

---

## 12. Open questions for the author

1. **Naming for the guest section** — Correspondences? Other postcards? Hand-delivered?
2. **Gallery** — separate page, or extended `/archive/?kind=photo` view?
3. **Featured-image strategy on homepage** — currently the lead = featured (if any), else latest essay/photo/walk. Should the "featured strip" show MORE than just the lead, as 3-4 visual cards above the editorial grid?
4. **Guest contributions visual treatment** — same as author posts, or visually distinct?
5. **Image handling timeline** — start co-locating now, or wait until Keystatic is wired (so its upload widget handles the file placement)?

---

## 13. Conventions / quirks

- Author byline: "Praise Prince" or "P.P." — keep, do NOT replace these even when renaming masthead/title strings
- Site name (masthead nameplate): "Postcards from Far Away" — italic on "Postcards"
- Page `<title>` tags strip HTML automatically (helper in `BaseLayout.astro`)
- Theme/palette state is persisted in `localStorage` (`pp-theme`, `pp-palette`)
- No analytics, no email capture, no newsletter form — by design

---

## 14. Quick start for new contributors

```bash
git clone https://github.com/praiseprince/blog
cd blog
npm install
npm run dev
# Open http://localhost:4321
```

To add a new post: drop a `.md` file into `src/content/posts/`, fill the typed frontmatter, save. The build picks it up.

To add a new media entry: drop a `.md` into `src/content/media/`. The `kind:` field determines which form fields are required.

To add a tag: just write it in any post's `tags:` array — page auto-generates.

To work on the design: edit `src/styles/global.css` for global tokens; edit individual layouts/pages for per-route styling.

---

_Last updated: 2026-05-27. Ping the author (or update this file) when the project meaningfully diverges from what's described here._
