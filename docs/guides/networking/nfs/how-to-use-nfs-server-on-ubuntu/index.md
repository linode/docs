---
slug: using-an-nfs-server-on-ubuntu2004
author:
  name: Jeff Novotny
description: 'This guide provides you with a brief introduction to NFS (Network File System) as well as how to configure NFS on a client and server on Ubuntu 20.04.'
og_description: 'This guide provides you with a brief introduction to NFS (Network File System) as well as how to configure NFS on a client and server on Ubuntu 20.04.'
keywords: ['NFS','file sharing','NFS server','mount point']
tags: ['networking', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-06
image: HowtoUseanNFSServeronUbuntu2004.jpg
modified_by:
  name: Linode
title: "Using an NFS Server on Ubuntu 20.04"
h1_title: "How to Use an NFS Server on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[RFC for NFS version 4.2](https://datatracker.ietf.org/doc/html/rfc7862)'
- '[Linux NFS site](http://linux-nfs.org/wiki/index.php/Main_Page)'
- '[Export options for NFS](http://nfs.sourceforge.net/nfs-howto/ar01s03.html)'
---

*Network File System* (NFS) is a distributed file system that allows users to access files over a network like files on their own system. The current version of NFS, which was originally developed by Sun Microsystems, is [NFS Version 4](https://datatracker.ietf.org/doc/html/rfc7862). NFS is an open standard that builds on the *Open Network Computing Remote Procedure Call* (ONC RPC) system. This guide provides a brief introduction to NFS and explains how to configure and use NFS on both server and client systems.

## An Introduction to NFS

NFS is most commonly used with Linux distributions or macOS but is available for other operating systems. It uses an asynchronous client/server computing model for its distributed file system mechanism. NFS originally used *User Datagram Protocol* (UDP) for its transport mechanism, but can now also use *Transmission Control Protocol* (TCP). TCP improves the performance of NFS because it allows for larger read and write operations. Port `2049` is used for both protocols. Over the years, NFS has been updated to offer performance improvements, stronger security, locking mechanisms, more efficient caching, and a stateful protocol. It oversees the authentication, authorization, and management of clients.

The server administrator makes directories accessible to remote users through a configuration file, which defines access privileges for each file or directory. Clients can mount these directories and read, create, or edit files like those on their own computers. After the client sends a mount request to access the system, the server validates whether the client is authorized to mount the directory.

NFS uses a *Remote Procedure Call* (RPC) to assemble and process a request. Client system calls, such as read, write, open, and close, are translated into RPC function calls. These requests are sent to the server, where they are validated and directed to the correct handler. The appropriate file or metadata is then either updated or transmitted to the client. The entire process is transparent to the client.

NFS uses file handlers to identify each file. File handlers are defined in relation to the root directory of the system. The file handler uses a volume identifier and an *inode number* to identify the file partition and locate the file within the partition. NFS also tracks the *file attributes*, which contain metadata about the file. This metadata includes the creation and modification dates, file size, owner, and permissions. All clients must use the same locking and caching options to avoid inconsistency in files. This allows access to the NFS server from different clients.

More detailed information about the operational details of NFS can be found on the [Linux NFS site](http://linux-nfs.org/wiki/index.php/Main_Page).

## Advantages and Disadvantages of NFS

NFS has been widely adopted due to its positive cost-benefit ratio. Some of its advantages include:

- It is an open-source, low-cost solution.
- A low-level of effort is needed to set it up and requires minimal knowledge for both administrators and clients to use. NFS has a low administrative overhead after the initial configuration has been completed.
- Network administrators can centralize data and save on storage and network devices when using NFS.
- It permits easy sharing of data. Multiple users can access the same files.
- Files are kept up to date. There are no conflicts or uncertainties between different versions of a file. The possibility of an out-of-date version being accidentally used is greatly reduced.
- NFS is interoperable with different vendors and implementations.
- It provides for quick recovery from crashes.

Due to its flexibility, openness, and simple mechanisms, there are also some drawbacks to using NFS.

- It is somewhat insecure, and should only be used in an internal network. Shared files should be shielded from general internet access. Organizations might want to consider whether to make highly sensitive documents available through NFS.
- NFS can slow down during heavy use.
- Data access is somewhat inefficient due to the amount of protocol overhead.
- The block size of a transfer is currently capped at 1MB. This is inefficient for very large files. The transfer limit of 1.5GB/s is also on the low side.
- The configuration parameters for locking and caching can be complex and difficult to configure.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. To complete the server and client configuration, two Linodes are required. One Linode serves as the NFS host and server, while the other acts as a client. Note the IP addresses of both Linodes. Throughout the following sections, replace `server_ip_addr` with the IP address of the NFS server, and `client_ip_addr` with the address of the client.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Configure the NFS Server and Client

The steps involved in configuring the NFS server and the client are as follows:

1. Install the NFS server and client Software
1. Configure the firewall on the NFS server
1. Create an export directory on the NFS server
1. Configure the NFS export settings on the server
1. Create an NFS mount point on the client

### Install the NFS Server and Client Software

The NFS package must be installed on both the server and the client. The server requires the full NFS kernel, while clients only have to install the `nfs-common` package.

1. On the NFS server, update all packages.

        sudo apt update

1. Install the `nfs-kernel-server` package on the server.

        sudo apt install nfs-kernel-server

    {{< note >}}
By default, the NFS server supports versions 3 and 4. Verify the versions that are enabled using the `sudo cat /proc/fs/nfsd/versions` command.
    {{< /note >}}

1. Verify the status of the NFS server using the `systemctl` utility. It should display a status of `active`.

        sudo systemctl status nfs-kernel-server.service

    {{< output >}}
nfs-server.service - NFS server and services
     Loaded: loaded (/lib/systemd/system/nfs-server.service; enabled; vendor preset: enabled)
     Active: active (exited) since Tue 2021-07-06 12:57:35 UTC; 1h 18min ago
   Main PID: 2588 (code=exited, status=0/SUCCESS)
      Tasks: 0 (limit: 4615)
     Memory: 0B
     CGroup: /system.slice/nfs-server.service
    {{< /output >}}

1. Update all packages on the Linode serving as the client.

        sudo apt update

1. On the client, install the `nfs-common` package.

        sudo apt install nfs-common

### Configure the Firewall on the NFS Server

NFS has an inherent security risk because it allows external servers to access some of its directories and files. Configure the `ufw` firewall to enforce strict NFS access based on the IP address of the client. NFS allows access through port `2049`. Verified users require access to this port to use NFS.

1. On the server, verify the current `ufw` settings and verify whether a rule exists for NFS yet.

        sudo ufw status
    {{< output >}}
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
    {{< /output >}}

1. Add a rule to allow port `2049` to accept traffic from the client's IP address. Replace `client_ip_addr` with the address of the client Linode.

        sudo ufw allow from client_ip_addr to any port nfs

1. Run `ufw status` again and confirm the rule has been added.

        sudo ufw status
    {{< output >}}
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
2049                       ALLOW       client_ip_addr
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
    {{< /output >}}

### Create an Export Directory on the NFS Server

NFS client access is granted on a case-by-case basis. A directory that is shared with clients using NFS is called an *export directory*. Non-empty directories can be shared with NFS, but it is more typical to create an empty export directory for sharing files.

1. Create a directory on the NFS server to contain the shared files. It is best to create a separate export directory for each project to better control user access. Because the directory is created using `sudo`, the root user account owns this directory.

        sudo mkdir -p /nfs/share/project1
1. For security reasons, NFS translates any root credentials from a client to `nobody:nogroup`. This restricts the ability of remote root users to invoke root privileges on the server. To grant client root users access to the export directory, change the directory ownership to `nobody:nogroup`.

        sudo chown nobody:nogroup /nfs/share/project1
1. Adjust the file permissions for the directory. The following command grants NFS clients full read, write and execute privileges to the directory files.

        sudo chmod 777 /nfs/share/project1

### Configure the NFS Export Settings on the Server

The NFS component maintains a configuration file containing the Access Control Lists (ACL) for each export directory. Each entry indicates the name of the export directory, the clients who are authorized to access it, and the file-sharing options. The format of each line is `export_directory_name client1(sharing_options) client2(sharing_options_2)`. Access can be provided to several clients in the same entry. A client can be identified either through a specific IP address, an entire subnet, or a domain name.

A detailed explanation of all the export options can be found in the [Setting Up an NFS Server](http://nfs.sourceforge.net/nfs-howto/ar01s03.html) documentation. Some of the main sharing options include the following:

- **rw/ro:**  The `rw` option grants read and write access to the share, but `ro` only allows read access.
- **sync:** The `sync` option guarantees changes are committed on the server before any further requests for the file are answered. The `async` option provides better performance but data loss or corruption might occur under certain circumstances.
- **subtree_check:** The `subtree_check` option verifies a user can mount subdirectories within a system. It also validates whether a given file exists within the sub-tree. This choice is more secure, but it could present some performance issues in a deep directory with frequent changes. The `no_subtree_check` option turns this checkoff.
- **noexec:** This prevents any files in the export directory from being executed.
- **no_root_squash:**  This permits client root users to maintain their root privileges on the server. This overrides the default settings and permits them to modify root-owned files on the server. This option has serious security implications on a multi-user system.

To add the new export directory to NFS, execute the following commands on the server.

1. Edit the `/etc/exports` file.

        vi /etc/exports

1. Add the following line and save the file. Replace `client_ip_addr` with the actual IP address or subnet of the client.

    {{< file "/etc/exports" >}}
/nfs/share/project1  client_ip_addr(rw,sync,no_subtree_check)
    {{< /file >}}

1. Apply the configuration changes using the `exportfs` command.

        sudo exportfs -a

1. View all the active exports and verify the `/nfs/share/project1` directory has export status.

        sudo exportfs -v

    {{< output >}}
/nfs/share/project1
client_ip_addr(rw,wdelay,root_squash,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)
    {{< /output >}}

1. Restart the NFS utility using `systemctl`.

        sudo systemctl restart nfs-kernel-server

### Create an NFS Mount Point on the Client

To access the export directory on the server, the client must first map the drive to a local directory. This directory is called a *mount point*. To create a mount point, create a new directory on the client and bind the server's export directory to it. Execute the following commands on the client to mount the server's export directory.

{{< caution >}}
Use an empty directory for the mount point. Any pre-existing files or subdirectories in the mounted directory are hidden while the mount point is in use.
{{< /caution >}}

1. Create a new directory on the client to serve as the mount point.

        sudo mkdir -p /nfs/mnt/project1
1. Mount the export directory to the new directory using the `mount` command. As the first argument, specify the IP address of the NFS server, a `:` symbol, and the path to the export directory. The second parameter is the local mount point directory on the client.

        sudo mount -t nfs  server_ip_addr:/nfs/share/project1  /nfs/mnt/project1
1. Use the `df` command to confirm the export directory is mounted correctly. The remote directory should be listed somewhere in the list of drives.

        df -h
    {{< output >}}
Filesystem                         Size  Used Avail Use% Mounted on
...
server_ip_addr:/nfs/share/project1   79G   13G   63G  17% /nfs/mnt/project1
    {{< /output >}}
1. The mount only persists until the system reboots. To automatically mount the directory when the system activates, add the mount point to the `/etc/fstab` file. The entry should consist of the export directory, the local mount point, a list of options, and two `0`'s. To see all the available options for this file, run `man nfs` on the client.

        sudo vi /etc/fstab
    {{< file "/etc/fstab" >}}
server_ip_addr:/nfs/share/project1  /nfs/mnt/project1 nfs timeo=900,intr,actimeo=1800 0 0
    {{< /file >}}
1. To confirm the export directory is mounted properly upon system bootup, reboot the system and run the `df` command again. The export directory should appear in the output.

## Verify the NFS Service

To validate NFS is working, make changes to the file on the server and confirm they are reflected on the client. Then edit the file on the client and verify the changes on the server.

1. Log in to the server and create a new file within the export directory.

        cd /nfs/share/project1
        "Test data for testfile.text" > testfile.text
1. Change to a console on the client, and `cd` to the mounted directory. Run the `ls` command, and ensure the `testfile.text` file appears.

        cd /nfs/mnt/project1
        ls -l
    {{< output >}}
-rw-rw-r-- 1 user1 user1 27 Jul  7 13:06 testfile.text
    {{< /output >}}
1. Remain on the client, and use a text editor to add some additional text to the `testfile.text` file.

        vi testfile.text
1. Return to the server console and ensure the `testfile.text` file in the export directory reflects the changes that were made on the client.

        cd /nfs/share/project1
        cat testfile.text
    {{< output >}}
Test data for testfile.text
New test data for testfile.text
    {{< /output >}}

## Unmount an NFS Share on the Client

A mount point can be removed when it is no longer required. Any unmounted directories must also be removed from the `/etc/fstab` file.

1. On the client, remove the mount point using the `umount` command. Note the spelling of this command. Specify the name of the local mount point, not the name of the export directory on the server.

        sudo umount /nfs/mnt/project1
1. Use the `df` command to confirm the mount point has been removed.

        df -h
1. Edit the `/etc/fstab` file and either remove the line referring to the export directory or comment it out with the `#` symbol.

        sudo vi /etc/fstab
    {{< file "/etc/fstab" aconf >}}

# server_ip_addr:/nfs/share/project1  /nfs/mnt/project1 nfs timeo=900,intr,actimeo=1800 0 0

    {{< /file >}}
