---
slug: how-to-connect-via-ssh-on-macos
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to connect to a Linode server via SSH from macOS using the OpenSSH server using macOS Big Sur 11.x for the example.'
keywords: ['ssh','macos','connect to server over ssh','connect to linode over ssh']
tags: ["SSH", "macOS"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-29
modified_by:
  name: Linode
title: "How to Connect via SSH on macOS"
h1_title: "How to Connect via SSH on macOS."
external_resources:
- '[SSH: The Secure Shell - The Definitive Guide](http://www.snailbook.com/index.html)'
---
A *secure shell* (SSH) is used for securing network connections between devices. When most people refer to SSH, it is within the context of a remote connection from a client computer to a server. This article covers the basics of connecting from a local workstation running Linux to your Linode over SSH on the *command-line interface* (CLI). macOS Big Sur is used for this example, but this article should apply to any recent version of macOS and OS X.

{{< note >}}
The domain name and IP address below are reserved by the Internet Assigned Numbers Authority for documentation purposes.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname.

2.  This guide covers the basics of connecting over SSH from a client. See the "Harden SSH Access" section of [Securing Your Server](/docs/security/securing-your-server/) to review how to secure SSH on the server's side.

## Connecting to Linode over SSH from a Mac

SSH commands are entered at the CLI, which Terminal.app is used for on a Mac. Shift-Command-U (⇧⌘U)

1.  Open Terminal.app to reach the CLI. It's not in the Dock by default, so if you have not already put it there, it can be found in multiple ways.
    - The first, and easiest, is to search for it using Spotlight.
        - First, open Spotlight:
        ![Spotlight icon in macOS Big Sur](open-spotlight.png)
        - Then, search for "terminal" and click on the application to launch:
        ![Typing the word terminal in Spotlight in macOS Big Sur](terminal-in-spotlight.png)
    - If you prefer to click, you can open the Utilities folder, which is where Terminal.app is located. To open the Utilities folder:
        - Go to the Finder (usually done by clicking on the Finder's Dock icon):
        ![The Finder icon in macOS Big Sur](finder-icon-in-big-sur.png)
        - Then, do one of three things:
            -  Use the keyboard shortcut *Shift-Command-U* (⇧⌘U) to open the Utilities folder.
            -  Click on the "Go" menu in the menu bar and then choose "Utilities":
            ![Choosing Utilities in the Go menu in macOS Big Sur](utilities-in-go-menu.png)
            -  Or, in a new Finder window, click on "Applications" in the side bar, then open the "Utilities" folder, then click on Terminal:
            ![Navigating to the Terminal in the Finder in macOS Big Sur](terminal-location-in-finder.png)
2.  Once it's running, we suggest keeping the Terminal in the Dock. Do so by right-clicking the icon in the Dock, choosing "Options," and then choosing "Keep in Dock":
        ![Keeping the Terminal in the Dock in macOS Big Sur](keep-terminal-in-dock.png)
3.   To connect with a Linode over SSH, type the command and user name at the server's domain or IP address in the shell prompt (`ssh <username>@<domain_or_ip_address>`). For example, if a user named "linode" needed to connect to "example.com" over SSH, `ssh linode@example.com` would be entered and the SSH client will try to connect to example.com on the standard TCP port 22 by default.
    {{< note >}}
If the server's SSH port is something other than 22, it needs to be specified in the SSH command. The previous command can be and define the TCP port you need to connect to with `ssh <username>@<domain_or_ip_address> -p <port number>`. For example, if the TCP port you want to connect with is "2222" for example, the example above would then look like `ssh linode@example.com -p 2222`.
    {{< /note >}}
4.  When you connect with a server for the first time, the SSH client will prompt you to check and verify the host key's fingerprint. This is normal, and results in output such as this:
    {{< output >}}
    The authenticity of host ‘example.com (93.184.216.34)’ can't be established.

ECDSA key fingerprint is SHA256:d029f87e3d80f8fd9b1be67c7426b4cc1ff47b4a9d0a84.

Are you sure you want to continue connecting (yes/no)?
    {{</ output >}}
4. Accept the prompt by entering `yes`, which will result in a one-time warning that looks like this:
    {{< output >}}
    Warning: Permanently added 'example' (ECDSA) to the list of known hosts.
    {{</ output >}}
    {{< note >}}
Depending on the flavor of Linux being used on the server and the requirements system administrators may place on the users, multiple different types of greetings may appear upon logging in (you may be asked to change your password, for example).
    {{< /note >}}

## Once Connected over SSH

After any greetings, the shell prompt in the terminal will then appear as `<username>@<computername>` (for example, `linode@example-computer`), showing that you are now, within that terminal window, acting as that user on that computer (technically referred to as a "console session"). You can now do what you need to do on that computer.

## Ending the SSH Session

Once finished, log out of the session by typing `exit`. The terminal will then show something like this:

{{< output >}}
logout
Connection to 93.184.216.34 closed.
{{< /output >}}

At this point, the shell prompt return to the one for the local workstation, and the Terminal application can be closed if it's no longer needed.


## Further Reading on SSH

### Unable to connect?

If SSH isn't connecting you to your Linode, it is possible it needs to be looked at on the server. See the guide [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) for assistance.

### More Security

- Now that you can connect from your Linux machine to the Linode over SSH, save not only time but also make the connection even more secure by using SSH public key authentication. See the guide [Use SSH Public Key Authentication on Linux, macOS, and Windows](/docs/guides/use-public-key-authentication-with-ssh/) for details.

- See the "Harden SSH Access" section of [Securing Your Server](/docs/security/securing-your-server/) to review how to secure SSH on the server's side, and our [Advanced SSH Server Security](/docs/guides/advanced-ssh-server-security/) for more information on making it even more secure.

### More Commands

If you want more details on what can be done with SSH, read the manual page by entering `man ssh` in the Terminal. We also cover some of the more interesting SSH-related commands in [Useful SSH Commands](/docs/guides/useful-ssh-commands).