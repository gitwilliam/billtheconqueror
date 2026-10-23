---
title: "Commit Early, Commit Often - git merge --squash"
date: 2018-08-25 01:57:14
---

# ![](/assets/images/dev/canva-acorn-squash-autumn-vegetable-food-harvest.jpg)

# Overview

In a previous [post](http://billtheconqueror.wordpress.com/2018/07/14/commit-early-commit-often-the-interactive-rebase-squash-and-fixup/) I described one of the ways that history can be re-written in git with an interactive rebase by "squashing" multiple commits together.  Since we are heading into Fall, I will demonstrate a similar feature, `merge --squash`.

# The Merge Squash

In the example below, **feature** branches off of **master** at "Commit One".   **feature** has two additional commits, "Feature Commit One" and "Feature Commit Two".  Here is the output of `git log --all --graph --decorate --oneline`:

[code language="bash"]
* 006ffbd (HEAD, feature) Feature Commit Two
* aca7e1d Feature Commit One
| * 8292a51 (master) Commit Two
|/
* d7288cc Commit One
[/code]

While on **master**, executing `git merge feature --squash` will merge **feature** into **master**. By default the merge will pause prior to committing the changes.

[code language="bash"]
Squash commit -- not updating HEAD
Automatic merge went well; stopped before committing as requested
[/code]

If there were no merge conflicts, then the changes will be ready to commit at this point. `git commit -m 'Merged in my feature'`

[code language="bash"]
* 1727f02 (HEAD, master) Merged in my feature
* 8292a51 Commit Two
| * 006ffbd (feature) Feature Commit Two
| * aca7e1d Feature Commit One
|/
* d7288cc Commit One
[/code]

# Conclusion

In this short tutorial I demonstrated another useful tool that can be used when you don't care about retaining the history of a particular feature that is spread across multiple commits.  [Here](https://git-scm.com/docs/git-merge#git-merge---squash) is more reading.
