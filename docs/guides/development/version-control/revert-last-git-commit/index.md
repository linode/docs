---
slug: revert-last-git-commit
description: "Mistakes happen, and the Git version control system has tools to help you navigate them. In this tutorial, learn two methods to undo your most recent Git commit, what sets the methods apart, and when to use them."
keywords: ['revert git commit','undo git commit','revert git commit after push']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-18
modified: 2024-02-15
modified_by:
  name: Linode
title: "Revert the Last Commit in Git"
title_meta: "How to Revert the Last Commit in Git"
external_resources:
- '[freeCodeCamp: Git Revert Commit – How to Undo the Last Commit](https://www.freecodecamp.org/news/git-revert-commit-how-to-undo-the-last-commit/)'
- '[TechTarget: How to Revert a Git Commit](https://www.theserverside.com/tutorial/How-to-git-revert-a-commit-A-simple-undo-changes-example)'
authors: ["Nathaniel Stickman"]
---

Git is a widely used Version Control System (VCS) known for its versatility. It utilizes local clones of central repositories and keeps track of every commit so changes can be rolled back as needed.

You might need that recoverability after an inadvertent commit or to undo a commit for any reason. This tutorial shows you how to use the `git` command line utility to revert a commit. It covers methods using both the `git revert` and `git reset` commands and explains the differences.

Learn more about Git generally in our guide [Git vs SVN: Pros and Cons of Each Version Control System](/docs/guides/svn-vs-git/#what-is-the-git-version-control-system). For a more general, and thorough, coverage of reverting Git commits, take a look at our guide on [How to Undo a Git Commit](/docs/guides/how-to-undo-git-commit/).

## Optional: Create a Test Repository

If you'd like to test reverting and resetting in a separate repository from one you actively work in, follow the steps below. This will set up an example Git repository similar to the one used for the examples in this tutorial. The commit IDs may be different, but the contents of the repository should otherwise be the same.

The steps presume you have already installed Git and done basic configuration (e.g. user email address and name). If you have not done this yet, you can learn how in our guide [How to Install Git and Clone a GitHub Repository](/docs/guides/how-to-install-git-and-clone-a-github-repository/).

1.  Create a new directory for your Git repository, and change it into that directory. Here, the new directory, `git-example` is created in the current user's home directory.

    ```command
    mkdir ~/git-example
    cd ~/git-example
    ```

    From here on, you should execute the given commands while working in this directory.

1.  Initialize the new Git repository.

    ```command
    git init
    ```

1.  Use the `touch` command to create some new empty files.

    ```command
    touch example-file-1.txt
    touch example-file-2.txt
    ```

1.  Add the files to the Git staging area, then commit the staged changes.

    ```command
    git add .
    git commit -m "Initialized repo."
    ```

1.  Make some changes to the first file, adding some content to it. Then stage and commit those changes using the following commands:

    ```command
    echo "Some example text for the first file." >> example-file-1.txt
    git add example-file-1.txt
    git commit -m "Added text to first file."
    ```

1.  Do the same for the second file.

    ```command
    echo "Some example text for the second file." >> example-file-2.txt
    git add example-file-2.txt
    git commit -m "Added text to second file."
    ```

1.  You now have a Git repository with a couple of files and several commits, which you can see listed with the following command:

    ```command
    git log --oneline
    ```

    The output of the command looks like the following:

    ```output
    f4391b2 (HEAD -> master) Added text to second file.
    e3c534a Added text to first file.
    0b24777 Initialized repo.
    ```

## How to Use the `git revert` Command on the Last Commit

Git revert undoes a commit by comparing the changes made in that commit to the repository's previous state. It then creates a new commit that reverts the changes.

To use the `git revert` command, you first need the ID for that commit. You can get this with the `git log` command. Here, the command is used with the `--oneline` option to make each commit display on a single line:

```command
git log --oneline
```

```output
f4391b2 (HEAD -> master) Added text to second file.
e3c534a Added text to first file.
0b24777 Initialized repo.
```

The line at the top of the output, with an ID of `f4391b2` in this example, represents the last commit. You can revert that commit using the `revert` command with that commit's ID, as shown here:

```command
git revert f4391b2
```

Git starts a new commit to revert the changes. It may present you with a text editor allowing you to edit the description for the new commit. When you are satisfied with the description, exit the text editor to complete the reversion.

```output
[master e86542a] Revert "Added text to second file."
 1 file changed, 1 deletion(-)
```

Running the `git log` command again shows that there is now a new commit to revert the previous commit:

```command
git log --oneline
```

```output
e86542a (HEAD -> master) Revert "Added text to second file."
f4391b2 Added text to second file.
e3c534a Added text to first file.
0b24777 Initialized repo.
```

If you view the affected file, you can see that the changes have been reversed. In this case, that is `example-file-2.txt`:

```command
cat example-file-2.txt
```

## How to Use the `git reset` Command to Undo Commits

Git reset can also be used to revert the last commit. The command is more powerful than `git revert` and works by removing commits entirely from the repository's commit history. Essentially, reset "rewinds" you to a previous commit, eliminating later commits and history along the way.

With the `git reset` command, you have access to the `HEAD~1` alias. This alias stands in for the ID of the previous commit, providing easy access when trying to revert to the last commit.

The `git reset` command comes with three flags that define how the command deals with changed files in the working directory and staging area.

-   Use the `--soft` option to roll back to a previous commit, while preserving file changes in the working directory and staging area.

    ```command
    git reset --soft HEAD~1
    ```

-   Use the `--hard` option to likewise roll back to a previous commit. However, this option results in all file changes being reverted as well. Changes to files in the working directory as well as staged changes are both discarded.

    ```command
    git reset --hard HEAD~1
    ```

-   Use the `--mixed` option to, again, roll back to a previous commit. Here, a middle ground is adopted for file changes. As with the `--hard` option, changes made to files in the working directory are discarded. However, like the `--soft` option, staged changes are preserved.

    ```command
    git reset --mixed HEAD~1
    ```

After any of the above commands, you can see that the last commit has been removed from the Git commit history:

```command
git log --oneline
```

```output
e3c534a (HEAD -> master) Added text to first file.
0b24777 Initialized repo.
```

The difference is that, if you run the `--soft` option with the command, you can still find the changes to the file in the working directory. For this example, that is the `example-file-2.txt` file:

```command
cat example-file-2.txt
```

```output
Some example text for the second file.
```

### Differences Between Reset and Revert

The main difference between the `git reset` and `git revert` commands is the commit history.

Revert aims to maintain a full commit history, undoing a commit by assessing changes and making a new commit that reverses them. This actually means that this command adds to the commit history. It gives you full transparency to past commits and their reversions.

In contrast, using reset discards commits even from the commit history, making them impossible to recover later. The `git reset` command can even do the same for local file changes. This option keeps you from seeing reversions and the original commits that are reverted.

Generally, it is recommended that you use `git revert` for backing out a commit. It keeps a record of the removed commit and leaves the possibility of assessing and accessing the commit history later.

The `git reset` command should be used sparingly. Take a good look at the situation to ensure that it cannot be remedied by reverting a commit instead of resetting to a previous commit. A reset might be preferred, however, for immediately undoing mistaken commits, when there is less chance that you need options for recovering the changes.

## Conclusion

That covers all you need to revert recent Git commits. Moreover, the techniques covered in this tutorial can also help you manage Git commits more generally. The `git revert` command can be useful for precisely removing past commits while retaining your commit history. The `git reset` command, on the other hand, provides a more radical option, completely reverting a repository to a previous commit, including the commit history.

To keep learning, refer to the links at the beginning of this guide. These give you more on Git generally as well as more on the commands covered in this tutorial. You may also want to look at our entire lineup of [guides on version control](/docs/guides/development/version-control/). These cover everything from the fundamentals to particular use cases, and provide steps to deepen your version control knowledge.