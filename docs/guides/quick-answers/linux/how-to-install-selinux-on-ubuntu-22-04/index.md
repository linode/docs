---
slug: how-to-install-selinux-on-ubuntu-22-04
description: "By default, Ubuntu 22.04 LTS uses AppArmor for security instead of SELinux. This tutorial shows you how to disable AppArmor and install and SELinux on Ubuntu 22.04. ✓ Click here!"
keywords: ['Selinux ubuntu','SELinux for ubuntu','Install selinux ubuntu','Disable app armor', 'Disable SELinux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-19
modified: 2022-09-23
modified_by:
  name: Linode
title: "Install SELinux on Ubuntu 22.04"
title_meta: "How to Install SELinux on Ubuntu 22.04"
relations:
  platform:
    key: how-to-install-selinux
    keywords:
      - distribution: Ubuntu 22.04
authors: ["Cameron Laird"]
---

According to [the official Security Enhanced Linux project page](http://www.selinuxproject.org/page/Main_Page), SELinux is a security enhancement to Linux. Linux-based security-sensitive projects largely standardize on it. Ubuntu 22.04 is compatible with SELinux and these instructions make it available on your Ubuntu 22.04 host. The steps in this guide appear as command line instructions. Both physical and virtual machines can be configured for SELinux, but it is not possible to enable SELinux in a Docker container without additional steps not covered here.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

2.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## SELinux Installation

SELinux's technical basis is [access control](https://www.linode.com/blog/cloud-computing/mandatory-access-control-in-cloud-computing/), meaning how different users can and cannot read, write, update, remove, or otherwise change different resources, and how administrators manage those differences. Over twenty years ago, [SELinux introduced tools](https://www.oreilly.com/library/view/selinux/0596007167/ch01s04.html) to enhance conventional Linux so these administrative chores are now less complex and more reliable. SELinux is currently implemented as a Mandatory Access Control (MAC) module within the kernel.

A standard modern Ubuntu distribution includes [AppArmor](https://apparmor.net/), a Linux application security system which emphasizes ease-of-use and routine reliability. Both AppArmor and SELinux work through the [Linux Security Module](https://www.kernel.org/doc/html/v4.16/admin-guide/LSM/index.html) (LSM) interface. Since Linux only permits a single LSM to be active, the first step in an SELinux installation is to deactivate AppArmor.

{{< note type="alert" respectIndent=false >}}
SELinux alters parts of Linux profoundly. An error in its installation can easily render an entire host unresponsive. Make backups, be prepared to dispose or recycle a particular instance, and work with care. Start your SELinux experiments in `permissive` mode, and make backups again before any switch to `enforcing` mode. The simplest SELinux installations are somewhat time-consuming, as they affect the entire filesystem. Each reboot takes a while, since SELinux methodically confirms the state of all filesystems and other resources.
{{< /note >}}

### Stop and Remove AppArmor

1.  It's good practice to begin any Linux installation work by ensuring a consistent package state with:

        sudo apt update && sudo apt upgrade -y

2.  Your Ubuntu 22.04 installation probably runs AppArmor by default. To verify its status, request:

        systemctl status apparmor

    There are several lines of output, including "... enabled ... SUCCESS ...".

3.  Press `Q` to close the status info.

    {{< note respectIndent=false >}}A few Ubuntu 22.04 variants for embedded computing do not run AppArmor. Therefore, if you see "... apparmor.service could not be found ..." you can safely skip the next paragraphs and go immediately to the "Install SELinux" section below.{{< /note >}}

4.  In the more common case, where AppArmor is running, stop it:

        sudo systemctl stop apparmor

5.  Now disable AppArmor to prevent it from re-enabling:

        sudo systemctl disable apparmor

It is not necessary, or even desirable, to remove AppArmor. Most administrators leave it installed, but stopped and disabled.

### Install SELinux

1.  Install SELinux:

        sudo apt install policycoreutils selinux-basics selinux-utils -y

2.  Enable SELinux:

        sudo selinux-activate

    Now you see:

    {{< output >}}SELinux is activated. You may need to reboot now.{{< /output >}}

Do not reboot immediately! First, review the current state of your new SELinux host.

### Verification

1.  To confirm the current status of your installation, use the command:

        getenforce

    This shows the one-word response:

    {{< output >}}Disabled{{< /output >}}

This means that your SELinux is ready to work. It's "active” but not yet turned on.

While `getenforce` provides the current state of SELinux, `sestatus` is a different command that provides more details.

2.  When you enter:

        sestatus

    You see:

    {{< output >}}SELinux status:		disabled{{< /output >}}

While this output is similar to `getenforce`, once SELinux is enabled, `sestatus` reports more fully on the configuration, as detailed later.

### Configuration of Permissions to Allow for Reboot

SELinux can be enabled in one of two states: `permissive` or `enforcing`. Your current SELinux installation remains disabled.

{{< note type="alert" respectIndent=false >}}
If you connect to your host via SSH, access will be lost once SELinux is enabled. If you’re using a Linode host, you can still login via the LISH console.
{{< /note >}}

1.  Reboot, and the Ubuntu 22.04 host likely comes up with SELinux "on":

        sudo reboot

    {{< note respectIndent=false >}}The first reboot with SELinux enabled begins a relabelling process that could take a long time, so be patient.{{< /note >}}

2.  Verify this through examination of /etc/selinux/config:

        cat /etc/selinux/config

    It should include the line:

    {{< output >}}SELINUX=permissive{{< /output >}}

The presence of `/etc/selinux/config` is a sign that the host is ready for configuration and the reboot needed to make most configurations effective:
-   Installation creates `/etc/selinux/config`.
-   Configuration updates `/etc/selinux/config`.
-   A reboot puts SELinux into action.

## SELinux Management

[SELinux has several options](/docs/guides/a-beginners-guide-to-selinux-on-centos-7/) beyond the scope of this guide. Configuration is commonly achieved through configuration files rather than graphical user interface (GUI) or command line applications.

### Enabling SELinux

Basic configuration of an SELinux installation starts with the SELINUX attribute in `/etc/selinux/config`.

1.  Open `/etc/selinux/config`:

        sudo nano /etc/selinux/config

2.  Enable SELinux by changing the line:

        SELINUX=permissive

    to

        SELINUX=enforcing

3.  Press **CTRL+X** to exit `nano`.

4.  Press **Y** to confirm.

5.  Press **ENTER** to save.

6.  The next time the host is rebooted, it comes up as an enforcing SELinux instance:

        sudo reboot

7.  Verify this again via /etc/selinux/config:

        cat /etc/selinux/config

    It should include the line:

    {{< output >}}SELINUX=enforcing{{< /output >}}

### SELinux Policies

**/etc/selinux/config** controls how an SELinux instance launches. However, it's possible to adjust the action of SELinux between reboots with `setenforce`.

1.  Temporarily put SELinux in permissive mode with:

        sudo setenforce 0

2.  Check the current status of SELinux with:

        getenforce

    This should now display:

    {{< output >}}Permissive{{< /output >}}

3.  Now check the status of SELinux again using `sestatus`

        sestatus

    You not only see the current SELinux mode, but also the config file (boot) mode, and other information:

    {{< output >}}SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             default
Current mode:                   permissive
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     requested (insecure)
Max kernel policy version:      33{{< /output >}}

4.  Switch SELinux back from `permissive` to `enforcing` mode with:

        sudo setenforce 1

5.  Check the current status of SELinux again:

        getenforce

    This should now display:

    {{< output >}}Enforcing{{< /output >}}

6.  Confirm the status again using `sestatus`

        sestatus

    You can see that `setenforce` only changes the current mode:

    {{< output >}}SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             default
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     requested (insecure)
Max kernel policy version:      33{{< /output >}}

Other possible values for `getenforce` output are `Permissive` and `Disabled`. These values are capitalized, unlike the values permitted within `/etc/selinux/config`.

### How to disable SELinux

There are two distinct ways to disable SELinux:

-   Have SELinux immediately stop its enforcement of resource permissions, and continue in the same way until its next reboot, at which point SELinux returns to enforcement.
-   Stop SELinux enforcement permanently, so that SELinux is not in effect after each boot operation.

It's common to speak of SELinux’s permissive operation as "disabled". This first of the two descriptions may be confusing, because, although SELinux is disabled, and users can't see its action, it remains active. When SELinux runs as Permissive, it logs access violations, but doesn't enforce them. When SELinux is enabled as enforcing, the only effective way to disable it fully so that it doesn't log its observations or otherwise act in the background, requires updates of `/etc/selinux/config` and `sudo reboot`.

## Conclusion

Fewer than a couple dozen commands are required to install, enable, and activate SELinux on Ubuntu 22.04. You can quickly have an enforcing SELinux, but refer to other references for details on how to configure your SELinux to achieve specific useful requirements.