---
title: "FPiS - Referential Transparency"
date: 2018-08-28 13:30:40
---

# ![](/assets/images/dev/canva-gears-metal-stainless-technology-machine-old.jpg)

# Overview

I am beginning to work through the book [*Functional Programming in Scala*](https://www.amazon.com/Functional-Programming-Scala-Paul-Chiusano/dp/1617290653/ref=sr_1_1?ie=UTF8&qid=1536757587&sr=8-1&keywords=functional+programming+in+scala) by Paul Chiusano and Runar Bjarnason. Previously I made it through the first 4 or 5 chapters when I had an account with Safari. I no longer have an account with Safari that can I access on my personal computer. So, recently I purchased a hard copy of the book, and I plan to start from the beginning.

## Chapter 1

In Chapter 1 the authors lay some of the fundamental foundation for Functional Programming by explaining through example, **Referential Transparency** and the **Substitution Model**.

## Referential Transparency

The concept of referential transparency (RT) formalizes the idea of pure functions (or expressions). In general, it means that a function in a program can be replaced by what the function evaluates to without changing the meaning of the program. For example, the expression `x = 5` has RT. Anywhere that `x` is used (in context) you could replace it with `5` and it would not change the meaning of the program. However, the following snippets demonstrate a function that has side effects and is not RT.

[code language="scala"]
var counter = 0
def hasSideEffect(): Int = {
   counter = counter + 1
   counter
}

y = hasSideEffect()
println(y) // ===> 1
println(y) // ===> 1
[/code]

When substituting `y` with `hasSideEffect()` the behavior of the software changes.

[code language="scala"]
var counter = 0
def hasSideEffect(): Int = {
   counter = counter + 1
   counter
}

// Substitute for y (different output)
println(hasSideEffect()) // ===> 1
println(hasSideEffect()) // ===> 2
[/code]

Furthermore, a function is said to be pure if with RT parameters it is RT.

## Substitution Model

A program with functions that are referential transparent can be easier to reason about by using the substitution model. This is much like you did in Algebra in school, where you substituted expressions for values and reduced equations to simpler forms. If the functions that you are substituting for are pure, you can reason about them locally without the need to keep track of state in your head.

# Conclusion

By making use of pure functions, not only are the functions themselves easier to test, reuse and reason about, but the entire application becomes easier to trace.
