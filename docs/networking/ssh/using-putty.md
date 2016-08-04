---
author:
  name: Linode
  email: docs@linode.com
description: 'Accessing remote servers with PuTTY, a free and open source SSH client for Windows and UNIX systems.'
keywords: 'putty,putty ssh,windows ssh client'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/using-putty/']
modified: Sunday, October 14th, 2012
modified_by:
  name: Doug Freed
published: 'Sunday, September 20th, 2009'
title: Using PuTTY
external_resources:
 - '[PuTTY Documentation](http://www.chiark.greenend.org.uk/~sgtatham/putty/docs.html)'
 - '[Xming Manual](http://www.straightrunning.com/XmingNotes/manual.php)'
---

PuTTY is a free, open source SSH client for Windows and UNIX systems. It provides easy connectivity to any server running an SSH daemon (usually provided by OpenSSH). With this software, you can work as if you were logged into a console session on the remote system.

## Obtaining and Running PuTTY

You can obtain the software from the [PuTTY download page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). For Microsoft Windows users, PuTTY is compatible with Windows 95 or greater: nearly every modern Windows computer can run PuTTY. Simply save the program to your desktop and double-click it to begin. You'll be presented with this screen:

[![The session login screen in PuTTY on Windows.](/docs/assets/160-putty-01-session.png)](/docs/assets/160-putty-01-session.png)

Enter the hostname or IP address of the system you'd like to log into and click "Open" to start an SSH session. If you haven't logged into this system with PuTTY before, you will receive a warning similar to the following:

[![An unknown host key warning in PuTTY on Windows.](/docs/assets/161-putty-02-host-key-warning-2016.png)](/docs/assets/161-putty-02-host-key-warning-2016.png)

In this case, PuTTY is asking you to verify that the server you're logging into is who it says it is. This is due to the possibility that someone could be eavesdropping on your connection, posing as the server you are trying to log into.

You need some "out of band" method of comparing the key fingerprint presented to PuTTY with the fingerprint of the public key on the server you wish to log into. To find the ssh-ed25519 key fingerprint as shown in the warning, log in to your Linode via the AJAX console (see the "Remote Access" tab in the Linode Manager) and execute the following command:

    ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub -E md5

The key fingerprints should match. Click "Yes" to accept the warning and cache this host key in the registry. You won't receive further warnings unless the key presented to PuTTY changes for some reason; typically, this should only happen if you reinstall the remote server's operating system. If you should receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.

The default port for SSH is 22. If the SSH daemon is running on a different port, you'll need to specify it after the hostname on the "Session" screen. PuTTY may also be used to connect to telnet servers, although this protocol isn't commonly deployed on modern Linux servers. Telnet is an insecure protocol, as it transmits all data in cleartext over the network (including login credentials) and includes no method of verifying the identity of remote servers.

## Running Remote Graphical Applications over SSH

You may wish to run graphical applications hosted on a remote Linux server. This may be securely accomplished using PuTTY. First, you'll need an X11 server for Windows. To download Xming, a free X11 server, visit the [Xming Sourceforge page](http://sourceforge.net/projects/xming/). Accept the defaults presented by the installer and you'll be running an X11 server upon completion of the install process.

Please note that the `xauth` program needs to be installed on your remote server for X11 forwarding to work correctly. You can use the following commands to install it (make sure you're logged in as root).

**Debian or Ubuntu** :

    apt-get install xauth 

**CentOS or Fedora** :

    yum install xauth 

Next, you'll need to tell PuTTY to forward X11 connections to your desktop. On the "Connection -\> SSH -\> X11" screen, check the box for "Enable X11 forwarding." Enter "localhost:0" in the "X display location" field. Make sure the remote server's hostname is entered on the "Session" screen, and click "Open" to log in. Once you're logged into the remote server, you may start any graphical application hosted there. The application will be projected onto your local desktop. Here's the `xcalc` application running on a remote server, projected onto a Windows desktop:

[![A remote X11 application running via PuTTY on Windows.](/docs/assets/162-putty-03-xcalc-running.png)](/docs/assets/162-putty-03-xcalc-running.png)

You can run virtually any X11 app in this manner. The connection will be encrypted through SSH, providing a safe means of interacting with remote graphical systems.

## Using SSH Tunnels

SSH tunnels allow you to access network services running on a remote server though a secure channel. This is useful in cases where the service you wish to access doesn't run over SSL, or you do notest wish to allow public access to it. As an example, you can use tunneling to securely access a MySQL server running on a remote server. To do so, visit the "Connection -\> SSH -\> Tunnels" screen in PuTTY. Enter "3306" for the "Source port" field and "127.0.0.1:3306" for the "Destination" field, as shown below.

[![Tunneling a remote MySQL connection through SSH with PuTTY on Windows.](/docs/assets/163-putty-04-mysql-ssh-tunnel.png)](/docs/assets/163-putty-04-mysql-ssh-tunnel.png)

Once you've connected to the remote server with this tunnel configuration, you'll be able to direct your local MySQL client to `localhost:3306`. Your connection to the remote MySQL server will be encrypted through SSH, allowing you to access your databases without running MySQL on a public IP.