---
title: "Commit Early, Commit Often - The Interactive Rebase (Squash and Fixup)"
date: 2018-07-14 17:47:18
---

# Overview

I've been using git for over 7 years and have had the privilege of mentoring a small number of people in their understanding and use of git.  One of the ideas that I always try to impress upon git beginners is the very light-weight nature of commits.  I almost always use the adage, "commit early, commit often."  (That's right, no more copy-paste directories with time-stamps!).  Our version control system should be our friend throughout development.  Often it seems, however, that some developers hesitate to commit because the "code is not yet ready."  In this short tutorial I will attempt to demonstrate what many of us have spent much of our lives wishing we could do - [rewrite history](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)!

# Interactive Rebase

With the interactive rebase, `git rebase -i *reference* `, we can rearrange, delete, reword, and compress commits in a few simple steps.

## Squash and Fixup

The two most common interactive rebase commands that I use are by far squash and fixup.  Both of these can be used to compress commits.  The primary difference between the two is that a squash pauses the rebase allowing the user to reword the commit being squashed into, whereas the fixup retains the original commit message.

Let's suppose that you are following a TDD (Test Driven Development) approach just in your own personal workflow.  You have written your unit tests, written your first solution to pass the tests, refactored your solution, and then you find another test case that you should have added at the beginning.  All along the way you have been committing your changes.  Now you are ready to push, and you would like to organize your update into just two commits, one for tests and one for your solution.

`"Write Unit Tests" -> "Tests Passing" -> "Refactor" -> "Another Test"`

Executing ` git log --all --graph --decorate --oneline ` generates,

[code language="bash"]

* 39df881 (HEAD, master) Another Test
* b4daa70 Refactor
* 5ed462e Tests Passing
* d84f6c1 Write Unit Tests
* 0c52a86 Branch Point

[/code]

In this simple example, the "Branch Point" is the common commit between your branch and the branch you have deviated from. Performing a `git rebase -i 0c52a86` will start at the location of HEAD and cause git to re-write the last (or top) four commits on top of the "Branch Point" commit. If HEAD is on a branch the branch will also be moved.  You're commit editor will appear,

[code language="bash"]

 pick d84f6c1 Write Unit Tests
 pick 5ed462e Tests Passing
 pick b4daa70 Refactor
 pick 39df881 Another Test

 # Rebase 0c52a86..39df881 onto 0c52a86
 #
 # Commands:
 #  p, pick = use commit
 #  r, reword = use commit, but edit the commit message
 #  e, edit = use commit, but stop for amending
 #  s, squash = use commit, but meld into previous commit
 #  f, fixup = like "squash", but discard this commit's log message
 #  x, exec = run command (the rest of the line) using shell
 #
 # These lines can be re-ordered; they are executed from top to bottom.
 #
 # If you remove a line here THAT COMMIT WILL BE LOST.
 #
 # However, if you remove everything, the rebase will be aborted.
 #
 # Note that empty commits are commented out

[/code]

You may now edit the four commits using any of the commands listed. In this example, I would like to fixup "Another Test" into "Write Unit Tests". This will "squash" them together and will not prompt to update the message of the commit. I would also like to squash "Refactor" into tests passing. This will prompt for an updated message.

[code language="bash"]

 pick d84f6c1 Write Unit Tests
 f 39df881 Another Test
 pick 5ed462e Tests Passing
 s b4daa70 Refactor

[/code]

Notice in the above excerpt that I positioned "Another Test" immediately after "Write Unit Tests" and specified with "f" that it should "fixup" the preceding commit. Saving and closing the text editor will begin the rebase.  The rebase stops when re-writing the solution commits, allowing the user to specify a new message for the newly squashed commits.

[code language="bash"]

 1 COMMIT_EDITMSG
 # This is a combination of 2 commits.
 # The first commit's message is:

 Tests Passing

 # This is the 2nd commit message:

 Refactor

 # Please enter the commit message for your changes. Lines starting
 # with '#' will be ignored, and an empty message aborts the commit.
 #
 # Date:      Sat Jul 14 08:34:48 2018 -0500
 #
 # rebase in progress; onto 0c52a86
 # You are currently editing a commit while rebasing branch 'master' on '0c52a86'.
 #
 # Changes to be committed:
 #       new file:   refactor.txt
 #       new file:   tests-passing.txt
 #

[/code]

I added the message, "The Best Solution Yet",

[code language="bash"]

 1 COMMIT_EDITMSG
 The Best Solution Yet
 # This is a combination of 2 commits.
 # The first commit's message is:

 Tests Passing

 # This is the 2nd commit message:

 Refactor

 # Please enter the commit message for your changes. Lines starting
 # with '#' will be ignored, and an empty message aborts the commit.
 #
 # Date:      Sat Jul 14 08:34:48 2018 -0500
 #
 # rebase in progress; onto 0c52a86
 # You are currently editing a commit while rebasing branch 'master' on '0c52a86'.
 #
 # Changes to be committed:
 #       new file:   refactor.txt
 #       new file:   tests-passing.txt
 #

[/code]

After saving and closing the editor, the rebase finishes.  Producing another tree with git log shows us the final results of our rebase,

[code language="bash"]

* 48cd446 (HEAD, master) The Best Solution Yet
* de55869 Write Unit Tests
* 0c52a86 Branch Point

[/code]

# Conclusion

It is important to remember that typically you would not want to do this with a remote integration branch.  If you are working with a team, your teammates will not be happy if you rewrite the repository.  However, many centralized git servers control who can force push (-f) an updated integration branch.  The interactive rebase can safely be used for organizing a branch that you own.

In future posts I will demonstrate some of the other commands in the interactive rebase.  For further, and probably better, reading see, [this](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) and [this](https://git-scm.com/docs/git-rebase).  Please drop a comment if you have any feedback.
