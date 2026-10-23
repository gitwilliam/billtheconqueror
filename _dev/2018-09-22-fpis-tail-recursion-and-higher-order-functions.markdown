---
title: "FPiS - Tail Recursion and Higher-Order-Functions"
date: 2018-09-22 03:30:49
---

# ![](/assets/images/dev/canva-tail-of-whale-above-water.jpg)

# Overview

Chapter 2 of [Functional Programming in Scala](https://www.amazon.com/Functional-Programming-Scala-Paul-Chiusano/dp/1617290653/ref=sr_1_1?ie=UTF8&qid=1535512047&sr=8-1&keywords=functional+programming+in+scala) starts by giving some basic syntax and understanding of the Scala language.  Since my main focus in studying this book is to sharpen my ability to *think* functionally, I will not write much about [Scala](http://www.scala-lang.org) here.  This chapter also covered **Tail Recursion** and **Higher-Order Functions**.

## Tail Recursion

I remember during my undergraduate work particularly struggling with recursion.  Of course *almost* everything I was learning with respect to software was new to me at that time.  Even today, however, I still feel like I have to exercise the neurons in new ways to think recursively.   As I have studied Functional Programming, my recursive chops have grown considerably - and I have enjoyed the elegant solutions that recursion allows.

A tail call refers to the recursive call in a function, when no additional operation needs to be performed on the returned value.  When this is the case, the Scala compiler turns the recursion into a loop.  This allows the developer to use a recursive solution without fear of blowing the stack.

## Higher-Order Function

Another topic discussed in this chapter are Higher-Order Functions.  An HOF is a function that takes as a parameter another function.  Take for example, the function definition below.  The function `sort` takes as a parameter an array of integers and a function of type `(Int, Int) to Boolean`.  That is, sort will accept a function that takes as a parameters two integers and returns a boolean (i.e. a comparison function). In this case, `sort` is a Higher-Order Function.

[code language="scala"]
def sort(a: Array[Int], f: (Int, Int) => Boolean): Array[Int]
[/code]

# Conclusion

My solutions to the exercises from Chapter 2 can be found on [GitHub](https://github.com/gitwilliam/btc-fpis).  If you have any corrections for my definitions above, please drop a comment.
