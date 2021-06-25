---
slug: connect-to-server-over-ssh-using-putty
author:
  name: Linode
  email: docs@linode.com
description: 'A tutorial outlining how to connect to a remote server over SSH using PuTTY on Windows (or Linux)'
og_description: 'A tutorial outlining how to connect to a remote server over SSH using PuTTY on Windows (or Linux)'
keywords: ['ssh','putty','windows','connect to server over ssh','connect to linode over ssh']
tags: ['ssh', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-25
modified_by:
  name: Linode
title: "How to Connect to a Remote Server Over SSH using PuTTY"
h1_title: "Connecting to a Remote Server Over SSH using PuTTY"
enable_h1: true
aliases: ['/networking/ssh/ssh-connections-using-putty-on-windows/','/networking/using-putty/']
relations:
    platform:
        key: connecting-to-server-over-ssh
        keywords:
            - Environment: PuTTY
---

A *secure shell* (SSH) is used for secure communication between devices. When most people refer to SSH, it is within the context of a connecting from a local computer to a remote server, commonly for administration tasks related to website hosting.

This article covers the basics of connecting to a remote server (such as a Linode) over SSH using the PuTTY application. PuTTY is a free and open source SSH client that provides a graphic interface for connecting to remote servers. It is compatible with Windows XP and later systems, including Windows Vista, 7, 8 and 10. It is also compatible with most UNIX systems.

{{< note >}}
While PuTTY is compatible with Windows 10, you may want to review the [Connecting to a Remote Server Over SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/) guide for alternatives to PuTTY that may better suit your needs and preferences.
{{</ note >}}

## Before You Begin

1. Ensure you have a Linux server with an SSH server (like OpenSSH) installed. Most Linux distributions have an SSH server preinstalled. If you wish to deploy a new server, follow the [Getting Started](/docs/getting-started/) guide to create a Linode.

1. Install [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) on your local Windows or Linux system.

## Connecting to the Remote Server Over SSH

1.  Open PuTTY. You can find PuTTY on your desktop, through the Start Menu, or by using Windows Search.

1.  Enter the following basic details about the destination host and the connection type.

    - **Host Name:** The domain name or IP address of the destination host.
    - **Port:** The SSH port on the destination host. The default port for most servers is 22, though you can change this port if needed.
    - **Connection type:** Select *SSH* for the connection type, though you can modify this if using a different protocol.

    ![Screenshot of the destination server details form on PuTTY](putty-destination.png "Destination details")

1.  Optionally, save your session to quickly reconnect in the future. Type in a unique name for the connection under **Saved Sessions** and press the **Save** button.

    !["Screenshot of the Save Session form on PuTTY"](putty-save-session.png)

1.  Click the **Open** button at the bottom of the PuTTY window to open the connection.

1.  When you connect to a server for the first time, PuTTY prompts you to verify that the host key's fingerprint matches what you expect.

    ![Screenshot of dialog box asking to confirm host key's fingerprint](putty-security-alert.png "Confirm the host key's fingerprint")

    If you trust this connection, press the **Accept** button to continue connecting to the remote server. You can verify the fingerprint by following the instructions under the [Verifying the Host Key's Fingerprint](#verifying-the-host-keys-fingerprint) section.

1.  PuTTY now prompts you to enter the remote user and the password for that user.

Once you have successfully connected, your terminal should be using the remote shell environment for the server. Your command prompt should now show the username and hostname configured for the server. You can now run any commands that you have available on that server. This includes many of the basic Linux commands, such as `ls`, `cd`, `rm`, and those covered in [Using the Terminal](/docs/guides/using-the-terminal/) guide. Getting to know these commands will help you navigate around your server.

## Verifying the Host Key's Fingerprint

1.  Log in to your remote server through a trusted method. For a Linode, use [Lish](/docs/networking/using-the-linode-shell-lish/).

1.  Run the command below to output your server's SSH key fingerprint

        ssh-keygen -E md5 -lf /etc/ssh/ssh_host_ed25519_key.pub

    The output looks similar to:

    {{< output >}}
256 MD5:58:72:65:6d:3a:39:44:26:25:59:0e:bc:eb:b4:aa:f7  root@localhost (ED25519)
{{< /output >}}

    {{< note >}}
For the fingerprint of an RSA key instead of elliptical curve, use: `ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub`.
{{< /note >}}

1.  Compare this output to what appears when opening an SSH connection on your local computer. The two fingerprints should match. **If the fingerprints do not match, do not connect to the server.** You won't receive further warnings unless the fingerprint changes for some reason. Typically, this should only happen if you reinstall the remote server's operating system. If you receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.

## Going Further

### Troubleshooting SSH Connection Issues

If SSH isn't connecting you to your Linode, you may need to investigate the state of your server. See the guide [Troubleshooting SSH](/docs/guides/troubleshooting-ssh/) for assistance.

### Increasing Security

- Now that you can connect from your Linux machine to the Linode over SSH, save not only time but also make the connection even more secure by using SSH public key authentication. See the guide [Use SSH Public Key Authentication on Linux, macOS, and Windows](/docs/guides/use-public-key-authentication-with-ssh/) for details.

- See the "Harden SSH Access" section of [Securing Your Server](/docs/security/securing-your-server/) to review how to secure SSH on the server's side, and the [Advanced SSH Server Security](/docs/guides/advanced-ssh-server-security/) for more information on making it even more secure.

### Additional PuTTY Guides

- [Create an SSH Tunnel for MySQL Remote Access](/docs/guides/create-an-ssh-tunnel-for-mysql-remote-access/): This guide uses PuTTY to create a secure SSH tunnel to access the MySQL command prompt on remote server.