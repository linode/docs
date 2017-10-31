---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial shows how to set up an NFS (Network File System) server and client for remote file access on Debian Distributions.'
og_description: 'With NFS, computer users can access files across multiple servers on a network. This guide sets up two Linodes: an NFS server and an NFS client through which files can be shared.'
keywords: 'NFS,Debian,network,file,system,Jessie'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/file-transfer/basic-nfs-debian/','networking/basic-nfs-configuration-on-debian-7/']
contributor:
modified: Wednesday, November 1st, 2017
modified_by:
  name: Linode
published: 'Thursday, February 27th, 2014'
title: How to Mount NFS Shares on Debian 9
external_links:
  - '[NFS man page](https://linux.die.net/man/5/nfs)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

## What is NFS?

Network File System (**NFS**) is a file system protocol that allows users of Unix-like systems to access files over a network in much the same way they can access files in local storage. This is useful for sharing files across multiple Linodes, or other computers on the internet. For example, you might want to share the home directories for your users, or system configuration files, over NFS.

One of the limitations of NFS (version 3 and older) is security. In that case, NFS servers and clients must be restricted to a local or trusted private network since data travels unencrypted from one machine to the other. This drawback was addressed with version 4, which relies on Kerberos for authentication and encryption. Unfortunately, setting up Kerberos for use with NFS is rather complicated and requires a **Key Distribution Center (KDC)** in place, which is out of the scope of this tutorial.

This guide walks you through the setup of two Linodes: one acts as the NFS server, and the other acts as the NFS client. In this example, both Linodes are in the same data center and will communicate using their private IP addresses, so your data will never leave Linode's network.

{:.caution}
>Other NFS setups can potentially send traffic over the public internet.


## Before You Begin

1.  Deploy two Debian 9 Linodes in the same data center. This guide will refer to these Linodes as **nfs-client** and **nfs-server**.

2.  Create a private IP address for each Linode.[Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide

3.  Use the Linode Manager to reboot both Linodes, then update your system:

      sudo apt-get update && sudo apt-get upgrade

{: .note }
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## NFS Server Setup

From **nfs-server**:

1.  Install the NFS server package **nfs-kernel-server**:

        sudo apt-get install nfs-kernel-server

2.  Prevent access to the services used by NFS by default. Use a text editor to add the following line to the `/etc/hosts.deny`:

    {: .file-excerpt }
    /etc/hosts.deny
    : ~~~ conf
      rpcbind mountd nfsd statd lockd rquotad : ALL
      ~~~

3.  Explicitly allow access to the services used by NFS for your client and localhost. Use a text editor to add the following line:

    {: .file-excerpt }
    /etc/hosts.allow
    : ~~~ conf
      rpcbind mountd nfsd statd lockd rquotad : 127.0.0.1 : allow
      rpcbind mountd nfsd statd lockd rquotad : <client linode private IP> : allow
      rpcbind mountd nfsd statd lockd rquotad : ALL : deny
      ~~~

     Replace **\<client linode private IP\>** with the current private IP address of your client Linode.

4.  Create a directory in your local filesystem. This directory will be used as the root of the NFS share:

        sudo mkdir /var/nfsroot

5.  Assign appropriate ownership to the root of the NFS share:

        sudo chown nobody:nogroup /var/nfsroot/

6.  Use a text editor to add the following line to the `/etc/exports` file:

    {: .file-excerpt}
    /etc/exports
    : ~~~ conf
      /var/nfsroot   <client linode private IP>/17(rw,root_squash,subtree_check)
      ~~~

    Replace **\<client linode private IP\>** with the private IP address **nfs-client**. Make sure there is no space between the /17 and the opening parenthesis. Also check that there is a blank line at the end of the file.

7.  Update the table of exported file systems with the following command:

        sudo exportfs -ra

8.  Start the NFS server service:

        sudo systemctl restart nfs-kernel-server

Done! Now you have a basic NFS server on one of your Linodes, configured to serve the `/var/nfsroot` directory to your second Linode.

## NFS Client Setup

From **nfs-client**:

1.  Update your package references:

        sudo apt-get update

2.  Install the NFS client package **nfs-common**:

        sudo apt-get install nfs-common

3.  Create a directory in your local filesystem to serve as the mount point for the remote filesystem:

        sudo mkdir /mnt/remotenfs

4.  Use a text editor to add the following line to the `/etc/fstab` file:

    {: .file-excerpt }
    /etc/fstab
    : ~~~ conf
      <server linode private IP>:/var/nfsroot /mnt/remotenfs nfs rw,async,hard,intr,noexec 0 0
      ~~~

    Replace **\<server linode private IP\>** with the current private IP address of your server Linode.

5.  Mount the filesystem by running the following command:

        sudo mount /mnt/remotenfs

And you're done! Now, from the client Linode, you have access to the remote filesystem hosted on your Linode NFS server. You can add more clients by adding them to the `/etc/exports` file on the server, and repeating the client setup for each client.

## Advanced Configuration

NFS provides several mount options. In this guide, we are using some standard behaviors (read-write, asynchronous and interruptible hard waits), but you can configure other behaviors on your NFS shares using the following options.

### Client Options

These options can be specified using the `mount` command (along with the `-o` switch followed by a comma-separated list of mount options), or in the `/etc/fstab` entry.

-   **rw**: Read/write filesystem.
-   **ro**: Read-only filesystem. Remote NFS clients can't modify the filesystem.
-   **hard**: Applications using files stored on an NFS will always wait if the server goes down. User cannot terminate the process unless the option `intr` is set.
-   **soft**: Applications using files stored on an NFS will wait a specified time (using the `timeo` option) if the server goes down, and after that, will throw an error.
-   **intr**: Allows user interruption of processes waiting on a NFS request.
-   **timeo=\<num\>**: Specifies the timeout for an NFS request (in tenths of seconds).
-   **nolock**: Disable file locks. Useful with older NFS servers.
-   **noexec**: Disable execution of binaries or scripts on an NFS share.
-   **nosuid**: Prevents users from gaining ownership of files on the NFS share.
-   **rsize=\<num\>**: Sets the read block data size. Defaults to 8192 on NFSv2 and NFSv3, and 32768 on NFSv4.
-   **wsize=\<num\>**: Sets the write block data size. Defaults to 8192 on NFSv2 and NFSv3, and 32768 on NFSv4.

### Server Options

These options can be specified in the `/etc/exports` file:

-   **rw**: Read/write filesystem.
-   **ro**: Force clients to connect in the read-only filesystem mode only.
-   **no\_root\_squash**: The root account on **nfs-client** will have the same privilege level as the root on **nfs-server**. This option has security implications; do not use it unless you are sure you need it. On the other hand, **root\_squash** causes root on the client to have the same access type as nobody on the server - thus preventing root on the client(s) from spreading undesired files on to the others.
-   **no\_subtree\_check**: Disable file location checks on partial volume exports. This option will speed up transfers on full volume exports.
-   **sync**: Force all transfers to operate in synchronous mode, so all clients will wait until their operations are really done. This can avoid data corruption in the event of a server crash.

### Examples

1.  From **nfs-client**, start a root session:

        su -

2.  Create a test file named `testfile.txt` inside `/mnt/remotenfs`:

        echo "Hello World" > /mnt/remotenfs/testfile.txt

3.  If everything went as expected, `/mnt/remotenfs/testfile.txt` is owned by `nobody:nogroup`. You can check with:

        ls -l /mnt/remotenfs/testfile.txt

4.  Likewise, the same permissions should be visible in **nfs-server**:

        ls -l /var/nfsroot/testfile.txt

5.  Replace **root\_squash** with **no\_root\_squash** in `/etc/exports` on the server and update the table of exported shares as explained in step 8 of **NFS Server Setup** above. Finally, we will repeat the above exercise by creating another test file (`testfile2.txt`) in the same directory (`/mnt/remotenfs`):

        sudo echo "Hi everyone" > /mnt/remotenfs/testfile2.txt

6.  If you check the ownership of `testfile2.txt` either on the client or the server, you'll see that it is now owned by `root:root`. These simple examples illustrate the use and implications of **root\_squash** and **no\_root\_squash**. For your security, don't forget to remove the latter and re-add the former in your `/etc/exports` as soon as possible.
