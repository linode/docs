---
slug: use-the-ps-aux-command-in-linux
author:
  name: James Turner
  email: turner@blackbear.biz
keywords: ["ps aux command"]
description: "The ps aux command is a tool that provides Linux system process information. This guide explain why that matters, and how to use it.'"
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-01-25
modified_by:
  name: Linode
published: 2021-01-25
title: How to Use the ps aux Command in Linux
h1_title: Using the ps aux Command in Linux
enable_h1: true
external_resources:
  - '[Backing Up Your Data](/docs/guides/backing-up-your-data/)'
tags: ["linux"]
---
The `ps aux` command is a tool to monitor processes running on your Linux system. A *process* is associated with any program running on your system, and is used to manage and monitor a program's memory usage, processor time, and I/O resources. Since the `ps aux` command displays an overview of all the processes that are running, it is a great tool to understand and troubleshoot the health and state of your Linux system. This guide provides an introduction to the `ps aux` command with brief examples to help you interpret its output.

## The `ps` command

The `ps` command without any options displays information about processes that are bound by the controlling terminal.

        ps

The command returns a similar output:

{{< output >}}
PID TTY      TIME     CMD
285 pts/2    00:00:00 zsh
334 pts/2    00:00:00 ps
{{</ output >}}

The default output of the `ps` command contains four columns that provide the following information:

- **`PID`: The process ID is your system's tracking number for the process**. The `PID` is useful when you need to use a command like `kill` or `nice`, which take a PID as their input.

- **`TTY`: The controlling terminal associated with the process**. Processes that do not originate from a controlling terminal and were initiated by the system at boot are displayed with a question mark.

- **`TIME`: The CPU usage of the process**. Displays the amount of CPU time used by the process. This value is not the run time of the process.

- **`CMD`: The name of the command or executable that is running**. The output only includes the name of the command or executable and does not display any options that were passed in.

### Command Options

The `ps` command accepts three different styles of options; [UNIX](https://en.wikipedia.org/wiki/Unix), [BSD](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution), and [GNU](https://en.wikipedia.org/wiki/GNU). You can use a mix of each style, however, you may notice inconsistent behavior across Linux distributions.

- When using UNIX-style options, your option(s) must be preceded by a dash (`-`) and can be grouped together. For example, the `-aux` options in the `ps -aux` command is preceded by a dash when using the UNIX style.

- When using BSD-style options with the `ps` command, you must exclude the dash (`-`), however, you can group your options. For example, notice the `ps aux` command's options; `aux` is formatted in the BSD style.

- GNU-style options are preceded by two dashes (`--`), and are reserved for long options. For example, the `ps --quick-pid 10946` command uses the long option `--quick-pid` to display running process information by a specific PID. In the example, `10946` is the process PID.

### View All of Your System's Processes

By default, the `ps` command displays only the processes associated with your current terminal session. However, you may want to view all the processes that the current user owns, for example if you have multiple terminal sessions running for the same user. In that case, issue the `ps x` command. Also, notice that the command is using the BSD-style option.

The `ps x` command returns an additional column called sate information (`STAT`). This column can display a large number of possible values depending on the process it displays. For example, a lowercase `s` indicates that the process is a *session leader* (i.e., the root process). A capital `S` means that the process is in an interruptible sleep state, and is waiting for some event, like user input. `R` means that the command is actively running. `T` means that the process has stopped; like when you enter **control-Z** in the [vi text editor](https://en.wikipedia.org/wiki/Vi). The `+` means it is a foreground process.

Take a look at the following example and notice the different states for each process displayed in the `STAT` column:

        ps x

{{< output >}}
PID TTY      STAT   TIME COMMAND
285 pts/2    Ss     0:00 -zsh
343 pts/2    T      0:00 vi foo
351 pts/3    Ss+    0:00 -zsh
439 pts/2    R+     0:00 ps -x
{{</ output >}}

### Viewing the Process Hierarchy

The `init` process is the first process started by the Linux kernel when a system boots. Every other process on your system is a child of the `init` process. You can view this hierarchy using the `ps` command's `e` and `H` options. The `e` option causes `ps` to list all processes in the system, regardless of the owner or controlling terminal. The `H` option formats the `CMD` column's data to display the parent-child relationship between processes.

        ps -He

{{< output >}}
PID TTY      TIME     CMD
1 ?          00:00:00  init
227 ?        00:00:00   init
228 ?        00:00:00     init
229 pts/0    00:00:15       docker
240 ?        00:00:00     init <defunct>
247 ?        00:00:00     init
248 pts/1    00:00:10       docker-desktop-
283 ?        00:00:00   init
284 ?        00:00:00     init
285 pts/2    00:00:00       zsh
343 pts/2    00:00:00         vi
528 pts/2    00:00:00         ps
349 ?        00:00:00   init
350 ?        00:00:00     init
351 pts/3    00:00:00       zsh
{{</ output >}}

Alternatively, you can get a prettier output with a few more columns by using the `ps -axjf` command.

        ps -axjf

{{< output >}}
PPID   PID  PGID   SID TTY      TPGID STAT   UID   TIME COMMAND
    0     1     0     0 ?           -1 Sl       0   0:00 /init
    1   227   227   227 ?           -1 Ss       0   0:00 /init
  227   228   227   227 ?           -1 S        0   0:00  \_ /init
  228   229   229   229 pts/0      229 Ssl+  1000   0:15  |   \_ docker
  227   240   227   227 ?           -1 Z        0   0:00  \_ [init] <defunct>
  227   247   227   227 ?           -1 S        0   0:00  \_ /init
  247   248   248   248 pts/1      248 Ssl+     0   0:10      \_ /mnt/wsl/docker-desktop/docker-desktop-proxy
    1   283   283   283 ?           -1 Ss       0   0:00 /init
  283   284   283   283 ?           -1 S        0   0:00  \_ /init
  284   285   285   285 pts/2      559 Ss    1000   0:00      \_ -zsh
  285   343   343   285 pts/2      559 T     1000   0:00          \_ vi foo
  285   559   559   285 pts/2      559 R+    1000   0:00          \_ ps axjf
    1   349   349   349 ?           -1 Ss       0   0:00 /init
  349   350   349   349 ?           -1 S        0   0:00  \_ /init
  350   351   351   351 pts/3      351 Ss+   1000   0:00      \_ -zsh
{{</ output >}}

The additional columns provide the following information:

- **`PPID`: Displays the parent process ID**. In the above example, the `vi` command has a `PPID` of `285`, which matches the `PID` of the [Z shell](https://en.wikipedia.org/wiki/Z_shell) process running above it.

- **`SID`: This column displays the session ID**. The value is usually the same as the PID of the process that started the chain.

- **`PGID`: This ID shows the parent group process ID**.

- **`TPGID`: This is the terminal sessions ID with which the process is associated**. If there is no terminal that is associated, then `-1` is displayed.

- **`UID`: The user ID associated with the process is displayed in this column**.

### The `aux` shortcut

Now that you understand the basics of the `ps` command, this section covers the benefits to the `ps aux` command. The `ps aux` displays the most amount of information a user usually needs to understand the current state of their system's running processes. Take a look at the following example:

        ps aux

{{< output >}}
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0    892   572 ?        Sl   Nov28   0:00 /init
root       227  0.0  0.0    900    80 ?        Ss   Nov28   0:00 /init
root       228  0.0  0.0    900    88 ?        S    Nov28   0:00 /init
zaphod     229  0.0  0.1 749596 31000 pts/0    Ssl+ Nov28   0:15 docker
root       240  0.0  0.0      0     0 ?        Z    Nov28   0:00 [init] <defunct>
root       247  0.0  0.0    900    88 ?        S    Nov28   0:00 /init
root       248  0.0  0.1 1758276 31408 pts/1   Ssl+ Nov28   0:10 /mnt/wsl/docker-desktop/docker-desktop-proxy
root       283  0.0  0.0    892    80 ?        Ss   Dec01   0:00 /init
root       284  0.0  0.0    892    80 ?        R    Dec01   0:00 /init
zaphod     285  0.0  0.0  11964  5764 pts/2    Ss   Dec01   0:00 -zsh
zaphod     343  0.0  0.0  23764  9836 pts/2    T    17:44   0:00 vi foo
root       349  0.0  0.0    892    80 ?        Ss   17:45   0:00 /init
root       350  0.0  0.0    892    80 ?        S    17:45   0:00 /init
zaphod     351  0.0  0.0  11964  5764 pts/3    Ss+  17:45   0:00 -zsh
zaphod     601  0.0  0.0  10612  3236 pts/2    R+   18:24   0:00 ps aux
{{</ output >}}

The `ps aux` command displays more useful information than other similar options. For example, the `UID` column is replaced with a human-readable `username` column. `ps aux` also displays statistics about your Linux system, like the percent of CPU and memory that the process is using. The `VSZ` column displays amount of virtual memory being consumed by the process. `RSS` is the actual physical *wired-in* memory that is being used. The `START` column shows the date or time for when the process was started. This is different from the CPU time reported by the `TIME` column.

## Next Steps

The `ps` command has many other available options. For example, `ps` allows you to customize output columns so you can view your system's data in a format you prefer. You can filter based on the user, process name, or terminal. You can tell `ps` to print its output more verbosely and to ignore your screen width. You can spend more time learning what else `ps` can accomplish by reading its [*man-page*](https://en.wikipedia.org/wiki/Man_page) on your Linux system.

        man ps

### Use `top` as an Alternative to the `ps` Command

The `top` command is also a good tool to use to monitor your system's processes. One benefit to the `top` command is that it updates its values and statistics in real time. You can also sort its output by CPU usage, and it allows you to kill a process using a semi-graphical UI. If you'd like to learn more about the `top` command, check out the [Using top to Monitor Server Performance](/docs/guides/top-htop-iotop/) guide.

