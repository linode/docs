---
author:
  name: Linode
  email: docs@linode.com
description: 'Securely accessing remote filesystems with SSHFS on Linux.'
keywords: 'sshfs,ssh filesystem,sshfs linux,sshfs macos'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/ssh-filesystems/','networking/ssh/using-sshfs-on-linux-and-macos-x/']
modified: Thursday, May 18th, 2017
modified_by:
  name: Linode
published: 'Monday, October 26th, 2009'
title: Using SSHFS To Mount Remote Directories
external_resources:
 - '[SSHFS Home Page](http://fuse.sourceforge.net/sshfs.html)'
 - '[Linux Security Basics](/docs/security/basics)'
 - '[Use Public Key Authentication with SSH](/docs/tools-reference/ssh/use-public-key-authentication-with-ssh)'
---

SSHFS (Secure Shell FileSystem), is a tool that allows users to securely access remote filesystems over the SSH protocol. This guide will help you get started with SSHFS on your Linode. SSHFS eliminates the need to use FTP/SFTP to transfer files to and from a remote server. For this guide you will need the SSH deamon running on your Linode. If you do not have the SSH deamon visit '[Securing Your Server](/docs/security/securing-your-server.md) before returning to this guide. 
For this guide we used two Ubuntu 16.10 systems, but `sshfs` can be installed on any Linode image. 

## Using SSHFS with Linux

### Install Prerequisite Package

Before installing SSHFS we need to update the system: 

    apt-get update && apt-get upgrade

Issue the following command to install sshfs:

    apt-get install sshfs
	

If you're running CentOS or Fedora on your Linode, use these commands instead:

    yum update
    yum install sshfs

### Linux Client - Mount a Remote Filesystem

Execute the command `sshfs` to mount a remote filesystem. If you wish to use a normal user account to mount filesystems using SSHFS, you'll need to add your user to the `fuse` group first. 

{:.note}
> If you are unfamiliar with users, groups and file permissions, be sure to visit [Users and Groups](/docs/tools-reference/linux-users-and-groups) for a brief introduction. 

To check if the `fuse` group exists run: 
	
	cat /etc/group | grep 'fuse'
	
If the group exists then execute the following command with `sudo`, subsituting your user account name in place of "someuser":
	
	sudo usermod -a -G fuse someuser 

If the group does not exist it has to be created to add the user to the `fuse` group: 
	 
	 sudo groupadd fuse
	 sudo usermod -a -G fuse user 
	
Log out and log back into the client system before proceeding using a normal user account.

The syntax for the `sshfs` command is: `sshfs [user@]host:[directory] mountpoint [options]`
To Mount the home directory of a user named "user" on a remote server at "usersLinode.example.com", create a directory as a destination for the mounted folder. 

    mkdir sshfsExample

Then we use the `sshfs` command to mount the directory from our remote server, to the directory on our local client. 
    
	sshfs user@ausersLinode.example.com:/home/user ssfhsExample


You can also `sshfs` to your Linode server's IP address: 
	
	sshfs user@192.168.0.0:/home/user sshfsExample
	
To unmount the filesystem, use the `umount` command:

    umount sshfsExample
	

### SSH Keys Persistent Mounts

To keep your servers directory mounted on your system through reboots, you have to create a persistent mount. 
Make sure you can access the remote server without entering a password, to do this modify the SSH key directory. The SSH Key will be stored in the remote directories `authorized_keys` file. 

{:note}
>Please note: If your system is older, this file may be named `authorized_keys2`. Please consult `/etc/ssh/sshd_config`) if you are unsure. 

Substitute values appropriate for your server in commands that include a hostname or user account name.

If the user account on your remote server doesn't already have a key in `~/.ssh`, issue this command on the remote server, and accept the defaults.

    ssh-keygen -t rsa

If your local client's user account doesn't already have an ssh key in `~/.ssh`, issue the same command on the client system, accepting the defaults:

    ssh-keygen -t rsa

Issue these commands on the client system to copy your public SSH key to the remote server:

    scp ~/.ssh/id_rsa.pub user@usersLinode.example.com:/home/user/.ssh/uploaded_key.pub
    ssh user@ausersLinode.example.com "echo \`cat ~/.ssh/uploaded_key.pub\` >> ~/.ssh/authorized_keys"

At this point, you should be able to log into the remote server as "user" without entering a password. 
You can force the mounted filesystem to remain persistent between reboots. This is done by including a mount directive for the remote user directory in `/etc/fstab`.  

{: .file-excerpt }
/etc/fstab
: ~~~
    <sshfs#user@usersLinode.example.com>:/home/users /root/sshfsExample fuse defaults 0 0
~~~

This entry would mount the home directory for "user" on the server "usersLinode.example.com" locally at `/root/sshfsExample` each time the system is booted. You may treat this entry like any other in `/etc/fstab`.


### Next Steps

After completing this guide you will be able to transfer files to a remote server from your local machine, without using an FTP client. If you still want to learn how to use an FTP client, check out our guide:'[Transfer Files with FileZilla](/docs/tools-reference/file-transfer/filezilla'), and see what method you prefer to 
