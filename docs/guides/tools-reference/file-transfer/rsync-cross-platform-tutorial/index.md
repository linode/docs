---
slug: rsync-cross-platform-tutorial
description: 'Learn the different usages of rsync and some of the common mistakes that you avoid while using rsync.'
keywords: ['remote sync', 'archive', 'recursion', 'synchronize directory structures', 'remote host']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-20
modified_by:
  name: Linode
title: "Rsync Cross Platform Tutorial"
title_meta: "Using the Rsync Cross Platform Command-Line Utility"
external_resources:
- '[Rsync options from Linux Man page](https://linux.die.net/man/1/rsync)'
authors: ["Tom Henderson"]
---

This guide covers the remote sync `rsync` tool on Linux and other *nix* platforms. The `rsync` tool is a highly flexible command-line utility that manages file movement, in and among hosts. It is implemented on most supported systems with predictable results and very few inter-version problems between hosts.

The `rsync` tool can run as a server, client, or daemon. When used within the confines of a single host, `rsync` is always a server or a daemon. When used across and between hosts, `rsync` establishes a single duplex (bi-directional connection) between hosts.

Rsync is used to move files, groups of files, and directories, to and from other areas. It does not compress or decompress files by default, nor does it encrypt or decrypt files.

A wide variety of filters can be added to the `rsync` command line. File management jobs with `rsync` are controlled by cron or other timing software. `Rsync` is called from shell scripts instantiated with cron, automating file and directory movement on queue. When `rsync` is called from a script, that script must be marked as executable in the host operating system; how this is done varies by the operating system.

On Linux and Unix-derivative operating systems, file movement is accomplished with FTP/SFTP, `scp`, `cp`, `mv`, and other tools, but these lack `rsync` file filters and options. Rsync jobs permit strong filtration and tailoring for backup, data file set synchronization and archiving using these filters. Importantly, `rsync` does not require root or sudo permission(s) although they are confined by the user permissions of the account invoking `rsync`.

To learn more about `rsync`, see our [Introduction to Rsync guide](/docs/guides/introduction-to-rsync).

## Basic Command Syntax and Implications

`Rsync` is a command-line utility for synchronizing files and directories between two hosts or machines over a remote shell. It provides an incremental file transfer that copies only the differences between the two hosts. The basic syntax of `rsync` for copying files locally is as follows:

```command
rsync -[OPTIONS] source destination
```

For a local to remote file transfer, you can use the following syntax:

```command
rsync -[OPTIONS] source [user@]host:destination
```

For a remote to local file transfer, you can use the following syntax:

```command
rsync -[OPTIONS] [user@]host:source destination
```

From the above commands:
- `OPTIONS` - `rsync` provides several [options](https://linux.die.net/man/1/rsync) for controlling the command behavior.
- `source`- the source directory
- `destination` - the destination directory
- `user` - the remote username
- `host` - Remote hostname or IP address

{{< note type="warning" >}}
A trailing `/` appended to the source creates a directory underneath the target destination directory.
{{< /note >}}

Some of the commonly used `rysnc` options are discussed below.

### Recursion

The `rsync` tool does not include all subdirectories of the source argument unless a recursion option is chosen. To invoke recursion, the `-r` option is used; the syntax is as shown below:

```command
rsync -r source destination
```

Where `rsync` gathers the source directory and all of its subdirectory structure and files and then places it in the destination directory recursively.

Consider the following `rsync` example with the `-r` option used:

```command
rsync -av /var/opt/rsync-test/ /var/tmp/
```

```output
building file list ... done
sent 3512383 bytes  received 20 bytes  7024806.00 bytes/sec
total size is 2173344410  speedup is 618.76
```

### Archive

The archive option of `rsync` performs file movement into an archive and does so recursively (meaning no `-r` option is required). To invoke archiving, the `-a` option is used. Additionally, `-a` option preserves symbolic links, groups/owners/permissions mask, and file modification timestamp.

```command
rsync -a source destination
```

Consider the following `rsync` example with `-a` option used:

```command
rsync -av /var/opt/rsync-test/ /var/tmp/
```

```output
building file list ... done
./
...
...
sent 515963067 bytes  received 275938 bytes  20244666.86 bytes/sec
total size is 2173344410  speedup is 4.21
```

In the above example, `-v` option indicates verbosity, which displays more information about files being transferred. By default, `rsync` works silently. You can see from the below command that `rsync` preserved groups and owners' permissions, timestamp, etc

```command
ls -l /var/tmp/
```

```output
total 0
drwxr-xr-x  4 user4  staff  128 Dec  9  2021 tmp
```

## Null Output or DryRun, and Verbose

Using the `rsync` tool with its many options and filters produces tailored results. Until an administrator refines the tool, it is also easy to misuse. For this reason, some options allow trial operation of a command-line invocation of `rsync` and its results. The null output, invoked by `-n` option is the same as the `–dry-run` option and shows the output of the test. With the dry run option, `rsync` processes, and executes the command without actually performing a file movement action, and allows the output of the job as though the job was executed– but it’s not.

```command
rsync -n  source destination
```

or

```command
rsync –dry-run source destination
```

The above commands show the output result of the `rsync` job specified without performing the rsync job. It’s used in conjunction with the `-v` argument to show the result of the other options chosen in the `rsync` command-line execution. For example, the command below shows the verbose output of the job with additional options and filters without actually performing them.

```command
rsync -av /var/opt/rsync-test/ /var/tmp/
```

```output
created directory /Users/user4/temp/resources

sent 21 bytes  received 20 bytes  82.00 bytes/sec
total size is 0  speedup is 0.00
```

This is used to test complex filtration, permissions, or the nature of errors that might be unexpected in the rsync job.

## Common Usage Profiles

Each of the following examples uses `rsync` with options and/or filters which can be further refined by the many possible combinations of options and filters. All uses of the `rsync` tool, simple or complex, can be tested before execution by adding the `-n`, or `–dry-run` option to view the results.

### Local Backup To A Mounted Drive

A common `rsync` use is a user space backup to a mounted USB, Flash, or SSD that is attached to the user’s host.

```command
user4@ournet~$ rsync -auvzh ~ /mnt/user4/MyUSBDrive/
```

The above command copies the `~` (`/home/user4`) directory recursively (`-r` is implied by `-a`), in an archive, using compression (`-z`), and shows the output in human-readable form (`-h`) to the destination drive `/mnt/user4/MyUSBDrive` in the root directory. The `-u` option skips a transfer of a file when the target destination (in this case, the mounted drive) has a filename that’s newer or the same as the file that would be copied from the `~` source directory.

To copy only the `.mp3` files from the user’s directory, a rsync directive would look like the following:

```command
user4@ournet~$ rsync -auvzh ––include “*.mp3” ~ /mnt/user4/MyUSBDrive
```

The `–include` option also has an analog argument available, `–exclude`. There are many additional arguments and regular expressions that can be used and are described in the [Linux man pages](https://linux.die.net/man/1/rsync).


### Synchronize Directory Structures

The `rsync` tool can be used as a directory structure replicator for coding purposes, or for ensuring that target directory structures exactly mimic the source. Replications are often performed synchronizing to remote locations, and updates to IoT devices. The command below sends an archival treatment (ownership, time/date/etc) to the `user4_data_host` user at `ournet.foo` host into a `sync_dir` directory.

```command
rsync -a --update --delete /home/user4 user4_data_host@ournet.foo:/home/user4/sync_dir
```


### Remote Hosts

The `rsync` tool uses RSH or SSH as transports. Most implementations use SSH by default when moving files and directories between remote hosts. The `-e` argument allows a specific transport to be specified as the network path between hosts.

For example, the `rsync` command below invokes SSH using the target host’s port `2222` as its access point. The files in the `/usr/bin` source are sent with archive attributes, verbosely, with compression, and human-readable output to the destination on the target host.

```command
rsync -avzh -e “ssh port=2222” /usr/bin user4@remotehost.something:/usr/bin
```

The `rsync` tool requires a login to the host immediately, and unless SSH credentials are synchronized between a source host and target host, rsync asks for a correct password, and halts immediately if the password is incorrect, and without an SSH failure message.


### Distribute Data Sets

The `rsync` tool permits only one target or destination host per job. Using bash or another scripting tool allows multiple `rsync` jobs to be sent to the desired list of hosts. The syntax is dependent on the scripting language used. Care must be taken if a perfect synchronization is to be performed (a fully congruent data set sent to the list of hosts). The source data to be replicated must be either isolated or otherwise frozen until all jobs are completed, and all target or destination hosts are synchronized without error.

## Avoiding Common Mistakes

### Always Trial Run First

The `rsync` tool options can delete source files as well as target files if the wrong options are chosen. It is a best practice to always run a trial job before executing the actual job using the `-n` or `–dry run` options, then view the output. The `-logfile` option can log a `rsync` job in several levels of depth. Running a trial and looking at the results carefully finds bugs in the syntax that could be fatal or have unexpected/undesired results.

### Inter-Operating System Issues

The `-a` archive option of `rsync` captures and transfers a wide variety of metadata about files, folders, devices, and other file objects. The metadata information, including ownership, groups, and other information may, or may not, transfer between different operating systems and their versions. For example, file ownership and other information may not be transferred in the archive created during a `rsync` job between FreeBSD and Linux operating systems.

## Sender/Recipient Permissions

Any script invocation must also have the desired user permissions. This requires the use of the `sudo` command to have the permissions necessary to both read source and source metadata, and also write files/directories/metadata at the target host. Both the user at source and the user at destination/target must have sufficient permission to perform the actions dictated by the `rsync` job.

### Symbolic Links

Symbolic links are used as pointers to other places. When `rsync` encounters them, they are stored as a hard link by default. This makes the link restorable. If distributed to other systems, the chance of a hard link working within that system may, or may not, work for several reasons. The `–munge` option of `rsync` allows the link to become relative to the target system. The man page for `rsync` explains the implications, which must be explored if symlinks are to be transferred and re-used with `rsync`. Unlike other troubleshooting, the implication of replicated hard symbolic links must be explored, as symlinks may, or may not, work on the target system.


## Additive Versus Synchronized Backup

The `rsync` tool can make additive backups/copies, where successively added source host file objects are added iteratively to the target or replaced them. The source accumulates files that have been deleted on the source host. These accumulated files may, over time become clogged with files that no longer exist on the host source.

The `–delete` option permits the deletion of files not found on the source host so that the destination/target host isn’t clogged with files that no longer exist. When using the `-delete` option, using `-n` or `–dry-run` option is strongly suggested to ensure that needed files on the destination/target host are not deleted.

## Conclusion

The `rsync` tool uses similar syntax as the `rcp` tool but, `rsync` has a wide variety of options. The power of `rsync` allows it to be used for local backup, backup to a remote host, or the synchronization of file structures in hosts. The synchronization feature can be used to remotely seed hosts with file structures, as a replication of infrastructure in the target/synchronized host.

The use of `rsync` should be performed after a trial, as `rsync` is capable of deleting and altering the source host and/or target host. The backups that are performed can be placed in a shell script, and this shell script can be managed by other tools, such as cron/crontab for automation purposes.
