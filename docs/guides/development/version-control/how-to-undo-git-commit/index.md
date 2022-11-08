---
slug: how-to-undo-git-commit
author:
  name: Linode Community
  email: docs@linode.com
description: 'Wondering how to undo a git commit? Follow our step-by-step guide on the various methods you use to undo a commit. Some of the methods discussed include the git revert and the git reset command.'
keywords: ['how to undo git commit','git revert commit','git undo local commit']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-08
modified_by:
  name: Linode
title: "How to Undo a Commit in Git"
h1_title: "How to Undo a Git Commit: A Step-by-Step Guide"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Git documentation](https://git-scm.com/doc)'
---

[Git is one of the most common and versatile *version control systems* (VCS)](/docs/guides/svn-vs-git/#what-is-the-git-version-control-system), but it is not always simple and easy to use. You can run into trouble when you commit an undesirable change to a repository. There are several different strategies you can follow to restore your repository. This guide discusses how to undo a git commit and explains the advantages and any drawbacks to each approach.

## Important Git Background for Undoing a Local Commit

Version control software allows users to manage and track changes to computer source code, documentation, web sites, and other systems. Git is an industry-standard, open-source VCS that uses a distributed architecture. Every Git project is represented by a repository. A repository stores all information about the project, including the source files and change history. The history is stored as metadata information, including the time stamp, comments, and the person who made the change.

The entire project team contributes to a shared repository, known as the *remote repository*. However, each developer maintains their own repository containing the local changes they are working on. Git is known for its optimized performance, integrated security features, flexibility, and efficiency. Some Git commands are very powerful and can handle difficult tasks including stream splits and merges. Unfortunately, Git can also be complex and difficult to learn.

Updates can be propagated between the branches through a series of Git commands. Before anyone can use Git to undo a local commit, they must first be clear about how Git normally works. There are three different locations for files.

- **The working directory**: This is an area where users can make any changes they want to their files with no restrictions. They can create new files or modify new ones, test their changes, and delete anything they do not want.
- **The staging area, or Git index**: Users must add new files or changed files to this area before they can perform a commit. It is an intermediate area between the working directory and the local repository.
- **The local repository**: Users commit the changes in the staging area to this repository. Each commit represents a snapshot of the project at a particular point in time. From here, files can be pushed to a remote repository.

The `git add` command is used to move changes to the working files, along with any new files, to the staging area. At this point, the working directory and the staging area are in sync, but the changes are still not in the local repository. When the changes are complete, developers can use `git commit` to move their changes to their repository. Each commit tracks the new changes, and ensures the current snapshot is available in the future. A commit represents the repository at the time it was made. However, it does **not** move the changes to the shared repository yet.

Changes to the local repository are not automatically propagated to any remote repository. Developers can potentially port their changes to the remote repository using `git push`. This allows other users to view and incorporate the commit. Changes must always be committed before they can be pushed. An organization might institute additional requirements before `git push` is run, such as code reviews or automated testing.

When users have only made changes to their working directory, nothing is recorded in the history. No additional steps have to be taken to undo anything. Even when files have been added to the staging area, there are still several options to roll back the changes. However, after the changes are committed to the repository, certain git commands must be used to undo the changes. If the commit has already been pushed to a remote repository, there is only one acceptable git command to undo it.

Users can view the change logs for any file in a repository using some variation of the `git log` command. Each commit is identified through a unique 40-character string. This string is equivalent to the SHA-1 checksum for the commit. The current version of a file is known as the `HEAD` commit. When applied to a branch, `HEAD` indicates the current version of the branch as reflected in the local repository. For more information on Git, see the [*Git website*](https://git-scm.com/doc).

## How to Undo a Git Commit

There are several ways to use git to undo a local commit. The right choice depends on the following factors:

- The changes might be required in the future. Some options preserve the commit while others completely erase it.
- A clean commit log is considered advantageous.
- The changes have been committed to the remote repository or not. If someone has pushed the changes already using `git push`, there are fewer options available.

The most common methods of using git to remove the last commit are `git revert` or some variant of `git reset`. However, an organization might have standard best practices regarding what command should be used. More detailed information about all these commands can be found in the [*Git documentation*](https://git-scm.com/doc).

### Reviewing Previous Commits Using Git Log

Before undoing any commits in Git, familiarize yourself with the change history of any relevant files. The `git log <filename>` command displays the entire history of `filename`, but `git log --oneline` is usually more readable and useful. It displays the commit identifier and the comments for each commit together on a single line. The following command displays all previous commits to `testfile1.txt` and identifies the `HEAD` version of the file.

    git log --oneline testfile1.txt

{{< output >}}
6f819a796 (HEAD -> git-test) Second revision of file
705dfa037 Initial draft of file
{{< /output >}}

### Undoing a Git Commit Using a Soft Reset

The `git reset` command is a handy way to undo recent changes and restore files to an earlier version. The `reset` command can be used for a hard reset, a soft reset, or a mixed reset which falls somewhat in the middle. Many experts advise against using `git reset` as it throws away the changes, but in many cases this is not a problem.

The `git reset --soft <version>` command resets the `HEAD` commit on a local branch to the previous commit. The specified `version` becomes the current commit and the `HEAD` version in the log. More recent commits are discarded, along with their history. However, this command preserves all changes in the working directory and the staging area. The changes can be subsequently committed when they are ready. Although the command is typically used to rewind to the previous commit, an earlier version can be specified. So `git reset --soft HEAD~3` restores the `HEAD` of the local repository to the third-most recent commit.

A soft reset is the best choice for unwinding accidental commits. A good example is when a file is committed before all testing is complete or if some files are unintentionally omitted. A new version can be committed later when all changes are complete. This updates the repository and history with the correct commit.

If the changes have already been pushed to the remote repository, this approach is not suitable. `git reset` does not update the remote file, so the local workspace is now out of sync. The next time files are fetched, the unwanted commit is erroneously restored.

The following example demonstrates how a soft reset might be used on `testfile1.txt`.

1.  Review the file contents before the soft reset.

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third line of text for check-in 3.
    {{< /file >}}

1.  Verify the Git log for the file. It displays three commits.

        git log --oneline testfile1.txt

    {{< output >}}
73536b193 (HEAD -> git-test) Third revision of file
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  Execute a soft reset using the commit that immediately preceded the current version. This version is `HEAD~1`, which is an alias for the second most recent commit.

        git reset --soft HEAD~1

    {{< note >}}
It is possible to undo multiple commits. Use either the commit identifier or the `HEAD~n` notation to identify the commit.
    {{< /note >}}

1.  The log now reflects the results of the reset operation. The earlier version has become the current version. This version is now the `HEAD`.

        git log --oneline testfile1.txt

    {{< output >}}
6f819a796 (HEAD -> git-test) Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1. Verify the state of the file using `git status`. The output confirms the changes are still staged and ready for another commit.

        git status testfile1.txt

    {{< output >}}
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
    modified:   testfile1.txt
    {{< /output >}}

1.  The contents of the local directory are also unchanged.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third line of text for check-in 3.
    {{< /file >}}

### Undoing a Git Commit Using a Hard Reset

The `git reset` option also has a `--hard` option. `git reset --hard <version>` also rewinds the `HEAD` version to the specified version the same way a soft reset does. The earlier commits are still removed from the log and the local repository. However, in a hard reset the changes are also removed from both the working directory and the Git index. This means any changes made to the file after the target version are lost.

This command should be used whenever the recent commit is incorrect, not simply incomplete or too early. It is the right choice to permanently undo changes that are not intended for a future commit. As with a soft reset, this approach is not suitable for a file that has been pushed to a remote repository.

The following example demonstrates how a hard reset results in a different outcome than a soft reset.

1.  Before the `reset` operation, the log of the current file displays three commits.

        git log --oneline testfile1.txt

    {{< output >}}
3aa5652f2 (HEAD -> git-test) Third revision of file. Take 2
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1. The working copy of the file displays the text from the recent commit.

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third line of text for check-in 3.
    {{< /file >}}

1.  To undo the changes, perform a hard reset using the `--hard` option. Specify `HEAD~1` to revert to the commit preceding the current commit. If the reset is successful, Git displays information about the current version.

        git reset --hard HEAD~1

    {{< output >}}
HEAD is now at 6f819a796 Second revision of file
    {{< /output >}}

1.  View the log to confirm the older commit is now the current version. Information about the third commit has disappeared.

        git log --oneline testfile1.txt

    {{< output >}}
6f819a796 (HEAD -> git-test) Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  This time, the commit no longer appears in the git index.

        git status git testfile1.txt

    {{< output >}}
On branch git-test
nothing to commit, working tree clean
    {{< /output >}}

1.  The commit has also been undone in the working file. It reflects the contents of the `HEAD~1` commit.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
    {{< /file >}}

### Undoing a Git Commit Using a Mixed Reset

The command `git reset --mixed <version>` performs a mixed reset. In addition to rolling the local repository back to the specified version, it removes changes associated with the commit from the staging area. This is equivalent to undoing both the `git add` and `git commit` commands on the file. However, it is similar to the soft reset because it does not remove the changes from the working directory. This makes it easier to add back the changes and commit them again in the future. The mixed mode is the default setting for a reset if no options are specified.

A mixed reset is typically used to undo a commit that still requires some minor adjustments. When the file is corrected, it can be added and committed again. It can also be used to remove a new file that was not yet ready from the staging area. If there is no chance of the changes ever being needed again, a hard reset should be used.

The following example demonstrates how a mixed reset differs from the other two approaches.

1.  At first, the contents of the file reflect the contents of the three commits.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third attempt at line 3.
    {{< /file >}}

1.  Run the `git log` command to see the commit history.

        git log --oneline testfile1.txt

    {{< output >}}
cbe82f1a6 (HEAD -> git-test) Third revision of file. Take 3
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  Undo the changes using the `git reset --mixed` command. Identify the version to roll back to. In this case, it is `HEAD~1`.

        git reset --mixed HEAD~1

    {{< output >}}
Unstaged changes after reset:
M	docs/guides/development/tips-and-tricks/testfile1.txt
    {{< /output >}}

1.  The output from `git log` confirms the most recent commit has been undone.

        git log --oneline testfile1.txt

    {{< output >}}
6f819a796 (HEAD -> git-test) Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  The commit is no longer staged.

        git status testfile1.txt

    {{< output >}}
On branch git-test
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
    modified:  testfile1.txt
    {{< /output >}}

1.  However, all changes remain in the working directory. The contents of `testfile1.txt` are unchanged.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third attempt at line 3.
    {{< /file >}}

{{< note >}}
`git reset` can be used on a specific file to move a particular commit to the staging area. The syntax for this command is `git reset HEAD <filename>`. Although it can be used with any version from the repository, it is typically used with the `HEAD` version. In this case, it has the effect of aligning the local repository and the staging area. This is an efficient method of undoing uncommitted changes to the staging area. Subsequent changes must be staged again using `git add` before they can be committed.
{{< /note >}}

### Undoing Git Changes Using Git Revert

`git revert` is used to completely revert a commit without deleting it. Many experienced Git users prefer this approach over a reset. The main difference is a `revert` undoes the changes using a new commit. It compares the commit with the version that precedes it to determine the necessary changes. It also adds a new entry in the commit log to document the reversion.

A `revert` does not throw away or overwrite any earlier commits. While `git reset` removes all records of the undesirable commit, `git revert` generates an entirely new commit to accomplish the same undo operation. The `HEAD` of the file is set to the new version that inverts the changes. This version of the file becomes the current version. In all cases, specify the commit to undo as an argument. To roll back the most recent commit, use `git revert HEAD`. This command rolls back the entire commit at once, so several files can be affected at the same time.

The main advantage of `git revert` is it maintains the history of all commits. This is handy for debugging and quality control purposes. It is also the best approach if the commit has already been pushed to the remote repository. It allows the revert operation to be pushed to the shared repository and undoes the change there too. This approach is the easiest and cleanest way to fix a broken build and is always safe to use. Many organizations only allow changes to be backed out using this method.

To use Git to revert a commit, follow these steps.

1.  Verify the file history and contents to determine the change to revert.

        git log --oneline testfile1.txt

    {{< output >}}
34722a3fd (HEAD -> git-test) Third revision of file. Take 4
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
Third attempt at line 3.
    {{< /file >}}

1.  Apply `git revert` to the last commit. `HEAD` is an alias for the more recent commit.

        git revert HEAD

    {{< output >}}
[git-test 606638205] Revert "Third revision of file. Take 4"
 1 file changed, 1 deletion(-)
    {{< /output >}}

1.  The log reflects a new commit which inverts the third commit. This restores the contents of the file to the second revision. Commits `606638205` and `6f819a796` are exactly the same.

        git log --oneline testfile1.txt

    {{< output >}}
606638205 (HEAD -> git-test) Revert "Third revision of file. Take 4"
34722a3fd Third revision of file. Take 4
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  All changes are removed from the staging directory.

        git status testfile1.txt

    {{< output >}}
On branch git-test
nothing to commit, working tree clean
    {{< /output >}}

1.  The contents of the working copy also change. They reflect the current version of the file in the local repository.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
    {{< /file >}}

### Using Git Checkout

The `git checkout` command is typically used to switch to another branch. However, it can also be used to view earlier commits to a file. Later on, the user can restore the current version of the file using another `git checkout`.

When used with a specific commit identifier, `git checkout <commit_id>` allows developers to checkout and view a specific snapshot of the file. The checked out version is technically independent of any branch and exists in a branchless state. `HEAD` now points to this version, but another newer commit is still the current version for the branch. This creates what is known as a *detached head* condition, which is something to be concerned about. If any further commits or changes are made to this file, they are detached from the current state of the branch. Any subsequent `checkout` results in these changes becoming orphaned and unusable. So this approach is of limited use for rolling back a recent commit.

However, it is possible to directly create a new branch based on the earlier commit. While this older commit is still checked out, create the new branch using `git checkout -b <new-branch-name>`. The older version of the file automatically serves as the base for the new stream. This allows new development to use an older version of the repository as a starting point.

The `checkout` command overwrites any local changes. To save local changes, ensure the file is backed up or stashed before proceeding with the checkout.

{{< note >}}
When used on a branch, `git checkout` checks out the current contents of a branch on the local system. All subsequent commits are made against this branch. This is the main method of switching between branches in a repository. There is no concern about orphaned commits or a detached `HEAD` in this case, because `HEAD` still represents the current version.
{{< /note >}}

To use `git checkout`, follow these steps.

1.  Review the file history using `git log`. Locate the version to review.

        git log --oneline testfile1.txt

    {{< output >}}
e3d35e244 (HEAD -> git-test) Third revision of file. Take 5
606638205 Revert "Third revision of file. Take 4"
34722a3fd Third revision of file. Take 4
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  Use `git checkout` to view the contents of commit `606638205`. Git confirms the checkout and warns the user they are in a `detached HEAD` state. It also displays a warning about the checkout and explains how to undo the `git checkout` operation.

        git checkout 606638205

    {{< output >}}
Note: switching to '606638205'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

HEAD is now at 606638205 Revert "Third revision of file. Take 4"
    {{< /output >}}

1.  Verify the status of the file and ensure it displays the detached head state. It does not belong to any branch.

        git status testfile1.txt

    {{< output >}}
HEAD detached at 606638205
nothing to commit, working tree clean
    {{< /output >}}

1.  The contents of the file reflect the checked out version.

        cat testfile1.txt

    {{< file testfile1.txt >}}
First line of text.
Second line of text for check-in 2.
    {{< /file >}}

1.  The log has changed and now tags the earlier version as the head.

        git log --oneline testfile1.txt

    {{< output >}}
606638205 (HEAD) Revert "Third revision of file. Take 4"
34722a3fd Third revision of file. Take 4
6f819a796 Second revision of file
705dfa037 Initial draft of file
    {{< /output >}}

1.  At this point, it is possible to create a new branch based around the checked out version. However, the actual current version can be quickly restored using the `git switch` command.

        git switch -

    {{< output >}}
Previous HEAD position was 606638205 Revert "Third revision of file. Take 4"
Switched to branch 'git-test'
    {{< /output >}}

1.  Confirm the file is no longer in a detached head state.

        git status testfile1.txt

    {{< output >}}
On branch git-test
nothing to commit, working tree clean
    {{< /output >}}

1.  The current contents of the file are restored to the working directory.

        cat testfile1.txt

    {{< output >}}
First line of text.
Second line of text for check-in 2.
Final attempt at new line.
    {{< /output >}}

### Amending a Git Commit Message

If the files and changes in a `git commit` operation were correct, but the comment was wrong, it can easily be amended. Use the command `Git commit --amend -m <updated-message>` to update the message associated with the commit. This option can only be used to modify the most recent commit.

{{< note >}}
This command must never be used to modify the message of a commit that has already been pushed to a remote server. This leaves the two repositories out of sync and is almost guaranteed to cause trouble in the future.
{{< /note >}}

### Other Related Git Commands

There are a couple of other similar Git commands that are useful in certain situations.

-  The `git clean` command removes untracked files or directories that have not yet been added to the staging area or committed. It can be used to clean up a workspace and delete unwanted or forgotten files.
-  The `git rm` command is sometimes confused with `revert` or `reset`, but it has a different purpose. `git rm` is used to remove a file that is no longer required from the repository. However, the file history is preserved. This means the command can be undone using the `reset` directive and earlier versions can still be retrieved for viewing. `rm` is the inverse of the `git add` operation. The file is not removed from the local repository until the change is committed.

## Conclusion

This guide explains how to undo a commit in Git. There are several Git commands that can undo a local commit. Choosing the most appropriate command depends on an understanding of how Git operates and the circumstances of the commit.

The `git reset` command restores an earlier version of the file to the repository and eliminates all records of the more recent commits. It is available as a hard reset, which overwrites local changes, and a soft reset, which preserves them. The `git revert` command also undoes a Git command. It generates a new commit to invert the original changes. This leaves both the initial change and the undo operation in the file history and repository. Other commands, including `git checkout`, `git clean`, and `git rm` can also be used to revert changes in certain circumstances.

