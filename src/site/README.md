# Site Editing

This folder is for small site-level text that is not part of the public post or desk collections.

- `about.md` controls the site identity (`siteTitle`, `siteSubtitle`, `authorName`, `authorShort`, `homeLocation`), the public URL (`siteUrl`), the desk quote, the About page copy, contact links, portrait metadata, and the About page `lastmod` value used by the sitemap.
- `home.md` controls the manual homepage cover post. The latest lists stay date-based.

## Images / assets — the contract

**Asset root is `src/assets/`.** Images are one type under it; other asset kinds (self-hosted `video/`, `audio/`, `docs/`, …) get their own siblings under `src/assets/`. Image files live in **`src/assets/images/`**.

The intended workflow — and the format any upload/CMS tooling should target — is: **every local image a post uses is declared in a frontmatter field, never typed into body prose.** Two steps per image:

1. **Store the file** at `src/assets/images/<name>.<ext>`, or grouped: `src/assets/images/<group>/<name>.<ext>`. Allowed `<ext>`: `jpg`, `jpeg`, `png`, `webp`.
2. **Reference it** in a frontmatter image field as `/images/<name>.<ext>` (or `/images/<group>/<name>.<ext>`). The part after `/images/` must exactly mirror the file's path **under `src/assets/images/`**.

Frontmatter image fields that are resolved (by `src/lib/photoImages.ts`):

| Post type | Field(s) |
|---|---|
| any | `cover.src` |
| photo | `gallery[].src` |
| walk | `timeline[].image` |
| fragment | `items[].image` |
| technical | `marginalia[].image` |

**One source file → two outputs, automatically:** small responsive WebP variants for page display, plus the **original file served as-is — full resolution, not optimized** (emitted to `/_astro/<name>.<hash>.<ext>`), used as the click-to-view / download target. So the page stays light, but clicking a photo opens the full, unoptimized original. You never keep a second copy.

**Why the `/images/...` token (not a relative path):** it is location-independent, so tooling can emit it without knowing the post file's depth. It is the recommended form for both hand-authoring and generated content. A relative path (`![](../../assets/images/<file>)`) only works as a fallback for an image written directly in body prose — which this convention avoids, because the `/images/...` token is **not** rewritten inside body text and would 404 there.
