---
slug: subversion-svn-tutorial
author:
  name: Cameron Laird
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-09
modified_by:
  name: Linode
title: "Learn to Use the Subversion Client"
h1_title: "SVN Tutorial: Using the Subversion Client"
enable_h1: true
contributor:
  name: Cameron Laird
  link: https://twitter.com/Phaseit
---

[Subversion is a free/open source version control system (VCS)](https://svnbook.red-bean.com/en/1.7/svn.intro.whatis.html), that manages source code for projects. At one time, Subversion (SVN) was believed to be the most widely-used VCS. While SVN has surrendered that primacy to Git over the last decade, hundreds of thousands of projects still use SVN. It’s also generally regarded as simpler than Git for many use cases. Have you been asked to work on an SVN project, and don't know where to begin? This guide provides an introduction to SVN along with common commands.

A basic SVN project has a single central repository, and one or more clients that connect to the repository remotely. In this model, the repository is an authoritative reference for the project’s source code. Developers who work with the source code use clients to update their own local copies of the source code. If you want to contribute to a project version controlled with SVN, you need to install an SVN client. This allows you to access the project from your own desktop.

The communication protocol used between repository and client is public. This has made development of a large number of distinct clients possible. This particular guide focuses on the standard command-line interface (CLI) SVN client for Linux, on an Ubuntu system. Alternative Subversion clients have similar capabilities, although they appear under different names including "Tortoise", "Trac", "Rabbit", and so on. All clients support the operations below, however they may use different commands.

## Install the Subversion Client on Ubuntu and Debian

This section shows you how to install the SVN CLI on Ubuntu and Debian systems.

1. Update your system:

    sudo apt-get update

1. Install the latest version of the standard Subversion software:

    sudo apt-get install subversion -y

1. Confirm the installation by viewing the version of the installed SVN CLI

    svn --version

    The output should display version `1.7` or higher.

    {{< output >}}
svn, version 1.7 …”
    {{</ output >}}

## SVN Commands

Typical usage of the SVN client includes the following:

- Asking the repository for a complete copy of the current source of a particular project;
- Creating a branch in the project; and
- Updating one or more files in the central repository as a commit or changeset.

Each of these operations appear in the sections below in more detail.

Keep in mind the basic architecture mentioned earlier: a single central Subversion repository is common and authoritative between all a project’s developers. While you work on your copy of the project, other programmers might be working with their own copies of the same project. You only interact with the central repository. SVN communicates directly with the central repository; each time you launch SVN, you’re in a dialogue between your client and the central repository.

### SVN Checkout Command: Create a Local Copy of your Project

The “Subversion book” referenced at the beginning of this guide is maintained as an SVN project. You can access your own local copy of the project--all the sources, and all history of their revisions--with the following commands:

1. In your home directory, *Check out* a copy of all the project sources:

        svn co https://svn.code.sf.net/p/svnbook/source

    {{< note >}}
You can also use the `checkout` command in place of `co`:

        svn checkout https://svn.code.sf.net/p/svnbook/source
    {{</ note >}}

    This command creates a copy of the the SVN book source on your local machine. The files are located in the `~/username/source/` directory, along with several administrative files.

1. Navigate to the subdirectory where the Subversion client places all the sources

        cd source

{{< note >}}
This same recipe works for hundreds of thousands of projects beyond the source to the Subversion book. In general, you start to work with each new SVN project with a command like:

    svn co $URL

{{</ note >}}

In addition to `https`, SVN supports `http`, `svn`, and `svn+ssh`. For example to access a project with the svn+ssh protocol, use the following URL
`svn+ssh://$SERVER/sources/$PROJECT`.

Many projects are *multi-ported*: they support another VCS interface in addition to SVN. For example, GitHub supports SVN access along with Git.

### SVN Create a Branch Command

To create branches and tags in your SVN project use the following command:

        svn copy https://example.com/MyRepo/trunk https://example.com/MyRepo/branches/MyNewBranch -m "Creat a new branch"

When issuing this command you create a new branch from your project's remote repository.

Many development teams work in branches. This workflow resembles the following:

- Identify a specific enhancement or correction to complete;
- Create a copy of the project in a branch, separate from the reference copy of the project;
- Work in the branch until the enhancement is complete; and finally
- Merge the branch back to the authoritative trunk which is the permanent home of the project.

The SVN book’s layout in your local filesystem exemplifies this structure. Directories look like this:

- ~/username/source/trunk
- ~/username/source/branches/1.0
- ~/username/source/branches/1.1

You can use the following command to create local branch for the backup-and-recovery explanation of the SVN book using the following command:

    cd ~/username/source
    svn copy trunk branches/2.0

At this point, you find a `~/username/branches/2.0/` subdirectory, with a copy of the latest *trunk* sources. You can change the files under that subdirectory, add new ones, and so on.

### SVN Commit

When working on a development project you are likely to need to make changes to the reference copy of the project. In VCS terminology, you want to commit the edits you have made back to the repository.

{{< note >}}
You can’t actually commit to the SVN book’s repository; you haven’t been granted rights to do so. The steps below illustrate an example of a commit that could work, with the right permissions.
{{</ note >}}

1. Make sure you're working from the source directory the SVN client created on your local machine.

        cd ~/username/source

1. Use a preferred text editor to edit the `~/username/source/trunk/en/book/ch05-repository-admin.xml` file. Change the line `“<title>Repository Administration</title>` to `<title>Updated Repository Administration</title>`.

1. Commit the updated source file back to the repository.

        svn commit trunk/en/book/ch05-repository-admin.xml -m "A one-word change."

    At this point, the Subversion client demands a password you don’t have. If you did have a password, though, you could update the copy of chapter 5 in the project’s trunk. Normally, however you might not commit directly to the trunk of a project and instead, you would commit to a branch of the project. In practice, you should work with the project's administrator to determine the exact workflow to use. For example, to commit to a branch, you can use the following command:

         svn commit ~/username/sources/branches/2.0/en/book/ch05-repository-admin.xml -m "A one-word change."

## Conclusion

You now know enough about the Subversion command-line interface client to examine and update an SVN-based project. You have succeeded specifically with the checkout, branch, and copy subcommands, and at least “warmed up” to the commit subcommand. You have a little perspective on typical SVN workflows, and how to learn more. Perhaps most crucially, you know that to do any real work with Subversion, you need an administrator to:

- Provide you a specific URL for initial project access; and
- Allow read and write access to the project from your account, with your password.

The SVN client has a couple dozen different subcommands, including ones to examine files’ history, relocate their location within a project, and more. [The official SVN documentation](https://subversion.apache.org/docs/) gives ample details on all these, as well as pointers to many related commands and facilities.