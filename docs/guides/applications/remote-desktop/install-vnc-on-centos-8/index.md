---
slug: how-to-install-vnc-on-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: 'VNC lets you connect to a remote desktop environment. This guide shows you how to install a desktop on CentOS 8 and use a VNC server to connect to it remotely.'
og_description: 'VNC lets you connect to a remote desktop environment. This guide shows you how to install a desktop and setup a VNC server on CentOS 8.'
keywords: ['vnc','virtual network computing','remote desktop','install vnc','deploy vnc on centos 8']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-08
modified_by:
  name: Nathaniel Stickman
title: "How to Install VNC on Centos 8"
h1_title: "How to Install VNC on Centos 8"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos

---

*Virtual network computing* (VNC) allows you to connect to and control a remote desktop environment, giving you an option to operate your server with a full desktop experience. This guide walks you through the steps to install, configure, and use VNC on CentOS 8.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

3.  Update your system:

        sudo yum update

4. In the examples that follow, change `203.0.113.0` to the IP address for your CentOS 8 machine.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install a Desktop GUI

These steps walk you through installing a desktop environment. If you already have a desktop environment installed on your CentOS machine, skip to the next section.

GNOME is CentOS 8's default desktop environment and the one used in this guide.

1. Install the GNOME package group:

        sudo yum group install "GNOME"

    Alternatively, you can install the "Server with GUI" group to get the GNOME packages along with additional server packages:

        sudo yum group install "Server with GUI"

    To get a list of packages installed by each group, use the command `sudo yum groupinfo` followed by the group name in quotes, as in:

        sudo yum groupinfo "Server with GUI"

## Install and Configure the VNC Server

Several VNC options are available for CentOS. This guide uses the open source TigerVNC software, a popular option and one that can be found in CentOS's default repositories.

1. Install the TigerVNC server software:

        sudo yum install tigervnc-server

2. Using your preferred text editor, add a line to the `/etc/tigervnc/vncserver.users` file for each user for whom a remote desktop is being configured. In the following example, one user — `userA` — is configured for display port number `1`:

        :1=userA

    This example user and display port are used throughout the remainder of the guide.

    {{< note >}}
Display port numbers determine the port numbers on which VNC servers are made available. VNC server ports are 5900 plus the display port number — thus, 5901 for the example above. The resulting port numbers need to be available. However, display port numbers are otherwise arbitrary and do not need to be consecutive.
    {{< /note >}}

3. Set a VNC password for each user by logging in as that user, executing the following command, and creating a password:

        vncpasswd

    You are asked whether you would like to set a view-only password as well. Doing so is optional and not necessary for this guide.

4. Create a VNC configuration file for each user. Log in as that user, create a `~/.vnc/config` using root permissions (`sudo`), and add parameters for the VNC server to that file. The following are some example parameters. For the purposes of this guide, the `session` and `localhost` parameters are assumed, but the rest are optional:

        session=gnome
        geometry=1280x1024
        localhost
        alwaysshared

    Alternatively, you can configure global default parameters in the `/etc/tigervnc/vncserver-config-defaults` file. Parameters in that file are applied for any user unless otherwise overridden by a user's `~/.vnc/config` file.

    {{< note >}}
The [TigerVNC documentation](https://tigervnc.org/doc/Xvnc.html) provides a comprehensive list and descriptions of possible configuration parameters for the VNC server.
    {{< /note >}}

## Start the VNC Server

1. Start the TigerVNC Server for each user. The `1` in the following example is the display port number configured for the user:

        sudo systemctl start vncserver@:1.service

    If desired, you can also set the VNC server to begin running at system start up:

        sudo systemctl enable vncserver@:1.service

    You can verify that the server is running with the following command:

        sudo systemctl status vncserver@:1.service

2. Verify the port being used by the VNC server. The following command returns a list of active servers, and TigerVNC servers should be listed with "Xvnc" as their program name:

        sudo netstat -tlnp

    Since VNC servers operate on port 5900 plus the display port number and the examples above use "1" as the display port number, the remainder of this guide assumes the VNC server is on port 5901.

## Secure Your VNC Connection

VNC connections are, by default, unencrypted. Therefore, you should use *SSH tunneling* to secure your connection. To do so, you need to tunnel traffic through an SSH connection to a local port. For convenience, this guide uses the same local port number as the VNC server (5901).

The steps for SSH tunneling vary based the operating system of the machine you are using to connect to the VNC server.

See [Setting up an SSH Tunnel with Your Linode for Safe Browsing](docs/guides/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing/) for more details and information on configuring and using SSH tunneling.

### Linux and Mac OS X

1. Create an SSH tunnel for the VNC server port. The SSH connection is made to the user on whom the VNC server was configured — `userA` in the examples above:

        ssh -f userA@203.0.113.0 -L 5901:localhost:5901 -N

2. The above command runs the SSH tunnel in the background. When you are finished with the VNC connection, you can stop the SSH tunneling with the following command, which kills all SSH connections:

        pkill ssh

### Windows

1. Open PuTTY, and enter "userA@203.0.113.0" as the **Host name**, with "userA" being the user on whom the VNC server was configured.

2. Open the **Connections** menu, and select **Tunnels** from under the **SSH** section.

3. Enter "5901" as the **Source port** and "userA@203.0.113.0" as the **Destination**. Beneath **Desination**, select **Local** and **Auto**.

4. Click **Add**, and the SSH tunnel begins running.

## Connect to the VNC Server

With the VNC server running and secured, you can connect to it using a VNC client. The steps below again vary depending on the operating system of the machine you are using to connect to the VNC server.

### Mac OS X and Windows

Of the VNC client options for OS X and Windows, [RealVNC Viewer](https://www.realvnc.com/en/connect/download/viewer/) is perhaps the most popular and is free and easy to use.

1. Open RealVNC Viewer, and enter "localhost:5901" in the top bar.

    ![![Entering a host address in RealVNC Viewer](realvnc-enter-host_small.png "Entering a host address in RealVNC Viewer.")](realvnc-enter-host.png)

2. You are notified that the connection is unencrypted. However, the steps in the [Secure Your VNC Connection](docs/guides/how-install-vnc-on-centos-8/#secure-your-vnc-connection) section above ensure that your connection is securely tunneled. Click **Continue**.

    ![Notification of unencrypted connection in RealVNC Viewer](realvnc-unencrypted-notification.png "Notification of unencrypted connection in RealVNC Viewer.")

3. When prompted, enter the password configured for the VNC server user, following which the CentOS desktop opens.

### Linux

Since this guides uses GNOME for the desktop environment, Vinagre, designed specifically for GNOME, is a strong VNC client option for Linux.

1. Open Vinagre, and click the **Connect** button.

2. Set **Protocol** to **VNC**, and enter "localhost:5901" as the **Host**. Click **Connect**.

    ![![Entering connection information in Vinagre](vinagre-enter-host_small.png "Entering connection information in Vinagre.")](vinagre-enter-host.png)

3. When prompted, enter the password configured for the VNC server user, following which the CentOS desktop opens.