---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing git on GNU/Linux, MacOSX, and Windows'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/version-control/git/','applications/development/git-source-control-management/','development/version-control/git-source-control-management/','development/version-control/how-to-install-git-on-mac-and-windows/']
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
 - '[Github Guides](https://guides.github.com/)'
audiences: ["foundational"]
---

## Introduction to Git

![How to Install Git on Linux, Mac or Windows](how-to-install-git.jpg)

Git was designed and developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) for Linux kernel development. Git provides support for non-linear, distributed development, allowing multiple contributors to work on a project simultaneously. Git is the most popular distributed version control and source code management system.

This guide explains how to install the latest, stable, prepackaged version `git` on GNU/Linux, Mac Osx, and Windows, using their respective package managers. Git can also be [compiled from source and installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git#_installing_from_source) on any operating system.

For more information about using and configuring Git, see our [Getting Started with Git](/docs/development/version-control/how-to-configure-git/) guide.

{{< note >}}
This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account.
{{< /note >}}


## Install Git

{{< content "how-to-install-git-linux" linux >}}

{{< content "how-to-install-git-mac" mac >}}

{{< content "how-to-install-git-windows" windows >}}

## Get Started with Git

Visit our guide on [Git configuration](/docs/development/version-control/how-to-configure-git/) for helpful commands to get you started with Git and repositories.
