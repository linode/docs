---
slug: how-to-configure-git
author:
  name: Linode
  email: docs@linode.com
description: 'Learn the basics of distributed version control and source code management tool Git in this guide.'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb", "gitolite", "ubuntu", "debian", "arch", "gentoo"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-15
modified_by:
  name: Linode
published: 2009-09-04
title: Getting Started with Git
external_resources:
 - '[Refspec Information](https://git-scm.com/book/en/v2/Git-Internals-The-Refspec)'
 - '[Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)'
 - '[Pro Git Book](https://git-scm.com/book/en/v2)'
 - '[Github Guides](https://guides.github.com/)'
audiences: ["foundational"]
tags: ["version control system"]
aliases: ['/development/version-control/how-to-configure-git/']
---

![Git Started Today](git_getting_started.png)

## What is Git?

Git is a distributed version control system. Git was designed and developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) for Linux kernel development. Git provides support for non-linear, distributed development, allowing multiple contributors to work on a project simultaneously. Git is the most popular distributed version control and source code management system. This guide will walk you through the basics of getting started with Git, from installing the software to using basic commands on both local and remote repositories (repo).

{{< note >}}
If you are new to version control systems (VCS), see our guide [SVN vs Git: Which Version Control System Should You Use?](/docs/guides/svn-vs-git/) to learn more about each VCS.
{{</ note >}}

## Configure Git

After you [install Git](/docs/development/version-control/how-to-install-git-on-mac-and-windows), configure it for first time use using `git config`, a built-in tool that obtains and sets configuration variables. These configuration variables are located in three different places on a GNU/Linux system:

 - `/etc/gitconfig` - stores the configuration information for all system users and their respective repositories.
 - `~/.gitconfig` - stores user-specific configuration files on the system.
 - `.git/config` - this is the configuration file of your current working repository.

For a Windows system, the `.gitconfig` file is located in the `$HOME` directory of the user's profile. The full path is `C:\Document and Settings\$USER` or `C:\Users\$USER`

After installing Git make sure your username and email address are set correctly. To verify, use the command:

    git config --list

If your name and email are not listed in the output, use the following commands to set them manually, replacing `examplename` and `user@example.com`:

    git config --global user.name examplename
    git config --global user.email user@example.com

Set your default text editor, replacing `editor-name` with your desired editor:

    git config --global core.editor editor-name

The output of `git config --list` should show echo the information you inputted:

    $ git config --list
    user.name=exampleuser
    user.email=user@email.com
    core.editor=editor-name

## Use Git with a Local Repository

A *repository*, or repo, is a collection of files and folders and the history of their changes. Changes are tracked through *commits*, which are like snapshots of a file at various points in the file's history. These commits are not automatic, you need to manually stage a commit after each of series of file changes. Commits allow you to refer or revert back to a place in the file's timeline if there are bugs or errors in your code.

If you have an new or existing project and you want to start using Git to keep track of its changes, run `git init` from the existing project's directory:

    git init

`git init` creates a new `.git` subdirectory in the current directory. This is where Git stores your configurations. The `git add` command tells Git to add a file to the repository and track that file's changes:

    git add filename

After you have added the file, stage a commit and leave a commit message. Commit messages serve as a reminder of the changes that were made to a file:

    git commit -m "Initialized a Git repository for this project. Tracking changes to a file."

{{< note >}}
It's good practice to provide clear and descriptive commit messages for every commit you stage, as this helps collaborators to understand what a commit encompasses.
{{< /note >}}

There may be files or folders in your project directory that you do not wish to include in your Git repository. You can include these files in a `.gitignore` file, and Git will ignore them. A sample `.gitignore` file might look like the following:

{{< file ".gitignore" >}}
.DS_Store
*.zip
__doNotInclude__/
{{< /file >}}

To learn how to undo Git commit, see our guide [How to Undo a Git Commit: A Step-by-Step Guide](/docs/guides/how-to-undo-git-commit/).

### Basic Git Commands

This table lists basic commands, a description, and an example of the command in use:

| Command           | Description                                                                           | Example                    |
|:------------------|:--------------------------------------------------------------------------------------|:---------------------------|
| `git add`         | Add a file to a repository.                                                           | `git add filename`         |
| `git rm`          | Remove a file from a repository.                                                      | `git rm filename`          |
| `git mv`          | Move or rename a tracked file, directory, or symlink.                                 | `git mv file_from file_to` |
| `git branch`      | List all the local and remote branches.                                               | `git branch branchname`    |
| `git commit`      | Commit all staged objects. Optionally, you can append a message with the `-m` flag.   | `git commit -m "updates"`  |
| `git pull`        | Download all changes from the remote repo and merge them in a specified repo file.    | `git pull repo refspec`    |
| `git push`        | Publish the changes to the remote repo.                                               | `git push repo`            |

### Branches

*Branches* are used for editing files without disturbing the working portions of a project. The main branch is normally named `master` and is usually reserved for clean, working code. When making changes to your code, it's customary to create a new branch and name it after the issue being fixed or the feature being implemented. Because Git keep tracks of file changes, you can jump from branch to branch without overwriting or interfering with other branches in the repo.

The basic options used with the `git branch` command are:

| Option   | Description                         |
|:---------|:------------------------------------|
| -r       | List the remote branches            |
| -a       | Show both local and remote branches |
| -m       | Rename an old branch                |
| -d       | Delete a branch                     |
| -r -d    | Delete a remote branch              |

### Example Usage

Consider an application with a single `master` branch. The author of the application wants to develop a new search feature. They would add a new feature branch:

    git branch new-search-feature

Then, they would switch to that branch using the `checkout` command:

    git checkout new-search-feature

Now they can safely develop and commit their changes to this feature branch without altering the working code of the `master` branch. At any time they could switch back to the `master` branch:

    git checkout master

A shortcut for creating a branch and switching to that branch is to use the `-b` flag with the `checkout` command:

    git checkout -b new-search-feature

Once the new search feature is finalized, the author of the application can merge the `new-search-feature` branch into the `master` branch:

    git checkout master
    git merge new-search-feature

Now the `master` branch has the new search feature.

## Use Git with a Remote Repository

[GitHub](https://github.com), [GitLab](https://gitlab.com), and [Bitbucket](https://bitbucket.org/) all provide ways to store Git repositories remotely and facilitate collaboration. Many of these services also include a number of other features that are vital to content development, including pull requests, continuous integration / continuous delivery pipelines (CI/CD), wikis, and webhooks. If you'd rather use a self-hosted solution, GitLab and [Gogs](https://gogs.io/) offer free locally hosted versions of their software that can easily be managed on a Linode. Check out our guides on [installing GitLab](/docs/guides/install-gitlab-on-ubuntu-18-04/) and [installing Gogs](/docs/guides/install-gogs-on-debian/) for more information on hosting your own remote repository software. GitHub and Bitbucket also offer paid enterprise versions of their software for local hosting. When discussing remote repositories, usually one of the aforementioned services is being referenced.

This section provides some basic information on navigating remote Git repositories.

To copy every file from a remote repository to your local system, use `git clone` followed by the remote repository's URL:

    git clone https://github.com/linode/docs.git

You can typically find a remote repository's URL by clicking on the *Clone* or *Download* buttons of a remote repository's user interface.

To check the status of the files within the current branch of your repository, use `status`:

    git status

The output of the `status` command will tell you if any tracked files have been modified.

Use `remote` to view which remote servers are configured:

    git remote

The `remote` command will display the short names of your remote repositories. If your repository was cloned, you will see a repository called `origin`. The default name origin comes from the cloned repository. To view more information about the remote repositories, use the command:

    git remote -v

### Git Remote Repository Commands

Below are some basic commands for working with remote repositories:

| Command                                   | Description                                                         |
|:------------------------------------------|:--------------------------------------------------------------------|
| `git remote add [remote-name] [url]`      | Add a new remote repository.                                        |
| `git fetch [repository [refspec]]`        | Gather all the data from a remote project that you do not have yet. |
| `git pull`                                | Obtain and merge a remote branch into your current branch.          |
| `git push [remote-name] [branch-name]`    | Move your data from your branch to your server.                     |
| `git remote show [remote-name]`           | Display information about the remote you specified.                 |
| `git remote rename [old-name] [new-name]` | Rename a remote.                                                    |
| `git remote rm [name]`                    | Remove the remote you specified.                                    |

### Example Usage

Continuing the example posed in the previous section, let's say that someone wants to add a functionality to an application in a remote repository. The first step would be to *fork* that repository. This feature, like cloning, is usually available in the user interface of the remote repository software. Forking creates a remote repository, which is a copy of the forked repository, on the user's own account. From their the user would clone the fork locally use the `clone` command discussed above.

    git clone https://github.com/username/Spoon-Knife.git

Once the repository is cloned, the user would create a branch for the new feature using either the `branch` or `checkout -b` command.

    git checkout -b new-special-feature

After the branch is made, the user would make the necessary updates or changes to the codebase, and commit them.

    git commit -m "A new special feature"

With the commit staged, the user would then push their changes to their fork of the remote repository:

    git push origin new-special-feature

The result of the push command is that now the new feature branch exists on the user's fork. To contribute those changes to the initial repository, known as the upstream repository, the user must now submit a *pull request* (PR). A PR is a feature that most remote repository software has that allows the user to safely contribute a commit, or series of commits, to an upstream repository. This is accomplished by navigating through the user interface to the pull requests page, selecting the master branch of the upstream repository as the target, and selecting the origin repository's feature branch as the source. A pull request will be created and the code will be up for review before being merged into the master branch of the upstream repository.

While creating PRs is a healthy standard within the development community, it is not the only way to contribute to a remote repository. You could simply push your commits directly to the upstream repository:

    git push my-repo new-special-feature

The downside of this approach is that there is no option to hold the pushed commits for review. However, if you are the only contributor to a project then obviously there will be no one to review your changes, so creating a fork and contributing PRs is not necessary.

If you are collaborating with another developer, it is necessary to be able to retrieve their work. To do so, issue the `pull` command:

    git checkout new-special-feature
    git pull

Git will grab the new code from the chosen remote repository branch and merge it into your local branch.

{{< note >}}
Sometimes two developers will edit the same section of a file at the same time and attempt to merge their changes into the codebase. When this happens, Git will throw an error called a *merge conflict*. Because Git will be unable to determine which set of changes is the correct set of changes, it will prompt you to fix the merge conflict before it moves forward with the merge.
{{< /note >}}

