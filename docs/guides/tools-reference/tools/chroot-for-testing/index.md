---
slug: use-chroot-for-testing-on-ubuntu
author:
  name: Nathaniel Stickman
description: "This guide shows you how to create your own chroot environment to securely test settings and apps by creating an environment isolated from your file system."
og_description: "This guide shows you how to create your own chroot environment to securely test settings and apps by creating an environment isolated from your file system."
keywords: ['chroot','chroot linux','chroot jail']
tags: ['linux', 'ubuntu', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-20
modified_by:
  name: Nathaniel Stickman
title: "Use chroot for Testing on Ubuntu"
h1_title: "How to Use chroot for Testing on Ubuntu"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Ubuntu Man Pages: schroot](https://manpages.ubuntu.com/manpages/focal/man1/schroot.1.html)'
- '[Debian Wiki: schroot](https://wiki.debian.org/Schroot)'
---

The Linux `chroot` command enables you to run applications or shells within a separate, secure environment. Because a `chroot` environment is walled off from the rest of your system, it can be an ideal space for testing. This guide discusses the primary use cases for chroot and shows you how to create your own chroot environment.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Replace all instances of `example-user` in this guide with the username of the limited Linux user you are using to execute the commands in this guide.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is chroot?

The `chroot` command allows you to create a separate environment for running processes in isolation. The command creates a distinct file system with its own root directory that is completely walled off from access to the rest of your system. For this reason, the `chroot` environment is often referred to as *chroot jail*.

### What is chroot Jail?

As described above, the `chroot` command creates an isolated environment, known as chroot jail. Processes running in this environment have a distinct root directory and file system. These processes are prevented from accessing anything on the system outside of the chroot jail.

To create a chroot jail, you create a directory to act as the root for your `chroot` environment. Then, you add the programs and system components you need to run any processes you intend to test in the `chroot` environment.

When you run `chroot` command against the directory you created, you can then use it as its own functioning system. The directory you created acts as the root directory, so anything operating inside of it is restricted to the `chroot` directory.

The `chroot` environment gives you a clean and separate space for running processes. It ensures that anything running in chroot jail is not affected by the primary file system. Similarly, the chroot jail cannot affect the primary file system.

### What is the Purpose of a chroot Jail?

The primary reason for creating a `chroot` environment is to test processes in isolation. There are two main scenarios in which you may want to test in isolation:

- The first scenario is to test an untrusted application. Running it in chroot jail allows you to run the application without allowing it to access the rest of your file system.
- Another reason is to test an application, command, or series of commands in a secluded environment. With a `chroot` environment, you guarantee that the processes or commands run in a clean and easily reproducible file system.

## When to Use chroot

Use `chroot` when you have an application or a shell process that you may not trust. Keeping any processes you are unsure of in chroot jail allows you to test them out prior to running them on your system.

You may be thinking `chroot` sounds like a virtual machine, and you would be right. However, `chroot` has the advantage of being much lighter and easier to set up than a virtual machine. You can quickly install a minimal OS in a `chroot` environment to test small processes, commands, or compile packages.

## How to Use chroot

The following sections show you how to set up and start using `chroot` environments on your Ubuntu system.

### Create a Test Environment

To create a `chroot` environment for testing, this guide has you install a minimal Debian or Ubuntu distribution in the `chroot` directory. Doing so gives you a full operating system in your `chroot` environment, where you can install programs and run processes in an isolated space.

1. Create a directory for your `chroot` environment. In this guide, a `chroot-jail` directory is created in the user's home directory.

        mkdir ~/chroot-jail

1. At this point, you need to install the system files to be used in the `chroot` environment. You can do so easily with the `debootstrap` tool, which you can install using your system's package manager:

        sudo apt install debootstrap

1. Use `debootstrap` to install the desired Debian or Ubuntu distribution to your `chroot` directory. This guide uses Ubuntu 20.04 (Focal).

        sudo debootstrap focal ~/chroot-jail

    Alternatively, you can install a different Ubuntu release, or a Debian release. The example below installs Debian 10 Buster:

        sudo debootstrap buster ~/chroot-jail

1. Run Bash through `chroot` to verify the environment setup.

        sudo chroot ~/chroot-jail /bin/bash

    {{< output >}}
root@localhost:/#
    {{< /output >}}

    You can even use the `ls` command to confirm that things in the `chroot` environment only have access to the `chroot` directory.

1. Exit the `chroot` environment's Bash shell.

        exit

### Configure the Test Environment

This section shows some basics for setting up a `chroot` environment for testing. You are likely to need additional steps to set up the environment for your specific testing scenarios. However, these basics are meant to cover commonly needed configurations regardless of the testing scenario.

1. Run Bash in the `chroot` environment, as shown in the section above, and create a limited user using the command below. The `example-user` username used in this example needs to match the limited user you are using to access the `chroot` environment.

        adduser example-user

    If you require your user to have `sudo` access for `chroot` testing, use the following command to give that access to the user.

        adduser example-user sudo

1. Depending on the Debian or Ubuntu distribution you installed, you may have to install `sudo` from the package manager.

        apt install sudo

    This may also be a good time to install any other programs you need for your testing purposes.

1. Exit the `chroot` environment's shell.

        exit

1. Mount the drives shown below to their respective `chroot` directories. This allows you to use `sudo` as your limited user in the `chroot` environment:

        sudo mount --bind /proc ~/chroot-jail/proc/
        sudo mount --bind /sys ~/chroot-jail/sys/
        sudo mount --bind /dev ~/chroot-jail/dev/

### Install and Configure schroot

The `schroot` tool allows you to use a `chroot` environment as a limited user, rather than as `root`. If you are familiar with `dchroot`, `schroot` replaces it as the standard tool for working with `chroot` environments.

1. Install `schroot`.

        sudo apt install schroot

1. Open the `schroot` configuration file — `/etc/schroot/schroot.conf` — and add a configuration for your `chroot` environment.

    The file comes with several configuration examples. The file below is a simple example used for this guide.

    {{< file "/etc/schroot/schroot.conf" >}}
[...]

[focal-env]
description=Ubuntu Focal
directory=/home/example-user/chroot-jail
users=example-user
groups=sbuild
root-groups=root
aliases=focal

[...]
    {{< /file >}}

1. Access the `chroot` environment through `schroot`.

        schroot -c focal

You are now logged into the `chroot` environment as your limited user. There, you can run programs and commands and install packages just as you would on a usual operating system.

## Exit and Remove a chroot Environment

To exit the `chroot` environment, simply use the `exit` command. This takes you out of the `chroot` shell and back to the main Linux system's shell.

Once you are done with your tests, you may be ready to remove the environment altogether. You can achieve this with the following steps.

1. Unmount each of the drives you mounted previously.

        sudo umount ~/chroot-jail/dev
        sudo umount ~/chroot-jail/sys
        sudo umount ~/chroot-jail/proc

1. Delete the `chroot` directory along with its contents.

        sudo rm -R ~/chroot-jail
