author:
  name: James Turner
  email: turner@blackbear.biz
description: 'The `ps` command is a useful command line tool to provide insight into the processes running on a Linux system. When you want to know everything that’s going on, turn to the `ps aux` command.'
keywords: "ps aux command"
license:
published:
modified_by:
  name: Linode
title: 'How to use the PS and PS AUX commands'
contributor:
  name: James Turner
  link:
external_resources:
  - '[Link Title 1](http://www.example.com)'
  - '[Link Title 2](http://www.example.net)'
---

# How to use the PS and PS AUX commands

Author: James Turner

Type: How to

Docs Library Section: quick-answers/linux

Target Keyword: ps aux command

Deck: The `ps` command is a useful command line tool to provide insight into the processes running on a Linux system. When you want to know everything that’s going on, turn to the `ps aux` command.

## Basic usage
In its most basic form, `ps` with no arguments displays information about processes running in the current terminal session.
```
% ps
  PID TTY          TIME CMD
  285 pts/2    00:00:00 zsh
  334 pts/2    00:00:00 ps
```
The default output of the `ps` command contains four columns:

- **The process ID (`PID`) is the computer’s tracking number for the process**. The `PID` is useful when you need to use a command like `kill` or `nice`, which takes a PID as the input.

- **The terminal associated with the process**. Many system processes don’t have a terminal session connected to them; you may see a question-mark instead.

- **The processor usage of the process**. This represents the amount of CPU resources that the process is using. It is not the run time of the process.

- **The command that is running**. In the basic form of the `ps` command, the display only includes the name of the binary, without any arguments that were passed in.

## Watch out for arguments

As with so many other things in Linux and Unix, command-line arguments offer a lot of power. That can be confusing, but these are the basics.

The `ps` command takes two different styles of arguments: the standard style and BSD-style. They can change the “personality” of `ps` depending on the arguments you use.
This can be confusing. If you see strange and non-consistent behavior, it’s likely because you mixed arguments from the two different styles.

## See all your processes

Normally, `ps` displays only the processes associated with the current terminal. However, often you want to see all the processes that the current user owns, such as when there are multiple terminal sessions running for the same user. In that case, add the `x` argument. As mentioned above, some arguments are BSD-style; this is one example.

Adding the `x` parameter with the ps command causes the system to display an additional column called state (`STAT`) which comes along with BSD invocations of `ps`. A large number of possible values can be displayed in this column. For example, a lowercase `s` indicates that the process is a “session leader” (i.e., the root process), whereas the capital `S` means that it is in an interruptible sleep state, waiting for some event (such as user input). `R` means the command is actively running, `T` means it is stopped (such as when you hit control-Z in `vi`), and the `+` means it is the foreground process.

```
% ps -x
  PID TTY      STAT   TIME COMMAND
  285 pts/2    Ss     0:00 -zsh
  343 pts/2    T      0:00 vi foo
  351 pts/3    Ss+    0:00 -zsh
  439 pts/2    R+     0:00 ps -x
```
## Seeing more processes and the hierarchy

When you want to really understand the process hierarchy and get more data about each process, there are a number of ways to do it.

If you don’t want to use BSD arguments (for example, if you are using other arguments that aren’t BSD-friendly), use the `e` and `H` arguments. The `e` argument causes `ps` to list all processes on the system (regardless of owner or terminal), and the `H` indents processes to clarify which processes ones are children of others.
```
% ps -He
  PID TTY          TIME CMD
    1 ?        00:00:00 init
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
```
Alternatively, you can accomplish the same thing in BSD style and get a prettier version with a few more columns by using `ps -axjf`.
```
% ps -axjf
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
```
There are a few more columns here:

- PPID is the parent process ID. In this example, the vi command has a PPID of 285, which matches the PID of the zsh shell running above it. The lines on the right confirms that relationship.

- SID is the session ID. It is usually the same as the PID of the process that started the chain.

- PGID is the parent group process ID, and TPGID is the ID to the process with which the terminal session is associated (or -1 if there is no terminal.)

- Finally, the UID is the user ID associated with the process.

## The `aux` shortcut

Probably the most useful shorthand ps command is `ps aux`. In most cases, using `ps aux` displays everything you need to know.
```
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
```
To begin, the cryptic `UID` is replaced with the human-readable `username`. The Linux system also displays statistics on the percent of CPU and memory the process is using.

The `VSZ` field is the amount of virtual memory being consumed by the process, whereas `RSS` is the actually physical “wired in” memory that the process is currently using. Finally, the `START` column shows when the process was started in real time (as opposed to the CPU time reported by the TIME column).

## The `top` command

If you want a constantly updating ps-style view that updates in real time, can be sorted by CPU usage, and allows you to kill a process using a semi-graphical UI, check out the Linux `top` command. This is handy when you want a dynamic view of how resources are being used, and perhaps see what processes are bogging down your CPU usage. Just type `top` to run it.

 ```
top
- 18:33:32 up 6 days, 19:39,  0 users,  load average: 0.02, 0.02, 0.00
Tasks:  15 total,   1 running,  12 sleeping,   1 stopped,   1 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  25602.1 total,  24143.3 free,    544.5 used,    914.2 buff/cache
MiB Swap:   7168.0 total,   7168.0 free,      0.0 used.  24511.2 avail Mem

>  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0     892    572    508 S   0.0   0.0   0:00.02 init
  227 root      20   0     900     80     16 S   0.0   0.0   0:00.00 init
  228 root      20   0     900     88     16 S   0.0   0.0   0:00.00 init
  229 zaphod    20   0  749596  31000  19432 S   0.0   0.1   0:15.89 docker
  240 root      20   0       0      0      0 Z   0.0   0.0   0:00.00 init
  247 root      20   0     900     88     16 S   0.0   0.0   0:00.00 init
  248 root      20   0 1758276  31408  12032 S   0.0   0.1   0:10.65 docker-desktop-
  283 root      20   0     892     80     16 S   0.0   0.0   0:00.00 init
  284 root      20   0     892     80     16 S   0.0   0.0   0:00.31 init
  285 zaphod    20   0   11964   5764   4156 S   0.0   0.0   0:00.36 zsh
  343 zaphod    20   0   23764   9836   6272 T   0.0   0.0   0:00.03 vi
  349 root      20   0     892     80     16 S   0.0   0.0   0:00.00 init
  350 root      20   0     892     80     16 S   0.0   0.0   0:00.00 init
  351 zaphod    20   0   11964   5764   4152 S   0.0   0.0   0:00.03 zsh
  604 zaphod    20   0   10888   3732   3160 R   0.0   0.0   0:00.00 top
```
## That's just the beginning

There are far too many `ps` options to cover in a short tutorial. Spend more time learning what else `ps` can accomplish. For example, you can customize output columns any way you wish. You can filter on user, process name, or terminal. You can sort the results in a variety of ways. You can tell ps to print more verbosely and to ignore screen width. It’s worth a good read of the `man1 page for the complete details.