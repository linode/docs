---
slug: command-line-tools
author:
  name: Tom Henderson
description: 'What are the most useful Windows command line tools you need to know? Find out all you need to know with our beginner’s guide to command line tools.'
keywords: ['what is a command line tool','what are command line tools']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-14
modified_by:
  name: Linode
title: "The Best Command Line Tools for Windows"
h1_title: "Windows Command Line Tools: A Beginner’s Guide"
enable_h1: true
contributor:
  name: Tom Henderson
---

Windows command line applications perform many administrative tasks more quickly than their GUI equivalents. Microsoft Windows started as a DOS application, and the roots of DOS are in the ancient concepts of Unix, DEC’s RT/11, and CP/M. Everything from customization to encryption can be performed with the command line in current Windows 10 and 11. This Windows command line tool guide covers all versions of Windows 10 and 11. It includes many of the most useful commands to perform local administrative tasks that you need to know to navigate the shell.

This guide covers the following topics:

- Windows file system navigation
- Windows file management commands
- Task control
- Network utilities
- The `netsh` command
- Windows hardware management commands
- Windows command-line file encryption and decryption with the `cipher` command.

## What Are Command-Line Tools?

The command line is a terminal-like shell, and is different from Microsoft’s PowerShell. Many commands are common between the command line and Powershell, and both can be scripted into batch files for execution. The command line has directives that are built-in. The powershell is a programming language used to access applications programming interfaces (APIs) and communicate, modify, or examine them.

The commands listed in this guide are built into the command interpreter. If a command used is located in the file system and is disk based, permission is required to access the command. Most commands are located in the `\windows` directory and its subdirectories. If access is somehow limited to that directory, which is unusual, some commands listed in this guide won’t work. System administrator status may also be required to use certain commands.

Command line apps have an effect only on the machine where they’re executed. There is an exception, `netsh`, which is covered in this guide. Powershell commands can have an effect on an entire network when privileges are granted, through Microsoft’s Active Directory, for execution on filtered or qualified network assets.

You may require system administrator status to use a command. Command-line applications have two modes: *privileged*, and the user-privileged default, which is *unprivileged*. A privileged application is made using administrative mode. If a command fails, the cause of failure may be lack of administrator privileges.

To start the administrator-based command line, choose it by right clicking on the **CMD icon** in the **start menu**, and choose **Run as administrator**.

The command line can also be started from Windows Powershell, in either administrative mode or the same user privilege mode.

From Powershell, type:

    cmd<enter>

## Windows Command Line File System Navigation

Moving and managing files are important to programmers. Windows supports traditional file directives found in Unix and POSIX-like systems. These include the support of the `STDIN` and `STDOUT` logical devices. These commands allow program flow direction and indirection. The redirection operators used behave as follows:

To append a file to another file use the following command:

    TYPE FILE1 >> FILE2

To view the first screen of information for a file use the `MORE` command. Pressing the spacebar allows you to view the next screen of information.

    MORE < MYFILE.TXT

## List Directories

The `dir` command lists directories of local and shared resources. It uses the following syntax:

    dir [<drive>:][<path>][<filename>] [...] [/p] [/q] [/w] [/d] [/a[[:]<attributes>]][/o[[:]<sortorder>]] [/t[[:]<timefield>]] [/s] [/b] [/l] [/n] [/x] [/c] [/4] [/r]

Without any parameters, the `dir` command lists visible files in the current directory. The table below lists and explains the available options for the `dir` command.

| Option | Usage |
| ------ | ----- |
| `<drive>:` | Specify the drive for which you want to see a directory listing. |
| `<path>` | Specify the path for which you want to see a directory listing. |
| `<filename>` | Specify the file or group fo files for which you want to see a directory listing. |
| `/p` | Pause display after 24 lines (for long listings). Press any key to view the next 24 lines. |
| `/w` | Display the listing in two columns (for long listings). |
| `/o` | Lists files in the specified sort order. The sort order can be the following: `:e` (by file extension and alphabetically sorted), `:n` (by name and alphabetically sorted) `:s` (by size with the smallest first), `:g` (group directories first), `:d` (by date and time with the oldest first). Prefixing the `-` character reverses sort order. Arguments can be added together in desired sort order with no spaces. |
| `/a` | Filters the directory output based on the specified attribute(s). `:h` (hidden), `:n` (name), `:d` (directories), `:r`: read-only files, `:s` (system files), `:a` (files that can be archived), `:i` (not content indexed files).  |
| `/t` | Specifies the time field order to display or to use when sorting. `:c` (creation), `:a` (last accessed), `:w` (last written). |
| `/x` | Display the 8.3 equivalent of long filenames. |
| `/l` | Displays forced lower case (similar to `to_lower()`). |
| `/s` | Matches and lists the specified filename, recursively. |

## Windows File and Folder Traversal and Management Commands

The commands in this section are used to move around your file system and manage files and directories. Administrator privilege may be needed to execute some of the listed commands. Some file attributes might prevent you from performing some of the listed commands. The section that covers the `attrib` command shows you how to modify these file and directory attributes, if needed.

| Command | Usage |
| ------- | ------ |
| `cd <path>` | Change directory to a specific path  |
| `cd \` | Change to root directory of current drive |
| `cd ..` | Change the current directory's parent directory |
| `del <arguments>` | Deletes files by argument list |
| `rmdir <path>` | Remove directory from the given path. |
| `type <path-to-file>` | Display the contents of a file. |
| `more < filename or command` | Sends output to the console.  |
| `xcopy <origin> <destination>` | Copy files/directories recursively |
| `assoc <executable file>` | Specifies or shows file extension association for a file, similar to symlink. |
| `vol <default or specified drive>` | Displays disk volume label and serial number. |
| `taskkill` | Kill or stop a running process or application (by matching name). |
| `tree <default or specified path>` | Displays the directory/folder tree. |
| `rename <file argument>` | Renames file or files. |
| `mkdir <name>` | Makes a directory with `<name>`. |

## Windows Command Line Task Management

A list of Windows tasks can be found and managed with Windows Command Line tools. Like Linux/Unix, Windows displays the list of tasks by task name, a PID which is similar to a process ID, the entity launching the task, the session number, and the memory usage for each task.

To view the task list, pipe the list to the `more` command to view only several entries per screen:

    tasklist | more

Similarly, tasks can be killed with the following command:

    taskkill <task PID>

Use the `taskkill` command carefully since you can inadvertently cause function loss for child tasks, task dependencies. This can leave orphan processes, links, allocations, and system security holes.

## Windows Network Utilities

Basic network operations and host network infrastructure commands are available from the Windows command line. These command line tools are similar to their Unix equivalents.

| Command | Usage |
| ------- | ------ |
| `ping <host IP or FQDN>` | Sends an ICMP host-alive request to verify IP connectivity to another TCP/IP host. |
| `netstat` | List active TCP connections, open IP ports, Ethernet statistics, the IP routing table, IPv4 statistics, and IPv6 statistics. |
| `ipconfig` | Displays IPv4 and IPv6 addresses, subnet mask, and default gateway for all adapters. |
| `getmac` | Lists network adapter MAC address(es) |
| `arp <arguments>` | Displays and modifies entries in the Address Resolution Protocol (ARP) cache. Use `arp -a` to list the arp table |
| `tracert <host IP or FQDN>` | ICMP traceroute to specified host |
| `nslookup <host> <optional name source>` | Looks up specified host on optional name source or default name server path. |

## Using Netsh

Netsh is used for configuring, viewing, and diagnosing networking and network adapter settings. Once you've entered the netsh prompt, run commands individual netsh commands. Alternatively, include netsh commands in batch files or scripts. With the appropriate Active Directory credentials, NetShell is used to administratively control a local or remote computer.

NetShell features are encapsulated by dynamic-link library (DLL) files that make up a netsh context. Each context provides the appropriate commands for the networking server role that a server falls under. Additionally, each context offers its own set of subcontexts.

To enter the netsh prompt enter the following command:

    netsh

To view the available options for each context use the following command:

    netsh>/?

The list below includes several preliminary netsh options used when accessing a context.

| Options | Usage |
| ------- | ------ |
| `-a <alias for filename>` | The alias can run a batch-style number of commands used to set options for other workstations or commonly-used organizational settings; returns to netsh (see -f). |
| `-c <context name>` | Sets the current context. |
| `-r <remote computer>` | Designates the remote computer to configure. This can be specified by IP address, DNS, or AD name. |
| `-u <domainnaine or username>` | Designates the remote computer to configure. This can be specified by IP address, DNS, or AD name. |
| `-p <password>` | Provide a password for the user account. |
| `-f <alias for filename of script to process>` | Sets and executes a script name to process. Exits netsh upon completion. |

The list below includes some netsh commands that are useful for general server network administration:

| Options | Usage |
| ------- | ------ |
| `show advfirewall rules` | Displays current profile firewall rules. |
| `interface ip show interfaces` | Displays current profile interfaces and settings. |
|`wlan show networks` | Displays visible SSID wireless nets. |
| `wlan show show networks mode=bssid` | Displays wireless LAN connectivity characteristics |
| `interface TCP show global` | Display default TCP characteristics; use specific interfaces for specific driver info. |
| `show aliases` | Show aliases for debugging. |
| `int IP reset <logname.log>` | Reset the TCP/IP stack and designate the log file. |
| `trace start capture=yes tracefile=<logfile.log> persistent=y maxsize=8096` | Start a packet capture for debug into <logfile.log> with a size of 8MB. |
| `wlan disconnect` | Forces wireless network disconnection. |

## Windows Hardware Commands and Tools

Windows provides a robust set of commands used for hardware configuration, statistics gathering, and diagnostics. The following sections include some common Windows hardware commands and tools.

### The powercfg Command

The `powercfg` command helps diagnose power, sleep, and battery issues with a Windows computer. The `powercfg` command uses the following syntax:

    powercfg /option [arguments]

Some useful `powercfg` options are the following:

| Options | Usage |
| ------- | ------ |
| `/batteryreport` | Provides a report of battery usage. |
| `/systemssleepdiagnostics` | Provides diagnostic information about a system's sleep transitions. |
| `/energy` | Scans a system and detects. |
| `/devicequery` | Displays a list of devices that fulfill the specified criteria. The criteria is passed using arguments. For example, to view all system devices use the `all_devices` argument. |

### The systeminfo Command

The `systeminfo` command provides extensive details about your computer and its Windows operating system. It provides information on the user, operating system version, computer memory, applied hotfixes, network information, and more.

The `systeminfo` command's syntax is as follows:

    systeminfo [/s <computer> [/u <domain>\<username> [/p <password>]]] [/fo {TABLE | LIST | CSV}] [/nh]

Given the large amounts of information available to the `systeminfo` command, it supports various formatting and data output options. Use the `/fo` parameter to output your system information as a table, list, or comma separated values (CSV).

Use the `/s` parameter to access a remote computer using its name or IP address.

### The diskpart Command

The `diskpart` command is used to manage disks, partitions, volumes, and virtual hard disks.

In order to use the `diskpart` command, you must first list all of the available system *objects* and then select the object you wish to manage. For example, to list all system volumes, first enter the diskpart interpreter:

    diskpart

Then, use the `list` command to list your volumes

    list volume

Similarly, use the `list disk`, `list partition`, and `list vdisk` commands to view all other system objects.

To set your focus, use the `select` command and the object's corresponding number displayed in the `list` view.

    select volume 0

The `diskpart` command supports several parameters to complete common computer drive management tasks. Use the `create` parameter to create a partition on a disk, volume, or virtual hard disk. To format a disk to accept Windows files, use the `format` command. To remove a mount point from a volume use the `remove` command. To view a full list of all supported parameters, refer [Microsoft's official diskpart](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/diskpart) documentation.

## File Encryption with the cipher Command

Windows 10 uses a PKI certificate store. The certificate store includes a certificate used to encrypt files. The `cipher` command can be used to encrypt and decrypt files and directories.

Files and folders that are encrypted using the `cipher` command can be deleted, copied, and managed in the same way you would any other file. The keys used are the same keys used by many Microsoft applications. For example, Microsoft Word can decrypt, encrypt,manage, read, and write files and folders that are encrypted with cipher keys.

Key files must be backed up and stored safely. The command line allows you to export of key files, and provides a method to recover data from encrypted files if your keys are lost.

To encrypt files, use the `cipher` command with the following options:

| Options | Usage |
| ------- | ------ |
| `/e <filename(s) path>` | Encrypts the files specified. |
| `/d <filename(s) path>` | Decrypts the files specified. |
| `/b` | Used to abort if an error is found. |
| `/H` | Displays files with hidden or system attributes set.|
| `/S` | Performs the action recursively. |
| `/X <filename>` | Backup the encrypted file certificate into the target file. |
| `/Y` | Displays current users encrypted file system footprint on the local PC. |
| `/ADDUSER <username>` | Adds the specified user to the encrypted files.|
| `/REMOVEUSER <username>` | Removes the specified user from the encrypted files. |

## The Windows attrib Command

The `attrib` command is used to control and manage file metadata. The syntax for the `attrib` command is the following:

    attrib [{+|-}r] [{+|-}a] [{+|-}s] [{+|-}h] [{+|-}i] [<drive>:][<path>][<filename>] [/s [/d] [/l]]

The table below describes how to use the available `attrib` parameters.

| Parameter | Usage |
| ------- | ------ |
| `+r` or `-r` | `+r` adds read-only status and `-r` removes read-only status. |
| `+h` or `-h` | `+h` sets the hidden attribute and `-h` removes hidden status. |
| `+a` or `-a` | `+a` adds read-only status and `-a` removes read-only status. |
| `+i` or `-i` | `+i` sets content index and `-i` removes content index. |
| `+s` or `-s` | `+s` sets system file status and `-s` removes system file status. |
| `/s` | Sets the status recursively through subdirectories. |
| `/d` | Sets the status to directories. |
| `/l` | Sets the desired status and symbolic link, not its target |

## Conclusion

Windows command line tools provide more options when compared to the Windows GUI. Many system administration and diagnostic tasks can be completed with the wide-range of Windows command line tools that are available. Use command line tools in your batch scripts for a powerful system administration toolkit.