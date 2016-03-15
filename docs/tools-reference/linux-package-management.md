---
author:
  name: Linode
  email: docs@linode.com
description: Guides for installing and managing software on major Linux operating systems.
keywords: 'Linux package management,rpm,apt,dpkg,apt-get,apt-cache,pacman,yum'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['using-linux/package-management/']
modified: Tuesday, March 15, 2016
modified_by:
  name: Linode
published: 'Thursday, July 16th, 2009'
title: Linux Package Management
---

Many tutorials reference "package managers" and "package management tools." If you are new to the Linux world and don't understand the purpose of these technologies, or if you are familiar with one package management tool but need to learn how to use another, this guide will provide an introduction to the major package management tools.

## Package Management Concepts

Contemporary distributions of Linux-based operating systems install software in pre-compiled *packages*, which are archives that contain binaries of software, configuration files, and information about dependencies. Furthermore, package management tools keep track of updates and upgrades so that we don't have to hunt down information about bug and security fixes.

Without package management, users must ensure that all of the required dependencies for a piece of software are installed and up to date, compile the software from the source code (which takes time and introduces compiler-based variations from system to system), and manage configuration for each piece of software. Without package management, application files are located in the standard locations for the system to which the developers are accustomed, regardless of which system you're using. 

Package management systems attempt to solve these problems, and are the tools through which developers attempt to increase the overall quality and coherence of a Linux-based operating system. The features that most package management applications provide are:

-   **Package downloading**: Operating system projects provide repositories of packages which allow users to download their packages from a single, trusted provider. When you download from a package manager, the software can be authenticated and will remain in the repository even if the original source becomes unreliable.
-   **Dependency resolution**: Packages contain meta-data which provides information about what other packages are required by the package in question. This allows applications and their dependencies to be installed with one command, and for programs to rely on common shared libraries, reducing bulk and allowing the operating system to manage updates to the packages.
-   **A standard binary package format**: Packages are prepared in a uniform way across the system in order to make installation easier. While some distributions share formats, there can be compatibility issues between similarly formatted packages for different operating systems.
-   **Common installation and configuration locations**: System developers often have conventions for how applications are configured and the layout of files in the `/etc/` and `/etc/init.d/` directories; by using packages, systems are able to enforce a single standard.
-   **Additional system-related configuration and functionality**: Occasionally, operating system developers will develop patches and helper scripts for their software which get distributed in the packages. These modifications can have a significant impact on user experience.
-   **Quality control**: Operating system developers use the packaging process to test and ensure that the software is stable and free of bugs that might affect product quality, and that the software doesn't cause the system to become unstable. The subjective judgments and community standards that guide packaging and package management guide the "feel" and "stability" of a given system.

In general, we recommend that you install the versions of software available in your distribution's repository and packaged for your operating system. If packages for the application or software that you need to install aren't available, we recommend that you find packages for your operating system or package the software rather than installing it manually.

The remainder of this guide will cover how to use specific package management systems and how to compile and package software yourself.

## Debian and Ubuntu Package Management

The Debian package management system, based on a tool called `dpkg` with the very popular `apt` system is a powerful, popular, and useful method of package management. In addition to Debian 5 (known as "Lenny") a number of other prominent distributions of GNU/Linux are derived from the Debian system, most notably the Ubuntu family of distributions.

As a result, these instructions are applicable for Debian and Ubuntu systems. While Debian and derived systems are not necessarily binary-compatible, .debs packaged for Debian are often compatible with Ubuntu (though this is not a supported workflow). 

### Advanced Packaging Tool (APT)

You may already be familiar with `apt-get`, a command which uses the advanced packaging tool to interact with the operating system's package system. The most relevant and useful commands are (to be run with root privileges):

-   `apt-get install [package-name(s)]` - Installs the package(s) specified, along with any dependencies
-   `apt-get remove [package-name(s)]` - Removes the package(s) specified, but does not remove dependencies
-   `apt-get autoremove` - Removes any *orphaned* dependencies, meaning those that remain installed but are no longer required
-   `apt-get clean` - Removes downloaded package files (.deb) for software that is already installed
-   `apt-get purge [optional]` - Combines the functions of `remove` and `clean` for a specific package, as well as configuration files
-   `apt-get update` - Reads the `/etc/apt/sources.list` file and updates the system's database of packages available for installation. Run this after changing `sources.list`
-   `apt-get upgrade` - Upgrades all packages if there are updates available. Run this after running `apt-get update`

While `apt-get` provides the most often used functionality, APT provides additional information that you may find useful in the `apt-cache` command.

-   `apt-cache search [package-name]` - If you know the name of a piece of software but `apt-get install` fails or points to the wrong software, this looks for other possible names
-   `apt-cache show [package-name]` - Shows dependency information, version numbers and a basic description of the package
-   `apt-cache depends [package-name]` - Lists the packages that the specified packages depends upon in a tree. These are the packages that will be installed with the `apt-get install` command
-   `apt-cache rdepends [package-name]` - Outputs a list of packages that that depend upon the specified package. This list can often be rather long, so it is best to pipe its output through a command like `less`
-   `apt-cache pkgnames` - Generates a list of the currently installed packages on your system. This list is often rather long, so it is best to pipe its output through a command like `less`

Combining most of these commands with `apt-cache show` can provide you with a lot of useful information about your system, the software that you might want to install, and the software that you have already installed. If you're overwhelmed by `apt-cache` check out the following resources for easy-to-read lists of available packages:

-   [The Debian Package Directory](http://packages.debian.org)
-   [The Ubuntu Package Directory](http://packages.ubuntu.com)

### Aptitude

Aptitude is another front-end interface for APT. In addition to a graphical interface, Aptitude provides a combined command line interface for most APT functionality. Some notable commands are:

-   `aptitude update`, `aptitude install`, `aptitude remove`, `aptitude clean`, `aptitude purge` - Same as their apt-get counterparts.
-   `aptitude search`, `aptitude show`, - Same as their apt-cache counterparts.
-   `aptitude download` - Downloads a .deb file for a given package into the current directory.

Aptitude also includes *safe upgrading*, meaning it doesn't remove existing packages, as well as *holding*, which prevents the system from upgrading specific packages. 

### Introducing /etc/apt/sources.list

The file `/etc/apt/sources.list` controls repositories from which APT constructs its database. This file contains lines in the following format:

    deb [location-of-resources] [distribution] [component(s)]

Here are some examples:

    deb http://mirror.cc.columbia.edu/pub/linux/debian/debian/ lenny main contrib
    deb http://emacs.orebokech.com lenny main

The first line specifies the Columbia University mirror for the the Lenny distribution (Debian 5.0, Stable Release 14 February 2009), as well as the main and contributed components. The next line specifies the emacs.orebokech.com repository for Lenny, which provides regularly updated packages for emacs-snapshot (versions of emacs23, built from the current CVS tree), and its main component.

In general, one does not want to add new entries to `sources.list` without a lot of scrutiny and diligence, as updating the package cache with additional repositories and running upgrades can sometimes result in the installation of broken packages, unmet dependencies, and system instability. In Debian systems, downgrading is often difficult.

For Debian systems, the repository names can either refer to the distribution code name (version specific; e.g. lenny for current-stable, squeeze for testing, sid for unstable, etch for old-stable) or to a specific branch (e.g. oldstable, stable, testing, unstable). For more information about Debian versions and choosing a Debian version or branch, read the [Debian releases and branches page](http://www.us.debian.org/releases/).

The component section of the line divides the repository based on how much support the developers of the operating system are able to offer for the contained packages (e.g. main vs. contrib), or if the software is considered "free-software" or simply freely-distributable (e.g. non-free).

The layout of `sources.list` is a bit different in Ubuntu systems. The lines are in the same format but the names of the distributions and components are different:

-   Ubuntu versions have a different naming scheme. Version 8.10 is named "hardy" in `sources.list`, 9.04 is "jaunty," and 9.10 is "karmic."" These names follow an alphabetical pattern.
-   Ubuntu components are: "main" and "restricted" for supported free and non-free packages; "universe" and "multiverse" for unsupported free and non-free software.

### Using dpkg

`apt-get` and `apt-cache` are merely front end programs that provide a more usable interface, and connections to repositories for the underlying package management tools called `dpkg` and `debconf`. These tools are quite powerful, and fully explaining their functionality is beyond the scope of this document. However, a basic understanding of how to use these tools is useful. Some important commands are:

-   `dpkg -i [package-file-name].deb` - Installs a .deb file.
-   `dpkg --list [search-pattern]` - Lists packages currently installed on the system.
-   `dpkg --configure` - Runs a configuration interface to set a package up.
-   `dpkg-reconfigure` - Runs a configuration interface on an already installed package.

For more information about building your own packages, refer to the [Debian New Maintainers Guide](http://www.debian.org/doc/maint-guide/)

## Fedora and CentOS Package Management

Fedora and CentOS are closely related distributions, being upstream and downstream (respectively) from Red Hat Enterprise Linux. Their main differences stem from how packages are chosen for inclusion in their repositories. From a package management perspective the tools are very similar.

Both systems use the `yum` program as a front end to interact with system repositories and install dependencies, and also include a lower-level tool called `rpm` which allows you to interact with individual rpm packages.

**Note:** Many operating systems aside from RedHat and Fedora use `rpm` packages. These include OpenSuSE, AIX, and Mandriva; while it may be possible to install an RPM packaged for one operating system on another, this is not supported or recommended, and the results of this action can vary greatly.

### Yellow Dog Updater, Modified (YUM)

The YUM tool was initially developed for the Yellow Dog Linux system as a replacement for the then-default Yellow Dog Updater (YUP). RedHat found the YUM tool to be a valuable addition to their systems. Today YUM is the default package and repository management tool for a number of operating systems.

From the command line, you can use the following commands to interact with YUM:

-   `yum install [package-name(s)]` - Installs the specified package(s) along with any required dependencies
-   `yum erase [package-name(s)]` - Removes the specified package(s) from your system
-   `yum search [search-pattern]` - Searches the list of package names and descriptions for packages that match the search pattern and provides a list of package names, with architectures and a brief description of the package contents. Note that regular expression searches are not permitted
-   `yum deplist [package-name]` - Lists all of the libraries and modules that the named package depends on, along with the names of the packages (including versions) that provide those dependencies
-   `yum check-update` - Refreshes the local cache of the yum database so that dependency information and the latest packages are always up to date.
-   `yum info [package-name]` - The results of the info command provides the name, description of the package, as well as a link to the upstream home page for the software, release versions and the installed size of the software.
-   `yum reinstall [package-name]` - Erases and then downloads a new copy of the package file and re-installs the software on your system
-   `yum localinstall [local-rpm-file]` - Checks the dependencies of an .rpm file and then installs it
-   `yum update [optional-package-name]` - Downloads and installs all updates including bug fixes, security releases, and upgrades, as provided by the distributors of your operating system. Note that you can specify package names with the update command
-   `yum upgrade` - Upgrades all packages installed in your system to the latest release

### RPM Package Manager (RPM)

The YUM program is simply a front end to a lower-level tool called RPM, similar to `apt-get`'s relationship with `dpkg`. The chances are good that you will not need to interact with RPM very much, but there are a few commands that you may find useful.

The following commands should be run as root. The flags are expanded here, but the abbreviated syntax is also included.

-   `rpm --install --verbose --hash [local-rpm-file-name].rpm` or `rpm -ivh [filename].rpm` - Installs an rpm from the file. `rpm` is also capable of installing RPM files from http and ftp sources as well as local files
-   `rpm --erase [package-name]` or `rpm -e` - Removes the given package. Usually will not complete if `[package-name]` matches more than one package, but will remove more than one match if used with the `--allmatches` flag
-   `rpm --query --all` or `rpm -qa` - lists the name of all packages currently installed
-   `rpm --query [package-name]` - or `rpm -q` - allows you to confirm whether a given package is installed in your system
-   `rpm --query --info [package-name]` or `rpm -qi` - displays the information about an installed package
-   `rpm --query --list [package-name]` - Often, `rpm -ql` - generates a list of files installed by a given package. This is complemented by:
-   `rpm --query --file` or `rpm -q qf [file-name]` - checks to see what installed package "owns" a given file

(_Note:_ RPM does not perform dependency resolution. You must install dependencies manually when using rpm.) For more information about RPM please consult these external sources:

-   [iDevelopment Info - RPM Commands](http://www.idevelopment.info/data/Unix/Linux/LINUX_RPMCommands.shtml)
-   [Quick Guide to RPM](http://www.tfug.org/helpdesk/linux/rpm.html)

### Introducing /etc/yum.conf

The file located at `/etc/yum.conf` provides system-wide configuration options for YUM, as well as information about repositories. Repository information may also be located in files ending in `.repo` under `/etc/yum.repos.d`

The options in the `[main]` stanza shouldn't need modification, though you may set alternate logging and cache locations for the database by adding the following lines:

{: .file-excerpt}
/etc/yum
: ~~~ conf
  logfile=/var/log/yum.log
  cachedir=/var/cache/yum
  ~~~

To define a new stanza for a new repository use the following template, replacing the capitalized strings with your intended values:

{: .file-excerpt}
/etc/yum
: ~~~ conf
  [REPO-NAME]
  name=REPOSITORY-NAME
  mirrorlist=HTTP-ACCESSIBLE-MIRROR-LIST 
  #baseurl=BASE-URL-FOR-REPOSITORY
  gpgcheck=BOOLEAN-VALUE[1-or-0]-TO-VERIFY-REPOSITORY
  gpgkey=FILE-PATH-TO-GPG-KEY
  ~~~

The following example is the default configuration for the "Base" repository in CentOS 5.2:

{: .file-excerpt}
/etc/yum
: ~~~ conf
  [base]
  name=CentOS-$releasever - Base
  mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os
  #baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
  gpgcheck=1
  gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-5
  ~~~

## Slackware Package Management

*Credit: This section was kindly provided by* [JK Wood](http://slaxer.com/).

Packages in Slackware Linux are distributed as compressed tarballs, generally using gzip or lzma compression. These tarballs can be recognized by their suffixes, `.tgz` or `.txz`. This format includes a complete filesystem layout, as well as additional scripts to be run upon installation or removal of the software. Slackware packages do not include any dependency resolution information; this is generally viewed in the Slackware community as allowing more flexibility and control.

Packages can also be built using SlackBuilds, shell scripts that compile source or repackage binary distribution packages for easy installation and removal on Slackware. These scripts were originally used by Pat Volkerding to produce official packages, and have since been adopted as a community standard by such sites as SlackBuilds.org, which provides many common third-party packages not available in Slackware proper.

Slackware includes `pkgtool` for local package management and `slackpkg` for remote installation of packages from official mirrors. For less interactive tasks, there are `installpkg`, `upgradepkg`, and `removepkg`.

### Working With Packages Locally

The `pkgtool` program offers the ability to manage packages on the local system. It uses the dialog library to generate menus, allowing fully interactive administration even in an SSH session through a text-based menu interface. Each option is fairly self-explanatory, from installing packages from the Current or an Other directory, to Removing installed packages, Viewing a list of files in a package, and running Slackware Setup scripts.

The package installation operations offer a list of packages in a menu, with the ability to choose which packages to install and which to leave alone. The package removal option offers a similar choice, with a complete list of installed packages. Viewing a package can be useful to determine what precisely is in it, as some come with rather cryptic names. The information offered includes a description written by the creator of the package along with the expected list of files.

The Setup scripts options do not often apply to Linode, though there is a `netconfig` option that may be useful to some users.

For those seeking a more traditional command-line approach, the `*pkg` commands are fairly straightforward in their use.

-   `installpkg [package]` - Installs a package from the current directory, or a pathname you specify. It accepts full filenames, as well as globs such as `*/*.t?z` for all tgz, tbz, tlz, or txz packages in all immediately adjacent directories
-   `upgradepkg [package]` - Upgrades a package from the current directory, or a pathname you specify. If also accepts full filenames and globs like `installpkg`. Note that the `--install-new` flag can be passed to allow `upgradepkg` to operate like `installpkg` on packages that are not currently installed on the system
-   `removepkg [package]` - Removes a package from the system. This command does not require a full filename, but can often operate with only the software name associated with the package

### Working With Packages Remotely

The `slackpkg` program is a recent addition to Slackware that allows official Slackware packages to be installed and upgraded using a remote ftp or http mirror. Before using Slackpkg, a mirror should be chosen in `/etc/slackpkg/mirrors`, and can be selected from the available list there or added as you like. Only one mirror can ever be active, and is chosen by uncommenting it (deleting the initial "#).

While `slackpkg` offers a menu-based interface, it can also be run in a console-only method by setting `DIALOG=off` in `/etc/slackpkg/slackpkg.conf`.

-   `slackpkg check-updates` - Checks for changes to the Changelog on the remote mirror. This can be especially useful in a cron script to notify the system administrator of new patches
-   `slackpkg update` - Checks for and downloads updates to the Slackware changelog and file lists. This check can be useful when looking for security updates, and must be run before attempting to download updated software
-   `slackpkg install-new` - Looks for new packages that have been made available. While rarely useful on a static release, this command should be run before others on machines running the current development release or when upgrading to a new release.
-   `slackpkg install [package]` - Looks for any packages matching the name given, and presents the user with a menu allowing the choice of installation. Note that all commands accepting a package name will also work with Slackware installation series, such as ap, d, or xap.
-   `slackpkg upgrade-all` - Presents the user with a menu listing all packages on the remote mirror that do not match the current versions installed on your system. While this will generally result in upgrades, be warned that outdated software can be listed as an upgrade in some situations, such as when changing to an outdated mirror, or using self-built packages to replace standard Slackware packages. One common area this occurs is using alienBOB's multilib glibc packages on Slackware 64-bit. Upon choosing and confirmation of upgrades, the chosen packages will be downloaded and upgraded
-   `slackpkg upgrade [package]` - Searches for any packages matching the name given, and presents a menu to allow upgrades
-   `slackpkg clean-system` - Presents a menu listing all packages on the local system that are not present on upstream mirrors. This can include self-built packages, packages installed from a third-party source, or packages that were once included in Slackware, but have since been removed
-   `slackpkg remove [package]` - Attempts to find any installed packages matching the name given, and presents the user with a menu allowing the choice of removal
-   `slackpkg reinstall [package]` - Reinstalls the given package. Useful if certain files in that package have been corrupted
-   `slackpkg search [package]` - Searches for the given package name, and displays matching packages as well as installation status
-   `slackpkg file-search [filename]` - Searches installed and remote package descriptions for the given filename, and displays matching packages as well as installation status
-   `slackpkg blacklist [package]` - Adds the given package to the blacklist located in `/etc/slackpkg/blacklist`. Blacklisted packages will not be installed, upgraded, or removed by slackpkg
-   `slackpkg info [package]` - Displays standard information about the given package

### SlackBuilds, sbopkg, and Third-Party Packages

Slackware does not offer as large a selection of official software as some other more community-oriented distributions, so packages from third parties can sometimes be of dubious quality. For this reason, the use of third-party software repositories in Slackware is generally discouraged. Third-party package management tools such as slapt-get are also frowned upon, as they have a reputation for breaking systems.

The Slackware community have banded together to produce SlackBuilds.org, offering SlackBuild scripts for a growing volume of third-party software. These scripts are heavily vetted for integrity and proper operation. Dependencies are noted in READMEs, and all builds are verified to work as advertised in a clean build environment. Local compilation also verifies that packages for your machine will work on your machine.

To facilitate the management of SlackBuilds, sbopkg.org offers `sbopkg`, which operates similarly to `slackpkg`, but works with SlackBuilds.org.

The `sbopkg` program, like `pkgtool`, offers a text-based menu interface. There is also a Sync option, which ensures that you are working with the latest version of all SlackBuilds. SlackBuilds can be browsed or searched for, as can the Changelog. `sbopkg` offers an Updates option, which compares local versions of your packages to remote versions of the SlackBuilds and reports differences. Unlike `slackpkg`, `sbopkg` does weak checking for updated version numbers, and will not by default overwrite a package it thinks is newer than what's on the server. In addition, `sbopkg` offers the ability to manage the order in which SlackBuilds are built using a queue system, and allows the user to make changes to the SlackBuild locally. Finally, you can view which SlackBuilds.org packages are installed, and also perform such tasks as choosing a different repository version to work with or look for updates to `sbopkg` itself.

## Package Management in Arch Linux with Pacman

Arch Linux uses binary packages in a `.tar.gz` format, and also provides a "ports" build system that facilitates building packages.

The Arch tool, `pacman` provides helpful, detailed output. Arch Linux runs on a "rolling release" schedule, which means packages are added to the main repository when they (and their dependencies) are ready for production. This means that there aren't release versions of Arch, as all systems, once upgraded, are of equivalent version.

Therefore, administrators of Arch Linux must consider the output of `pacman` carefully before agreeing to upgrade or update any packages.

### Introducing Pacman

While the pacman tool is very powerful, it is also very simple. We encourage you to become more familiar with the tool, but there are three core commands for basic package management: 

-   `pacman --query [package-name]` or `pacman -Q` - Use this command to search the package database for a package name and version number.
-   `pacman --sync [package-name(s)]` or `pacman -S` - This is the base command for installing new packages, downloading new content for the database and upgrading the system, depending on the options and the named package or packages.
-   `pacman --remove [package-name(s)]` or `pacman -R`-Removes the named package or packages.

Note that the terse flags are all uppercase and case-sensitive. These terse flags are often combined with additional flags for additional functionality. Here are some examples and a brief description of the functionality they provide:

-   `pacman -Qi [package-name]` - Displays information about a given package, including dependency information, the date of the package, a link to the upstream source and other useful information about a package.
-   `pacman -Qo [file-name]` - Outputs the version number and name of the package which "owns" a given file
-   `pacman -Qs [package-name]` - Searches among the installed packages for a given package-name
-   `pacman -Qu` - Lists out-of-date installed packages that are in need of an update
-   `pacman -Sy` - Triggers a database refresh, and synchronizes the local database with the remote database.
-   `pacman -Su` - Triggers a full system update and downloads new packages to upgrade the system. The update and refresh command can (and should) be run together, as in: `pacman -Syu`
-   `pacman -Sc` - Removes uninstalled packages from the cache and attempts to clean up old copies of the repository database
-   `pacman -S --ignore [package-name(s)]` - Ignores upgrades to a given package or list of packages
-   `pacman -Rs` Removes a package and its dependencies, as long as the dependencies are not needed and were not explicitly installed by the user. This command is the inverse of `pacman -S`.
-   `pacman -Ru` Removes packages that are unneeded by any other packages

### Configuration Options

The configuration for `pacman` is defined in the `/etc/pacman.conf` file, while the addresses of the repository mirrors are contained in `/etc/pacman.d/mirrorlist`. The mirror list was created and prioritized during the installation process and you probably will not need to alter this.

The options provided in the stock `/etc/pacman.conf` are largely documented in comments, and are beyond the scope of this document. (You may access the manual page for this configuration file with the command `man pacman.conf`).

While it is unlikely that you would need to modify the default `pacman.conf` for most installations, know that you can change default installation and logging directories and specify packages to be held back from upgrades.

If you need to add an additional third party repository, you can do that by adding a repository stanza:

{: .file-excerpt}
/etc/pacman
: ~~~ conf
  [REPOSITORY-NAME]
  Server = SERVER-LOCATION
  Include = REPOSITORY-LIST
  ~~~

The `Server =` and `Include =` lines are both optional, and the order indicates their priority. By default, the testing repository is disabled, which is probably wise if you're planning to use the system for production work; however if you need bleeding-edge packages, uncomment those lines.

### Using the Arch Build System (ABS)

The Arch Build System allows users to compile and install software not included in the Arch repository within the `pacman` framework. This brief guide outlines the steps to building a package using the ABS.

All commands explained here should be run as root. Begin by installing the `abs` framework and the `base-devel` packages:

    pacman -Sy abs base-devel

Now, edit `/etc/abs.conf` so that the `REPOS` line indicates all of the proper repositories. Note, repositories prefixed with a bang (!) are disabled. The line might look like:

    REPOS=(core extra community !testing)

To create a local ABS tree in `/var/abs`, run the the `abs` command as root. You may now browse `/var/abs` which contains a representation of the package collection with folders representing each repository, category, and piece of software.

Arch recommends that you create a build directory at another location, perhaps `~/abs/`, where actual building will occur.

Begin the build process by copying the files from the ABS tree into your build directory (as a non-root user):

    cp -r /var/abs/[REPO]/[PACKAGE] ~/abs 

Now, change to the package's directory:

    cd ~/abs/[PACKAGE]

You have the option of modifying the `PKGBUILD` file. There's a build shell function where you can add additional patches to the files if you have any modifications to the software or the build process if you need to. That shell function generally looks like:

{: .file-excerpt}
~/abs/[PACKAGE]/PKGBUILD
: ~~~
  build() {
    cd $startdir/src/$pkgname-$pkgver.orig

    patch -Np1 -i
    $startdir/src/${pkgname}_${pkgver}-$_patchlevel.diff || return 1

    ./configure --prefix=/usr
    make || return 1 
    make install
  }
  ~~~
Now you're ready to build the package. Use the following command as a non-root user:

        makepkg -s

The `makepkg` command creates a package that contains dependency information. As root, issue the following command:

    pacman -U [package-file-name].pkg.tar.gz

Make sure to type the full package name exactly as it appears in the file system. Arch will now install the package and any required dependencies.

Because ABS downloads source and versions of the `PKGBUILD` file as it creates the package--sometimes checking out a copy of the source code from the version control system--we don't recommend deleting or removing files from the build directory hierarchy.

### More Information About Pacman and ABS

If you're interested in learning more about Arch and its package management tools, please consult these external sources for the documentation provided by the Arch community:

-   [The Arch Build System](http://wiki.archlinux.org/index.php/Arch_Build_System)
-   [Pacman](http://wiki.archlinux.org/index.php/Pacman)

## Gentoo Linux Package Management

Gentoo provides its entire operating system in source format. These source packages, in concert with "ebuild" scripts, provide a sophisticated package management system that borrows and builds on many concepts from the BSD's "ports" system.

Like Arch Linux, the Gentoo project produces new versions of Gentoo Linux on a rolling release cycle. 

This section addresses common package management tasks and functions using the "emerge" front end for the portage system. We encourage you to install the "gentoolkit" to provide additional package management tools, such as `equery`. You can install this package with the following command:

    emerge app-portage/gentoolkit

### Emerge/Portage Commands

-   `emerge --sync` - Updates the local copy of the portage tree, so that your local system can download and install the latest version of the software
-   `emerge --update --deep world` - Checks and updates all packages on the system to the latest version. This should be run regularly to avoid falling behind on a critical update
-   `emerge --search [keyword]` or `emerge -s [keyword]` - Searches the names of all of the packages for the given keyword. This command takes a regular expression as the keyword argument
-   `emerge --searchdoc [keyword]` or `emerge -S [keyword]` - Searches the full description for a given keyword. This command takes a regular expression as the keyword argument
-   `emerge [package-name]` - Installs the specified package or packages
-   `emerge -u [package-name]` - Updates the specified package to the latest version. Using the flag `-uD` also updates dependencies
-   `emerge --depclean [package-name]` or `emerge -c [package-name]` - Removes the specified package or packages
-   `emerge --depclean` - Removes packages that are orphaned. This means removal of all packages that weren't explicitly installed and are not not depended upon by any specific package. We recommend that you run it with the `--pretend` option before running this command on a production system
-   `emerge -evp --deep world` - Lists all of the packages currently installed on the system
-   `equery depends [package-name]` - Lists all of the packages that depends upon the specified package 
-   `equery files [package-name]` - Lists all of the files "owned" by a package
-   `equery belongs [file-name]` - Lists the package which "owns" a particular file

### USE Flags

Portage also makes it possible to install additional variants of a package with the "USE flags" options. To discover which USE flags are available for a given package, issue the following command:

    equery uses [package-name]

The `equery` command depends on the `gentoolkit` package. This will provide information about what USE flags are available and which have been installed. To specify additional USE flags:

    echo "[package-name] [use-flags]" >> /etc/portage/package.use
    emerge [package-name]

This will install the specified package with the appropriate options enabled.