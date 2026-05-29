import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

type ImageModule = { default: ImageMetadata };
type ImageAttrs = {
  src: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async';
};

type PhotoImage = {
  attrs: ImageAttrs;
  fullSrc: string;
  optimized: boolean;
};

type PhotoOptions = {
  widths?: number[];
  sizes?: string;
  loading?: 'lazy' | 'eager';
};

// Recursive so per-roll subfolders work: src/assets/images/<roll>/<file>.jpg
// is referenced in content as /images/<roll>/<file>.jpg (the token mirrors the
// real folder under src/assets/). Other asset types (video/, audio/, …) live
// alongside images/ under src/assets/ and are handled by their own components.
const localImageModules = import.meta.glob<ImageModule>('../assets/images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

const ASSET_ROOT = 'assets/images/';
const localImages = new Map<string, ImageMetadata>();

for (const [path, mod] of Object.entries(localImageModules)) {
  const idx = path.indexOf(ASSET_ROOT);
  if (idx === -1) continue;
  const rel = path.slice(idx + ASSET_ROOT.length); // e.g. "cat.jpg" or "waterloo/cat.jpg"
  const image = mod.default;
  localImages.set(`/images/${rel}`, image);
  localImages.set(`images/${rel}`, image);
}

function uniqueSortedWidths(widths: number[], maxWidth: number) {
  return [...new Set(widths.filter(width => width <= maxWidth))]
    .sort((a, b) => a - b);
}

export async function getPhotoImage(src = '', options: PhotoOptions = {}): Promise<PhotoImage> {
  const image = localImages.get(src);
  const loading = options.loading ?? 'lazy';

  if (!image) {
    return {
      attrs: {
        src,
        loading,
        decoding: 'async',
      },
      fullSrc: src,
      optimized: false,
    };
  }

  const widths = uniqueSortedWidths(
    options.widths ?? [480, 720, 960, 1280, 1600],
    image.width,
  );
  const display = await getImage({
    src: image,
    widths: widths.length > 0 ? widths : [image.width],
    format: 'webp',
    quality: 'high',
  });

  return {
    attrs: {
      src: display.src,
      srcset: display.srcSet.attribute,
      sizes: options.sizes ?? '(max-width: 720px) 100vw, 80vw',
      width: display.attributes.width,
      height: display.attributes.height,
      loading,
      decoding: 'async',
    },
    fullSrc: image.src,
    optimized: true,
  };
}
