---
slug: portage-package-manager
description: "This guide walks you through the core features and common features of Portage, the default package manager on Gentoo linux, so you can install software on your system."
keywords: ['gentoo', 'portage', 'emerge', package manager']
tags: ['gentoo']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-15
image: UsingPortagetoManagePackagesinGentooLinux.jpg
modified: 2021-07-15
modified_by:
  name: Linode
title: "Using Portage to Manage Packages in Gentoo"
title_meta: "How to Use Portage to Manage Packages in Gentoo"
authors: ["Linode"]
---

Gentoo provides its entire operating system in source format. These source packages, in concert with `ebuild` scripts, provide a package management system that borrows and builds on many concepts from the BSD's "portage" system.

Like Arch, the Gentoo project produces new versions of Gentoo Linux on a rolling release cycle.

This guide addresses common package management tasks and functions using the `emerge` front end for the portage system. We encourage you to install the "gentoolkit" to provide additional package management tools, such as `equery`. Install this package with the following command:

    sudo emerge app-portage/gentoolkit

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running Gentoo.** Review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Emerge/Portage Commands

-   `sudo emerge --sync`

    **Updates the local copy of the portage tree**, so that your local system can download and install the latest version of the software.

-   `sudo emerge --update --deep world`

    **Checks and updates all packages on the system to the latest version.** This should be run regularly to avoid falling behind on a critical update.

-   `emerge --search [term]` or `emerge -s [term]`

    **Searches the names of all of the packages for the given keyword.** This command accepts a regular expression as the keyword argument.

-   `emerge --searchdoc [term]` or `emerge -S [term]`

    **Searches the full description for a given keyword.** This command accepts a regular expression as the keyword argument.

-   `sudo emerge [package]`

    **Installs the specified package** or packages.

-   `sudo emerge -u [package]`

    **Updates the specified package to the latest version.** Using the flag `-uD` also updates dependencies.

-   `sudo emerge --depclean [package]` or `sudo emerge -c [package]`

    **Removes the specified package** or packages.

-   `sudo emerge --depclean`

    **Removes packages that are orphaned.** This means removal of all packages that weren't explicitly installed and do not depend upon any specific package. We recommend that you run it with the `--pretend` option before running this command on a production system.

-   `emerge -evp --deep world`

    **Lists all of the packages currently installed on the system.**

-   `equery depends [package]`

    **Lists all of the packages that depend upon the specified package.**

-   `equery files [package]`

    **Lists all of the files "owned" by a package.**

-   `equery belongs [filename]`

    **Lists the package that "owns" a particular file.**

## USE Flags

Portage also makes it possible to install additional variants of a package with *USE flags*, which allow the user to enable support for a particular option related to that package. To discover which USE flags are available for a given package, issue the following command:

    equery uses package-name

The `equery` command depends on the `gentoolkit` package. This will provide information about what USE flags are available and which have been installed. To specify additional USE flags:

    echo "package-name USE-flags" >> /etc/portage/package.use
    emerge package-name

This will install the specified package with the appropriate options enabled.

