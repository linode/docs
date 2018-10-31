---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Determine which kernel version your Linode is running and update it to the latest available.'
keywords: ['kernel','upgrade']
aliases: ['platform/manager/how-to-change-your-linodes-kernel/','platform/update-kernel/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-16
modified: 2018-10-31
modified_by:
  name: Linode
title: "All About Your Linode's Kernel"
contributor:
  name: Linode
promo: no
---

## Which Kernel Am I Running?

Your Linode is capable of running one of three kinds of kernels:

-   An upstream kernel that is maintained and provided by your Linux distribution's authors (this is also referred to as the distribution-supplied kernel). The upstream kernel may support features not present in the Linode kernel (for example, [SELinux](/docs/security/getting-started-with-selinux/)). The upstream kernel is easily installed and updated from your distribution's package management system.

-   The Linode kernel. Linode's engineering team monitors for new versions of the Linux kernel and then packages them for users shortly after they are available. These kernels are not installed on your filesystem--instead, the Linode Manager supplies them to your system when it boots.

    The Linode kernel is quick to update and does not require you to enter any terminal commands: if you're using the Linode kernel marked as *latest*, then you just need to reboot in order to update it.

-   A kernel that you compile from source. Compiling a kernel can let you use features not available in the upstream or Linode kernels, but it takes longer to compile the kernel from source than to download it from your package manager.

To find out which kernel you're using, [SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) into your Linode and run:

    uname -r

If your output contains `linode` in the version tag, then you are running the Linode kernel:

{{< output >}}
4.14.12-x86_64-linode92
{{</ output >}}

If your output contains `generic` in the version tag, then you are probably running a distribution-supplied kernel:

{{< output >}}
44.15.0-29-generic
{{</ output >}}

## How to Change Kernels

1.  Shut down your Linode from the Linode Manager.

1.  Click **Edit** to view a distribution's configuration profile options:

    ![Edit the configuration profile](edit_config_profile_small.png "Edit the configuration profile")

1.  Observe the **Kernel** dropdown menu under **Boot Settings**. Depending on your distribution, this will be set to either `GRUB 2` or `Latest 64 bit (<kernel version>-x86_64-linode<linode kernel release number>)`.

    ![Selecting the GRUB 2 kernel option](boot-settings-kernel-grub2.png "Selecting the GRUB 2 kernel option")

1.  To use Linode's kernel, select `Latest 64 bit (<kernel version>-x86_64-linode)` from the Kernel menu. To change to the upstream kernel, or to use a kernel you've compiled from source, select `GRUB 2`. For more information on custom compiled kernels, review our guides for [Debian, Ubuntu,](/docs/tools-reference/custom-kernels-distros/custom-compiled-kernel-debian-ubuntu/) and [CentOS](/docs/tools-reference/custom-kernels-distros/custom-compiled-kernel-centos-7/).

    ![Our latest 64 bit kernel](boot-settings-kernel-latest.png "Our latest 64 bit kernel")

1.  Click **Save Changes** at the bottom of the page and reboot into the new kernel.

1.  Once booted, you can verify the kernel information with `uname`:

        [root@archlinux ~]# uname -r
        4.15.14-1-ARCH

    You can switch back to your previous kernel setting at any time by repeating the steps above for the kernel of your choice.

{{< note >}}
CentOS 7 and Fedora ship with [SELinux](/docs/security/getting-started-with-selinux/) running in enforcing mode by default. When switching from the Linode kernel to the upstream kernel, SELinux may need to relabel your filesystem at boot. When the relabeling completes, the Linode will shut down. If you have [Lassie](/docs/uptime/monitoring-and-maintaining-your-server/#configure-shutdown-watchdog) enabled, the Linode Manager will automatically boot your Linode again following the shut down. If you do not have Lassie enabled, you will need to manually reboot from the Linode Manager.

![SELinux filesystem relabel](selinux-filesystem-relabel.png "SELinux filesystem relabel")

You can trigger the relabel process by creating an empty `/.autorelabel` file and then rebooting:

    touch /.autorelabel
{{< /note >}}

## Update the Upstream Kernel

If you boot your Linode using the GRUB2 or Direct Disk boot setting, your kernel is supplied by your distribution’s maintainers, not Linode. If you’ve compiled your own kernel, download a new set of kernel sources and recompile.

Update your kernel to the latest available version using the distribution’s package manager:

**CentOS**

    sudo yum update kernel

**Debian**

    sudo apt-get update
    sudo apt-get upgrade linux-base

**Ubuntu**

    sudo apt-get update
    sudo apt-get upgrade linux-image-generic

Reboot the Linode. When it comes back up, use the command `uname -r` to verify which version you are running. It's recommend that you compare your new kernel version against the patched version given in your distribution’s security bulletin: [CentOS](https://access.redhat.com/errata/#/?q=rhsa-2018&p=1&sort=portal_publication_date%20desc&rows=10); [Debian](https://security-tracker.debian.org/tracker/); [Ubuntu](https://people.canonical.com/~ubuntu-security/cve/).

## Update the Linode Kernel

1.  Log in to the Linode Manager.

1.  Navigate to the Linode's Dashboard and edit the configuration profile.

1.  Under **Boot Settings**, select **Latest 64 Bit** and click **Save Changes**.

1.  Reboot your Linode and verify the kernel version:

        uname -r

    {{< output >}}
4.17.15-x86_64-linode115
{{< /output >}}

<!-- ### Update Your Linode Kernel with Linode's Cloud Manager

1.  Select the Linode from the *Dashboard*

1.  Click the **Settings** tab and expand the **Advanced Configurations** section.

1.  Click **Add Linode Configuration**, add a label, and scroll to the *Boot Settings* section.

1.  Select **Latest 64 bit (4.17.15-x86_64-linode115)** from the *Kernel* dropdown.

1.  Configure Block Device Assignments as needed and click **Submit** to save the changes.

1.  Reboot the Linode to boot into the new kernel. -->


<!-- ### Update Your Kernel with the Linode API

[Visit the API docs](https://developers.linode.com/api/v4#operation/getLinodeConfig) for more information.

To update your kernel to the latest version through the API, use the Linode’s `{linodeId}` and `{configId}`.

1.  Retrieve the Linode’s information:

        curl -H "Authorization: Bearer $TOKEN" https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

1.  Change the kernel to `linode/latest-64bit`:

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "kernel": "linode/latest-64bit"}' https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

1.  Confirm the change using the command in Step 1.

-->


## Install the Upstream Kernel

If your system does not boot when set to GRUB2 and instead shows a GRUB command line prompt in Lish like shown below, then you need to install the kernel and configure GRUB. **This should only be necessary on Linodes which were created before February 2017.** If this is the case, switch back to the Linode kernel in your configuration profile, reboot your Linode, and then follow the instructions below for installing the kernel.

![GRUB prompt](grub-prompt.png "GRUB prompt")

1.  Update your package management system:

    **Arch Linux**

        sudo pacman -Syu

    **CentOS**

        sudo yum update

    **Debian/Ubuntu**

        sudo apt update

    **Gentoo**

        sudo emerge -avDuN world

1.  Install the Linux kernel and GRUB 2. Choose `/dev/sda` if you're asked which disk to install to during installation. Linode provides the GRUB bootloader, so your system only needs to provide a `grub.cfg` file.

    **Arch Linux**

        sudo pacman -S linux grub

    **CentOS**

        sudo yum install kernel grub2

    **Debian**

        sudo apt-get install linux-image-amd64 grub2

    **Gentoo**

    There are two main ways to install Gentoo's kernel: Manual configuration and using the `genkernel` tool. Which you use and how you configure the kernel will depend on your preferences, so see the [Gentoo Handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Installation/Kernel) for instructions.

    **Ubuntu**

        sudo apt install linux-image-generic grub2

When the installation finishes, you'll see the kernel and other components in the `/boot` directory. For example:

{{< output >}}
[root@archlinux ~]# ls /boot
grub  initramfs-linux-fallback.img  initramfs-linux.img  vmlinuz-linux
{{< /output >}}

### Configure GRUB

After the kernel is installed, you'll need to configure the serial console and other GRUB settings so you can use [Lish](/docs/platform/manager/using-the-linode-shell-lish/) and [Glish](/docs/platform/manager/using-the-linode-graphical-shell-glish/).

1.  Open `/etc/default/grub` in a text editor and go to the line beginning with `GRUB_CMDLINE_LINUX`. Remove the word `quiet` if present, and add `console=ttyS0,19200n8 net.ifnames=0`. Leave the other entries in the line. For example, on CentOS 7 you should have something similar to:

        GRUB_CMDLINE_LINUX="crashkernel=auto rhgb console=ttyS0,19200n8 net.ifnames=0"

1.  Add or change the options in `/etc/default/grub` to match the following snippet. There will be other variables in this file, but the current changes are only focused on these lines.

    {{< file "/etc/default/grub" >}}
GRUB_TERMINAL=serial
GRUB_DISABLE_OS_PROBER=true
GRUB_SERIAL_COMMAND="serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1"
GRUB_DISABLE_LINUX_UUID=true
GRUB_GFXPAYLOAD_LINUX=text

{{< /file >}}


1.  Prepare and update the bootloader:

    **Arch and Gentoo**

        sudo grub-mkconfig -o /boot/grub/grub.cfg

    **CentOS**

    The `.autorelabel` file is necessary to queue the SELinux filesystem relabeling process when rebooting from the Linode kernel to the CentOS kernel.

        sudo mkdir /boot/grub
        sudo ln -s /boot/grub2/grub.cfg /boot/grub/grub.cfg
        sudo grub2-mkconfig -o /boot/grub/grub.cfg
        sudo touch /.autorelabel

    **Debian and Ubuntu**

        sudo update-grub
