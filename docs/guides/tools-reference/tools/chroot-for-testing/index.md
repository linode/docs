---
slug: use-chroot-for-testing-on-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to use chroot to test settings and applications in a secure environment."
og_description: "Learn how to use chroot to test settings and applications in a secure environment."
keywords: ['chroot','chroot linux','chroot jail']
tags: ['linux', 'ubuntu', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-02
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
- '[Debian Wiki: Schroot](https://wiki.debian.org/Schroot)'
---

With `chroot`, you can run applications or shells within a separate, secure environment. Because a `chroot` environment is walled off from the rest of your system, it can be an ideal space for testing. In this guide, learn more about what `chroot` is and how to get started using it.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system:

        sudo apt update && sudo apt upgrade

1. Replace all instances of `example-user` in this guide with the username of the limited Linux user you are using to execute the commands in this guide.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is chroot?

The `chroot` command allows you to create a separate environment for running processes in isolation. The command creates a distinct file system, with its own root directory, completely walled off from access to the rest of your system. For this reason, the `chroot` environment is often referred to as "chroot jail."

### What is chroot Jail?

As described above, the `chroot` command creates an isolated environment, known as chroot jail. Processes running in this environment have a distinct root directory and file system and are prevented from accessing anything on the system outside of chroot jail.

This works by you creating a directory to act as the root for your `chroot` environment. You then fill that directory with the programs and system components you need to run any processes you intend to test in the `chroot` environment.

On running the `chroot` command against that directory, you can use the directory as its own functioning system. And, since the base of the directory you created acts as the root directory, anything operating inside of the `chroot` environment is restricted to the contents of the `chroot` directory.

Essentially, then, the `chroot` environment gives you a clean and separate space for running processes. It ensures that anything running in chroot jail is not affected by and does not affect the file system outside.

### What is the Purpose of a chroot Jail?

The primary reason for creating a `chroot` environment is to test processes in isolation. And there are two main scenarios in which you may want to do that:

- First, you want to test an untrusted application. Running it in chroot jail allows you to see the application's effects without allowing it to access the rest of your file system.
- Second, you want to test an application, command, or series of commands in a secluded environment. With a `chroot` environment, you guarantee that the processes/commands run in a clean and easily reproducible file system.

## When to Use chroot

Use `chroot` when you have an application or a shell process that you are uncertain of. Keeping any processes you are unsure of in chroot jail allows you to test them and see their effects before running them on your system at large.

You may be thinking `chroot` sounds like a virtual machine, and you would be right. However, `chroot` has the advantage of being much lighter and easier to set up than a virtual machine. You can quickly throw up a minimal OS in a `chroot` environment to test small processes, commands, or compile packages.

## How to Use chroot

The following sections show you how to set up and start using `chroot` environments on your Ubuntu system.

### Create a Test Environment

To create a `chroot` environment for testing, this guide has you install a minimal Debian or Ubuntu in the `chroot` directory. Doing so gives you a full operating system in your `chroot` environment, where you can install programs and run processes in an isolated space.

1. Create a directory for your `chroot` environment. In this guide, a `chroot-jail` subdirectory of the current user's home directory is used for this purpose.

        mkdir ~/chroot-jail

1. At this point, you need to install the system files to be used in the `chroot` environment. You can do so easily with the `debootstrap` tool, which you can install using the package manager:

        sudo apt install debootstrap

1. Use `debootstrap` to install the desired Debian or Ubuntu distribution to your `chroot` directory. This guide uses Ubuntu 20.04 (Focal).

        sudo debootstrap focal ~/chroot-jail

    You can, alternatively, install a different Ubuntu release, or a Debian release (Debian 10, Buster, in the example that follows):

        sudo debootstrap buster ~/chroot-jail

1. Run Bash through `chroot` to verify the environment setup.

        sudo chroot ~/chroot-jail /bin/bash

    {{< output >}}
root@localhost:/#
    {{< /output >}}

    You can even go ahead and use the `ls` command to confirm that things in the `chroot` environment only have access to the `chroot` directory.

1. Exit the `chroot` environment's Bash shell.

        exit

### Configure the Test Environment

This section shows some basics for setting up a `chroot` environment for testing. You are likely to need additional steps to set up the environment for your specific testing scenarios. However, these basics are meant to cover commonly needed configurations regardless of the testing scenario.

1. Run Bash in the `chroot` environment, as shown in the section above, and create a limited user using the following command. The `example-user` username used in this example needs to match the limited user you are using to access the `chroot` environment.

        adduser example-user

    If you require your user to have `sudo` access for the `chroot` testing, use the following command to give that access to the user.

        adduser example-user sudo

1. Depending on the Debian or Ubuntu distribution you installed, you may have to install `sudo` from the package manager, if your user needs `sudo` access.

        apt install sudo

    This may also be a good time to install any other programs you need for your testing.

1. Exit the `chroot` environment's shell.

        exit

1. Mount the drives shown below to their respective `chroot` directories. This later allows you to, among other things, actually use `sudo` as your limited user in the `chroot` environment:

        sudo mount --bind /proc ~/chroot-jail/proc/
        sudo mount --bind /sys ~/chroot-jail/sys/
        sudo mount --bind /dev ~/chroot-jail/dev/

### Install and Configure schroot

The `schroot` tool allows you to use a `chroot` environment as a limited user, rather than as `root`. If you are familiar with `dchroot`, `schroot` replaces it as the standard tool for working with `chroot` environments.

1. Install `schroot`.

        sudo apt install schroot

1. Open the `schroot` configuration file — `/etc/schroot/schroot.conf` — and add a configuration for your `chroot` environment.

    The file comes with several configuration examples. What follows is a simple example used for this guide.

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

Once you are done with your tests, you likely are ready to remove the environment altogether, which you can do with the following steps.

1. Unmount each of the drives you mounted previously.

        sudo umount ~/chroot-jail/dev
        sudo umount ~/chroot-jail/sys
        sudo umount ~/chroot-jail/proc

1. Delete the `chroot` directory along with its contents.

        sudo rm -R ~/chroot-jail
