---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'How to install and connect to a desktop environment on your Linode'
keywords: ["vnc", "remote desktop", "ubuntu", "16.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-06-21
modified_by:
  name: Phil Zona
published: 2016-06-21
title: 'Install VNC on Ubuntu 16.04'
external_resources:
 - '[VNC on Wikipedia](http://en.wikipedia.org/wiki/Virtual_Network_Computing)'
 - '[RealVNC](https://www.realvnc.com/)'
---

*Virtual network computing*, or VNC, is a graphical desktop sharing system that allows you to control one computer remotely from another. A VNC server transfers keyboard and mouse events, and displays the remote host's screen via a network connection, which allows you to operate a full desktop environment on your Linode.

![Install VNC on Ubuntu 16.04](/docs/assets/install-vnc-on-ubuntu-16-04.png)

This guide explains how to install a graphic desktop environment on your Linode running Ubuntu 16.04 and how to connect to it from your local computer using VNC.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install a Desktop and VNC Server on your Linode

1.  Ubuntu has several desktop environments available in its repositories. The following command installs the default desktop, [Unity](https://unity.ubuntu.com/), as well as several packages that are required for the graphical interface to work properly:

        sudo apt-get install ubuntu-desktop gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal

    {{< note >}}
This will install the full Ubuntu desktop environment, including office and web browsing tools. To install the desktop without these packages, run:

sudo apt-get install --no-install-recommends ubuntu-desktop gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal
{{< /note >}}

    During the install process, you will be asked whether or not to change a system file to the new version:

        Configuration file '/etc/init/tty1.conf'
         ==> File on system created by you or by a script.
         ==> File also in package provided by package maintainer.
           What would you like to do about it ?  Your options are:
            Y or I  : install the package maintainer's version
            N or O  : keep your currently-installed version
              D     : show the differences between the versions
              Z     : start a shell to examine the situation
         The default action is to keep your current version.
        *** tty1.conf (Y/I/N/O/D/Z) [default=N] ?

    Type **y** then **enter** to use the updated version.

2.  Install the VNC server:

        sudo apt-get install vnc4server

## Secure your VNC connection

The VNC server generates a *display*, or graphical output, identified by a number that is defined when the server starts. If no display number is defined, the server will use the lowest one available. VNC connections take place on port `5900 + display`. In this section we'll use a display number of 1; therefore, we'll connect to remote port 5901.

The default VNC connection is unencrypted. In order to secure your passwords and data, you will need to tunnel the traffic through an SSH connection to a local port. We'll use the same local port for consistency.

### Mac OS X and Linux

1.  From your desktop, connect to your Linode with the following command. Be sure to replace `user@example.com` with your username and your Linode's hostname or IP address:

        ssh -L 5901:127.0.0.1:5901 user@example.com

2.  From your Linode, launch the VNC server to test your connection. You will be prompted to set a password:

        vncserver :1

3.  Initiate your connection as per the steps in the [Connect to VNC from your Desktop](#connect-to-vnc-from-your-desktop) section.

### Windows

1.  Open [PuTTY](/docs/networking/using-putty) and navigate to `Tunnels` under the `SSH` section in the menu. Add a new forwarded port as shown below, replacing `example.com` with your Linode's IP address or hostname:

    [![Adding a forwarded port to PuTTY.](/docs/assets/1648-vnc-putty-1.png)](/docs/assets/1648-vnc-putty-1.png)

2.  Click **Add**, then return to the 'Session' screen. Enter your Linode's hostname or IP address and a title for your session. Click save to save your settings for future use, and then click open to initiate your SSH tunnel.

3.  Launch the VNC server to test your connection. You will be prompted to set a password:

        vncserver :1

4.  Initiate your connection as per the steps in the [Connect to VNC from your Desktop](#connect-to-vnc-from-your-desktop) section.

## Connect to VNC from your Desktop

In this section, we'll use a VNC client, or *viewer*, to connect to our server. A viewer is the  software that draws the graphical display generated by the server and creates the output on your local computer.

### Mac OS X and Windows

While there are many options for OS X and Windows, this guide will use [RealVNC Viewer](http://www.realvnc.com/download/viewer/).

1.  After installing and opening the viewer, connect to the localhost through your VNC client. The format is `localhost:#`, where `#` is the display number we used in the [Secure your VNC connection](#secure-your-vnc-connection) section:

    [![Connecting through an SSH tunnel.](/docs/assets/1647-vnc-5.png)](/docs/assets/1647-vnc-5.png)

2.  You will be warned that the connection is unencrypted, but if you have followed the steps above for securing your VNC connection, your session will be securely tunneled to your Linode. To proceed, press **Continue**.

    [![VNC Security Warning.](/docs/assets/1656-vnc-2-2.png)](/docs/assets/1656-vnc-2-2.png)

3.  You will be prompted to enter the password you specified in Step 4 of [the previous section](#install-a-desktop-and-vnc-on-your-linode).

    [![The VNC password prompt.](/docs/assets/1657-vnc-3-2.png)](/docs/assets/1638-vnc-3.png)

After connecting, you will see a blank gray screen since the desktop processes have not yet been started. In the next section we will configure your Linode to launch a full desktop.

### Linux

There are a variety of VNC clients available for Ubuntu desktops. You can find the list [here](https://help.ubuntu.com/community/VNC/Clients). For this guide, we'll be using Remmina, which is installed by default.

1.  Open Remmina.

    [![The Remmina Software.](/docs/assets/1640-vnc-ubuntu-1.png)](/docs/assets/1640-vnc-ubuntu-1.png)

2.  Click the button to `Create a new remote desktop profile`. Name your profile, specify the VNC protocol, and enter `localhost:1` in the server field. The `:1` in the server field corresponds to the display number. In the password section fill in the password you specified in Step 4 of [the previous section](#install-a-desktop-and-vnc-server-on-your-linode):

    [![Settings for a Remmina remote desktop connection.](/docs/assets/1641-vnc-ubuntu-2.png)](/docs/assets/1641-vnc-ubuntu-2.png)

3.  Press **Connect**.

You'll see a blank gray screen since the desktop processes have not yet started. In the next section, we will configure your Linode to launch a full desktop.

## Configure VNC for a Full Desktop

In the next few steps, we'll configure VNC to launch the full Unity desktop when it starts.

1.  Once you've successfully connected, exit the connection. Close the VNC server:

        vncserver -kill :1

2.  Edit the end of your `~/.vnc/xstartup` file to match the following configuration. This starts the desktop dependencies as background processes upon starting the VNC server:

    {{< file-excerpt "~/.vnc/xstartup" >}}
#!/bin/sh

# Uncomment the following two lines for normal desktop:
# unset SESSION_MANAGER
# exec /etc/X11/xinit/xinitrc

[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
vncconfig -iconic &
x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
x-window-manager &

gnome-panel &
gnome-settings-daemon &
metacity &
nautilus &

{{< /file-excerpt >}}


3.  Save and exit the file. Begin another VNC session:

        vncserver :1

4.  Connect from your local VNC client using the same steps from the [previous section](#connect-to-vnc-from-your-desktop). You should now see the full Ubuntu Desktop:

    [![A VNC connection with a full Ubuntu desktop.](/docs/assets/1643-vnc-ubuntu-3_small.png)](/docs/assets/1642-vnc-ubuntu-3.png)

## Starting VNC Server on Boot

Below we've outlined optional steps to ensure that the VNC server starts automatically after reboot.

1.  Open your crontab. If you've never edited it before, you may be prompted to choose a text editor:

        crontab -e
        no crontab for user - using an empty one

        Select an editor.  To change later, run 'select-editor'.
          1. /bin/ed
          2. /bin/nano        <---- easiest
          3. /usr/bin/vim.basic
          4. /usr/bin/vim.tiny

        Choose 1-4 [2]:

2.  Add `@reboot /usr/bin/vncserver :1` to the bottom of the file. Your crontab should look like this:

    {{< file-excerpt "crontab" >}}
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h dom mon dow command

@reboot /usr/bin/vncserver :1

{{< /file-excerpt >}}


3.  Save and exit the file. You can test by rebooting your Linode and attempting to connect to the VNC server.
