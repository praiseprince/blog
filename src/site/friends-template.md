---
title: "How to Send Me a <em>Friend Post</em>"
type: essay
date: 2026-01-01
author: "Praise"
authorLink: "/about/"
eyebrow: "Friends · the template"
excerpt: "Everything a friend needs to send me so a post shows up here, formatted the same way as the rest of the site."
lede: "This is the only post in the friends section written by me. It is the instruction sheet. If you are a friend who wants to publish something here, this explains exactly what to send."
tags: [friends, how-to, template]
---

This room runs on plain Markdown files with a small block of frontmatter at the top. You do not need to know how the site is built. You write the words, pick a type, and send me the file plus any images. I place everything in the right folder and make sure your images are sized and optimized like every other photo on the site.

Here is the whole arrangement, start to finish.

## What to send

1. **One Markdown file** (a `.md` file) with the frontmatter block filled in.
2. **Any image files** referenced in that frontmatter, sent alongside it. Do not worry about resizing or compressing — send the originals. I will place them and the site will optimize them automatically, with the same lightbox and download behaviour as the rest of the photographs.
3. Your **name** exactly as you want it shown. It appears as `By <your name>` and is also how your entries get grouped on the friends page, so keep it consistent between posts.

## The frontmatter every post needs

Every post, regardless of type, starts with this:

```yaml
---
title: "Your Title, with <em>italics</em> if you like"
type: essay        # essay | photo | walk | fragment | technical
date: 2026-05-01   # YYYY-MM-DD
author: "Your Name"
authorLink: "https://your-site.example"   # optional
authorBio: "One line about you."          # optional
excerpt: "One or two sentences shown in listings and the feed."
tags: [a, few, words]
---
```

`title`, `type`, `date`, and `author` are required. Everything else is optional. Do **not** set `order` — that is reserved for this template, which always stays first.

Below the closing `---`, write your post body in normal Markdown. For an **essay** or a **technical** note, that body is the whole piece:

```markdown
---
title: "On Quiet Mornings"
type: essay
date: 2026-05-01
author: "Cyril"
excerpt: "A short essay about mornings."
tags: [mornings, slowness]
---

The first paragraph goes here. Write in plain Markdown.

## A heading

More paragraphs. Links like [this](https://example.com) work fine.
```

## Photo posts

For a **photo** post, the images live in the frontmatter as a `gallery`, and the body can be left empty. Send me the image files named however you like; I will fix the paths.

```yaml
---
title: "An Afternoon Roll"
type: photo
date: 2026-05-01
author: "Cyril"
excerpt: "A few frames from a slow afternoon."
roll: "02"
camera: "Yashica T4"
tags: [photographs, film]
cover:
  src: "/images/your-cover.jpg"
  alt: "Describe the photo for screen readers."
  caption: "A caption that says what the photo is."
  ix: "00"
gallery:
  - src: "/images/frame-one.jpg"
    alt: "Alt text."
    caption: "What is happening in the frame."
    ix: "01"
    aspect: "3/2"
    colspan: 6
    colstart: 1
  - src: "/images/frame-two.jpg"
    alt: "Alt text."
    caption: "Another caption."
    ix: "02"
    aspect: "3/2"
    colspan: 6
    colstart: 7
rollNote: "An optional closing note about the roll."
---
```

`colspan` is out of 12, and `colstart` is where the image begins on that 12-column grid. If you are unsure, give every image `colspan: 12` and they will simply stack full-width. Each caption is real text that shows under the photo and inside the full-size viewer.

## Walk posts

A **walk** is a timeline of moments. Each entry has a time, a kind, and some words or an image:

```yaml
---
title: "Down to the River"
type: walk
date: 2026-05-01
author: "Mara"
excerpt: "A short walk, written as it happened."
walkMeta:
  start: "16:00"
  end: "17:30"
  distance: "5 km"
  route: "Home -> river -> back"
tags: [walks]
timeline:
  - time: "16:00"
    kind: prose
    heading: "Setting out"
    body: "What I noticed as I left."
    image: "/images/a-photo.jpg"
    aspect: "4/5"
    caption: "A caption for the photo."
    ix: "01"
  - time: "16:40"
    kind: quote
    body: "A line worth keeping."
coda: "An optional closing italic line."
---
```

## Fragments

A **fragment** post is a set of small numbered items — quotes, notes, a photo, a short thought:

```yaml
---
title: "Small Things, May"
type: fragment
date: 2026-05-01
author: "Cyril"
fragmentNumber: "01"
excerpt: "A handful of small notes."
tags: [fragments]
items:
  - number: "01"
    kind: prose
    colspan: 6
    content: "A short observation."
  - number: "02"
    kind: quote
    colspan: 6
    tone: card
    content: "\"A quote in quotation marks.\""
    caption: "Who said it, and why it stuck."
  - number: "03"
    kind: photo
    colspan: 6
    image: "/images/a-photo.jpg"
    aspect: "3/2"
    caption: "A caption for the photo."
---
```

## Technical notes

A **technical** note is for something closer to engineering or maths. It uses the same essay-style body, plus optional `marginalia` in the side column. Fenced code blocks render with syntax styling:

````markdown
---
title: "A Note on Hashing"
type: technical
date: 2026-05-01
author: "Mara"
excerpt: "A short note."
techMeta:
  readTime: "~ 4 min read"
tags: [notes]
marginalia:
  - kind: note
    body: "A small aside that sits in the margin."
---

The body of the note. You can include code:

```python
def example():
    return 42
```
````

## That is the whole thing

Pick a type, fill in the frontmatter, write the body, and send it to me with any images. I will do the placing and the optimizing. Your name carries the byline, and your entries gather together on the friends page under your name.
