---
author:
  name: Linode
  email: docs@linode.com
description: 'Getting Started with Git'
keywords: 'git,dvcs,vcs,scm,gitweb,gitolite,ubuntu,debian,arch,gentoo'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['linux-tools/version-control/git/','applications/development/git-source-control-management/','development/version-control/git-source-control-management/']
modified: Thursday, June 6, 2017
modified_by:
  name: Linode
published: 'Friday, September 4th, 2009'
title: Getting Started with Git 
---

# Getting Started with Git


Git was designed and developed by Linus Torvalds for Linux kernel development. Git Provides support for non-linear, distributed development. Git is the most popular distributed version control and source code management system. This guide will walk you through the basics of getting started with Git.

## Configure Git

After [installing Git]('https://www.linode.com/docs/development/version-control/how-to-install-git-source-control-on-mac-and-windows), you will need to configure Git for first time use. `git config` is a built in tool that obtains and sets configuration variables. These configuration variables are located in three different places on a GNU/Linux system:

-   `/etc/gitconfig` - stores the configuration information for all system users and their respective repositories.
-   `~/.gitconfig` - stores user-specific configuration files on the system.
-   `.git/config` - this is the configuration file of your current working repository.

For a Windows system, the `.gitconfig` file is located in the `$HOME` directory of the user's profile. The full path is `C:\Document and Settings\$USER` or `C:\Users\$USER`

After installing Git make sure your username and email address are set correctly. To verify, use the command:

    git config --list

If your name and email are not listed in the output, you may set them manually. Use the following command to set your name, replacing `name` with your name:

    git config --global user.name name

To set your email address, use this command, replace `user@example.com` with your email address:

    git config --global user.email user@example.com

Set your default text editor next, replacing `editor-name` with your desired editor:

    git config --global core.editor editor-name

The output of `git config --list` should show echo the information you inputted:

    MacBook-Pro:~ user$ git config --list
    user.name=user
    user.email=user@email.com
    core.editor=editor-name

## Work with the local Repository

If you have an existing project and you want to start using Git to keep track of its changes, you will need to run the command from the existing project's directory:

    git init

`Git init` creates a new `.git` subdirectory in the current directory, this is where Git stores your configurations. The `git add` command tells Git to track changes of files. 

    git add filename

After you have added the file, you have to stage a commit and leave a commit message. The commit message can serve as a reminder of the changes that were made to a file. 

    git commit -m "Initialized a Git repository for this project. tracking changes to a file" 



### Basic Git Commands

This table lists basic commands, a description, and an example of the command in use: 

{: .table .table-striped }
| Command              | Description                                                                           | Example                        |
|:---------------------|:--------------------------------------------------------------------------------------|:-------------------------------|
| `git add`            | adds a file to a repository                                                           | `git add filename`           |
| `git rm`             | removes a file from a repository                                                      | `git rm filename`            |
| `git mv`             | moves or renames a tracked file, directory, or symlink                                | `git mv file_from file_to` |
| `git branch`         | lists all the local and remote branches                                               | `git branch branchname`     |
| `git commit`         | commits all staged objects                                                            | `git commit -m "updates"`     |
| `git pull`           | downloads all changes from the remote repo and merges them in a specified repo file   | `git pull repo refspec`    |
| `git push`           | publishes the changes to the remote repo                                              | `git push repo`              |
|
|----------------------|---------------------------------------------------------------------------------------|--------------------------------|

### Branches

Branches are used for editing files without disturbing the working portions of a project. The main branch is normally named `master`, it's customary to name the branch after an issue being fixed or a feature being implemented. Because Git keep tracks of file changes, you can jump from branch to branch and without overwriting or interfering with other branches in the repository.


The basic options used with the `git branch` command are listed below:

{: .table .table-striped}
| Option   | Description                          |
|:---------|:-------------------------------------|
| -r       | lists the remote branches            |
| -a       | shows both local and remote branches |
| -m       | renames an old branch                |
| -d       | deletes a branch                     |
| -r -d    | deletes a remote branch              |
|----------|--------------------------------------|


## Working with Remote Repositories

Remote repositories are hosted on a network or another location on the Internet.This section will provide some basic information on navigating remote Git repositories.


To copy a remote Git repository use the command:

    git clone

`git clone` copies every file in the repository. Remote repositories have urls, that can be used to `clone` the repository to your local system. 

    git clone url

To check the status of the files within your repository use the `status` command:

    git status

The output of the `status` command will tell you if any tracked files have been modified.

To view which remote servers are configured, use the command:

    git remote

The `remote` flag will display the short names of your remote repositories. If your repository was cloned, you will see a repository called `origin`. The default name origin comes from the cloned repository. To view more information about the remote repositories, use the command:

    git remote -v

Below are some basic commands for working with remote repositories:

{: .table .table-striped }
| Command                                   | Description                                                         |
|:------------------------------------------|:--------------------------------------------------------------------|
| `git remote add [remote-name] [url]`      | adds a new remote repository                                        |
| `git fetch [repository [refspec]]`        | gathers all the data from a remote project that you do not have yet |
| `git pull`                                | obtains and merges a remote branch into your current branch         |
| `git push [remote-name] [branch-name]`    | moves your data from your branch to your server                     |
| `git remote show [remote-name]`           | displays information about the remote you specified                 |
| `git remote rename [old-name] [new-name]` | renames a remote                                                    |
| `git remote rm [name]`                    | removes the remote you specified                                    |
|-------------------------------------------|---------------------------------------------------------------------|





## More Information on Git

Git is complicated. Luckily, there are plenty of resources to help you find your way. 
Consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.


- [Refspec Information](http://git-scm.com/book/ch9-5.html)
- [Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Github Guides](https://guides.github.com/)

