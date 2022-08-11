---
slug: apt-package-manager
author:
  name: Linode
  email: docs@linode.com
description: "This guide will teach you what APT is and walks you through the core features and common commands for using APT to manage packages on Linux."
og_description: "This guide will teach you what APT is and walks you through the core features and common commands for using APT to manage packages on Linux."
keywords: ['apt', 'apt-get','installing','updating','upgrading','uninstalling','removing','package repositories','debian', 'ubuntu']
tags: ['apt','apt-get','debian','ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-12
image: UsingAPTtoManagePackagesinDebianandUbuntu.jpg
modified: 2022-01-31
modified_by:
  name: Linode
title: "How to Use APT to Manage Packages in Debian and Ubuntu"
h1_title: "Using APT to Manage Packages in Debian and Ubuntu"
enable_h1: true
aliases: ['/guides/using-apt-package-manager/']
---

*Advanced Package Tool*, more commonly known as [**APT**](https://en.wikipedia.org/wiki/APT_(software)), is a package management system for Ubuntu, Debian, Kali Linux, and other Debian-based Linux distributions. It acts as a front-end to the lower-level [**dpkg**](https://en.wikipedia.org/wiki/Dpkg) package manager, which is used for installing, managing, and providing information on `.deb` packages. In addition to these functions, APT interfaces with repositories to obtain packages and also provides very efficient dependency management.

Most distributions that use APT also include a collection of command-line tools that can be used to interface with APT. These tools include `apt-get`, `apt-cache`, and the newer `apt`, which essentially combines both of the previous tools with some modified functionality. Other package managers and tools also exist for interacting with APT or dpkg. A popular one is called [Aptitude](https://en.wikipedia.org/wiki/Aptitude_(software)). Aptitude includes both a command-line interface as well as an interactive user interface. While it does offer advanced functionality, it is not commonly installed by default and is not covered in this guide.

This guide aims to walk you through using APT and its command-line tools to perform common functions related to package management. The commands and examples used throughout this guide default to using the `apt` command. Many of the commands interchangeable with either `apt-get` or `apt-cache`, though there may be breaking differences.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running on Debian or Ubuntu.** Other Linux distributions that employ the APT package manager can also be used. Review the [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/). Review the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## What's the difference between `apt` and `apt-get`/`apt-cache`?

While there are more similarities than differences, there are a few important points to consider when decided which command to use.

- [`apt`](http://manpages.ubuntu.com/manpages/impish/en/man8/apt.8.html): A newer end-user tool that consolidates the functionality of both `apt-get` and `apt-cache`. Compared to the others, the `apt` tool is more straightforward and user-friendly. It also has some extra features, such as a status bar and the ability to list packages. Both Ubuntu and Debian recommend the `apt` command over `apt-get` and `apt-cache`. See [apt Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt.8.html)
- `apt-get` and `apt-cache`: The `apt-get` command manages the installation, upgrades, and removal of packages (and their dependencies). The `apt-cache` command is used to search for packages and retrieve details about a package. Updates to these commands are designed to never introduce breaking changes, even at the expense of the user experience. The output works well for machine readability and these commands are best limited to use within scripts. See [apt-get Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt-get.8.html) and [apt-cache Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt-cache.8.html).

In short, `apt` is a single tool that encompasses most of the functionality of other APT-specific tooling. It is designed primarily for interacting with APT as an end-user and its default functionality may change to include new features or best practices. If you prefer not to risk breaking compatibility and/or prefer to interact with plainer output, `apt-get` and `apt-cache` can be used instead, though the exact commands may vary.

## Installing Packages

Installs the specified package and all required dependencies. Replace *[package]* with the name of the package you wish to install. The `apt install` command is interchangeable with `apt-get install`.

    sudo apt install [package]

**Before installing packages**, it's highly recommended to obtain updated package version and dependency information and upgrade packages and dependencies to those latest version. See [Updating Package Information](#updating-package-information) and [Upgrading Packages](#upgrading-packages) for more details. These actions can be performed quickly by running the following sequence of commands:

    sudo apt update && sudo apt upgrade

Additional options, commands, and notes:

-   **Install a specific version** by adding an equal sign after the package, followed by the version number you'd like to install.

        sudo apt install [package]=[version]

-   **Reinstall a package** and any dependencies by running the following command. This is useful if an installation for a package becomes corrupt or dependencies were somehow removed.

        sudo apt reinstall [package]

## Updating Package Information

Downloads package information from all the sources/repositories configured on your system (within `/etc/apt/sources.list`). This command obtains details about the latest version for all available packages as well as their dependencies. It should be the first step before installing or upgrading packages on your system.

    sudo apt update

This command is equivalent to `apt-get update`.

## Upgrading Packages

Upgrades all packages to their latest versions, including upgrading existing dependencies and installing new ones. It's important to note that the currently installed versions are not removed and will remain on your system.

    sudo apt upgrade

This command is equivalent to `apt-get upgrade --with-new-pkgs`. Without the `--with-new-pkgs` option, the `apt-get upgrade` command only upgrades existing packages/dependencies and ignores any packages that require new dependencies to be installed.

**Before upgrading packages**, it's highly recommended to obtain updated package version and dependency information. See [Updating Package Information](#updating-package-information) for more details. These two actions can be performed together through the following sequence of commands:

    sudo apt update && sudo apt upgrade

Additional options, commands, and notes:

-   **To view a list of all available upgrades,** use the `list` command with the `--upgradable` option.

        apt list --upgradeable

-   **To upgrade a specific package,** use the `install` command and append the package name. If the package is already installed, it will be upgraded to the latest version your system knows about. To *only upgrade* (not install) a package, use the `--only-upgrade` option. In the below command, replace *[package]* with the name of the package you wish to upgrade.

        sudo apt install --only-upgrade [package]

-   The `apt full-upgrade` command (equivalent to `apt-get dist-upgrade`) can *remove* packages as well as upgrade and install them. In most cases, it is *not* recommended to routinely run these commands. To remove unneeded packages (including kernels), use `apt autoremove` instead.

## Uninstalling Packages

Removes the specified package from the system, but retains any packages that were installed to satisfy dependencies as well as some configuration files. Replace *[package]* with the name of the package you'd like to remove.

    sudo apt remove [package]

To remove the package as well as any configuration files, run the following command. This can also be used to just remove configuration files for previously removed packages.

    sudo apt purge [package]

Both of these commands are equivalent to `apt-get remove` and `apt-get purge`, respectively.

-   **To remove any unused dependencies**, run `apt autoremove` (`apt-get autoremove`). This is commonly done after uninstalling a package or after upgrading packages and can sometimes help in reducing disk space (and clutter).

        sudo apt autoremove

## Common Command Options

The following options are available for most of the commands discussed on this guide.

-   **Multiple packages** can be taken action on together by delimiting them with a space. For example:

        sudo apt install [package1] [package2]

-   **Automatically accept prompts** by adding the `-y` or `--yes` option. This is useful when writing scripts to prevent any user interaction when its implicit that they wish to perform the action on the specified packages.

        sudo apt install [package] -y

## Listing Packages

The `apt list` command lists all available, installed, or upgradeable packages. This can be incredibly useful for locating specific packages - especially when combined with grep or less. There is no direct equivalent command within **apt-cache**.

-   **List all packages that are installed**

        apt list --installed

-   **List all packages that have an upgrade available**

        apt list --upgradeable

-   **List all versions of all available packages**

        apt list --all-versions

Additional options, commands, and notes:

-   Use [grep](/docs/guides/how-to-use-grep/) to quickly search through the list for specific package names or other strings. Replace *[string]* with the package name or other term you wish to search for.

        apt list --installed | grep [string]

-   Use a content viewer like [less](/docs/guides/how-to-use-less/) to interact with the output, which may help you view or search for your desired information.

        apt list --installed | less

## Searching for Available Packages

Searches through all available packages for the specified term or regex string.

    apt search [string]

The command `apt-cache search` is similar, though the output for `apt search` is more user-friendly.

Additional options, commands, and notes:

-   Use the `--full` option to see the full description/summary for each package.

        apt search --full [string]

-   To find packages whose titles or short/long descriptions contain multiple terms, delimit each string with a space.

        apt search [string1] [string2]

## Viewing Information About Packages

Displays information about an installed or available package. The following command is similar to `apt-cache show --no-all-versions [package]`.

    apt show [package]

The information in the output includes:

- **Package**: The name of the package.
- **Version**: The version of the package.
- **Installed-Size**: The amount of space this package consumes on the disk, not including any dependencies.
- **Depends**: A list of dependencies.
- **APT-Manual-Installed**: Designates if the package was manually installed or automatically installed (for instance, like as a dependency for another package). This is visible within `apt` (not `apt-cache`).
 - **APT-Sources**: The repository where the package information was stored. This is visible within `apt` (not `apt-cache`).
 - **Description**: A long description of the package.

## Adding Repositories

A repository is a collection of packages (typically for a specific Linux distribution and version) that are stored on a remote system. This enables software distributors to store a package (including new versions) in one place and enable users to quickly install that package onto their system. In most cases, we obtain packages from a repository - as opposed to manually downloading package files.

Information about repositories that are configured on your system are stored within `/etc/apt/sources.list` or the directory `/etc/apt/sources.list.d/`. Repositories can be added manually by editing (or adding) a sources.list configuration file, though most repositories also require adding the GPG public key to APT's keyring. To automate this process, it's recommended to use the [add-apt-repository](http://manpages.ubuntu.com/manpages/focal/man1/add-apt-repository.1.html) utility.

    sudo add-apt-repository [repository]

Replace *[repository]* with the url to the repository or, in the case of a PPA (Personal Package Archive), the reference to that PPA.

Once a repository has been added, you can update your package list and install the package. See [Updating Package Information](#updating-package-information) and [Installing Packages](#installing-packages).

## Cloning Packages to Another System

If you wish to replicate the currently installed packages to another system without actually copying over any other data, consider using the [apt-clone](http://manpages.ubuntu.com/manpages/focal/man8/apt-clone.8.html) utility. This software is compatible with Debian-based systems and is available through Ubuntu's official repository.

1.  Install apt-clone.

        sudo apt install apt-clone

1.  Create a backup containing a list of all installed packages, replacing *[name]* with the name of the backup (such as `my-preferred-packages`)

        apt-clone clone [name]

    This command creates a new file using the name provided in the last step and appending `.apt-clone.tar.gz`.

1.  Copy the file to your new system. See the [Download Files from Your Linode](/docs/guides/download-files-from-your-linode/) guide or the [File Transfer](/docs/guides/tools-reference/file-transfer/) section for more information.

1.  Install apt-clone on the new system (see Step 1).

1.  Using apt-clone, run the following command to restore the packages. Replace *[name]* with the name used in the previous step (or whatever the file is called). If the file is located within a different directly than your current directory, adjust the command to include the path.

        sudo apt-clone restore [name].apt-clone.tar.gz