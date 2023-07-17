---
slug: slackware-package-management
description: "This guide walks you through the core features of tools from Slackware, including pkgtool and slackpkg, which are common commands for managing packages."
keywords: ['slackware', 'slackpkg', 'pkgtool', 'installpkg', 'upgradepkg', 'removepkg']
tags: ['slackware']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-15
image: Managing Packages in Slackware Linux.jpg
modified: 2021-07-15
modified_by:
  name: Linode
title: "Managing Packages in Slackware"
title_meta: "How to Manage Packages in Slackware"
authors: ["Linode"]
---

Packages in Slackware Linux are distributed as compressed tarballs, generally using gzip or lzma compression. These tarballs can be recognized by their suffixes, `.tgz` or `.txz`. This format includes a complete filesystem layout, as well as additional scripts to be run upon installation or removal of the software. Slackware packages do not offer dependency resolution information; this is generally viewed as allowing more flexibility and control.

Packages can also be built using SlackBuilds, shell scripts that compile source or repackage binary distribution packages for easy installation and removal on Slackware. These scripts have been adopted as a community standard by such sites as [SlackBuilds.org](https://slackbuilds.org/), which provides many common third-party packages not available in Slackware proper.

Slackware includes `pkgtool` for local package management and `slackpkg` for remote installation of packages from official mirrors. For less interactive tasks, there are `installpkg`, `upgradepkg`, and `removepkg`.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running Slackware.** Review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Working With Packages Locally

The `pkgtool` program offers the ability to manage packages on the local system through a text-based menu interface. Each option is self-explanatory, from installing packages from the Current or an Other directory, to Removing installed packages, Viewing a list of files in a package, and running Slackware Setup scripts.

The package installation operations offer a list of packages in a menu, with the ability to choose which packages to install and which to leave alone. The package removal option offers a similar choice, with a list of installed packages. Viewing a package can be useful to determine what is in it. This information includes a description written by the creator of the package along with the expected list of files.

The Setup scripts options do not often apply to Linode, though there is a `netconfig` option that may be helpful to some users.

For those seeking a command-line approach, the `*pkg` commands are fairly straightforward in their use.

| Command | Description |
| -- | -- |
| `installpkg [package]` | Installs a package from the current directory, or a pathname you specify. It accepts full filenames, as well as globs such as `*/*.t?z` for all tgz, tbz, tlz, or txz packages in all immediately adjacent directories. |
| `upgradepkg [package]` | Upgrades a package from the current directory, or a pathname you specify. If also accepts full filenames and globs like `installpkg`. Note that the `--install-new` flag can be passed to allow `upgradepkg` to operate like `installpkg` on packages that are not currently installed on the system. |
| `removepkg [package]` | Removes a package from the system. This command does not require a full filename, but can often operate with only the software name associated with the package. |

## Working With Packages Remotely

The `slackpkg` program is a recent addition to Slackware that allows official Slackware packages to be installed and upgraded using a remote FTP or HTTP mirror. Before using Slackpkg, a mirror should be set in `/etc/slackpkg/mirrors`, and can be added or selected from the available list. Only one mirror can ever be active, and is chosen by uncommenting it (deleting the initial #).

While `slackpkg` offers a menu-based interface, it can also be run in a console-only mode by setting `DIALOG=off` in `/etc/slackpkg/slackpkg.conf`.

| Command | Description |
| -- | -- |
| `slackpkg check-updates` | Checks for new entries to the changelog on the remote mirror. This can be useful in a cron script to notify the system administrator of new patches. |
| `slackpkg update` | Downloads updates to the Slackware changelog and file lists. This check is useful for finding security updates, and must be run before attempting to download updated software. |
| `slackpkg install-new` | Looks for new packages. While rarely useful on a static release, this command should be run before others on machines running the current development release or when upgrading to a new release. |
| `slackpkg install [package]` | Looks for any packages matching the name given, and presents the user with a menu allowing the choice of installation. Note that all commands accepting a package name will also work with Slackware installation series, such as ap, d, or xap. |
| `slackpkg upgrade-all` | Presents the user with a menu listing all packages on the remote mirror that do not match the versions currently installed on your system. While this will generally result in upgrades, outdated software can sometimes be listed as an upgrade, such as when changing to an outdated mirror, or using self-built packages to replace standard Slackware packages. One common area this occurs is using alienBOB's multilib glibc packages on Slackware 64-bit. Upon choosing and confirmation of upgrades, the chosen packages will be downloaded and upgraded. |
| `slackpkg upgrade [package]` | Searches for any packages matching the name given, and presents a menu to allow upgrades. |
| `slackpkg clean-system` | Presents a menu listing all packages on the local system that are not present on upstream mirrors. This includes self-built packages, packages installed from a third-party source, and packages that were once included in Slackware, but have since been removed. |
| `slackpkg remove [package]` | Attempts to find any installed packages matching the name given, and presents the user with a menu allowing the choice of removal. |
| `slackpkg reinstall [package]` | Reinstalls the given package. This is useful if certain files in that package have been corrupted. |
| `slackpkg search [package]` | Searches for the given package name, and displays matching packages as well as installation status. |
| `slackpkg file-search filename` | Searches installed and remote package descriptions for the given filename, and displays matching packages as well as installation status. |
| `slackpkg blacklist [package]` | Adds the given package to the blacklist located in `/etc/slackpkg/blacklist`. Blacklisted packages will not be installed, upgraded, or removed by slackpkg. |
| `slackpkg info [package]` | Displays standard information about the given package. |

## SlackBuilds, sbopkg, and Third-Party Packages

Slackware does not offer as large a selection of official software as some other more community-oriented distributions, so it can include dubious third-party packages. For this reason, the use of third-party software repositories in Slackware is generally discouraged. Third-party package management tools such as `slapt-get` are also frowned upon, as they have a reputation for disrupting systems.

The Slackware community has produced SlackBuilds.org, offering SlackBuild scripts for a growing volume of third-party software. These scripts are heavily vetted for integrity and proper operation. Dependencies are noted in README files, and all builds are verified to work as advertised in a clean build environment. Local compilation also verifies that packages for your machine will work on your machine.

To facilitate the management of SlackBuilds, [sbopkg.org](https://www.sbopkg.org/) offers `sbopkg`, which operates similarly to `slackpkg`, but works with the SlackBuilds.org repository.

The `sbopkg` program, like `pkgtool`, offers a text-based menu interface. There is also a Sync option, which ensures that you are working with the latest version of all SlackBuilds. SlackBuilds can be browsed or searched for, as can their respective Changelogs. `Sbopkg` offers an Updates option, which compares local versions of your packages to remote versions of the SlackBuilds. Unlike `slackpkg`, `sbopkg` will not overwrite a newer package than what's on the server by default. In addition, `sbopkg` offers the ability to manage the order in which SlackBuilds are built using a queue system, and allows the user to make changes to the SlackBuild locally. You can also view which SlackBuilds packages are installed, choose a different repository version to work with, or look for updates to `sbopkg` itself.