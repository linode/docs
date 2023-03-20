---
slug: how-to-remove-untracked-files-in-git
description: 'Learn how to remove untracked files in git using the git clean command.'
keywords: ['Git remove untracked files','Remove untracked files git','Git remove all untracked files','How to remove untracked files in git']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified_by:
  name: Linode
title: "Remove Untracked Files in Git"
external_resources:
- '[Git clean documentation](https://git-scm.com/docs/git-clean)'
- '[Git ignore documentation](https://git-scm.com/docs/gitignore)'
authors: ["Jeff Novotny"]
---

During the development process, programmers and other Git users often wind up with many old and unwanted files. These might include prototypes, test data, and computer-generated files. Although these files do not necessarily cause problems, deleting them increases efficiency and improves organization. The `git clean` command is the fastest, safest, and easiest way to delete these files. This guide explains how to use Git to remove untracked files and provides many examples demonstrating how to use `git clean`.

## Introduction to Untracked Files and Git

Before using the `git clean` command, it is necessary to understand what an untracked file is and why untracked files matter. In every Git project, there are several types of files. One major distinction is between tracked and untracked files.

*Tracked files* have already been added to Git through the use of the `git add` command. After a file has been added to Git, Git is fully aware of it. It has knowledge of the file details and contents, and is able to restore this information on demand. Tracked files can be either modified or unmodified. A modified file can be staged, also using the `git add` command. So a tracked file might be in one of several states, but Git continues to monitor it.

The other category of files are the *untracked files*, which have not yet been added to the repository. Git can determine that these files exist, but it does not know anything else about them. It does not track their contents in its internal database. Because Git is not actively monitoring these files, it cannot take any action on them. For example, it cannot restore or recover the contents of these files. These files remain untracked until they are added to Git using the `git add` command.

One danger of having untracked files is that the information is not saved. In the event of a hard drive failure, or accidental deletion or overwrite, any data is permanently lost. Because Git never stored the file, it cannot recover it.

Sometimes, of course, files remain untracked because they were never intended to be added to the system. Some examples might include experimental changes, test data, discarded prototypes, build artifacts, and deprecated files. Some applications also dump a large number of auto-generated files into the working directory. It would be ill-advised to add them to Git.

These files can certainly be left in an untracked state, and they do not usually cause any problems. However, there is some risk to keeping old and unnecessary untracked files around, due to the following reasons:

-   It is possible to accidentally `add` and `commit` them, especially when using the wildcard `*` symbol.
-   They clutter up a workspace and take up unnecessary hard drive space. This can lead to confusion when returning to a workspace later on. It might be difficult to remember what the files were used for and whether they are still important.
-   They appear in the output of commands such as `git status` as untracked files. This makes it more difficult to tell what files are truly important.

There are several alternatives to getting rid of these files. For instance, it is possible to simply delete them using the `rm` command. However, this can be time-consuming, and it is easy to accidentally delete the wrong file. Other alternatives like `git reset` have a wider scope and might also unintentionally roll back changes to tracked or committed files.

Additionally, some files should not be tracked in Git, but they are still important, and should not be deleted. A good example is a `.cfg` file or build object files. In this case, the `.gitignore` file is used to tell Git to disregard this file. Any files matching an exclusion rule in `.gitignore` are not displayed in the output of `git status` and the various Git commands do not affect them.

The `git clean` command is the easiest and most efficient method to remove untracked files in Git. This command is highly targeted, easy to use, and does not have undesirable side effects. It leverages the contents of the `.gitignore` file and does not delete ignored files unless specifically told to do so. However, it is still important to use this command with a high degree of caution. When a file is deleted, it is gone for good. Git cannot recover the contents.

To summarize, all files in a Git repository should eventually be handled in one of the following three ways:

-   They can be added to the repository using `git add`.
-   They can be added to the `.gitignore` file, causing Git to ignore them.
-   They can be removed using some variant of the `git clean` command.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  It's also helpful to consult our guides on [Getting Started with Git](/docs/guides/how-to-configure-git/) and [How to Navigate the Linux Terminal and File System](/docs/guides/linux-navigation-commands/).

1.  **Optional** Git must already be installed on the Linode before trying out the examples in this guide. The `git` package is often already pre-installed. To see if it is present, run the command `git --version`. If Git is already installed, this command displays the current version. If Git has not already been installed, use the command `sudo apt install git` to install it.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Remove Untracked Files Using Git Clean

This section demonstrates how to remove untracked files in Git using the `git clean` command. This command has several options allowing users to control the behavior or output of the command. `git clean` also has an interactive mode, making it easy to selectively delete a subset of the files.

Try out the examples in this section using a local Git repository. If the Linode does not already have a repository, you can create one using the `git init` command. Run the `init` command inside the base directory of the repository.

Without additional options, the command `git clean` does not do anything. One of the `-i`, `-n`, or `-f` options must normally be appended.

```command
git clean
```

{{< output >}}
fatal: clean.requireForce defaults to true and neither -i, -n, nor -f given; refusing to clean
{{< /output >}}

`git clean -f` is probably the most widely-used alternative. It forces Git to remove all untracked files with no further chance to refine or alter the operation. When it is finished, it displays a summary of the files it deleted. This command is functionally equivalent to manually deleting the files.

{{< note type="alert" respectIndent=false >}}
Always use `git clean` with caution. This operation cannot be undone.
{{< /note >}}

The following example demonstrates how `git clean -f` handles a combination of untracked, and tracked but uncommitted files. Before the operation, `testfile1.txt` has been added but not committed. The two files `testfile2.txt` and `testfile3.txt` have not been added, so they are both still untracked in Git.

```command
git status
```

{{< output >}}
Changes to be committed:
new file:   testfile1.txt

Untracked files:
testfile2.txt
testfile3.txt
{{< /output >}}

Run `git clean` using the `-f` option to delete the two untracked files.

```command
git clean -f
```

{{< output >}}
Removing testfile2.txt
Removing testfile3.txt
{{< /output >}}

Use either the `git status` or `ls` command to verify the untracked files have been deleted. The `status` command confirms the tracked but uncommitted file has been left untouched. However, the untracked files are no longer there.

```command
git status
```

{{< output >}}
Changes to be committed:
new file:   testfile1.txt
{{< /output >}}

`git clean -n` reduces the risks associated with the `clean` command. It lists all the files the command intends to delete, but does not actually delete them. It acts like a "test run" of the command and can be used to avoid accidental deletions.

Starting with the same configuration, the `git clean -n` command lists the files Git "would remove" in an actual operation.

```command
git clean -n
```

{{< output >}}
Would remove testfile2.txt
Would remove testfile3.txt
{{< /output >}}

Afterwards, the files are still listed in `git status` as they have not really been deleted.

```command
git status
```

{{< output >}}
...
Untracked files:
testfile2.txt
testfile3.txt
{{< /output >}}

The `git clean -e` option allows users to enter a specific exclude pattern or filename. Files having this name or matching this pattern are not deleted.

In the following example, there are two untracked files named `testfile4.md` and `testfile4.txt`.

```command
git status
```

{{< output >}}
...
Untracked files:
testfile4.md
testfile4.txt
{{< /output >}}

To ignore `testfile4.txt` during the deletion process, append the option `-e testfile4.txt` to the `clean` command. The `-f` option is still required to force the remaining deletions.

```command
git clean -f -e testfile4.txt
```

{{< output >}}
Removing testfile4.md
{{< /output >}}

As a result, the `md` file is deleted, but the `txt` file is not.

{{< output >}}
...
Untracked files:
testfile4.txt
{{< /output >}}

`git clean -d` is recursive and cleans both the current directory and any subdirectories.

```command
git clean -f -d
```

{{< output >}}
Removing archive/testfile2.txt
Removing testfile4.txt
{{< /output >}}

It is also possible to specify a directory to limit the scope of the `git clean` operation. The command only applies to untracked files in this directory. The following example applies `git clean` to any files in the `example` directory.

```command
git clean -f -d example
```

`git config` allows users to change the default `git clean` behavior. This permits `git clean` to delete untracked files without appending the `-f` option. It effectively makes `git clean` equivalent to `git clean -f`. To add this option to the configuration file , use the command `git config clean.requireForce false`. See the Git documentation for more details about [Git Clean](https://git-scm.com/docs/git-clean).

{{< note respectIndent=false >}}
The `-q` option runs `git clean` in quiet mode. This means `git clean` does not report the files it removes, but it still displays any errors.
{{< /note >}}

### How to Remove Untracked files Using Git Clean in Interactive Mode

The `-i` option is used to run `git clean` in interactive mode. It allows users to more precisely select the files to delete. This is a good choice for situations where some, but not all, of the untracked files should be deleted. It is also good for those who want to be extra cautious when running this command.

The `-i` option displays a menu listing all available options. It also lists the files currently scheduled for deletion.

To enter inactive mode, run the `git clean -i` command. Git displays the main menu for interactive mode.

```command
git clean -i
```

{{< output >}}
Would remove the following items:
  testfile2.txt  testfile3.md   testfile3.txt
*** Commands ***
    1: clean                2: filter by pattern    3: select by numbers
    4: ask each             5: quit                 6: help
What now>
{{< /output >}}

The list of options are as follows.

-   **clean**: This deletes the untracked files in the list the same way `git clean -f` does.
-   **filter by pattern**: This option allows users to enter exclusionary patterns. `git clean` ignores untracked files with names matching any of these patterns. For instance, the filter pattern `*.txt` tells `git clean` not to delete any untracked files ending with the `.txt` extension.
-   **select by number**: This displays a numbered list of the untracked files. Users can use these numbers to select files for deletion.
-   **ask each**: This iterates through the list of untracked files one-by-one and allows the user to choose whether or not to delete each file.
-   **quit**
-   **help**

From the main menu, users can select one of the first four options to remove files, quit interactive mode, or display the help page.

Option `1` acts exactly like `git clean -f`. It removes all untracked files and its use is self-explanatory. It is typically selected after narrowing the list of files down using one of the other methods. The character `c` also launches this option.

The second option is `filter by pattern`. It allows users to enter a pattern. Any filenames matching this pattern are ignored. This constrains and potentially reduces the number of files the `clean` option removes.

To use the `filter by pattern` option, starting from the main menu, follow these steps.

1.  Select option `2` or enter the `f` key. Git lists all the untracked files and asks for a further response.

    ```command
    2
    ```

    {{< output >}}
testfile2.txt  testfile3.md   testfile3.txt
Input ignore patterns>>
    {{< /output >}}

2.  Enter the pattern for Git to ignore. For example, to avoid deleting any Markdown files, enter the pattern `*.md`. The `*` character acts as a wild card. Any file matching this pattern is ignored while the user remains in interactive mode. Git removes the matching files from consideration and displays an updated list of eligible files.

    ```command
    *.md
    ```

    {{< output >}}
testfile2.txt  testfile3.txt
Input ignore patterns>>
    {{< /output >}}

3.  At this point, add any other patterns for Git to ignore. When all patterns have been entered, use the **ENTER** key to return to the main menu. Git then lists all files scheduled for deletion and waits for further input.

    {{< output >}}
Would remove the following items:
  testfile2.txt  testfile3.txt
*** Commands ***
    1: clean                2: filter by pattern    3: select by numbers    4: ask each             5: quit                 6: help
What now>
    {{< /output >}}

4.  To delete the list of files, enter `1` or `c`.

    ```command
    1
    ```

    {{< output >}}
Removing testfile2.txt
Removing testfile3.txt
    {{< /output >}}

It is often easier to specify the files to delete from a numbered list. Enter `3` or `s` to access the `select by numbers` menu. This option allows users to specify individual files, a range of files, or a wildcard `*` specifying all files. Only the intentionally selected files are eligible for deletion.

Starting from the main interactive menu, follow these instructions to select and delete files by number.

1.  Enter option `3` or use the `s` key to enter the `select by numbers` menu.

    ```command
    3
    ```

    {{< output >}}
1: testfile2.txt    2: testfile3.md     3: testfile3.txt
4: testfile4.txt
Select items to delete>>
    {{< /output >}}

2.  Enter the items to delete, separating them using commas. A range can also be used to select multiple sequential items, using the format `start-end`. The following response selects items `1`, `2`, and `4`, but not item `3`. Git highlights the selected files using a `*`.

    ```command
    1-2,4
    ```

    {{< output >}}
* 1: testfile2.txt  * 2: testfile3.md     3: testfile3.txt
* 4: testfile4.txt
Select items to delete>>
    {{< /output >}}

3.  Select **RETURN** to visit the main menu again. Git lists the selected files.

    {{< output >}}
Would remove the following items:
  testfile2.txt  testfile3.md   testfile4.txt
*** Commands ***
    1: clean                2: filter by pattern    3: select by numbers
    4: ask each             5: quit                 6: help
What now>
    {{< /output >}}

4.  Enter `1` or `c` to remove the selected files.

    ```command
    1
    ```

    {{< output >}}
Removing testfile2.txt
Removing testfile3.md
Removing testfile4.txt
    {{< /output >}}

The final method for deleting files is the `ask each` option. Enter either a `4` or an `a` to use this option. It lists all files, one at a time, and asks the user whether they should be deleted. Answer `y` to delete the file or `n` to skip the file.

To use the `ask each` method, follow these steps.

1.  Use the `4` or `a` key to access the `ask each` option.

    ```command
    4
    ```

2.  Git displays the first file and asks whether it should be deleted or not.

    {{< output >}}
Remove testfile2.txt [y/N]?
    {{< /output >}}

3.  Enter `y` to add the file to the deletion list.

    ```command
    y
    ```

4.  Enter `y` or `n` for each of the remaining files.

5.  After the user has reviewed every file, Git deletes all selected untracked files.

    {{< output >}}
Removing testfile2.txt
    {{< /output >}}

The remaining two options are self-explanatory. Option `5` (`q`) quits the interactive menu. Option `6` is the help menu, which can also be accessed using `h`. The help menu explains the various options.

{{< output >}}
clean               - start cleaning
filter by pattern   - exclude items from deletion
select by numbers   - select items to be deleted by numbers
ask each            - confirm each deletion (like "rm -i")
quit                - stop cleaning
help                - this screen
?                   - help for prompt selection
{{< /output >}}

## How to Remove Ignored Files Using Git Clean

The `.gitignore` file specifies which untracked files should be ignored. This is the best option for handling configuration or system files that should not be checked-in nor deleted. Users can run the `ls` command and see these files, but they do not appear in the results of commands like `git status`. This file is often created automatically and is pre-loaded with a list of common extensions to ignore. See the documentation for more information on [Git Ignore](https://git-scm.com/docs/gitignore).

`git clean` typically ignores the files and filename patterns listed in the `.gitignore` file. This matches the behavior of other Git commands, which also ignore these files by default.

However, this behavior can be overridden using either the `-x` or `-X` option. These options tell Git not to follow the standard ignore rules. This means Git can consider any files covered by `.gitignore`. However, they differ in how they handle other untracked files.

{{< note respectIndent=false >}}
Git still respects any exclusion rules added with the `-e` option.
{{< /note >}}

In the following example, any untracked `*.c` files for the project show up in `git status`. However, the `*.o` files do not. This is because the `.gitignore` file includes the pattern `*.o`. This tells Git to ignore files having this extension.

```file {title=".gitignore" lang="aconf"}
*.o
```

Ordinarily, `git clean` does not affect untracked files that match `.gitignore` patterns. Use `git clean -n` to confirm `testfile3.o` is not under consideration for deletion.

```command
git clean -n
```

{{< output >}}
Would remove testfile3.c
Would remove testfile3.txt
Would remove testfile4.txt
{{< /output >}}

To remove only the ignored files, leaving other untracked files untouched, use `git clean -f -X`. The `-X` option removes the untracked `.o` files. Developers can use this option to force a perfectly clean build.

```command
git clean -f -X
```

Git only removes the untracked files that match a pattern in `.gitignore`.

{{< output >}}
Removing testfile3.o
{{< /output >}}

To remove all untracked files, whether they are ignored or not, use the command `git clean -f -x` instead. The `-x` option removes all untracked files, including ignored files.

```command
git clean -f -x
```

{{< output >}}
Removing testfile3.c
Removing testfile3.o
Removing testfile3.txt
{{< /output >}}

## Concluding Thoughts about Removing Untracked Files in Git

This guide discusses how to use `git clean` to remove untracked files in Git. Although old untracked files do not necessarily cause any harm, they clog up a work space and create a sense of clutter and chaos. There are several methods of removing them, but the easiest way to remove an untracked file in Git is the `git clean` command. This command deletes untracked files while leaving other files untouched.

The `clean` command usually requires the force option `-f` to take effect. It also has a dry run mode and can operate recursively. `git clean` has a handy interactive mode that permits users to exclude files based on a pattern filter, or select them from a numbered list. By default, `git clean` does not delete any files matching the `.gitignore` file. However, one option targets only the untracked ignored files, while another acts on all untracked files. For more information on the `git clean` command, consult the [Git Documentation](https://git-scm.com/docs/git-clean).