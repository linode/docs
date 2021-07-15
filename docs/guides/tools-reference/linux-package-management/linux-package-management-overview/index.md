---
slug: linux-package-management-overview
author:
  name: Linode
  email: docs@linode.com
description: Learn basics and advanced Linux package management in Debian, Ubuntu, Fedora, etc using apt, yum, aptitude and other package managers.
keywords: ["dnf", "rpm", "apt", "dpkg", "apt-get", "apt-cache", "pacman", "yum"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/basics/linux-package-management/','/using-linux/package-management/']
modified: 2021-07-15
modified_by:
  name: Linode
published: 2021-07-15
title: "An Overview of Package Management in Linux"
tags: ["linux"]
---

Many guides within Linode's documentation (and elsewhere online) require the installation of new software. These guides typically provide basic commands that utilize a package manager to install that software. In some cases, you may wish to go beyond these basic commands to install a particular version, search for previously installed packages, or perform other actions. The purpose of this guide is to provide a solid understanding of package management in Linux and an overview of the most most widely used package managers.

## Package Management Concepts

### Packages

Most software designed for Linux or Unix systems are distributed as *packages*, which are archives that contain the pre-compiled binary software files, installation scripts, configuration files, dependency requirements, and other details about the software. These packages are typically specific to a particular distribution and formatted in that distribution's preferred package format, such as `.deb` for Debian/Ubuntu and `.rpm` for CentOS/RHEL.

While it's relatively simple for a user to install a package file, there are other complexities to consider. These complexities include obtaining (downloading) the package, ensuring packages are upgraded with security and bug fixes, and maintaining all the dependencies for the software.

### Package Managers

A *package manager* reduces the complexity for the end-user by automating the process of obtaining, installing, upgrading, and removing packages *and their dependencies* (additional software required for the original software to function). This dramatically improves the user experience and the ability to properly and efficiently manage the software on your Linux system. Today, package managers can be a defining feature for Linux distributions and many system administrators prefer to use a particular distribution based on its package management system (among other considerations).

## List of Package Managers

There are lots of package managers in Linux, each working a bit differently. Here is a list of common package managers, along with their supported distributions, package file formats, and a description.

### APT (including `apt`, `apt-get`)

[Using APT to Manage Packages in Debian and Ubuntu](/docs/guides/apt-package-manager/)

- **Distributions:** Debian-based, including Debian and Ubuntu
- **Package format:** `.deb`
- **Underlying package management tool:** dpkg

*Advanced Package Tool*, more commonly known as [**APT**](https://en.wikipedia.org/wiki/APT_(software)), is a package management system for Debian, Ubuntu, and other similar Linux distributions. It acts as a front-end to the lower-level [**dpkg**](https://en.wikipedia.org/wiki/Dpkg) package manager, which is used for installing, managing, and providing information on `.deb` packages. Most distributions that use APT also include a collection of command-line tools that can be used to interface with APT. These tools include `apt-get`, `apt-cache`, and the newer `apt`, which essentially combines both of the previous tools with some modified functionality.

### YUM

[Using YUM to Manage Packages in CentOS/RHEL 7 and Earlier](/docs/guides/yum-package-manager/)

- **Distributions:** RHEL/CentOS 7, Fedora 21, and earlier versions of both distributions
- **Package format:** `.rpm`
- **Underlying package management tool:** RPM

*Yellowdog Updater, Modified*, more commonly known as **YUM**, is a package management tool for a variety of older RHEL-based distributions (such as CentOS 7) and older versions of Fedora. It provides an easy-to-use interface on top of the low-level functions available in the RPM Package Manger (RPM). It has largely been replaced by it successor *Dandified YUM*, also called **DNF**, on most newer RPM-based distributions.

### DNF

[Using DNF to Manage Packages in CentOS/RHEL 8 and Fedora](/docs/guides/dnf-package-manager/)

- **Distributions:** RHEL/CentOS 8, Fedora 22, and later versions of both distributions
- **Package format:** `.rpm`
- **Low-level package manager:** RPM

*Dandified YUM*, or simply **DNF**, is the successor to **YUM**. Just like YUM, DNF provides a user-friendly interface to the RPM Package Manager (RPM) that comes with CentOS, RHEL, Fedora, and many other Linux distributions. As the successor to YUM, DNF has several enhancements including increased performance, faster dependency resolution, and more complete documentation for its API. Most distributions still link the `yum` command to the DNF software and, since DNF maintains compatibility with much of YUM's CLI, most commands using `yum` still function as intended.

### Zypper

- **Distributions:** OpenSuse
- **Package format:** `.rpm`
- **Underlying package management tool:** ZYpp (also called libzypp)

### Pacman

[Using Pacman to Manage Packages in Arch](/docs/guides/pacman-package-manager/)

- **Distributions:** Arch-based, including Arch and Manjaro
- **Package format:** tar archive
- **Package manager:** [pacman](https://wiki.archlinux.org/title/pacman)

### Portage (the `emerge` command)

[Using Portage to Manage Packages in Gentoo](/docs/guides/portage-package-manager/)

- **Distributions:** Gentoo
- **Package format:** binary source or tar archive
- **Package manager:** Portage (the `emerge` command)

### Slackware Package Management

[Managing Packages in Slackware](/docs/guides/slackware-package-management/)

- **Distributions:** Slackware
- **Package format:** tar archive
- **Package managerment tools:** `slackpkg`, `pkgtool`, `installpkg`, `upgradepkg`, `removepkg`