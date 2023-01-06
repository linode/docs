---
slug: glish
author:
  name: Linode
  email: docs@linode.com
description: "Use Glish (the Linode Graphical Shell) to access a desktop environment, like Xfce or Gnome, on your web browser."
keywords: ["Console", "Shell", "glish", "desktop environment", "display manager"]
aliases: ['/platform/manager/using-the-linode-graphical-shell-glish-classic-manager/','/networking/using-the-graphic-shell-glish/','/networking/using-the-linode-graphical-shell-glish/','/platform/manager/using-the-linode-graphical-shell-glish/','/platform/using-the-linode-graphical-shell-glish/','/networking/use-the-graphic-shell-glish/','/guides/using-the-linode-graphical-shell-glish/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-10-12
modified_by:
  name: Linode
published: 2015-08-28
title: "Access Your Desktop Environment Using Glish (Linode Graphical Shell)"
title_meta: "Access Your Desktop Environment Using Glish"
tags: ["linode platform","cloud manager"]
image: using-linode-glish-title.jpg
---

Glish is the graphical version of [Lish](/docs/guides/lish/) (the Linode Shell). It allows you to run a desktop environment on your Compute Instance and access it through the Cloud Manager.

{{< note respectIndent=false >}}
Linode distribution images do not have any desktop environments pre-installed. While this guide provides instructions for installing Xfce on Debian, you can use any other desktop environment and distribution. Popular desktop environments on Linux include Gnome, KDE, MATE, and Xfce.
{{< /note >}}

## Enable Glish

By default, Glish is enabled on all Compute Instances as part of the distro helper configuration tool. There is no additional configuration needed. Glish works by accessing the `tty1` console over the virtual VGA device.

If you have disabled distro helper on your Compute Instance's [Configuration Profile](/docs/guides/linode-configuration-profiles/), manually launch a [getty](https://en.wikipedia.org/wiki/Getty_(Unix)) on `tty1` using the command below. This command may vary depending on the installed distribution.

    exec /sbin/getty -8 38400 tty1 &

{{< note respectIndent=false >}}
If you are having issues accessing Weblish or Glish, you may be behind a restrictive local firewall. See [Lish Gateways](/docs/guides/lish/#lish-gateways) for a list of data centers, their corresponding gateways, and the ports that are used.
{{< /note >}}

## Install a Display Manager and Desktop Environment

Before using Glish, a display manager and desktop environment must be installed on the Compute Instance. You can use any desktop environment that you wish, including [Gnome](https://www.gnome.org/), [KDE](https://kde.org/), [MATE](https://mate-desktop.org/), and [Xfce](https://www.xfce.org/). When choosing one, consider the size of your Compute Instance and the requirements of that desktop environment. For instance, Xfce and MATE are lightweight and can run on the smallest Compute Instance. When running Gnome, at least 2 GB of memory is recommended. For KDE, at least 4 GB of memory is recommended.

{{< note respectIndent=false >}}
The instructions below install Xfce4 and LightDM on Debian 11. You are not limited to using these applications or this distribution. If you wish to use other software, follow the instructions for that application.
{{< /note >}}

1. Log in to your Compute Instance using [Lish](/docs/guides/lish/) or [SSH](/docs/guides/set-up-and-secure/#connect-to-the-instance).

1.  Follow all of the instructions within the [Set Up and Secure a Compute Instance](/docs/guides/set-up-and-secure/) guide, including updating your system, setting the timezone, and adding a limited user account. Most display managers do not allow root login by default.

        sudo apt update && sudo apt upgrade

1.  Install your preferred desktop environment. The command below installs Xfce, along with the optional enhancements package and a web browser.

        sudo apt install xfce4 xfce4-goodies dbus-x11 firefox-esr

1.  Install a display manager, which provides a graphical login screen. This allows you to log in as your desired user and with your preferred desktop environment. There are many display managers available, including [LightDM](https://wiki.debian.org/LightDM), [GDM](https://wiki.debian.org/GDM) (Gnome Desktop Manager), [SDDM](https://wiki.debian.org/SDDM), and [Ly](https://github.com/fairyglade/ly). This guide uses LightDM.

        sudo install lightdm

1.  Set your new display manager as the system default. The command below opens up a prompt that allows you to select your preference from all display manager's that are currently installed.

        sudo dpkg-reconfigure lightdm

## Access Glish and the Linux Desktop

1. Log in to the [Cloud Manager](https://cloud.linode.com), click the **Linodes** link in the sidebar, and select your desired Compute Instance from the list.

1. To open the console, click on the **Launch Console** button in the top right corner of the summary page.

    ![Launch the Console](launch-console-button.png)

1.  Log in to the *Weblish* prompt (or use SSH) and start the display manager. The example below is for LightDM.

        sudo systemctl start lightdm

4. Once the display manager has started, select the **Glish** tab.

    ![Screenshot of the Lish Console with the Glish button](switch-to-glish.png)

5. The display manager's login prompt should appear within the Glish tab. If you are using LightDM, it should look similar to the screenshot below. Enter your username and password. Since the root user is likely disabled by default, use a limited user account on your system.

    ![Screenshot of LightDM in Glish](glish-login-lightdm.png)

    If you have multiple desktop environments, you can select between them by using the configuration button in the top left of the screen.

    ![Select the desktop environment within LightDM](glish-login-lightdm-select-desktop.png)

    If your display manager is not working properly, you may still see the tty prompt as shown below. If this is the case, go back to *weblish* and troubleshoot.

    ![Screenshot of tty in Glish](glish-tty1.png)

1. Once you are successfully logged in, your desktop environment should be visible. From here, you can use your mouse and keyboard to control your desktop.

    ![Screenshot of Xfce4 in Glish](glish-xfce-desktop.png)

    {{< note type="alert" respectIndent=false >}}
Glish does not offer copy and paste functionality.
{{< /note >}}
