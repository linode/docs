---
slug: how-to-change-the-root-password-in-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to unlock the root account, and set the root password, in Ubuntu, and then lock the account again to close that potential security hole.'
og_description: 'How to unlock the root account in Ubuntu and lock it again.'
keywords: ['root','password','account','change','unlock','unlock root account',change root password']
tags: ["Ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-03
modified_by:
  name: Linode
title: "How to Change the Root Password in Ubuntu"
h1_title: "How to Change the Root Password in Ubuntu."
enable_h1: true
contributor:
external_resources:
- '[RootSudo](https://help.ubuntu.com/community/RootSudo)'
---
Ubuntu's root password can be changed if needed. Ubuntu, like other Linux distributions and most Unix-like operating systems, allows multiple user accounts and allows those accounts to have specific permissions. There is, however, always a superuser account (referred to as "root") that is locked by default. By setting a password, the account becomes unlocked.

{{< caution >}}
In the vast majority of cases, a server admin will never need to access the root user directly, as `su` and `sudo` will suffice when necessary. You should only proceed with this when absolutely necessary and when you understand the ramifcations.
{{< /caution>}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Change Ubuntu's root Password

### Change the root password as root with the `passwd` command

1.  Open the terminal.

2.  Switch to the root user:

        sudo -i

3.  You will be prompted for your user's password.

4.  When the prompt shows `root@linode` (for example), then enter:

        passwd

5.  You will be prompted to enter the new password twice. The output will look like this:
    {{< output >}}
root@linode:~# passwd
New password:
Retype new password:
passwd: password updated successfully
root@linode:~#
{{< /output >}}

### Change the root password using `sudo`

1.  Open the terminal.

2.  Use `sudo` to change the password:

        sudo passwd root

3.  You will be prompted to enter your password and then the new root password twice. The output will look like this:
    {{< output >}}
mumbly@linode:~$ sudo passwd root
[sudo] password for mumbly:
New password:
Retype new password:
passwd: password updated successfully
mumbly@linode:~$
{{< /output >}}

## Locking the root User When Finished

Leaving the root account locked will serve most people best the majority of the time. If you need to access root for a good reason, do so. However, we recommend locking it again when you're done. To do so:

1.  Open the terminal.

2.  Use `sudo` to lock the account once more:

        sudo passwd -l root

3.  You will be prompted for your password. Enter it and the output will look like this:
    {{< output >}}
mumbly@linode:~$ sudo passwd -l root
[sudo] password for mumbly:
passwd: password expiry information changed.
mumbly@linode:~$
{{< /output >}}