---
slug: using-apt-package-manager
author:
  name: Linode Community
  email: docs@linode.com
description: "APT is a user-friendly tool for package management on Debian and Ubuntu. This guide covers the capabilities of the APT package manager, and gets you started with its most commonly used features."
og_description: "APT is a user-friendly tool for package management on Debian and Ubuntu. This guide covers the capabilities of the APT package manager, and gets you started with its most commonly used features."
keywords: ['advanced package tool','apt','installing','updating','upgrading','uninstalling','removing','debian','ubuntu']
tags: ['ubuntu','apache', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-04
modified_by:
  name: Nathaniel Stickman
title: "How to Use the APT Package Manager"
h1_title: "Using the APT Package Manager"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Debian Wiki: Apt](https://wiki.debian.org/Apt)'
- '[Debian Man Pages: apt](https://manpages.debian.org/buster/apt/apt.8.en.html)'
---

The Advanced Package Tool (APT) is a system for managing packages on Debian or Debian-derived Linux distributions, like Ubuntu. APT uses core utilities to simplify the process of upgrading, installing, and removing software packages. This guide helps you become familiar with the most frequently used APT commands for managing your server's packages.

{{< note >}}
You may have used the `apt-get` command to install and manage packages, and the `apt-cache` command to explore packages on Debian and Ubuntu. However, Debian has introduced the `apt` command to consolidate the most commonly used `apt-get` and `apt-cache` commands and make their use more straightforward and user-friendly. Both Debian and Ubuntu now recommend using the `apt` command rather than `apt-get` or `apt-cache` where possible. This guide exclusively uses the `apt` command.
{{< /note >}}

## Update the Package Database

Use APT's `update` command to update its package indices. You should run this command before installing or *upgrading* packages. Updating your system's APT database ensures that you can install and update your system packages to their most recent versions.

    sudo apt update

When you run the `update` command, your output displays information retrieved from the image servers.

{{< output >}}
Hit:1 http://mirrors.linode.com/ubuntu bionic InRelease
Get:2 http://mirrors.linode.com/ubuntu bionic-updates InRelease [88.7 kB]
Get:3 http://mirrors.linode.com/ubuntu bionic-backports InRelease [74.6 kB]
Get:4 http://mirrors.linode.com/ubuntu bionic-updates/main amd64 Packages [2,039 kB]
...
...
Fetched 11.6 MB in 3s (4,478 kB/s)
Reading package lists... Done
Building dependency tree.
Reading state information... Done
32 packages can be upgraded. Run 'apt list --upgradable' to see them.
{{</ output >}}

## Upgrade Installed Packages

After updating your system's APT package database, use the following command to upgrade installed packages to the latest available version.

    sudo apt upgrade

### Upgrade a Specific Package

To upgrade a specific package, use the following command:

    sudo apt upgrade <package_name>

For example, to upgrade your system's Apache package you use the following command:

    sudo apt upgrade apache2

### Upgrade All Packages

APT's *full upgrade* option upgrades the packages on your system and also handles package dependencies. This command handles removing old packages and dependencies if required by a package upgrade.

{{< caution >}}
Since this command can remove dependency packages, you should review the prompts it gives you thoroughly before confirming to upgrade the whole system.
{{< /caution >}}

    sudo apt full-upgrade

The fastest and the most convenient way to update packages on Debian and Ubuntu systems is to use the following two commands.

    sudo apt update && sudo apt upgrade

You should run these commands before you start a new installation process. This ensures that APT's package indices are current and that your installed packages are up to date.

## Install Packages

Use the following command to install a package.

    sudo apt install <package_name>

The following example installs the PHP package using `apt install`.

    sudo apt install php7.3

### Install Multiple Packages

You can install multiple packages with a single command by specifying them as a space-separated list.

    sudo apt install <package1> <package2>

For instance, the following example installs Apache, MariaDB, and PHP using a single command.

    sudo apt install apache2 mariadb-server php7.3

### Reinstall a Package

APT has a dedicated command for reinstalling a package.

    sudo apt reinstall php7.3

## Uninstall Packages

Use the following command to remove a package.

    sudo apt remove <package_name>

The following example uninstalls the MariaDB package.

    sudo apt remove mariadb-server

{{< note >}}
The `remove` command removes the package binaries and retains the package configuration and data files.
{{</ note >}}

### The `apt purge` Command

Another way of uninstalling a package is to use the `purge` command. This command removes the package and all of its configuration and data files.

    sudo apt purge mariadb-server

### Remove Unused Packages Using the `autoremove` Command

When a package is removed from the system, its dependencies stay in the system. The leftover packages that are no longer needed can be removed using the following command:

    sudo apt autoremove

You can also auto remove a specific package and all of its dependencies by specifying the package name.

    sudo apt autoremove mariadb-server

## Useful Options

APT provides numerous options in common between its `upgrade`, `install`, `remove`, and related commands. The examples below include the most commonly used of these options and how to use them.

To use a specific version of a package, follow the package name with `=` and the desired package number. In this example, APT installs version **1.19.2-1** of the Yarn package.

    sudo apt install yarn=1.19.2-1

Use the `-y`, or `--yes` flag if you want APT to assume **Yes** to all prompts. In the following example, APT installs Yarn without prompting the user to confirm any of the steps during the installation process.

    sudo apt install -y yarn

The `-s`, or `--simulate` flag simulates the installation process without actually installing the package. This option is useful if you want to see what a command does before making any changes to the system.

In the following example, APT simulates upgrading the Yarn package.

    sudo apt upgrade -s yarn

{{< output >}}
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

### Search for a Specific Package

You can search APT's repositories for specific packages or libraries containing a given string.

    sudo apt search <search-term>

The following example searches for all packages containing `git`.

    sudo apt search git

APT's search function not only searches the package name but also queries descriptive information about packages.

The following command also finds the Git package:

    sudo apt search version control

### List Packages

You can use the `list` command to list the available, installed, and upgradeable packages.

    sudo apt list

### Retrieve Package Information

To fetch all information related to a specific package, use the following command:

    sudo apt show git

### Retrieve Package Version and the Package Repository

To check the installed package version and the repository that it belongs to, use the following command:

    sudo apt policy git

{{< note >}}
APT software repositories are listed in `/etc/apt/sources.list` file and/or under the `/etc/apt/sources.list.d` directory.

Below are some guides that you can refer to see how you can add apt repositories.

* [Install NGINX on Debian from the Official NGINX Repository](/docs/guides/install-nginx-debian/)
* [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/)
{{< /note >}}

## Conclusion

This guide walked you through the most frequently used APT commands to manage packages on your Debian or Ubuntu server. If you need more in-depth information, check out the Debian [man pages for APT](https://manpages.debian.org/buster/apt/apt.8.en.html) for detailed, and thorough documentation on APT commands.
