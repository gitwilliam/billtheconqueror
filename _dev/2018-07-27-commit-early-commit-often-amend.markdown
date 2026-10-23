---
title: "Commit Early, Commit Often - Amend"
date: 2018-07-27 01:16:47
---

# ![](/assets/images/dev/fabric-scissors-needle-needles-461035.jpg)

# Overview

The amend command in git is another helpful tool that I use on a regular basis.  It [again](http://billtheconqueror.wordpress.com/2018/07/14/commit-early-commit-often-the-interactive-rebase-squash-and-fixup/) is one of the features that really leaves no excuse of committing early, and committing often.  This short tutorial will demonstrate how to use it.

# Amend

Imagine that you've been developing some awesome software, and you've committed it.  Now you've made some cleanup (added some additional comments, fixed some TODOs, etc).  You decide that you'd really just like the changes to be encapsulated with the previous change-set.  After staging you files (`git add`),

`git commit --amend`

Your text editor of choice (of course you've set it to vim) appears asking if you would also like to modify the commit message.

[code language="bash"]

The Best Solution Yet

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date: Sat Jul 14 08:34:48 2018 -0500
#
# On branch master
# Changes to be committed:
# new file: amend.txt
# new file: refactor.txt
# new file: tests-passing.txt

[/code]

After modifying your message (if you choose to do that), saving and closing the editor, you will see that all your changes are now captured in a single commit.

# Conclusion

I have demonstrated in several posts how we can rearrange our commit history in various ways.  The amend command provides a very quick and easy way to modify the previous commit.  More information can be found [here](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things).
