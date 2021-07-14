---
slug: linux-package-management
author:
  name: Linode
  email: docs@linode.com
description: Learn basics and advanced Linux package management in Debian, Ubuntu, Fedora, etc using apt, yum, aptitude and other package managers.
keywords: ["dnf", "rpm", "apt", "dpkg", "apt-get", "apt-cache", "pacman", "yum"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/basics/linux-package-management/','/using-linux/package-management/']
modified: 2021-07-13
modified_by:
  name: Linode
published: 2009-07-16
title: "An Overview of Package Management in Linux"
tags: ["linux"]
---

Many guides within Linode's documentation (or elsewhere online) require the installation of new software. These guides typically provide basic commands that utilize a package manager to install that software. In some cases, you may wish to go beyond these basic commands to install a particular version, search for previously installed packages, and perform other actions. The purpose of this guide is to provide a solid understanding of package management in Linux and an overview of the most most widely used package managers.

## Package Management Concepts

### Packages

Most software designed for Linux or Unix systems are distributed as pre-compiled *packages*, which are archives that contain binaries of software, installation scripts, configuration files, dependency requirements, and other details about the software. These packages are typically specific to a particular distribution and formatted in that distribution's preferred package format, such as `.deb` for Debian/Ubuntu and `.rpm` for CentOS/RHEL.

While it's relatively easy for a user to install a package file, there are other complexities to consider. These complexities include obtaining (downloading) the package, ensuring packages are upgraded with security and bug fixes, and maintaining all the dependencies for the software.

### Package Managers

A *package manager* reduces the complexity for the end-user by automating the process of obtaining, installing, upgrading, and removing packages *and their dependencies* (additional software required for the original software to function). This dramatically improves the user experience and the ability to properly and efficiently manage the software on your Linux system. Today, package managers can be a defining feature for Linux distributions and many system administrators prefer to use a particular distribution based on its package management system (among other considerations).

### Package Repositories

## Common Package Formats and Package Managers

Each package management tool operates a bit differently and runs on different Linux distributions. Here is a list of common package file formats and package managers.

### Debian-based Systems (including Ubuntu)

- **Package format:** `.deb`
- **Low-level package manager:** dpkg
- **High-level package manager:** APT (including `apt`, `apt-get`)

### CentOS/RHEL and Fedora

- **Package format:** `.rpm`
- **Low-level package manager:** RPM
- **High-level package managers:** YUM and DNF

### OpenSuse (Leap and Tumbleweed)

- **Package format:** `.rpm`
- **Low-level package manager:** ZYpp (also called libzypp)
- **High-level package managers:** Zypper

### Arch

- **Package format:** tar archive
- **Package manager:** [pacman](https://wiki.archlinux.org/title/pacman)

### Slackware

- **Package format:** tar archive
- **Package managerment tools:** slackpkg, pkgtool, installpkg, upgradepkg, removepkg

### Gentoo

- **Package format:** binary source or tar archive
- **Package manager:** Portage (the `emerge` command)

## Debian and Ubuntu Package Management

The Debian package management system, based on a tool called `dpkg` with the very popular `apt` system, is a powerful, popular, and useful method of package management. In addition to Debian, a number of other prominent distributions of GNU/Linux are derived from the Debian system, most notably the Ubuntu family of distributions.

As a result, these instructions apply to Debian and Ubuntu systems. While Debian and derived systems are not necessarily binary-compatible, `.debs` packaged for Debian are often compatible with Ubuntu (though this is not a supported workflow).

### APT

**Guide:** [Using the APT Package Manager](/docs/guides/how-to-use-apt/)

APT (Advanced Package Tool) is a package management system for Debian, Ubuntu, and other Linux distributions. There are quite a few ways to interact with APT in the command-line, including `apt`, `apt-get`, and `apt-cache`. Each tool has its own benefits, though `apt` should likely be used for most end-user cases. The following table outlines some of the most popular commands. See the dedicated guide [Using the APT Package Manager](/docs/guides/how-to-use-apt/) for more details and commands.

When entering a command, replace *[package]* with the name of the package you wish to operate on. Multiple packages can be entered by separating each package name with a comma. Most of these commands will need to be prepended with `sudo` if running them while logged in as a non-root user in the sudo group. See [Linux Users and Groups](https://www.linode.com/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) for more details.

| Command | Description |
| -- | -- |
| `apt install [package]` | Installs the package(s) specified, along with any dependencies. |
| `apt remove [package]` | Removes the package(s) specified, but does not remove dependencies. |
| `apt autoremove` | Removes any *orphaned* dependencies, meaning those that remain installed but are no longer required. |
| `apt clean` | Removes downloaded package files (.deb) for software that is already installed. |
| `apt purge [package]` | Combines the functions of `remove` and `clean` for a specific package, as well as configuration files. |
| `apt update` | Reads the `/etc/apt/sources.list` file and updates the system's database of packages available for installation. Run this after changing `sources.list`. |
| `apt upgrade` | Upgrades all packages if there are updates available. Run this after running `apt update`. |
| `apt search [package]` | If you know the name of a piece of software but `apt install` fails or points to the wrong software, this looks for other possible names. |
| `apt show [package]` | Shows dependency information, version numbers and a basic description of the package. |
| `apt-cache depends [package]` | Lists the packages that the specified packages depends upon in a tree. These are the packages that will be installed with the `apt-get install` command. |
| `apt-cache rdepends [package]` | Outputs a list of packages that depend upon the specified package. This list can often be rather long, so it is best to pipe its output through a command, like `less`. |
| `apt-cache pkgnames` | Generates a list of the currently installed packages on your system. This list is often rather long, so it is best to pipe its output through a program, like `less`, or direct the output to a text file. |

Combining most of these commands with `apt show` can provide you with a lot of useful information about your system, the software that you might want to install, and the software that you have already installed. If you're overwhelmed by `apt` check out the following resources for easy-to-read lists of available packages:

-   [The Debian Package Directory](http://packages.debian.org)
-   [The Ubuntu Package Directory](http://packages.ubuntu.com)

### Aptitude

Aptitude is another front-end interface for APT. In addition to a graphical interface, Aptitude provides a combined command-line interface for most APT functionality. Some notable commands are:

-   `aptitude update`, `aptitude install`, `aptitude remove`, `aptitude clean`, or `aptitude purge` - Same as their apt-get counterparts.
-   `aptitude search` or `aptitude show`, - Same as their apt-cache counterparts.
-   `aptitude download` - Downloads a .deb file for a given package into the current directory.

Aptitude also includes *safe upgrading*, meaning it doesn't remove existing packages, as well as *holding*, which prevents the system from upgrading specific packages.

### /etc/apt/sources.list

The file `/etc/apt/sources.list` controls repositories from which APT constructs its database. This file contains lines in the following format:

    deb location-of-resources distribution component(s)

Here are some examples:

    deb http://mirrors.linode.com/debian/ jessie main contrib
    deb http://www.deb-multimedia.org jessie main non-free

The first line specifies the Linode mirror for the Debian 8 (code named Jessie) Linux distribution, as well as the main and contributed components. The next line specifies the deb-multimedia.org repository for Jessie, which provides some multimedia packages unavailable in the main repositories for licensing reasons, and its main and non-free components.

In general, one does not want to add new entries to `sources.list` without a lot of scrutiny and diligence, as updating the package cache with additional repositories and running upgrades can sometimes result in the installation of broken packages, unmet dependencies, and system instability. In Debian systems, downgrading is often difficult.

For Debian systems, the repository names can either refer to the distribution code name (e.g., Jessie for current-stable, stretch for testing, Sid for unstable, Wheezy for old-stable) or to a specific branch (e.g., oldstable, stable, testing, unstable). For more information about Debian versions and choosing a Debian version or branch, read the [Debian releases and branches page](http://www.us.debian.org/releases/).

The component section of the line divides the repository based on how much support the developers of the operating system are able to offer for the contained packages (e.g. main vs. contrib), or if the software is considered "free-software" or simply freely-distributable (e.g., non-free).

The layout of `sources.list` is a bit different in Ubuntu systems. The lines are in the same format but the names of the distributions and components are different:

-   Ubuntu versions have a different naming scheme. Version 14.04 is named "trusty" in `sources.list`, 15.10 is "wily," and 16.04 is "xenial." These names follow an alphabetical pattern.
-   Ubuntu components are: "main" and "restricted" for supported free and non-free packages; "universe" and "multiverse" for unsupported free and non-free software.

### Using dpkg

`Apt-get` and `apt-cache` are merely frontend programs that provide a more usable interface and connections to repositories for the underlying package management tools called `dpkg` and `debconf`. These tools are quite powerful, and fully explaining their functionality is beyond the scope of this document. However, a basic understanding of how to use these tools is useful. Some important commands are:

| Command | Description |
| -- | -- |
| `dpkg -i [package-file-name]` | Installs a .deb file. Replace *[package-file-name]* with the filename, path, and file extension of the package you wish to install. |
| `dpkg -l` | Lists packages currently installed on the system. Search within these packages by using `grep` or by running `dpkg -l [pattern]`, replacing *[pattern]* with the term you'd like to search for.
| `dpkg --configure [package]` | Runs a configuration interface to set up a package. |
| `dpkg-reconfigure [package]` | Runs a configuration interface on an already installed package. |

For information about building your own packages, refer to the [Debian New Maintainers Guide](http://www.debian.org/doc/maint-guide/).

## Fedora and CentOS/RHEL Package Management

Fedora and CentOS/RHEL are closely related distributions, being upstream and downstream (respectively) from Red Hat Enterprise Linux (RHEL). Their main differences stem from how packages are chosen for inclusion in their repositories.

To manage packages, these Linux distributions either use YUM or DNF. Both of these tools are front-ends to the lower-level rpm tool.

### YUM

CentOS/RHEL 7 and earlier use **YUM** (*Yellowdog Updater, Modified*) as a front end to interact with system repositories and install dependencies. The YUM tool was developed for the Yellow Dog Linux system as a replacement for the Yellow Dog Updater (YUP). RedHat found the YUM tool to be a valuable addition to their systems.

#### List of YUM Commands

You can use the following commands to interact with YUM. When entering a command, replace *[package]* with the name of the package you wish to operate on. Multiple packages can be entered by separating each package name with a comma.

| Command | Description |
| -- | -- |
| `yum install [package]` | Installs the specified package(s) along with any required dependencies. |
| `yum erase [package]` | Removes the specified package(s) from your system. |
| `yum search [pattern]` | Searches the list of package names and descriptions for packages that match the search pattern and provides a list of package names, with architectures and a brief description of the package contents. Note that regular expression searches are not permitted. |
| `yum deplist [package]` | Lists all of the libraries and modules that the named package depends on, along with the names of the packages (including versions) that provide those dependencies. |
| `yum check-update` | Refreshes the local cache of the yum database so that dependency information and the latest packages are always up to date. |
| `yum info [package]` | The results of the info command provides the name, description of the package, as well as a link to the upstream home page for the software, release versions and the installed size of the software. |
| `yum reinstall [package]` | Erases and then downloads a new copy of the package file and re-installs the software on your system. |
| `yum localinstall [package-file-name]` | Checks the dependencies of a local .rpm file and then installs it. |
| `yum update [package]` | Downloads and installs all updates including bug fixes, security releases, and upgrades, as provided by the distributors of your operating system. Note that you can specify package names with the update command. |
| `yum upgrade` | Upgrades all packages installed in your system to the latest release. |

#### What Is sudo yum?

sudo is a tool for Unix based systems to execute programs, which is short for “super user do”  or “substitute user do”. sudo allows you to execute programs as a root user. YUM on the other hand is a package manager. When both combined, sudo yum forms a part of the command that initiates YUM with admin permissions in place.

From the YUM examples listed above, you can see how using sudo will change these commands. Here are two sudo yum commands to illustrate:
-   `sudo yum upgrade` - instead of just upgrading with user-specific permissions, this upgrades all packages installed in your Unix system to the latest release with the administrator permissions
-   `sudo yum erase` - this command can now remove any package on the Unix system and is no longer limited to the user’s permission level

#### What Is The Difference Between APT and YUM?

The biggest difference between APT and YUM package managers is that they both serve different Unix-based systems. On Unix-based systems like Ubuntu, we use APT package manager, whereas, for Unix-based systems like Fedora, we use YUM.

Another commonly observed difference between APT and YUM package managers is the need to upgrade all packages. To upgrade all packages in APT, we need to run the command:
apt-get upgrade

Whereas, these packages get automatically updated when we use the YUM package manager.

#### /etc/yum.conf

The file located at `/etc/yum.conf` provides system-wide configuration options for YUM, as well as information about repositories. Repository information may also be located in files ending in `.repo` under `/etc/yum.repos.d`.

The options in the `[main]` stanza don't need modification, though you may set alternate logging and cache locations for the database by adding the following lines:

{{< file "/etc/yum.conf" >}}
logfile=/var/log/yum.log
cachedir=/var/cache/yum
{{< /file >}}

### DNF

CentOS/RHEL 8 (including AlmaLinux 8 and Rocky Linux 8) and Fedora 22 (and later) use the **DNF** (*Dandified YUM*) package manager instead of YUM to interact with RPMs. DNF is the modern extension of the YUM package manager. It retains much of the same command usage and functionality as YUM, with a number of improvements for newer operating systems.

#### List of DNF Commands

The following table outlines common DNF commands. When entering a command, replace *[package]* with the name of the package you wish to operate on. Multiple packages can be entered by separating each package name with a comma.

| Command | Description |
| -- | -- |
| `dnf install [package]` | Installs the specified package(s) along with any required dependencies. `dnf install` can also accept `.rpm` files in place of a package name, to install directly from a downloaded RPM. |
| `dnf remove [package]` | Removes the specified package(s) from your system, along with any package(s) that depend upon them. |
| `dnf search [pattern]` | Searches the list of package names and descriptions for packages that match the search pattern and provides a list of package names, with architectures and a brief description of the package contents. Note that regular expression searches are not permitted. |
| `dnf provides [package]` | Lists all of the libraries and modules that the named package depends on, along with the names of the packages (including versions) that provide those dependencies. |
| `dnf check-update` | Refreshes the local cache of the DNF database so that dependency information and the latest packages are always up to date. |
| `dnf info [package]` | Provides the name and description of the package as well as a link to the upstream home page for the software, release versions, and the installed size of the software. |
| `dnf reinstall [package]` | Erases and then downloads a new copy of the package file and re-installs the software on your system. |
| `dnf upgrade [package]` | Downloads and installs all updates including bug fixes, security releases, and upgrades for a specific package. |
| `dnf upgrade` | With no arguments, `upgrade` upgrades all packages installed in your system to the latest release. |
| `dnf config-manager --add-repo [repo]` | Adds a `.repo` file as a DNF repository. |
| `dnf config-manager --set-enabled [repo]` | Enables a DNF repository. |
| `dnf config-manager --set-disabled [repo]` | Disables a DNF repository. |

#### /etc/dnf/dnf.conf

The `dnf.conf` file provides global configuration settings for DNF. If DNF `.repo` files are being added manually, instead of with `dnf config-manager`, they should be added to `/etc/yum.repos.d`.

### RPM

YUM and DNF are simply front-ends to a lower-level tool called RPM, similar to `apt-get`'s relationship with `dpkg`. You will likely not need to interact with RPM very often, but there are a few commands that you may find useful.

#### List of RPM Commands

The following commands should be run as root. The flags are expanded here, but the abbreviated syntax is also included:

| Command | Description |
| -- | -- |
| `rpm --install --verbose --hash local-rpm-file-name.rpm` or `rpm -ivh filename.rpm` | Installs an rpm from the file. `rpm` is also capable of installing RPM files from http and ftp sources as well as local files. |
| `rpm --erase package-name(s)` or `rpm -e` | Removes the given package. Usually will not complete if `package-name` matches more than one package, but will remove more than one match if used with the `--allmatches` flag. |
| `rpm --query --all` or `rpm -qa` | Lists the name of all packages currently installed. |
| `rpm --query package-name(s)` or `rpm -q` | Allows you to confirm whether a given package is installed in your system. |
| `rpm --query --info package-name(s)` or `rpm -qi` | Displays the information about an installed package. |
| `rpm --query --list package-name(s)` or `rpm -ql` | Generates a list of files installed by a given package. This is complemented by the following command. |
| `rpm --query --file` or `rpm -q qf filename` | Checks to see what installed package "owns" a given file. |

Note that RPM does not automatically check for dependencies, so you must install them manually. For more information please consult these external sources:

-   [iDevelopment Info - RPM Commands](http://www.idevelopment.info/data/Unix/Linux/LINUX_RPMCommands.shtml)
-   [Quick Guide to RPM](http://www.tfug.org/helpdesk/linux/rpm.html)

You can use the following template to define a new stanza for a new repository, replacing the capitalized strings with your own values:

{{< file "/etc/yum.repos.d/example.repo" conf >}}
[REPO-NAME]
name=REPOSITORY-NAME
mirrorlist=HTTP-ACCESSIBLE-MIRROR-LIST
#baseurl=BASE-URL-FOR-REPOSITORY
gpgcheck=BOOLEAN-VALUE-TO-VERIFY-REPOSITORY
gpgkey=FILE-PATH-TO-GPG-KEY

{{< /file >}}

The following example is the default configuration for the "Base" repository in CentOS 7:

{{< file "/etc/yum.repos.d/CentOS-Base.repo" conf >}}
[base]
name=CentOS-$releasever - Base
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
#baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

{{< /file >}}

## Slackware Package Management

Packages in Slackware Linux are distributed as compressed tarballs, generally using gzip or lzma compression. These tarballs can be recognized by their suffixes, `.tgz` or `.txz`. This format includes a complete filesystem layout, as well as additional scripts to be run upon installation or removal of the software. Slackware packages do not offer dependency resolution information; this is generally viewed as allowing more flexibility and control.

Packages can also be built using SlackBuilds, shell scripts that compile source or repackage binary distribution packages for easy installation and removal on Slackware. These scripts have been adopted as a community standard by such sites as [SlackBuilds.org](https://slackbuilds.org/), which provides many common third-party packages not available in Slackware proper.

Slackware includes `pkgtool` for local package management and `slackpkg` for remote installation of packages from official mirrors. For less interactive tasks, there are `installpkg`, `upgradepkg`, and `removepkg`.

### Working With Packages Locally

The `pkgtool` program offers the ability to manage packages on the local system through a text-based menu interface. Each option is self-explanatory, from installing packages from the Current or an Other directory, to Removing installed packages, Viewing a list of files in a package, and running Slackware Setup scripts.

The package installation operations offer a list of packages in a menu, with the ability to choose which packages to install and which to leave alone. The package removal option offers a similar choice, with a list of installed packages. Viewing a package can be useful to determine what is in it. This information includes a description written by the creator of the package along with the expected list of files.

The Setup scripts options do not often apply to Linode, though there is a `netconfig` option that may be helpful to some users.

For those seeking a command-line approach, the `*pkg` commands are fairly straightforward in their use.

| Command | Description |
| -- | -- |
| `installpkg [package]` | Installs a package from the current directory, or a pathname you specify. It accepts full filenames, as well as globs such as `*/*.t?z` for all tgz, tbz, tlz, or txz packages in all immediately adjacent directories. |
| `upgradepkg [package]` | Upgrades a package from the current directory, or a pathname you specify. If also accepts full filenames and globs like `installpkg`. Note that the `--install-new` flag can be passed to allow `upgradepkg` to operate like `installpkg` on packages that are not currently installed on the system. |
| `removepkg [package]` | Removes a package from the system. This command does not require a full filename, but can often operate with only the software name associated with the package. |

### Working With Packages Remotely

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

### SlackBuilds, sbopkg, and Third-Party Packages

Slackware does not offer as large a selection of official software as some other more community-oriented distributions, so it can include dubious third-party packages. For this reason, the use of third-party software repositories in Slackware is generally discouraged. Third-party package management tools such as `slapt-get` are also frowned upon, as they have a reputation for disrupting systems.

The Slackware community has produced SlackBuilds.org, offering SlackBuild scripts for a growing volume of third-party software. These scripts are heavily vetted for integrity and proper operation. Dependencies are noted in README files, and all builds are verified to work as advertised in a clean build environment. Local compilation also verifies that packages for your machine will work on your machine.

To facilitate the management of SlackBuilds, [sbopkg.org](https://www.sbopkg.org/) offers `sbopkg`, which operates similarly to `slackpkg`, but works with the SlackBuilds.org repository.

The `sbopkg` program, like `pkgtool`, offers a text-based menu interface. There is also a Sync option, which ensures that you are working with the latest version of all SlackBuilds. SlackBuilds can be browsed or searched for, as can their respective Changelogs. `Sbopkg` offers an Updates option, which compares local versions of your packages to remote versions of the SlackBuilds. Unlike `slackpkg`, `sbopkg` will not overwrite a newer package than what's on the server by default. In addition, `sbopkg` offers the ability to manage the order in which SlackBuilds are built using a queue system, and allows the user to make changes to the SlackBuild locally. You can also view which SlackBuilds packages are installed, choose a different repository version to work with, or look for updates to `sbopkg` itself.

## Package Management in Arch Linux with Pacman

Arch Linux uses binary packages in a `.tar.xz` format, and also provides a "ports" build system that facilitates building packages.

Arch Linux runs on a *rolling release* schedule, which means packages are added to the main repository when they (and their dependencies) are ready for production. This means that there aren't release versions of Arch, as all systems, once upgraded, are equivalent.

Therefore, administrators of Arch Linux must consider the output of `pacman` carefully before agreeing to upgrade or update any packages.

### Pacman

The `pacman` tool is very powerful, but it is also very simple. There are three core commands for basic package management:

-   `pacman --query package-name(s)` or `pacman -Q` - Searches the package database for a package name and version number.
-   `pacman --sync package-name(s)` or `pacman -S` - Installs new packages, downloads new content for the database and/or upgrades the system, depending on the options and the named package or packages.
-   `pacman --remove package-name(s)` or `pacman -R` - Removes the named package or packages.

Note that the terse flags are all uppercase and case-sensitive. These terse flags are often combined with additional flags for additional functionality. Here are some examples with brief descriptions:

-   `pacman -Qi package-name(s)` - Displays information about a given package, including dependency information, the date of the package, a link to the upstream source and other useful information.
-   `pacman -Qo filename` - Outputs the version number and name of the package that "owns" a given file.
-   `pacman -Qs package-name(s)` - Searches among the installed packages for a given package.
-   `pacman -Qu` - Lists out-of-date installed packages that are in need of an update.
-   `pacman -Sy` - Triggers a database refresh, and synchronizes the local database with the remote database.
-   `pacman -Su` - Triggers a full system update and downloads new packages to upgrade the system. The update and refresh command can (and should) be run together, as in: `pacman -Syu`.
-   `pacman -Sc` - Removes uninstalled packages from the cache and attempts to clean up old copies of the repository database.
-   `pacman -S --ignore package-name(s)` - Ignores upgrades to a given package or list of packages.
-   `pacman -Rs` Removes a package and its dependencies, as long as the dependencies are not needed and were not explicitly installed by the user. This command is the inverse of `pacman -S`.
-   `pacman -Ru` Removes packages that are unneeded by any other packages.

### Configuration Options

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

### The Arch Build System (ABS)

The Arch Build System allows users to compile and install software not included in the Arch repository. This brief guide outlines the steps to building a package using the ABS.

{{< note >}}
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

### More Information About Pacman and ABS

If you're interested in learning more about Arch and its package management tools, consult these external sources for the documentation provided by the Arch community:

-   [The Arch Build System](http://wiki.archlinux.org/index.php/Arch_Build_System)
-   [Pacman](http://wiki.archlinux.org/index.php/Pacman)

## Gentoo Linux Package Management

Gentoo provides its entire operating system in source format. These source packages, in concert with `ebuild` scripts, provide a package management system that borrows and builds on many concepts from the BSD's "portage" system.

Like Arch, the Gentoo project produces new versions of Gentoo Linux on a rolling release cycle.

This section addresses common package management tasks and functions using the `emerge` front end for the portage system. We encourage you to install the "gentoolkit" to provide additional package management tools, such as `equery`. Install this package with the following command:

    emerge app-portage/gentoolkit

### Emerge/Portage Commands

-   `emerge --sync` - Updates the local copy of the portage tree, so that your local system can download and install the latest version of the software.
-   `emerge --update --deep world` - Checks and updates all packages on the system to the latest version. This should be run regularly to avoid falling behind on a critical update.
-   `emerge --search keyword` or `emerge -s keyword` - Searches the names of all of the packages for the given keyword. This command accepts a regular expression as the keyword argument.
-   `emerge --searchdoc keyword` or `emerge -S keyword` - Searches the full description for a given keyword. This command accepts a regular expression as the keyword argument.
-   `emerge package-name(s)` - Installs the specified package or packages.
-   `emerge -u package-name(s)` - Updates the specified package to the latest version. Using the flag `-uD` also updates dependencies.
-   `emerge --depclean package-name(s)` or `emerge -c package-name(s)` - Removes the specified package or packages.
-   `emerge --depclean` - Removes packages that are orphaned. This means removal of all packages that weren't explicitly installed and do not depend upon any specific package. We recommend that you run it with the `--pretend` option before running this command on a production system.
-   `emerge -evp --deep world` - Lists all of the packages currently installed on the system.
-   `equery depends package-name(s)` - Lists all of the packages that depend upon the specified package.
-   `equery files package-name(s)` - Lists all of the files "owned" by a package.
-   `equery belongs filename` - Lists the package that "owns" a particular file.

### USE Flags

Portage also makes it possible to install additional variants of a package with *USE flags*, which allow the user to enable support for a particular option related to that package. To discover which USE flags are available for a given package, issue the following command:

    equery uses package-name

The `equery` command depends on the `gentoolkit` package. This will provide information about what USE flags are available and which have been installed. To specify additional USE flags:

    echo "package-name USE-flags" >> /etc/portage/package.use
    emerge package-name

This will install the specified package with the appropriate options enabled.

