---
title: "FPiS - Functional Data Structures and Pattern Matching"
date: 2018-10-16 02:22:19
---

# ![](/assets/images/dev/canva-background-texture-hexagon-pattern.jpg)

# Overview

I went to Wisconsin to visit family a couple weeks ago, and I came home with a bad cold that went down into my chest.  Because of that, and because Chapter 3 of [Functional Programming in Scala](https://www.amazon.com/Functional-Programming-Scala-Paul-Chiusano/dp/1617290653/ref=sr_1_1?ie=UTF8&qid=1535512047&sr=8-1&keywords=functional+programming+in+scala) is packed with lots of exercises, it has taken me awhile to get through.  In this chapter the authors discuss Functional Data Structures and also introduce Pattern Matching.

## Functional Data Structure

A functional data structure is only operated on by pure functions.  They are, by definition, immutable.  The authors go on to point out, that although this may seem like a lot of wasted copying, in fact it is not - because of data sharing.  Data sharing is the idea of reusing data (since it is immutable we know it won't change!) instead of copying it.

## Pattern Matching

Pattern matching is a lot of fun, and can make for very concise and clean code.  It can be used to pull out sub-expressions of a structure. Here is a very simple example of pattern matching which pulls out the second element in a list.

[code language="scala"]
  test("Example Pattern Matching") {
    val x = List(1, 2, 3, 4) match {
      case _ :: x :: _ => x
    }

    assert(x == 2)
  }
[/code]

 

# Conclusion

All of my solutions to the exercises from Chapter 3 can be found on [GitHub](https://github.com/gitwilliam/btc-fpis).
