---
slug: use-killall-and-kill-to-stop-processes-on-linux
description: Learn how to use Linux commands killall and kill to manage and kill processes on Linux distributions in this simple tutorial.
keywords: ["kill", "killall", "linux", "common linux commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/manage-processes-with-killall-and-kill/','/tools-reference/tools/use-killall-and-kill-to-stop-processes-on-linux/','/linux-tools/common-commands/killall-kill/']
modified: 2018-02-21
modified_by:
  name: Linode
published: 2010-11-29
title: Use killall and kill Commands to Stop Processes on Linux
tags: ["linux"]
authors: ["Linode"]
---

`killall` is a tool for terminating running processes on your system based on name. In contrast, `kill` terminates processes based on Process ID number (PID). `kill` and `killall` can also send specific system signals to processes.

Use `killall` and `kill` in conjunction with tools including Process Status, `ps`, to manage and end processes that have become stuck or unresponsive.

![Use killall and kill Commands to Stop Processes on Linux](use-killall-and-kill-commands-to-stop-processes-on-linux.png "Use killall and kill Commands to Stop Processes on Linux")

Throughout this guide, replace `[process name]` in each example with the name of the process you wish to terminate.

## Usage

### How to Use killall

The `killall` command takes the following form:

    killall [process name]

`killall` will terminate all programs that match the name specified. Without additional arguments, `killall` sends `SIGTERM`, or signal number 15, which terminates running processes that match the name specified. You may specify a different signal using the `-s` option as follows:

    killall -s 9 [process name]

This sends the `SIGKILL` signal which is more successful at ending a particularly unruly processes. You may also specify signals in one of the following formats:

    killall -KILL [process name]
    killall -SIGKILL [process name]
    killall -9 [process name]

### How to Use kill

The `kill` command terminates individual processes as specified by their PID.

Commands take the following form:

    kill [PID]

Without options, `kill` sends `SIGTERM` to the PID specified and asks the application or service to shut itself down. This is discussed further [in the following section](#system-signals).

Multiple PIDs and alternate system signals can be specified within a single `kill` command. The following examples all send the `SIGKILL` signal to the PID specified:

    kill -s KILL [PID]
    kill -KILL [PID]

## System Signals

The `kill` command does not terminate a process directly. Rather, a signal is sent to the process where the process will have instructions to follow if it receives a given signal. The man pages provide further reference of all available signals:

    man 7 signal

{{< output >}}
Standard signals
    Linux  supports the standard signals listed below. Several signal numbers are architecture-dependent, as indicated in the "Value" column. Where
    three values are given, the first one is usually valid for alpha and sparc, the middle one for x86, arm, and most other architectures, and the last
    one for mips. (Values for parisc are not shown; see the Linux kernel source for signal numbering on that architecture.)  A dash (-) denotes that a
    signal is absent on the corresponding architecture.

    First the signals described in the original POSIX.1-1990 standard.

    Signal     Value     Action   Comment
    ──────────────────────────────────────────────────────────────────────
    SIGHUP        1       Term    Hangup detected on controlling terminal
                                  or death of controlling process
    SIGINT        2       Term    Interrupt from keyboard
    SIGQUIT       3       Core    Quit from keyboard
    SIGILL        4       Core    Illegal Instruction
    SIGABRT       6       Core    Abort signal from abort(3)
    SIGFPE        8       Core    Floating-point exception
    SIGKILL       9       Term    Kill signal
    SIGSEGV      11       Core    Invalid memory reference
    SIGPIPE      13       Term    Broken pipe: write to pipe with no
                                  readers; see pipe(7)
    SIGALRM      14       Term    Timer signal from alarm(2)
    SIGTERM      15       Term    Termination signal
    SIGUSR1   30,10,16    Term    User-defined signal 1
    SIGUSR2   31,12,17    Term    User-defined signal 2
    SIGCHLD   20,17,18    Ign     Child stopped or terminated
    SIGCONT   19,18,25    Cont    Continue if stopped
    SIGSTOP   17,19,23    Stop    Stop process
    SIGTSTP   18,20,24    Stop    Stop typed at terminal
    SIGTTIN   21,21,26    Stop    Terminal input for background process
    SIGTTOU   22,22,27    Stop    Terminal output for background process

    The signals SIGKILL and SIGSTOP cannot be caught, blocked, or ignored.
{{< /output >}}

To simply list all available signals without their descriptions:

    kill -l
    killall -l

If you need to convert a signal name into a signal number, or a signal number into a signal name, use the following as examples:

    $ kill -l 9
    KILL

    $ kill -l kill
    9

## Find Running Processes

Use a utility like [htop](/docs/guides/linux-system-administration-basics/#monitor-processes-memory-and-cpu-usage-with-htop) or `top` to view a real time list of process and their consumption of system resources.

Use the `ps` command to view processes that are currently running and their PIDs. The following example filters the list of all processes that are currently running for the string `emacs` using [grep](/docs/guides/how-to-grep-for-text-in-files/):

    $ ps aux | grep "emacs"
    username  3896  0.0  2.2  56600 44468 ?        Ss   Sep30   4:29 emacs
    username 22843  0.0  0.0   3900   840 pts/11   S+   08:49   0:00 grep emacs

The number listed in the second column from the left is the PID, which is `3896` in the case of the `emacs` process. The `grep` process will always match itself for a simple search, as in the second result.

{{< note >}}
You can use the command `ps auxf` to view a hierarchical tree of all running processes.
{{< /note >}}

Once you have obtained the PID or process name, use `killall` or `kill` to terminate the process as above.

Another option to find the PID is though `pgrep`.

    pgrep [process name]

## Verify Process Termination

Adding the `-w` option to a `killall` command causes `killall` to wait until the process terminates before exiting. Consider the following command:

    killall -w irssi

This example issues the `SIGTERM` system signal to a background process with a name that matches `irssi`. `killall` will wait until the matched processes ends. If no process matches the name specified, `killall` returns an error message:

    $ killall -w irssi
    irssi: no process found
