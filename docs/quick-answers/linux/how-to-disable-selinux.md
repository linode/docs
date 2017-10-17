---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'This Quick Answer will show you how to enable or disable SELinux role based access control.'
keywords: 'selinux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, June 22, 2017'
modified: 'Tuesday, July 17, 2017'
modified_by: 
  name: Linode
title: 'Enable or Disable SELinux' 
external_resources:
- '[SELinux Red Hat Wiki](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Enabling_and_Disabling_SELinux-Disabling_SELinux.html)'
- '[SELinux Arch Wiki](https://wiki.archlinux.org/index.php/SELinux)'
- '[SELinux CentOS Docs](https://www.centos.org/docs/5/html/5.1/Deployment_Guide/sec-sel-enable-disable.html)'
---

[SELinux](https://selinuxproject.org/page/Main_Page) ships in CentOS and Fedora by default, and is set to *Permissive* mode on all new deployments. You will want to change this to *Enforcing* mode to enable [role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control) enforced by the SELinux policies packaged with these distributions.



To view the current enforcing mode:

    [root@centos7 ~]$ getenforce
    Permissive

To change from Permissive mode to Enforcing mode:

    sudo setenforce Enforcing

Queue SELinux to relabel the filesystem and reboot.

    touch /.autorelabel; reboot

When your Linode boots back up, log in and you'll see that SELinux is now in Enforcing mode:

    [root@li73-122 ~]# getenforce
    Enforcing

    [root@li73-122 ~]# sestatus
    SELinux status:                 enabled
    SELinuxfs mount:                /sys/fs/selinux
    SELinux root directory:         /etc/selinux
    Loaded policy name:             targeted
    Current mode:                   enforcing
    Mode from config file:          enforcing
    Policy MLS status:              enabled
    Policy deny_unknown status:     allowed
    Max kernel policy version:      28

For more information, see [RedHat's SELinux documentation](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Working_with_SELinux-Changing_SELinux_Modes.html)

{: .note}
>
>This guide requires an unconfined root account. You will only be able to disable SELinux if you have the highest level of permissions on your machine.

## Disable SELinux

{: .caution}
> Disabling SELinux removes a security feature on your system, and doing so may expose your data.
> If you are considering disabling SELinux to fix an application on your system, consider fixing the application to work within SELinux instead.
>
> **We do not recommend disabling SELinux.**
>
> However, in certain instances it might be easier to disable SELinux than it is to write policies that support SELinux in your environment. Proceed at your own risk.


1. Navigate to the SELinux configuration directory at `/etc/selinux/config`:

        cd /etc/selinux/config
        

    {:.file-excerpt}
    /etc/sysconfig/selinux
    : ~~~ config
      # This file controls the state of SELinux on the system.
      # SELINUX= can take one of these three values:
      #     enforcing - SELinux security policy is enforced.
      #     permissive - SELinux prints warnings instead of enforcing.
      #     disabled - No SELinux policy is loaded.
      SELINUX=enabled
      # SELINUXTYPE= can take one of three two values:
      #     targeted - Targeted processes are protected,
      #     minimum - Modification of targeted policy. Only selected processes are protected.
      #     mls - Multi Level Security protection.
      SELINUXTYPE=targeted
      ~~~

2. Change `SELINUX=enabled` to `SELINUX=disabled`:

    {:.file-excerpt}
    /etc/sysconfig/selinux
    : ~~~selinux
      # This file controls the state of SELinux on the system.
      # SELINUX= can take one of these three values:
      #     enforcing - SELinux security policy is enforced.
      #     permissive - SELinux prints warnings instead of enforcing.
      #     disabled - No SELinux policy is loaded.
      SELINUX=disabled
      # SELINUXTYPE= can take one of three two values:
      #     targeted - Targeted processes are protected,
      #     minimum - Modification of targeted policy. Only selected processes are protected.
      #     mls - Multi Level Security protection.
      SELINUXTYPE=targeted
      ~~~

3. `reboot` your system and run `sestatus`:

		root@host: sestatus
		SELinux status:                 disabled
