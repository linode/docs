---
slug: how-to-install-selinux-on-ubuntu-18-04
author:
  name: Angel
  email: docs@linode.com
description: 'This guide shows you how to install SELinux on Ubuntu 18.04, enable SELinux policies, and disable SELinux.'
keywords: ["linux", "selinux", "apparmor", "Mandatory Access Control system"]
aliases: ['/quick-answers/linux/install-selinux-on-ubuntu/','/quick-answers/linux/how-to-install-selinux-on-ubuntu-18-04/']
tags: ["ubuntu","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-15
modified_by:
  name: Linode
published: 2017-06-30
title: How to Install SELinux on Ubuntu 18.04
h1_title: Installing SELinux on Ubuntu 18.04
relations:
    platform:
        key: how-to-install-selinux
        keywords:
            - distribution: Ubuntu 18.04
---

![How to Install SELinux on Ubuntu](selinux-ubuntu-title.jpg "How to Install SELinux on Ubuntu title graphic")

Ubuntu has a Mandatory Access Control (MAC) system similar to [SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux), named [AppArmor](https://wiki.ubuntu.com/AppArmor). Both SELinux and AppArmor provide a set of tools to isolate applications from each other to protect the host system from being compromised. AppArmor offers Ubuntu users mandatory access control options, without the perceived difficulty or learning curve that SELinux may have. However, if you are switching to Ubuntu 18.04, are already familiar with SELinux, and would like to use it to enforce security on your system, you can install it by following the steps in this guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.
    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
    {{< /note >}}

1.  Update the system:

        sudo apt update

    {{< note >}}
The Linode kernel does not support SELinux by default. If the system is running a Linode kernel, you need to change to an upstream kernel in order to use SELinux. See the [How to Change Your Linode's Kernel](/docs/guides/managing-the-kernel-on-a-linode/) for more steps. Once the kernel is set to the upstream kernel, continue with the steps in this guide.
    {{</ note >}}
1. Install [MySQL/MariaDB on Ubuntu](/docs/guides/install-mysql-on-ubuntu-14-04)

### Remove AppArmor

1.  Stop AppArmor using systemctl:

        sudo systemctl stop apparmor

1.  Purge AppArmor from the system:

    {{< caution >}}
Do not purge AppArmor if you believe you may reuse it in the future.  If you would like to preserve the AppArmor configuration files, use the `remove` command, instead:

    sudo apt remove apparmor
    {{< /caution >}}

        sudo apt purge apparmor

1.  Update the system:

        sudo apt update && sudo apt upgrade -yuf

1. Reboot the Linode:

        sudo reboot

### Install SELinux

1.  Install the SELinux package along with supporting packages to manage the installation.

        sudo apt install selinux selinux-utils selinux-basics auditd audispd-plugins

    {{< note >}}
During the installation, the system prompts you to reboot the system for the changes to take effect. Select **Yes** to continue.
{{< /note >}}

1. Verify the status of SELinux installation. The status of SELinux installation should be `disabled`.

        sudo sestatus

1. Reboot the Linode for the installation to complete:

        sudo reboot

    {{< note >}}
After rebooting the system, SELinux should be enabled, but in *permissive mode*. Permissive mode means any actions that would have been disallowed are allowed, but logged in the audit log file located in the `/var/log/audit/audit.log`.
   {{</ note >}}

1. Log back into the Linode via SSH. Replace `192.0.2.0` with the IP address of the Linode.

        ssh username@192.0.2.0

1. Verify the status of the SELinux installation:

        sudo sestatus

    An output similar to the following appears:

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

1. To put SELinux into *enforcing mode*, use the `setenforce` command. When in enforcing mode, any actions not permitted by the system are blocked and the corresponding event is logged in the audit log file.

        sudo setenforce 1

1.  To maintain `enforcing` mode after reboot, edit the SELinux configuration file located in `/etc/selinux/config` from the default `SELINUX=permissive` to `SELINUX=enforcing`.

    {{< file "/etc/selinux/config" >}}
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
# enforcing - SELinux security policy is enforced.
# permissive - SELinux prints warnings instead of enforcing.
# disabled - No SELinux policy is loaded.
SELINUX=enforcing
    {{< /file >}}

    {{< note >}}
If you have set SELinux to enforcing mode, ensure that the SSH port has access before logging out of the current session.

    sudo semanage port -l | grep 'ssh'

An output similar to the following appears, if TCP is allowed on port 22:

{{< output >}}
ssh_port_t                     tcp      22
{{</ output >}}

If you do not see the this entry, open the port with the following command:

    sudo semanage port -a -t ssh_port_t -p tcp 22
    {{</ note >}}

## Enabling Policies SELinux Policies On Ubuntu 18.04

SELinux comes with a set of pre-built policies to handle requests that drive security. These policies determine if any request should be allowed to be processed.

For example, to enable a policy that allows MySQL requests through SELinux. MySQL’s documentation recommends that you disable SELinux to handle such requests, but there are other and better options.


### Enabling SELinux Policy for MySQL Requests

**Using permissive mode**:

Set `setenforce` to 0, now SELinx allows everything but also logs it.

    setenforce 0

Now, when you either reboot or set `setenforce` to 1 again, SELinux permissions return to old policies.

But this isn’t helpful if you wish to work frequently as you have to adjust `setenforce` every time you want to allow mysqld process.

**Building a local SELinux policy to Enable MySQL Process**

To enable SELinux policy locally for mysqld process, you can execute the following command:

    grep httpd /var/log/audit/audit.log | audit2allow -M mysqlpol

    semodule -i mysqlpol.pp

You have now enabled a local SELinux policy by using a mysqlpol.pp.

You can also make this permanent or global by using setsebool command. To make this globally permanent, run the following command:

    setsebool -P httpd_can_network_connect_db 1

**Enabling SELinux policy to write to a file or folder**

In this example, you can enable the SELinux policy to gain write access to `/home/linode/file1`.

Also check the policy booleans on `file1` before moving forward. To do so, run the following command:

    sestatus -b

An output similar to the following appears:
{{< output >}}

    Policy booleans:

    abrt_anon_write                             off

    abrt_handle_event                           off

    allow_console_login                         on

    allow_cvs_read_shadow                       off

    allow_daemons_dump_core                     on

    allow_daemons_use_tcp_wrapper               off

    allow_daemons_use_tty                       on

    allow_domain_fd_use                         on

    allow_execheap                              off

    allow_execmem                               on

    allow_execmod                               on

    allow_execstack                             on

    allow_ftpd_anon_write                       off

    allow_ftpd_full_access                      off

…
{{</ output >}}

The result is truncated as it is too long. But, after inspecting the booleans, none of these booleans can allow httpd access to `file1`. The solution here is to provide a context of `httpd_sys_rw_content_t` to the directory structure. Or, you can also give `public_content_rw_t` context to the directory structure with `allow_httpd_anon_write` enabled.

**SELinux in enforcing mode and allowing daemons to access files at non-default locations**

Here's another SELinux policy example to understand various permissions at a deeper level. In this case, you want to enable SELinux to permit daemons to access files that are in a non-default location. When you run a daemon in a permissive mode, you can access these files but with policy enforced, you won’t be able to access the same files and see AVC denial messages instead.

The goal here is to be able to configure SELinux policy in enforcing mode to still allow daemons to access files in those locations.

To do so, run the following command:

    semanage fcontext -l /daemon_old_path/

Now, check the default context of SELinux in the directory, and find the default context of the target daemon’s folder. This allows you to configure SELinux contexts and move your context too.

Here is an example where the context is `allow_daemons_use_tty`

    # semanage fcontext -l

    ...

    /var/www(/.*)? all files system_u:object_r:allow_daemons_use_tty:s0

Now apply these contexts using the following command:

    semanage fcontext -a -t allow_daemons_use_tty '/newcontextpath(/.*)?'

Now that you have applied contexts to the new path above, you can enforce everything in this path to get that context by:

    restorecon -RFvv /newcontextpath

To check the status run the following command:

    ls -Zd /newcontextpath

After making these changes, you have to re-index man db by executing the following command:

    mandb

To finish this, run man -k selinux to list all SELinux man pages.

The daemon can now access the files placed in a non-default location.


### How To Disable SELinux on Ubuntu

Disabling SELinux on Ubuntu is very straightforward, and you can decide if you wish to temporarily turn off or permanently turn it off. When you disable SELinux temporarily, it temporarily turns off all SELinux policies, but once the system restarts SELinux policies are in place again.

**Disabling SELinux Policies on Ubuntu temporarily**

To disable all SELinux policies on Ubuntu temporarily, run the following command:

    setenforce 0

**Permanently Disable SELinux policies on Ubuntu**

If you wish to permanently disable SELinux even when the system reboots, make changes to the `/etc/selinux/config` file and set SELINUX to disabled. Change the SELinux line as shown below:

    SELINX=disbaled

And, now if you restart the system, SELinux and its policies won’t be in place anymore.

## Next Steps
After installing SELinux on the system, use the [Getting Started with SELinux Guide](/docs/guides/a-beginners-guide-to-selinux-on-centos-7/) to learn the basics of SELinux security.
