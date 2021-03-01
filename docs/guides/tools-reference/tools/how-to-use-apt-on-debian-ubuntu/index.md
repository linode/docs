---
slug: how-to-use-apt-on-debian-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: 'APT, the package manager on Debian and Ubuntu, '
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['advanced package tool','apt','installing','updating','upgrading','uninstalling','removing','debian','ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-01
modified_by:
  name: Nathaniel Stickman
title: "How to Use APT on Debian and Ubuntu"
h1_title: "How to Use APT on Debian and Ubuntu"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Debian Wiki: Apt](https://wiki.debian.org/Apt)'
- '[Debian Man Pages: apt](https://manpages.debian.org/buster/apt/apt.8.en.html)'
- '[Ubuntu Man Pages: apt](https://manpages.ubuntu.com/manpages/focal/man8/apt.8.html)'
---

The Advanced Package Tool — or APT — is a tool for managing packages on Debian Linux distributions, including Ubuntu. APT uses core utilities to simplify the process of upgrading, installing, and removing software packages.

This guide aims to help you get familiar with the most frequently used APT commands for managing your server's packages. By the end, you should be ready for the majority of APT's uses you are likely to encounter.

{{< note >}}
You may have seen the `apt-get` command used for installing and managing packages and the `apt-cache` command for exploring packages on Debian and Ubuntu. However, years back, Debian introduced the `apt` command to consolidate the most commonly used `apt-get` and `apt-cache` commands and make their use more straightforward and user-friendly. Both Debian and Ubuntu now recommend using the `apt` command rather than `apt-get` or `apt-cache` where possible.

All of the APT commands in this guide are available using `apt`, so this guide exclusively uses the `apt` command.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Upgrading Packages

1. Use the following command to update APT's package indices. You should run this command before installing or upgrading packages, as it ensures that you are installing/upgrading to the most recent packages in APT's repositories:

        sudo apt update

1. Use the following command to upgrade installed packages to the latest versions in APT's indices:

        sudo apt upgrade

1. You can use a command like the following to upgrade a specific package. This example upgrades the Apache package:

        sudo apt upgrade apache2

1. If you need to upgrade packages in a more comprehensive way, use the following command. This command does additional work to handling package dependencies, installing and removing dependencies as needed to make all package installations up to date:

    {{< note >}}
Because this command can remove dependency packages, you should review the prompts it gives you thoroughly before confirming the upgrade.
    {{< /note >}}

        sudo apt full-upgrade

1. You are likely to see a command like the following at the beginning of many Debian/Ubuntu guides. Running this command before you start a new installation process ensures that APT's package indices are current and that your installed packages are up to date:

        sudo apt update && sudo apt upgrade

## Installing Packages

1. Use a command like the following to install a package with APT. This example installs the PHP package:

        sudo apt install php7.3

1. APT has a dedicated command for reinstalling a package:

        sudo apt reinstall php7.3

## Uninstalling Packages

1. Use the following command to remove a package — the MariaDB package in this example:

        sudo apt remove mariadb-server

1. The above command retains the removed package's configuration and data files. While this makes it easier to pick a package back up if you install it again later, it may not be as thorough as you want. You can use a command like the following to remove a package and all of its configuration and data files:

        sudo apt purge mariadb-server

1. The following command can be used to automatically remove packages that are no longer needed, such as packages that were installed as dependencies for another package that you have since removed:

        sudo apt autoremove

    You can also specify a package with this command. In this case, the command removes the specified package and all of its dependencies:

        sudo apt autoremove mariadb-server

## Useful Options

APT provides numerous options in common between its `upgrade`, `install`, `remove`, and related commands. The examples below show the most commonly used of these options and how to use them.

1. You can provide a list of packages, separated by spaces, where you would normally provide the package name. For instance, the following installs Apache, MariaDB, and PHP in a single command:

        sudo apt install apache2 mariadb-server php7.3

1. To use a specific version of a package, follow the package name with `=` and the desired package number. This works with any of the APT commands where you designate a package name. In this example, APT installs version **1.19.2-1** of the Yarn package:

        sudo apt intall yarn=1.19.2-1

1. Use the `-y`, or `--yes`, flag to have APT assume **Yes** as the answer to all prompts. In the following example, APT installs Yarn without prompting the user to confirm any steps in the installation process, such as when it needs to install dependencies:

        sudo apt install -y yarn

1. The `-s`, or `--simulate`, flag has APT conduct a dry run of the given command. This option is useful if you want to see what a command does avoid making any changes to the system. In the following example, APT provides the output as if it were upgrading the Yarn package:

        sudp apt upgrade -s yarn

## Navigating Packages

1. You can search APT's repositories for packages containing a given string. The following example searches for all packages containing `git`:

        sudo apt search git

    APT's search function also queries descriptive information about packages, not just the package names. The following command also finds the Git package:

        sudo apt search version control

1. You can use the following command to list the packages you have installed and see their statuses — which ones are up to date and which have upgrades available:

        sudo apt list

1. To get full information related to a specific package, use a command like the following. APT can fetch information for any package in its repositories, whether the package is installed or not:

        sudo apt show git

1. Use a command like the following to check what version of a package is installed — if the package is installed — and what repository it belongs to:

        sudo apt policy git

    {{< note >}}
Additional repositories may be added to APT, with these repositories being listed in `/etc/apt/sources.list` and/or `/etc/apt/sources.list.d`. The methods for adding repositories varies, but you can see some examples in the [Install NGINX on Debian from the Official NGINX Repository](/docs/guides/install-nginx-debian/) and the [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/) guides.
    {{< /note >}}

## Conclusion

Having studied this guide, you should be armed for the vast majority of cases where you are likely to use APT on your Debian or Ubuntu server. If you come to a situation where you need more advanced knowledge of APT, however, check out the Debian [man page for APT](https://manpages.debian.org/buster/apt/apt.8.en.html). It links to the `apt-get` and `apt-cache` pages, where Debian keeps detailed and thorough documentation APT's commands and the options available for them.
