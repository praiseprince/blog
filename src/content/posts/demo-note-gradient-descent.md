---
title: "Demo Note: <em>Gradient Descent</em>"
type: technical
date: 2024-05-01
demo: true
showOnHome: true
eyebrow: "Demo · note"
location: "Demo mode"
readTime: "4 min"
wordCount: 720
excerpt: "A compact technical note for checking code, math-like prose, and the technical layout."
lede: "A demo note for testing structured technical metadata."
techMeta:
  readTime: "4 min"
  lang: "ML"
  lastEdit: "May 1, 2024"
  stamp: "DEMO"
tags: [demo, notes, machine-learning]
marginalia:
  - kind: note
    body: "Demo marginal note. This should appear in the technical side rail."
---

Gradient descent is the idea that if a function gives you a slope, you can step against that slope to make the function smaller.

```js
let x = 10;
for (let i = 0; i < 20; i++) {
  const gradient = 2 * x;
  x = x - 0.1 * gradient;
}
```

This file is only here for demo mode. It gives the technical layout a realistic body, code block, metadata, and marginalia without pretending to be final writing.
