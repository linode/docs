---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn the basics of Git in this guide. Discover one of the most popular distributed version control and source code management systems that make contributing to projects and working with a team easy.'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb", "gitolite", "ubuntu", "debian", "arch", "gentoo"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-07-03
modified_by:
  name: Linode
published: 2009-09-04
title: Getting Started with Git
external_resources:
 - '[Refspec Information](http://git-scm.com/book/ch9-5.html)'
 - '[Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)'
 - '[Pro Git Book](https://git-scm.com/book/en/v2)'
 - '[Github Guides](https://guides.github.com/)'
---

![Git Started Today](/docs/assets/git_getting_started.png)

# What is Git?

Git was designed and developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) for Linux kernel development. Git provides support for non-linear, distributed development, allowing multiple contributors to work on a project simultaneously. Git is the most popular distributed version control and source code management system. This guide will walk you through the basics of getting started with Git, from installing the software to using basic commands on both local and remote repositories (repo).

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

    MacBook-Pro:~ user$ git config --list
    user.name=exampleuser
    user.email=user@email.com
    core.editor=editor-name

## Work with an Existing Local Repository (Repo)

If you have an existing project and you want to start using Git to keep track of its changes, run `git init` from the existing project's directory:

    git init

`git init` creates a new `.git` subdirectory in the current directory. This is where Git stores your configurations. The `git add` command tells Git to track changes of files:

    git add filename

After you have added the file, stage a commit and leave a commit message. Commit message serve as a reminder of the changes that were made to a file:

    git commit -m "Initialized a Git repository for this project. tracking changes to a file"

### Basic Git Commands

This table lists basic commands, a description, and an example of the command in use:

| Command           | Description                                                                           | Example                    |
|:------------------|:--------------------------------------------------------------------------------------|:---------------------------|
| `git add`         | Add a file to a repository.                                                           | `git add filename`         |
| `git rm`          | Remove a file from a repository.                                                      | `git rm filename`          |
| `git mv`          | Move or rename a tracked file, directory, or symlink.                                 | `git mv file_from file_to` |
| `git branch`      | List all the local and remote branches.                                               | `git branch branchname`    |
| `git commit`      | Commit all staged objects.                                                            | `git commit -m "updates"`  |
| `git pull`        | Download all changes from the remote repo and merge them in a specified repo file.    | `git pull repo refspec`    |
| `git push`        | Publish the changes to the remote repo.                                               | `git push repo`            |
|-------------------|---------------------------------------------------------------------------------------|----------------------------|

### Branches

Branches are used for editing files without disturbing the working portions of a project. The main branch is normally named `master`, it's customary to name the branch after an issue being fixed or a feature being implemented. Because Git keep tracks of file changes, you can jump from branch to branch without overwriting or interfering with other branches in the repo.

The basic options used with the `git branch` command are:

| Option   | Description                         |
|:---------|:------------------------------------|
| -r       | List the remote branches            |
| -a       | Show both local and remote branches |
| -m       | Rename an old branch                |
| -d       | Delete a branch                     |
| -r -d    | Delete a remote branch              |
|----------|-------------------------------------|

## Working with Remote Repositories

Remote repositories are hosted on a network or another location on the Internet. This section provides some basic information on navigating remote Git repositories.

To copy every file from a remote repository to your local system, use `git clone` followed by the remote repo's URL:

    git clone remoteurl

To check the status of the files within the current branch of your repository, use `status`:

    git status

The output of the `status` command will tell you if any tracked files have been modified.

Use `remote` to view which remote servers are configured:

    git remote

The `remote` command will display the short names of your remote repositories. If your repository was cloned, you will see a repository called `origin`. The default name origin comes from the cloned repository. To view more information about the remote repositories, use the command:

    git remote -v

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
|-------------------------------------------|---------------------------------------------------------------------|
