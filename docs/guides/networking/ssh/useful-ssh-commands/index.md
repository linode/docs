---
slug: useful-ssh-commands
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to connect to a Linode server via SSH from Linux using the OpenSSH server on Ubuntu 20.10 Groovy Gorilla for the example.'
keywords: ['ssh','linux','connect to server over ssh','connect to linode over ssh']
tags: ["SSH", "Linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-26
modified_by:
  name: Linode
title: "Useful SSH Commands"
h1_title: "Useful SSH Commands"
external_resources:
- '[SSH: The Secure Shell - The Definitive Guide](http://www.snailbook.com/index.html)'
---
A *secure shell* (SSH) is used for securing network connections between devices. When most people refer to SSH, it is within the context of a remote connection from a client computer to a server, and there are some useful commands to know when using SSH to do this. This article covers what you can do when connected to your Linode over SSH on the *command-line interface* (CLI).

{{< note >}}
When you connect over SSH to your Linode, you are opening a remote console session on that machine and the commands you type are as if you were at a keyboard connected directly to it. Those commands are not specific to SSH but Linux, and many of the basic Linux CLI commands are covered in our guide on [Using the Terminal](/docs/guides/using-the-terminal/) and can be used on your Linode. If you are unfamiliar with Linux commands, that is a good place to start.
{{< /note >}}

{{< note >}}
The domain name and IP address below are reserved by the Internet Assigned Numbers Authority for documentation purposes.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname.

2.  SSH is enabled upon creation of the Linode. This guide assumes you have already established a successful connection to your Linode over SSH. If you have yet to set that up, see our guides:
    - [Linux](docs/guides/how-to-connect-over-ssh-on-linux)
    - [macOS](docs/guides/how-to-use-ssh-on-a-mac)
    - [Windows](docs/guides/using-ssh-on-windows)

## Commands to use with SSH

As mentioned above, many of the basic Linux CLI commands, such as `ls`, `cd`, `rm`, and more are covered in [Using the Terminal](/docs/guides/using-the-terminal/). Getting to know those will help you use the Linode.

SSH itself can be used for a few more things than just connecting, however.

### Sending a Single Remote Command

If you simply need to do one thing, then you can send a command along with the SSH login after the hostname (if you haven’t set up [public key authentication](docs/guides/security/authentication/use-public-key-authentication-with-ssh/), you will be prompted for the account's password).

For example, if you just wanted to check what's in your user directory, you would send `ssh linode@example.com ls`, get prompted for your password (if public key authentication isn't set up), and then be dropped directly back to your local machine's command prompt. This can be useful to find the date on the machine (`ssh linode@example.com date`) or maybe its Linux distribution and version (`ssh linode@example.com lsb_release -a`), amongst many other things.

#### Using sudo

If a command needs `sudo`, the remote computer wants a session to be present. If you try to send a `sudo` command, the server will respond that there's "no tty present" or there isn't a "stable CLI interface" as `sudo` is expecting a terminal. to force this, use the `-t` switch, which forces a psuedo-terminal allocation.

For example, if you wanted to quickly see if an Ubuntu server using the *Advanced Package Tool* (APT) had packages needing updates, you would run `sudo apt update`. To do this in a single line on the example server, you would send `ssh linode@example.com -t "sudo apt update"` and that would result in something like this:

{{< output >}}
Hit:1 http://mirrors.linode.com/ubuntu focal InRelease
Hit:2 http://mirrors.linode.com/ubuntu focal-updates InRelease
Hit:3 http://mirrors.linode.com/ubuntu focal-backports InRelease
Hit:4 http://mirrors.linode.com/ubuntu focal-security InRelease
Reading package lists... Done
Building dependency tree
Reading state information... Done
All packages are up to date.
Connection to 93.184.216.34 closed.
{{< /output >}}

### Sending Multiple Commands

#### Stringing Commands on the CLI

Multiple commands can be strung together, though care has to be taken to get them correct. For example, if you wanted to create a file named "bar.txt" in a directory called "foo" in the example user's directory, you would string the commands together in one line, delimited within parentheses (`"`) and each separated by a semi-colon and a space (`; `), making the line entered: `ssh linode@example.com "mkdir foo; cd foo; touch bar.txt`

#### Using a File

It is also possible to run multiple commands using text files and scripts. If you wanted to create the same file as above, but save the commands as a text file:

1.  Start by creating a file called "multiple-commands.txt" on your local system: `cat >multiple-commands.txt`
    - This assumes you are using the CLI in Linux or macOS to do this. Feel free to create the file as you want.
2.  Enter the commands you want to execute:
    {{< file "multiple-commands.txt" plaintext >}}
mkdir foo
cd foo
touch bar.txt
    {{< /file >}}
3.  Use Control-D to close and save the file.
4.  At the CLI, make sure you are in the folder or directory "multiple-commands.txt" is in, and then enter the SSH command: `ssh linode@example.com < multiple-commands.txt`

## Further Reading on SSH

### Unable to connect?

If you seem to be unable to perform certain functions via SSH, it is possible you may not have permission to perform that function (as your system administrator) or it needs to be looked at on the server. See the guide [Troubleshooting SSH](docs/guides/troubleshooting/troubleshooting-ssh/) for assistance.

### Stop Typing Passwords

If you've been typing or copying/pasting passwords to connect via SSH, you can save not only time but also make the connection even more secure by using SSH public key authentication. See the guide [Use SSH Public Key Authentication on Linux, macOS, and Windows](docs/guides/security/authentication/use-public-key-authentication-with-ssh/) for details.

### More Commands

If you want more details on what can be done with SSH, read the manual page by entering `man ssh` in the Terminal.