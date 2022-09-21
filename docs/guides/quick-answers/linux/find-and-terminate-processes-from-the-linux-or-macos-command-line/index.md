---
slug: find-and-terminate-processes-from-the-linux-or-macos-command-line
author:
  name: Sam Foo
  email: docs@linode.com
description: "Learn how to find a running process and terminate it from the command line in Linux and Mac OS."
keywords: ["kill", "terminate", "PID", "command line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-02-20
modified_by:
  name: Sam Foo
published: 2018-02-20
title: "Terminate Processes from the Mac or Linux Command Line"
h1_title: "Find and Terminate Processes from the Linux or Mac OS Command Line"
enable_h1: true
tags: ["linux"]
aliases: ['/quick-answers/linux/find-and-terminate-processes-from-the-linux-or-macos-command-line/']
---

This Quick Answer explores some ways to locate and terminate a process from the command line. While there are graphical utilities such as Activity Monitor on Mac OS or Task Manager on Windows, such programs compromise control over processes in exchange for convenience. The command line offers many options for closing a process.

## Find Process ID (PID)

A common pattern for ending a process is though its Process ID (PID). There are a variety of ways to find the PID.

If the process name is known, `pgrep` will search currently running processes for the name:

    pgrep firefox

{{< note >}}
`pgrep` is not installed by default on MacOS. This can be installed along with `pkill` and `pfind` with [Homebrew](/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/#install-git-via-homebrew) via:

    brew install proctools

{{< /note >}}

Another way to list running processes for all users is through `ps aux`. The output can be piped to grep in order to search for a process:

    ps aux | grep firefox

## Terminate the Process with kill or killall

Once the PID is found, send the kill signal with `kill`. Replace the `[PID]` in this example with the PID found in the previous steps:

    kill [PID]

There may be cases where there are multiple instances of the same program running or processes being continuously spawned. In such cases, `killall` is an option:

    killall [process name]

For a more information on `kill` and `killall`, see our guide on how to [Use Killall and Kill Commands to Stop Processes on Linux](/docs/guides/use-killall-and-kill-to-stop-processes-on-linux/).

<!-- Windows instructions via taskkill someday -->
