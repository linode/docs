---
slug: connect-to-server-over-ssh-on-linux
description: "A tutorial outlining how to connect to a remote server over SSH on a Linux system, including opening the terminal and structuring the ssh command."
keywords: ['ssh','linux','connect to server over ssh','connect to linode over ssh']
tags: ['ssh', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-25
modified: 2022-01-28
image: SSHLINUX.jpg
modified_by:
  name: Linode
title: "Connecting to a Remote Server Over SSH on Linux"
title_meta: "How to Connect to a Remote Server Over SSH on Linux"
relations:
    platform:
        key: connecting-to-server-over-ssh
        keywords:
            - Environment: Linux
authors: ["Linode"]
---

A *secure shell* (SSH) is used for secure communication between devices. When most people refer to SSH, it is within the context of connecting from a local computer to a remote server, commonly for administration tasks related to website hosting.

This article covers the basics of connecting to a remote server (such as a Linode) over SSH on a Linux system.

## Before You Begin

1. Ensure you have a Linux server with an SSH server (like OpenSSH) installed. Most Linux distributions have an SSH server preinstalled. If you wish to deploy a new server, follow the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide to create a Linode.

1. Your local computer needs an SSH client that can be used through a terminal application. Most modern Linux distributions have SSH installed and ready to use.

## Open the Terminal

On your local computer, open the terminal application you wish to use. The terminal allows you to access your operating system's shell environment and run programs through the command line.

If you're using Linux through the command line, you are already in the terminal and can skip this section. If you are using Linux through a desktop environment (a graphical interface), you'll need to locate and open the terminal application that comes with your Linux distribution and desktop environment. In most cases, pressing `Ctrl` + `Alt` + `T` on your keyboard opens the default terminal.

- **Gnome**: The default terminal emulator is *Gnome Terminal*. Gnome is the default desktop environment for Ubuntu.
- **KDE**: The default terminal emulator is *Konsole*. KDE is the default desktop environment for Manjaro.

If this key combination does not work for you, other instructions for opening a terminal vary depending on the Linux distribution and desktop environment you are running. In many cases, you'll want to open the application search tool and search for "terminal".

## Connecting to the Remote Server Over SSH

1.  Within the terminal, enter the following command, replacing *[username]* with the username of the remote user and *[ip-address]* with the IP address or domain name of the remote server.

    ```command
    ssh [username]@[ip-address]
    ```

    The SSH client attempts to connect to the remote server over port 22 (the default SSH port).

    {{< note >}}
    If the server's SSH port is something other than 22, it needs to be specified in the SSH command. To do this, use the `-p` option as shown in the command below. Replace [port-number] with the port number that the remote SSH server is using.

    ```command
    ssh [username]@[ip-address] -p [port-number]
    ```
    {{< /note >}}

1.  When you connect with a server for the first time, the SSH client prompts you to check and verify the host key's fingerprint. This is normal, and results in output similar to:

    ```output
    The authenticity of host ‘example.com (93.184.216.34)’ can't be established.
    ECDSA key fingerprint is SHA256:d029f87e3d80f8fd9b1be67c7426b4cc1ff47b4a9d0a84.
    Are you sure you want to continue connecting (yes/no)?
    ```

    You can verify the fingerprint by following the instructions on the [Verifying the Authenticity of a Remote Server](/docs/guides/verifying-the-authenticity-of-remote-host/) guide.

    {{< note >}}
    If you recently rebuilt your server, you might receive an error message when you try to connect. This happens when the remote host key changes. To fix this, revoke the key for that IP address.

    ```command
    ssh-keygen -R 198.51.100.4
    ```
    {{< /note >}}

1. Accept the prompt by entering `y` or `yes`, which results in a one-time warning that is similar to:

    ```output
    Warning: Permanently added 'example' (ECDSA) to the list of known hosts.
    ```

Once you have successfully connected, your terminal should be using the remote shell environment for the server. Your command prompt should now show the username and hostname configured for the server. You can now run any commands that you have available on that server. This includes many of the basic Linux commands, such as `ls`, `cd`, `rm`, and those covered in [Using the Terminal](/docs/guides/using-the-terminal/) guide. Getting to know these commands will help you navigate around your server.

## Ending the SSH Session

After you are done, log out of the session by typing `exit`. The terminal then shows something similar to:

```output
logout
Connection to 93.184.216.34 closed.
```

At this point, the shell prompt returns to the one for the local workstation and the terminal application can be closed if it's no longer needed.

## Sending Commands Over SSH

Instead of using SSH to open your remote server's console, you can run commands on your server without leaving your local shell environment. This can enable you to quickly run commands both locally and remotely in the same terminal window.

### Sending a Single Command

To run a single command on your remote server, use the following command. Replace *[username]* with the username of the remote user,  *[ip-address]* with the IP address or domain name of the remote server, and *[command]* with the command you wish to run.

```command
ssh [username]@[ip-address] [command]
```

As an example, running `ssh me@192.0.2.0 ls` lists all the files in the home directory of the user called `me`. This can be useful to find the uptime of the server (`ssh me@192.0.2.0 uptime`) or maybe determine its Linux distribution and version (`ssh me@192.0.2.0 lsb_release -a`).

### Sending Multiple Commands

To run multiple commands on your remote server (one after the other), use the following command. Replace *[command-1]*, *[command-2]*, and *[command-3]* with the commands you wish to run.

```command
ssh [username]@[ip-address] "[command-1]; [command-2]; [command-3]"
```

The commands should be separated by a semi-colon (`;`) and all of the commands together should be surrounded by double quotation marks (`"`). For example, if you wanted to create a file named *bar.txt* in a directory called *foo* within the user **me**'s home directory, run: `ssh me@192.0.2.0 "mkdir foo; cd foo; touch bar.txt`.

### Using sudo

It's recommended to disable root access over SSH and only log in to your remote server through a limited user account. However, some commands require elevated privileges, which can usually be accomplished by prepending the command with `sudo`. If you attempt to do this while running commands directly through the SSH command, you may receive an error such as "no tty present" or there isn't a "stable CLI interface". To run the `sudo` command in these instances, use the `-t` option, which forces a psuedo-terminal allocation. For example, to update your packages on a Debian-based system, run `ssh linode@example.com -t "sudo apt update"`.

## Going Further

### Troubleshooting SSH Connection Issues

If SSH isn't connecting you to your Linode, you may need to investigate the state of your server. See the guide [Troubleshooting SSH](/docs/products/compute/compute-instances/guides/troubleshooting-ssh-issues/) for assistance.

### Increasing Security

- Now that you can connect from your Linux machine to the Linode over SSH, save not only time but also make the connection even more secure by using SSH public key authentication. For more information, see [SSH add keys](/docs/guides/use-public-key-authentication-with-ssh/).

- See the "Harden SSH Access" section of [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to review how to secure SSH on the server's side, and the [Advanced SSH Server Security](/docs/guides/advanced-ssh-server-security/) for more information on making it even more secure.