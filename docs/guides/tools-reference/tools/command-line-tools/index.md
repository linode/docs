---
slug: command-line-tools
title: "Windows Command Line Tools: A Beginner’s Guide"
title_meta: "The Best Command Line Tools for Windows"
description: 'What are the most useful command line tools you need to know? Find out all you need to know with our beginner’s guide to command line tools.'
keywords: ['command line tools', 'best command line tools for windows', 'best command line tools linux', 'useful command line tools']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-06-21
modified_by:
  name: Linode
---

## What Are Windows Command-Line Tools?

Command-line tools are a terminal-like shell, separate from Microsoft's PowerShell, with some shared commands and scripting capabilities. While the command line has built-in directives, PowerShell serves as a programming language for accessing APIs and performing communication, modification, and examination tasks.

Commands listed here are either built-in or specific to the command line interpreter. Access permissions are required for disk-based commands located in the file system, mainly in the `\windows` directory and its subdirectories. The command line apps affect only the executing machine, except for `netsh`. PowerShell commands can have network-wide effects where privileges are granted through Microsoft’s Active Directory for execution on filtered or qualified network assets.

Command usage may require system administrator status. Command line applications have privileged and unprivileged (default) modes, where privileged mode requires administrative access. A lack of administrator privileges can cause command failures.


To open the administrator-based command line, right-click on the CMD icon in the start menu and choose "Run as administrator". PowerShell can also launch the command line in either administrative or user privilege mode by typing `cmd` within it.


## Windows Command Line File System Navigation

File system navigation and file management are important to programmers. In Windows, you can use commands that are similar to those found in Unix and Posix-like systems. These commands also support the use of logical devices such as `STDIN` and `STDOUT`, allowing for program flow control and redirection:

- To append the contents of `FILE1` to `FILE2`, you can use the following command:

  ```command
  TYPE FILE1 >> FILE2
  ```

- To invoke the `MORE` filter and use `MYFILE.TXT` as the input source, you can use the following command:

  ```command
  MORE < MYFILE.TXT
  ```

- Similarly, to invoke the batch file `MYBATCHFILE.BAT` and provide `MYLIST.TXT` as input, you can use the following command:

  ```command
  MYBATCHFILE.BAT < MYLIST.TXT
  ```

### Finding Files

The `dir` command lists directories of local and shared resources:

```command
dir [<drive>:][<path>][<filename>] [....] [/p] [/q] [/w] [/d] [/a[[:]<attributes>]] [/o[[:]<sortorder>]] [/t[[:]<timefield>]] [/s] [/b] [/l] [/n] [/x] [/c] [/4] [/r]
```

The `dir` command alone lists visible files in the current directory. Each option is explained below:

| Option       | Description                                                                                                                 |
|--------------|-----------------------------------------------------------------------------------------------------------------------------|
| `<drive>:`   | When a drive letter is expressed, list directory of that drive                                                              |
| `<path>`     | Same as above, with a direct folder path specified                                                                          |
| `<filename>` | Same as `<path>` with a specific file                                                                                       |
| `/p`         | Pause display after 24 lines (for long listings)                                                                            |
| `/w`         | Display in two columns (for long listings)                                                                                  |
| `/d`         | Adds sorting by columns in wide format of `/w`                                                                              |
| `/a`         | (By attribute): `:h` (hidden), `:n` (name), `:d` (date), `:s` (size), `:G` (Group directories first), `:e` (extension sorted by alpha), `:s` (system), `:a` (archive bit set), `:i` (not content indexed files), `:l` (reparse points)                                    |
| `/o`         | (In sort order): `:e` (extension sorted by alpha), `:s` (system), `:a` (archive bit set), `:i` (not content indexed files), `:l` (smallest first). The "-" character reverses sort. Arguments can be added together in desired sort order with no spaces.                |
| `/t`         | (Time field order): `:c` (created), `:a` (last accessed), `:w` (last written)                                               |
| `/x`         | The 8.3 equivalent of long filenames                                                                                        |
| `/l`         | Displays forced lower case (similar to `to_lower()`)                                                                        |
| `/s`         | Displays matching contents in subdirectories; recursive                                                                     |

## Quick File/Folder Transversal and Management Commands

To work with the file system and perform various operations, you can utilize the commands below. Some commands may require administrator privileges to execute, and certain file attributes can restrict your ability to perform specific tasks. This section also covers the `attrib` command, which allows you to modify file and directory attributes to ensure the successful execution of command directives.

| Command                     | Description                                                        |
|-----------------------------|--------------------------------------------------------------------|
| `cd <path>`                 | Change directory                                                   |
| `cd \`                      | Change to the root directory of the current drive                  |
| `cd ..`                     | Move up one directory                                              |
| `del <arguments>`           | Delete files based on the argument list                            |
| `rmdir <path or default>`   | Remove a directory (use `/r` for recursive removal)                |
| `type <filename>`           | Display the contents of a file (similar to `cat` command)          |
| `more <filename>`           | Display the contents of a file page by page                        |
| `xcopy <origin> <destination>` | Copy files and directories recursively                          |
| `assoc <executable file>`   | Specify or show file extension association for a file              |
| `vol <default or specified drive>` | Display the disk volume label and serial number             |
| `taskkill`                  | Terminate or stop a running process or application (by matching name)
|
| `tree <default or specified path>` | Display the directory tree structure                        |
| `ren <file argument>`       | Rename a file or files                                             |
| `md or mkdir <name>`        | Create a new directory with the specified name                     |


## Windows Command Line Task Management

Windows Command Line Tools provide the capability to view and manage a list of tasks. Like Linux/Unix, Windows delivers the list of tasks by task name, a PID which is similar to a process ID, the entity launching the task, the session number, and the memory usage for each task.

To view the list, you can use the `tasklist` command and pipe the output to the `more` command for better management of entries per screen. Here's an example:

```command
tasklist | more
```

To terminate a task, you can use the `taskkill` command followed by the task's PID.

{{< note type="warning">}}
Killing a task may result in loss of functionality, including any child tasks or task dependencies. This can lead to orphan processes, broken links, resource allocations, and potential security vulnerabilities. Always use the `taskkill` command with care.
{{< /note >}}

```command
taskkill <task PID>
```

## Network Utilities

Basic network operations and host network infrastructure commands are available from the Windows Command Line. These command line tools are similar to their Unix equivalents.

| Command                    | Description                                                                                 |
|-----------------------------|--------------------------------------------------------------------------------------------|
| `ping <host IP or FQDN>`    | ICMP host-alive request (IPv4 or 6)                                                        |
| `netstat`                   | List open IP ports                                                                         |
| `ipconfig`                  | Show IP configuration                                                                      |
| `ipconfig /?`               | Show help options                                                                          |
| `ipconfig /release`         | Release current DHCP lease                                                                 |
| `ipconfig /renew`           | Seek IP DHCP address                                                                       |
| `getmac`                    | Lists network adapter MAC address(es)                                                      |
| `arp <arguments>`           | Address Resolution Protocol suite                                                          |
| `tracert <host IP or FQDN>`  | ICMP Traceroute to specified host                                                         |
| `nslookup <host> <optional name source>` | Looks up specified host on <optional name source or default name server path> |


## Using Netsh

The `netsh` (NetSHell) is a powerful command-line tool in Windows used for configuring, viewing, and diagnosing networking and network adapter settings. While it can currently be used on the command line, Microsoft warns that these contexts may be switched to be invoked only from PowerShell.

Various `netsh` commands can be combined into batch scripts and called from the command line. If you have Active Directory credentials and network paths, you can use `netsh` to control other computers administratively.

The `netsh` shell has several contexts associated with networking services and APIs. Each context has subcontexts with varying arguments based on the requirements of the context.

The following contexts are available on Windows 10: `wlan` (wireless LAN), `winsock`, `wfp`, `wcn`, `trace`, `rpc`, `ras`, `p2p`, `netio`, `namespace`, `mbn`, `lan`, `ipsec`, ``interface``, `http`, `dnsclient`, `bridge`, `branchcache`, and `advfirewall`.

The available subcontexts include: `Advfirewall`, `branch cache`, `bridge`, `dhcpclient`, `dnsclint`, `firewall`, `htp`, `interface`, `ipsec`, `lan`, `mbn`, `namespace`, `netio`, `p2p`, `ras`, `rpc`, `trace`, `wcn`, `wfp`, `winhttp`, `winsock`, and `wlan`.


To explore the options of each subcontext, you can query the `netsh <subcontext>` with the "`/?`" command for help. This provides a list of possible arguments, making it easier to complete non-obvious commands. Netsh has arguments that perform important actions which are listed below:

- `-a` : The alias for filename. The alias can run a batch-style number of commands that set options for other workstations or commonly-used organizational settings; returns to netsh (see `-f`).
- `-c` : Sets the current context
- `-r` : Sets the target of the context and subcontext used by the remote computer running the remote registry, specified by IP address, DNS, or AD name
- `-u` : Sets the user context for targets of other `netsh` options/arguments using the specified username\DomainName
- `-p` : Password for the `-u` argument
- `-f` : Sets and executes a script name to process but exists `netsh` upon completion; alias for the filename of the script to process
- `/?` : Help

The most commonly used netsh commands begin with `netsh`:

- `netsh show advfirewall rules`: Displays current profile firewall rules
- `netsh interface ip show interfaces`: Displays current profile interfaces and settings
- `netsh wlan show networks`: Displays visible SSID wireless networks
- `netsh wlan show show networks mode=bssid`: Displays wireless LAN connectivity characteristics
- `netsh interface TCP show global`: Display default TCP characteristics; use specific interfaces for specific driver info
- `netsh show aliases`: Show aliases for debugging
- `netsh int IP reset <logname.log>`: Reset the TCP/IP stack with a log (log for troubleshooting)
- `netsh trace start capture=yes tracefile=<logfile.log> persistent=y maxsize=8096`: Start a packet capture for debug into <logfile.log> with a size of 8MB.
- `netsh wlan disconnect`: Forces wireless network disconnection

## Windows Hardware Commands and Tools

Windows has commands that query hardware, change settings, encrypt files, and others that diagnose problems. The diagnostics report problems that the GUI doesn’t tell you about.

### Windows Command Line powercfg

The `powercfg` command helps diagnose power, sleep, and battery issues. To use it, open the command line with administrator privileges and enter the following command:

```command
powercfg /energy
```
Other handy arguments that you can use with `powercfg` are:

- `/batteryreport`: Generates a detailed report about your battery's usage and status.
- `/systemssleepdiagnostics`: Provides information and diagnostics about system sleep transitions.
- `/powerthrottling`: Manages power-throttling settings to optimize power usage for applications and processes.
- `/devicequery`: Lists power-related information for devices connected to your system.

### Windows Command Line systeminfo

The `systeminfo` command provides detailed information about the host's platform, user, version, boot information, memory, applied hotfixes, network details, and Hyper-V requirements state. To use it, you can open the command line or CMD and enter the following command:

```command
systeminfo | more
```

This command displays the system information in a paginated manner, allowing you to scroll through the output. You can also redirect the output to a file by using the `>` operator followed by the file path.

### Windows Command Line diskpart

The `diskpart` command is used to find and manipulate disk information in the Windows command line. It allows you to examine and repair volumes, including RAID volumes that are compatible with this command. To view the available options, you can use the following command:

{{< note type="warning">}}
It's important to exercise caution when using the `diskpart` command, as some options have the potential to render the current session and host unusable.
{{< /note >}}

```command
diskpart /?
```

This command displays a list of options and commands that can be used with `diskpart`.


## Command Line File Encryption

In Windows 10, file encryption is facilitated through the use of a Public Key Infrastructure (PKI) certificate store. This store contains a certificate that is responsible for encrypting files. Windows command line tools provide a method for encrypting and decrypting files and directories using this certificate. The `cipher` command is used for encryption operations, and proper encryption management practices must be followed to ensure successful usage.

Files and folders that are encrypted using `cipher` can be deleted, copied, and can be managed in the same way as other files. The encryption keys used by cipher are the same keys utilized by many Microsoft applications. For instance, Microsoft Word can decrypt, encrypt, and perform various operations on files and folders that have been encrypted with cipher keys.

The keys are files, and the key files must be backed up and stored safely. The command line provides options to export these key files and offers a way to recover data from encrypted files in case the keys are lost or inaccessible.

To encrypt files, you can use the `cipher` command with the following options:

- `/e <filename(s) path>`: Encrypts the specified files.
- `/d <filename(s) path>`: Decrypts the specified files.
- `/b`: Aborts the operation if an error is encountered.
- `/H`: Displays files with hidden or system attributes set.
- `/S`: Performs the action recursively on all files and subdirectories.
- `/X <filename>`: Backs up the encrypted file certificate into the target file.
- `/Y`: Displays the current user's encrypted file system footprint on the local PC.
- `/ADDUSER <username>`: Adds a user to the encrypted files.
- `/REMOVEUSER <username>`: Removes the `/ADDUSER` attribute for the specified user.
- `<no arguments> <directory name path>`: Displays the encryption state of the current directory.

### Windows Command Line Attrib Command

The `attrib` command in the command line allows you to control how file metadata is displayed and managed. It provides a quick way to query and change file attributes without relying on the Windows GUI.

To query the attributes of a file, use the following command:

```command
attrib <options> <file path>
```

By using the appropriate options with the `attrib` command, you can save considerable time and easily manage file attributes. Refer to the table below for the available options:

| Option   | Description                                                        |
| -------- | ------------------------------------------------------------------ |
| +r or -r | +r adds read-only status and -r removes read-only status           |
| +h or -h | +h sets the hidden attribute and -h removes hidden status          |
| +a or -a | +a sets archive status and -a removes archive status               |
| +i or -i | +i sets content index and -i removes content index                 |
| +s or -s | +s sets *system file* status and -s removes *system* status        |
| /s       | Sets the desired status recursively through subdirectories         |
| /d       | Sets the desired status to directories                             |
| /l       | Sets the desired status and symbolic link, not its target          |


## Conclusion

Windows Command Line Tools can be far faster, and in some cases replicated more quickly, than using the Windows GUI. In some cases, their depth of options can exceed what can be done with the Windows GUI.

You can complete a healthy amount of systems administration and trouble diagnosis with Windows Command Line tools. Combining command line tools into useful batch scripts can be handily accomplished, and become part of your toolkits, too.
