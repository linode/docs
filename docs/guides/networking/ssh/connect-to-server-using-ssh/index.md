---
slug: connect-to-server-using-ssh
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to connect to a Server via SSH on Linux.'
keywords: ['ssh','linux','connect to server over ssh','connect to linode over ssh']
tags: ["SSH", "Linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-28
modified_by:
  name: Linode
title: "How to Connect to Remote Server Over SSH"
h1_title: "Connecting to a Remote Server Over SSH"
enable_h1: true
---

A *secure shell* (SSH) is used for secure communication between devices. When most people refer to SSH, it is within the context of a connecting from a local computer to a remote server, commonly for administration tasks related to website hosting. This article covers the basics of connecting to a remote server (such as a Linode) over SSH.

## Before You Begin

1. Ensure you have a Linux server with an SSH server (like OpenSSH) installed. Most Linux distributions have an SSH server preinstalled. If you wish to deploy a new server, follow the [Getting Started](/docs/getting-started/) guide to create a Linode.

1. Your local computer will need an SSH client that can be used through a terminal application. Most modern operating systems (including Windows 10, MacOS, and popular Linux distributions) have both of these applications preinstalled and ready to use.

## Open the Terminal

On your local computer, open the terminal application you wish to use. The terminal allows you to access your operating system's shell environment and run programs through the command line.

### Linux

If you're using Linux through the command line, you can skip this step. If you are using Linux through a desktop environment (a graphical interface), you'll need to locate and open the terminal application that comes with your Linux distribution and desktop environment. In most cases, pressing `Ctrl` + `Alt` + `T` on your keyboard opens the default terminal.

- **Gnome**: The default terminal emulator is *Gnome Terminal*. Gnome is the default desktop environment for Ubuntu.
- **KDE**: The default terminal emulator is *Konsole*. KDE is the default desktop environment for Manjaro.


If this key combination does not work for you, other instructions for opening a terminal vary depending on the Linux distribution and desktop environment you are running. In many cases, you'll want to open the application search tool and search for "terminal".

### Mac

The default terminal emulator for macOS is called *Terminal*. To open this program, access Spotlight by pressing `Cmd` + `Space` on the keyboard and type "Terminal" in the search box. In the search results, click on *Terminal.app*. Refer to Apple's [Open or Quit Terminal on Mac](https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac) guide for additional methods of opening Terminal.

### Windows

Most newer installations of Windows 10 come preinstalled with an SSH client that can be used by terminal applications such as Windows Terminal, PowerShell, and [Hyper](https://hyper.is/). Microsoft recommends Windows Terminal, which can be installed through the [Microsoft Store](https://aka.ms/terminal) or through the instructions located in its [GitHub repo](https://github.com/microsoft/terminal).

Additional instructions (for both Windows 10 and earlier versions of Windows) can be found in the [Using SSH on Windows
](/docs/guides/using-ssh-on-windows/) guide.

## Connect to the Remote Server Over SSH

1. Within the terminal, enter the following command, replacing *[username]* with the username of the remote user and *[ip-address]* with the IP address or domain name of the remote server.

       ssh [username]@[ip-address]

    The SSH client will attempt to connect to the remote server over port 22 (the default SSH port).

    {{< note >}}
If the server's SSH port is something other than 22, it needs to be specified in the SSH command. To do this, use the `-p` option as shown in the command below. Replace [port-number] with the port number that the remote SSH server is using.

    ssh [username]@[ip-address] -p [port-number]
{{< /note >}}

1.  When you connect with a server for the first time, the SSH client prompts you to check and verify the host key's fingerprint. This is normal, and results in output similar to:

    {{< output >}}
The authenticity of host ‘example.com (93.184.216.34)’ can't be established.
ECDSA key fingerprint is SHA256:d029f87e3d80f8fd9b1be67c7426b4cc1ff47b4a9d0a84.
Are you sure you want to continue connecting (yes/no)?
    {{</ output >}}

1. Accept the prompt by entering `y` or `yes`, which results in a one-time warning that is similar to:

    {{< output >}}
Warning: Permanently added 'example' (ECDSA) to the list of known hosts.
{{</ output >}}

Once you have successfully connected, your terminal should be using the remote shell environment for the server. Your command prompt should now show the username and hostname configured for the server.

## Ending the SSH Session

After you are done, log out of the session by typing `exit`. The terminal then show something similar to:

{{< output >}}
logout
Connection to 93.184.216.34 closed.
{{< /output >}}

At this point, the shell prompt returns to the one for the local workstation and the terminal application can be closed if it's no longer needed.

## Going Further

### Troubleshooting SSH Connection Issues

If SSH isn't connecting you to your Linode, it is possible that it needs to be looked at on the server. See the guide [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) for assistance.

### Increasing Security

- Now that you can connect from your Linux machine to the Linode over SSH, save not only time but also make the connection even more secure by using SSH public key authentication. See the guide [Use SSH Public Key Authentication on Linux, macOS, and Windows](/docs/guides/use-public-key-authentication-with-ssh/) for details.

- See the "Harden SSH Access" section of [Securing Your Server](/docs/security/securing-your-server/) to review how to secure SSH on the server's side, and the [Advanced SSH Server Security](/docs/guides/advanced-ssh-server-security/) for more information on making it even more secure.

### Additional SSH Commands

If you want more details on what can be done with SSH, read the manual page by entering `man ssh` in the Terminal. There are some of the more interesting SSH-related commands in [Useful SSH Commands](/docs/guides/useful-ssh-commands).
