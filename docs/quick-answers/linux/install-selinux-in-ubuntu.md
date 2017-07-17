---
author:
  name: Angel
  email: docs@linode.com
description: "This quick answers guide shows you how to uninstall apparmor and install SELinux on Ubuntu"
keywords: 'linux, selinux, apparmor, install'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Sunday, June 30th, 2017'
modified_by:
  name: Angel Guarisma
published: 'Sunday, June 30th, 2017'
title: How to Install SELinux on Ubuntu
---



### Installing SELinux on Ubuntu

Ubuntu has a Mandatory Access Control (MAC) system similar to SELinux, named AppArmor. Both SELinux and AppArmor provide a set of tools to isolate applications from each other to protect the host system from being compromised. AppArmor offers Ubuntu users mandatory access control options, without the perceived difficulty or learning curve that SELinux may have. However, if you are switching to Ubuntu, are already familiar with SELinux and would like to use it to enforce security on your system, follow this brief tutorial. 

#### Before You Begin

SELinux is not supported on Linodes by default. To boot a distribution specific kernel, follow this [guide](https://www.linode.com/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm), and select GRUB2 in the manager's kernel menu. 

#### Removing AppArmor

{:.caution}
>
>At this point in the tutorial AppArmor is your default security module. Removing AppArmor and not replacing can put your system at risk.
>Do not purge AppArmor if you believe you may be reusing it in the future. 

1. Stop the AppArmor script in `/etc/init.d/`: 

		sudo /etc/init.d/apparmor stop 

2. Purge apparmor from the system. 
	
		apt purge apparmor

	If you are worried about configuration files being removed from the system use `apt remove apparmor` . 
3. Update and reboot your system: 

		apt update && upgrade -yuf
		reboot

#### Installing SELinux

1. Install the SELinux package and reboot the system:

		apt install selinux
		reboot

2. You can wether or not SELinux is enforcing on your system by trying to set SELinux to `enforcing` mode. 

		root@ubuntu:~# setenforce 1
		root@ubuntu:~# getenforce
		Enforcing

{:.note}
>
>If you receive the error `setenforce: SELinux is disabled`, check if you are still using the Linode custom Kernel.


## Next Steps 
After installing SELinux on your system, use our [Getting Started with SELinux Guide](/docs/security/getting-started-with-selinux) to learn the basics of SELinux security. 
