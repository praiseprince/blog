---
title: "Backpropagation as <em>Blame Assignment</em>"
type: technical
date: 2026-05-18
eyebrow: "Notes · machine learning"
excerpt: "A practical note on backpropagation: forward pass, loss, gradients, and why the chain rule is doing most of the work."
lede: "Backpropagation is how a neural network works backward from an error and decides which weights deserve adjustment."
techMeta:
  stamp: "Filed · ML"
  readTime: "~ 7 min read"
  lang: "Python-ish pseudocode"
  lastEdit: "May 18, 2026"
tags: [machine-learning, neural-networks, notes]
marginalia:
  - kind: note
    body: "The concept feels bigger than it is. Most of the mystery is just careful bookkeeping plus the chain rule."
  - kind: math
    math: "w = w - &eta; &middot; &part;L / &part;w"
    mathLabel: "gradient descent update"
  - kind: variants
    label: "Useful words"
    body: "Forward pass, loss, gradient, chain rule, learning rate, optimizer."
---

Backpropagation is the method neural networks use to learn from mistakes. The network makes a prediction, compares it with the correct answer, and then works backward to decide how each weight contributed to the error.

That is the whole idea in plain language: make a guess, measure the error, assign blame, update the numbers.

## Forward pass

The forward pass is just the model doing what it currently knows how to do.

```js
const hidden = relu(x * w1 + b1);
const prediction = hidden * w2 + b2;
const loss = mse(prediction, target);
```

At this point the model has a loss value. It knows the prediction was wrong by some amount. What it does not know yet is which weights should move, in what direction, and by how much.

## Gradients

A gradient tells us how the loss changes when a parameter changes. If increasing a weight increases the loss, that weight should probably go down. If increasing a weight decreases the loss, that weight should probably go up.

The update looks like this:

```js
weight = weight - learningRate * gradient;
```

The learning rate controls the size of the step. Too small and learning takes forever. Too large and the model can overshoot the useful direction.

## Why the chain rule appears

A weight usually does not touch the loss directly. It affects a neuron, which affects another layer, which affects the prediction, which affects the loss.

Backpropagation uses the chain rule to connect those dependencies.

```txt
loss -> prediction -> hidden layer -> weight
```

The algorithm starts at the loss because that is what we can measure. Then it moves backward through the graph, multiplying the local effects together.

## What gets stored

During the forward pass, the model stores intermediate values it will need later. This can include activations, inputs to activation functions, and masks. Training takes more memory than inference because the model needs the answer and the path it took to get there.

Inference can throw the trail away. Training needs the trail.

## The student version

I like thinking about it like a group project. If the final grade is bad, it would be useless to rewrite every section equally. You want to know which part caused the biggest problem. Maybe the introduction was fine, the data section was weak, and the formatting lost a few easy marks.

Backpropagation is doing that kind of blame assignment, except the sections are weights and the feedback is a gradient.

The important thing is not that the model understands what it is doing. It does not. The important thing is that the loss gives a signal, and the chain rule lets that signal reach the parameters that created it.
