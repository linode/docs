---
slug: rename-files-on-linux
description: "You need to know how to rename, move and work with files and folders on Linux if you work on a cloud server with cloud apps. This is a comprehensive tutorial to get you started? ✓ Click here!"
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-14
modified: 2022-09-23
modified_by:
  name: Linode
title: "Rename Files in Linux"
title_meta: "How to Rename Files on Linux"
authors: ["Martin Heller"]
---

Windows and macOS users often manage their files using the Graphical User Interface (GUI) file manager provided on their systems. Typically Windows File Explorer or macOS Finder, respectively. Linux systems also usually have a GUI file manager, such as Dolphin, Nautilus, or Thunar. However, when managing a remote server, you may not have access to the GUI. It can be incredibly frustrating trying to figure out command line file operations while typing at an SSH, LISH, or other command line prompt. Fortunately, the commands are straightforward once you understand them.

This tutorial primarily discusses how to use the `mv` and `rename` commands to rename one or more files in a terminal session. Creating files and displaying your Linux file system using the `touch` and `ls` commands are also covered.

## Before You Begin

For the purposes of this tutorial, a shared instance with 1 CPU and 1 GB of memory running Ubuntu 22.04 LTS works. Pick a region that is close to your location. Create a strong root password and save it for later. Should you ever forget your root password, you can create a new one on your settings page. Don’t bother creating a SSH key for the account unless you're already familiar with RSA keys.

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

2.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root`. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Navigation

1. When your new Linode is running, click on the **Launch LISH Console** button.

1. Once the **Weblish** side of the display has stopped scrolling, click on the **Glish** side of the display.

1. Log in as **root** with the password you chose in the previous step.

## Renaming Files Using mv

Short for "move", the `mv` command moves files from one directory to another, but it also renames single files.

1.  From the root directory, type:

        ls

    You should have no results, as there are no visible files in the root directory.

1.  However, there are hidden files, to reveal them, type:

        ls -a

    You should now see a handful of hidden files:

    {{< output >}}. .. .bashrc .cache .profile .ssh{{< /output >}}

1.  Create an empty file:

        touch test.txt

1.  View the directory again:

        ls

    Your test file should now be listed:

    {{< output >}}test.txt{{< /output >}}

1.  Rename the file:

        mv test.txt test1.txt

1.  View the directory again:

        ls

    Your test file should now be listed with a different filename:

    {{< output >}}test1.txt{{< /output >}}

## Rename File(s) Using the rename Command

While the `mv` command [can be used inside a shell loop to rename multiple files](https://linuxhint.com/rename-file-ubuntu-terminal/), that requires some advanced text substitution. Instead, you can use a different command, `rename`.

If your Ubuntu Linode is brand new, it probably doesn't have the rename command installed.

1.  First, update your package sources:

        apt update

1.  Now install `rename`:

        apt install rename

1.  Once installed, create a second file with touch:

        touch test2.txt

1.  List both of them:

        ls

    You should now see both files:

    {{< output >}}test1.txt test2.txt{{< /output >}}

    {{< note respectIndent=false >}}
`rename` uses a Perl expression to act on the file names. Run `man rename` for an explanation and several examples.
{{< /note >}}

1.  As an example, let’s rename both text files to backup files:

    **Ubuntu or Debian:**

        rename 's/txt/bak/' *.txt

    **RHEL, Fedora, or CentOS:**

        rename .txt .bak *.txt

1.  Now list them:

        ls

    You should see the same files as before, but with .bak extensions:

    {{< output >}}test1.bak test2.bak{{< /output >}}

When you’re done with this exercise, exit the LISH shell. If you don't need this Linode anymore, delete it from its settings in the **...** dropdown menu to avoid incurring future charges.

## Conclusion

Renaming a single file on a terminal in Ubuntu Linux is accomplished with the `mv` command. Renaming multiple files is accomplished with the `rename` command, which you have to install in a new instance of Ubuntu 22.04 LTS.