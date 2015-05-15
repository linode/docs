---
author:
  name: Linode
  email: scampbell@linode.com
description: 'An introduction to Linux and Unix-like systems covering history, system architecture, and distribution characteristics.'
keywords: 'Linux,Unix-Like systems,history'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['using-linux/linux-concepts/']
modified: Thursday, December 19th, 2013
modified_by:
  name: Linode
published: 'Monday, August 31st, 2009'
title: Introduction to Linux Concepts
---

Linodes run **Linux**. Linux is an operating system, just like Windows and Mac OS X. As an operating system, Linux manages your Linode's hardware and provides services your other software needs to run.

Linux is a very hands-on operating system. If running Windows is like driving an automatic, then running Linux is like driving a stick. It can take some work, but once you know your way around Linux, you'll be using the command line and installing packages like a pro. This article aims to ease you into the world of Linux.

This guide is intended to be very beginner-friendly. It takes a Linux 101 approach to explanations for basic concepts. There are a few how-to sections as well, which are intended to get you on your feet with your Linode. At times we'll link off to a different guide that has more details on a particular topic.

 {: .note }
>
> Everything on a Linux system is case-sensitive. That means that `photo.jpg`, `photo.JPG`, and `Photo.jpg` are all different files. Usernames and passwords are also case-sensitive.

History
-------

This section provides a brief overview of the history of Linux.

Linux, like Mac OS X, is based on the Unix operating system. A research team at AT&T's Bell Labs developed Unix in the late 1960s and early 1970s with a focus on creating an operating system that would be accessible and secure for multiple users.

Corporations started licensing Unix in the 1980s and 1990s. By the late 1980s, there was interest in building a free operating system that would be similar to Unix, but that could be tinkered with and redistributed. In 1991, Linus Torvalds released the Linux kernel as free, *open-source* software. Open source means that the code is fully visible, and can be modified and redistributed.

Strictly speaking, Linux is the *kernel*, not the entire operating system. The kernel provides an interface between your Linode's hardware and the input/output requests from applications. The rest of the operating system usually includes many GNU libraries, utilities, and other software, from the Free Software Foundation. The operating system as a whole is known as GNU/Linux.

Getting Started
---------------

Let's begin at the beginning. If some of this is a repeat for you, feel free to skip ahead!

### A Little Bit About Servers

Your Linode is a type of *server*. What's a server? A server is a type of computer that provides services over a *network*, or connected group of computers. When people think about servers, they're usually thinking of a computer that is:

-   Always (or almost always) on
-   Connected to the Internet
-   Contains programs and files for websites and/or other Internet content

Since a server is a type of computer, there are a lot of similarities between a Linode and your home computer. Some important similarities include:

-   The physical machine: Your Linode is hosted on a physical machine. It's sitting in one of our data centers.
-   The operating system: As we mentioned in the introduction, Linodes use the Linux operating system. It's just another type of operating system like Windows or Mac OS X.
-   Applications: Just like you can install applications on your home computer or smartphone, you can install applications on your Linode. These applications help your Linode do things like host a website. WordPress is a popular website application, for example. Applications are also known as *software* and *programs*.
-   Files and directories: In the end, whether it's an application or a photo, everything on your Linode is a file. You can create new files, edit and delete old ones, and navigate through directories just like you would on your home computer. In Linux, folders are called *directories*.
-   Internet access: Your Linode is connected to the Internet. That's how you connect to it to get everything set up, and how your users connect to it to view your website or download your app.

Ready to get started? The first step is to install Linux.

### How Do I Install Linux?

Here at Linode, you install Linux using the [Linode Manager](https://manager.linode.com/) dashboard. By clicking a few buttons on our dashboard, you effectively accomplish the same thing as popping a Windows or Mac OS X installation CD into your computer.

Before we get to installing your Linux operating system, there's one more concept to introduce. Linux comes in quite a few different versions, known as *distributions*. It's a bit like Windows XP vs. Windows 8, except that the different Linux distributions aren't just upgraded versions of each other - they're different up-to-date (and out-of-date) *flavors* of Linux. Different distributions install different default bundles of software. The differences between the Linux distributions aren't super important for a beginning user, so we won't get into them here; feel free to jump to the [Distributions](#distributions) section at the end of this article or read more on your own if you're interested. For now, if you don't have a particular distribution in mind, we recommend installing **Ubuntu 14.04 LTS**. This distribution is good for Linux beginners, because it has a lot of support available and doesn't change too often.

Now you're ready to install Linux. We walk you through this process in the [Getting Started](/docs/getting-started/) article. Start at the beginning. When you get to the part where you need to choose your distribution from the dropdown menu, choose **Ubuntu 14.04 LTS**. Work your way through the article until you finish the [Booting Your Linode](/docs/getting-started#sph_booting-your-linode) section.

### Connecting to Your Linode

Now that Linux is installed, it's time to start learning how to use it! The best way to learn the Linux operating system is to dive in and start doing things. Before you can interact with your Linode, you have to connect to it, so that's the next step.

Since your Linode is physically housed in either the Tokyo, London, Newark, Atlanta, Dallas, or Fremont data center, you can't just plug in a keyboard, monitor, and mouse to interact with it. You have to use the Internet and a special tool called a *terminal*. A terminal runs a *shell*, which lets you use text commands to interact with your server, a lot like the old DOS prompts in Windows. The Secure Shell (**SSH**) protocol lets you send these commands to your Linode over a secure Internet connection from your local workstation.

 {: .note }
>
> In this guide, we'll mostly be using the terms *terminal*, *shell*, and *SSH* to refer to the interface you use to send text commands to your Linux system. These are different tools that layer on top of each other to let you interact with your server. To learn more, read these simplified definitions:
>
- Terminal: a device that enters data into and displays data from a computer. The terminal has the most direct access to the operating system. Technically, most terminals these days are actually *terminal emulators* that run as software on Mac OS X, Linux, or Windows computers.
- Shell: a program that provides a user interface for interacting with an operating system. There are different types of shells, but the one we're using here is called **Bash** and provides a command-line interface that accepts and outputs text.
- SSH: a protocol that lets you send shell commands to your Linode securely over the Internet.

It's time to follow the next section of the **Getting Started** article, [Connecting to Your Linode](/docs/getting-started#sph_connecting-to-your-linode). You can follow along with the written instructions or watch the videos, or both. It will help you install a terminal emulator, then use it to establish an SSH connection to your Linode.

So You're Staring at a Shell Prompt
-----------------------------------

Once you connect to your Linode, you should be looking at a shell prompt like this and a blinking cursor:

    root@localhost:~#

What does this bit of text mean? The entire thing is the *shell prompt*. It's your terminal's way of telling you that it's ready for you to enter the next command. The different parts of the shell prompt also have meanings.

-   **root**: This is your username. To learn more about users, jump down to the [Users and Permissions](#users-and-permissions) section.
-   **localhost**: This is your Linode's hostname. A *hostname* is your Linode's name for itself.
-   **\~**: After the colon, the SSH session shows the name of the directory you're in. When you first log in, you're in your user's *home* directory. The tilde (**\~**) is a shortcut for the home directory. If the directory was spelled out, it would be `/root`. For users other than the root user, home directories are in `/home/user1`, where **user1** is the name of the user.
-   **\#** - The **hash** or **pound** (**\#**) punctuation mark indicates where the shell prompt ends. When you type a command, your text will begin after this point. For users other than the root user, the **dollar sign** (**\$**) indicates the same thing.

You can type any valid Linux shell command at the blinking cursor after the shell prompt. We'll go over a few practical commands in the rest of this article, but to get a really good in-depth introduction to the command-line interface, you should read the [Using the Terminal](/docs/using-linux/using-the-terminal) article as well.

 {: .note }
>
> These command line tips will make your Linux forays much more effective:
>
- Press `Return` after you finish a command.
- In most cases, you will not receive an "Are you sure?" message after executing a potentially-destructive command. Make sure you really want to run a command before you execute it.
- You may not get any message after a successful command. You will get an error if the command didn't work.
- If you don't know which directory you're in, you can always type `pwd`, short for *print working directory*.
- Press the `Up Arrow` on your keyboard to see or reuse the previous command that was executed.

Finding Your Way Around Files and Folders
-----------------------------------------

In this section, we'll look at the structure of a Linux server. Everything on your Linode is a file or a directory. Remember, *directory* is the Linux term for a folder. Let's find out where you are in the directory structure. Make sure your terminal application is selected and that you're still logged in to your Linode. You should see a blinking cursor where you can start typing. For your first command, let's use the `pwd` command. Short for *print working directory*, its output lets you view the full path to your current directory. Type the following command after the shell prompt (just the `pwd` part):

    root@localhost:~# pwd

Press `Return` to execute the command. You should see the following output:

    /root

The output of `pwd` shows you the full path to your current directory or directory. At the moment, you're inside the `/root` directory. You will always be inside a particular directory when you execute shell commands, although which directory you're in can change. The `pwd` command is very useful because it shows you exactly where you are in your Linode's directory structure.

Linux uses a tree of nested directories to keep its files organized. The highest-level directory is called the *root* directory. It's designated with a single slash. Let's move into the root directory, `/`, with another command. The `cd` command is short for *change directory*. After the `cd` part comes a space and then the file path. The file path can be long or short, depending on how deep you're going into the directory structure. To get to the root directory, type the following command, and press `Return` to execute it. The shell prompt (`root@localhost:~#`) will still be displayed on your screen, but this time we'll show you just the command:

    cd /

Unlike in Windows, there are no different disks or drives; the root directory is the highest-level directory for all Linux systems. The root directory is a bit like the filing cabinet for your server. Underneath the root directory are more directories. Directories can go inside other directories, as illustrated below:

[![The Linux directory structure.](/docs/assets/1489-linux_directory_structure_2.png)](/docs/assets/1489-linux_directory_structure_2.png)

For example, most Linux systems have directories called `lib` and `var` (along with several others) underneath the root directory. The `lib` directory contains system libraries, while the `var` directory contains all of the files on your system that are likely to change, such as your logs and your mail messages.

The *list* command, `ls`, shows everything that's directly inside of your current directory. To make the output the most helpful, we'll add a few *flags* to the `ls` command as well; in this case, the `-ahl` part of the command. Type the following command, and press `Return` to execute it:

    ls -ahl

You should see output that looks something like this:

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

That's quite a bit of output. The most important part is the list of directory and file names, all the way over on the right. They're listed alphabetically. You'll notice the directories `lib` and `var` from the image, as well as several others.

 {: .note }
>
> The **/root** directory is not the same as the **/** directory. **/** is the top-level directory of the server. Everything else is inside it. It is called the *root* directory when you're talking about it, but its name on the server is just **/**. On the other hand, the **/root** directory is the home directory for the **root** user. It's a sub-directory under the **/** directory, and it's where the **root** user starts after logging in to a new SSH session.

If you open the `var` directory, you'll find more directories, such as `log` for your logs, and `mail` for your system mail. Move into the `var` directory by executing the `cd` command:

    cd var

View the contents of the `var` directory with the `ls` command, just like we did earlier:

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

Here you can see the `log` and `mail` directories that we discussed, as well as several others. At the top of the list, you'll see two little directories named `.` and `..` with periods. Similar to the tilde (**\~**) we saw earlier, these directories are actually shortcuts or aliases, that appear in every directory. The single-period directory indicates the current directory. The double-period directory indicates the directory above the current one. So, if you are inside a lower-level directory and want to move up again, just use the `cd ..` command. To move back up to `/`, type the following command:

    cd ..

You should be in the `/` directory again. You can use `pwd` to verify this.

Finally, let's take a look at the `lib` directory. First, move into `lib` with the `cd` command:

    cd lib

List its contents with the `ls` command:

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

With the `pwd` command to show you where you are, the `cd` command to move to a new directory, and the `ls` command to show you the contents of a directory, you have the basic tools you need to navigate through your Linode's files and directories. To learn more about navigating directories, read the linked section of the [Using the Terminal](/docs/using-linux/using-the-terminal#sph_file-system-navigation) guide.

One of the easiest ways to upload your own files to your Linode is with a Secure FTP (**SFTP**) program. The [Migrate from Shared Hosting to Linode](/docs/migrate-from-shared) article has a great walkthrough for how to do this.

Users and Permissions
---------------------

Linux uses a powerful system of users and permissions to make sure that the right people get access to the right files. For example, as the owner of your Linode, you should to be able to view, edit, and run every file on the system. On the other hand, you want the general public to be able to view, but not change, your website files, and you don't want them to see the more structural files on your server at all. A different user, such as someone with a mailbox on your Linode, should be able to access their own files but not anyone else's. There are three permission categories:

-   *Users* are unique logins for your Linode. If you've ever set up your home computer to have accounts for your different family members, you already have the basic idea. Typically, a user account is assigned to either a real person (you!) or an application, like the Apache web server, that needs to access files on your system. (Applications get their own users for security and organization.) You can have any number of users on your Linode. To learn how to add a user, see the [Adding a New User](/docs/securing-your-server#sph_adding-a-new-user) section of the **Securing Your Server** guide.
-   *Groups* contain one or more users. Groups are a handy way to give similar access privileges to multiple users, without having to set them for each user. Each user has a default group when it is created, which typically is a new group with the same name as their user name; but each user may also belong to any number of additional groups. If more than one user belongs to a group, these users can share the same set of permissions for the files owned by that group. For example, if you have `user1` and `user2`, they can both be members of `group1`.
-   *Everyone* is the category for everyone else. If someone accesses files on your Linode without being logged in as a specific user, they fall into the *everyone* category. *Everyone* is sometimes known as *world*, because it includes everyone in the whole world. These three classes of people and other entities - users, groups, and everyone - are the core of the Linux file access system.

The next concept to learn about is *permissions*. Every file and directory on your Linux system has three possible access levels: read, write, and execute. A readable file can be viewed. A writeable file can be edited. An executable file (like an application file) can be run. *Running* is what happens when you start up a program or script, either on your home computer or your Linode.

When you combine the concepts of users and permissions, a flexible and powerful system for controlling file access emerges. Each file has read, write, and execute permissions for its user, group, and everyone categories. Remember the list of directories from the last section? Now we'll find out what more of those items mean, by looking at an example directory called `my_directory`:

    drwxr-xr-x  13 user1 group1 4.0K Nov  6 16:04 my_directory

The user and group are listed in the middle. In this case, the user is **user1** and the group is **group1**. The user is listed first and the group second. The permissions are listed at the beginning of the line. Ignoring the first character, you can see that the permissions for the `my_directory` directory are **rwxr-xr-x**.

-   **r**: read
-   **w**: write
-   **x**: execute
-   **-**: no permission

The user permissions are shown first. In this case, the user, **user1**, has read, write, and execute permissions, **rwx**. The group permissions are shown second. Here, everyone in the **group1** group has read and execute permissions, but not write permissions, **r-x**. This means that members of the **group1** group can view the contents of the `my_directory` directory, and run files in it, but not change them. The *everyone* permissions are listed last. Everyone can read and execute the files in the `var` directory, but not change them, because the permissions for everyone are again **r-x**.

To view the users and permissions for a particular file or directory, run the `ls -l` command, replacing **my\_directory** with the name of your own file or directory:

    ls -l my_directory

To learn about users and groups in more detail, read the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) article.

Software
--------

While you could just use your Linode as a big hard drive for storing files, most people will want to install software on their servers. This section shows you how to install, run, update, and uninstall software from a Linux system.

### Installing

Like most things in Linux, installing software is accomplished by typing and executing a specific text command. The most popular Linux distributions come with *package managers* that make it relatively easy to install and uninstall software on your Linode. Debian and Ubuntu use the Advanced Packaging Tool (**APT**) package manager, and Fedora and CentOS use the Yellowdog Updater, Modified (**yum**) package manager. Since we've been working with the Ubuntu 14.04 distribution so far, let's look at an example with APT. The command below shows you how to install the web server Apache, which lets you display websites:

    apt-get install apache2

**apache2** is the name of the package for Apache in the Ubuntu repositories. A package is a piece of software. *Repositories* are collections of software for your Linux distribution. The `apt-get` command is smart enough to look up an Ubuntu repository (specified on your system), find the apache2 package, and install it along with anything else you need for Apache.

The general form of the installation command for Ubuntu and Debian systems is:

    apt-get install software

Just replace the word **software** in the command above with the package name for the software you want to install. There are thousands of different programs available to install on your server. If you search online for the software you need, you can find the correct package names to use with the APT installer. For example, if you searched for "ubuntu web server," you would find information about the Apache web server, and its package name, **apache2**.

Using yum on Fedora and CentOS systems is just as easy:

    yum install software

Our **Quick Start Guides** series contain basic instructions for installing and configuring many common types of Linux software. The [Hosting a Website](/docs/hosting-website) guide shows you how to install software to run a website, while [Running a Mail Server](/docs/mailserver) is for email servers.

### Running

There are three main ways to run programs in Linux.

**Always on:**

You want some programs, like your web server, to run constantly. These are the programs that run as services on your Linode. For example, your web server keeps your website visible, so you want it to stay on all the time. Server processes that stay running in the background are known as *daemons*. To start a daemon, run the following command, replacing **software** with the name of the software you want to run. The name will be the same one you used to install it (for example, **apache2** for Apache):

    service software start

**Once:**

Sometimes you want to run a program on an as-needed basis. For example, you might want to run a script to rename a group of files. In that case, first use the `cd` command to move into the directory where the script is located. Make sure that your user has [execute permissions](#users-and-permissions) for the script file. If you need to modify the permissions, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups#sph_administering-file-permissions) guide. Then run the script with the following syntax:

    ./my_script

**Scheduled:**

Finally, sometimes you want to run a program at regular intervals, as in the case of a daily backup script. The best way to do this is with the *cron* tool. Read the [Schedule Tasks with Cron](/docs/linux-tools/utilities/cron) article to learn more. Scripts that you run this way also have to be [executable](#users-and-permissions).

### Updating

Updating software is about the easiest thing you will ever do on a Linux system. As long as you installed your software with a package manager, just use APT or yum to update your entire system at once. Here's the command for Debian and Ubuntu:

    apt-get update
    apt-get upgrade --show-upgraded

Or, for Fedora and CentOS:

    yum update

That's it! Your packages are now up to date.

 {: .caution }
>
> Updating your software is good for your system security. In most cases updates will go smoothly, but it's possible that some updates may break something on your server. It's always wise to make a [backup](/docs/platform/backup-service) of your system before updating it.

### Uninstalling

If you need to uninstall software, use the `apt-get remove` command:

    apt-get remove software

If you also want to remove all configuration files associated with the software, run this command instead:

    apt-get purge software

Here's the yum version for Fedora and CentOS:

    yum remove software

Security
--------

When you run a Linux system, you are in charge of its security. The Internet is full of people who want to use your Linode's computing power for their own goals. If you neglect changing default passwords, install out-of-date software, or leave any other loophole, it's only a matter of time before your system gets hacked. You should go through the [Securing Your Server](/docs/securing-your-server) article to tighten up your server's security.

Distributions
-------------

Let's conclude our introduction to Linux with a discussion of different distributions. Despite many differences, RedHat Linux (which includes Fedora and CentOS) and Debian Linux (which includes Ubuntu) share a large amount of code with each other; the kernels are largely the same, and most of the user utilities and applications from the GNU project are the same. The differences between distributions generally relate to the specific goals and aims of the system developers, and which bundles of software are installed by default.

For instance, some distributions are designed to be as simple and minimalistic as possible, while others are designed to contain the most current, bleeding-edge software. Still others aim to provide the greatest amount of stability and reliability. In addition to the personality of each distribution, which you'll have to discover for yourself, there are a number of factors that you might find useful when choosing a distribution.

-   **Release Cycle**: Different distributions release their operating system updates on different schedules. Distributions like Gentoo and Arch Linux use a *rolling release* model where individual packages are released whenever they're deemed ready by their developers. Conversely, distributions like Debian, Slackware, and CentOS strive to provide the most stable operating system attainable, and release new versions much less frequently. Fedora and Ubuntu release new versions of their operating systems every six months. Choosing the release cycle that's right for you depends on many factors, including the software you need to run, your comfort level, and the amount of stability and reliability you need.
-   **Organizational Structure**: While it might not affect the performance of the distribution, one of the distinguishing factors between distributions is the organizational structure of the development team. Some distributions, like Debian, Gentoo, Arch, and Slackware are developed by independent communities of developers, while other distributions like OpenSUSE, Fedora, and Ubuntu are developed by communities sponsored by various corporations (e.g. Novell, RedHat, and Canonical for the examples above). Other distributions, such as CentOS, are derived by a community from commercially-produced distributions.
-   **Common Tool Sets**: Different distributions make use of different tools for common tasks like [package management](/docs/using-linux/package-management) or system configuration. As we discussed above, Debian and Ubuntu use APT to manage `.deb` packages, CentOS and Fedora use yum to manage `.rpm` packages, and OpenSUSE also uses `.rpm` packages but manages them with a tool called **yast**. In many cases your choice of distribution will come down to the one that provides the tools you need and are most comfortable with.

Different distributions of Linux are right for different situations. You should experiment until you find the best fit for you. Given the similarities between different distributions, don't be afraid switch to a new one that will serve you better. If you're familiar with the concepts in this article, you're well on your way to administrating your system like a pro with any distribution of Linux.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Getting Started](/docs/getting-started/)
- [Using the Terminal](/docs/using-linux/using-the-terminal)
- [LAMP Guides](/docs/lamp-guides/)
- [Package Management](/docs/using-linux/package-management)



