---
slug: using-the-linode-graphical-shell-glish
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Use the graphic shell, Glish, to Manage Graphic Environments on Your Linode.'
keywords: ["Console", "Shell", "glish", "graphic"]
aliases: ['/platform/manager/using-the-linode-graphical-shell-glish-classic-manager/','/networking/using-the-graphic-shell-glish/','/networking/using-the-linode-graphical-shell-glish/','/platform/manager/using-the-linode-graphical-shell-glish/','/platform/using-the-linode-graphical-shell-glish/','/networking/use-the-graphic-shell-glish/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-03-09
modified_by:
  name: Linode
published: 2015-08-28
title: 'Using the Linode Graphical Shell (Glish)'
tags: ["linode platform","cloud manager"]
---

![Using the Linode Graphical Shell Glish](using-linode-glish-title.jpg "Using the Linode Graphical Shell Glish title graphic")

Glish is the graphical version of the [Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/) (Lish). It allows you to use a graphic environment running natively on your Linode's operating system.

{{< note >}}
Linode base distribution images do not have graphic environments installed. You will need to install one, or use a [Custom Distro](/docs/tools-reference/custom-kernels-distros/custom-distro-on-kvm-linode/) with a graphic environment pre-installed.

Glish is only available on KVM Linodes.
{{< /note >}}

## Enable Glish on a Linode-Supplied Image

Ensure that your Linode is booted with the latest Linode kernel, which has mouse drivers enabled. You may need to reboot to access the latest kernel version.

When using one of Linode's distribution templates with Distro Helper turned on, Glish accesses the `tty1` console over the virtual VGA device. If you aren't using Distro Helper, or haven't rebooted since Glish was released, manually launch a getty on `tty1`:

    exec /sbin/getty -8 38400 tty1 &

{{< note >}}
The process for launching a getty may differ depending on your distribution.
{{< /note >}}

## Access Glish

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).
2. Click on the Linodes link in the sidebar and select the desired Linode.
3. Click on the **Launch Console** link in the top right-hand corner of the Manager.

    ![Launch the Lish Console](launch-console.png)

4. The Lish Web Console window appears with your Linode's console, as shown below.

    ![An example of the Lish Web Console](lish-console.png)

5. Select the **Glish** tab.

    ![An example of the Gish Web Console](glish-console.png)

1.  Update and upgrade the Linux distribution’s packages. For this Debian example Linode, the command is:

        sudo apt-get update && sudo apt-get upgrade

6.  You will need to install a desktop environment. On our Debian example Linode, we're using Xfce4:

        sudo apt-get install xfce4

7.  After installation, launch your desktop environment from the Glish console:

        sudo startxfce4

    [![Glish at the Xfce4 desktop.](glish-xfce4-desktop_small.png)](glish-xfce4-desktop.png)
