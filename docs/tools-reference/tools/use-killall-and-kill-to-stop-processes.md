---
author:
  name: Linode
  email: docs@linode.com
description: Learn how to use Linux commands Killall and Kill to manage and kill processes on Linux distributions in this simple tutorial.
keywords: ["kill", "killall", "linux", "common linux commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/killall-kill/','tools-reference/tools/manage-processes-with-killall-and-kill/']
modified: 2017-03-23
modified_by:
  name: Linode
published: 2010-11-29
title: Use Killall and Kill Commands to Stop Processes on Linux
---

`killall` is a tool for ending running processes on your system based on name. In contrast, `kill` terminates processes based on process ID number or "PID." `kill` and `killall` can also send specific system signals to processes. Use `killall` and `kill` in conjunction with tools including `ps` to manage processes and end processes that have become stuck or unresponsive when necessary.

![Manage Processes with killall and kill](/docs/assets/manage_processes_with_killall_and_kill.png "Manage Processes with killall and kill")

## Usage

### killall

The `killall` command takes the following form:

    killall [process name]

Replace `[process name]` with the name of any process that you wish to terminate. `killall` will terminate all programs that match the name specified. Without arguments, `killall` sends `SIGTERM`, or signal number 15, which terminates running processes that match the name specified. You may specify a different signal using the `-s` option as follows:

    killall -s 9 [process name]

This sends the `SIGKILL` signal which is more successful at killing some particularly unruly processes. You may also specify signals in one of the following formats:

    killall -KILL [process name]
    killall -SIGKILL [process name]
    killall -9 [process name]

The above group of commands are equivalent.

### kill

The `kill` command terminates individual processes as specified by their process ID numbers or "PIDs." Commands take the following form:

    kill [PID]

This sends `SIGTERM` to the PID specified. You may specify multiple PIDs on the command line to terminate processes with `kill`. You may also send alternate system signals with kill. The following examples all send the `SIGKILL` signal to the PID specified:

    kill -s KILL [PID]
    kill -KILL [PID]

### System Signals

You may use `kill` and `killall` to send any of the following signals.

1.  `SIGHUP`
2.  `SIGINT`
3.  `SIGQUIT`
4.  `SIGILL`
5.  `SIGTRAP`
6.  `SIGABRT`
7.  `SIGIOT`
8.  `SIGFPE`
9.  `SIGKILL`
10. `SIGUSR1`
11. `SIGSEGV`
12. `SIGUSR2`
13. `SIGPIPE`
14. `SIGALRM`
15. `SIGTERM`
16. `SIGSTKFLT`
17. `SIGCHLD`
18. `SIGCONT`
19. `SIGSTOP`
20. `SIGSTP`
21. `SIGTTIN`
22. `SIGTTOU`
23. `SIGURG`
24. `SIGXCPU`
25. `SIGXFSZ`
26. `SIGVTALRM`
27. `SIGPROF`
28. `SIGWINCH`
29. `SIGIO` and `SIGPOLL`
30. `SIGPWR`
31. `SIGSYS`

Issue one of the following commands to get a list of all of the available signals:

    kill -l
    killall -l

If you need to convert a signal name into a signal number, or a signal number into a signal name consider the following examples:

    $ kill -l 9
    KILL

    $ kill -l kill
    9

## Find Running Processes

You may use a utility like [htop](/docs/tools-reference/linux-system-administration-basics/#monitor-processes-memory-and-cpu-usage-with-htop) or `top` to view a real time list of process and their consumption of system resources. You may also use the `ps` command to view processes that are currently running and their PIDs.

    $ ps aux | grep "emacs"
    username  3896  0.0  2.2  56600 44468 ?        Ss   Sep30   4:29 emacs
    username 22843  0.0  0.0   3900   840 pts/11   S+   08:49   0:00 grep emacs

This command filters the list of all processes that are currently running for the string `emacs` using [grep](/docs/tools-reference/search-and-filter-text-with-grep). The number listed in the second column is the PID, which is `3896` in the case of the `emacs` process. The `grep` process will always match itself for a simple search, as in the second result. To view a hierarchical tree of all running processes, issue the following command:

    ps auxf

Once you have obtained the PID or process name, use `killall` or `kill` to terminate the process as above.

## Verify Process Termination

The `-w` option to the `killall` command causes `killall` to wait until the process terminates before exiting. Consider the following command:

    killall -w irssi

This command issues the `SIGTERM` system signal to the process with a name that matches `irssi`.`killall` will wait until the matched processes have ended. If no process matches the name specified, `killall` returns an error message, as below:

    $ killall -w irssi
    irssi: no process found
