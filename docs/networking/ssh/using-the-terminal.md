---
author:
  name: Linode
  email: docs@linode.com
description: 'Accomplishing system administration tasks from a command prompt.'
keywords: ["Linux terminal", "terminal HOWTO", "Linode terminal tutorial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-linux/using-the-terminal/', 'tools-reference/ssh/using-the-terminal/']
modified: 2017-02-15
modified_by:
  name: Linode
published: 2009-08-02
title: Using the Terminal
external_resources:
 - '[Command Line at FLOSS Manuals](http://en.flossmanuals.net/gnulinux/index.php)'
---

The shell, also known as the "command line interface" or "CLI"", is the primary method for interacting with remote Linux servers. The shell is a rich interface for manipulating your files, managing your system, and scripting common tasks. If you use Linux on your local machine you are likely already familiar with the terminal; Mac OS X users may be familiar with the command line from Terminal.app.

![Using the Terminal](/docs/assets/using-the-terminal.png "Using the Terminal")

This document provides an overview of common operations and actions in the terminal environment, with some helpful hints for making your terminal experience more successful and rewarding. When you open a terminal either locally or over SSH, you'll be greeted with a message and presented with a prompt. Depending on your system's configuration, the prompt will end with either a dollar sign (`$`) for regular users and a hash (`#`) for root. We're now ready to begin this guide.

## The Structure of Commands

Most shell commands follow a similar format. They begin with the name of the command (which we can think of as a verb), then have an optional series of modifiers or flags that specific particular functions (adjectives,) and (if necessary) have some sort of object that the command is to affect. If you need help figuring out how a command works, generally sending the command with a `--help` flag will provide information on how to use the command.

## File System Navigation

One of the primary functions of the shell is providing a interface to the file system. These commands allow us to move, rename, and copy files on our system.

### Listing Directories

To list directories use the `ls` command. If the directory is empty, ls will execute and close without any output. `ls` (like all commands) assumes that the object (directory) is the current directory unless otherwise specified. To get a list of the `/etc/init.d/` directory, you would use the command:

    ls /etc/init.d/

To list all of the files in the current directory, including hidden files (such as those beginning with a `.`) use the `-a` flag for all files.

To generate a list with more information about the files, the long flag, `-l` may be used. This provides information on file sizes, permissions, and last modified times (with either -a or the standard output). You may further modify the long output with an -h flag to convert the file size information from raw bytes to human-readable numbers (in KB, MB, GB, etc) for easier comprehension. This command might look like:

    ls -lha

### Navigating Directories

You probably noticed in the output of `ls -a` and `ls -lha` directories named `.` and `..`. These "directories" represent the current (`.`) location and the parent (`..`) directories. You can use these shortcuts to specify relative paths, both in commands like `ls` and in other commands we have yet to discuss. To move your current location to a different directory we use the `cd` command (think "change directory"). To change to the `/etc/` directory use the following command:

    cd /etc/

You can also use various shortcuts to navigate the file system tree. If you're in your home directory (as a normal user, `~/`) to switch to the `/home` directory (where all user directories are stored) use the following command:

    cd ../

From the `/home` directory, using `cd ../` will get you to the top level of your file system (`/`). Similarly, if you were to use `cd ../jack/` from the `~/` directory, you would be placed in the `/home/jack` directory.

Using `cd ./jack` in the `/home` directory, however, will also place you in the `/home/jack` directory, as the `.` indicates the working or current directory (use `pwd` to print the working directory in the terminal).

The relative paths work to specify files and directories for all commands.

### Creating and Removing Directories

To create a new empty directory, use the make directory command `mkdir`, as in the following example which creates a new directory called `website/` underneath the current user's home directory (`~/`):

    mkdir ~/website/

If you need to create a new directory hierarchy, (a new directory within another new directory,) use the `-p` flag to make parent directories as needed. For example:

    mkdir -p ~/website/litchfield/public_www/

This would create the `public_www/` directory, inside of the `litchfield/` directory, inside of the `website/` directory in the current user's home directory, even if these directories didn't exist before the command was issued.

To remove directories, use the `rmdir` command. Be aware that this only works if the directory specified is empty.

### Creating and Removing files

If you want to create a file without writing any content to it you can use the `touch` command. You can also safely use `touch` on existing files, which resets the "last edited" value of touched files to the time when the command was issued.

To remove files use the `rm` command. Note that the `rm` command is permanent and *cannot* be undone. If you want to remove a directory that is non-empty use the `rm -r` command.

### Copying Files

To copy files use the `cp` command, followed by the original file and the location where you want to copy the file to. To copy your `/etc/hosts` file to your home directory in a file named `etc.hosts.backup` you would use the following command:

    cp /etc/hosts ~/etc.hosts.backup

*Note:* The current user's home directory is abbreviated by the system as `~/`.

By default, `cp` will not copy directories and contents of directories, if you need to copy contents of a directory into another directory, you need to use the -R flag (case sensitive; for recursive). To copy the contents of `~/website-files/` to `~/website-backups/` :

    cp -R ~/website-files/* ~/website-backups/

### Renaming and Moving Files and Directories

The `mv` command handles all moving and renaming operations on files and directories. Its syntax is the same as `cp` (though directory moves are recursive by nature). Therefore, to move `~/etc.hosts.backup` to `~/backups/etc.hosts` use the following command:

    mv ~/etc.hosts.backup ~/backup/etc.hosts

## Text Manipulation

Linux, like all UNIX-derived systems uses text files to manage configuration and content. As a result the terminal provides many tools for editing and manipulating text and text files.

### Nano Text Editor

If you just need a basic text editor, try the `nano` editor, which comes installed by default on nearly every Linux distribution. Run the command `nano` to open a blank file for editing, or you can specify a file name in the current directly like:

    nano my-new-file-in-nano.txt

You can specify a file in another directory; to edit `/var/www/index.html` use the following command:

    nano /var/www/index.html

Using nano is fairly straightforward once you have a file open,. Available commands are listed at the bottom of the terminal window. `^X` (Control-X) exits nano, for example.

### Redirecting Streams

When you run a command on the terminal its output is generally printed for you before a new prompt. While this is often the preferred behavior sometimes a directory listing is too long, or not sorted correctly by default. The shell lets us direct the output from one command to another until we have output that is useful to us. We will take a complex command and then break it down into more useful parts:

    ls /usr/bin/ | grep ^py.* > ~/python-bins.txt

This command:

1.  Generates a list of the files in `/usr/bin/` (with the `ls /usr/bin/` command.)
2.  Sends the output of `ls` to the `grep` command (with the `|` or "pipe" operator.)
3.  Searches the output of `ls` with `grep`, which looks for all files that begin with the letters `py` (a common prefix for programs written in the Python programming language.)
4.  Sends the output of `grep` to a file located in the current user's home directory (`~/`) named `python-bins.txt` (with the `>` operator.)

If the file specified at the end of the `>` operator has contents, `>` will overwrite that content. To append the output of a command to the end of an existing file use the append operator, which is `>>`.

### Searching Text

In the above example we searched a stream with the `grep` tool, which provides a very powerful interface for searching and filtering the contents of text streams and files. For example to "grep" the contents of the `/etc/hosts` file for "127.0.0.1" use the following command:

    grep "127.0.0.1" /etc/hosts

Note that `grep` expects the search "patterns" to be basic regular expression (a pattern matching syntax). `grep` is very powerful and its full is beyond the scope of this document. Please refer to the manual page for more information (enter `man grep`.)

### The Echo Command

The `echo` command is useful for repeating stated contents directly. This doesn't see much use as a simple command, but is useful in scripts and when combined with streams. For example:

    echo "Get Milk and Yogurt" >> shopping-list.txt

This command appends the string "Get Milk and Yogurt" to the end of the `shopping-list.txt` file.

You can also embed commands in echo statements, as in the following command:

    echo "I received a call on `date`" >> phone-log.txt

This will append `I received a call on Fri Jan 22 12:04:23 EST 2010` to the end of the `phone-log.txt` file. `date` will output the current date and time, and the output format of this command is controlled by the system's locale settings.

### Viewing Text in a Pager

There are a number of "pager" applications which you might find useful. Pagers take input from a file, and provide a mechanism to scroll, search, and review content without flooding your terminal with output. The most common pagers are `more` and `less`. You can open your `~/.bashrc` file in `less`, for example, with the following command:

    less ~/.bashrc

There's also a `cat` command that reads the content of a file onto standard output line for line. It may also be used to send the contents of a file to a command that doesn't provide an option to read directly from files. Additionally, the command `tac` sends the contents of a file to standard output (your screen by default) in reverse.

## System Monitoring

The terminal can also be useful for monitoring the current status of your server, and there are a number of default and optional applications which can help you monitor your system load.

The command `ps` lists active processes by Process ID (PID) numbers. You can use the `ps -A` command (including the "-A" flag) to list all currently running processes, including inactive processes.

The `top` command, which is installed by default on all systems, provides a regularly refreshed list of processes and resource utilization information. You may also wish to consider installing the `htop` application (with your system's [package management](/docs/using-linux/package-management/) tool), which provides more coherent output.

The `df` command, which is native to all systems, provides a metric of your current disk usage including free and unused space. You can use the `df -h` command (including the "-h" flag) to list your current space in megabytes and gigabytes, which is easier to read than flat kilobytes. You can also use the command `df -i` to view the number of iNodes your disk has used and remain available. An iNode is how the filesystem keeps track of files, and is directly related to the number of files that can be created.

The `du` command, also native to all systems, checks which directories are using the most space. There are a number of useful flags which you can use with this command, the first of which the `du -h` command will show the disk usage of every file in your current directory and as a whole in megabytes. Another especially useful flag, "--max-depth", allows you to specify how many directories deep the command should iterate through. For example, to obtain a list of the biggest directories which are contained in your filesystem you would use the command `du -h --max-depth 1 /`.

You may also wish to consider installing the `ncdu` application (with your system's [package management](/docs/using-linux/package-management/) tool), which provides the file size using a curses-based file browser.

For more information about monitoring the internals of your Linode, you can refer to the [System Diagnostics](/docs/tools-reference/linux-system-administration-basics#system-diagnostics) guide.

## The Terminal Environment

The above guide covers only the smallest corner of even the "core" group of commands. We feel the best way to become accustomed to the terminal environment is to actually use the terminal. As you become more familiar and comfortable with the terminal, you will discover additional commands and functionality.

If you can't remember an option or flag for a specific command, you can quickly find it by issuing the core command with the `--help` flag to get a quick overview of the syntax for that command. This section covers some basic functionality for the shell environment that is common on most contemporary UNIX systems: `bash`.

### Tab Completion

By default, `bash` provides tab completion for commands and executables in your `PATH` as well as for files and directories. Type the first few letters of a file name or command and then hit the "tab" key, and the shell will complete the command if it can. If there is more than one possible completion, `bash` will complete as many characters as it can; if there are still more than one possibility you can hit "tab" a second time, and `bash` will provide a list of possible completions.

### GNU Screen

This program may not be installed by default. It is a "terminal multiplexer" and is sometimes described as a "window manager" for the terminal. Start it with the command `screen` and after hitting return to dismiss the splash screen you will be brought to a terminal *inside* of screen.

Now, if you issue Control-a Control-c (commonly notated `C-a C-c`;, you don't need to release the control in between depressing the a and c keys) you will now have two terminal sessions running inside of screen. You can use C-a C-a to toggle between your current screen session and your last visited screen session. Screen terminals are assigned a number on creation and you can access a specific one with `C-a #`. To access a list of commonly used screen key bindings send `C-a ?`

The best part about screen sessions, however, is the fact that they are persistent beyond a single console session. This means you can connect to a remote server, start a screen session, issue a command that takes a while to execute, and the command will finish in screen even if you lose connectivity to the remote server. You may reconnect to the screen session with `screen -r`.

If you're running more than one screen session, you can use `screen -ls` to generate a list of the current screen sessions. If you want to connect to an already connected screen session, use the `screen -x` command which is useful for screen sharing and remote collaboration. If you want to connect to a screen that is attached to another session, use the `screen -DRR` command.

Screen is very powerful, and we encourage you to use it if you're having problems with connectivity to maintain a session without interruption.

### Task Management

The shell is capable of accepting more than one command at a time. If you append an ampersand (`&`) to the end of a command, the task is sent to the background, and you are provided with a prompt immediately. You can thus use the ampersand to string together a collection of commands to be issued all at once, while you work. Note that background tasks will still generate output, which might be confusing at first.

If you append double ampersands (`&&`) to the end of a command, the shell will wait until the preceding command completes successfully before executing the next command. You can use this functionality to string together a series of commands that depend on the previous commands' success.

### Command History

`bash` saves a history of recently issued commands in a `~/.history/` file. You can access these commands with the arrow keys, or with `C-p` and `C-n` (Control-), if you need to go back and use or reuse a past command.

### Emacs Key Bindings

In general, the `bash` terminal provides emacs-like key bindings for navigation. In addition to `C-n` and `C-p` to access next and previous commands in the history the following key binding make it easier to navigate the text in the bash-terminal (`C-` refers to a Control- modifer, and `M-` refers to a "meta" or Alt- modifier):

-   `C-a` Cursor to the beginning of the line (`C-a a` in screen)
-   `C-e` Cursor to the end of the line
-   `C-f` Move cursor forward one character
-   `C-b` Move cursor back one character
-   `M-f` Move cursor forward one word
-   `M-b` Move cursor back one word
