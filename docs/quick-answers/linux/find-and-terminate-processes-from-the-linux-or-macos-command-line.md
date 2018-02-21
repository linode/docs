---
author:
  name: Sam Foo
  email: docs@linode.com
description: Learn how to find a running process and terminate it from the command line in Linux and Mac OS.
keywords: ["kill", "killall", "terminate", "PID", "command line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-02-20
modified_by:
  name: Sam Foo
published: 2018-02-20
title: Find and Terminate Processes from the Linux or Mac OS Command Line
---

This Quick Answer explores some ways to locate and terminate a process from the command line. While there are graphical utilities such as the Gnome Project's *System Monitor* or *Activity Monitor* on Mac OS, such programs trade control over processes for convenience. The command line offers many options for closing a process.

## Find Process ID

A common pattern for ending a process uses the process ID (PID). There are a variety of ways to find the PID. If the process name is known, `pgrep` will search all currently running processes for that name.

    pgrep firefox

{{< note >}}
`pgrep` is not installed by default on MacOS. This can be installed along with `pkill` and `pfind` with Homebrew via:

    brew install proctools

{{< /note >}}

Another way to list running processes for all users is through `ps aux`. The output can be piped to grep to search for a process.

    ps aux | grep firefox

## Terminate the Process

Once the PID is known, send the kill signal with the `kill` command. Replace `PID` in the command below with the processes ID number.

    kill PID

There may be cases where there are multiple instances of the same program or processes being continuously spawned. In such cases, `killall` is an option.

    killall process_name

For a more information on using `kill` and `killall`, see our guide [Use Killall and Kill Commands to Stop Processes on Linux](/docs/tools-reference/tools/use-killall-and-kill-to-stop-processes-on-linux/).
