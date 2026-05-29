# Postcards from Far Away — Handoff Document

> A field journal of one person's intellectual life. Personal editorial site by Praise Prince.

This document exists so any new contributor (human or agent) can pick the project up with full context. Read it first. It is meant to reflect the **actual current state** of the codebase, not the original plan — when you change something structural, update this file.

_Last updated: 2026-05-29._

---

## 1. What this project is

**Postcards from Far Away** is a personal editorial site. Not a content-marketing blog, not a portfolio. The closest cultural references are independent magazines, art-school journals, and digital field notebooks. The aesthetic is editorial-print: strong typography, generous whitespace, four palette options, a distinct night mode that feels like a gallery rather than just inverted colors.

The voice is contemplative, slightly self-deprecating, observant. The author is "Praise Prince" (the byline); the publication is "Postcards from Far Away" (the masthead).

The site publishes: point-and-shoot photography, fragments of thought, essays, observations from walks, philosophy/history/politics/religion reflections, technical curiosities (CS, engineering, physics), and a "desk" of media consumed (books, films, shows, albums, tracks).

It is **explicitly** not meant to feel corporate, optimized, or "content creator." Slow over fast, local over global.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | **Astro 5** (`^5.14`) |
| Output | Static SSG (`output: 'static'`, directory URLs) |
| Content | Markdown + frontmatter via **content collections**, Zod-typed |
| Styling | Plain CSS + CSS custom properties (no framework) |
| Syntax highlighting | Shiki, `css-variables` theme (inherits the palette) |
| Feed | `@astrojs/rss` → `/feed.xml` |
| Sitemap | custom endpoint → `/sitemap.xml`, advertised in `robots.txt` |
| Client JS | One hand-written `public/script.js` + small per-page inline scripts |
| Hosting target | Any static host (`siteUrl` in `src/site/about.md` controls canonical URLs) |

**Dependencies are intentionally tiny** — `package.json` has exactly two: `astro` and `@astrojs/rss`. No React, no UI library, no CMS installed yet. Build → static HTML/CSS/JS → upload.

---

## 3. Project structure

```
/
├── astro.config.mjs          markdown-driven site URL, static output, Shiki, tunnel allowlist
├── package.json              deps: astro, @astrojs/rss only
├── tsconfig.json
├── HANDOFF.md                ← you are here
├── public/
│   ├── script.js             theme/palette toggle, masthead date, reading progress, photo-viewer lightbox
│   ├── feed.xsl              XSLT stylesheet that prettifies /feed.xml for humans (CSS-only day/night)
│   ├── sitemap.xsl           XSLT stylesheet that prettifies /sitemap.xml for humans (CSS-only day/night)
│   └── favicon-32.png  favicon-192.png  favicon-512.png  apple-touch-icon.png
├── src/
│   ├── assets/
│   │   └── images/         local source JPEGs, optimized by Astro at build time
│   ├── content.config.ts     Zod schemas for `posts` + `media` collections
│   ├── site/
│   │   ├── README.md         what is editable here
│   │   ├── about.md          About page copy + small metadata
│   │   └── home.md           manual homepage cover post slug
│   ├── styles/global.css     the whole design system (palettes, type, layout, pager, photo-viewer)
│   ├── content/
│   │   ├── posts/            essay/photo/walk/fragment/technical entries
│   │   └── media/            book/film/show/album/track entries
│   ├── lib/
│   │   ├── posts.ts          getAllPosts, postUrl, kindLabel, shortDate, getAllTags
│   │   ├── media.ts          getAllMedia, mediaUrl, SECTION_LABEL, STATUS_LABEL, KIND_ORDER, sort helpers
│   │   ├── photoImages.ts    maps `/images/...` content refs to optimized local assets
│   │   ├── siteConfig.ts     reads reusable site identity/copy from `src/site/about.md`
│   │   ├── siteMarkdown.ts   small parser for `src/site/*.md`
│   │   └── siteUrl.js        reads `siteUrl` from `src/site/about.md`
│   ├── components/
│   │   ├── Masthead.astro    Colophon.astro    SiteNav.astro
│   │   ├── Tag.astro         Figure.astro      Video.astro
│   │   ├── PhotoViewer.astro shared full-image lightbox dialog (close + download)
│   │   └── MediaCard.astro   per-kind card for /desk/ (covers lazy-loaded)
│   ├── layouts/
│   │   ├── BaseLayout.astro  shared chrome (head/masthead/nav/slot/colophon)
│   │   ├── EssayLayout.astro*      PhotoLayout.astro*     WalkLayout.astro*
│   │   ├── FragmentLayout.astro*   TechnicalLayout.astro
│   │   └── (* = renders the shared <PhotoViewer/> lightbox)
│   └── pages/
│       ├── index.astro              homepage (lead + side + tier + contact + desk strip + tags)
│       ├── archive.astro            filterable + paginated archive
│       ├── desk.astro               media index (per-kind, status-grouped, filter + sort + paginated)
│       ├── desk/[slug].astro        per-media detail (cover, meta, log, review body)
│       ├── posts/[...slug].astro    dispatches to the right post layout by `type`
│       ├── tags/[tag].astro         auto-generated, paginated per-tag pages
│       ├── about.astro   404.astro
│       ├── feed.xml.js              RSS feed
│       ├── robots.txt.js            crawler rules + sitemap URL
│       └── sitemap.xml.js           XML sitemap
└── design-reference/         original HTML prototype (read-only; do not edit)
```

There are **no per-kind desk pages and no Keystatic admin route** — those are backlog (§12), not built. (A standalone gallery page was considered and explicitly dropped — not planned.)

---

## 4. Content schema

All schemas live in `src/content.config.ts`. Two collections: **posts** (the publication) and **media** (the desk).

### Posts

Common fields:

```yaml
title: string                # supports inline HTML (em, strong, br) — see §6 wart
type: essay | photo | walk | fragment | technical
date: ISO date
tags: string[]               # creates /tags/<tag>/ pages
excerpt, eyebrow, dek, location, readTime: string
wordCount, issueLabel: number/string
showOnHome: boolean          # opt a fragment/technical note into the homepage latest lists
draft: boolean               # true → excluded from build
cover: figure                # {src, alt, caption, ix, aspect, fit, position, colspan, colstart}
nextLabel, nextHref: string  # manual "next entry" link at the bottom of a post
```

> **Schema note (changed):** the old per-post `featured`/`featuredOrder` model is gone. The manual homepage cover is now set in `src/site/home.md` with `coverPost`; `showOnHome: true` only opts fragments/technical notes into latest lists.

Type-specific fields:
- **essay** — `lede`, `cited[]` ({author, title, year}), `cover`
- **photo** — `cover`, `roll`, `camera`, `film`, `coords`, `gallery[]` (figures with grid positions), `rollNote`
- **walk** — `walkMeta` (start/end/distance/weather/route/notebook), `timeline[]` (prose | quote | figure | wide-figure | prose-wide | video | wide-video), `coda`
- **fragment** — `fragmentNumber`, `intro`, `items[]` (quote | prose | photo | note | poem | screen-grab | mono, with tone variants + optional rotate)
- **technical** — `lede`, `techMeta` (readTime/lang/lastEdit/stamp), `marginalia[]` (note | math | figure | variants, shown in the right rail)

The **markdown body** is rendered for essays + technical (long prose). Photos/walks/fragments are driven mostly by structured frontmatter.

### Media (discriminated union on `kind`)

```yaml
kind: book | film | show | album | track   # discriminator
title, status, note, tags: ...
rating: 1–5 (optional)
cover: string                # external CDN URL (see §5)
firstAt, lastAt: date
consumptionCount: number     # >1 surfaces "re-read/re-watch/replay №N"
order: number
log[]: [{date, note?}]       # re-engagement timeline on the detail page
```

Per-kind extras: **book** `author/year/pages/currentPage/spine/tone(1-4)` · **film** `director/year/runtime/language` · **show** `creator/year/currentSeason/currentEpisode/network` · **album** `artist/year/length/label` · **track** `artist/album/year/duration`.

`status` ∈ `consuming | finished | stalled | queued | abandoned`. Labels per kind live in `src/lib/media.ts` (`STATUS_LABEL`). Convention: only `consuming` gets a kind-specific verb (Reading now / Watching now / In rotation / On repeat); the rest (Finished / Stalled / Up next / Set aside) read uniformly.

---

## 5. Images — current reality (read this before adding photos)

There are two image sources, handled very differently:

**1. Photo post images — local source files, optimized at build time.**
- **Asset root is `src/assets/`** — images are just one type under it. Other asset kinds (self-hosted `video/`, `audio/`, `docs/`, …) get their own siblings under `src/assets/`; this section is only about images.
- Image source files live in **`src/assets/images/`** (renamed from the old import-batch name `blog-add`).
- **The reference token mirrors the folder:** content references an image as `/images/<file>.jpg`, which maps 1:1 to `src/assets/images/<file>.jpg`. `src/lib/photoImages.ts` resolves the token to the imported local asset.
- **Per-roll subfolders are supported** (the glob is recursive): put a roll's photos in `src/assets/images/<roll>/…` and reference them as `/images/<roll>/<file>.jpg`. Use this when one post brings several images, instead of a flat dumping ground.
- Page display images are responsive WebP files from Astro's `getImage()`; the click/lightbox target keeps the original full-quality source.
- This applies to **structured image fields** (`cover`, `gallery`, `timeline`, `items`, `marginalia`). For an image written in **Markdown body prose** (essays/technical), the standard is a **relative path** — `![](../../assets/images/<file>.jpg)` — which Astro optimizes natively. Do **not** use the `/images/...` token in body prose: it is only rewritten in structured fields, so in prose it would 404. (No post uses body images today.)
- Unknown or remote image paths fall back to the original URL without optimization.

**2. Media covers — EXTERNAL CDN URLs.**
- `cover:` on media entries points to remote CDNs: `image.tmdb.org` (films/shows), `is1-ssl.mzstatic.com` (Apple, albums), `covers.openlibrary.org` (books), `i.scdn.co` (Spotify). Books mostly render a typographic spine instead of a cover image.
- These are fine to leave external; they're already CDN-served and the desk lazy-loads them.

### Asset contract (for authoring + any tooling built on top)

The intended workflow is: **every local image a post uses is declared in a frontmatter field** — never typed into body prose. Follow this and the body-image 404 case can never occur. A future upload/CMS-style app should implement exactly this two-step contract:

1. **Store the file** at `src/assets/images/<name>.<ext>`, or grouped: `src/assets/images/<group>/<name>.<ext>`. Allowed `<ext>`: `jpg`, `jpeg`, `png`, `webp`.
2. **Reference it** in a frontmatter image field as `/images/<name>.<ext>` (or `/images/<group>/<name>.<ext>`) — the part after `/images/` must exactly mirror the file's path **under `src/assets/images/`**.

Frontmatter image fields that resolve through `src/lib/photoImages.ts`:

| Post type | Field(s) |
|---|---|
| any | `cover.src` |
| photo | `gallery[].src` |
| walk | `timeline[].image` |
| fragment | `items[].image` |
| technical | `marginalia[].image` |

Each reference yields **two outputs from one source file**: responsive WebP variants for page display, and the full-resolution original (emitted to `/_astro/<name>.<hash>.<ext>`) as the lightbox / download target. No second copy is needed anywhere.

Why the `/images/...` token rather than a relative path: it is **location-independent**, so tooling can emit it without knowing the post file's depth (a relative `../../assets/...` would have to be computed per file). The token is therefore the recommended form for both hand-authoring and generated content. The relative-path form (`![](../../assets/images/<file>)`) exists only as the fallback for the discouraged case of an image written directly in body prose.

`public/` holds only files that must ship byte-for-byte (favicons, `script.js`, `feed.xsl`, `sitemap.xsl`). There is no `public/images/` — images do **not** go there; putting one there would skip optimization.

---

## 6. Authoring conventions

**HTML inside frontmatter strings (known wart).** Titles, excerpts, captions, notes allow `<em>`, `<strong>`, `<br/>`, `<a>` — rendered via `set:html`. Acceptable as-is; flagged for eventual migration to Markdown + a tiny inline renderer (§11).

**Tags.** Lowercase except proper nouns; hyphenate multi-word (`slow-internet`). No creation step — typing a tag in any post's `tags:` auto-generates `/tags/<tag>/` on build. Tags currently come from **posts only**; media `tags` exist in the schema but are not yet surfaced on tag pages (deliberate gap).

**Drafts.** `draft: true` → hidden; `getAllPosts()` filters them out.

**Site text/config.** Small non-collection site copy lives in `src/site/`, not `src/content/`. `src/site/about.md` controls reusable identity/copy (`siteTitle`, `siteTitleHtml`, `siteSubtitle`, `siteDescription`, `rssDescription`, `authorName`, `authorShort`, `homeLocation`, `deskQuote`, `deskQuoteAuthor`), plus the About page text, `edition`, `lastRevised`, `lastmod`, and `siteUrl`. `src/site/home.md` controls the manual homepage cover via `coverPost`. `siteUrl` powers Astro's `site`, `/sitemap.xml`, and `/robots.txt`.

**Homepage curation.** `src/site/home.md` → `coverPost` = the single large lead/cover. Use the post filename slug without `.md` (for example `coverPost: "backpropagation-blame-assignment"`). If it is blank, the homepage falls back to the latest eligible essay/photo/walk. The "Latest, all kinds" side column is date-ordered and excludes the lead; essays/photos/walks are eligible by default, fragments/technical only via `showOnHome: true`.

**Slug.** Derived from filename — renaming a file changes the URL (no explicit `slug` field yet; §11).

---

## 7. Pages overview

- **`/`** — homepage: manual cover post from `src/site/home.md`, else latest essay/photo/walk + 4-item cross-kind side column + 3-col tier + conditional contact sheet (recent photo thumbnails) + "currently on the desk" strip + tag cloud.
- **`/archive/`** — full archive as a single `.toc` list. Client-side **kind filter** (All/Essays/Photographs/Walks/Fragments/Notes) and **numbered pagination, 10/page** (see §8). `?kind=essay|photo|…` preselects a filter.
- **`/posts/<slug>/`** — individual post; layout chosen by `type`. Photo/walk/fragment/essay posts include the photo-viewer lightbox (click an image to open full-size, with a download control).
- **`/desk/`** — media index, sectioned by kind, status-grouped within. Filter bar + custom sort dropdown (By status (default) / Recently updated / A→Z / Rating ▼ / Most revisited / Earliest first) + **per-status-group pagination** (see §8).
- **`/desk/<slug>/`** — media detail: cover, metadata, log timeline (if any), review body (if any).
- **`/tags/<tag>/`** — auto-generated, **paginated** (10/page) per-tag listing + lead entry + adjacent tags.
- **`/about/`** — about page. Layout lives in `src/pages/about.astro`; editable text/metadata lives in `src/site/about.md`.
- **`/404`** — soft "page not found" in the publication's voice.
- **`/feed.xml`** — RSS (drafts filtered, newest-first, HTML stripped from titles/excerpts, tags as `<category>`). Declares `/feed.xsl` so a human opening it in a browser sees a styled page; feed readers consume the raw XML. The styled view has a **pure-CSS day/night toggle** (hidden checkbox + `:has()`), because **scripts do not run in XSLT-transformed XML** — so no JS, no `localStorage`, no OS-preference detection; it defaults to day and the choice does not persist across reloads.
- **`/sitemap.xml`** — XML sitemap. Includes static pages, posts, desk entries, and tag pages. Uses `siteUrl` from `src/site/about.md` for absolute URLs. Declares `/sitemap.xsl` (via an `<?xml-stylesheet?>` PI in `sitemap.xml.js`) so a human opening it gets the same styled view + **pure-CSS day/night toggle** as the feed. The XSLT binds the `http://www.sitemaps.org/schemas/sitemap/0.9` namespace to an `s:` prefix — matching `<url>`/`<loc>`/`<lastmod>` without it silently yields an empty list. Crawlers ignore the stylesheet and read the raw XML.
- **`/robots.txt`** — crawler rules + sitemap URL. **Intentionally unstyled**: it is served as `text/plain` per the Robots Exclusion Protocol and crawlers do not render HTML/CSS/XSLT, so there is no day/night view — only `#` comments are possible, and even those are avoided to keep it clean.

---

## 8. Pagination (built — how it works)

All three listing surfaces use the **same client-side numbered pager**: Google-style controls `‹ 1 2 … N ›` with ellipsis windowing, **10 items per page**, no URL/page reload, no-JS-degrades-to-everything-visible. Shared styles: `.pager`, `.pager-btn`, `.pager-ellipsis` in `global.css`. Each page change smooth-scrolls back to the top of its list.

- **Archive** (`archive.astro`, inline script): one pager over the **filtered** row set. Changing the kind filter resets to page 1. Hidden rows use the existing `.archive-row.is-hidden` class.
- **Tags** (`tags/[tag].astro`, inline script): one pager over the entries list; only appears when the tag has more than 10 entries.
- **Desk** (`desk.astro`, inline script): pagination is attached **per status sub-group** (`.status-pager` after each `.media-grid`) — so "Books → Reading now" and "Books → Finished" page independently and the status categories stay separate. Page state is held in a `Map` keyed by the grid element. When the **Sort dropdown** is used, a kind collapses into one flat sorted list (all cards moved into the first grid, status labels hidden) and that single grid's pager drives the whole kind; switching back to "By status (default)" restores the per-status pagers. Empty status groups hide themselves.

> Design decision worth knowing: there is intentionally **no category-level (kind-level) pager** in the default grouped view, because a kind holds *status groups*, not a flat card list. A single kind-level pager only appears when sorting flattens the kind. (This was a deliberate answer to "respect Finished vs Up next.")

---

## 9. Design system

Defined in `src/styles/global.css`.

**Type:** Display = Instrument Serif · Body = Newsreader · Sans/UI = Geist · Mono = JetBrains Mono.

**Palettes (4):** `newsprint` (oxblood/warm — default) · `archive` (blue-grey/stone) · `tumblr` (terracotta/cream) · `mono` (black-on-bone). **Themes:** `day` / `night` (gallery charcoal + amber + grain). Toggled in the nav, persisted via `localStorage` (`pp-theme`, `pp-palette`); initial state set inline early to avoid FOUC.

**Grid:** 12-column `.editorial-grid`. Most page layouts use inline `grid-column: X / span Y`.
> **Pitfall (recurring source of mobile bugs):** inline `grid-column` items do **not** auto-collapse on mobile — each layout needs its own `@media (max-width: 720px)` override. Recently fixed instances: EssayLayout "Filed Under / Next" block and the PhotoLayout `.roll-note-grid` (both were squeezing into a narrow column on phones). When you add a new editorial-grid block, add the mobile rule too.

**Sticky footer:** `body` is a flex column, `min-height:100vh`, `body > main { flex:1 0 auto }`. **Every top-level page must wrap its content in `<main>`** or the footer pinning breaks.

**Photo-viewer lightbox** (Photographs / Walks / Fragments / Essays): the dialog is a **single shared component, `src/components/PhotoViewer.astro`**, rendered once at the end of `<main>` in each of those four layouts (no more duplicated markup — edit the component once). Clickable images are `<button class="photo-viewer-trigger" data-full-src/alt/caption/ix>`. `public/script.js` wires triggers → `showModal()`, fills the dialog img/figcaption, sets the download link, blurs the close button. Two pinned controls: **Close** (top-right) and **Download** (top-left). Download uses an `<a download>` pointing at `data-full-src`; for same-origin images (your local `/_astro/...` originals) it saves the full-size file, and the JS derives a clean `name.ext` filename (stripping the Astro hash). For cross-origin images (e.g. external/Unsplash covers) browsers ignore `download`, so the link falls back to opening the image in a new tab (`target="_blank"`). Soft fade-and-scale via `@starting-style` + `allow-discrete`; respects `prefers-reduced-motion` and safe-area insets; click-outside closes.

---

## 10. Mobile breakpoints

`900px` homepage lead+side collapse · `800px` most multi-column layouts collapse · `720px` masthead secondary blocks hide, nav → hamburger, padding tightens, editorial-grid blocks should collapse · `600px` desk poster/square grids → 2 cols · `420px` extra tightening.

---

## 11. Build / deploy

```bash
npm install
npm run dev       # http://localhost:4321 (hot reload)
npm run build     # → dist/
npm run preview   # serves dist/ (rebuild after each change)
```

Static output; deploy to any static host (Cloudflare Pages / Vercel / Netlify auto-build on push). Set `siteUrl` in `src/site/about.md` so canonical URLs, `/sitemap.xml`, and `/robots.txt` point at the real domain:

```yaml
siteUrl: "https://your-domain.example"
```

Convention: **no AI/Claude attribution in commits or PRs.**

---

## 12. Backlog

### Keystatic CMS integration (author-requested)
**Vision:** stop editing the codebase — open a web app on any device, write Markdown, hit save, content commits to git, site auto-deploys. Keystatic is Astro-native, file-backed, free, mobile-usable, and its schema mirrors the existing Zod collections.
Rough plan: install `@keystatic/core @keystatic/astro` (+ `@astrojs/react`), switch output to support the admin route, write `keystatic.config.ts` mapping each Zod field to a Keystatic field (`z.discriminatedUnion` → `fields.conditional` for media), add the `/keystatic` admin + API routes. Register custom rich-text blocks (Video, Gallery, Pullquote, Marginalia) so authoring inserts typed widgets, not raw tags. Migrating HTML-in-frontmatter to Markdown partially solves itself once the rich-text editor is in.

### Guest contributions ("Letters from Friends" — name TBD)
Friends send content; the author posts it under the friend's name. **This is still loosely defined** — the open question (§13) bundles three things that haven't been decided: what exactly counts as a guest contribution, what the section is called (Correspondences · Other postcards · Hand-delivered · Dispatches), and whether guest posts look visually distinct or identical to the author's. Sketch of an eventual implementation once the shape is decided: add an `author` object to the post schema (absent → Praise Prince; present → guest: `{name, bio, link?, photo?}`); a listing page under the chosen name; guest posts surfaced on the homepage with a "Letter from X" eyebrow; auto-collected via a tag.

### Smaller items — assessed (most are not real problems)
These were once listed as deferred work. On review, only the next/prev one was a genuine issue, and it's now done (see Recently completed). The rest are kept here with the reason they're *not* worth doing:

- **Slug stability (explicit `slug` field) — not planned.** Astro derives the slug from the filename, which is fine. A separate field only buys "rename without changing the URL," which in practice just means *don't rename published posts* — and it introduces a slug/filename drift failure mode. We renamed `temporary-test-roll` → `an-old-summer-roll` with no trouble. Skip it.
- **Surface media tags on `/tags/<tag>/` — optional feature, not a bug.** Tag pages are built from post tags only; media `tags` exist in the schema but don't appear there. Nothing is broken — it's a design choice. Only do it if you specifically want unified topic pages that merge essays with desk entries; otherwise keeping the publication and the desk separate is cleaner.
- **Strip HTML from frontmatter → Markdown — cosmetic, low priority.** Titles/excerpts/captions allow `<em>`/`<strong>` via `set:html`. It is the author's own content (no user input → no security angle) and it works. The migration is real effort for a tidiness gain, and a future CMS can keep emitting the same HTML, so it blocks nothing.

### Recently completed (no longer backlog)
- **Pagination** — numbered, 10/page, on Archive (filtered), Desk (per status group, with sort-flatten → one pager per kind), and Tag pages. Shared `.pager` styles. Replaced an earlier "Show more" approach. (See §8.)
- **Media cover lazy-loading** — `loading="lazy" decoding="async"` on all `MediaCard` images.
- **Mobile grid fixes** — EssayLayout "Filed Under / Next" and PhotoLayout roll-note now collapse to one column under 720px (were squeezed on phones).
- **Schema cleanup** — per-post `featured`/`featuredOrder` removed; `showOnHome` added; homepage cover moved to `src/site/home.md`.
- **Auto-derived "Next" links** — the per-post Next link is now computed from date order in `src/pages/posts/[...slug].astro` (the older neighbour; injected into the entry the layouts already read) instead of hand-written `nextHref`/`nextLabel`. Removes the cross-reference bookkeeping that broke on slug renames and drifted out of date. Essay/Walk/Fragment/Technical render it; Photo has no Next block by design.
- **Custom sort dropdown on /desk/** — replaced the native `<select>` with a styled button + popover (keyboard accessible; oxblood dot on the selected option).
- **RSS feed + pretty XSL** — `/feed.xml` via `@astrojs/rss`, with a standalone `public/feed.xsl` for human viewing. Linked from `<head>`, the About page, and the colophon (`Colophon.astro` is the source of truth for that footer link). The colophon footer now reads **Feed · Sitemap · About →** (the `/sitemap.xml` link goes to the styled XSL view).
- **Sitemap** — `/sitemap.xml` custom endpoint plus `/robots.txt` endpoint. Both use `siteUrl` from `src/site/about.md`. `/sitemap.xml` has a styled `public/sitemap.xsl` view with the same pure-CSS day/night toggle as the feed; `/robots.txt` stays plain text (cannot be styled).
- **Feed + sitemap day/night toggle** — both XSL views carry a pure-CSS theme toggle (hidden checkbox + `:has()`), since scripts don't run in XSLT-transformed XML. Default day, no persistence.
- **Photo image optimization** — local photo source files live in `src/assets/images`; `photoImages.ts` generates responsive display images and full-size lightbox URLs from the same `/images/...` markdown path.
- **Photo-viewer lightbox**, **sticky footer**, **PNG favicons + apple-touch-icon**, **archive List/Grid toggle removed**, **404 page** — all shipped.

---

## 13. Open questions for the author

Only one remains open (gallery and homepage-cover strategy are both resolved — no gallery is planned, and the manual `src/site/home.md` cover model is settled):

1. **Guest contributions** — the whole shape is undecided: what exactly counts as a guest contribution, what the section is named (Correspondences · Other postcards · Hand-delivered · Dispatches), and whether guest posts get a distinct visual treatment or look identical to the author's. Treat these as one decision (see §12).

---

## 14. Conventions / quirks (do not break these)

- Byline/signature comes from `authorShort` in `src/site/about.md` (currently "Praise").
- Masthead nameplate comes from `siteTitleHtml` in `src/site/about.md` (currently italic on "Postcards").
- Page `<title>` strips HTML automatically (helper in `BaseLayout.astro`).
- Theme/palette persisted in `localStorage` (`pp-theme`, `pp-palette`).
- No analytics, no email capture, no newsletter — by design.
- Every top-level page must wrap content in `<main>` (sticky-footer selector is `body > main`).
- The photo-viewer lightbox is the single shared component `src/components/PhotoViewer.astro` (Photo/Walk/Fragment/Essay layouts render it). Edit it once; the triggers (`.photo-viewer-trigger`) still live per-layout on each figure.
- Inline `grid-column` blocks need explicit mobile media queries (§9 pitfall).

---

## 15. Quick start

```bash
npm install && npm run dev   # http://localhost:4321
```

- **New post:** drop a `.md` into `src/content/posts/`, fill the typed frontmatter. Build picks it up.
- **New media entry:** drop a `.md` into `src/content/media/`; `kind:` determines required fields.
- **New tag:** just write it in a post's `tags:` — its page auto-generates.
- **Design work:** `src/styles/global.css` for tokens; individual layouts/pages for per-route styling.
- **Adding photos:** put local originals in `src/assets/images/` (or `src/assets/images/<roll>/` for a multi-image post), then reference them in a structured field as `/images/<file>.jpg` (or `/images/<roll>/<file>.jpg`) so `photoImages.ts` optimizes them. For an image inside prose, use a relative path instead: `![](../../assets/images/<file>.jpg)` (see §5).
