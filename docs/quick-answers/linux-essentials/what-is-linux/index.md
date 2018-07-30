---
author:
  name: Linode
  email: docs@linode.com
description: 'Key topics about the Linux Operating System'
keywords: ['linux','unix','kernel','open source','free software']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-26
modified: 2018-07-26
modified_by:
  name: Linode
title: "What is Linux?"
contributor:
  name: Linode
---

Linux is an operating system (OS) that works similarly to other well-known OSes like Windows and macOS. As an operating system, Linux manages your computer or server’s hardware and provides background services that your other software needs to run. A significant difference between Linux and other OSes is that it’s open source and free of cost. Open source means anyone has access to the Linux source code and can contribute to enhancing it, adding features, and fixing bugs and security vulnerabilities. Independent programmers all around the world invest their time and expertise to improving Linux. This model of software development rivals proprietary OSes that keep their code closed and solely work with the programmers they employ.

Colloquially, Linux refers to the Linux Kernel plus all the tools, utilities and libraries running on top of the kernel, many of which are managed under the umbrella of the GNU project. There are Linux community members that find it more correct and precise to use the term [GNU/Linux](https://www.gnu.org/gnu/linux-and-gnu.en.html) over Linux alone as a name for the OS.

Linux is unique in its development model, history, and the strength of its community, but at its core it is a mature and secure operating system that anyone can easily begin using for today’s most common tasks like accessing the internet, editing text documents, and creating media. This Quick Answer covers some key defining features of Linux.

## What is the Linux Kernel?

In computer architecture, the kernel is the core interface between a machine’s hardware and its software. It manages things like memory, CPU, and disk drives on the hardware side, and system calls and processes on the software side. The kernel is used continuously by all aspects of the operating system, but is only one component of the whole system. Most desktop users are familiar with tools within the user space of an operating system like the web browsers, GUI file systems and the bash shell.  These tools interact with the kernel via its API while the kernel runs in the background.

The Linux Kernel was developed by Linus Torvalds in 1991. Some of the key design principles he implemented--and that have evolved with time and become defining components--include treating everything on the system “like a file,” being multi-user, multi-tasking, modular, secure, portable and configurable. Because of these design decisions, the Linux kernel is extremely flexible, and that has led to the spawning of different varieties of the Linux operating system that are supported on a large array of computer architectures, including servers and [smartphones](https://en.wikipedia.org/wiki/Android_(operating_system)#Linux_kernel).

If you’re curious about current Linux Kernel development, you can access a read-only version of the latest Linux kernel repository on [GitHub](https://github.com/torvalds/linux/) to browse the code. You can also read about how to participate in [Linux Kernel development](https://www.kernel.org/doc/html/v4.13/process/howto.html) for a better understanding of what it takes to contribute to the project.

## Unix

The Linux kernel borrows much of its design from Unix, a predecessor operating system developed in 1969 by computer scientists at AT&T’s Bell Laboratories, Ken Thompson and Dennis Ritchie. When Unix first emerged, it was freely licensed due to antitrust limitations on AT&T. This allowed for peer-reviewed development and wide adoption by academic institutions and businesses. Once Bell Labs was no longer obligated to maintain Unix’s free license, it became a proprietary product. This incentivized programmers like Richard Stallman to work on creating a “[free as in freedom](https://www.gnu.org/philosophy/free-sw.en.html)” version of a Unix-like operating system, committed to a set of ethical standards around software development. Stallman’s free software operating system is [GNU](https://www.gnu.org/). The [Free Software Movement](https://www.gnu.org/philosophy/free-software-intro.en.html), spearheaded by Stallman, is a significant piece of computing history that is still relevant today.

At the same time and throughout the 1980s, the Berkeley Software Distribution (BSD), which was originally the Unix source code with added features, was rewritten to avoid the proprietary code. Where GNU/Linux requires that the source code and all derivatives be licensed under the open [GPL General Public License](https://www.gnu.org/licenses/licenses.html), the [BSD 4Clause License](https://directory.fsf.org/wiki/License:BSD_4Clause) allows for derivative work to use a different license. This led to Apple's development of macOS and is currently one of the ways many people interact with Unix.

## Linux Distributions

Using Linux means selecting a distribution (distro) to suit your needs, and there are many to choose from. Some well-known distros are Ubuntu, Debian, CentOS, Gentoo, and Puppy Linux. Each Linux distribution varies in its general use case and audience.

* [Ubuntu’s desktop](https://www.ubuntu.com/desktop) version is feature rich with a user-friendly GUI--a great place to begin if you’re just getting started with Linux.

* [Debian](https://www.debian.org/) requires more configuration during installation of the OS and system software, and is strictly committed to only using free software.

* With [Gentoo](https://www.gentoo.org/get-started/), you compile everything from source and each package is the newest, bleeding edge version, so you choose exactly what you install when adding any new software to your system.

* [Arch](https://www.archlinux.org/) features a rolling release cycle and an incredibly dedicated community that maintains the distro as well as the Arch User Repository (AUR) of software packages.

### Graphical User Interfaces (GUI) and Desktop Environments

While both Windows and macOS both come with their own versions of a terminal, the operating system is associated with the graphical user interfaces they come with. While this is also true for the desktop versions of some Linux distributions that use GNOME, KDE, Unity, Xfce, or their derivatives, the desktop environment is only a graphical shell that interacts with the Linux kernel.

### Minimum Install Distributions for Older Hardware

Because Linux distributions have desktop interface features that run on older hardware and still compete with other mainstream operating systems, more users have been trying Linux as a way to revive their aging computers.

Some distributions are specifically designed to run with minimal hardware specifications, and these minimum install distros include the kernel features needed for a fully functional operating system. Packages can be added as needed, helping to keep the installed size small and clutter free.

Some examples of lightweight distributions include:

* [Damn Small Linux](http://www.damnsmalllinux.org/)
* [Linux Lite](https://www.linuxliteos.com/)/[Lubuntu](https://lubuntu.me/)/[LXLE](http://www.lxle.net/)
* [Puppy](http://puppylinux.com/)
* [Vector](http://vectorlinux.com/)

### Applications and Package Managers

Each distribution has its own built-in package manager and a repository of available applications from which it installs new software and tracks changes in installed applications. In addition to the distribution-specific repository which contains software tested to be stable on the target distribution, package managers include a way to add third party repositories that may contain more up-to-date applications.

In addition to a distribution's built-in package manager, you might use a *application-level* package manager like [*pip*](https://pypi.org/project/pip/) or [*npm*](https://www.npmjs.com/) to install and maintain Python and Node.js-specific applications.

For more information about available package managers, visit [Wikipedia](https://en.wikipedia.org/wiki/List_of_software_package_management_systems) for a more comprehensive understanding.

## Learn More

There are many avenues to explore when first using Linux. Our Guides & Tutorials provide a great starting point for learning more:

-  The [Introduction to Linux Concepts](/docs/tools-reference/introduction-to-linux-concepts/) guide will give you a more detailed and technical orientation on Linux and ways to start using it with a Linode.

- Once you’re familiar with Linux and the Command Line, you can learn basic [Linux System Administration](/docs/tools-reference/linux-system-administration-basics/).

- If you’re interested in getting started with development, the [Why use Linux for Development?](/docs/quick-answers/linux-essentials/why-use-linux-for-development/) guide will give you a useful primer for making a choice about a development system.
