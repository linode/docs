---
slug: pacman-package-manager
description: "This guide walks you through the core features of Pacman and gives you an overview of common commands for using the application to install, upgrade, and remove packages."
keywords: ['arch','manjaro','package manager']
tags: ['arch', 'manjaro']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-15
image: UsingPacmantoManagePackagesinArchLinux.jpg
modified: 2021-07-15
modified_by:
  name: Linode
title: "Using Pacman to Manage Packages in Arch"
title_meta: "How to Manage Packages in Arch Using Pacman"
authors: ["Linode"]
---

Arch Linux uses binary packages in a `.tar.xz` format, and also provides a "ports" build system that facilitates building packages. Arch Linux runs on a *rolling release* schedule, which means packages are added to the main repository when they (and their dependencies) are ready for production. This means that there aren't release versions of Arch, as all systems, once upgraded, are equivalent. Therefore, administrators of Arch Linux must consider the output of `pacman` carefully before agreeing to upgrade or update any packages.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running Arch Linux** or an Arch-based distribution like Manjaro. Review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Pacman

While the `pacman` tool is very powerful, it's also quite simple. There are three core commands for basic package management:

-   `pacman --query [package]` or `pacman -Q [package]`

    Searches the package database for a package name (and optional version number).

-   `pacman --sync [package]` or `pacman -S [package]`

    Installs new packages, downloads new content for the database and/or upgrades the system, depending on the options and the named package or packages.

-   `pacman --remove [package]` or `pacman -R [package]`

    Removes the specified package or packages.

Each of the above single character flags (`-Q`, `-S`, and `-R`) are uppercase. They are often combined with additional flags (also case-sensitive) to alter the functionality of the command. Here are some examples with brief descriptions:

-   `pacman -Qi [package]`

    Displays information about a given package, including dependency information, the date of the package, a link to the upstream source and other useful information.

-   `pacman -Qo [filename]`

    Outputs the version number and name of the package that "owns" a given file.

-   `pacman -Qs [package]`

    Searches among the installed packages for a given package.

-   `pacman -Qu`

    Lists out-of-date installed packages that are in need of an update.

-   `pacman -Sy`

    Triggers a database refresh, and synchronizes the local database with the remote database.

-   `pacman -Su`

    Triggers a full system update and downloads new packages to upgrade the system. The update and refresh command can (and should) be run together, as in: `pacman -Syu`.

-   `pacman -Sc`

    Removes uninstalled packages from the cache and attempts to clean up old copies of the repository database.

-   `pacman -S --ignore [package]`

    Ignores upgrades to a given package or list of packages.

-   `pacman -Rs [package]`

    Removes a package and its dependencies, as long as the dependencies are not needed and were not explicitly installed by the user. This command is the inverse of `pacman -S`.

-   `pacman -Ru`

    Removes packages that are unneeded by any other packages.

## Configuration Options

The configuration for `pacman` is defined in the `/etc/pacman.conf` file, while the addresses of the repository mirrors are contained in `/etc/pacman.d/mirrorlist`. The mirror list was created and prioritized during the installation process and you probably will not need to alter this.

The options in the stock `/etc/pacman.conf` are documented in comments, and are beyond the scope of this document. You may access the manual page for this configuration file with the command `man pacman.conf`.

While it is unlikely that you will need to modify the default `pacman.conf` for most installations, you can change default installation and logging directories and specify packages to be held back from upgrades.

If you need to add an additional third-party repository, add a repository stanza:

{{< file "/etc/pacman.conf" conf >}}
[REPOSITORY-NAME]
Server = SERVER-LOCATION
Include = REPOSITORY-LIST

{{< /file >}}

The `Server =` and `Include =` lines are both optional, and the order indicates their priority. By default, the testing repository is disabled, which is wise if you're planning to use the system for production work; however, if you need bleeding-edge packages, uncomment those lines.

## The Arch Build System (ABS)

The Arch Build System allows users to compile and install software not included in the Arch repository. This brief guide outlines the steps to building a package using the ABS.

{{< note respectIndent=false >}}
All commands explained here should be run as root unless otherwise specified.
{{< /note >}}

Begin by installing the `abs` framework and the `base-devel` packages:

    pacman -Sy abs base-devel

Edit `/etc/abs.conf` so that the `REPOS` line indicates the proper repositories. Note, repositories prefixed with a bang (!) are disabled. The line might look like:

    REPOS=(core extra community !testing)

To create a local ABS tree in `/var/abs`, run the `abs` command as root. You may now browse `/var/abs`, which contains a representation of the package collection with folders representing each repository, category, and piece of software.

Arch recommends that you create a build directory at another location, such as `~/abs/`, where actual building will occur.

Begin the build process by copying the files from the ABS tree into your build directory as a non-root user:

    cp -r /var/abs/REPO/PACKAGE ~/abs

Change to the package's directory:

    cd ~/abs/PACKAGE

You have the option of modifying the `PKGBUILD` file. There's a build shell function that you can use to add additional patches to the files if you have modifications to the software or the build process. That shell function generally looks like:

{{< file "~/abs/PACKAGE/PKGBUILD" >}}
build() {
  cd $startdir/src/$pkgname-$pkgver.orig

  patch -Np1 -i
  $startdir/src/${pkgname}_${pkgver}-$_patchlevel.diff || return 1

  ./configure --prefix=/usr
  make || return 1
  make install
}

{{< /file >}}

To build the package, use the following command as a non-root user:

    makepkg -s

The `makepkg` command creates a package that contains dependency information. As root, issue the following command:

    pacman -U PACKAGE.pkg.tar.xz

Make sure to replace `PACKAGE` with the full package name exactly as it appears in the file system. Arch will now install the package and any required dependencies.

Because ABS downloads source versions of the `PKGBUILD` file as it creates the package - sometimes checking out a copy of the source code from the version control system - we don't recommend removing files from the build directory hierarchy.

## More Information About Pacman and ABS

If you're interested in learning more about Arch and its package management tools, consult these external sources for the documentation provided by the Arch community:

-   [The Arch Build System](http://wiki.archlinux.org/index.php/Arch_Build_System)
-   [Pacman](http://wiki.archlinux.org/index.php/Pacman)

