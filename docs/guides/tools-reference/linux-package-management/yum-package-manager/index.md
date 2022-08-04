---
slug: yum-package-manager
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide walks you through the core features of YUM and commands for using YUM to install, upgrade, and remove packages on your system."
og_description: "This guide walks you through the core features of YUM and commands for using YUM to install, upgrade, and remove packages on your system."
keywords: ['yum','installing','updating','upgrading','uninstalling','removing','package repositories','centos']
tags: ['yum',centos',]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
image: YUM1.jpg
modified: 2021-07-15
modified_by:
  name: Linode
title: "How to Use YUM to Manage Packages in CentOS/RHEL 7 and Earlier"
h1_title: "Using YUM to Manage Packages in CentOS/RHEL 7 and Earlier"
enable_h1: true
aliases: ['/guides/how-to-use-yum/']
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[YUM Package Manager](http://yum.baseurl.org/)'
---

*Yellowdog Updater, Modified*, more commonly known as **YUM**, is a package management tool for a variety of Linux distributions. It provides an easy-to-use interface on top of the low-level functions available in the RPM Package Manger (RPM). YUM is the default package manager for CentOS 7 as well as older versions of RHEL and Fedora. It has largely been replaced by it successor *Dandified YUM*, also called **DNF**, on most newer RPM-based distributions, including CentOS 8, RHEL 8, and Fedora 22 (and later). If you are interested in learning about the DNF package manager, see the [Using the DNF Package Manager](/docs/guides/dnf-package-manager/) guide.

This guide aims to familiarize you with the YUM commands you are most likely to encounter. By the end, you should feel comfortable navigating YUM in all but its more advanced features. And for those, you can find some helpful resources at the end of this guide.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running on CentOS/RHEL 7, Fedora 21, or earlier versions of either distribution.** Other Linux distributions that employ the YUM package manager can also be used. Review the [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/). Review the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Upgrading Packages

1.  Use the following command to update your installed packages:

        sudo yum update

    It is usually a good idea to run this command before you begin a new installation of any kind, ensuring that your installed packages are up to date. In fact, you are likely to see this command at the beginning of many installation guides and the like for CentOS.

1.  You can list the installed packages for which updates are available using the following command:

        sudo yum list updates

1.  To update a specific package, use the `update` command. This example updates the Apache package:

        sudo yum update httpd

## Installing Packages

1.  Use the `install` command like the one below to install a package. This example installs the PHP package:

        sudo yum install php

1.  You can reinstall a package using the `reinstall` command, like the following:

        sudo yum reinstall php

## Uninstalling Packages

1.  Use the `remove` command, like the following, to uninstall a package — the MariaDB package in this example:

        sudo yum remove mariadb-server

1.  To remove a package and all of the dependency packages that were installed alongside it, use the `autoremove` command:

        sudo yum autoremove mariadb-server

    Using the `autoremove` command without specifying a package identifies and removes system dependencies that are no longer needed:

        sudo yum autoremove

## Useful Options

YUM provides numerous options in common between many of its commands. The examples below show the most commonly used of these options.

1.  You can provide a list of packages, separated by spaces, where you would normally provide a package name. For instance, the following installs Apache, PHP, and MariaDB in a single command:

        sudo yum install httpd php mariadb-server

1.  To use a specific version of a package, follow the package name with `-` and the desired version number. This works with any of the YUM commands where you designate a package name. This example installs version **0.3.8** of the NeoVim package:

        sudo yum install neovim-0.3.8

    To identify the available versions of a package, use the `--showdupicates` option with the `list` command and the specific package's name:

        sudo yum list neovim --showduplicates

1.  Use the `-y`, or `--assumeyes`, flag to have YUM assume **Yes** to any prompts it would otherwise present. In the following example, YUM installs NeoVim without prompting the user to confirm any steps in the installation process, such as when it needs to install dependencies:

        sudo yum install neovim -y

## Navigating Packages

1.  Use the following command to list all packages in YUM's repositories:

        sudo yum list

    YUM's `list` command provides some additional options to list more specific groups of packages. Here are three useful examples. You can find another example in the [Useful Options](/docs/guides/how-to-use-yum/#useful-options) section above.

    The `available` option lists all of the packages that can be installed on your system through YUM's repositories:

        sudo yum list available

    The `installed` option lists all of the packages currently installed on your system:

        sudo yum list installed

    The `recent` option lists packages added to the YUM repositories in the past week:

        sudo yum list recent

1.  You can search YUM's available packages using a command like the following. Here, the command finds packages that have the term `git` in their metadata:

        sudo yum search git

    The `search` command supports multiple arguments separated by spaces. You can use this to search for multiple keywords:

        sudo yum search version control

1.  If you want to find a package based on a specific command it provides, you can use a YUM command like the following. This example finds packages that provide a `pip3` command, which includes Python 3 packages:

        sudo yum provides pip3

1.  Use a command like the following to get additional details about a package — here, about the Python 3 package:

        sudo yum info python36

1.  YUM also provides a command for getting a list of dependencies for a given package:

        sudo yum deplist python36

## Adding Repositories

Like other Linux package managers, YUM allows you to add repositories in addition to its default ones. The process varies depending on the repository being added, but this guide focuses on [Extra Packages for Enterprise Linux (EPEL)](https://fedoraproject.org/wiki/EPEL). Fedora maintains the EPEL repository to offer additional high-quality packages for RHEL systems, including CentOS, and it is perhaps the most frequently added repository for YUM.

The steps below show you how to add the EPEL repository to YUM and gives you an example of its use.

1.  The EPEL repository is available as a package from the default YUM repositories. Install it with the following command:

        sudo yum install epel-release

1.  You can verify that the EPEL repository is in use with the following command. You should see a line for EPEL on the resulting list:

        sudo yum repolist

1.  Once the repository has been added, you can install packages from it as you would from the default repositories. This example installs Nagios, which is available in the EPEL repository but not in YUM's default repositories:

        sudo yum install nagios

## Conclusion

With the information in this guide, you should be armed for the majority of cases in which you are likely to use YUM on your CentOS server. If you come to a situation where you need more advanced knowledge of YUM, you can use the `help` command. By itself, the command provides general information:

    sudo yum help

For more information on a specific command and a list of the command's options, follow `help` with the command you want to know more about. This example gets information on the `repolist` command:

    sudo yum help repolist

You can also check out the official YUM [documentation](http://yum.baseurl.org/). And, for even more advanced package management, take a look at YUM's supplementary [RPM documentation](http://yum.baseurl.org/wiki/RpmCommands.html).

