---
title: "Commit Early, Commit Often - The Interactive Rebase (Delete)"
date: 2018-07-24 03:56:07
---

# Overview

In a [previous](http://billtheconqueror.wordpress.com/2018/07/14/commit-early-commit-often-the-interactive-rebase-squash-and-fixup/) post I described how to squash and/or fixup commits using an interactive rebase.  In this short tutorial I will describe how to remove commits from the tree.

# Delete

Looking at the state of our git repository from the [last](http://billtheconqueror.wordpress.com/2018/07/14/commit-early-commit-often-the-interactive-rebase-squash-and-fixup/) git tutorial, let's suppose (for some very strange reason) you wanted to push your changes, but not the associated unit tests.

[code language="bash"]

* 48cd446 (HEAD, master) The Best Solution Yet
* de55869 Write Unit Tests
* 0c52a86 Branch Point

[/code]

Performing an interactive rebase on the branch point, `rebase -i 0c52a86`, will replay the top two commits on top of "Branch Point".  Your editor will present you with options to perform on each commit prior to replaying them.

[code language="bash"]

pick de55869 Write Unit Tests
pick 48cd446 The Best Solution Yet

# Rebase 0c52a86..48cd446 onto 0c52a86
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out

[/code]

To delete a commit, you simply remove the commit line.  I will remove the "Write Unit Tests" commit, save and close the file.  Note the stern warning in the message, "If you remove a line here THAT COMMIT WILL BE LOST".

Printing out our tree, the unit test commit is now gone.

[code language="bash"]

* d843df0 (HEAD, master) The Best Solution Yet
* 0c52a86 Branch Point

[/code]

# Conclusion

Removing a commit from a tree can be trivial through an interactive rebase.  However, if your commits are mangled, modifying the same lines in the same files, this could (and likely will) result in conflicts.

For more, and probably better, reading see [this](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History).
