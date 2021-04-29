---
slug: using-apt-package-manager
author:
  name: Linode Community
  email: docs@linode.com
description: "APT is a user-friendly tool for package management on Debian and Ubuntu. By reading this guide you can be familiarized with APT package manager capabilities, and gets you started with its most commonly used features."
og_description: "APT is a user-friendly tool for package management on Debian and Ubuntu. By reading this guide you can be familiarized with APT package manager capabilities, and gets you started with its most commonly used features."
keywords: ['advanced package tool','apt','installing','updating','upgrading','uninstalling','removing','debian','ubuntu']
tags: ['ubuntu','apache','ssh', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-01
modified_by:
  name: Nathaniel Stickman
title: "Using APT Package Manager"
h1_title: "How to Use APT package manager"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Debian Wiki: Apt](https://wiki.debian.org/Apt)'
- '[Debian Man Pages: apt](https://manpages.debian.org/buster/apt/apt.8.en.html)'
---

The Advanced Package Tool (APT) is a tool for managing packages on Debian Linux distributions, including Ubuntu. APT uses core utilities to simplify the process of upgrading, installing, and removing software packages.

This guide aims to help you get familiar with the most frequently used APT commands for managing your server's packages. By the end of reading this guide, you should be ready for the majority of APT's uses you are likely to encounter.

{{< note >}}
You may have seen the `apt-get` command used for installing and managing packages, and the `apt-cache` command for exploring packages on Debian and Ubuntu.

However, Debian has introduced the `apt` command to consolidate the most commonly used `apt-get` and `apt-cache` commands and make their use more straightforward and user-friendly. Both Debian and Ubuntu now recommend using the `apt` command rather than `apt-get` or `apt-cache` where possible.

This guide exclusively uses the `apt` command.
{{< /note >}}

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Update the package database

Use the following command to update APT's package indices. You should run this command before installing or *upgrading* packages. If you don't update the database, the system won't know if there are new packages available or not.

        sudo apt update

When you run the above command, you can see the information retrieved from various servers.
    {{< output >}}
linode@test-main:~$ sudo apt update
Hit:1 http://mirrors.linode.com/ubuntu bionic InRelease
Get:2 http://mirrors.linode.com/ubuntu bionic-updates InRelease [88.7 kB]
Get:3 http://mirrors.linode.com/ubuntu bionic-backports InRelease [74.6 kB]
Get:4 http://mirrors.linode.com/ubuntu bionic-updates/main amd64 Packages [2,039 kB]
...
...
Fetched 11.6 MB in 3s (4,478 kB/s)
Reading package lists... Done
Building dependency tree
Reading state information... Done
32 packages can be upgraded. Run 'apt list --upgradable' to see them.
{{< /output >}}

## Upgrade Installed Packages

After installing the package database, you can use the following command to upgrade installed packages to the latest available version in APT's indices.

        sudo apt upgrade

### Upgrade a specific package

To upgrade a specific package, use the following command.

        sudo apt upgrade <package_name>

The below example upgrades the Apache package.

        sudo apt upgrade apache2

### Full upgrade

1. If you need to remove old packages or dependencies if needed to make all package installations up to date, then use the following command:
    {{< caution >}}
Be careful when using this command. Since this command can remove dependency packages, you should review the prompts it gives you thoroughly before confirming to upgrade the whole system.
{{< /caution >}}

        sudo apt full-upgrade

1. The fastest and the most convenient way to update Ubuntu or Debian system is to use the following command. Running this command before you start a new installation process ensures that APT's package indices are current and that your installed packages are up to date.

        sudo apt update && sudo apt upgrade

## Installing Packages

Use the following command to install a package.

        sudo apt install <package_name>

The following example installs the PHP package using `apt install`.

        sudo apt install php7.3

### Install multiple packages

You can install multiple packages with a single command by specifying them as a space-separated list.

        sudo apt install <package1> <package2>

For instance, the following example installs Apache, MariaDB, and PHP in a single command.

        sudo apt install apache2 mariadb-server php7.3

### Reinstall a package

APT has a dedicated command for reinstalling a package.

        sudo apt reinstall php7.3

## Uninstall Packages

Use the following command to remove a package.

        sudo apt remove <package_name>

The following example uninstalls the MariaDB package.

        sudo apt remove mariadb-server

### The `purge` command

Another way of uninstalling a package is to use the `purge` command. This command removes the package and all of its configuration and data files.
But, the `remove` command just removes the package binaries and retains the package configuration and data files.

        sudo apt purge mariadb-server

### Remove unused packages using the `autoremove` command

1. When a package is removed from the system, its dependencies stay in the system. This leftover package that is no longer needed can be removed using the following command:

        sudo apt autoremove

1. You can also auto remove a specific package and all of its dependencies by specifying the package name.

        sudo apt autoremove mariadb-server

## Useful Options

APT provides numerous options in common between its `upgrade`, `install`, `remove`, and related commands. The examples below show the most commonly used of these options and how to use them.

1. To use a specific version of a package, follow the package name with `=` and the desired package number. In this example, the APT installs version **1.19.2-1** of the Yarn package.

        sudo apt install yarn=1.19.2-1

1. Use the `-y`, or `--yes` flag if you want the APT to assume **Yes** to all prompts. In the following example, the APT installs Yarn without prompting the user to confirm any of the steps during the installation process.

        sudo apt install -y yarn

1. The `-s`, or `--simulate` flag simulates the installation process without actually installing the package. This option is useful if you want to see what a command does to avoid making any changes to the system.

    In the following example, the APT simulates upgrading the Yarn package.

        sudo apt upgrade -s yarn
    {{< output >}}
linode@test-main:~$ sudo apt upgrade -s yarn
Reading package lists... Done
Building dependency tree
Reading state information... Done
Note, selecting 'cmdtest' instead of 'yarn'
Calculating upgrade... Done
The following packages were automatically installed and are no longer required:
  linux-headers-4.15.0-112 linux-headers-4.15.0-112-generic linux-image-4.15.0-112-generic linux-modules-4.15.0-112-generic linux-modules-extra-4.15.0-112-generic
Use 'sudo apt autoremove' to remove them.
The following NEW packages will be installed:
  cmdtest python-chardet python-cliapp python-markdown python-pkg-resources python-pygments python-ttystatus python-yaml
0 upgraded, 8 newly installed, 0 to remove and 0 not upgraded.
Inst python-yaml (3.12-1build2 Ubuntu:18.04/bionic [amd64])
Inst python-cliapp (1.20170827-1 Ubuntu:18.04/bionic [all])
Inst python-ttystatus (0.38-1 Ubuntu:18.04/bionic [all])
Inst python-markdown (2.6.9-1 Ubuntu:18.04/bionic [all])
Inst cmdtest (0.32-1 Ubuntu:18.04/bionic [all])
Inst python-pkg-resources (39.0.1-2 Ubuntu:18.04/bionic [all])
Inst python-chardet (3.0.4-1 Ubuntu:18.04/bionic [all])
Inst python-pygments (2.2.0+dfsg-1ubuntu0.2 Ubuntu:18.04/bionic-updates, Ubuntu:18.04/bionic-security [all])
Conf python-yaml (3.12-1build2 Ubuntu:18.04/bionic [amd64])
Conf python-cliapp (1.20170827-1 Ubuntu:18.04/bionic [all])
Conf python-ttystatus (0.38-1 Ubuntu:18.04/bionic [all])
Conf python-markdown (2.6.9-1 Ubuntu:18.04/bionic [all])
Conf cmdtest (0.32-1 Ubuntu:18.04/bionic [all])
Conf python-pkg-resources (39.0.1-2 Ubuntu:18.04/bionic [all])
Conf python-chardet (3.0.4-1 Ubuntu:18.04/bionic [all])
Conf python-pygments (2.2.0+dfsg-1ubuntu0.2 Ubuntu:18.04/bionic-updates, Ubuntu:18.04/bionic-security [all])
{{< /output >}}

## Search, List, and Retrieve Packages

### Search for a specific package

1. You can search APT's repositories for specific packages or libraries containing a given string.

        sudo apt search <search-term>

    The following example searches for all packages containing `git`.

        sudo apt search git

1. APT's search function not only searches the package name but also queries descriptive information about packages.

    The following command also finds the Git package:

        sudo apt search version control

### List packages

You can use the `list` command to list the available, installed, and upgradeable packages.

        sudo apt list

### Retrieve package information

To fetch the full information related to a specific package, use the following command:

        sudo apt show git

### Retrieve package version & its repository

To check the installed package version and the repository that it belongs to, use the following command:

        sudo apt policy git

{{< note >}}
The apt software repositories are listed in `/etc/apt/sources.list` file and/or under `/etc/apt/sources.list.d` directory.

Below are some guides that you can refer to see how you can add apt repositories.

* [Install NGINX on Debian from the Official NGINX Repository](/docs/guides/install-nginx-debian/)
* [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/)
{{< /note >}}

## Conclusion

Having studied this guide, you should be armed for the vast majority of cases where you are likely to use APT on your Debian or Ubuntu server. However, if you need more advanced knowledge of APT, check out the Debian [main page for APT](https://manpages.debian.org/buster/apt/apt.8.en.html) for detailed and thorough documentation on APT commands.
