# Postcards from Far Away — Handoff Document

> A field journal of one person's intellectual life. Personal editorial site by Praise Prince.

This document exists so any new contributor (human or agent) can pick the project up with full context. Read it first. It is meant to reflect the **actual current state** of the codebase, not the original plan — when you change something structural, update this file.

_Last updated: 2026-05-28._

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
| Client JS | One hand-written `public/script.js` + small per-page inline scripts |
| Hosting target | Any static host (site URL is `https://praiseprince.com`) |

**Dependencies are intentionally tiny** — `package.json` has exactly two: `astro` and `@astrojs/rss`. No React, no UI library, no CMS installed yet. Build → static HTML/CSS/JS → upload.

---

## 3. Project structure

```
/
├── astro.config.mjs          site URL, static output, Shiki, tunnel allowlist
├── package.json              deps: astro, @astrojs/rss only
├── tsconfig.json
├── HANDOFF.md                ← you are here
├── public/
│   ├── script.js             theme/palette toggle, masthead date, reading progress, photo-viewer lightbox
│   ├── feed.xsl              standalone XSLT stylesheet that prettifies /feed.xml for humans
│   ├── favicon-32.png  favicon-192.png  favicon-512.png  apple-touch-icon.png
│   └── images/
│       └── blog-add/         ← real photo JPEGs, served verbatim (see §5 Images — UNOPTIMIZED)
├── src/
│   ├── content.config.ts     Zod schemas for `posts` + `media` collections
│   ├── styles/global.css     the whole design system (palettes, type, layout, pager, photo-viewer)
│   ├── content/
│   │   ├── posts/            ~505 .md files (essay/photo/walk/fragment/technical)
│   │   └── media/            ~400 .md files (book/film/show/album/track)
│   ├── lib/
│   │   ├── posts.ts          getAllPosts, getFeaturedPosts, postUrl, kindLabel, shortDate, getAllTags
│   │   └── media.ts          getAllMedia, mediaUrl, SECTION_LABEL, STATUS_LABEL, KIND_ORDER, sort helpers
│   ├── components/
│   │   ├── Masthead.astro    Colophon.astro    SiteNav.astro
│   │   ├── Tag.astro         Figure.astro      Video.astro
│   │   └── MediaCard.astro   per-kind card for /desk/ (covers lazy-loaded)
│   ├── layouts/
│   │   ├── BaseLayout.astro  shared chrome (head/masthead/nav/slot/colophon)
│   │   ├── EssayLayout.astro       PhotoLayout.astro*     WalkLayout.astro*
│   │   ├── FragmentLayout.astro*   TechnicalLayout.astro
│   │   └── (* = includes the photo-viewer <dialog> lightbox)
│   └── pages/
│       ├── index.astro              homepage (lead + side + tier + contact + desk strip + tags)
│       ├── archive.astro            filterable + paginated archive
│       ├── desk.astro               media index (per-kind, status-grouped, filter + sort + paginated)
│       ├── desk/[slug].astro        per-media detail (cover, meta, log, review body)
│       ├── posts/[...slug].astro    dispatches to the right post layout by `type`
│       ├── tags/[tag].astro         auto-generated, paginated per-tag pages
│       ├── about.astro   404.astro
│       └── feed.xml.js              RSS feed
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
featured: boolean            # the SINGLE homepage lead. At most one (build throws otherwise).
showOnHome: boolean          # opt a fragment/technical note into the homepage latest lists
draft: boolean               # true → excluded from build
cover: figure                # {src, alt, caption, ix, aspect, fit, position, colspan, colstart}
nextLabel, nextHref: string  # manual "next entry" link at the bottom of a post
```

> **Schema note (changed):** the old `featuredOrder` field is gone. Curation is now: one `featured: true` lead, plus optional `showOnHome: true` opt-ins. Everything else is date-ordered.

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

**1. Photo post images — LOCAL and UNOPTIMIZED.**
- Files live in `public/images/blog-add/`, referenced from content as `/images/blog-add/<file>.jpg`.
- They are **raw camera JPEGs**: individual files run **3–11 MB** (~36 MB for the current six). Because they sit in `public/`, Astro copies them byte-for-byte into `dist/` — **no resizing, no WebP/AVIF, no responsive `srcset`**.
- This is the project's biggest performance liability today. A single photo roll can push 20–30 MB to a phone. See **Backlog §11 → Image optimization (high priority)** for the fix (move into `src/`, use the `image()` schema helper + `<Image>`/`getImage`).
- `MediaCard` images use `loading="lazy" decoding="async"`, but the large photo *figures* in `PhotoLayout`/`WalkLayout`/`FragmentLayout` do **not** — and lazy loading only defers bytes, it does not shrink them.

**2. Media covers — EXTERNAL CDN URLs.**
- `cover:` on media entries points to remote CDNs: `image.tmdb.org` (films/shows), `is1-ssl.mzstatic.com` (Apple, albums), `covers.openlibrary.org` (books), `i.scdn.co` (Spotify). Books mostly render a typographic spine instead of a cover image.
- These are fine to leave external; they're already CDN-served and the desk lazy-loads them.

---

## 6. Authoring conventions

**HTML inside frontmatter strings (known wart).** Titles, excerpts, captions, notes allow `<em>`, `<strong>`, `<br/>`, `<a>` — rendered via `set:html`. Acceptable as-is; flagged for eventual migration to Markdown + a tiny inline renderer (§11).

**Tags.** Lowercase except proper nouns; hyphenate multi-word (`slow-internet`). No creation step — typing a tag in any post's `tags:` auto-generates `/tags/<tag>/` on build. Tags currently come from **posts only**; media `tags` exist in the schema but are not yet surfaced on tag pages (deliberate gap).

**Drafts.** `draft: true` → hidden; `getAllPosts()` filters them out.

**Homepage curation.** `featured: true` = the single large lead/cover. If two posts set it, the homepage build **throws** (a content conflict, not an ordering issue). The "Latest, all kinds" side column is date-ordered and excludes the lead; essays/photos/walks are eligible by default, fragments/technical only via `showOnHome: true`.

**Slug.** Derived from filename — renaming a file changes the URL (no explicit `slug` field yet; §11).

---

## 7. Pages overview

- **`/`** — homepage: lead (the `featured` post, else latest essay/photo/walk) + 4-item cross-kind side column + 3-col tier + conditional contact sheet (recent photo thumbnails) + "currently on the desk" strip + tag cloud.
- **`/archive/`** — full archive as a single `.toc` list. Client-side **kind filter** (All/Essays/Photographs/Walks/Fragments/Notes) and **numbered pagination, 10/page** (see §8). `?kind=essay|photo|…` preselects a filter.
- **`/posts/<slug>/`** — individual post; layout chosen by `type`. Photo/walk/fragment posts include the photo-viewer lightbox.
- **`/desk/`** — media index, sectioned by kind, status-grouped within. Filter bar + custom sort dropdown (By status (default) / Recently updated / A→Z / Rating ▼ / Most revisited / Earliest first) + **per-status-group pagination** (see §8).
- **`/desk/<slug>/`** — media detail: cover, metadata, log timeline (if any), review body (if any).
- **`/tags/<tag>/`** — auto-generated, **paginated** (10/page) per-tag listing + featured entry + adjacent tags.
- **`/about/`** — colophon (bio, typography, ethos, equipment, contact, RSS).
- **`/404`** — soft "page not found" in the publication's voice.
- **`/feed.xml`** — RSS (drafts filtered, newest-first, HTML stripped from titles/excerpts, tags as `<category>`). Declares `/feed.xsl` so a human opening it in a browser sees a styled page; feed readers consume the raw XML.

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

**Photo-viewer lightbox** (Photographs / Walks / Fragments only): each of those three layouts renders one `<dialog class="photo-viewer">` at the end of `<main>`; clickable images are `<button class="photo-viewer-trigger" data-full-src/alt/caption/ix>`. `public/script.js` wires triggers → `showModal()`, fills the dialog img/figcaption, blurs the close button. Soft fade-and-scale via `@starting-style` + `allow-discrete`; editorial close control; respects `prefers-reduced-motion` and safe-area insets; click-outside closes. **The dialog markup is duplicated in all three layouts — change all three together** (styles/JS are shared).

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

Static output; deploy to any static host (Cloudflare Pages / Vercel / Netlify auto-build on push). Current build: **931 pages**, `dist/` ≈ **49 MB — of which ~40 MB is unoptimized images** (see §5 and the backlog). Convention: **no AI/Claude attribution in commits or PRs.**

---

## 12. Backlog

### ⚠️ Image co-location + optimization — HIGH PRIORITY (real problem now)
Real photos exist and they're heavy (§5): multi-MB raw JPEGs in `public/`, copied verbatim, ~40 MB of the 49 MB build. Fix:
- Move photo files out of `public/` into `src/` (e.g. `src/assets/` or co-located under the post).
- Change the `figure` schema's `src` to Astro's `image()` helper and render via `<Image>` / `getImage()` so you get automatic resize, WebP/AVIF, and responsive `srcset`.
- Add `loading="lazy"` to the large photo figures in PhotoLayout/WalkLayout/FragmentLayout while you're there.
- Leave external media covers (tmdb/openlibrary/Apple/Spotify) as-is.
This is the single highest-impact change available.

### Keystatic CMS integration (author-requested)
**Vision:** stop editing the codebase — open a web app on any device, write Markdown, hit save, content commits to git, site auto-deploys. Keystatic is Astro-native, file-backed, free, mobile-usable, and its schema mirrors the existing Zod collections.
Rough plan: install `@keystatic/core @keystatic/astro` (+ `@astrojs/react`), switch output to support the admin route, write `keystatic.config.ts` mapping each Zod field to a Keystatic field (`z.discriminatedUnion` → `fields.conditional` for media), add the `/keystatic` admin + API routes. Register custom rich-text blocks (Video, Gallery, Pullquote, Marginalia) so authoring inserts typed widgets, not raw tags. Migrating HTML-in-frontmatter to Markdown partially solves itself once the rich-text editor is in.

### Guest contributions ("Letters from Friends" — name TBD)
Friends send content; the author posts it under the friend's name. **This is still loosely defined** — the open question (§13) bundles three things that haven't been decided: what exactly counts as a guest contribution, what the section is called (Correspondences · Other postcards · Hand-delivered · Dispatches), and whether guest posts look visually distinct or identical to the author's. Sketch of an eventual implementation once the shape is decided: add an `author` object to the post schema (absent → Praise Prince; present → guest: `{name, bio, link?, photo?}`); a listing page under the chosen name; guest posts surfaced on the homepage with a "Letter from X" eyebrow; auto-collected via a tag.

### Smaller deferred items
- Slug stability (explicit `slug` field separate from filename)
- Auto-derive next/previous post from date order (remove manual `nextHref`/`nextLabel`)
- Surface media tags on `/tags/<tag>/` pages
- Sitemap
- Strip HTML from frontmatter → Markdown + inline renderer

### Recently completed (no longer backlog)
- **Pagination** — numbered, 10/page, on Archive (filtered), Desk (per status group, with sort-flatten → one pager per kind), and Tag pages. Shared `.pager` styles. Replaced an earlier "Show more" approach. (See §8.)
- **Media cover lazy-loading** — `loading="lazy" decoding="async"` on all `MediaCard` images.
- **Mobile grid fixes** — EssayLayout "Filed Under / Next" and PhotoLayout roll-note now collapse to one column under 720px (were squeezed on phones).
- **Schema cleanup** — `featuredOrder` removed; `showOnHome` added; homepage throws on more than one `featured: true`.
- **Custom sort dropdown on /desk/** — replaced the native `<select>` with a styled button + popover (keyboard accessible; oxblood dot on the selected option).
- **RSS feed + pretty XSL** — `/feed.xml` via `@astrojs/rss`, with a standalone `public/feed.xsl` for human viewing. Linked from `<head>`, the About page, and the colophon (`Colophon.astro` is the source of truth for that footer link).
- **Photo-viewer lightbox**, **sticky footer**, **PNG favicons + apple-touch-icon**, **archive List/Grid toggle removed**, **404 page** — all shipped.

---

## 13. Open questions for the author

Only two remain open (gallery and homepage-featured-image strategy are both resolved — no gallery is planned, and the featured/lead model is settled):

1. **Guest contributions** — the whole shape is undecided: what exactly counts as a guest contribution, what the section is named (Correspondences · Other postcards · Hand-delivered · Dispatches), and whether guest posts get a distinct visual treatment or look identical to the author's. Treat these as one decision (see §12).
2. **Image handling timeline** — start co-locating + optimizing photos now (§5/§12), or wait until Keystatic is wired so its upload widget handles file placement? The performance cost of waiting is real (multi-MB images shipping today), so this leans toward "do it now," but it's the author's call.

---

## 14. Conventions / quirks (do not break these)

- Byline is "Praise Prince" / "P.P." — keep even when renaming masthead/title strings.
- Masthead nameplate: "Postcards from Far Away" (italic on "Postcards").
- Page `<title>` strips HTML automatically (helper in `BaseLayout.astro`).
- Theme/palette persisted in `localStorage` (`pp-theme`, `pp-palette`).
- No analytics, no email capture, no newsletter — by design.
- Every top-level page must wrap content in `<main>` (sticky-footer selector is `body > main`).
- The photo-viewer `<dialog>` is duplicated in three layouts — edit all three.
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
- **Adding photos:** read §5 first — do not drop multi-MB JPEGs into `public/` without reading the optimization note.
