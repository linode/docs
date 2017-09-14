---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'Security-Enhanced Linux works to filter system access. On occasion, recently installed apps run poorly on SELinux. This Quick Answer will show you how to disable SELinux when you need to.'
keywords: 'terminal, selinux, disable selinux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, June 22, 2017'
modified: 'Tuesday, July 17, 2017'
modified_by: 
  name: Linode
title: 'Disable SELinux' 
external_resources:
- '[SELinux Red Hat Wiki](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Enabling_and_Disabling_SELinux-Disabling_SELinux.html)'
- '[SELinux Arch Wiki](https://wiki.archlinux.org/index.php/SELinux)'
- '[SELinux CentOS Docs](https://www.centos.org/docs/5/html/5.1/Deployment_Guide/sec-sel-enable-disable.html)'
---

## Security Enhanced Linux

SELinux can disupt the functionality of a recently installed application and may need to be disabled. This Quick Answer guides you through the steps necessary to disable it. 

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

To disable SELinux on your Linode follow along with this video and the steps below:

<iframe src="https://fast.wistia.net/embed/iframe/1xsx0kx783" title="Wistia video player" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="752.5" height="422.5"></iframe>
<script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>

1. Navigate to the SELinux configuration directory at `/etc/sysconfig/selinux`:

        cd /etc/sysconfig/selinux
        

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
