---
author:
  name: Linode
  email: docs@linode.com
description: 'Securely accessing remote filesystems with SSHFS on Linux.'
keywords: 'sshfs,ssh filesystem,sshfs linux,sshfs macos'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/ssh-filesystems/']
modified: Thursday, May 18th, 2017
modified_by:
  name: Linode
published: 'Monday, October 26th, 2009'
title: Using SSHFS To Mount Remote Directories
external_resources:
 - '[SSHFS Home Page](http://fuse.sourceforge.net/sshfs.html)'
 - '[Linux Security Basics](/docs/security/basics)'
 - '[Use Public Key Authentication with SSH](docs/tools-reference/ssh/use-public-key-authentication-with-ssh)
---

SSHFS (Secure Shell FileSystem), is a tool that allows users to securely access remote filesystems over the SSH protocol. This guide will help you get started with SSHFS on your Linode. SSHFS eliminates the need to use FTP/SFTP to transfer files to and from a remote server. For this guide you will need the SSH deamon running on your Linode. If you do not have the SSH deamon visit '[Securing Your Server](/docs/security/securing-your-server.md) before returning to this guide. 
In this guide, we will be using Debian 8 (Jessie) as the client operating system and Ubuntu 14.10 as the remote system. 

## Using SSHFS with Linux

### Install Prerequisite Package

Before installing SSHFS we need to update the system: 

    apt-get update
    apt-get upgrade

Issue the following command to install sshfs:

    apt-get install sshfs
	

If you're running CentOS or Fedora on the client, issue the following commands to install the client and ensure that your system is up to date:

    yum update
    yum install sshfs

### Linux Client - Mount a Remote Filesystem

After the required packages are installed, you may use the `sshfs` command in your terminal to mount a remote filesystem. If you wish to use a normal user account to mount filesystems using SSHFS, you'll need to add your user to the `fuse` group first. 
{:.note}
> If you are unfamiliar with users, groups and file permissions, be sure to visit [Users and Groups](/docs/tools-reference/linux-users-and-groups) for a brief introduction. 

To check if the `fuse` group exists run: 
	
	cat /etc/group | grep 'fuse' 

If the group exists then execute the following command as root, subsituting your user account name in place of "someuser":
	
	usermod -a -G fuse someuser 

If the group does not exist it has to be created, then we will add the user to the group: 
	 
	 groupadd fuse
	 usermod -a -G fuse user 
	
Log out and log back into the client system before proceeding using a normal user account.

The syntax for the `sshfs` command is: `sshfs [user@]host:[dir] mountpoint [options]`
If we wanted to mount the home directory of a user named "user" on a remote server named "usersLinode.example.com", we might issue the following commands:

    mkdir sshfsExample
    sshfs user@ausersLinode.example.com:/home/user ssfhsExample


You can also `sshfs` to your Linode servers IP address: 
	
	sshfs user@192.168.0.0:/home/user sshfsExample
	
To unmount the filesystem, issue the `umount` command:

    umount sshfsExample
	

### SSH Keys Persistent Mounts

You'll need to make sure you can log into the remote server without entering a password. We can do this by modifying our SSH 

The SSH Key will be stored in the remote directories `authorized_keys` file. Issue the following commands to generate an SSH key and copy it to the remote server's `authorized_keys2` file. 
{:note}
>Please note: If your system is older, this file may be named `authorized_keys2`. Please consult your `/etc/ssh/sshd_config`) if you are unsure. 

Substitute values appropriate for your server in commands that include a hostname or user account name.

If your remote server user account doesn't already have a key in `~/.ssh`, issue this command on the remote server, accepting the defaults:

    ssh-keygen -t rsa

If your local (client) user account doesn't already have keys in `~/.ssh`, issue the same command on the client system, accepting the defaults:

    ssh-keygen -t rsa

Issue these commands on the client system to copy your public SSH key to the remote server:

    scp ~/.ssh/id_rsa.pub user@usersLinode.example.com:/home/user/.ssh/uploaded_key.pub
    ssh user@ausersLinode.example.com "echo \`cat ~/.ssh/uploaded_key.pub\` >> ~/.ssh/authorized_keys"

At this point, you should be able to log into the remote server as "alex" without entering a password. 
You can force the mounted filesystem to remain persistent between reboots. This is done by including a mount directive for the remote user directory in `/etc/fstab`.  

{: .file-excerpt }
/etc/fstab
: ~~~
	<sshfs#user@usersLinode.example.com>:/home/users /root/sshfsExample fuse defaults 0 0
~~~

This entry would mount the home directory for "alex" on the server "archimedes.example.com" locally at `/root/alex-archimedes` each time the system is booted. You may treat this entry like any other in `/etc/fstab`; please consult the man page for `fstab` for an in-depth explanation of available options.


