---
slug: subversion-svn-tutorial
author:
  name: Cameron Laird
description: 'This guide shows you how to install the Subversion client and how to use the most essential SVN commands. These commands include checking out a branch and commiting your working copy changes.'
keywords: ['svn tutorial, svn commands']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-14
modified_by:
  name: Linode
title: "SVN Tutorial: Installing and Using the Subversion CLI Client"
h1_title: "How to Install and Use the Subversion CLI Client"
enable_h1: true
contributor:
  name: Cameron Laird
  link: https://twitter.com/Phaseit
---

Subversion (SVN) is a *centralized version control system* (VCS) that can be used to collaborate on the development of software projects. A centralized version control system uses a single remote instance of a project to stores its versioned data. This instance can also be referred to as a *repository*.

Project collaborators make local shallow copies of the repository and make changes using their local working copy. This version control system stands in contrast to a *distributed version control system* (DVCS), like Git. In a DVCS, users maintain complete local copies of a project and collaborate by exchanging changesets made to those local copies.

Users who want to collaborate on a Subversion project must install a Subversion client on their local machine. You use the local Subversion client to manage your changes and "publish" them to the project repository. This guide shows you how to install the Subversion CLI client on an Ubuntu system and provides commands to get you started collaborating on a Subversion project.

{{< note >}}
See our [How to Install Apache Subversion on Ubuntu 20.04](/docs/guides/install-apache-subversion-ubuntu/) guide to learn how to install and configure a Subversion server. A Subversion server can store and version control multiple projects.

If you are new to version control systems (VCS), see our guide [SVN vs Git: Which Version Control System Should You Use?](/docs/guides/svn-vs-git/) to learn more about each VCS.
{{</ note >}}

## Install the Subversion Client on Ubuntu

1. Update your system:

        sudo apt-get update

1. Install the latest version of the standard Subversion software:

        sudo apt-get install subversion -y

1. Confirm the installation by viewing the version of the installed SVN CLI:

        svn --version

    The output should display version `1.7` or higher.

    {{< output >}}
svn, version 1.10.4 (r1850624)
   compiled Feb 10 2021, 20:15:45 on x86_64-pc-linux-gnu
...
    {{</ output >}}

## Subversion CLI Commands

The Subversion CLI includes all the functionality you need to support your SVN workflow. It provides several subcommands that accept options to further modify each subcommand's behavior. The sections below include the essential Subversion commands you need to start collaborating on a Subversion project.

### Create a Subversion Working Copy with the Checkout Command

When you begin collaborating on a Subversion project, you need to create a local *working copy* of the project. Your private working copy of the project enables you to modify the project's files and create multiple working copies of the project. Your changes are not pushed to the primary SVN repository and made available to other collaborators until you *commit* them.

To create a working copy of an SVN project use the `checkout` subcommand. You should know the URL of the SVN repository you wish to copy. The syntax for this subcommand is as follows:

    svn checkout <http://example-subversion-server.com/repos/exampl_project/>

For example, to create a working copy of the entire [Version Control with Subversion](https://svnbook.red-bean.com/) Book's repository, use the following command:

    svn checkout https://svn.code.sf.net/p/svnbook/source

In the same way you checkout out an entire repository, you can checkout an individual file, directory, or trunk. To checkout an individual file, include its path:

    svn checkout <http://example-subversion-server.com/repos/exampl_project/trunk/example_file.txt> <target_local_directory>

You can also use the short-hand version of the `checkout` command:

    svn co https://svn.code.sf.net/p/svnbook/source

The example command creates a copy of the Version Control with Subversion book's source files on your local machine. If you issued the command from your home directory, you see a new directory named `~/username/source/`. Change into your new working copy and view its contents:

    cd source && ls -A

You should see the following files and directories:

{{< output >}}
branches  README  .svn  tags  trunk  www
{{</ output >}}

In addition to the project files, you have a directory named `.svn`. This is your working copy's *administrative directory* that stores all the files needed by Subversion to manage and keep track of your local changes.

The directories included in a Subversion project are a matter of convention. Typically, the `trunk` directory is where the *main line* of development happens within a Subversion repository. While the `branch` directory stores subdirectories, known as *branches*, with feature code that was made using the project's `trunk` as its base. This enables large changes to take place within a `branch` without disrupting the `trunk` of the project. Subversion project branches can be merged back into the `trunk`.

### Creating a Subversion Branch

You may want to create a new *branch* of your Subversion project's trunk in order to develop a new feature. Creating a branch enables you to develop your feature without disturbing other collaborators. In this way, you can frequently commit to the new branch that you create in the Subversion project without disturbing the trunk.

To create a new branch use the `copy` subcommand to create a local copy of the Subversion project's trunk. The command copies the contents of your project's `trunk` directory and creates a new directory in your working copy's `branches` directory. The branch name is the one you assign to it. For example:

    svn copy <http://example-subversion-server.com/repos/exampl_project/trunk> \
             <http://example-subversion-server.com/repos/exampl_project/branches/new-branch-name> \
        -m "Commit message"

When you issue the command to create a new branch, you create a commit in the Subversion repository and a new directory and revision is created.

To start working on your new branch, use the `checkout` subcommand to check out a new working copy of your new branch:

    svn checkout http://example-subversion-server.com/repos/exampl_project/branches/new-branch-name

### Updating a Subversion Working Copy

It's important to update your local Subversion working copy so that it's synced with the project's latest revision. This is how your working copy receives the latest updates by your collaborators.

To update your working copy, use the following command:

    svn update

After issuing the command, your working copy should contain any changes from the latest revision.

### Making Changes to a Subversion Working Copy

In the context of Subversion, there are two types of changes you can make to the working copy; *file changes* and *tree changes*. Any change made to a file's content is considered a file change. A tree change is any change made to a directory's structure. This includes adding and removing files, renaming files or directories, and copying files or directories to new locations.

To make a tree change, you must *schedule* the changes using one of the subcommands in the list below. Once scheduled, the changes are propagated to the main Subversion repository only when you commit the changes.

| Command | Scheduled Tree Change |
| ------- | ----------- |
| `svn add file_dir_name` | Schedules a file, directory, or symbolic link to be added to the repository. |
| `svn delete file_dir_name` | Schedules a file, directory, or symbolic link to be deleted from the repository. |
| `svn copy file_dir_name copied_file_dir_name` | Copies the source file or directory and schedules the copied file or directory to be added to the repository. |
| `svn move file_dir_name moved_file_dir_name` | Moves the file to the new location and assigns the defined name. Schedules the new file to be added and the original source file to be deleted from the repository. |
| `svn mkdir dir_name` | Schedule a new directory to be add to the repository. |

When you make a file change, SVN automatically detects it and propagates the changes to the repository when you commit them.

### Viewing Information About a Working Copy

When working locally, there are several Subversion CLI commands that help you access information about the repository and your working copy. You may want to know information about your current checkout, view the state of any modified or added files, or view the changes made to a specific file.

To view information about working copy's current checkout, use the following command:

    svn info

Your output includes the information displayed below:

{{< output >}}
Path: .
Working Copy Root Path: /home/example_user/source
URL: https://svn.code.sf.net/p/svnbook/source
Relative URL: ^/
Repository Root: https://svn.code.sf.net/p/svnbook/source
Repository UUID: b70f5e92-ccc6-4167-9ab2-d027528d294b
Revision: 6050
Node Kind: directory
Schedule: normal
Last Changed Author: jensmf
Last Changed Rev: 6050
Last Changed Date: 2021-10-18 06:11:07 +0000 (Mon, 18 Oct 2021)
{{</ output >}}

To view the current state of files in your working copy, use the `status` subcommand:

    svn status

The status command displays information about any modified, added, or deleted files along with a status code. The following status codes are used by SVN:

| Status Code | Meaning |
| ----------- | ------- |
| `?` | The file, directory, or symbolic link item is not under version control. |
| `C` | The file contains conflicts. This occurs when an update is performed locally and the changes received from the Subversion repository contains overlapping changes. You must address the conflict before you can commit your changes to the repository. |
| `D` | The file, directory, or symbolic link is scheduled for deletion from the repository. |
| `M` | The file has been modified. |

You can use the `status` subcommand's verbose option to view the status of all files and directories in your working copy.

    svn status -v

Another useful `status`option is the `--show-updates` option. This option displays which of the modified items in your working copy have also been changed in the main SVN repository. An asterisk (`*`) denotes a change in the SVN repository. For example:

    svn -show-updates -v

{{< output >}}
M      *        20        23    jane     README
M      *        44        35    john     example_dir/example_file.txt
                44        35    john     example_dir_2/example_file_2.txt

Status against revision:   46
{{</ output >}}

In the example output, `README` and `example_dir/example_file.txt` both have been modified in the working copy and in the SVN repository.

To view the changes that were made to a specific file use the `diff` subcommand.

    svn diff <filename>

The information provided resembles the following output:

{{< output >}}

Index: README
===================================================================
--- README	(revision 6050)
+++ README	(working copy)
@@ -1,4 +1,4 @@
-This is the source code repository for "the Subversion book", also
+This is a change. This is the source code repository for "the Subversion book", also
 known as "Version Control with Subversion".  This repository is
 organized like so:
{{</ output >}}

### Committing Changes to a Subversion Repository

Once you are satisfied with any changes you have made to your working copy, you are ready to commit them to the Subversion repository. To commit your changes, use the following command:

    svn commit -m 'My commit message'

This is the final step in a typical Subversion workflow. Your local changes are now available in the Subversion repository and other collaborators can update their working copies to obtain those changes.

## Conclusion

The commands included in this guide give you the basics needed to get started collaborating on a Subversion version controlled project. Consult the [Version Control with Subversion Book](https://svnbook.red-bean.com/) to learn more subcommands and conceptual topics related to managing a Subversion repository.
