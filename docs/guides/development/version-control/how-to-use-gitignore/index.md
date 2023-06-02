---
slug: how-to-use-gitignore
description: 'This guide explains the .gitignore file, describes how to create and update it, and documents its syntax'
keywords: ['gitignore','.gitignore','Gitignore syntax','How to add files to gitignore','What is gitignore']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-10
modified_by:
  name: Linode
title: "Use .gitignore to Ignore Specific Files and Folders"
external_resources:
- '[gitignore Documentation](https://git-scm.com/docs/gitignore)'
- '[Git website](https://git-scm.com/)'
authors: ["Jeff Novotny"]
---

[Git](https://git-scm.com/) is a powerful *version control system* (VCS). It allows developers to manage, coordinate, and control the contents of their workspaces, but is not without complexity. Git users often struggle with untracked local files that complicate the output of commands like `git status`. This guide explains the `.gitignore` file, which provides a handy workaround to this problem. It also describes how to create a `.gitignore` file, how to add files and folders to `gitignore`, and how to use its powerful syntax.

{{< note respectIndent=false >}}
Throughout this guide, `gitignore` refers to the `.gitignore` file. The full `.gitignore` name is always used in commands, outputs, and when referencing the full path of the file.
{{< /note >}}

## What is gitignore?

In a Git repository, most files are either tracked or untracked. But the `gitignore` file enables a third category of files. Here's an explanation of the three types of files in a Git repository:

- **Tracked**: These files are already added/staged or committed to the repository.
- **Untracked**: These files are not yet staged or committed. The developer intends to stage or commit them at some later time.
- **Ignored**: These are untracked files that a developer does not want to stage or commit. Git has been told to ignore these files, so they do not appear in the input of Git commands. As far as Git is concerned, these files do not exist.

To list the tracked and untracked files in a Git repository, use the `git status` command. It lists all tracked files that have changed, along with the untracked files. However, it does not list any ignored files or folders. These entities are hidden, and therefore no longer shown as untracked. This removes clutter from the Git commands and makes it easier to focus on changes to relevant files.

To ignore a file or folder, add it to a file named `.gitignore`. This is a text file normally located in the root directory of a Git repository, although it can reside elsewhere. The preceding `.` character indicates `gitignore` is a hidden file.

Git does not automatically create the `gitignore` file. It must be created manually.

Each line in the file represents a different pattern, or rule, describing the files Git should ignore. The `gitignore` syntax includes a series of special operators for developing patterns with much larger scopes. Unfortunately, there is no Git command to create or edit the `gitignore` file. These actions must be performed manually.

Developers should ignore files and folders they do not plan to push, rather than leaving them in an untracked state. This avoids confusion, reduces the chance of accidental commits, and helps developers structure their workplace. Here are some types of files that are good candidates for `gitignore`.

-   Object files and compiled code, such as `.o` files.
-   Build output directories.
-   Caches.
-   System files.
-   Auto-generated files, including `.lock` and `.tmp` files.
-   Personal configuration or IDE files.
-   Temporary test data for unit testing.
-   Placeholder or stub files used during early development.
-   Files containing sensitive information like passwords and keys.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Ensure Git is installed on your Linode. For information on installing up Git, see the Linode guide to [installing Git](/docs/guides/how-to-install-git-on-linux-mac-and-windows/). Essentially:

    ```command {title="Debain / Ubuntu"}
    sudo apt install git
    ```

    ```command {title="AlmaLinux / CentOS Stream / Fedora / Rocky Linux"}
    sudo dnf install git
    ```

1.  To provide an environment for testing `gitignore` behavior, create and initialize a test Git repository:

    ```command
    mkdir testgit
    cd testgit
    git init
    ```

1.  Create the example files and folders necessary to follow along with this guide:

    ```command
    mkdir {subdir1,subdir2,subdir3} && touch 1.bak a.bin b.bin file1.txt file2.txt file3.txt file4.txt file5.txt file6.txt one.bak subdir1/file7.txt subdir2/file8.txt subdir3/files.log
    ```

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Use the gitignore file

`gitignore` is a normal text file. It contains a set of rules telling Git what files and folders to ignore. Users must create and edit it manually. The following sections explain how and where to create the file and how to ignore files and folders. The following examples use a sample Git repository named `testgit`. This repository has already been created using the `git init` command.

This guide is optimized for Linux and Ubuntu users, but the Git commands are common to all platforms. The `gitignore` syntax is platform independent.

### How to Create the gitignore File

Most developers add the `gitignore` file to the root directory of the repository. However, it can be created in any directory. The patterns in a `gitignore` file are always relative to the location of the `gitignore` directory. It is also possible to create multiple `gitignore` files. The rules in each file are cumulative and are processed in a relative manner.

There is no command for creating the `.gitignore` file. To create the `.gitignore` file, first, make sure you're in the root directory of the Git project (i.e `testgit`). Then use a text editor, or simply the `touch`command, to create the file:

```command
touch .gitignore
```

### How to Add Files to gitignore

The simplest use of `gitignore` is to ignore an individual file. Add the full name of the file to be ignored to the `.gitignore` file. Each new entry must appear on a separate line.

Git ignores all files with this name no matter where they are located in the repository. A later section discusses how to ignore multiple files matching a pattern. Here are the steps required to add a file to `gitignore`.

1.  Run the `git status` command to review the list of untracked files. Determine which files are not important and should not be listed.

    ```command
    git status
    ```

    {{< output >}}
Untracked files:
    .gitignore
    1.bak
    a.bin
    b.bin
    file1.txt
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
    subdir1/
    subdir2/
    subdir3/
{{< /output >}}

1.  Edit the `.gitignore` file:

    ```command
    nano .gitignore
    ```

1.  To ignore `file1.txt`, add the full name of the file to `gitignore`:

    ```file {title="testgit/.gitignore"}
    file1.txt
    ```

    {{< note respectIndent=false >}}
This pattern ignores any file named `file1.txt` anywhere in the Git repository.
{{< /note >}}

1.  Press **CTRL+X** to exit nano, **Y** to save, and **Enter** to confirm.

1.  Run `git status` again and confirm `file1.txt` is no longer listed amongst the untracked files:

    {{< output >}}
Untracked files:
    .gitignore
    1.bak
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
    subdir1/
    subdir2/
    subdir3/
{{< /output >}}

1.  A file in a specific directory is ignored in much the same way. Add the entire file path, relative to the `gitignore` file, as a new line in the file. For example, to ignore the file `file7.txt` in the directory `subdir1`, add another entry to `gitignore`, like so:

    ```file {title="testgit/.gitignore" hl_lines="2"}
    file1.txt
    subdir1/file7.txt
    ```

1. Run `git status` again:

    {{< output >}}
Untracked Files:
    .gitignore
    1.bak
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
    subdir2/
    subdir3/
{{< /output >}}

    Here, `subdir1` is not listed because its only contents was `file7.txt.`, which is now ignored.

### How to Add Folders to gitignore

`gitignore` can also be used to ignore entire directories, along with any files and subdirectories in the directory. To ignore a specific directory, append a `/` symbol to the end of the directory name.

{{< note respectIndent=false >}}
If the `/` symbol is not added to the end of the rule, Git ignores all files and directories matching the pattern. `/` restricts the rule so it only applies to directories.
{{< /note >}}

This example explains how to ignore the `subdir2` directory in `gitignore`.

1.  Add a new entry to `gitignore` consisting of the name of the directory to ignore:

    ```file {title="testgit/.gitignore" hl_lines="3"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    ```

1.  Confirm the directory is now on the ignore list. Neither the directory nor the files it contains should be listed under `untracked files`:

    ```command
    git status
    ```

    {{< output >}}
Untracked files:
    .gitignore
    1.bak
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
    subdir3/
{{< /output >}}

### Debugging gitignore

Git provides a debug command for determining why a file is being ignored or considered. Use the `check-ignore` command and the `-v` verbose flag. Git lists every rule that applies to the file.

```command
git check-ignore -v subdir2/file8.txt
```

{{< output >}}
.gitignore:3:subdir2/    subdir2/file8.txt
{{< /output >}}

## gitignore Syntax and Patterns

`gitignore` is equipped with a powerful and flexible set of special operators for filtering files on a highly granular level. The `gitignore` syntax uses wildcard and exclude symbols to add multiple files or remove other files from the set of ignored files.

This section describes the different characters comprising the `gitignore` syntax. The `check-ignore` command illustrates how the gitignore syntax affects different files. For more extensive information about the syntax, consult the [gitignore documentation](https://git-scm.com/docs/gitignore).

### The Wildcard Symbols

The `*` symbol matches zero or more characters, excluding only the `/` character. For example, the rule `*.bak` ignores all files with the `.bak` extension, including `1.bak` and `one.bak`. Wildcards can be used in both file and folder names.

1.  Add a new line to `.gitignore`:

    ```file {title="testgit/.gitignore" hl_lines="4"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    *.bak
    ```

1.  Use `git-status` to confirm both `.bak` files are unlisted:

    {{< output >}}
Untracked Files:
    .gitignore
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    subdir3/
{{< /output >}}

1.  A closely-related filter is the `?` character. This matches any single character. The rule `?.bak` matches `1.bak`, but not `one.bak`. Modify the last change to `.gitignore` to look like so:

    ```file {title="testgit/.gitignore" hl_lines="4"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    ?.bak
    ```

1.  Use `git check-ignore ` to look for `1.bak`:

    ```command
    git check-ignore -v 1.bak
    ```

    {{< output >}}
.gitignore:4:?.bak    1.bak
{{< /output >}}

1.  Use `git status` again to confirm that `one.bak` is listed as untracked:

    {{< output >}}
Untracked Files:
    .gitignore
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
    subdir3/
{{< /output >}}

### The Double Asterisk Symbol

The `**` character matches any number of directories or files. This is often used to ignore certain files in a specific directory anywhere in the repository. For instance, the pattern `**/backup/*.log` matches any files ending in `.log` in any directory named `backup`.

The `**` works slightly differently in different contexts. The pattern `**/dirname` matches all instances of the directory. The pattern `dirname/**/filename` matches files named `filename` inside `dirname` or any of its subdirectories.

1.  Add a new line to `.gitignore`:

    ```file {title="testgit/.gitignore" hl_lines="5"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    ?.bak
    **/subdir3/*.log
    ```

1.  Use `git check-ignore` to look for the `files.log` file:

    ```command
    git check-ignore -v subdir3/files.log
    ```

    {{< output >}}
.gitignore:5:**/subdir3/*.log    subdir3/files.log
{{< /output >}}

1.  Now use `git status` to confirm that the `files.log` file's otherwise empty parent directory `subdir3` is now unlisted:

    {{< output >}}
Untracked Files:
    .gitignore
    a.bin
    b.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
{{< /output >}}

### The Negation Symbol

The negation symbol removes some of the files or folders that match an earlier rule enforcing an ignored state. If the rule `*.bin` ignores all `.bin` files, then the rule `!a.bin` overrides this rule for `a.bin`. It tells Git to stop ignoring these files and move them back to the untracked state.

{{< note respectIndent=false >}}
Some of the negated files can be returned to the ignored state using yet another rule later in the file. So it is possible to ignore a set of files `a`, then negate subset `b` out of `a`, then ignore subset `c` from `b`. It is possible to build a long chain of nested rules using this strategy. However, this structure can be difficult to debug and should normally be avoided.
{{< /note >}}

This example demonstrates how the rule `!a.bin` overrides the `*.bin` rule. The file `b.bin` is still ignored, but `a.bin` is listed as untracked.

1.  Add two new lines in `.gitignore`:

    ```file {title="testgit/.gitignore" hl_lines="6,7"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    ?.bak
    **/subdir3/*.log
    *.bin
    !a.bin
    ```

1.  Use `git check-ignore` to look for `b.bin`:

    ```command
    git check-ignore -v b.bin
    ```

    {{< output >}}
.gitignore:6:*.bin	b.bin
{{< /output >}}

1.  Now look for `a.bin`:

    ```command
    git check-ignore -v a.bin
    ```

    {{< output >}}
.gitignore:7:!a.bin	a.bin
{{< /output >}}

1.  Use `git status` to confirm that `a.bin` is still untracked, but `b.bin` is unlisted:

    {{< output >}}
Untracked Files:
    .gitignore
    a.bin
    file2.txt
    file3.txt
    file4.txt
    file5.txt
    file6.txt
    one.bak
{{< /output >}}

## The Range Symbol

The square brackets `[]` are used to specify a numerical or alphabetical range. There are several permutations of this symbol.

-   `[0-9]` matches any single character from the range, so any number between `0` and `9`. This is the same as any single digit.
-   `[01]` matches any character from the set, in this case, either `0` or `1`.
-   `[!01]` matches any character except the ones in the set.
-   `[a-m]` is an alphabetic range. This range includes lower case letters from `a` to `m`.

As an example, the `gitignore` entry `file[3-5].txt` ignores `file3.txt`, `file4.txt` and `file5.txt`, but not `file2.txt` or `file6.txt`.

1.  Add `file[3-5].txt` to your `gitignore` file:

    ```file {title="testgit/.gitignore" hl_lines="8"}
    file1.txt
    subdir1/file7.txt
    subdir2/
    ?.bak
    **/subdir3/*.log
    *.bin
    !a.bin
    file[3-5].txt
    ```

1.  Use `git status` to confirm the removal of `file3.txt`, `file4.txt`, and `file5.txt` from the list of untracked files:

    {{< output >}}
.gitignore
a.bin
file2.txt
file6.txt
one.bak
{{< /output >}}

1.  Use `git check-ignore` to look for `file3.txt`:

    ```command
    git check-ignore -v  file3.txt
    ```

    {{< output >}}
.gitignore:8:file[3-5].txt	file3.txt
{{< /output >}}

### The Comment Symbol

Any entry in the `gitignore` file beginning with the `#` symbol is a comment. Comments can help organize and explain highly complicated `gitignore` files.

Blank lines are also ignored. Developers can use them to separate the `gitignore` file into sections.

### Combinations and Exceptions

There are a few puzzling exceptions to the `gitignore` rules. Certain patterns are also confusing. Here are some specific cases that might cause problems.

-   For performance reasons, it is not possible to negate a file that belongs to an ignored directory. For example, if a rule ignores the `backup` directory, then Git does not acknowledge the subsequent pattern `!backup/data.log`. The `backup/data.log` file is still ignored and does not appear as an untracked file in `git status`.
-   Prepending a directory separator `/` symbol to a rule indicates the rule is relative to the root directory containing the `gitignore` file. Without the `/` symbol, the rule applies everywhere in the directory.
-   Patterns specifying a particular file in a certain directory are always relative to the `gitignore` file. This means the pattern `backup/debug.log` does not match the file `project/backup/debug.log`. This rule is equivalent to `/backup/debug.log`.
-   Any pattern with a directory separator `/` symbol in the middle of a pattern is also relative to the `gitignore` file.
-   If there is a `/` symbol at the end of a pattern, it only matches directories. Otherwise it matches both directories and files.
-   The `\` symbol is an escape character. It tells Git to treat the next character as a literal character and not a special symbol. The rule `log\[05\].txt` is used to ignore `log[05].txt`. Without the escape character, the rule would ignore `log0.txt` and `log5.txt`.

## Ignoring Files in Special Circumstances

### Ignoring Files Locally and Globally

The `gitignore` file is typically checked into the Git repository. This means it applies to every instance of the repository, but not to other repositories on the system. However, Git provides options to expand the rules to all repositories or only apply the rules locally.

-   **Local Repository Rules**: Rules in the `.git/info/exclude` file only apply in the local repository. This file is not checked in, so it does not apply to other copies of the repository. This is a good choice for special rules that only apply to your personal repository, including personal data or local environments. The regular `gitignore` rules still apply in this context.
-   **Global gitignore Rules**: To ignore files in all repositories on a particular system, use a global `.gitignore` file. Run the following command to register the file globally with Git, then add the rules to `~/.gitignore`.

    ```command
    git config --global core.excludesFile ~/.gitignore
    ```

### Ignoring Checked-In Files

Git does not ignore any checked in files, even if they are covered by patterns in the `gitignore` file. To ignore a checked in file, first remove it from Git. Use this command to remove and ignore the file.

```command
git rm --cached FILENAME
```

{{< note respectIndent=false >}}
Conversely, it is possible to check in an ignored file using the `-f` option. Run the command `git add -f FILENAME`. After the file is checked in, Git no longer ignores it. However, this command is not recommended. It is better to create a `gitignore` pattern exempting the file, or to design the patterns so the file is never ignored in the first place.
{{< /note >}}

## Conclusion

Git files are normally either tracked or untracked. However, Git provides a mechanism for ignoring untracked files that are not intended for check-in. This means they do not appear in the output of commands such as `git status`, resulting in a cleaner and better organized workspace.

Developers can ignore files and folders by adding them to the `.gitignore` file. `gitignore` is a plain text file normally located in the root directory of the repository. Powerful operators including wild card characters and exclusion characters allow users to define rules with wider or more granular scopes. For more information on how to ignore files in Git, see the [Gitignore documentation](https://git-scm.com/docs/gitignore).