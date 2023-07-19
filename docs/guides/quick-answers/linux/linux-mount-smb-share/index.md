---
slug: linux-mount-smb-share
title: "Mount an SMB Share in Linux"
description: "Learn how to mount a Windows directory in Linux using the SMB Protocol. This enables you to remotely access and modify you files."
keywords: ['linux mount smb share', 'mount smb share linux', 'mount cifs', 'linux cifs mount']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-06-06
modified_by:
  name: Linode
external_resources:
- '[Server Message Block (SMB) share](https://docs.microsoft.com/en-us/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview)'
- '[Common Internet File System (CIFS) utils](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cifs/d416ff7c-c536-406e-a951-4f04b2fd1d2b)'
---

Determining how to share files and directories between computers is a common problem --- one that has many different solutions. Some of these solutions include file transfer protocols (like SFTP), cloud storage services, and distributed file system protocols (like NFS and SMB). Figuring out what solution is right for your use case can be confusing, especially if you do not know the correct terminology, techniques, or the tools that are available. Sharing files can be made even more complicated if you intend to do so over the internet or use multiple operating systems (like Linux, Windows, and macOS).

This guide covers the Server Message Block (SMB) protocol. Specifically, it discusses using the SMB protocol to mount a Windows SMB share (a shared directory) to a Linux system. By following this guide, you will be able to access all of your files within a Windows folder (such as `C:\My_Files`) on your Linux system at whichever directory you choose as a mount point (such as `/mnt/my_files`). This method of file sharing is appropriate when you need to access entire Windows directories remotely as if they were local resources. In most cases, SMB is a native (or easily installed) file sharing solution for users that need access to the same directory and is commonly shared through a corporate intranet or the same private network.

{{< note >}}
Network File System (NFS) is another distributed file system protocol that's similar to SMB. While SMB is more commonly used in primarily Windows environments and NFS is used in primary Linux environments, both have cross-platform support. This guide does not cover NFS, but you can learn more about it by reading through our [NFS guides](/docs/guides/networking/nfs/). If you are not in a Windows environment and are looking to share directories between Linux systems, consider using NFS.
{{< /note >}}

{{< note type="warning" >}}
While security and performance of the SMB protocol has improved over time, it is often still a concern when connecting to an SMB share over the internet. This is typically not recommended unless you are using [SMB over QUIC](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-over-quic) (recently introduced on Windows 11 and Windows Server 2022), intend to always use the latest protocol version (3.1.1 as of this writing), or are connected through a personal or corporate VPN. If you are not able to implement these recommendations and still wish to share files over the internet, consider if the [SFTP](/docs/guides/sftp-linux/) protocol would work for you instead.
{{< /note >}}

## Overview of the SMB Protocol

The SMB protocol provides the ability to share entire directories and printers between multiple machines over a network (typically a private network). It is widely used in Windows environments due to its relative simplicity (for system administrators), built-in Windows support, and extensive Linux support (basic support is also included in recent Linux kernels).

### SMB Versions

To understand SMB and some of the related terminology (specifically CIFS), it's helpful to know a little about the history of the protocol:

- **SMB1:** (1983+) While Microsoft is the developer and maintainer of SMB, it was originally designed at IBM. Microsoft modified that original design and implemented the "SMB 1.0/CIFS Server" as part of their LAN Manager OS and, eventually, in Windows. Version 1 of the protocol has been discontinued (as of 2013) and is no longer installed on modern Windows systems. There are many security and performance issues with SMB1 that make it largely unfit for use today.

- **CIFS:** (1996) Microsoft attempted to rename SMB to CIFS (Common Internet File System) as it continued to develop features for it, including adding support for the TCP protocol. While the name was retired in subsequent versions, the term still appears in various tooling and documentation as it was in use for over 10 years.

- **SMB2:** (2006) Version 2 introduced huge performance benefits as it greatly reduced the amount of requests sent between machines and expanded the size of data/storage fields (from 16-bit to 32-bit and 64-bit). It was released alongside Windows Vista. Even though SMB2 (and all SMB versions) remained a proprietary protocol, Microsoft released the specifications for it so that other services (like Linux ports) could provide interoperability with this new version.

- **SMB3:** (2012) Version 3 was released alongside Windows 8 and brought extensive updates to security (including end-to-end encryption) and performance. Additional updates were released with Windows 8.1 (SMB 3.0.2) and Windows 10 (3.1.1). When using the SMB protocol today, always use the latest version --- unless you are supporting legacy systems and have no other choice.

For a more comprehensive version history of SMB, review the [Server Message Block > History](https://en.wikipedia.org/wiki/Server_Message_Block#History) Wikipedia entry.

### Linux SMB Support

- **[Samba](https://www.samba.org/):** Unix support for the SMB protocol was initially provided by Samba. Since Microsoft initially did not release public specifications for their proprietary protocol, the developers of Samba had to reverse engineer it. Future versions of Samba were able to use the public specifications of later SMB protocols. Samba includes support for SMB3 (3.1.1) and is actively updated. Samba provides extensive support for all features of the SMB protocol and acts as a stand-alone file and print server. For more background information, see the [Samba Wikipedia entry](https://en.wikipedia.org/wiki/Samba_(software)).

- **[LinuxCIFS utils](https://wiki.samba.org/index.php/LinuxCIFS_utils):** This in-kernel software acts as an SMB client and is the preferred method of mounting existing SMB shares on Linux. It was originally included as part of the Samba software, but is now available on its own. LinuxCIFS utils, available as the cifs_utils package in most Linux distributions, is used within this guide.

- **[ksmbd](https://github.com/namjaejeon/ksmbd):** Developed as an in-kernel SMB server in cooperation with the Samba project, ksmbd is designed to be a more performant fileserver. It doesn't implement all of Samba's extensive features (beyond file sharing).

## Before You Begin

- Obtain the necessary information required to access an existing SMB share, including the IP address of the SMB server and the path of the share. If you do not have a share, you can create a local directory using the `mkdir` command and then [create a Samba share](https://ubuntu.com/tutorials/install-and-configure-samba#1-overview) for that location. Access to an existing SMB share on a Windows or Linux machine. Creating an SMB share is beyond the scope of this tutorial.

- Have access to an Ubuntu or Debian Linux system where you intend to access your SMB share.

## Installation

The LinuxCIFS utils package provides the tools needed to connect to a share and manage mounts on a Linux system. You use it to help create and manage a connection to a Windows, macOS, or Linux share.

1.  Update the list of available packages using the below command:

    ```command
    sudo apt update && sudo apt upgrade
    ```

1.  Install the both the LinuxCIFS utils package (needed to mount SMB shares) and the psmisc package (needed to gain access to the `fuser` command, which shows you which users are using the various mounts on your server).

    ```command
    sudo apt install cifs-utils psmisc
    ```

1.  Verify that LinuxCIFS is available using the following command:

    ```command
    mount -t cifs
    ```

    No error or output message is expected as there are no CIFS connections set up yet.

1.  Verify that you have access to the `fuser` command.

    ```command
    fuser
    ```

    This command shows a list of the various command line switches that can be used with the `fuser` utility.

    ```output
    Usage: fuser [-fMuvw] [-a|-s] [-4|-6] [-c|-m|-n space] [-k [-i] [-s sig] | -SIGNAL] NAME...
    ```

## Mount an SMB Share

All files in Linux are accessible on a single giant hierarchical directory tree, which starts at the root (`/`). The mount command (used in this tutorial) enables you to access other storage devices or file systems from that same tree. These other storage resources do not have to be physical disks and they do not have to be using the same file system. To learn more about the mount command, review the following guides:

- [Quick Guide to the Linux Mount Command](/docs/guides/linux-mount-command/)
- [Mount a File System on Linux](/docs/guides/mount-file-system-on-linux/)

The following sections detail how to mount an SMB share on Ubuntu, but the essential process is the same for other Linux distributions.

1.  Create an empty directory to be used as the mount point. This directory can be located wherever you wish, though it's common to use the `/mnt` directory.

    ```command
    mkdir /mnt/smb_share
    ```

1.  Enter the following command to mount the SMB share, replacing *[server-ip]* with the IP address of your SMB server, *[share-path]* with the file path to your SMB share on that server, and *[mount-point]* with the new directory you just created.

    ```command
    mount -t cifs //[server-ip]/[share-path] /[mount-point]
    ```

    In the example below, the SMB server's IP is 192.0.2.17, the share's path is SharedFiles, and the mount point is /mnt/smb_share.

    ```command
    mount -t cifs //192.0.2.17/SharedFiles /mnt/smb_share
    ```

1.  When prompted, enter the password to connect to the remote share.

1.  If the connection is successful, you should see the remote share mounted on the mount point directory you created. To verify this, type the following command:

    ```command
    mount -t cifs
    ```

    The command above lists all mounted SMB shares. Among this list, you should see the share you just mounted.

1.  You should now be able to access the files as if they were on a local drive. In the command below, replace *[mount-point]* with the directory you have created (such as `/mnt/smb_share`).

    ```command
    cd [mount-point]
    ```

    From here, you can run the `ls` command to view your files and you can interact with the files as you would any other files on your system.

## Create a Credentials File

You don’t want to have to type in your credentials every time you access a share. On the other hand, putting the credentials where everyone can see is not a good idea. The following steps help you create a credentials file to automate the process of logging in.

1.  Use your preferred text editor such as vi or nano to create a file to store the credentials. You can name the file anything you want, but using a period before the filename will hide it from view. For example, you can create a file named `.credentials` using the following command:

    ```command
    nano ~/.credentials
    ```

1.  Add the necessary credentials to the file in the following format:

    ```file {title=".credentials"}
    username=target_user_name
    password=target_user_password
    domain=domain
    ```

    If the `domain` is not required (except on Windows systems), you can omit that entry. Replace the `target_user_name` and `target_user_password` with the actual credentials you need to use to access the SMB share. Save and close the file.

1.  Set ownership of the credentials file to the current user by running the following command:

    ```command
    sudo chown <User Name>:<Credentials Filename>
    ```

    Replace `<User Name>` with your username and `<Credentials Filename>` with the name of your credentials file.

1.  Set the file permissions to `600` to ensure that only the owner has read and write access:

    ```command
    sudo chmod 600 <Credentials Filename>
    ```

1.  To mount the share using the credentials file, run the following command:

    ```command
    sudo mount -t cifs -o credentials=<Credentials Filename> //<IP Address of Server>/<Share on Server> /<Mount Point>
    ```

    Replace `<IP Address of Server>` with the IP address of the server hosting the share, `<Share on Server>` with the name of the share you want to mount, and `<Mount Point>` with the local mount point where you want to access the share. You aren’t asked for credentials this time because mount uses the credentials file instead.

1.  Verify that the share has been successfully mounted using the following command:

    ```command
    mount -t cifs
    ```

    This should show you the share information as output, confirming that the share has been successfully mounted using the credentials file.

## Mount a Share Automatically At Boot

Remounting the SMB share every time you restart the server can be tedious. You can instead set your server up to automatically remount the share every time you restart it using the following steps. Before starting these steps, make sure that the share is currently unmounted.

1.  Open the `/etc/fstab` file in your preferred text editor. This file contains configurations that the server uses on reboot to reconnect to shares (among other things). There are columns for the file system, mount point, type, and options.

1.  Enter the information below in each of the columns:

    ```file {title="/etc/fstab"}
    <file system>: //<IP Address of Server>/<Share on Server>
    <mount point>: <Mount Point>
    <type>: cifs
    <options>: credentials=<Credentials Filename>
    ```

    From the file above, replace `<IP Address of Server>` with the IP address of the server hosting the share, `<Share on Server>` with the name of the share you want to mount, `<Mount Point>` with the local mount point where you want to access the share, `<Credentials Filename>` with the name of your credentials file,

1.  Save the file so the share is available next time you reboot the server.

1.  Verify that the share is mounted correctly using the `<Mount Point>` as an identifier because the mount is reading the `/etc/fstab` file.

## Unmount a Share

You may need to unmount a share at some point. To unmount an SMB share that has been mounted using the `mount` command, you can use the `umount` command followed by the mount point of the share. The correct command is `umount`, not `unmount`.

So to unmount an SMB share at the mount point `<Mount Point>`, run the following command:

```command
umount -t cifs /<Mount Point>
```

The share should not appear in the output of this command.

## Conclusion

You now have an understanding of SMB (and CIFS), what an SMB share is, and what a mount point is. These pieces of information allow you to share remote data in a way that’s transparent to users. From the user's perspective, the resource is local to the server that they’re accessing. This guide also shows you how to use the mount and umount commands in a basic way to create and delete shares, how to create and use a credentials file to automate the sharing process to some extent, and how to automatically remount the share after a reboot.