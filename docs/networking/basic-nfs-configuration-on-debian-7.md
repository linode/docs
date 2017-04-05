---
author:
  name: Linode Community
  email: docs@linode.com
description: Basic NFS Configuration on Debian 7.
keywords: 'NFS,Debian,network,file,system,wheezy'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/file-transfer/basic-nfs-debian/']
contributor:
    
modified: Thursday, February 27th, 2014
modified_by:
  name: Linode
published: 'Thursday, February 27th, 2014'
title: Basic NFS Configuration on Debian 7
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Network File System (**NFS**) is a file system that allows computer users to access files over a network in much the same way they can access files in local storage. This is useful for sharing files across several Linodes, or other computers on the Internet. For example, you might want to share the home directories for your users, or system configuration files, over NFS.

This guide walks you through the setup of two Linodes; one acting as the NFS server, and the other acting as the NFS client. In this example, both Linodes are in the same data center and will communicate using their private IP addresses, so your data will never leave Linode's network. Other NFS setups can potentially send traffic over the public Internet.

 {: .note }
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Prerequisites

-   Two Debian 7 Linodes
-   Linodes deployed in the same data center
-   Linodes configured to use private IPs - see the [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide

## NFS Server Setup

Choose one Linode to be your NFS server. Follow the instructions below to configure it:

1.  Update your package references:

        sudo apt-get update

2.  Install the NFS server package **nfs-kernel-server**:

        sudo apt-get install nfs-kernel-server

3.  Create a directory in your local filesystem. This directory will be used as the root of the NFS share:

        sudo mkdir /var/nfsroot

4.  Use your favorite editor to add the following line to the `/etc/exports` file:

    {: .file-excerpt}
	/etc/exports
	: ~~~
		/var/nfsroot	 <client linode private ip>/32(rw,root_squash,subtree_check)
	~~~
	
    Replace **\<client linode private ip\>** with the current private IP address of your second Linode.

5.  Update the table of exported file systems with the following command:

        sudo exportfs -a

6.  Start the NFS server service:

        sudo service nfs-kernel-server start

Done! Now you have a basic NFS server on one of your Linodes, configured to serve the `/var/nfsroot` directory to your second Linode.

## NFS Client Setup

The other Linode will be your NFS client. Follow the instructions below to configure it:

1.  Update your package references:

        sudo apt-get update

2.  Install the NFS client package **nfs-common**:

        sudo apt-get install nfs-common

3.  Create a directory in your local filesystem to serve as the mount point for the remote filesystem:

        sudo mkdir /mnt/remotenfs

4.  Use your favorite editor to add the following line to the `/etc/fstab` file:

    {: .file-excerpt }
	/etc/fstab
	: ~~~
		<server linode private ip>:/var/nfsroot /mnt/remotenfs nfs rw,async,hard,intr 0 0
	~~~

    Replace **\<server linode private ip\>** with the current private IP address of your server Linode.

5.  Mount the filesystem by running the following command:

        sudo mount /mnt/remotenfs

And you're done! Now, from the client Linode, you have access the remote filesystem hosted on your server Linode. You can add more clients by adding them to the `/etc/exports` file on the server, and repeating the client setup for each client.

## Advanced Configuration

NFS provides several mount options. In this guide, we are using some standard behaviors (read-write, asynchronous and interruptible hard waits), but you can configure other behaviors on your NFS shares using the following options.

### Client Options

These options can be specified using the `mount` command, or in the `/etc/fstab` entry:

-   **rw**: Read/write filesystem.
-   **ro**: Read-only filesystem. Remote NFS clients can't modify the filesystem.
-   **hard**: Applications using files stored on an NFS will always wait if the server goes down. User cannot terminate the process unless the option `intr` is set.
-   **soft**: Applications using files stored on an NFS will wait a specified time (using the `timeo` option) if the server goes down, and after that, will throw an error.
-   **intr**: Allows user interruption of processes waiting on a NFS request.
-   **timeo=\<num\>**: For use with the **soft** option. Specify the timeout for an NFS request.
-   **nolock**: Disable file locks. Useful with older NFS servers.
-   **noexec**: Disable execution of binaries or scripts on an NFS share.
-   **nosuid**: Prevents users from gaining ownership of files on the NFS share.
-   **rsize=\<num\>**: Sets the read block data size. Defaults to 8192 on NFSv2 and NFSv3, and 32768 on NFSv4.
-   **wsize=\<num\>**: Sets the write block data size. Defaults to 8192 on NFSv2 and NFSv3, and 32768 on NFSv4.

### Server Options

These options can be specified in the `/etc/exports` entry:

-   **rw**: Read/write filesystem.
-   **ro**: Force clients to connect in the read-only filesystem mode only.
-   **no\_root\_squash**: The root account on the client machine will have the same privilege level as the root on the server machine. This option has security implications; do not use unless you are sure you need it.
-   **no\_subtree\_check**: Disable file location checks on partial volume exports. This option will speed up transfers on full volume exports.
-   **sync**: Force all transfers to operate in synchronous mode, so all clients will wait until their operations are really done. This can avoid data corruption in the event of a server crash.