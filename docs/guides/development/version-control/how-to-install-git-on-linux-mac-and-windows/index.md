---
slug: how-to-install-git-on-linux-mac-and-windows
author:
  name: Linode
  email: docs@linode.com
description: 'Git is the most popular distributed version control and source code management system. This guide shows you how to install Git on GNU/Linux, MacOSX, and Windows. You can also find some common questions and answers related to using Git.'
og_description: 'Git is the most popular distributed version control and source code management system. This guide shows you how to install Git on GNU/Linux, MacOSX, and Windows. You can also find some common questions and answers related to using Git.'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/version-control/git-source-control-management/','/development/version-control/how-to-install-git-on-mac-and-windows/','/development/version-control/how-to-install-git-on-linux-mac-and-windows/','/linux-tools/version-control/git/','/applications/development/git-source-control-management/']
modified: 2019-01-24
modified_by:
  name: Linode
published: 2009-09-04
os: ["mac", "linux", "windows"]
title: How to Install Git on Linux, Mac or Windows
external_resources:
 - '[Refspec Information](http://git-scm.com/book/ch9-5.html)'
 - '[Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)'
 - '[Pro Git Book](https://git-scm.com/book/en/v2)'
 - '[GitHub Guides](https://guides.github.com/)'
audiences: ["foundational"]
tags: ["version control system"]
---

## Introduction to Installing Git

![How to Install Git on Linux, Mac or Windows](how-to-install-git.jpg)

Git was designed and developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) for Linux kernel development. Git provides support for non-linear, distributed development, allowing multiple contributors to work on a project simultaneously. Git is the most popular distributed version control and source code management system.

This guide explains how to install the latest, stable, and prepackaged version of Git on GNU/Linux, Mac OSX, and Windows, using their respective package managers. Git can also be [compiled from source and installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git#_installing_from_source) on any operating system.

For more information about using and configuring Git, see our [Getting Started with Git](/docs/development/version-control/how-to-configure-git/) guide.

{{< note >}}
This guide uses `sudo` wherever possible. Complete the [Add a Limited User Account](/docs/guides/securing-your-server/#add-a-limited-user-account) of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account.
{{< /note >}}


## How to Install Git on Mac OSX

{{< content "how-to-install-git-mac" mac >}}

## How to Install Git on Windows

{{< content "how-to-install-git-windows" windows >}}

## How to Install Git on Linux

{{< content "how-to-install-git-linux" linux >}}

## FAQs on Installing Git

### Is Git pre-installed on Mac?

No, Git does not come pre-installed on Mac. You have to install it.

### How do I know if Git is installed?

To see if Git is installed on your system, open your terminal and type `git --version`. If your terminal returns a Git version as an output, that confirms you have Git installed on your system.

### Are Git and GitHub the same?

Git and GitHub are different. GitHub hosts Git repositories in a central location, whereas Git is a tool that manages multiple versions of source code on GitHub.

### How do I download Git for Windows?

To download Git for Windows, visit the [Downloads page](https://git-scm.com/download/win) on the Git documentation site and select the most recent version. Once you click on the version your download starts shortly.

### How to check the Git version?

To check your Git version type `git --version` and press enter in your terminal. This shows you your Git version as an output.

### How to clone a repository in Git?

Go to the repository’s page on GitHub, click on the green **Code** button, and copy the URL of the repository. To clone the repository on your system, open your Terminal and run `git clone URL`. Replace `URL` with the repository's URL.

## Get Started with Git

Visit our guide on [Git configuration](/docs/development/version-control/how-to-configure-git/) for helpful commands to get you started with Git and GitHub repositories.
