---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'This guide will walk you through the basics of installing and running SELinux.'
keywords: ["Security-enhanced Linux", " secure open source", " firewall", " SELinux", " getting-started"]
license: '[CC BY-ND 4.0](https://creativecommons.org/license/by-nd/4.0)'
alias:
modified: 2017-07-21
modified_by:
  name: Angel Guarisma
published: 2017-07-21
title: Getting Started with SELinux
external_resources:
 - '[Graphical Guide to Policies](https://opensource.com/business/13/11/selinux-policy-guide)'
 - '[Gentoo SELinux Project](https://wiki.gentoo.org/wiki/SELinux)'
 - '[SELinux User Resources](https://selinuxproject.org/page/User_Resources)'
 - '[CentOS SELinux Wiki](https://wiki.centos.org/HowTos/SELinux)'
---

![SELinuxbanner](/docs/assets/selinux/selinux_centos.jpg)


SELinux is a Mandatory Access Control (MAC) system, developed by the NSA. SELinux was developed as a replacement for Discretionary Access Control (DAC) that ships with most Linux distributions.

The difference between Discretionary Access Controls and Mandatory Access Controls is the means by which users and applications gain access to machines. Traditionally, the command `sudo` gives a user the ability to heighten permissions to `root`-level. Root access on a DAC system gives the person or program with root access permission to perform as desired on a machine.

Ideally, the person with root access should be trusted with it. But if security has been compromised, so too has the system. SELinux and MACs resolve this issue by both confining privleged proccesses and automating security policy creation.

SELinux defaults to denying anything that is not explicitly allowed. SELinux has global modes, `permissive` and `enforcing`. `Permissive` mode allows the system to function like a Discretionary Access Control system, while logging every violation to SELinux. The `enforcing` mode enforces a strict denial of access to anything that isn't explicitly allowed. To explicitly allow certain behavior on a machine, you, as the system administrator, have to write policies that allow it.

{{< note >}}
We do not recommend you disable SELinux. But if you wish to disable SELinux, please read our quick-answer guide on [SELinux](/docs/quick-answers/linux/how-to-change-selinux-modes)
{{< /note >}}

## Before You Begin

1. This guide requires you to **OWN** the box you are going to use. SELinux is a security-control system; a small misconfiguration could cause your system to be compromised.
2. Linode uses a custom kernel by default. This kernel does not support SELinux. If you are using a Linode, switch to a distribution-supplied kernel by using this guide: [Run a non-custom kernel](https://www.linode.com/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm)
3.  Update your system:

        yum update


## Install SELinux

On CentOS 7 most of the SELinux packages are installed by default. Look to see what packages are installed:

	rpm -aq | grep selinux

If you are dealing with a freshly installed CentOS 7 Linode, your output should be:

	[root@centos ~]# rpm -aq | grep selinux
	libselinux-utils-2.5-6.el7.x86_64
	libselinux-2.5-6.el7.x86_64
	libselinux-python-2.5-6.el7.x86_64
	selinux-policy-3.13.1-102.el7_3.16.noarch
	selinux-policy-targeted-3.13.1-102.el7_3.16.noarch

Install the following packages and their associated dependencies:

	yum install policycoreutils policycoreutils-python selinux-policy selinux-policy-targeted libselinux-utils setools setools-console

Optionally, install `setroubleshoot-server` and `mctrans`. The `setroubleshoot-server` allows, among many other things, for email notifications to be sent from the server to notify you of any policy violations. The `mctrans` daemon translates the output of SELinux to human readable text.

### SELinux Modes

SELinux has two modes: `Enforcing` and  `Permissive`:

 * `Enforcing`: In `Enforcing` mode, SELinux enforces strict policies on the system. Things that are not allowed, will not be allowed to run under any circumstance.
 * `Permissive`: In `Permissive` mode, your system is **not** protected by SELinux; instead, SELinux just records any violation to a log file.

You can check what mode your system is in by running the `getenforce` command:

	[root@centos ~ ]# getenforce
	Enforcing

You can also retrieve even more information using `sestatus`:

	[root@centos ~]# sestatus
	SELinux status:                 enabled
	SELinuxfs mount:                /sys/fs/selinux
	SELinux root directory:         /etc/selinux
	Loaded policy name:             targeted
	Current mode:                   enforcing
	Mode from config file:          permissive
	Policy MLS status:              enabled
	Policy deny_unknown status:     allowed
	Max kernel policy version:      28

You have to set SELinux to `permissive`, so that you can create policies on your system for SELinux to enforce. After changing SELinux's mode, you have to reboot your system.

	[root@centos ~]# setenforce 0
	[root@centos ~]# getenforce
	Permissive
	[root@centos ~]# reboot

Now that SELinux is set to `Permissive`, you can see the log of privacy violations by using:

	grep "selinux" /var/log/messages

The output will look very similar to this:

	[root@centos ~]# grep "selinux" /var/log/messages
	Jun 26 12:27:16 li482-93 yum[4572]: Updated: selinux-policy-3.13.1-102.el7_3.16.noarch
	Jun 26 12:27:38 li482-93 yum[4572]: Updated: selinux-policy-targeted-3.13.1-102.el7_3.16.noarch
	Jun 26 16:38:15 li482-93 systemd: Removed slice system-selinux\x2dpolicy\x2dmigrate\x2dlocal\x2dchanges.slice.
	Jun 26 16:38:15 li482-93 systemd: Stopping system-selinux\x2dpolicy\x2dmigrate\x2dlocal\x2dchanges.slice.
	Jun 26 16:54:46 li482-93 systemd: Removed slice system-selinux\x2dpolicy\x2dmigrate\x2dlocal\x2dchanges.slice.
	Jun 26 16:54:46 li482-93 systemd: Stopping system-selinux\x2dpolicy\x2dmigrate\x2dlocal\x2dchanges.slice.
	Jun 26 16:55:45 li482-93 kernel: EVM: security.selinux
	Jun 26 17:33:43 li482-93 kernel: EVM: security.selinux
	Jun 26 17:36:21 li482-93 kernel: EVM: security.selinux

The file that contains the security states of the system is located at `/etc/selinux/config`, you can edit that file to change the state of the system.

	vi /etc/selinux/config
	# This file controls the state of SELinux on the system.
	# SELINUX= can take one of these three values:
	#     enforcing - SELinux security policy is enforced.
	#     permissive - SELinux prints warnings instead of enforcing.
	#     disabled - No SELinux policy is loaded.
	SELINUX=permissive
	# SELINUXTYPE= can take one of three two values:
	#     targeted - Targeted processes are protected,
	#     minimum - Modification of targeted policy. Only selected processes are protected.
	#     mls - Multi Level Security protection.
	SELINUXTYPE=targeted

The uncommented lines can be changed to any state. After changing the state of SELinux, `reboot` the machine for the changes to take effect.


### SELinux Context

Before switching to the `enforce` state in SELinux, you have to understand contexts, as they pertain to SELinux.

	[root@centos ~]# useradd user
	[root@centos ~]# su user
	[user@centos ~]$ cd ~/ && mkdir test
	[user@centos ~]$ ls -Z
	drwxrwxr-x. user user unconfined_u:object_r:user_home_t:s0 test

The output of `ls -Z` may look familiar, but the `-Z` context flag prints out the SELinux security context of any file.

SELinux marks every single object on a machine with a *context*. That means every file, daemon, and process has a context, according to SELinux. The context is broken into three parts: user, role and type. In SELinux, a policy controls which users can get which roles. Each specific role places a constraint on what `type` of files that user can enter. When a user logs in to a system, a role is assigned, which can be seen in the `ls -Z` example above: the output `unconfined_u` is a user role.


### SELinux Boolean

An SELinux Boolean is a variable that can be toggled on and off without needing to reload or recompile an SELinux polcy. You can view the list of boolean variables using the `getsebool -a` command. It's a long list, so you can pipe it through `grep` to narrow down the results:


	[root@centos ~]# getsebool -a | grep xdm
	xdm_bind_vnc_tcp_port --> off
	xdm_exec_bootloader --> off
	xdm_sysadm_login --> off
	xdm_write_home --> off

You can change the value of any variable using the `setsebool` command. If you set the `-P` flag, the setting will persist through reboots. If you want to permit a service like [openVPN](https://www.linode.com/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server) to run unconfined in your system, you have to edit the policies boolean variable:

	[root@centos ~]# getsebool -a  | grep "vpn"
	openvpn_can_network_connect --> on
	openvpn_enable_homedirs --> on
	openvpn_run_unconfined --> off

	[root@centos ~]# setsebool -P openvpn_run_unconfined ON

	[root@centos ~]# getsebool -a  | grep "vpn"
	openvpn_can_network_connect --> on
	openvpn_enable_homedirs --> on
	openvpn_run_unconfined --> on

Now, you are able to use OpenVPN **unconfined** or in **permissive** mode on your system, even if it is actively in **enforcing** mode. Set your system to `enforce`, and let SELinux protect your system.

	[root@centos ~]# setenforce 1
	[root@centos ~]# getenforce
	Enforcing

### Next Steps

SELinux is complicated. Please see the links under **More Information** to gather a deeper understanding of the subject. SELinux can play a critical role in system administration and security, especially once it is mastered.
