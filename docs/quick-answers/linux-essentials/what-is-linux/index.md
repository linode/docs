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
Linux is an operating system that works similarly to other well-known OSes, like Windows and macOS.  As an operating system, Linux manages your computer or server’s hardware and provides services your other software needs to run.  A significant difference between Linux and other OSes is that it’s open source and free of cost.  Open source means anyone has access to the Linux source-code and can contribute to enhancing it, fixing bugs and security vulnerabilities.  Independent programmers, all around the world, invest their time and expertise to improve Linux.  This model of software development rivals proprietary OSes that keep their code closed and solely work with programmers employed by them.

Colloquially Linux refers to the Linux Kernel plus all the tools, utilities and libraries running on top of the kernel, many of which are managed under the umbrella of the GNU project. There are Linux community members that find it more correct and precise to use the term [GNU/Linux](https://www.gnu.org/gnu/linux-and-gnu.en.html) over Linux alone as a name for the OS.

Linux is unique in its development model, history and strength of community, but at its core it is a mature and secure operating system that anyone can easily begin using for today’s most common tasks, like accessing the internet, editing text documents and creating media.  This Quick-Answer guide will cover some key defining features of Linux.

## What is the Linux Kernel?

In computer architecture, the kernel is the core interface between a machine’s hardware and software that manages things like memory, CPU, and disk drives on the hardware side and system calls and processes on the software side.  The kernel is used continuously by all aspects of the operating system, but is only one component of the whole system.  Most desktop users are familiar with tools within the user space of an operating system, like the web browsers, GUI file systems and the bash shell.  These tools interact with the kernel via the kernel API, while the kernel runs in the background.

The Linux Kernel was developed by Linus Torvalds in 1991. Some of the key design principles he  implemented --and that have evolved with time and become defining components-- include treating everything on the system “like a file”, being multi-user, multi-tasking, modular, secure, portable and configurable.  Because of these design decisions, the Linux kernel is extremely flexible, which has led to the spawning of different varieties of the Linux Operating System that are supported on a large array of computer architectures, including servers and smartphones .

If you’re curious about current development around the Linux Kernel, you can access a read-only version of the latest Linux kernel repository on [github](https://github.com/torvalds/linux) to browse the code.  You can also read about how to do [Linux Kernel development](https://www.kernel.org/doc/html/v4.13/process/howto.html) for a better understanding of what it takes to contribute to the project.

## Unix

The Linux kernel borrows much of its design from UNIX, a predecessor operating system developed in 1969 by computer scientists at AT&T’s Bell Laboratories, Ken Thompson and Dennis Ritchie.  When UNIX first emerged, it was freely licensed due to antitrust limitations on AT&T. This allowed for peer-reviewed development and wide adoption by academic institutions and businesses.  Once Bell Labs was no longer obligated to maintain UNIX’s free license, it became a proprietary product. This incentivized programmers like Richard Stallman to work on creating a “[free as in freedom](https://www.gnu.org/philosophy/free-sw.en.html)” version of a UNIX-like operating system committed to a set of ethical standards around software development.  Stallman’s free software operating system is [GNU](https://www.gnu.org/). The [free software movement](https://www.gnu.org/philosophy/free-software-intro.en.html), spearheaded by Stallman, is a significant piece of computing history that is still relevant today.

## Linux Distributions

Using Linux means selecting a distribution to suit your needs and there are many to choose from.  Some well-known ones are Ubuntu, Debian, CentOS, Gentoo, and Puppy Linux.  Each Linux distribution varies in its general use case and audience.  [Ubuntu’s desktop](https://www.ubuntu.com/desktop) version is feature rich with a user-friendly GUI --a great place to begin if you’re just getting started with Linux.  [Debian](https://www.debian.org/) requires more configuration during installation of the OS and system software and strictly committed to only using free software. With [Gentoo](https://www.gentoo.org/get-started/) you compile everything from source, so you can choose exactly what you install when adding any new software to your system --an important level of control for the experienced developer.

## Learn More

There are many avenues to explore when first using Linux.  Our Guides & Tutorials provide a great starting point for learning more about Linux:

- [Introduction to Linux Concepts](/docs/tools-reference/introduction-to-linux-concepts/) will give you a more detailed and technical orientation on Linux and ways to start using it with a Linode.

- Once you’re familiar with Linux and the Command Line, you can learn basic [Linux System Administration](https://linode.com/docs/tools-reference/linux-system-administration-basics/).

- If you’re interested in getting started with development, the [Why use Linux for Development](https://www.linode.com/docs/quick-answers/linux-essentials/why-use-linux-for-development/)? Will give you a useful primer for making a choice on a development system.