---
slug: ls-command-in-linux
title: "9 Ways to Use the Ls Command in Linux"
title_meta: "Ls Command in Linux: Listing Files & Directories"
description: 'The Ls command in Linux is useful for listing files and directories, as well as displaying detailed info. ✓ Read our guide to learn how to use the Ls command!'
keywords: ['ls command in linux','ls command','linux ls','linux ls command','what is ls','cmd ls','ls bash','ls output','linux ll command','linux ll']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
modified_by:
  name: Linode
published: 2023-04-11
external_resources:
- '[freeCodeCamp: The Linux LS Command – How to List Files in a Directory + Option Flags](https://www.freecodecamp.org/news/the-linux-ls-command-how-to-list-files-in-a-directory-with-options/)'
- '[TechMint: 15 Basic ‘ls’ Command Examples in Linux](https://www.tecmint.com/15-basic-ls-command-examples-in-linux/)'
---

## What is the `ls` Command in Linux?

The `ls` command line utility lists all the files and directories under a specified directory. By default, `ls` uses the current directory and lists files and directories in alphabetical order by name. The `ls` command supports many flags that modify its behavior.

`ls` first appeared in version 1 of AT&T UNIX. Today, it is included in all Linux distributions, all BSD distributions, and all Unix-like operating systems, including macOS (Darwin) and the Windows Subsystem for Linux (WSL). Today it is part of the GNU coreutils project.

{{< note >}}
The `ls` command's supported options may vary among OS versions and distributions.
{{< /note >}}

## 9 Ways to Use the `ls` Command

`ls` can output data in a variety of styles depending on the option flags chosen and which command it is piped into. The examples that follow represent common scenarios and use cases.

### List Files and Directories

Without any arguments or option flags, `ls` lists the contents of the current directory in a short, alphabetized, columnar format.

Before continuing, change into a directory with contents, such as `/bin`:

```command
cd /bin
```

Now run `ls` from within `/bin`:

```command
ls
```

```output
'['                                  os-prober
aa-enabled                           pager
aa-exec                              partx
aa-features-abi                      passwd
add-apt-repository                   paste
addpart                              pastebinit
addr2line                            patch
apport-bug                           pathchk
apport-cli                           pbget
apport-collect                       pbput
...
```

{{< note >}}
Some of the output in this guide has been truncated with `...` to limit the size of the examples, which can be quite long.
{{< /note >}}

To specify the directories you wish to list, add directory paths as arguments to the `ls` command. The next example ran in the user’s home directory but lists both the `/bin` and `/sbin` directories.

Before running this command, return to your user's home directory:

```command
cd ~
```

Now run `ls` with arguments of `/bin` and `/sbin`:

```command
ls /bin /sbin
```

```output
/bin:
'['                                  os-prober
aa-enabled                           pager
aa-exec                              partx
aa-features-abi                      passwd
add-apt-repository                   paste
addpart                              pastebinit
addr2line                            patch
apport-bug                           pathchk
apport-cli                           pbget
apport-collect                       pbput
...

/sbin:
aa-remove-unknown      init                         pvmove
aa-status              insmod                       pvremove
aa-teardown            installkernel                pvresize
accessdb               integritysetup               pvs
addgnupghome           invoke-rc.d                  pvscan
addgroup               iotop                        pwck
add-shell              iotop-py                     pwconv
adduser                ip                           pwunconv
agetty                 ip6tables                    readprofile
apparmor_parser        ip6tables-apply              reboot
...
```

### List Files Recursively

The `-R` option instructs `ls` to list subdirectories recursively:

```command
ls -R /usr
```

```output
/usr:
bin    include  lib32  libexec  local  share
games  lib      lib64  libx32   sbin   src

/usr/bin:
'['                                   os-prober
 aa-enabled                           pager
 aa-exec                              partx
 aa-features-abi                      passwd
 add-apt-repository                   paste
 addpart                              pastebinit
 addr2line                            patch
 apport-bug                           pathchk
 apport-cli                           pbget
 apport-collect                       pbput
 apport-unpack                        pbputs
...
```

The output from `ls -R` can be quite long, making it less useful for deep directory trees. To make the output more readable, you can increase the size of the scrollback buffer in your terminal, use a scrolling utility such as `more` or `less`, or filter the output.

### List Files Recursively and Scroll Interactively with less

The Linux `more` and `less` utilities enable interactive scrolling at the cost of suppressing the default columnar styling. Originally, `less` differed from `more` by adding backward scrolling. However, the current GNU versions of the two programs are identical.

```command
ls -R /usr | less
```

The following example demonstrates how the first screen of output from `ls -R /usr` looks after it is piped into `less`:

```output
/usr:
bin
games
include
lib
lib32
lib64
libexec
libx32
local
sbin
share
src

/usr/bin:
[
aa-enabled
aa-exec
aa-features-abi
add-apt-repository
addpart
addr2line
apport-bug
:
```

The final `:` prompt denotes that less is awaiting input. Scroll down in `less` by pressing the **Spacebar**, and scroll up using the **PageUp** key. The **q** key stops the `less` session.

### List Files Recursively and Filter the Output with `grep`

To find strings and patterns in `less`, use the `/<pattern>` or `?<pattern>` commands to search forwards or backwards, respectively. Alternatively, you can filter output using the `grep` utility. For example, the following command recursively lists the files and directories of `/usr`, but displays only lines containing "binhex".

```command
ls -R /usr | grep binhex
```

```output
binhex.py
binhex.cpython-310.pyc
mac-binhex40.xml
```

### Listing Files with Full Details

The `ls -l` command lists file and directory details, including permissions, owners, groups, file sizes, and modified dates, listing one file or directory per line:

```command
ls -l /usr/include
```

In the output below, the `/usr/include` directory has three subdirectories indicated by a `d` at the beginning of the line. It also contains four normal files (indicated with a `-` at the beginning) with execution permission for the root (`x`), while others can read but not write them (r-x).

```output
total 84
-rw-r--r-- 1 root root 40645 Mar 23  2022 gawkapi.h
drwxr-xr-x 2 root root  4096 Feb 24 01:42 iproute2
drwxr-xr-x 2 root root  4096 Feb 24 01:43 libdmmp
-rw-r--r-- 1 root root  4157 Oct 28 14:43 mpath_cmd.h
-rw-r--r-- 1 root root 11490 Oct 28 14:43 mpath_persist.h
-rw-r--r-- 1 root root 11918 Mar  1 08:59 sudo_plugin.h
drwxr-xr-x 2 root root  4096 Feb  8  2022 xfs
```

### List Files and Directories with Type Indicators

Sometimes you want to know whether a given file is normal, a directory, a symbolic link, an executable, or a network file, but don’t need information about permissions or owners. For this purpose, you can use the `ls -F` command:

```command
ls -F /etc
```

This command appends a file classification glyph to the end of the name. It shows `/` for directories, `*` for executables, `=>` for network files, and `@` for symbolic links:

```output
adduser.conf                   landscape/            rc0.d/
adjtime                        ldap/                 rc1.d/
alternatives/                  ld.so.cache           rc2.d/
apparmor/                      ld.so.conf            rc3.d/
apparmor.d/                    ld.so.conf.d/         rc4.d/
apport/                        legal                 rc5.d/
apt/                           libaudit.conf         rc6.d/
bash.bashrc                    libblockdev/          rcS.d/
bash_completion                libnl-3/              resolv.conf@
bash_completion.d/             locale.alias          rmt@
...
```

### Show Hidden Files

Linux uses a period `.` as a prefix for hidden files. These are sometimes called dot files. Include them in the output using the `-a` flag:

```command
ls -a
```

For example, there are usually a handful of hidden configuration files in a user's home directory:

```output
.   .bash_logout  .cache    .profile
..  .bashrc       .lesshst  .sudo_as_admin_successful
```

### Show Hidden Files Without Implied . and ..

The first two "files" listed above are `.` and `..`, which are implicit directories. To see hidden files with these suppressed, use the `-A` flag:

```command
ls -A
```

```output
.bash_logout  .bashrc  .cache  .lesshst  .profile  .sudo_as_admin_successful

```

### List Files Ordered by Size or Time

The `-S` flag instructs `ls` to list files in descending order of size. The `-t` option flag tells `ls` to list files in descending order of time (i.e. newest first). To easily see the effect of these sort options, combine them with the long display format flag `l`.

```command
ls -Sl /usr/include
```

```output
total 84
-rw-r--r-- 1 root root 40645 Mar 23  2022 gawkapi.h
-rw-r--r-- 1 root root 11918 Mar  1 08:59 sudo_plugin.h
-rw-r--r-- 1 root root 11490 Oct 28 14:43 mpath_persist.h
-rw-r--r-- 1 root root  4157 Oct 28 14:43 mpath_cmd.h
drwxr-xr-x 2 root root  4096 Feb 24 01:42 iproute2
drwxr-xr-x 2 root root  4096 Feb 24 01:43 libdmmp
drwxr-xr-x 2 root root  4096 Feb  8  2022 xfs
```

```command
ls -tl /usr/include
```

```output
total 84
-rw-r--r-- 1 root root 11918 Mar  1 08:59 sudo_plugin.h
drwxr-xr-x 2 root root  4096 Feb 24 01:43 libdmmp
drwxr-xr-x 2 root root  4096 Feb 24 01:42 iproute2
-rw-r--r-- 1 root root  4157 Oct 28 14:43 mpath_cmd.h
-rw-r--r-- 1 root root 11490 Oct 28 14:43 mpath_persist.h
-rw-r--r-- 1 root root 40645 Mar 23  2022 gawkapi.h
drwxr-xr-x 2 root root  4096 Feb  8  2022 xfs
```

## Conclusion

The `ls` command is essentially universal on Unix-like systems. It displays the contents of directories in multiple display formats and sort orders. It can be combined with other utilities, such as `less` and `grep`, which allow scrolling and searching through directory listings.