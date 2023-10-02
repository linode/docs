---
slug: using-mktemp-command
description: 'Learn how to use the mktemp command on an Ubuntu 20.04 Linode server. Using the mktemp command, you can create temporary files and directories.'
keywords: ['mktemp', 'mktemp bash', 'mktemp directory', 'tmpdir']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-19
modified_by:
  name: Linode
title: "Using mktemp Command to Create Temporary Files and Directories"
title_meta: "How to Use the mktemp Command to Create Temporary Files and Directories"
external_resources:
- '[Setting and Using Linux Environment Variables](/docs/guides/how-to-set-linux-environment-variables/)'
authors: ["Tom Henderson"]
---

The `mktemp` command is used in Linux and BSD derivative operating systems to create temporary files or directories. The temporary filename and directories can be named using a user-defined "template". This utility is installed by default on major Linux distributions.

Using `mktemp` varies from a traditional method of naming files using the PID in scripts. The use of `mktemp` command allows a naming convention in a script that can be controlled by the script, and is more unlikely to collide with an existing temporary file, thus avoiding inadvertent temp file overwriting, or other undesirable collisions.

This guide demonstrates where `mktemp` directives can be useful, and how to use templates to direct the formation of the file names.

## Linux Temporary File and Directories: Use Cases

Temporary files created by `mktemp` are owned by the user; commonly called from scripts to store data, in and among apps used within the script. It is a good practice to create temporary files in the `/tmp` directory, which is created by the operating system.

The `mktemp` command is different from the `touch` command. `mktemp` creates files or directories that are flexible. It has features to ensure the file names are unique, generated randomly, and reduces accidental overwrite, or incorrect manipulation of an existing file, or directory. The `touch` command modifies the timestamp of a file and is traditionally used to create permanent files, while `mktemp` is used to create temporary files.

A script or independent invocation of `mktemp` can also use a template that forms the names of the temp files and/or directories started by `mktemp`.

**Use Case #1 - Create A Simple Temporary File**

Invoking `mktemp` with no arguments creates a random file in the `/tmp` directory. The `/tmp` directory is the default directory for file creations unless specified otherwise.

```command
mktemp
```
```output
/tmp/tmp.df8N4EE9Y
```

**Use Case #2 - Create A Simple Temporary Directory**

The `mktemp` command with the `-d` argument creates a temporary directory in the `/tmp` directory.

```command
mktemp -d
```
```output
/tmp/tmp.df8N4EE9Y
```

By default, `mktemp` command generates a random name that can be customized by passing a template argument. The template requires a minimum of three 'X' characters to be specified which indicates the places to be occupied by random characters.

```command
tmp_dir=$(mktemp -d -t test-XXXX)
echo $tmp_dir
```
```output
/tmp/test-Xsd2ewsd
```

The `mktemp` command uses the currently set environment variable `$TMPDIR` to place a new temporary directory. The default `$TMPDIR` value found by most shell scripts is the `/tmp` directory, or the other choice is the `/var/tmp` directory. The difference between `/tmp` and `/var/tmp` is that the data stored in `/var/tmp` directory is preserved between reboots and is more persistent than the data in `/tmp`. `/var/tmp` is not usually subjected to `systemctl` extensions that may control temporary files.

### How mktemp Is Used By System Administrators

The `mktemp` command declares an explicit file or directory that is meant to be temporary. Although the `/tmp` directory is often used for temporary files, applications used by multiple users and/or similar processes may create files using the same filename. For example, a single process can execute independently to create a file that can read, write, update, or delete the same file. This may cause a filename conflict requiring an administrative effort to rectify the problem. But, when a script calls `mktemp`, a unique filename is created that is unlikely to collide with an existing filename or directory having the same name.

You can use `mktemp` independently or within scripts to:

- Create temporary files and/or directories
- Test whether temporary file and/or directory creation is possible
- Create file or directory names that follow a specific identity pattern with added random characters generated from an invocation-assigned pattern
- Change the `TMPDIR` environmental variable to a custom directory other than the default `/tmp`, with an optional pattern generated from an invocation-assigned pattern.
- Keep temporary files and directories protected as to the ownership of the user rights spawning the invocation of the command, so that other uses of the temporary files and directories created are protected from other scripts, processes, and filename collision caused by other users.

## How to Create a Temporary File

The exact `mktemp` syntax is described in the [man(mktemp) pages](https://man7.org/linux/man-pages/man3/mktemp.3.html). Most POSIX-compliant systems use the same syntax as shown in the table below:


| Command                       | Description                                                                 |
| ----------------------------- |-----------------------------------------------------------------------------|
| `mktemp`                      | Makes a temporary file in the default temporary directory                   |
| `mktemp -V`                   | Display mktemp version then exit                                            |
| `mktemp -d`                   | Make a directory in the default temporary directory                 |
| `mktemp -p` <directory path>  | (implies `-t`) Uses the <directory path> as a prefix; the `-t` option generates a path in the default temporary directory (as specified by the environmental variable `$TMPDIR`).                                     |
| `mktemp -q`                   |  Perform execution of the command quietly, meaning without success or failure messages                                                                                                      |
| `mktemp -t`                   |  Make a temporary filename, using a template, to be located in `/tmp` directory unless the `$TMPDIR` directory exists, and if it exists, make the file in the directory specified by the `$TMPDIR` value             |

## How to Create a Temporary Directory

When `mktemp` is invoked with the `-d` argument, it creates a directory in `/tmp`. If there is an environmental variable `$TMPDIR`, then it creates a directory in the `$TMPDIR` directory.

```command
mktemp -d
```
```output
/tmp/tmp.sdasdas
```


### How to Create a Temporary File Template

A temporary file template can be used to differentiate the source or criteria by naming the file with a template. The `mktemp` template uses the letter "X" to be replaced by a random character in place of the “X” when used as an argument. Up to ten “X” characters in a row, for a total of ten places can be randomized in this way.

The following command is used to create a file template, where "X" is replaced by randomized characters:

```command
mktemp -t random-XXXXXXXX
```
```output
/var/folders/gh/dbgxkdts6414dlmnflxbp2h80000gn/T/random-XXXXXXXX.4b5Dfmg4
```

The following command which uses the `-d` argument to `mktemp` produces a directory in the same way.

```command
mktemp -d random-XXXXXXXX
```
```output
random-13EL42PM
```

You can view the above newly created temporary directory using the `ls -la` command.

You can also add a suffix to a template while creating the directory as shown in the command below:

```command
mktemp -d --suffix TODAY
```
```output
/tmp/tmp.lmnflxbTODAY
```

## The TMPDIR Environment Variable

The `TMPDIR` environmental variable enables you to specify a different path for you to store the temporary files. It is stored in a list that is available to applications and shell scripts. The `TMPDIR` variable permits many applications to know where the administrator has designated the storage of temporary directories, especially if the designation varies from the default use of the `/tmp` directory. The `/tmp` directory in some instances may be placed on special media like an SSD for speed purposes. To understand more on environment variables, see the Linode's guide on [Setting and Using Linux Environment Variables](/docs/guides/how-to-set-linux-environment-variables/).

On some Linux systems, the `TMPDIR` file is called or declared by `systemd-tempfiles`, a daemon that can be set to periodically clean files by creation date, or other attributes not covered in this guide.

If the `TMPDIR` variable is changed, its value may only survive for the current session of the user or PID. When you reboot the system, it may default to `/tmp`, or the setting called by the `systemd-tempfiles.conf` file. When you restart a system or a session, or any other event, the `TMPDIR` is restored to its previous value.

The `mktemp --tmpdir` argument changes the destination relative to the value set by the `$TMPDIR` value set in the environment.

In the example command below, the `$TMPDIR` value is changed to a subdirectory, and `mktemp` applies its files to the new path:

```command
$TMPDIR=(mktemp -d)
```

Template and other arguments could also be added to change the `$TMPDIR` value. An example of a date-codified directory is shown below.

```command
root@localhost:/home# tmpdir=$(mktemp -d -t ci-$(date +%Y-m-%d-%H-%M-%S)-XXXXXXXXXX)
root@localhost:/home# echo $tmpdir
```
```output
/var/folders/gh/dbgxkdts6414dlmnflxbp2h80000gn/T/ci-2022-m-28-22-46-25-XXXXXXXXXX.6lR6R7Az
```

## How to Delete Your Linux System’s Temp Files

Cleaning the temporary files depends on the Linux version you are using. Current Linux systems using *systemd* use a process called *systemd-tempfiles*. Depending on the system version, and its implementation, the files, and process used for cleaning the temporary files, and directories have different configurations.

It is a good practice to delete the temporary files in the `/tmp` directory of your system frequently. This takes up unnecessary space that could be used for other data or processes. Generally, files in the `/tmp` directory are removed by your system after every reboot.

{{< note >}}
The temporary files in the `/var/tmp` directory are usually preserved between system reboots and are made available to the programs that require temporary files. The data stored in the `/var/tmp` is more persistent that the data in the `/tmp` directory.
{{< /note >}}

The following section describes the different ways in which you can delete temporary files from your system.

For the currently logged-in user, where the user has no other active processes, the `/tmp` directory is deleted by invoking the following command:

```command
rm -rf /tmp
```

This deletes all `/tmp` files recursively through subdirectories and forces the deletion of all files for which the user has privileges. If the user is the root or sudo, then all files may be deleted, and this can be disruptive. Depending on the currently logged-in user rights, the `rm -rf /tmp` command may destroy files and directories that are otherwise in use.

You can also use the prebuilt `find` command that is available in almost every Linux distribution. The `find` command allows you to find the files and directories that satisfy a specific condition. For example, the following `find` command finds and deletes all the temp files in the `/tmp` directory.

```command
sudo find /tmp -type f -delete
```

The `trap` command can be used to manage the deletion of files made within a script. When the shell has finished its execution, the `trap` command allows the specified temporary files to be deleted.

For example, if your script creates a temporary file and you want to delete it at each place where you exit your script, you can include a `trap` command at the start of your script that deletes the file on exit:

```file
tempfile=/tmp/tmpdata
trap "rm -f $tempfile" EXIT
```
