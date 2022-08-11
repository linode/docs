---
slug: how-to-install-selinux-on-debian-10
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to install SELinux and use it to protect the security of your Debian 10 system"
keywords: ["linux", "selinux", "apparmor", "Mandatory Access Control system"]
aliases: ['/quick-answers/linux/how-to-install-selinux-on-debian-10/']
bundles: ['debian-security']
tags: ["debian","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2020-03-17
image: InstallSELinux_Deb10.png
contributor:
  name: Linode
title: "How to Install SELinux on Debian 10"
h1_title: "Installing SELinux on Debian 10"
enable_h1: true
relations:
    platform:
        key: how-to-install-selinux
        keywords:
            - distribution: Debian 10
---

Ubuntu has a Mandatory Access Control (MAC) system similar to [SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux), named [AppArmor](https://wiki.ubuntu.com/AppArmor). Both SELinux and AppArmor provide a set of tools to isolate applications from each other to protect the host system from being compromised. AppArmor offers Ubuntu users mandatory access control options, without the perceived difficulty or learning curve that SELinux may have. However, if you are switching to Debian 10, are already familiar with SELinux, and would like to use it to enforce security on your system, you can install it by following the steps in this guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.
    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
    {{< /note >}}

1.  Update your system:

        sudo apt update

    {{< note >}}
The Linode kernel does not support SELinux by default. If your system is running a Linode kernel, you will need to change to an upstream kernel in order to use SELinux. See the [How to Change Your Linode's Kernel](/docs/guides/managing-the-kernel-on-a-linode/) for more steps. Once you're kernel is set to the upstream kernel, continue on with the steps in this guide.
    {{</ note >}}

### Remove AppArmor

1.  Stop AppArmor using systemctl:

        sudo systemctl stop apparmor

1.  Purge AppArmor from the system.

    {{< caution >}}
Do not purge AppArmor if you believe you may reuse it in the future.  If you would like to preserve your AppArmor configuration files, use the `remove` command, instead:

    sudo apt remove apparmor
    {{< /caution >}}

        sudo apt purge apparmor

    {{< note >}}
If after issuing the `purge  command you receive warnings about remaining AppArmor files or directories. You can remove them manually, if desired. This step is not necessary to get a working SELinux installation.
    {{</ note >}}

1.  Update your system:

        sudo apt update && sudo apt upgrade -yuf

1. Reboot your Linode

        sudo reboot

### Install SELinux

1.  Install the SELinux package along with supporting packages to help you manage your installation.

        sudo apt-get install selinux-basics selinux-policy-default auditd

1. Activate your SELinux installation:

        sudo selinux-activate

    Your output should resemble the following:

    {{< output >}}
Activating SE Linux
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-4.19.0-8-amd64
Found initrd image: /boot/initrd.img-4.19.0-8-amd64
done
SE Linux is activated.  You may need to reboot now.
    {{</ output >}}

1. Reboot your Linode for the installation to complete:

        sudo reboot

    {{< note >}}
After rebooting your system, SELinux should be enabled, but in *permissive mode*. Permissive mode means any actions that would have been disallowed are allowed, but logged in your system's audit log located in the `/var/log/audit/audit.log` file.
   {{</ note >}}

1. Log back into your Linode via SSH. Replace `192.0.2.0` with your own Linode's IP address.

        ssh username@192.0.2.0

1. Verify the status of your SELinux installation:

        sudo sestatus

    You should see a similar output:

    {{< output >}}
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             default
Current mode:                   permissive
Mode from config file:          permissive
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     requested (insecure)
Max kernel policy version:      31
    {{</ output >}}

1. To put SELinux into *enforcing mode*, use the `setenforce` command. When in enforcing mode, any actions not permitted by your system's are blocked and the corresponding event is logged in the audit log.

        sudo setenforce 1

1.  To maintain `enforcing` mode after reboot, modify the SELinux configuration file in `/etc/selinux/config` from the default `SELINUX=permissive` to `SELINUX=enforcing`:

    {{< file "/etc/selinux/config" >}}
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
# enforcing - SELinux security policy is enforced.
# permissive - SELinux prints warnings instead of enforcing.
# disabled - No SELinux policy is loaded.
SELINUX=enforcing
    {{< /file >}}

    {{< note >}}
If you have set SELinux to enforcing mode, ensure that your SSH port has access before logging out of your session.

    sudo semanage port -l | grep 'ssh'

You should see a similar output if TCP is allowed on port 22.

{{< output >}}
ssh_port_t                     tcp      22
{{</ output >}}

If you do not see the this entry, open the port with the following command:

    sudo semanage port -a -t ssh_port_t -p tcp 22
    {{</ note >}}

## Next Steps
After installing SELinux on your system, use our [Getting Started with SELinux Guide](/docs/guides/a-beginners-guide-to-selinux-on-centos-7/) to learn the basics of SELinux security.
