---
author:
  name: Linode
  email: docs@linode.com
description: Guides for installing and managing software on major Linux operating systems on a Linode.
keywords: ["Linux package management", "rpm", "apt", "dpkg", "apt-get", "apt-cache", "pacman", "yum"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-linux/package-management/']
modified: 2017-02-23
modified_by:
  name: Linode
published: 2009-07-16
title: Linux Package Management
---

Many tutorials reference "package managers" and "package management tools." If you are new to the Linux world and don't understand the purpose of these technologies, or if you are familiar with one package management tool but want to learn how to use another, this guide will provide an introduction to the major package management tools.

![Linux Package Management](/docs/assets/linux-package-management.png "Linux Package Management")

## Package Management Concepts

Contemporary distributions of Linux-based operating systems install software in pre-compiled *packages*, which are archives that contain binaries of software, configuration files, and information about dependencies. Furthermore, package management tools keep track of updates and upgrades so that the user doesn't have to hunt down information about bug and security fixes.

Without package management, users must ensure that all of the required dependencies for a piece of software are installed and up-to-date, compile the software from the source code (which takes time and introduces compiler-based variations from system to system), and manage configuration for each piece of software. Without package management, application files are located in the standard locations for the system to which the developers are accustomed, regardless of which system they're using.

Package management systems attempt to solve these problems and are the tools through which developers attempt to increase the overall quality and coherence of a Linux-based operating system. The features that most package management applications provide are:

-   **Package downloading**: Operating-system projects provide package repositories which allow users to download their packages from a single, trusted provider. When you download from a package manager, the software can be authenticated and will remain in the repository even if the original source becomes unreliable.
-   **Dependency resolution**: Packages contain metadata which provides information about what other files are required by each respective package. This allows applications and their dependencies to be installed with one command, and for programs to rely on common, shared libraries, reducing bulk and allowing the operating system to manage updates to the packages.
-   **A standard binary package format**: Packages are uniformly prepared across the system to make installation easier. While some distributions share formats, compatibility issues between similarly formatted packages for different operating systems can occur.
-   **Common installation and configuration locations**: Linux distribution developers often have conventions for how applications are configured and the layout of files in the `/etc/` and `/etc/init.d/` directories; by using packages, distributions are able to enforce a single standard.
-   **Additional system-related configuration and functionality**: Occasionally, operating system developers will develop patches and helper scripts for their software which get distributed within the packages. These modifications can have a significant impact on user experience.
-   **Quality control**: Operating-system developers use the packaging process to test and ensure that the software is stable and free of bugs that might affect product quality and that the software doesn't cause the system to become unstable. The subjective judgments and community standards that guide packaging and package management also guide the "feel" and "stability" of a given system.

In general, we recommend that you install the versions of software available in your distribution's repository and packaged for your operating system. If packages for the application or software that you need to install aren't available, we recommend that you find packages for your operating system, when available, before installing from source code.

The remainder of this guide will cover how to use specific package management systems and how to compile and package software yourself.

## Debian and Ubuntu Package Management

The Debian package management system, based on a tool called `dpkg` with the very popular `apt` system, is a powerful, popular, and useful method of package management. In addition to Debian, a number of other prominent distributions of GNU/Linux are derived from the Debian system, most notably the Ubuntu family of distributions.

As a result, these instructions apply to Debian and Ubuntu systems. While Debian and derived systems are not necessarily binary-compatible, `.debs` packaged for Debian are often compatible with Ubuntu (though this is not a supported workflow).

### Advanced Packaging Tool (APT)

You may already be familiar with `apt-get`, a command which uses the advanced packaging tool to interact with the operating system's package system. The most relevant and useful commands are (to be run with root privileges):

-   `apt-get install package-name(s)` - Installs the package(s) specified, along with any dependencies.
-   `apt-get remove package-name(s)` - Removes the package(s) specified, but does not remove dependencies.
-   `apt-get autoremove` - Removes any *orphaned* dependencies, meaning those that remain installed but are no longer required.
-   `apt-get clean` - Removes downloaded package files (.deb) for software that is already installed.
-   `apt-get purge package-name(s)` - Combines the functions of `remove` and `clean` for a specific package, as well as configuration files.
-   `apt-get update` - Reads the `/etc/apt/sources.list` file and updates the system's database of packages available for installation. Run this after changing `sources.list`.
-   `apt-get upgrade` - Upgrades all packages if there are updates available. Run this after running `apt-get update`.

While `apt-get` provides the most often-used functionality, APT provides additional information in the `apt-cache` command.

-   `apt-cache search package-name(s)` - If you know the name of a piece of software but `apt-get install` fails or points to the wrong software, this looks for other possible names.
-   `apt-cache show package-name(s)` - Shows dependency information, version numbers and a basic description of the package.
-   `apt-cache depends package-name(s)` - Lists the packages that the specified packages depends upon in a tree. These are the packages that will be installed with the `apt-get install` command.
-   `apt-cache rdepends package-name(s)` - Outputs a list of packages that depend upon the specified package. This list can often be rather long, so it is best to pipe its output through a command, like `less`.
-   `apt-cache pkgnames` - Generates a list of the currently installed packages on your system. This list is often rather long, so it is best to pipe its output through a program, like `less`, or direct the output to a text file.

Combining most of these commands with `apt-cache show` can provide you with a lot of useful information about your system, the software that you might want to install, and the software that you have already installed. If you're overwhelmed by `apt-cache` check out the following resources for easy-to-read lists of available packages:

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

For Debian systems, the repository names can either refer to the distribution code name (e.g., jessie for current-stable, stretch for testing, sid for unstable, wheezy for old-stable) or to a specific branch (e.g., oldstable, stable, testing, unstable). For more information about Debian versions and choosing a Debian version or branch, read the [Debian releases and branches page](http://www.us.debian.org/releases/).

The component section of the line divides the repository based on how much support the developers of the operating system are able to offer for the contained packages (e.g. main vs. contrib), or if the software is considered "free-software" or simply freely-distributable (e.g., non-free).

The layout of `sources.list` is a bit different in Ubuntu systems. The lines are in the same format but the names of the distributions and components are different:

-   Ubuntu versions have a different naming scheme. Version 14.04 is named "trusty" in `sources.list`, 15.10 is "wily," and 16.04 is "xenial." These names follow an alphabetical pattern.
-   Ubuntu components are: "main" and "restricted" for supported free and non-free packages; "universe" and "multiverse" for unsupported free and non-free software.

### Using dpkg

`Apt-get` and `apt-cache` are merely frontend programs that provide a more usable interface and connections to repositories for the underlying package management tools called `dpkg` and `debconf`. These tools are quite powerful, and fully explaining their functionality is beyond the scope of this document. However, a basic understanding of how to use these tools is useful. Some important commands are:

-   `dpkg -i package-file-name.deb` - Installs a .deb file.
-   `dpkg --list search-pattern` - Lists packages currently installed on the system.
-   `dpkg --configure package-name(s)` - Runs a configuration interface to set up a package.
-   `dpkg-reconfigure package-name(s)` - Runs a configuration interface on an already installed package.

For information about building your own packages, refer to the [Debian New Maintainers Guide](http://www.debian.org/doc/maint-guide/).

## Fedora and CentOS Package Management

Fedora and CentOS are closely related distributions, being upstream and downstream (respectively) from Red Hat Enterprise Linux (RHEL). Their main differences stem from how packages are chosen for inclusion in their repositories.

CentOS uses `yum`, *Yellowdog Updater, Modified*, as a front end to interact with system repositories and install dependencies, and also includes a lower-level tool called `rpm`, which allows you to interact with individual packages.

Starting with version 22, Fedora uses the `dnf` package manager instead of YUM to interact with `rpm`. DNF supports many of the same commands as YUM, with some slight changes.

**Note:** Many operating systems aside from RedHat use `rpm` packages. These include OpenSuSE, AIX, and Mandriva. While it may be possible to install an RPM packaged for one operating system on another, this is not supported or recommended, and the results of this action can vary greatly.

### Yellow Dog Updater, Modified (YUM)

The YUM tool was developed for the Yellow Dog Linux system as a replacement for the Yellow Dog Updater (YUP). RedHat found the YUM tool to be a valuable addition to their systems. Today, YUM is the default package and repository management tool for a number of operating systems.

You can use the following commands to interact with YUM:

-   `yum install package-name(s)` - Installs the specified package(s) along with any required dependencies.
-   `yum erase package-name(s)` - Removes the specified package(s) from your system.
-   `yum search search-pattern` - Searches the list of package names and descriptions for packages that match the search pattern and provides a list of package names, with architectures and a brief description of the package contents. Note that regular expression searches are not permitted.
-   `yum deplist package-name(s)` - Lists all of the libraries and modules that the named package depends on, along with the names of the packages (including versions) that provide those dependencies.
-   `yum check-update` - Refreshes the local cache of the yum database so that dependency information and the latest packages are always up to date.
-   `yum info package-name(s)` - The results of the info command provides the name, description of the package, as well as a link to the upstream home page for the software, release versions and the installed size of the software.
-   `yum reinstall package-name(s)` - Erases and then downloads a new copy of the package file and re-installs the software on your system.
-   `yum localinstall local-rpm-file` - Checks the dependencies of a local .rpm file and then installs it.
-   `yum update optional-package-name(s)` - Downloads and installs all updates including bug fixes, security releases, and upgrades, as provided by the distributors of your operating system. Note that you can specify package names with the update command.
-   `yum upgrade` - Upgrades all packages installed in your system to the latest release.

### /etc/yum.conf

The file located at `/etc/yum.conf` provides system-wide configuration options for YUM, as well as information about repositories. Repository information may also be located in files ending in `.repo` under `/etc/yum.repos.d`.

The options in the `[main]` stanza don't need modification, though you may set alternate logging and cache locations for the database by adding the following lines:

{{< file-excerpt "/etc/yum.conf" aconf >}}
logfile=/var/log/yum.log
cachedir=/var/cache/yum

{{< /file-excerpt >}}


### Dandified YUM (DNF)

DNF is the modern extension of the YUM package manager. It retains much of the same command usage and functionality as YUM, with a number of improvements for newer operating systems. DNF was first introduced in Fedora 18 and became the default package manager with the release of Fedora 22.

-   `dnf install package-name(s)` - Installs the specified package(s) along with any required dependencies. `dnf install` can also accept `.rpm` files in place of a package name, to install directly from a downloaded RPM.
-   `dnf remove package-name(s)` - Removes the specified package(s) from your system, along with any package(s) that depend upon them.
-   `dnf search search-pattern` - Searches the list of package names and descriptions for packages that match the search pattern and provides a list of package names, with architectures and a brief description of the package contents. Note that regular expression searches are not permitted.
-   `dnf provides package-name(s)` - Lists all of the libraries and modules that the named package depends on, along with the names of the packages (including versions) that provide those dependencies.
-   `dnf check-update` - Refreshes the local cache of the DNF database so that dependency information and the latest packages are always up to date.
-   `dnf info package-name(s)` - Provides the name and description of the package as well as a link to the upstream home page for the software, release versions, and the installed size of the software.
-   `dnf reinstall package-name(s)` - Erases and then downloads a new copy of the package file and re-installs the software on your system.
-   `dnf upgrade optional-package-name(s)` - Downloads and installs all updates including bug fixes, security releases, and upgrades for a specific package.
-   `dnf upgrade` - With no arguments, `upgrade` upgrades all packages installed in your system to the latest release.
-   `dnf config-manager --add-repo example.repo` Adds a `.repo` file as a DNF repository.
-   `dnf config-manager --set-enabled example-repo` Enables a DNF repository.
-   `dnf config-manager --set-disabled example-repo` Disables a DNF repository.

### /etc/dnf/dnf.conf

The `dnf.conf` file provides global configuration settings for DNF. If DNF `.repo` files are being added manually, instead of with `dnf config-manager`, they should be added to `/etc/yum.repos.d`.

### RPM Package Manager (RPM)

YUM and DNF are simply front-ends to a lower-level tool called RPM, similar to `apt-get`'s relationship with `dpkg`. You will likely not need to interact with RPM very often, but there are a few commands that you may find useful.

The following commands should be run as root. The flags are expanded here, but the abbreviated syntax is also included:

-   `rpm --install --verbose --hash local-rpm-file-name.rpm` or `rpm -ivh filename.rpm` - Installs an rpm from the file. `rpm` is also capable of installing RPM files from http and ftp sources as well as local files.
-   `rpm --erase package-name(s)` or `rpm -e` - Removes the given package. Usually will not complete if `package-name` matches more than one package, but will remove more than one match if used with the `--allmatches` flag.
-   `rpm --query --all` or `rpm -qa` - lists the name of all packages currently installed.
-   `rpm --query package-name(s)` or `rpm -q` - allows you to confirm whether a given package is installed in your system.
-   `rpm --query --info package-name(s)` or `rpm -qi` - displays the information about an installed package.
-   `rpm --query --list package-name(s)` or `rpm -ql` - generates a list of files installed by a given package. This is complemented by:
-   `rpm --query --file` or `rpm -q qf filename` - checks to see what installed package "owns" a given file.

Note that RPM does not automatically check for dependencies, so you must install them manually. For more information please consult these external sources:

-   [iDevelopment Info - RPM Commands](http://www.idevelopment.info/data/Unix/Linux/LINUX_RPMCommands.shtml)
-   [Quick Guide to RPM](http://www.tfug.org/helpdesk/linux/rpm.html)

You can use the following template to define a new stanza for a new repository, replacing the capitalized strings with your own values:

{{< file-excerpt "/etc/yum.repos.d/example.repo" aconf >}}
[REPO-NAME]
name=REPOSITORY-NAME
mirrorlist=HTTP-ACCESSIBLE-MIRROR-LIST
#baseurl=BASE-URL-FOR-REPOSITORY
gpgcheck=BOOLEAN-VALUE-TO-VERIFY-REPOSITORY
gpgkey=FILE-PATH-TO-GPG-KEY

{{< /file-excerpt >}}


The following example is the default configuration for the "Base" repository in CentOS 7:

{{< file-excerpt "/etc/yum.repos.d/CentOS-Base.repo" aconf >}}
[base]
name=CentOS-$releasever - Base
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
#baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

{{< /file-excerpt >}}


## Slackware Package Management

*Credit: This section was kindly provided by* [JK Wood](http://slaxer.com/).

Packages in Slackware Linux are distributed as compressed tarballs, generally using gzip or lzma compression. These tarballs can be recognized by their suffixes, `.tgz` or `.txz`. This format includes a complete filesystem layout, as well as additional scripts to be run upon installation or removal of the software. Slackware packages do not offer dependency resolution information; this is generally viewed as allowing more flexibility and control.

Packages can also be built using SlackBuilds, shell scripts that compile source or repackage binary distribution packages for easy installation and removal on Slackware. These scripts have been adopted as a community standard by such sites as [SlackBuilds.org](https://slackbuilds.org/), which provides many common third-party packages not available in Slackware proper.

Slackware includes `pkgtool` for local package management and `slackpkg` for remote installation of packages from official mirrors. For less interactive tasks, there are `installpkg`, `upgradepkg`, and `removepkg`.

### Working With Packages Locally

The `pkgtool` program offers the ability to manage packages on the local system through a text-based menu interface. Each option is self-explanatory, from installing packages from the Current or an Other directory, to Removing installed packages, Viewing a list of files in a package, and running Slackware Setup scripts.

The package installation operations offer a list of packages in a menu, with the ability to choose which packages to install and which to leave alone. The package removal option offers a similar choice, with a list of installed packages. Viewing a package can be useful to determine what is in it. This information includes a description written by the creator of the package along with the expected list of files.

The Setup scripts options do not often apply to Linode, though there is a `netconfig` option that may be helpful to some users.

For those seeking a command-line approach, the `*pkg` commands are fairly straightforward in their use.

-   `installpkg package-name(s)` - Installs a package from the current directory, or a pathname you specify. It accepts full filenames, as well as globs such as `*/*.t?z` for all tgz, tbz, tlz, or txz packages in all immediately adjacent directories.
-   `upgradepkg package-name(s)` - Upgrades a package from the current directory, or a pathname you specify. If also accepts full filenames and globs like `installpkg`. Note that the `--install-new` flag can be passed to allow `upgradepkg` to operate like `installpkg` on packages that are not currently installed on the system.
-   `removepkg package-name(s)` - Removes a package from the system. This command does not require a full filename, but can often operate with only the software name associated with the package.

### Working With Packages Remotely

The `slackpkg` program is a recent addition to Slackware that allows official Slackware packages to be installed and upgraded using a remote FTP or HTTP mirror. Before using Slackpkg, a mirror should be set in `/etc/slackpkg/mirrors`, and can be added or selected from the available list. Only one mirror can ever be active, and is chosen by uncommenting it (deleting the initial #).

While `slackpkg` offers a menu-based interface, it can also be run in a console-only mode by setting `DIALOG=off` in `/etc/slackpkg/slackpkg.conf`.

-   `slackpkg check-updates` - Checks for new entries to the changelog on the remote mirror. This can be useful in a cron script to notify the system administrator of new patches.
-   `slackpkg update` - Downloads updates to the Slackware changelog and file lists. This check is useful for finding security updates, and must be run before attempting to download updated software.
-   `slackpkg install-new` - Looks for new packages. While rarely useful on a static release, this command should be run before others on machines running the current development release or when upgrading to a new release.
-   `slackpkg install package-name(s)` - Looks for any packages matching the name given, and presents the user with a menu allowing the choice of installation. Note that all commands accepting a package name will also work with Slackware installation series, such as ap, d, or xap.
-   `slackpkg upgrade-all` - Presents the user with a menu listing all packages on the remote mirror that do not match the versions currently installed on your system. While this will generally result in upgrades, outdated software can sometimes be listed as an upgrade, such as when changing to an outdated mirror, or using self-built packages to replace standard Slackware packages. One common area this occurs is using alienBOB's multilib glibc packages on Slackware 64-bit. Upon choosing and confirmation of upgrades, the chosen packages will be downloaded and upgraded.
-   `slackpkg upgrade package-name(s)` - Searches for any packages matching the name given, and presents a menu to allow upgrades.
-   `slackpkg clean-system` - Presents a menu listing all packages on the local system that are not present on upstream mirrors. This includes self-built packages, packages installed from a third-party source, and packages that were once included in Slackware, but have since been removed.
-   `slackpkg remove package-name(s)` - Attempts to find any installed packages matching the name given, and presents the user with a menu allowing the choice of removal.
-   `slackpkg reinstall package-name(s)` - Reinstalls the given package. This is useful if certain files in that package have been corrupted.
-   `slackpkg search package-name(s)` - Searches for the given package name, and displays matching packages as well as installation status.
-   `slackpkg file-search filename` - Searches installed and remote package descriptions for the given filename, and displays matching packages as well as installation status.
-   `slackpkg blacklist package-name(s)` - Adds the given package to the blacklist located in `/etc/slackpkg/blacklist`. Blacklisted packages will not be installed, upgraded, or removed by slackpkg.
-   `slackpkg info package-name(s)` - Displays standard information about the given package.

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

{{< file-excerpt "/etc/pacman.conf" aconf >}}
[REPOSITORY-NAME]
Server = SERVER-LOCATION
Include = REPOSITORY-LIST

{{< /file-excerpt >}}


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

{{< file-excerpt "~/abs/PACKAGE/PKGBUILD" >}}
build() {
  cd $startdir/src/$pkgname-$pkgver.orig

  patch -Np1 -i
  $startdir/src/${pkgname}_${pkgver}-$_patchlevel.diff || return 1

  ./configure --prefix=/usr
  make || return 1
  make install
}

{{< /file-excerpt >}}

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
