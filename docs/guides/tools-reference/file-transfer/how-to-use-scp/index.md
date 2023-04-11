---
slug: how-to-use-scp
description: 'Learn how to transfer files using SCP on Linux, and how SCP compares to other means of transferring files.'
keywords: ['Scp command','Scp linux','Scp syntax','Scp example']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-14
modified_by:
  name: Linode
title: "Transfer Files With the scp Command on Linux"
title_meta: "How to Transfer Files With the scp Command on Linux"
external_resources:
- '[Ubuntu man page for scp](http://manpages.ubuntu.com/manpages/focal/man1/scp.1.html)'
- '[TFTP RFC 1350](https://datatracker.ietf.org/doc/html/rfc1350)'
authors: ["Jeff Novotny"]
---

Copying files to a remote computer is a very common task. There are many programs and utilities to accomplish this task, but not all of them are secure. A popular choice for more quickly and securely copying files is the Secure Copy Protocol (SCP). This guide describes how SCP works and explains how to use the `scp` command on Linux distributions. It also provides several `scp` examples, demonstrating several different scenarios.

## An Introduction to SCP

SCP is a way to transfer files with a reasonably high level of security. It allows users to copy files between their local server and a remote system, leaving the original in place. SCP can both upload and download files. It also allows users to copy over entire directories of files. As an extra convenience, it can even copy files between two different remote systems.

SCP refers to both the protocol and the `scp` Linux utility. SCP replaced the original `rcp` command, which is no longer considered secure. It is not defined in an RFC, but most Linux distributions have "man" pages describing how to use it. For example, Ubuntu includes a [scp man page](http://manpages.ubuntu.com/manpages/focal/man1/scp.1.html).

Before transferring the files, the client establishes an SCP connection to the remote server. By default, SCP connects using Transport Control Protocol (TCP) port `22`. The remote server then invokes the SCP process. SCP can operate in one of two modes:

- **Source mode**: Source mode accesses the requested source file from the file system and transmits it back to the client.
- **Sink mode**: Sink mode accepts the file from the client and saves it to the specified directory.

SCP uses the *Secure Shell* (SSH) protocol as a base layer. SSH authenticates the user and encrypts the data for transfer. In addition to encrypting the file contents, SCP also encrypts all passwords. Because the files are encrypted, they cannot be accessed via a man-in-the-middle attack.

SCP also supports remote-to-remote mode. Originally, SCP established a direct connection between the remote source and the remote destination. This allowed data to pass between the two nodes without having to pass through the local host. But in most recent releases, data is routed through the originating node as the default. This is more secure but is also less efficient.

SCP is designed for speed and efficiency. It is considered a solid, reliable, and straightforward way to copy files. But it is very basic in its functionality, and some security analysts have criticized it as inflexible and limited. For example, SCP does not interact properly with interactive shell profiles. SSH profile messages can also cause errors or connection failures. SCP does not allow users to list, delete, or rename files. Because of its limited functionality, some experts recommend SFTP and `rsync` instead.

{{< note >}}
No single protocol can be considered completely secure on its own. Before handling extremely sensitive data, consult with a security expert.
{{< /note >}}

## The Differences Between SCP and SFTP

SCP and the SSH File Transfer Protocol (SFTP) are two alternative methods of more securely copying files between different systems. Both protocols have their advantages. However, either option can be used in most cases. Following are some of the similarities and differences between the two systems.

- Both SCP and the SSH File Transfer Protocol (SFTP) are considered more secure than legacy protocols like FTP.
- Both protocols use TCP as their transport protocol. They both use port `22` by default.
- Both protocols rely on SSH for encryption and public key authentication. However, SCP only uses SSH as a supporting layer while SFTP is based on SSH. SSH is better integrated with SFTP than it is with SCP.
- Older releases of SCP had some security vulnerabilities. For instance, attackers could compromise an SCP server. However, new versions of SCP have fixed these issues. These issues were never present in SFTP.
- SCP is typically faster than SFTP. It uses a more efficient algorithm to transfer the files.
- SCP is optimized for one-time file transfers and works well with shell scripts.
- SCP works better on Linux systems, while SFTP is the standard for Windows.
- SCP is non-interactive, but SFTP permits interactive sessions. SFTP allows users to pause and resume file transfers.
- SFTP has additional file management features. It allows users to list, delete, and rename files. SCP is a simpler protocol that can only perform basic file transfers.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## SCP Basic Syntax

The `scp` utility implements SCP on Linux systems. It is typically included as part of the SSH package, and should already be installed on most distributions.

The `scp` syntax is not as complex as it first appears. A typical `scp` command consists of the following components, in the order below:

- The `scp` command keyword.
- One or more options.
- The path to the source file. For remote source files, the remote user account and host identifier must be specified. The full format for a remote source file is `username@hostid:file`.
- The location of the destination directory. For a remote destination, a username and server name/IP are required. The format for a remote destination directory is `username@hostid:directory`.

The `hostid` can be either a hostname or an IP address, and the remote `file` or `directory` must specify the full path.

The `scp` command syntax follows this format, with optional components enclosed in square brackets `[]`.

    scp [options] [source_username@source_host:]source_file [dest_userid@dest_host:]destination_dir

The `scp` command permits users to choose from a list of options. The most common `scp` options are as follows:

- **-C**: Compress the file data.
- **-i**: Use the specified private key for the remote system.
- **-l**: Set a bandwidth limit for the file transfer.
- **-P**: Use the specified port for SSH.
- **-p**: Copy over the file modification and access time.
- **-q**: Use quiet mode. Quiet mode suppresses the progress meter and informational messages. Error messages are still printed.
- **-r**: Copy directories recursively.
- **-v**: Print debug messages.

To use `scp`, the user must have read access for the files they are transferring and write permission on the destination directory. For authentication purposes, either an SSH key or user password is required for the destination. For more information on SSH, see the Linode guide to [Connecting to a Remote Server Over SSH on Linux](/docs/guides/connect-to-server-over-ssh-on-linux/).

{{< note type="alert" >}}
Exercise a high degree of caution when using `scp`. It does not provide any warnings or ask for confirmation before overwriting an existing file sharing the same name. It is very easy to accidentally overwrite files or directories, especially when using `scp` in recursive mode.
{{< /note >}}

### How to Transfer Files from a Local System to a Remote Server Using SCP?

The following principles apply when using `scp` to copy a file from the local host to a remote server:

- Use the syntax `scp [options] local_directory/local_filename remote_username@remote_host:remote_target_directory`.
- The full path of the remote directory must be specified. The local path can be either relative or absolute.
- Include the name of the user account for the remote system.
- The host can be identified by either its name or its IP address.
- A username or account is not required for the local file.
- The user must have read access to the files being transferred, and write access to the destination directory.

The following example copies a file named `file1.txt` to the `/backup` directory on the destination server. It specifies a username for the destination server, along with an IP address for the destination. To use the `scp` command on Linux to transfer a local file, follow the steps below:

1.  Enter the SCP information using the name of the local file and full details for the remote server.

        scp tmpdir/file1.txt remoteuser@192.0.2.254:backup

1.  Unless SSH is already using public keys, it prompts for a password for the remote system. Enter the password at the prompt.

    {{< output >}}
    remoteuser@192.0.2.254's password
    {{< /output >}}

1.  The system displays a progress bar indicating the amount of data that has been transferred. When the progress bar reaches `100%`, the transfer is complete.

    {{< output >}}
    file1.txt                                     100% 1000   313.4KB/s   00:00
    {{< /output >}}

1. (**Optional**) Access the remote server and confirm the file is now present.

To give the file a new name on the destination server, append a new name to the target directory. This command renames the copy of `file1.txt` to `file100.txt` on the destination server.

    scp tmpdir/file1.txt remoteuser@192.0.2.254:backup/file100.txt

Place any options between the `scp` command keyword and the name of the local file. The example below uses the `-r` option to recursively copy all the files from the local `tmpdir` directory to the destination directory.

    scp -r  tmpdir remoteuser@192.0.2.254:backup

{{< output >}}
file1.txt                                     100% 1000     1.6MB/s   00:00
newfile.txt                                   100% 1000   564.6KB/s   00:00
newfile.txt.bak                               100% 1000     1.9MB/s   00:00
{{< /output >}}

The default TCP port `22` can be overridden using the `-P` flag, for example, `scp -P 2000`. To execute the original `scp` example using port `2000`, use the following command:

{{< note >}}
SCP must be running on the specified port on the destination server.
{{< /note >}}

    scp -P 2000  tmpdir/file1.txt remoteuser@192.0.2.254:backup/file2.txt

The `scp` program can efficiently transfer multiple files at the same time. The following command copies `file1.txt` and `file2.txt` to the `backup` directory on the remote server.

    scp file1.txt file2.txt  remoteuser@192.0.2.254:backup

###  How to Transfer Files from a Remote System to a Local System Using SCP?

Transferring files from a remote system to the local system uses the same `scp` command. However, the remote server details are specified first. Enter the remote username, server details, source directory, and filename after any options. Then, specify the directory on the local host to copy the file to. The `scp` command follows the format `scp remote_userid@remote_host:remoteSourceDirectory/SourceFile local_directory`.

To copy a file from a remote system to the local system, follow the steps below. This example copies `file1.txt` from the `backup` directory of the destination system to the `archive` directory on the local computer.

1. Use the `scp` command to specify the username, identifier, and the full path to the file to transfer to the destination system. Then indicate the destination directory.

        scp remoteuser@192.0.2.254:backup/file1.txt archive

1.  When requested, enter the password for the remote system.

    {{< output >}}
    remoteuser@192.0.2.254's password
    {{< /output >}}

1.  When the progress bar indicates the transfer is `100%` complete, the file has been transferred.

    {{< output >}}
    file1.txt                                     100% 1000     2.2MB/s   00:00
    {{< /output >}}

1.  Confirm the file is now present on the local system.

The same options and syntax used when transferring a file to a remote system can also be used here. The following example recursively copies the entire contents of the `/backup` directory on the remote system to the local system.

    scp -r  remoteuser@192.0.2.254:backup archive

###  How to Transfer Files Between Two Remote Systems Using SCP?

The `scp` utility has an unexpected benefit that is not as widely known. It allows users to transfer files between two different remote servers from a third host. The command works the same way, except login and host details are required for both the source and destination servers. After entering the command, `scp` prompts for any required passwords.

    scp remoteuser@192.0.2.254:backup/file2.txt remoteuser2@192.0.2.251:secondarybackup/file3.txt

Some older implementations of `scp` transfer files directly between the source and destination routers. Traffic does not pass through the local host. For added security, traffic is routed through the local machine by default in more recent releases. To force traffic to be transferred through the local machine, use the `-3` option.

    scp -3 remoteuser@192.0.2.254:backup/file2.txt remoteuser2@192.0.2.251:secondarybackup/file3.txt

{{< note >}}
The source and destination systems might require an SSH key to authenticate. If `scp` displays any authentication errors, generate an SSH key on the source and share it with the destination server. Then try the command again. The local host and the source server should not require a shared SSH key and can authenticate using a password.
{{< /note >}}

## Use Cases for SCP

SCP is a straightforward copy utility. It works very efficiently and transfers files quickly. But it does not offer many options and does not work in interactive mode. Nor does it offer any management tools, such as the ability to list remote directories or delete files.

The main use case for SCP is for one-time transfers where speed is important. It is not as useful for more complicated tasks. In those cases, try SFTP instead.

## Concluding Thoughts About SSH

The SCP Linux utility is a more secure alternative to traditional applications like FTP. It can copy files between a local host and a remote server, or between two remote servers. The SCP protocol uses SSH as an underlying layer for authentication and encryption. SCP and SFTP are two methods of transferring files between servers. SCP is faster and simpler, while the more fully-featured SFTP provides an interactive mode and more management options.

On Linux systems, use the `scp` command to transfer files. Although it has a handful of options, `scp` is very straightforward to use. Details about the source file must be specified first, then information about the destination directory. To authenticate with a remote server, a username and host information must be included. Multiple files can be transferred at the same time, and directories can be recursively copied. For more information about the Linux `scp` command, consult the [Ubuntu man page for scp](http://manpages.ubuntu.com/manpages/focal/man1/scp.1.html).
