---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Bazaar version management system.'
keywords: ["bzr", "bazaar", "vcs", "scm", "dcvs"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/version-control/bazaar/','applications/development/manage-distributed-source-branches-with-bazaar/']
modified: 2011-05-23
modified_by:
  name: Linode
published: 2010-01-18
title: Manage Distributed Source Branches with Bazaar
external_resources:
 - '[The Bazaar Project](http://bazaar.canonical.com/en/)'
 - '[Official Bazaar User Documentation](http://doc.bazaar.canonical.com/latest/en/user-guide/)'
---

Bazaar is a distributed version control system similar to [git](/docs/linux-tools/version-control/git). Bazaar allows developers to track the progress of source code and collaborate on a single object of work without depending on a centralized server to coordinate their activity. Unlike git, Bazaar's interface will be familiar to users of a centralized version control system like [Subversion](/docs/linux-tools/version-control/svn).

Like all distributed version control systems, Bazaar can work "offline," and does not require a connection to a central repository to perform commits, consult previous versions of the history, or perform other operations on the local "branch" of project. Publishing "branches" is also straightforward.

This document provides an introduction to all aspects of the Bazaar version control system: beginning with the installation of Bazaar, moving through several standard Bazaar-based workflows and concluding with a review of common Bazaar commands. However, before we begin discussing the use and operating of Bazaar we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts), the [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Installing Bazaar

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Because there is no server component for Bazaar, you only need to install Bazaar on the systems that need to interact with the contents of the Bazaar repository. If you are only storing a copy of your project on your Linode you needn't install Bazaar on that system.

If you do need to manipulate Bazaar projects on your Debian or Ubuntu powered-Linode, or use a Debian or Ubuntu system for your work you can install Bazaar with the following command:

    apt-get install bzr

On Ubuntu, install bzrtools and a Python plugin called Paramiko: type:

    apt-get install bzrtools python-paramiko

If you need to use Bazaar on your CentOS-powered Linode, you must enable the [EPEL](https://fedoraproject.org/wiki/EPEL) repository before installing Bazaar. Issue the following sequence of commands:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm
    yum install bzr bzrtools

For Gentoo systems you can install Bazaar by issuing the following command:

    emerge dev-util/bzr
    emerge dev-util/bzrtools
    emerge dev-python/paramiko

To install Bazaar on Arch Linux systems, issue the following command:

    pacman -S bzr bzrtools paramiko

The Bazaar developers also provide application builds for [Windows](http://wiki.bazaar.canonical.com/WindowsDownloads) and [Mac OS X](http://wiki.bazaar.canonical.com/MacOSXDownloads) that include all of the software necessary for running Bazaar. Additionally these application contain a number of GUI tools for manipulating projects managed with Bazaar. You can learn more about [3rd party tools](http://wiki.bazaar.canonical.com/3rdPartyTools) for using Bazaar on the upstream wiki.

## Using Bazaar to Manage Projects

This section covers many common operations and tasks that you may encounter during typical Bazaar usage. This will guide you through common Bazaar workflows: beginning with branch creation creating a branch, continuing with creating commits to that branch and an overview of common usage scenarios, and finally concluding with branch publication. Consider the following section for a more direct guide to individual [Bazaar commands](/docs/development/version-control/manage-distributed-source-branches-with-bazaar#common-bazaar-commands).

### Initializing a Project and Creating Commits

To manage a new project with Bazaar, issue the following sequence of commands:

    mkdir caper/
    cd caper/
    echo "Readme, Initial Commit" > README
    bzr init

This creates the directory `caper/` in the current directory, moves into that directory. The `echo` command creates the `README` file with some example text. Finally the `bzr init` makes this directory a versioned branch.

Since Bazaar is not yet aware of the `README` file, it is unable to manage this file. Issue the `bzr status` command to check on the status of the current branch. The result will resemble the following:

    unknown:
    README

To make Bazaar aware of this file issue the `bzr add` command. When successful, Bazaar will offer the following output: `added README`. By default Bazaar will add all unknown files. However, if you only want to add some files, but not others in the current directory, you can specify those file names as arguments to the `bzr add` command. To add *only* the `README` file, issue the following command:

    bzr add README

If you run the `bzr status` command here, you would see the following:

    added:
    README

To create a commit, or save local changes to the Bazaar branch, issue the `bzr commit` command. This will open a text editor so you may create a commit message. Commit messages give allow you to describe the changes since the last commit. These notes can help your team understand the work. After creating, saving, and exiting the editor, Bazaar will output the following message to inform you that the commit was successful:

    Committed revision 1.

Commits in Bazaar are stored sequentially and identified by their number. You can use this number later to reference this moment in your project's history. If you would like to create a commit without needing to open a text editor you can use a command in the following form:

    bzr commit -m "Created new README file"

To see Bazaar's log of your commit issue the `bzr log` command. The output will be similar to the following:

    $ bzr log
    ------------------------------------------------------------
    revno: 1
    committer: username <username@example.com>
    branch nick: caper
    timestamp: Fri 2010-01-08 21:45:31 +0000
    message:
      Created new README file

At any point during your work with a Bazaar managed project you can issue the command `bzr diff` to see the difference between the current state of your repositories files and the last commit to the repository. Use this command liberally to compare the state of your current changeset relative to the last committed changeset before you create new commits and while you work.

### Publishing Branches

While Bazaar is capable of maintaining project histories on a single system for a single user, distributed version control systems like Bazaar are epically designed for coordinating the efforts of multiple contributors working on multiple systems. Bazaar provides a number of methods for collaborating with other developers.

The simplest way to share changes between users is to generate a patch using the `bzr diff` command. Consider the command:

    bzr diff -r12..20 > ~/new-feature.r20.patch

This creates a file named `new-feature.r20.patch` that you can distribute to your collaborators. The option `-r12..20` specifies that the "base revision" of the patch is revision number 12 and the final commit to be included in the patch is revision number 20. In turn, you collaborators can use the following command to apply your patch:

    bzr patch ~/new--feature.r20.patch

Bazaar also includes the ability to use more "centralized" workflows, which allows contributors to a project to have a single shared repository that the entire team can use to publish changes. Shared repositories allow for a more fluid method of sharing changes between developers making it feasible for team members to always have the most up to date iteration of a document, without impacting individual workflows. To create a shared remote Bazaar project issue a command in the following form:

    bzr init-repo --no-trees sftp://username@example.com/srv/bzr/morris-shared

In this command, the `init-repo` command with the `--no-trees` option, creates a new empty repository on the remote machine without a working copy. In this example `username` would be replaced with your username, `example.com` would correspond with the domain name of your server, and `/svn/bzr/morris-shared` would be the path for the new repository on the remote server. To publish changes to the remote repository issue the following command:

    bzr push sftp://username@example.com/srv/bzr/morris-shared

The `push` command sends local updates to the remote Bazaar project. If the remote project *does* have a working copy (i.e. it was created without the `--no-trees` option.), `push` will not update the working copy of the receiving project. Bazaar uses the `sftp` protocol, which is included by default with OpenSSH and is in turn active by default on all Linode systems. If your repository does not have a default remote, Bazaar will set the first location that you successfully push to as the default. Append the option `--remember` to `push` operations change the default remote location of your local repository.

Once published you can allow others to create local branches from this centralized repository. On the remote systems issue the following command:

    bzr branch sftp://fore@example.com/srv/bzr/morris-shared

In this case, your system will need a user account for the user `fore` and additional user accounts for whatever users that require access to your project. Be sure to deploy [user groups and permissions](/docs/tools-reference/linux-users-and-groups) with prudence. You can also offer read only access to a Bazaar repository over HTTP by configuring a [web-server](/docs/web-servers) to provide access to the Bazaar project. Simply alter the branch command to resemble the following, depending on your web server configuration:

    bzr branch http://bzr.example.com/morris-shared

Throughout the course of working on the project, contributors will commit changes on their local machines and push these changes to the central instance of the project. In order to maintain an up to date copy of the project, users must regularly "pull" changes from the central repository and update the current working copy. The easiest way to accomplish this is to issue the following command:

    bzr pull http://bzr.example.com/morris-shared

This command fetches and integrates changes to the remote repository into the current repository and updates the working copy to reflect the most up to date revision of the remote repository. This **only** works when the local branch has not diverged from the remote branch and the only updates needed are "fast-forwards." If your local repository has a default remote repository, then you can omit the location specified in this command.

If there have been commits published to the remote repository *and* commits to the local branch, then pull will not succeed. To merge the divergent branches, issue the following command:

    bzr merge http://bzr.example.com/morris-shared

The `merge` command uses a three-way-merge system to integrate the histories of both the remote repository and the local repository. Often Bazaar is able to perform the merge automatically without intervention from a user. Sometimes, however, the change sets overlap too much and Bazaar is unable to resolve the conflicts. In these cases, you must manually resolve the changes to the files. When the merge has completed and the new merged state of the project is satisfactory, create a commit to save the merged state of the repository.

Bazaar will *never* create a "merge commit" following a merge, and it is a good idea to create a commit at this point in your project's history. While some version control systems automatically create a commit if the merge succeeds without conflict, Bazaar does not. Rather, Bazaar allows individual commits to function as markers of known states, and acknowledges that automated merges, even if they don't raise conflicts, are not always "successful." When merges produce conflict, use the `bzr resolve` command to inform Bazaar that the conflicts have been resolved. When the state of the repository has recovered from the merge, you can run `bzr push` to publish your changes.

At this point, the basic workflow repeats through a sequence of `pull`, `commit`, `merge` and `push` operations depending on the needs and processes that you and your collaborators deploy. If a merge, or any other operation, creates any unintended or undesirable operation, you can use the `bzr revert` command to "rewind" the state of the repository. Without argument, this will simply revert the state of the working copy to the last commit. To revert further, issue a command in the following form:

    bzr revert -r42

In this example, `-r42` tells Bazaar to revert to revision number 42. If you only want to revert a single file or group of files, you can append these files as arguments at the end of the revert command. See below for a more comprehensive list of commands.

## Common Bazaar Commands

The following list of commands provides an outline of common Bazaar operations including the commands used above:

-   `bzr init` initializes Bazaar management for the current directory, and all sub-directories.
-   `bzr add` makes all unknown files in the current directory known to Bazaar, and will cause them to be included in the next commit. You can specify individual files as arguments to `bzr add` if you want to selectively add files to the system.
-   `bzr status` generates a report of the current state of the local branch.
-   `bzr commit` opens a text editor to allow you to enter a message, and then creates a commit or saves the changeset in the Bazaar project.
-   `bzr commit -m "[commit-message]"` creates a commit with the message `[commit-message]`.
-   `bzr mv [versioned-file] [new-location]` moves the `[versioned-file]` to the location specified by `[new-location]`.
-   `bzr remove [file]` removes the specified file or files. If there are changes to the file in the current working copy, Bazaar **will not** delete the file and will instead make the file unknown to the project and unversioned. If the current copy of the specified file has been unchanged since the last commit, Bazaar will make the file unknown to the project and remove the file. The history of the removed file will remain in Bazaar's database.
-   `bzr log` generates a log of every commit in sequence and outputs this log to standard out.
-   `bzr help [command]` the Bazaar `help` command provides embedded documentation that can help you understand the syntax and usage of a specific command.
-   `bzr merge [location]` instructs Bazaar to merge changes from the branch specified by `[location]` into the working copy. The location may specify either a local branch of the current working copy or a remote branch published on the Internet. This uses a three-way-merge algorithm to automatically merge changes; however, manual intervention is sometimes required when both branches have overlapping changes. When the merge has been completed, you must then run a `bzr commit` to save the merge in the repository.
-   `bzr pull` performs a fast-forward update of the local working copy from its branch parent. Fast-forward updates are ones where the most recent commit in the local copy is "behind" the most recent update to the remote branch.
-   `bzr update` merges the contents of the remote branch into the local branch and may cause conflicts if Bazaar's three-way-merge cannot resolve the commits automatically. If there are uncommitted changes to the working copy before the `update` they will still need to be committed afterwords.
-   `bzr push` performs the equivalent of a `bzr update` on the remote mirror of the branch. This does not update the working copy of that branch.
-   `bzr uncommit` "rewinds" the branch to the last commit, but does not alter any of the files in the working copy. Use this option to change commit messages or collapse a series of commits into a single change set. Specify the `--revision=[revision-number]` option to rewind the branch to an arbitrary commit.
-   `bzr revert [file]` takes the specified file and reverts the contents of that file to the previous version of the file as contained in the previous commit. Specify the `--revision=[revision-number]` option to revert a file to an arbitrary commit. Bazaar will backup reverted changes unless the `--no-backup` option is used.
