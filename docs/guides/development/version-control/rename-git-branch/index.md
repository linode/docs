---
slug: rename-git-branch
title: "How to Rename a Git Branch"
title_meta: "How to Rename a Branch in Git & Why You Should"
description: 'Need to know how to rename a Git branch? This guide explains what a Git branch is, when you should rename, and how to rename a branch in Git. ✓ Click here!'
keywords: ['rename git branch','git rename branch','rename branch git','git rename local branch','git change branch name','git branch rename','git rename remote branch','rename branch','how to rename a branch in git','change branch name git']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-04-25
modified_by:
  name: Linode
external_resources:
- '[Career Karma: How to Rename a Git Branch](https://careerkarma.com/blog/git-rename-branch/
)'
- '[Stack Overflow: How do I rename a local Git branch?](https://stackoverflow.com/questions/6591213/how-do-i-rename-a-local-git-branch
)'
- '[TheServerSide: How to rename and change a Git branch name locally & remotely](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/rename-Git-branch-local-remote-GitHub-GitLab-BitBucket
)'
---

Git is a distributed version control system that views data as a series of snapshots. This is in contrast to delta-based version control systems, such as Concurrent Version System (CVS) and Subversion. These view their data as a set of files, and the changes made to each file over time.

In Git, once a copy of the remote repository has been checked out, work can be done on the local copy. Changes can be committed whenever needed. When ready, simply *push* these changes to the remote repository.

## What is a Git Branch?

Work in a *branch* in order to isolate changes made locally from changes that other team members are making on their own machines. A Git branch is basically a label for a single or series of *commits*, or changes, that are related. A commit contains a snapshot of saved code along with a link to the previous commit. The default branch name in Git is **master**, although many repositories use the name **main** instead.

Unlike CVS or Subversion, Git encourages the free creation of development branches. The idea is to work in them, and later merge them into project, version, QA, or production branches. While working in a local branch, there is little fear of incomplete and/or untested code winding up in a production build.

## Why Rename a Git Branch?

It’s common to name a new Git branch with your initials (or git handle) along a date, number, or  description. Once code in the branch is complete, the project committers may require that a pull request (PR) be submitted. This starts the process of having the code reviewed and merged.

However, committers need to know what the branch is intended to accomplish, so renaming the branch to summarize its purpose may be required. The pull request provides additional space to describe the code in more detail. Different projects may have different standards for branch names submitted in pull requests. The general best practice is for the name to be descriptive of the changes made.

Another reason to rename a Git branch would be if there’s an error in the original name. For example, in some projects the name of a branch is supposed to contain the number of the bug or issue being fixed. If the bug number is *1291* and you accidentally named the branch *bugfix-1292*, then you'd want to rename the branch to *bugfix-1291*.

## How to Rename a Branch in Git

### Steps to Rename the Local and Remote Branches

Branches in a local repository can be renamed from the command line using the `git` command. However, additional steps are needed to push the change into the remote origin repository.

{{< note >}}
This guide assumes that the remote origin repository was set when checked out. It also assumes that your terminal is in the working directory of the local repository, so that the `git` command can find the `.git` subdirectory.
{{< /note >}}

1.  Use the following command to display a list of local branches:

    ```command
    git branch
    ```

    The current branch is shown with an asterisk (*):

    ```output
      main
    * example-branch
    ```

1.  Now use the `-r` flag to display a list of remote-tracking branches:

    ```command
    git branch -r
    ```

    ```output
    origin/main
    origin/example-branch
    ```

1.  Create a new branch using the following command syntax `git branch <new-branch>`:

    ```command
    git branch bugfix-1292
    ```

To rename this branch to `bugfix-1291`, either switch into the branch or use the long form of the `git branch -m` command.

1.  Switch into the new branch using the following command syntax `git checkout <branch-name>`:

    ```command
    git checkout bugfix-1292
    ```

1.  Now rename the branch to `bugfix-1291`:

    ```command
    git branch -m bugfix-1291
    ```

Alternatively, if not already in branch `bugfix-1292`, use the two-parameter rename command syntax `git branch -m <old-name> <new-name>`:

```command
git branch -m bugfix-1292 bugfix-1291
```

1.  When done, push the renamed branch to the remote repository:

    ```command
    git push origin -u bugfix-1291
    ```

1.  If the branch was previously pushed to the remote repository, the old branch name still exists, so delete it:

    ```command
    git push origin --delete bugfix-1292
    ```

## Conclusion

Git branches help isolate the changes you make to a project from changes others are making. This avoids having incomplete code released to production. There are several reasons to rename a branch, but most have to do with a project’s naming conventions and chosen best practices. You now know how to rename a local branch. This includes pushing a renamed branch to, and deleting an old branch name from a remote repository.