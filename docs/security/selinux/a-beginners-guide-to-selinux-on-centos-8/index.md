---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides a brief and basic introduction to commonly used commands and practices for SELinux system administration on CentOS 8.'
og_description: 'This guide provides a brief and basic introduction to commonly used commands and practices for SELinux system administration on CentOS 8.'
keywords: ["Security-enhanced Linux", "secure open source", " SELinux", "CentOS8"]
tags: ["centos","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-18
modified_by:
  name: Linode
title: "A Beginner's Guide to SELinux on CentOS 8"
h1_title: "Getting Started with SELinux on CentOS 8"
contributor:
  name: Linode
external_resources:
 - '[Graphical Guide to Policies](https://opensource.com/business/13/11/selinux-policy-guide)'
 - '[SELinux User Resources](https://selinuxproject.org/page/User_Resources)'
 - '[CentOS SELinux Wiki](https://wiki.centos.org/HowTos/SELinux)'
image: 'Getting_Started_with_SELinux_on_CentOS_8_1200x631.png'
---

SELinux is a Mandatory Access Control (MAC) system, developed by the NSA. SELinux was developed as a replacement for Discretionary Access Control (DAC) that ships with most Linux distributions.

The difference between DAC and MAC is *how* users and applications gain access to machines. Traditionally, the command `sudo` gives a user the ability to heighten permissions to root-level. Root access on a DAC system gives the person or program access to all programs and files on a system.

A person with root access should be a trusted party. But if security has been compromised, so too has the system. SELinux and MACs resolve this issue by both confining privileged processes and automating security policy creation.

SELinux defaults to denying anything that is not explicitly allowed. SELinux has two global modes, *permissive* and *enforcing*. Permissive mode allows the system to function like a DAC system, while logging every violation to SELinux. The enforcing mode applies a strict denial of access to anything that isn't explicitly allowed. To explicitly allow certain behavior on a machine, you, as the system administrator, have to write policies that allow it. This guide provides a brief and basic introduction to commonly used commands and practices for SELinux system administration.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.
    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
    {{< /note >}}
1.  Update your system:

        sudo yum update

    {{< note >}}
The Linode kernel does not support SELinux by default. However, all new Linodes running CentOS 8 use the distribution provided kernel, which has **SELinux enabled by default**.

If your system is running a Linode kernel, you will need to change to an upstream kernel in order to use SELinux. See the [How to Change Your Linode's Kernel](/docs/platform/how-to-change-your-linodes-kernel/) for more steps. Once you're kernel is set to the upstream kernel, continue on with the steps in this guide.
    {{</ note >}}

## Install Supporting SELinux Packages

In this section, you will install various SELinux packages that will help you when creating, managing, and analyzing SELinux policies.

1. Verify which SELinux packages are installed on your system:

        sudo rpm -aq | grep selinux

    A newly deployed CentOS 8 Linode should have the following packages installed:

      {{< output >}}
libselinux-2.5-14.1.el7.x86_64
selinux-policy-3.13.1-252.el7_7.6.noarch
selinux-policy-targeted-3.13.1-252.el7_7.6.noarch
libselinux-utils-2.5-14.1.el7.x86_64
libselinux-python-2.5-14.1.el7.x86_64
    {{</ output >}}

1. Install the following packages and their associated dependencies:

        sudo yum install policycoreutils policycoreutils-python setools setools-console setroubleshoot

    - `policycoreuitls` and `policyoreutils-python` contain several management tools to administer your SELinux environment and policies.
    - `setools` provides command line tools for working with SELinux policies. Some of these tools include, `sediff` which you can use to view differences between policies, `seinfo` a tool to view information about the components that make up SELinux policies, and `sesearch` used to search through your SELinux policies. `setools-console` consists of `sediff`, `seinfo`, and `sesearch`. You can issue the `--help` option after any of the listed tools in order to view more information about each one.
    - `setroubleshoot` suite of tools help you determine why a script or file may be blocked by SELinux.

    Optionally, install `setroubleshoot-server` and `mctrans`. The `setroubleshoot-server` allows, among many other things, for email notifications to be sent from the server to notify you of any policy violations. The `mctrans` daemon translates SELinux's output to human readable text.

## SELinux States and Modes

### SELinux States

When SELinux is installed on your system, it can be either *enabled* or *disabled*. By default, the CentOS 8 image provided by Linode has SELinux in an enabled state.

- To disable SELinux, update your SELinux configuration file using the text editor of your choice. Set the `SELINUX` directive to `disabled` as shown in the example.

      {{< file "/etc/selinux/config">}}
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
      {{</ file >}}

      {{< note >}}
You can update the `SELINUX` directive with any of the available SELinux [states](#selinux-states) or [modes](#selinux-modes).
      {{</ note >}}

- Reboot your Linode for the changes to take effect:

        sudo reboot

- Connect to your Linode via SSH (replace `192.0.2.0` with your own [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/)) and verify your SELinux installation's status:

        ssh example_user@192.0.2.0
        sudo sestatus

    Its output should display `disabled`

    {{< output >}}
SELinux status:                 disabled
    {{</ output >}}

### SELinux Modes

When SELinux is enabled, it can run in either *enforcing* or *permissive* modes.

{{< note >}}
If SELinux is currently disabled, update your SELinux configuration file with the `SELINUX` directive set to `enabled`, then reboot your system, and SSH back into your Linode. These steps are outlined in the [SELinux States](#selinux-states) section of the guide.
{{</ note >}}

 - In enforcing mode, SELinux enforces its policies on your system and denies access based on those policies. Use the following command to view SELinux policy modules currently loaded into memory:

        sudo semodule -l

 - Permissive mode does not enforce any of your SELinux policies, instead, it logs any actions that would have been denied to your `/var/log/audit/audit.log` file.

- You can check which mode your system is running by issuing the following command:

        sudo getenforce

- To place SELinux in permissive mode, use the following command:

        sudo setenforce 0

    Permissive mode is useful when configuring your system, because you and your system's components can interact with your files, scripts, and programs without restriction. However, you can use audit logs and system messages to understand what would be restricted in enforcing mode. This will help you better construct the necessary policies for your system's user's and programs.

- Use the `sealert` utility to generate a report from your audit log. The log will include information about what SELinux is preventing and how to allow the action, if desired.

        sudo sealert -a /var/log/audit/audit.log

    The output will resemble the example, however, it varies depending on the programs and configurations on your system. The example was generated using a [Linode running the Apache webserver](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-7/#apache) with a virtual hosts configuration.

    {{< output >}}
SELinux is preventing /usr/sbin/httpd from write access on the directory logs.

*****  Plugin httpd_write_content (92.2 confidence) suggests   ***************

If you want to allow httpd to have write access on the logs directory
Then you need to change the label on 'logs'
Do
# semanage fcontext -a -t httpd_sys_rw_content_t 'logs'
# restorecon -v 'logs'
    {{</ output >}}

- To allow `/usr/sbin/httpd` write access to the directory logs, as shown by the output, you can execute the suggested commands, `semanage fcontext -a -t httpd_sys_rw_content_t 'logs'` and `restorecon -v 'logs'`.

## SELinux Context

SELinux marks every single object on a machine with a *context*. Every file, user, and process has a context. The context is broken into three parts: *user*, *role*, and *type*. An SELinux policy controls which users can get which roles. Each specific role places a constraint on what type of files that user can access. When a user logs in to a system, a role is assigned to the user as seen in the `ls -Z` example, the output `unconfined_u` is a user role.

1. Create a directory in your home folder:

        mkdir ~/example_dir

1. Print the SELinux security context of your home folder's directories and files :

        ls -Z ~/

    The output is similar to:

    {{< output >}}
drwxrwxr-x. example_user example_user unconfined_u:object_r:user_home_t:s0 example_dir
    {{</ output >}}

    The SELinux specific information is contained in the `unconfined_u:object_r:user_home_t:s0` portion, which follows the following syntax: `user:role:type:level`. To learn more about users, roles, and related access control, see the [CentOS SELinux documentation](https://wiki.centos.org/HowTos/SELinux).

## SELinux Boolean

An SELinux Boolean is a variable that can be toggled on and off without needing to reload or recompile an SELinux policy.

1. You can view the list of Boolean variables using the `getsebool -a` command. Pipe the command through `grep` to narrow down your results.

        sudo getsebool -a | grep "httpd_can"

    You will see a similar output:

    {{< output >}}
httpd_can_check_spam --> off
httpd_can_connect_ftp --> off
httpd_can_connect_ldap --> off
httpd_can_connect_mythtv --> off
httpd_can_connect_zabbix --> off
httpd_can_network_connect --> off
httpd_can_network_connect_cobbler --> off
httpd_can_network_connect_db --> off
httpd_can_network_memcache --> off
httpd_can_network_relay --> off
httpd_can_sendmail --> off
    {{</ output >}}

    You can change the value of any variable using the `setsebool` command. If you set the `-P` flag, the setting will persist through reboots. If, for example, you want to allow HTTPD scripts and modules to connect to the network, update the corresponding boolean variable

        sudo setsebool -P httpd_can_network_connect ON

    When viewing a list of your boolean variables, you should now see that it is set to `ON`.

        sudo getsebool -a | grep "httpd_can"

      {{< output >}}
httpd_can_check_spam --> off
httpd_can_connect_ftp --> off
httpd_can_connect_ldap --> off
httpd_can_connect_mythtv --> off
httpd_can_connect_zabbix --> off
httpd_can_network_connect --> on
httpd_can_network_connect_cobbler --> off
httpd_can_network_connect_db --> off
httpd_can_network_memcache --> off
httpd_can_network_relay --> off
httpd_can_sendmail --> off
      {{</ output >}}

### Next Steps

This guide provides a brief and basic introduction to SELinux administration. You can now take a deeper dive into SELinux by consulting some of the resources include in the [More Information](#more-information) section of this guide.
