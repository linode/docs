---
slug: how-to-use-apt
author:
  name: Linode
  email: docs@linode.com
description: "APT is the default package manager on Debian and Ubuntu and provides easy-to-use tools for managing your packages. This guide familiarizes you with APT's capabilities and gets you started with its most commonly used features."
og_description: "APT is the default package manager on Debian and Ubuntu and provides easy-to-use tools for managing your packages. This guide familiarizes you with APT's capabilities and gets you started with its most commonly used features."
keywords: ['apt', 'apt-get','installing','updating','upgrading','uninstalling','removing','package repositories','debian', 'ubuntu']
tags: ['apt','apt-get','debian','ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-13
modified: 2021-07-13
modified_by:
  name: Linode
title: "How to Use the APT Package Manager"
h1_title: "Using the APT Package Manager"
enable_h1: true
---

*Advanced Package Tool*, more commonly known as **APT**, is a package management system for Debian, Ubuntu, and other similar Linux distributions. It acts as a front-end to **dpkg** for installing, updating, and managing `.deb` packages. APT includes a collection of command-line tools, including `apt-get`, `apt-cache`, and the newer `apt`.

This guide aims to familiarize you with the APT commands you are most likely to encounter. The commands and examples used throughout this guide default to using the `apt` command. Many of the commands interchangeable with either `apt-get` or `apt-cache`, though there may be breaking differences.

Other package managers and tools also exist for interacting with APT or dpkg. A popular one is called Aptitude, which is discussed within the guide [How to Use Aptitude]().

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What's the difference between `apt` and `apt-get`/`apt-cache`?

While there are more similarities than differences, there are a few important points to consider when decided which command to use.

- [`apt`](http://manpages.ubuntu.com/manpages/impish/en/man8/apt.8.html): An end-user tool that has much of the same functionality as `apt-get`, `apt-cache`, and other APT command-line tools. The output is specifically formatted for enhanced human readability. This is the recommended front-end for interacting with APT as a user. See [apt Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt.8.html)
- `apt-get`: A lower-level tool (compared to `apt`) that manages packages. The commands will almost certainly remain the same and, if different functionality is developed, it will be added in through the use of options/parameters. The output is also optimized for machine readability. Using this is recommended when writing scripts. See [apt-get Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt-get.8.html)
- `apt-cache` A lower-level tool (compared to `apt`) for searching through packages and outputting information about packages. Using this is recommended when writing scripts. See [apt-cache Ubuntu man pages](http://manpages.ubuntu.com/manpages/focal/en/man8/apt-cache.8.html).

In short, `apt` is a single tool that encompasses most of the functionality of other APT-specific tooling. It is designed primarily for interacting with APT as an end-user and its default functionality may change to include new features or best practices. If you prefer not to risk breaking compatibility and/or prefer to interact with plainer output, `apt-get` and `apt-cache` can be used instead, though the exact commands may vary.

## Installing Packages

Installs the specified package and all required dependencies. Replace *[package]* with the name of the package you wish to install. The `apt install` command is interchangeable with `apt-get install`.

    apt install [package]

**Before installing packages**, it's highly recommended to obtain updated package version and dependency information and upgrade packages and dependencies to those latest version. See [Updating Package Information](#updating-package-information) and [Upgrading Packages](#upgrading-packages) for more details. These actions can be performed quickly by running the following sequence of commands:

    sudo apt update && sudo apt upgrade

Additional options, commands, and notes:

-   **Install a specific version** by adding an equal sign after the package, followed by the version number you'd like to install.

        apt install [package]=[version]

-   **Reinstall a package** and any dependencies by running the following command. This is useful if an installation for a package becomes corrupt or dependencies were somehow removed.

        apt reinstall [package]

## Updating Package Information

Downloads package information from all the sources/repositories configured on your system (within `/etc/apt/sources.list`). This command obtains details about the latest version for all available packages as well as their dependencies. It should be the first step before installing or upgrading packages on your system.

    apt update

This command is equivalent to `apt-get update`.

## Upgrading Packages

Upgrades all packages to their latest versions, including upgrading existing dependencies and installing new ones. It's important to note that the currently installed versions are not removed and will remain on your system.

    apt upgrade

This command is equivalent to `apt-get upgrade --with-new-pkgs`. Without the `--with-new-pkgs` option, the `apt-get upgrade` command only upgrades existing packages/dependencies and ignores any packages that require new dependencies to be installed.

**Before upgrading packages**, it's highly recommended to obtain updated package version and dependency information. See [Updating Package Information](#updating-package-information) for more details. These two actions can be performed together through the following sequence of commands:

    sudo apt update && sudo apt upgrade

Additional options, commands, and notes:

-   **To view a list of all available upgrades,** use the `list` command with the `--upgradable` option.

        apt list --upgradeable

-   **To upgrade a specific package,** use the `install` command and append the package name. If the package is already installed, it will be upgraded to the latest version your system knows about. To *only upgrade* (not install) a package, use the `--only-upgrade` option. In the below command, replace *[package]* with the name of the package you wish to upgrade.

        apt install --only-upgrade [package]

-   The `apt full-upgrade` command (equivalent to `apt-get dist-upgrade`) can *remove* packages as well as upgrade and install them. In most cases, it is *not* recommended to routinely run these commands. To remove unneeded packages (including kernels), use `apt autoremove` instead.

## Uninstalling Packages

Removes the specified package from the system, but retains any packages that were installed to satisfy dependencies as well as some configuration files. Replace *[package]* with the name of the package you'd like to remove.

    apt remove [package]

To remove the package as well as any configuration files, run the following command. This can also be used to just remove configuration files for previously removed packages.

    apt purge [package]

Both of these commands are equivalent to `apt-get remove` and `apt-get purge`, respectively.

-   **To remove any unused dependencies**, run `apt autoremove` (`apt-get autoremove`). This is commonly done after uninstalling a package or after upgrading packages and can sometimes help in reducing disk space (and clutter).

        apt autoremove

## Common Command Options

The following options are available for most of the commands discussed on this guide.

-   **Multiple packages** can be taken action on together by delimiting them with a space. For example:

        sudo apt install [package1] [package2]

-   **Automatically accept prompts** by adding the `-y` option. This is useful when writing scripts to prevent any user interaction when its implicit that they wish to perform the action on the specified packages.

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

    add-apt-repository [repository]

Replace *[repository]* with the url to the repository or, in the case of a PPA (Personal Package Archive), the reference to that PPA.

Once a repository has been added, you can update your package list and install the package. See [Updating Package Information](#updating-package-information) and [Installing Packages](#installing-packages).

## Cloning Packages to Another System

If you wish to replicate the currently installed packages to another system without actually copying over any other data, consider using the [apt-clone](http://manpages.ubuntu.com/manpages/focal/man8/apt-clone.8.html) utility. This software is compatible with Debian-based systems and is available through Ubuntu's official repository.

1.  Install apt-clone.

        sudo apt install apt-clone

2.  Create a backup containing a list of all installed packages, replacing *[name]* with the name of the backup (such as `my-preferred-packages`)

        apt-clone clone [name]

    This command creates a new file using the name provided in the last step and appending `.apt-clone.tar.gz`.

3.  Copy the file to your new system. See the [Download Files from Your Linode](/docs/guides/download-files-from-your-linode/) guide or the [File Transfer](/docs/guides/tools-reference/file-transfer/) section for more information.

4.  Install apt-clone on the new system (see Step 1).

5.  Using apt-clone, run the following command to restore the packages. Replace *[name]* with the name used in the previous step (or whatever the file is called). If the file is located within a different directly than your current directory, adjust the command to include the path.

        sudo apt-get restore [name]p.apt-clone.tar.gz