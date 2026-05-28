---
title: "Backpropagation, explained without pretending it is magic"
type: technical
date: 2026-05-16
eyebrow: "Notes · machine learning"
excerpt: "A student-level explanation of what backpropagation is doing, why gradients matter, and why the chain rule keeps showing up."
lede: "Backpropagation is the method neural networks use to figure out which weights were responsible for an error."
techMeta:
  stamp: "Filed · ML"
  readTime: "~ 8 min read"
  lang: "Python-ish pseudocode"
  lastEdit: "May 16, 2026"
tags: [machine-learning, neural-networks, math, notes]
marginalia:
  - kind: note
    body: "The hard part is not the code. The hard part is trusting that the chain rule is enough to update millions of small numbers."
  - kind: math
    math: "w = w - &eta; &middot; &part;L / &part;w"
    mathLabel: "gradient descent update"
  - kind: variants
    label: "Words to know"
    body: "Forward pass, loss, gradient, chain rule, learning rate, optimizer."
nextLabel: "Next - Montreal photo roll"
nextHref: "/posts/montreal-weekend-photos/"
---

Backpropagation is one of those topics that gets introduced with a lot of diagrams and still somehow feels vague. The shortest explanation I can give is this: a neural network makes a prediction, measures how wrong it was, and then works backward to figure out how each weight contributed to the mistake.

The "working backward" part is backpropagation.

## The forward pass

First the network does the normal thing: input goes in, numbers move through layers, and an output comes out.

```js
const hidden = relu(x * w1 + b1);
const prediction = hidden * w2 + b2;
const loss = mse(prediction, target);
```

At this point the network knows the loss. It knows it was wrong by some amount. But it does not yet know which weights should change or by how much.

## The gradient

A gradient tells us the direction of steepest increase. Since we want the loss to go down, we move the weights in the opposite direction.

If a weight has a positive gradient, increasing it makes the loss bigger, so we reduce it. If a weight has a negative gradient, increasing it makes the loss smaller, so we increase it.

That is what this update is saying:

```js
weight = weight - learningRate * gradient;
```

The learning rate matters because it controls how big the step is. Too small and training takes forever. Too large and the model can jump around without settling.

## Why the chain rule matters

The loss is not usually connected to a weight directly. A weight affects a neuron, that neuron affects another layer, that layer affects the prediction, and the prediction affects the loss.

Backpropagation uses the chain rule to connect all of those steps.

If:

```txt
loss depends on prediction
prediction depends on hidden layer
hidden layer depends on weight
```

then:

```txt
loss depends on weight through all of those links
```

That is why the algorithm moves backward. It starts from the loss because that is the thing we can measure, then passes responsibility back through the network.

## What is stored during training

During the forward pass, the network keeps the intermediate values it will need later. That usually means activations, inputs to activation functions, and sometimes masks or cached outputs.

This is why training uses more memory than just running a model. In inference, you only need the answer. In training, you need the answer and the trail of how you got there.

## A tiny mental model

Imagine a group project where the final grade was bad. Backpropagation is the process of figuring out how much each part of the project contributed to the grade. The introduction was fine, the data section was weak, the conclusion was okay, and the formatting lost a few points.

The next draft should not rewrite everything equally. It should update the parts that caused the most loss.

That is what a network is doing, except the "parts" are weights and the feedback is a gradient.

## Why this still feels weird

The weird part is that the network is not told the rule directly. It is given examples and a way to measure error. The structure of the model and the gradients do the rest.

That does not mean the model understands in a human way. It means the parameters are being adjusted so that the function maps inputs to outputs more usefully.

That is enough to be powerful, and also enough to be dangerous if we forget what it is: a very large function being tuned by error signals.
