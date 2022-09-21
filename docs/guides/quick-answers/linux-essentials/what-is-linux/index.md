---
slug: what-is-linux
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with an overview of the Linux Operating System, including details about its history, the Kernel, development models, lifecycles, and more.'
keywords: ['linux','unix','kernel','open source','free software']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-26
modified: 2018-07-26
modified_by:
  name: Linode
title: "What is Linux?"
contributor:
  name: Linode
tags: ["linux"]
aliases: ['/quick-answers/linux-essentials/what-is-linux/']
---

Linux refers to the *Linux Kernel* plus all the tools, utilities and libraries running on top of the kernel, many of which are managed under the umbrella of the GNU project. Colloquially, Linux refers to an *operating system* (OS). There are Linux community members that find it more correct and precise to use the term [GNU/Linux](https://www.gnu.org/gnu/linux-and-gnu.en.html) over Linux alone as a name for the OS.

Linux works similarly to other well-known OSes like Windows and macOS. As an operating system, Linux manages your computer or server’s hardware and provides background services that your other software needs to run.

A significant difference between Linux and other OSes is that it’s open source and free of cost. Open source means anyone has access to the Linux source code and can contribute to enhancing it, adding features, and fixing bugs and security vulnerabilities. Independent programmers all around the world invest their time and expertise improving Linux. This model of software development rivals proprietary OSes that keep their code closed and solely work with the programmers they employ.

Linux is unique in its development model, history, and the strength of its community. At its core it is a mature and secure operating system that anyone can easily begin using for today’s most common tasks like accessing the internet, editing text documents, and creating media. This Quick Answer covers some key defining features of Linux.

## What is the Linux Kernel?

In OS architectures, the *kernel* is the core interface between a machine’s hardware and its software. The kernel's operation is invisible and not directly accessible to the end-user. Instead, most desktop users are familiar with applications within the *user space* of an operating system. These user space tools include web browsers, GUI file systems, and the [Bash shell](https://en.wikipedia.org/wiki/Bash_(Unix_shell)).

These applications interact with the kernel via an explicitly-defined *application programming interface* (API) or *system call interface* (SCI). No access to the kernel is available outside of this API/SCI, which is an important security concept. Two examples of system calls that an application may make are saving the contents of a file to disk or opening a network connection.

The Linux Kernel was developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) in 1991. Some of the key design principles he implemented include:

-   An “[everything is a file](https://en.wikipedia.org/wiki/Everything_is_a_file)" philosophy

-   Multi-user and [multi-tasking](http://www.linfo.org/multitasking.html) capability

-   Portability between different CPU architectures

-   [Modularity](http://www.tldp.org/HOWTO/Module-HOWTO/x73.html)

-   Security

-   [Configurability](https://en.wikipedia.org/wiki/Sysctl)

The kernel's design is flexible, and that has led to the spawning of different varieties of the Linux operating system that are supported on a large array of computer architectures, including servers and [smartphones](https://en.wikipedia.org/wiki/Android_(operating_system)#Linux_kernel).

If you’re curious about current Linux Kernel development, you can access a read-only version of the latest Linux Kernel repository on [GitHub](https://github.com/torvalds/linux/) to browse the code. You can also read about how to participate in [Linux Kernel development](https://www.kernel.org/doc/html/v4.13/process/howto.html) for a better understanding of what it takes to contribute to the project.

## Development History

The Linux Kernel borrows much of its design from *Unix*, a predecessor operating system developed in 1969 by computer scientists at AT&T’s Bell Laboratories, Ken Thompson and Dennis Ritchie. When Unix first emerged, it was freely licensed because of antitrust limitations on AT&T. This allowed for peer-reviewed development and wide adoption by academic institutions and businesses.

Once Bell Labs was no longer obligated to maintain Unix’s free license, it became a proprietary product. This incentivized programmers like Richard Stallman to work on creating a “[free as in freedom](https://www.gnu.org/philosophy/free-sw.en.html)” version of a Unix-like operating system, committed to a set of ethical standards around software development. Stallman’s free software operating system is [GNU](https://www.gnu.org/). The [Free Software Movement](https://www.gnu.org/philosophy/free-software-intro.en.html), spearheaded by Stallman, is a significant piece of computing history that is still relevant today.

At the same time and throughout the 1980s, the Berkeley Software Distribution (BSD), which was originally the Unix source code with added features, was rewritten to avoid the proprietary code. Where GNU/Linux requires that the source code and all derivatives be licensed under the open [GPL General Public License](https://www.gnu.org/licenses/licenses.html), the [BSD 4Clause License](https://directory.fsf.org/wiki/License:BSD_4Clause) allows for derivative work to use a different license. In particular, much of Apple's macOS was originally derived from BSD.

## Linux Distributions

Using Linux means selecting a [*distribution*](https://en.wikipedia.org/wiki/Linux_distribution) (distro) to suit your needs, and there are many to choose from. Some well-known distros are Ubuntu, Debian, CentOS, Gentoo, and Arch. Each Linux distribution varies in its general use case and audience.

* [Ubuntu’s desktop](https://www.ubuntu.com/desktop) version is feature rich with a user-friendly GUI--a great place to begin if you’re just getting started with Linux.

* [Debian](https://www.debian.org/) requires more configuration during installation of the OS and system software, and is strictly committed to only using free software.

* [CentOS](https://www.centos.org/) is a free and community-supported version of [Red Hat Enterprise Linux](https://en.wikipedia.org/wiki/Red_Hat_Enterprise_Linux) (RHEL).

* With [Gentoo](https://www.gentoo.org/get-started/), you compile everything from source, so you choose exactly what you install when adding any new software to your system.

* [Arch](https://www.archlinux.org/) features a rolling release cycle and an incredibly dedicated community that maintains the distro as well as the Arch User Repository (AUR) of software packages.

### Graphical User Interfaces and Desktop Environments

Windows and macOS both come with a single graphical user interface (GUI) that is generally not able to be replaced or substantially changed by the user. In contrast, there are a wide variety of GUIs available for Linux, and Linux users can switch between them and customize them according to personal preference. In essence, the desktop environment is simply a graphical shell that interacts with the Linux Kernel.

Popular GUIs include [GNOME](https://www.gnome.org/), [KDE](https://www.kde.org/plasma-desktop.php), [Xfce](https://xfce.org/), and [Cinnamon](https://en.wikipedia.org/wiki/Cinnamon_(software)). Different desktop Linux distributions come packaged with specific GUIs, but those can also be changed by the user after installation.

### Minimum Install Distributions for Older Hardware

Many Linux distributions offer good performance on older hardware, including entire desktop environments that are designed to be resource-efficient. As a result, running Linux is a popular way to revive aging computers.

Some distributions are specifically designed to run with minimal hardware specifications, and these minimum install distros provide the kernel features needed for a fully functional operating system. Packages can be added as needed, which helps to keep the initial install size small and clutter free.

Some examples of lightweight distributions include:

* [Damn Small Linux](http://www.damnsmalllinux.org/)
* [Linux Lite](https://www.linuxliteos.com/)/[Lubuntu](https://lubuntu.me/)/[LXLE](http://www.lxle.net/)
* [Puppy](http://puppylinux.com/)
* [Vector](http://vectorlinux.com/)

### Applications and Package Managers

Linux distributions feature a built-in *package manager*, which is a tool that helps install, update, and remove applications. The package manager differs by distribution: [**APT**](https://en.wikipedia.org/wiki/APT_(Debian)) is the manager for Debian and Ubuntu systems, and [**YUM**](https://en.wikipedia.org/wiki/Yum_(software)) is the manager for CentOS and RHEL systems.

These tools retrieve packaged applications from *repositories* (repos), which are archives of software available for your Linux environment. Distributions offer *stable* repositories composed of software that has received extensive testing. You can also configure your package manager to use alternative repositories which feature newer software versions that have received less testing. Third-party repositories exist which feature software not included in any of your distribution's standard repositories.

In addition to a distribution's built-in package manager, you might use an *application-level* package manager. Examples of application-level package managers are [*pip*](https://pypi.org/project/pip/) for Python applications and [*npm*](https://www.npmjs.com/) for Node.js applications.

For a comprehensive list of available package managers, visit [Wikipedia](https://en.wikipedia.org/wiki/List_of_software_package_management_systems).

## Learn More

There are many avenues to explore when first using Linux. Our Guides & Tutorials provide a great starting point for learning more:

- The [Introduction to Linux Concepts](/docs/guides/introduction-to-linux-concepts/) guide will give you a more detailed and technical orientation on Linux and ways to start using it with a Linode.

- Once you’re familiar with Linux and the Command Line, you can learn basic [Linux System Administration](/docs/guides/linux-system-administration-basics/).

- If you’re interested in getting started with development, the [Why use Linux for Development?](/docs/guides/why-use-linux-for-development/) guide will give you a useful primer for making a choice about a development system.
