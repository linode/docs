---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'Security-Enhanced Linux works to filter system access. This Quick Answer will show you how to change the level of policy enforcement SELinux, from full enforcing mode to totally disabled.'
keywords: ["selinux"]
aliases: ['quick-answers/linux/how-to-disable-selinux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-06-22
modified: 2017-10-18
modified_by:
  name: Linode
title: 'How to Change SELinux Modes'
external_resources:
- '[Security Enhanced Linux User Guide, Red Hat](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/index.html)'
- '[SELinux, CentOS Wiki](https://wiki.centos.org/HowTos/SELinux)'
---

[Security Enhanced Linux](https://selinuxproject.org/page/Main_Page) is a Linux security module for [mandatory](https://en.wikipedia.org/wiki/Mandatory_access_control) or [role-baed](https://wiki.centos.org/HowTos/SELinux#head-91a597b2b6f140484d62d59a0b9a1dfea4dffc50) access control. SELinux is packaged with CentOS and Fedora by default, and can be running in one of three [modes](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security-Enhanced_Linux/sect-Security-Enhanced_Linux-Introduction-SELinux_Modes.html): *disabled*, *permissive* or *enforcing*.

Ideally, you want to keep SELinux in enforcing mode, but there may be times when you need to set it to permissive mode, or disable it altogether. Note that the *disabled* state means the daemon is still running and is still enforcing rules for [discretionary access control](https://en.wikipedia.org/wiki/Discretionary_access_control), however no MAC security policies are being used, and no violations are being logged.

{{< note >}}
To use SELinux on CentOS or Fedora, you must use the upstream kernel--you can not use the Linode kernel. If you need help booting the distribution-supplied kernel, [see our guide](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel#recommended-distributions) on the topic.
{{< /note >}}

1.  View the current enforcement mode of SELinux on your system using `sestatus`. You can see below that SELinux is set to permissive mode.

        [root@centos ~]# sestatus
        SELinux status:                 enabled
        SELinuxfs mount:                /sys/fs/selinux
        SELinux root directory:         /etc/selinux
        Loaded policy name:             targeted
        Current mode:                   permissive
        Mode from config file:          permissive
        Policy MLS status:              enabled
        Policy deny_unknown status:     allowed
        Max kernel policy version:      28

2.  Change to enforcing mode using `setenforce`. This will be for the current runtime session only. You'll need to edit the SELinux configuration file if you want the setting to survive a reboot.

        setenforce 0    # Set to permissive mode.
        setenforce 1    # Set to enforcing mode.

3.  Edit the SELinux configuration file so your mode change will survive reboots. The `sed` command below is given as an example, and will switch from permissive to enforcing mode. For a different mode configuration, just substitute the two words in the command with the mode you currently have, and the one you want to enable (ex. disabled to permissive).

        sed -i 's/SELINUX=permissive/SELINUX=enforcing/g' /etc/selinux/config

    If you prefer to edit the file manually, it should look like this:

    {{< file "/etc/selinux/config" aconf >}}
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=enforcing
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted

{{< /file >}}


4.  Reboot your Linode. During the bootup process, SELinux may need to run a relabeling of the filesystem. It will handle this automatically and when it's done, it'll reboot the system. If you do not have Lassie enabled, the Linode will shut down and you will need to manually reboot in the Linode Manager.

    ![SELinux filesystem relabel](/docs/assets/selinux-filesystem-relabel.png "SELinux filesystem relabel")

5.  When your Linode boots back up, log in and verify that SELinux is now running in the new enforcement mode. Run `sestatus` again. The output should show that you're in the mode you set in steps 2 and 3 above.

        [root@centos ~]# sestatus
        SELinux status:                 enabled
        SELinuxfs mount:                /sys/fs/selinux
        SELinux root directory:         /etc/selinux
        Loaded policy name:             targeted
        Current mode:                   enforcing
        Mode from config file:          enforcing
        Policy MLS status:              enabled
        Policy deny_unknown status:     allowed
        Max kernel policy version:      28
