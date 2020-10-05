---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Git on Linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["linux", "git", "version"]
modified: 2017-01-05
modified_by:
  name: Sam Foo
title: "How to install Git on Linux"
published: 2018-01-08
headless: true
show_on_rss_feed: false
tags: ["version control system"]
aliases: ['/development/version-control/how-to-install-git-linux/']
---

- Debian and Ubuntu:

        sudo apt-get install git

- CentOS:

        sudo yum install git

- Fedora:

        sudo yum install git-core

- Arch Linux:

        sudo pacman -Sy git

- Gentoo:

        sudo emerge --ask --verbose dev-vcs/git
