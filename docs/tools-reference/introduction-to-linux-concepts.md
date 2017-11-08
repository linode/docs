---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to Linux and Unix-like systems covering history, system architecture, and distribution characteristics.'
keywords: ["Linux", "Unix-Like systems", "history"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-linux/linux-concepts/']
modified: 2013-12-19
modified_by:
  name: Linode
published: 2009-08-31
title: Introduction to Linux Concepts
external_resources:
 - '[Getting Started](/docs/getting-started/)'
 - '[Using the Terminal](/docs/using-linux/using-the-terminal)'
 - '[LAMP Guides](/docs/lamp-guides/)'
 - '[Package Management](/docs/using-linux/package-management)'
---

Linodes run **Linux**. Linux is an operating system that works just like Windows and Mac OS X. As an operating system, Linux manages your Linode's hardware and provides services your other software needs to run.

Linux is a very hands-on operating system. If running Windows is like driving an automatic, then running Linux is like driving a stick. It can take some work, but once you know your way around Linux, you'll be using the command line and installing packages like a pro. This article aims to ease you into the world of Linux.

This guide is intended to be very beginner-friendly. It takes a Linux 101 approach to explanations for basic concepts. There are a few how-to sections as well, which are intended to get you on your feet with your Linode. At times we'll link off to a different guide that has more details on a particular topic.

![Title graphic](/docs/assets/introduction_to_linux_concepts_smg.png)

 {{< note >}}
Everything on a Linux system is case-sensitive. That means that `photo.jpg`, `photo.JPG`, and `Photo.jpg` are all different files. Usernames and passwords are also case-sensitive.
{{< /note >}}

## History

This section provides a brief overview of the history of Linux.

Linux, like Mac OS X, is based on the Unix operating system. A research team at AT&T's Bell Labs developed Unix in the late 1960s and early 1970s with a focus on creating an operating system that would be accessible and secure for multiple users.

Corporations started licensing Unix in the 1980s and 1990s. By the late 1980s, there was interest in building a free operating system that would be similar to Unix, but that could be tinkered with and redistributed. In 1991, Linus Torvalds released the Linux kernel as free, *open-source* software. Open source means that the code is fully visible, and can be modified and redistributed.

Strictly speaking, Linux is the *kernel*, not the entire operating system. The kernel provides an interface between your Linode's hardware and the input/output requests from applications. The rest of the operating system usually includes many GNU libraries, utilities, and other software, from the Free Software Foundation. The operating system as a whole is known as GNU/Linux.

## Getting Started

Let's begin at the beginning. If some of this is a repeat for you, feel free to skip ahead!

### A Little Bit About Servers

Your Linode is a type of *server*. A server is a type of computer that provides services over a *network*, or connected group of computers. Servers are typically:

-   Always (or almost always) on
-   Connected to the Internet or a network of computers
-   Contain programs and files for hosting websites and/or other Internet content

Since a server is a type of computer, there are a lot of similarities between a Linode and your home computer. Some important similarities include:

-   **The physical machine**: Your Linode is hosted on a physical machine. It's sitting in one of our data centers.
-   **The operating system**: As we mentioned in the introduction, Linodes use the Linux operating system. It's just another type of operating system like Windows or Mac OS X.
-   **Applications**: Just like you can install applications on your home computer or smartphone, you can install applications on your Linode. These applications help your Linode do things like host a website. For example, you could install WordPress, a popular website hosting application, to host a website on your Linode. Applications are also known as *software* and *programs*.
-   **Files and directories**: In the end, whether it's an application or a photo, everything on your Linode is a file. You can create new files, edit and delete old ones, and navigate through directories just like you would on your home computer. In Linux, folders are called *directories*.
-   **Internet access**: Your Linode is connected to the Internet. That's how you connect to it to get everything set up, and how your users connect to it to view your website or download your app.

### A Little Bit About Linux
Before you install Linux, decide which distribution to install. Linux comes in several different versions known as *distributions*. Different distributions are somewhat similar to operating system versions like Windows 7 or Windows 10, except Linux distributions aren't upgraded versions of each other, but rather different yet similar *flavors* of Linux. Different distributions install different default bundles of software. To learn more about distributions see the [Distributions](#distributions) section at the end of this article or read more on your own.

### Install Linux to Get Started

Here at Linode, you install Linux with the [Linode Manager](https://manager.linode.com/) dashboard. It takes just a few clicks to install Linux with this dashboard. If you don't have a particular Linux distribution in mind, install **Ubuntu 16.04 LTS**. Ubuntu is good for Linux beginners because it is well-supported and doesn't change often.

After you know which distribution you want to install, follow the instructions for installing Linux in the [Getting Started](/docs/getting-started/) article. Follow that article until you complete [Booting Your Linode](/docs/getting-started#boot-your-linode), then come back here.

### Connecting to Your Linode

Your Linode is physically housed in the Atlanta, Dallas, Frankfurt, Fremont, London, Newark, Singapore, or Tokyo data center, so you have to use the Internet and a terminal to connect to it and start using it. A *terminal* is a tool that runs a *shell* that lets you run text commands to interact with your server. The Secure Shell (**SSH**) protocol lets you send these commands to your Linode over a secure Internet connection from your local machine.

 {{< note >}}
In this guide, we'll mostly be using the terms *terminal*, *shell*, and *SSH* to refer to the interface you use to send text commands to your Linux system. These are different tools that layer on top of each other to let you interact with your server. To learn more, read these simplified definitions:

  - **Terminal**: A device that enters data into and displays data from a computer. The terminal has the most direct access to the operating system. Technically, most terminals these days are actually *terminal emulators* that run as software on Mac OS X, Linux, or Windows computers.
  - **Shell**: A program that provides a user interface for interacting with an operating system. There are different types of shells, but the one we're using here is called **Bash** and provides a command-line interface that accepts and outputs text.
  - **SSH**: A protocol that lets you send shell commands to your Linode securely over the Internet.
{{< /note >}}

To connect to your Linode, follow the next section of the **Getting Started** article, [Connecting to Your Linode](/docs/getting-started#connect-to-your-linode-via-ssh). Follow along with the written instructions or watch the videos, or both. It will help you install a terminal emulator and use it to establish an SSH connection to your Linode.

## So You're Staring at a Shell Prompt

After you connect to your Linode, you should be looking at a shell prompt that looks like this with a blinking cursor:

    root@localhost:~#

What does this bit of text mean? The entire thing is the *shell prompt*. It's your terminal's way of telling you that it's ready for you to enter the next command. The different parts of the shell prompt provide information:

-   **root**: This is your username. To learn more about users, jump down to the [Users and Permissions](/docs/tools-reference/introduction-to-linux-concepts#users-and-permissions-in-linux) section.
-   **localhost**: This is your Linode's hostname. A *hostname* is your Linode's name for itself.
-   **\~**: After the colon, the SSH session shows the name of the directory you're in. When you first log in, you're in your user's *home* directory. The tilde (**\~**) is a shortcut for the home directory. If the directory was spelled out, it would be `/root`. For users other than the root user, home directories are in `/home/user1`, where **user1** is the name of the user.
-   **\#** - The **hash** or **pound** (**\#**) punctuation mark indicates where the shell prompt ends. When you type a command, your text begins after this point. For users other than the root user, the **dollar sign** (**\$**) indicates the same thing.

You can type any valid Linux shell command at the blinking cursor after the shell prompt. We'll go over a few practical commands in the rest of this article, but to get a really good in-depth introduction to the command-line interface, you should read the [Using the Terminal](/docs/using-linux/using-the-terminal) article as well.

 {{< note >}}
These command line tips will make your Linux forays much more effective:

- Press the `Return` or `Enter` key after you finish a command.
- In most cases, you will not receive an "Are you sure?" message after executing a potentially destructive command. Make sure you really want to run a command before you execute it.
- You might not get any message after a successful command. You will get an error if the command didn't work.
- If you don't know which directory you're in, you can always type `pwd`, short for *print working directory*.
- Press the `Up Arrow` on your keyboard to see or reuse the previous command that was executed.
{{< /note >}}

## Finding Your Way Around Files and Folders

In this section, we'll look at the structure of a Linux server. Everything on your Linode is a file or a directory. Remember, *directory* is the Linux term for a folder. Linux uses a tree of nested directories to keep its files organized. The highest-level directory is called the *root* directory. It's designated with a single slash. Unlike Windows, there are no different disks or drives; the root directory is the highest-level directory for all Linux systems. Underneath the root directory are more, sub-directories.

Most Linux systems have directories called `lib` and `var` (along with several others) underneath the root directory. The `lib` directory contains system libraries, while the `var` directory contains all of the files on your system that are likely to change, such as your logs and your mail messages. Directories can go inside other directories, as illustrated below:

[![The Linux directory structure.](/docs/assets/1489-linux_directory_structure_2.png)](/docs/assets/1489-linux_directory_structure_2.png)

### Print a Working Directory
Find out where you are in the directory structure. Make sure your terminal application is selected and that you're logged in to your Linode. You should see a blinking cursor where you can start typing.

1. For your first command, use the `pwd` command. Short for *print working directory*, it lets you view the full path to your current directory. Type `pwd` after the shell prompt:

        root@localhost:~# pwd

2. Press `Return` to execute the command. You should see the following output:

        /root

The output of `pwd` shows you the full path to your current directory or directory. At the moment, you're inside the `/root` directory. You will always be inside a particular directory when you execute shell commands, although which directory you're in can change. The `pwd` command is very useful because it shows you exactly where you are in your Linode's directory structure.

### Change Directories
Let's move into the root directory, `/`, with the `cd` command. The `cd` command is short for *change directory*. After `cd` type a space and then the file path. The file path can be long or short, depending on how deep you're going into the directory structure.

Change to the root directory:

At the shell prompt, type the following command, and press `Return` to execute it.

    cd /

Now you're in the root directory.

### List the Current Directory

The *list* command, `ls`, shows everything that's directly inside of your current directory. To make the output the most helpful, you can add a few *flags* to the `ls` command. The flags are part of the command. In this case, we'll add the `-ahl` flags to show `-a` all the files, in `-h` human-readable format, and with a `-l` long list format. There are more flags that you can add to the `ls` command, but you can learn more about them on the web.

List the current directory:

Type the following command, and press `Return` to execute it:

    ls -ahl

The output should look something like this:

    total 84K
    drwxr-xr-x  22 root root 4.0K Apr 30  2012 .
    drwxr-xr-x  22 root root 4.0K Apr 30  2012 ..
    drwxr-xr-x   2 root root 4.0K Nov  6 16:04 bin
    drwxr-xr-x   3 root root 4.0K Feb  4  2013 boot
    drwxr-xr-x  11 root root  14K Nov  6 16:17 dev
    drwxr-xr-x  94 root root 4.0K Dec 10 20:27 etc
    drwxr-xr-x   4 root root 4.0K Feb 19  2013 home
    drwxr-xr-x  16 root root 4.0K Nov  6 16:04 lib
    drwx------   2 root root  16K Apr 26  2012 lost+found
    drwxr-xr-x   3 root root 4.0K Apr 26  2012 media
    drwxr-xr-x   2 root root 4.0K Apr 19  2012 mnt
    drwxr-xr-x   3 root root 4.0K Nov 18 13:34 opt
    dr-xr-xr-x 141 root root    0 Nov  6 16:16 proc
    drwx------   3 root root 4.0K Apr  7  2013 root
    drwxr-xr-x  15 root root  560 Dec 10 15:57 run
    drwxr-xr-x   2 root root 4.0K Nov  6 16:04 sbin
    drwxr-xr-x   2 root root 4.0K Mar  5  2012 selinux
    drwxr-xr-x   2 root root 4.0K Apr 26  2012 srv
    dr-xr-xr-x  13 root root    0 Nov  6 16:16 sys
    drwxrwxrwt   2 root root 4.0K Dec 10 21:09 tmp
    drwxr-xr-x  10 root root 4.0K Apr 26  2012 usr
    drwxr-xr-x  13 root root 4.0K Nov  6 16:04 var

There are quite a few files inside this directory. The most important part is the list of directory and file names on the right, listed alphabetically. You'll notice the directories `lib` and `var`, as well as several others.

 {{< note >}}
The **/root** directory is not the same as the **/** directory. **/** is the top-level directory of the server. Everything else is inside it. It is called the *root* directory when you're talking about it, but its name on the server is just **/**. On the other hand, the **/root** directory is the home directory for the **root** user. It's a sub-directory under the **/** directory, and it's where the **root** user starts after logging in to a new SSH session.
{{< /note >}}

### Explore Linux Directories
If you open the `var` directory, you'll find more directories, such as `log` for your logs, and `mail` for your system mail.

1. Move into the `var` directory by executing the `cd` command:

        cd var

2. View the contents of the `var` directory with the `ls` command, just like we did earlier:

        ls -ahl

You'll see another list of directories:

    total 52K
    drwxr-xr-x 13 root root     4.0K Nov  6 16:04 .
    drwxr-xr-x 22 root root     4.0K Apr 30  2012 ..
    drwxr-xr-x  2 root root     4.0K Nov 19 06:27 backups
    drwxr-xr-x  9 root root     4.0K Apr  6  2013 cache
    drwxrwsrwt  2 root whoopsie 4.0K Apr 26  2012 crash
    drwxr-xr-x 37 root root     4.0K May 29  2013 lib
    drwxrwsr-x  2 root staff    4.0K Apr 19  2012 local
    lrwxrwxrwx  1 root root        9 Apr 30  2012 lock -> /run/lock
    drwxr-xr-x 14 root root     4.0K Dec 12 06:53 log
    drwxrwsr-x  2 root mail     4.0K Aug  8 03:50 mail
    drwxr-xr-x  2 root root     4.0K Apr 26  2012 opt
    lrwxrwxrwx  1 root root        4 Nov  6 16:04 run -> /run
    drwxr-xr-x  6 root root     4.0K May 29  2013 spool
    drwxrwxrwt  2 root root     4.0K Feb  4  2013 tmp
    drwxr-xr-x  2 root root     4.0K Apr  6  2013 www

Here you can see the `log` and `mail` directories, as well as several others. At the top of the list, you see two directories named `.` and `..` with periods. Similar to the tilde (**\~**) we saw earlier, these directories are actually shortcuts or aliases, that appear in every directory. The single-period directory indicates the current directory. The double-period directory indicates the directory above the current one. If you are inside a lower-level directory and want to move to the directory above it, type `cd ..`.

1. To move back up to `/` from `var`, type the following command:

        cd ..

2. You should be in the `/` directory again. You can use `pwd` to verify this.

        pwd

3. Let's take a look at the `lib` directory. Move into `lib` with the `cd` command:

        cd lib

4. List its contents with the `ls` command:

        ls -ahl

  Inside, you'll see more directories and long list of library files that all start with `lib`. The output is very long, so we're just showing part of it here. The `...` indicates that the output continues.

    total 1.2M
    drwxr-xr-x 16 root root 4.0K Nov  6 16:04 .
    drwxr-xr-x 22 root root 4.0K Apr 30  2012 ..
    lrwxrwxrwx  1 root root   21 Apr  6  2013 cpp -> /etc/alternatives/cpp
    drwxr-xr-x  2 root root 4.0K Apr 26  2012 firmware
    drwxr-xr-x  2 root root 4.0K Feb  4  2013 hdparm
    drwxr-xr-x  3 root root 8.0K Oct 23 00:28 i386-linux-gnu
    drwxr-xr-x  2 root root 4.0K Mar 18  2013 init
    -rwxr-xr-x  1 root root  74K Mar 30  2012 klibc-LZ1cv1NoEVO2ugnvqTw3e4qPc8Y.so
    lrwxrwxrwx  1 root root   25 Sep 30 14:38 ld-linux.so.2 -> i386-linux-gnu/ld-2.15.so
    -rw-r--r--  1 root root 143K Mar 20  2013 libdevmapper.so.1.02.1
    lrwxrwxrwx  1 root root   16 Apr 30  2012 libfuse.so.2 -> libfuse.so.2.8.6
    -rw-r--r--  1 root root 179K Mar  2  2012 libfuse.so.2.8.6
    ...

### Learn More About Navigating Directories

Now you know how to use the `pwd` command to show you where you are, the `cd` command to move to a new directory, and the `ls` command to show you the contents of a directory. These are the basic tools you need to navigate through your Linode's files and directories. To learn more about navigating directories, read the linked section of the [Using the Terminal](/docs/tools-reference/ssh/using-the-terminal/) guide.

### Upload Files to Your Linode

One of the easiest ways to upload your own files to your Linode is with a Secure FTP (**SFTP**) program. See [Migrate from Shared Hosting to Linode](/docs/migrate-from-shared) for a walkthrough on how to upload your own files using SFTP.

## Users and Permissions in Linux

Linux uses a powerful system of users and permissions to make sure that the right people get access to the right files. For example,

-   As the owner of your Linode, you want to be able to view, edit, and run every file on the system.
-   You want the general public to be able to view, but not change, your website files, and you don't want them to see the structural files on your server.
-   A different user, such as someone with a mailbox on your Linode, should be able to access their own files but not anyone else's.

You can set users and permissions for each file directory on your Linode.

Three categories comprise the file access system in Linux:

-   **Users**: Unique logins for your Linode. A user account is typically assigned to either a person or an application that needs to access files on your system. You can have any number of users on your Linode. To learn how to add a user, see the [Adding a New User](/docs/security/securing-your-server/#add-a-limited-user-account) section of the **Securing Your Server** guide.
-   **Groups**: A collection of one or more users. Groups are a useful way to grant similar access privileges to multiple users, without having to set them individually for each user. When a user account is created, it is assigned a default group with the same name as the user name. Each user can belong to any number of groups. Users that are a part of a group inherit the permissions granted to the group.
-   **Everyone**: is the category for everyone else. If someone accesses files on your Linode without being logged in as a specific user, they fall into the *everyone* category. *Everyone* is sometimes known as *world*, because it includes everyone in the whole world.

The next important concept is *permissions*. Every file and directory on your Linux system has three possible access levels:

-  **Read**: Files with *read* permissions can be viewed.
-  **Write**: Files with *write* permissions can be edited.
-  **Execute**: Files with *execute* permissions can be run, like an application. When you start a program or script, you execute it.

### View Permissions in Linux
View the users and permissions for a particular file or directory.

1. Run the `ls -l` command replacing **my\_directory** with the name of your own file or directory:

    ls -l my_directory

2. That command produces output like the following:

    drwxr-xr-x  13 user1 group1 4.0K Nov  6 16:04 my_directory

The user and group are listed in the middle. In this case, the user is **user1** and the group is **group1**. The user is listed first and the group second. The permissions are listed at the beginning of the line. Ignoring the first character, you can see that the permissions for the `my_directory` directory are **rwxr-xr-x**.

-   **r**: read
-   **w**: write
-   **x**: execute
-   **-**: no permission

The user permissions are listed first and the group permissions are listed second. The *everyone* permissions are listed last.

-   **user1** has read, write, and execute permissions, **rwx**.
-   **group1** and the user accounts inside the group has read and execute permissions, but not write permissions, **r-x**. Members of the **group1** group can view the contents of the `my_directory` directory, run files in it, but not change them.
-   Everyone can read and execute the files in the `var` directory, but not change them, because the permissions for everyone are **r-x**.

To learn about users and groups in more detail, read the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) article.

## Software

This section shows you how to install, run, update, and uninstall software from a Linux system.

### Installing Software

Like most things in Linux, installing software is accomplished by typing and executing a specific text command. The most popular Linux distributions come with *package managers* that make it relatively easy to install and uninstall software on your Linode. Debian and Ubuntu use the Advanced Packaging Tool (**APT**) package manager, and Fedora and CentOS use the Yellowdog Updater, Modified (**yum**) package manager.

Our **Quick Start Guides** series contain basic instructions for installing and configuring many common types of Linux software. The [Hosting a Website](/docs/hosting-website) guide shows you how to install software to run a website, while [Running a Mail Server](/docs/mailserver) is for email servers.

#### Install with APT
Because we've been working with the Ubuntu 16.04 distribution so far, let's look at an example with APT. The general form of the installation command for Ubuntu and Debian systems is:

    apt-get install software

Replace the word **software** in the command above with the package name for the software you want to install. There are thousands of different programs available to install on your server. If you search online for the software you need, you can find the correct package names to use with the APT installer. For example, if you searched for "ubuntu web server," you would find information about the Apache web server, and its package name, **apache2**.

Run this command to install the web server Apache, which lets you display websites:

    apt-get install apache2

**apache2** is the name of the package for Apache in the Ubuntu repositories. A package is a piece of software. *Repositories* are collections of software for your Linux distribution. The `apt-get` command looks up an Ubuntu repository (specified on your system), finds the apache2 package, and installs it along with anything else you need for Apache.

#### Install with yum

Using yum on Fedora and CentOS systems is just as easy:

    yum install software

### Running Software

There are three main ways to run programs in Linux.

**Always on:**

You want some programs, like your web server, to run constantly. These are the programs that run as services on your Linode. For example, your web server keeps your website visible, so you want it to stay on all the time. Server processes that stay running in the background are known as *daemons*. To start a daemon, run the following command, replacing **software** with the name of the software you want to run. The name will be the same one you used to install it (for example, **apache2** for Apache):

    systemctl start software

**Once:**

Sometimes you want to run a program on an as-needed basis. For example, you might want to run a script to rename a group of files.

1. Use the `cd` command to move into the directory where the script is located.
2. Run `ls -l directory` to check that your user account has [execute permissions](/docs/tools-reference/introduction-to-linux-concepts#users-and-permissions-in-linux) for the script file in the directory. If you need to modify the permissions, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups#what-are-user-and-group-permissions) guide.
3. Run the script with the following syntax:

    ./my_script

**Scheduled:**

Sometimes you want to run a program at regular intervals, as in the case of a daily backup script. The best way to do this is with the *cron* tool. Read the [Schedule Tasks with Cron](/docs/linux-tools/utilities/cron) article to learn more. Scripts that you run this way also have to be [executable](/docs/tools-reference/introduction-to-linux-concepts#users-and-permissions-in-linux).

### Updating Software

As long as you installed your software with a package manager, use APT or yum to update your entire system with one simple step.

Update a Debian or Ubuntu system:

    apt-get update
    apt-get upgrade --show-upgraded

Update a Fedora or CentOS system:

    yum update

{{< caution >}}
Updating your software is good for your system security. In most cases updates will go smoothly, but it's possible that some updates may break something on your server. It's always wise to make a [backup](/docs/platform/backup-service) of your system before updating it.
{{< /caution >}}

### Uninstalling Software

If you need to uninstall software, use the `apt-get remove` command:

    apt-get remove software

If you also want to remove all configuration files associated with the software, run this command instead:

    apt-get purge software

Here's the yum version for Fedora and CentOS:

    yum remove software

## Security

When you run a Linux system, you are in charge of its security. The Internet is full of people who want to use your Linode's computing power for their own goals. If you neglect to change default passwords, install out-of-date software, or leave other security holes available for hackers to exploit, it won't take long for your system to get hacked. Follow the steps in the [Securing Your Server](/docs/securing-your-server) guide to harden your server's security.

## Distributions

The main differences between Linux distributions tend to be from goals and aims of the distribution developers and which bundles of software are installed by default, rather than differences in the code of the Linux kernel.

RedHat Linux (which includes Fedora and CentOS) and Debian Linux (which includes Ubuntu) share a large amount of code with each other. The kernels are largely the same, and most of the user utilities and applications from the GNU project are the same.

Some distributions are designed to be as simple and minimalistic as possible, while others are designed to contain the most current, bleeding-edge software. Still others aim to provide the greatest amount of stability and reliability. In addition to the personality of each distribution, which you'll have to discover for yourself, there are a number of factors that you might find useful when choosing a distribution.

-   **Release Cycle**: Different distributions release their operating system updates on different schedules. Distributions like Gentoo and Arch Linux use a *rolling release* model where individual packages are released whenever they're deemed ready by their developers. Conversely, distributions like Debian, Slackware, and CentOS strive to provide the most stable operating system attainable, and release new versions much less frequently. Fedora and Ubuntu release new versions of their operating systems every six months. Choosing the release cycle that's right for you depends on many factors, including the software you need to run, your comfort level, and the amount of stability and reliability you need.
-   **Organizational Structure**: While it might not affect the performance of the distribution, one of the distinguishing factors between distributions is the organizational structure of the development team. Some distributions, like Debian, Gentoo, Arch, and Slackware are developed by independent communities of developers, while other distributions like OpenSUSE, Fedora, and Ubuntu are developed by communities sponsored by various corporations (e.g. Novell, RedHat, and Canonical for the examples above). Other distributions, such as CentOS, are derived by a community from commercially-produced distributions.
-   **Common Tool Sets**: Different distributions make use of different tools for common tasks like [package management](/docs/tools-reference/linux-package-management/) or system configuration. As we discussed above, Debian and Ubuntu use APT to manage `.deb` packages, CentOS and Fedora use yum to manage `.rpm` packages, and OpenSUSE also uses `.rpm` packages but manages them with a tool called **yast**. In many cases your choice of distribution will come down to the one that provides the tools you need and are most comfortable with.

Different distributions of Linux are right for different situations. You should experiment until you find the best fit for you. Given the similarities between different distributions, don't be afraid switch to a new one that will serve you better. If you're familiar with the concepts in this article, you're well on your way to administrating your system like a pro with any distribution of Linux.
