---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial shows how to set up an NFS server and client for remote file access on Debian.'
og_description: ' With NFS, computer users can access files across multiple servers on a network. This guide sets up two Linodes for file sharing as an NFS server and client.'
keywords: ["NFS", "network file system"]
aliases: ['networking/file-transfer/basic-nfs-debian/','networking/basic-nfs-configuration-on-debian-7/','networking/how-to-mount-nfs-shares-on-debian-8/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributor:
modified: Tuesday, November 7th, 2017
modified_by:
  name: Linode
published: 'Thursday, February 27th, 2014'
title: How to Mount NFS Shares on Debian 9
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

[Network File System](https://en.wikipedia.org/wiki/Network_File_System) (NFS) is a file system protocol that allows users of Unix-like systems to access files over a network in much the same way they can with local storage. This is useful for sharing files across several Linodes or other computers on the internet. For example, you can share the home directories for your users, or system configuration files, over NFS.

However, be aware that one limitation of NFS (versions 3 and older) is that servers and clients must be restricted to a local or trusted private network since data travels unencrypted from one machine to the other. This drawback was addressed with NFS version 4, which relies on Kerberos for authentication and encryption. Unfortunately, setting up Kerberos for use with NFS is rather complicated and requires a Key Distribution Center, which is out of the scope of this tutorial.

This guide walks you through the setup of two Linodes; one is the NFS server, and the other acting as the client. In this example, both Linodes are in the same data center and will communicate using their private IP addresses, so your data will never leave Linode's network. **Caution**: Other NFS setups can potentially send traffic over the public internet.
 
{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

-   Two Debian 9 Linodes deployed in the same data center.
-   Linodes configured to use private IPs. See our [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide.

## NFS Server Setup

Choose one Linode to be your NFS server. Follow the instructions below to configure it.

1.  Update your package references:

        sudo apt update

2.  Install the NFS server package `nfs-kernel-server`:

        sudo apt install nfs-kernel-server

3.  Install the Portmapper package `portmap`:

        sudo apt-get install portmap

4.  Prevent access to the services used by NFS by default by adding the following line to your `hosts.deny` file.

    {{< file-excerpt "/etc/hosts.deny" >}}
rpcbind mountd nfsd statd lockd rquotad : ALL
{{< /file-excerpt >}}

5.  Allow access to the services used by NFS for your client and localhost. Add the following lines to your `hosts.allow` file, replacing `example_IP` with the client Linode's private IPv4 address.

    {{< file-excerpt "/etc/hosts.allow" >}}
rpcbind mountd nfsd statd lockd rquotad : 127.0.0.1 : allow
rpcbind mountd nfsd statd lockd rquotad : example_IP : allow
rpcbind mountd nfsd statd lockd rquotad : ALL : deny
{{< /file-excerpt >}}

6.  Create a directory in your local filesystem to use as the NFS share's root location:

        sudo mkdir /var/nfsroot

7.  Assign appropriate ownership to the NFS share's root:

        sudo chown nobody:nogroup /var/nfsroot/

8.  Add the following line to the `/etc/exports` file, replacing `example_IP` with the client Linode's private IPv4 address. Make sure there is no space between the /17 and the opening parenthesis, and that there is a blank line at the end of the file.

    {{< file-excerpt "/etc/exports" >}}
/var/nfsroot     example_IP/17(rw,root_squash,subtree_check)
{{< /file-excerpt >}}

9.  Update the table of exported file systems with the following command:

        sudo exportfs -ra

10.  Restart the NFS service on the server Linode for your changes to take effect:

        sudo systemctl restart nfs-kernel-server

Done! Now you have a basic NFS server onone of your Linodes, configured to serve the `/var/nfsroot` directory to your second Linode.

## NFS Client Setup

The second Linode will be your NFS client. Follow the instructions below to configure it.

1.  Update your package references:

        sudo apt update

2.  Install the NFS client package `nfs-common`:

        sudo apt install nfs-common

3.  Create a directory in the client Linode's local filesystem to serve as the mount point for the remote filesystem:

        sudo mkdir /mnt/remotenfs

4.  Use your favorite editor to add the following line to the client's `fstab` file, replacing `example_IP` with the server Linode's private IPv4 address.

    {{< file-excerpt "/etc/fstab" >}}
example_IP:/var/nfsroot /mnt/remotenfs nfs rw,async,hard,intr,noexec 0 0
{{< /file-excerpt >}}

5.  Mount the filesystem by running the following command:

        sudo mount /mnt/remotenfs

And you're done! Now, from the client Linode, you have access to the remote filesystem hosted on your Linode NFS server. You can add more clients by adding them to the server's `/etc/exports` file, then repeating the client setup for each client.

## Advanced Configuration

NFS provides various mount options. In this guide, we are using the standard behaviors of read and write access, asynchronous file transfers, and interruptible hard waits, but you can configure other behaviors on your NFS shares using the following options.

### Client Options

These options can be specified either in `fstab`, or manually using the `mount` command with the `-o` switch, followed by a comma-separated list of mount options.

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
-   **no\_root\_squash**: The root account on the client machine will have the same privilege level as the root on the server machine. This option has security implications; do not use unless you are sure you need it. On the other hand, **root\_squash** causes root on the client to have the same access type as nobody on the server - thus preventing root on the client(s) from spreading undesired files on to the others.
-   **no\_subtree\_check**: Disable file location checks on partial volume exports. This option will speed up transfers on full volume exports.
-   **sync**: Force all transfers to operate in synchronous mode, so all clients will wait until their operations are really done. This can avoid data corruption in the event of a server crash.

### Examples

In the client, create a test file named `testfile.txt` inside `/mnt/remotenfs`:

    sudo echo "Hello World" > /mnt/remotenfs/testfile.txt

If everything went as expected, `/mnt/remotenfs/testfile.txt` is owned by `nobody:nogroup`. You can check with

    ls -l /mnt/remotenfs/testfile.txt

Likewise, the same permissions should be visible in the server if you do

    ls -l /var/nfsroot/testfile.txt

Now let's replace **root\_squash** with **no\_root\_squash** in `/etc/exports` on the server and update the table of exported shares as explained in step 8 of **NFS Server Setup** above. Finally, we will repeat the above exercise by creating another test file (`testfile2.txt`) in the same directory (`/mnt/remotenfs`):

    sudo echo "Hi everyone" > /mnt/remotenfs/testfile2.txt

If you check the ownership of `testfile2.txt` either on the client or the server, you'll see that it is now owned by `root:root`. These simple examples illustrate the use and implications of **root\_squash** and **no\_root\_squash**. For your security, don't forget to remove the latter and readd the former in your `/etc/exports` as soon as possible.
