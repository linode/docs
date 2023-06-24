---
slug: git-rebase-command
description: 'This guide provides you with an introduction to the rebase command in Git and you will learn when to use these commands to rebuild your Git history.'
keywords: ['git rebase', 'git rebase interactive']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-15
modified_by:
  name: Linode
title: "Using the Git Rebase Command"
title_meta: "How to Use the Git Rebase Command"
authors: ["Stephen Savitzky"]
---

## What Does Git Rebase Do?

Rebasing takes a series of commits and reapplies them on top of another base commit. This method is a form of *rewriting* a branch's commit history. Rebasing does not change the content of your commits, but it does change the commit hash that is used to track your changes. This is an important detail to remember, especially when working with collaboration branches or branches that have already been accessed by other team members.

### Rebase vs. Merge

This section uses the scenario described below to explore the differences between Git's `rebase` command versus Git's `merge` command.

- You are working on a local feature branch named `my-feature-branch`.
- You forked off of the `main` collaboration branch. The `main` branch is the base of your local `my-feature-branch`.
- Other repository collaborators have made changes to the `main` collaboration branch.
- You want to add your local `my-feature-branch` commits to the `HEAD` of the `main` branch.

**Git Merge**: A Git merge allows you to merge your feature branch with the `main` collaboration branch. This method creates a new commit that incorporates the changes from both branches. This is known as a *merge commit*. Merging your feature branch with the `main` branch can be accomplished with the following commands:

    git checkout main
    git pull
    git checkout my-feature-branch
    git merge main

When merging two branches together using a merge commit, your local branch's commit history resembles the following:

{{< output >}}

         A---B---M  my-feature-branch
        /       /
...D---E---F---G    main
{{</ output >}}

The `M` represents the merge commit that ties together the two branches. Once you've merged the two branches, you can either keep working on your branch, or merge it back into `main`.

{{< note respectIndent=false >}}
This is considered a *fast-forward* merge because `main` is a direct ancestor of `M`. If you continue to work on your feature branch, you eventually have to make another merge with `main`. This makes it difficult for anyone reviewing your code to figure out exactly what changes you made.
{{< /note >}}

**Git Rebase**: A Git rebase takes the commits made in your local branch and places them on top of the latest commits pulled down from the `main` branch. This method updates your local feature branch with the latest changes pushed up to the collaboration branch by your teammates. Merging your feature branch with the `main` branch can be accomplished with the following commands:

    git checkout main
    git pull upstream main
    git checkout my-feature-branch
    git rebase main

After running the `git rebase main` command, your local branch's commit history resembles the following:

{{< output >}}
                 A'---B'...  my-feature-branch
                /
...D---E---F---G             main
{{</ output >}}


`B`, in the rebase diagram and `M`, in the merge diagram, are both snapshots of approximately the same state. What’s different about the two commit histories is the information available in each. `M` and its history record what everyone did – it’s a historical record of what work was done on the project. `B` and its history, on the other hand, tell the story of how the project was made. Typically, your Git repository's project leaders determine which method they prefer to use to combine changes between branches.

{{< note type="alert" respectIndent=false >}}
Rebasing rewrites your commit history. Never rebase a commit that somebody else might have based their work on. Only change your own local history. Don’t rebase anything that you’ve already pushed to an upstream branch.
{{< /note >}}

## How Git Rebase Works

During a Git rebase, all the committed changes made in your working feature branch are saved in a temporary area. The saved commits are all the commits made since your initial fork from the base branch. When rebasing you are generally rebasing onto an updated version of the original base branch.

Then, the rebase does a hard reset to the head of the upstream branch in the local branch. This is effectively like running the `git reset --hard <upstream>` command. Next, the rebase applies the saved changes (stored in your commits) to the local branch. Any commits that introduce the same textual changes as a commit in the upstream branch are omitted.

{{< note respectIndent=false >}}
The commits that are temporarily stored when rebasing are the same set of commits that are displayed when issuing the `git log <upstream>..HEAD` command.

These are also the same set of commits that you would get from the `git log --patch --reverse <upstream>..HEAD` command.
{{< /note >}}

## When to Use Git Rebase?

The primary reason to rebase is to keep a feature branch up to date with an upstream collaboration branch. Typically, this is done because you will eventually merge your feature branch with the upstream collaboration branch. Keeping your branch up to date with the collaboration branch achieves the following:

- It eliminates the risk of merge conflicts when you finally merge two branches. When rebasing, the merge is always going to be fast-forwarded.

- Rebasing often – ideally, every time someone pushes a commit – ensures that your work always incorporates the latest changes. Lots of small rebases make conflicts less likely, and much easier to resolve if they do happen.

- If someone pushes another commit to the collaboration branch while you’re running your unit and integrations tests, rebase again and re-run your tests. Using the `--ff--only` option when you eventually merge guarantees that no changes have been pushed while you were doing your rebase.

- Rebasing keeps your project’s `main` branch linear. A linear commit history makes it easier to understand each change, and makes bisecting to find a bug simpler.

- Finally, you can use an interactive rebase to rewrite commit messages, re-order commits to make the changes easier to understand, and squash out trivial commits that contain commit messages like “Commit everything before going home for the weekend”. A branch with a small number of commits is easier to understand and review.

## How to Rebase Safely

### Do Not Rebase Commits that Have Been Shared

Do not rebase a branch that someone else may have worked on. As long as the branch you are rebasing only exists locally on your computer, you should be able to rebase without negative results.

Fortunately, Git prevents you from pushing a rebased commit, unless you use the `--force` option. It is best to avoid using this option unless you are certain about what you are doing. It’s okay to force-push a rebased branch to a shared repository provided you’re the only person using that branch.

### Create a Backup Branch

Aborting a rebase resets the branch's commit history back to where it was prior to the rebase. However, if the rebase succeeds, but the result of the rebase is unexpected, you can perform a hard reset of the branch. This takes you back to the commit that was the head of your branch before you started. You can save a reference to that commit creating a backup branch:

    git branch my-backup-branch
    git rebase...
    git reset --hard my-backup-branch

You can achieve the same thing with a [tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging). You can also use [`git reflog`](https://git-scm.com/docs/git-reflog()) to find the commit if you forgot to make a backup branch.

### Stash or Commit Your Changes

Git doesn't prevent you from rebasing when you have uncommitted changes or untracked files. You should avoid rebasing when you have uncommitted changes. Either commit your changes or [stash](https://git-scm.com/docs/git-stash) them. You can also stash local changes as a precaution when merging, performing a hard reset, and switching branches.

### Use Git Fast Forward Only when you Merge a Rebased Branch

When you’re merging with a branch that you’ve rebased, ensure that you merge using the `--ff-only` option, as follows:

    git checkout main
    git pull
    git merge --ff-only your-feature-branch
    git push

With this option, the merge fails if any changes have been merged into the collaboration branch (`main` branch) since your last rebase. The push fails if any changes have been pushed between the `git pull` and the `git push`. If the push fails, use `git pull --rebase` to catch up. Remember to re-run your unit and integration tests afterward.

## When to Pull Changes with a Rebase

There are two main cases when `git pull --rebase` is the right command to use:

- Use this command when pulling a different branch, usually the one you’re eventually going to merge your feature branch with.

    This method is a shortcut. Instead of checking out a branch (often the `main` branch), pulling down the most recent changes, checking out your working branch, and rebasing, you can `git pull --rebase main` and have mostly the same effect. The only difference is that the first method updates the `main` branch as well as the branch you’re working on.

- Use `git pull --rebase` when someone else has made commits on the branch you’re currently working on.

    Pulling the `main` branch from the branch you’re working on provides more information. A rejected non-fast-forward push means that someone has pushed changes to the collaboration branch.

## Git's Interactive Rebase

Rebasing interactively (with the `-i` or `--interactive` option) lets you modify the commits being rebased. You can rearrange them, delete them, squash them together, edit their messages, and modify files.

### How Interactive Rebase Works

When starting an interactive rebase, identify the commit that you're going to rebase the modified commits onto. Often, this is an earlier commit on your working branch; you can identify it by its hash or by tagging the commit. For example:

    git log --oneline -n20 # identify the base commit
    git tag interactive-rebase-base 969d539
    git rebase -i interactive-rebase-base

This displays a list of the commits being rebased, starting with the oldest commit. Then, it opens your default text editor. The list of commits presented to you during an interactive rebase resembles the following:

{{< output >}}
pick 75ad226 ignore .odt files
pick 4c8cfec Push from sable Tue 07 Sep 2021 10:27:50 AM PDT
pick e06ed41 add email to $editor about merge tools
pick 6ec4a89 Move `examples/` to top level of WIP
pick d027142 Move examples repo to ../conflict-playground
pick abba541 Push from sable Fri 10 Sep 2021 04:55:08 PM PDT
pick a9f26f7 Push from sable Tue 14 Sep 2021 08:04:35 PM PDT
pick a70a5ea Push from sable Wed 15 Sep 2021 08:52:37 PM PDT
pick bf5ea02 Push from sable Thu 16 Sep 2021 04:05:16 PM PDT
pick 36619cd Start working on interactive rebase
pick e977228 slight wording fixup for clarity
pick f300b06 Add the screenshots for how-to-resolve-merge-conflicts

# Rebase 969d539..f300b06 onto f300b06 (12 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase is aborted.
#
# Note that empty commits are commented out
{{</ output >}}

The comment block at the end of the file describes the commands you can put in place of `pick` to make modifications. You can replace the full command with its first letter.

{{< note respectIndent=false >}}
Ensure you don't modify the seven-digit commit IDs that are presented to you.
{{< /note >}}

In the example above, there are several commits that use repetitive commit messages. These commits should be *squashed* onto commits that have meaningful messages. You can do so using the `pick` command. In addition to `pick`, use `reword`, which stops to let you edit the commit message. The `squash` options combines the commit with the previous commit. The `fixup` options is like `squash` except that it discards the selected commit’s log message.

After deciding how to clean up your commit history using the available commands, the list might look as follows:

{{< output >}}
pick 75ad226 ignore .odt files
reword 4c8cfec Push from sable Tue 07 Sep 2021 10:27:50 AM PDT
pick f300b06 Add the screenshots for how-to-resolve-merge-conflicts
pick e06ed41 add email to $editor about merge tools
pick 6ec4a89 Move `examples/` to top level of WIP
squash d027142 Move examples repo to ../conflict-playground
pick abba541 Push from sable Fri 10 Sep 2021 04:55:08 PM PDT
fixup a9f26f7 Push from sable Tue 14 Sep 2021 08:04:35 PM PDT
fixup a70a5ea Push from sable Wed 15 Sep 2021 08:52:37 PM PDT
fixup bf5ea02 Push from sable Thu 16 Sep 2021 04:05:16 PM PDT
squash 36619cd Start working on interactive rebase
squash e977228 slight wording fixup for clarity
{{</ output >}}

Git stops three times to let you edit the commit message: once for the reword, and once for each set of consecutive `squash` and `fixup` commands. When you’re done, your commit history looks as follows:

{{< output >}}
b46df0d Continue working on interactive rebase
151496e Make conflict playground repo.
510ed1d add email to $editor about merge tools
bc70905 Add the screenshots for how-to-resolve-merge-conflicts
65c80d4 Finish resolving...; start working on rebase
75ad226 ignore .odt files
{{</ output >}}

This creates a much more readable log that is easier for repository maintainers to review and approve.

### Additional Rebasing Commands and Options

In addition to `squash`, `fixup`, and `reword`, there are several other commands:

- The `drop` command removes the commit. You can get the same effect by deleting the line, but if you’re doing something complicated `drop` gives you the option of changing your mind later.

- The `edit` command keeps the commit, but stops to let you amend it – it’s like `git commit --amend` except that the commit you’re amending doesn't have to be the most recent commit. Among other things, you can use it to split a commit: use `git reset HEAD^` to move back in history, then add and commit the different files separately.

- The `break` command interrupts the rebase before the marked commit rather than after it; you can also use it after an `exec` or `merge` command, or to do something at the very start of the rebase. Use `git rebase --continue` to process the rest of the list.

- The `exec` command accepts a shell command rather than a commit. Possible uses include running a code formatter like `html_tidy`, or changing the protections on a file.

- The `merge` command adds a merge commit; it’s used in conjunction with `label` and `reset` when rebasing merges. See the section [Rebasing Merges](https://git-scm.com/docs/git-rebase#_rebasing_merges) in the man page for `git rebase`.

## Troubleshooting

### Solving Merge Conflicts when Running a Git Rebase

Merge conflicts can occur during a rebase operation. During a rebase a separate merge for each commit takes place. For this reason, it’s possible to encounter more than one conflict during the course of a rebase. The list below includes some options you can use when working through a merge conflict during a rebase:

- Use `git add <filename>` to mark the conflicts as resolved. Then, run the `git rebase --continue` command to continue with the remaining patches for the rebase.

- Run the `git rebase --skip` command to ignore the patch that caused the conflict.

- Use the `git rebase --abort` command to end the rebase. Then, clean up any files that may be causing the merge conflict. When you're done, reattempt the rebase with the `git rebase <branch>` command.

- `git rebase --quit` is like --abort except that it leaves the tree and the index alone.

- `git rebase --show-current-patch` shows you the exact change that Git is trying to apply, in the form of a diff.

### Use Reference Logs to Undo a Bad Rebase

Reference logs (*reflogs*), record when the tips of branches and other references are changed. The `git reflog` command is used to view the history of any reference. This command uses `HEAD` by default. If you want to get your branch back to where it was before your last rebase use:

    git reset --hard HEAD@{1}

Follow this command with a `git push --force-with-lease` to restore a branch that you force-pushed by mistake. A best practice is to verify with the rest of your team that nobody pulled from the rebased branch while you were undoing your rebase.

### Pushing Rebased Commits

The `--force-with-lease` option checks that you are not accidentally overwriting any commits made by someone else collaborating on your remote branch. This option protects all remote refs that are going to be updated by requiring their current value to match the remote tracking branch.

You can also specify a `refname`, which protects that ref alone, or a `refname` and expected value. The latter is useful if you don’t have a remote tracking branch for that ref. The full command is as follows:

    git push --force-with-lease=<refname>:<expected-value>




