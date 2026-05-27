---
title: "A small note on <em>Verlet</em> integration<br/>(and why we keep choosing it)"
type: technical
date: 2025-11-04
eyebrow: "Notes · Computer science · Curiosity №34"
excerpt: "Most game engines do not simulate <em>velocities.</em> They simulate <em>positions, twice.</em> The trick is older than you would expect."
lede: "Most game engines do not simulate <em>velocities.</em> They simulate <em>positions, twice.</em> The trick is older than you would expect — eighteenth-century, give or take — and it is, in its way, a small philosophical statement."
techMeta:
  stamp: "Filed · Eng."
  readTime: "~ 6 min read"
  lang: "Code: JS, ~40 lines"
  lastEdit: "today"
tags: [simulation, numerical-methods, physics, engineering]
marginalia:
  - kind: note
    body: "Loup Verlet, the physicist this is named after, was simulating argon gas in 1967. The trick had already appeared, more obliquely, in Newton's <em>Principia</em>."
  - kind: math
    math: "<em>x</em><sub>n+1</sub> = 2<em>x</em><sub>n</sub> − <em>x</em><sub>n−1</sub> + <em>a</em>·Δt²"
    mathLabel: "position Verlet"
  - kind: variants
    label: "Variants"
    body: "Stör&shy;mer–Verlet, velocity-Verlet, leap-frog. They are all the same idea worn in different hats."
  - kind: figure
    image: "https://picsum.photos/seed/verlet/600/600?grayscale"
    ix: "FIG. 01"
    caption: "A double pendulum, simulated with velocity-Verlet at Δt = 1/60s. It does not fall apart."
nextLabel: "Companion essay → On the habit of looking twice"
nextHref: "/posts/on-looking-twice/"
---

The naive way to move a thing is the way most of us first learn:

```js
// Euler integration — honest, but lossy.
for (let i = 0; i < steps; i++) {
  vel.x += acc.x * dt;
  vel.y += acc.y * dt;
  pos.x += vel.x * dt;
  pos.y += vel.y * dt;
}
```

This is Euler's method, named for someone who would have had stronger words for what we have done with it. It is fine for slow systems. For fast ones, energy leaks out of it on every tick, like a balloon with a slow puncture, and after a hundred frames your pendulum has either died down or — depending on the sign of the error — flown away.

## The Verlet trick

Verlet integration starts somewhere unusual: it does not store the velocity at all. It only remembers *where the particle was last frame*, and uses that to imply the velocity.

```js
// Position Verlet.
const next = {
  x: 2 * pos.x - prev.x + acc.x * dt * dt,
  y: 2 * pos.y - prev.y + acc.y * dt * dt,
};
prev = pos;
pos  = next;
```

That is the whole thing. Two multiplications, one subtraction, no separate state for velocity. And it is *time-symmetric*: run it backwards from any frame and you get the previous frame — which is the property that makes it stable.

I find this beautiful. We tend to think of motion as a primary quantity and position as a consequence. Verlet quietly inverts the relationship: position is what we measure; velocity is what we infer. It is closer to what a photograph actually does. Two stills, a known interval, and the motion is implicit.

## Why this keeps coming back

The same scheme — under different names — runs cloth simulations, soft-body physics, most molecular dynamics, the constraint solvers in your favourite ragdoll, and, famously, the rope in *Hitman: Codename 47*. The reason is not speed (it is fast, but Euler is faster). The reason is that the wrong answer it gives *looks like* the right answer for much longer. Stability over accuracy, in a discipline that pretends to want the opposite.

There is, I think, a general lesson in there for engineering: the methods that survive are the ones whose *failure mode* is benign. Code that breaks gracefully will be used long after code that, when it works, is faster.
