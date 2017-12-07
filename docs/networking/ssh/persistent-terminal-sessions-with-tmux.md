---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Keep processes running even if your SSH connection drops. Examples on how to manage tmux sessions, windows and panes'
keywords: 'tmux, terminal, multiplexer, attach, detach, panes, sessions'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-06
modified: 2017-12-06
modified_by:
  name: Linode
title: 'How to Use tmux, a Terminal Multiplexer'
contributor:
  name: Alexandru Andrei
external_resources:
- '[tmux Manual](http://man.openbsd.org/OpenBSD-current/man1/tmux.1)'
- '[The Tao of tmux](https://leanpub.com/the-tao-of-tmux/read)'
---

## What is tmux?

In an ordinary SSH session, you work within a single terminal window. When that window is closed or the session is exited, all of the processes that may have been running in that session are stopped. This means that if you disconnect from your server for any reason, when you reconnect you will have to start over with a new session.

Tmux, on the other hand, is a **terminal multiplexer**. It creates a tmux **server** on your Linode and connects to it with a client window. When the client is disconnected, the server keeps running. When you reconnect to your Linode (after rebooting your computer or losing your Internet connection, for example), you can reattach to the tmux session and find all of the files you were working with still open, and the processes you had running are still active.

tmux is also often used as a container for processes that should always be on. For example you might run a game server this way or an IRC client.

## Install tmux

Install tmux with your distribution's package manager:

1.  To install tmux on Debian 9 or Ubuntu 16.04:

        sudo apt install tmux

## Attach and Detach from a tmux Session

1.  When tmux is started it creates a new session with one window and one pane. Start a session:

        tmux

    Your terminal window should have a green menu bar at the bottom, similar to below:

    ![Tmux menu](/docs/assets/tmux/tmux_menu.png)

2.  Detach from the session:

        tmux detach

    This will return you to the basic terminal.

3.  Once a session has been started, it will continue to run for as long as your Linode is running (or until you stop the session). You can log out of and then back into your SSH session and re-attach to the running session:

        tmux attach

## tmux Commands

There are three basic ways to send commands to tmux:

  * **shortcuts**: tmux uses what is called a *prefix key*, which is **CTRL+b** by default. tmux will interpret the  keystroke following the prefix as a tmux shortcut. For example, to detach from your session using a shortcut: press **CTRL+b**, release both keys and then press **d**.
  * **command mode**: Enter command mode by pressing **Prefix** then **:**. This will open a command prompt at the bottom of the screen, which will accept tmux commands.
  * **command line**: Commands can also be entered directly to the command line within a tmux session. Usually these commands are prefaced by `tmux`. The `tmux attach` command used in the previous section was an example of this type of command.

  Most tmux tasks can be accomplished using any of these three methods.

{{< note >}}
You can change the prefix key by editing your `.tmux.config` file (see below). For the remainder of this guide, **Prefix** will be used to refer to either the default **CTRL+b** or the combination you have chosen in your config file.
{{< /note >}}

## Manage tmux Windows

When a tmux session is started, a single window is created by default. It is possible to attach multiple windows to the same session and switch between them as needed. This can be helpful when you want to run multiple jobs in parallel.

| Command  |  Result |
|---|---|
| **Prefix** + **c**  | Create a new window  |
| **Prefix** + **p** |  Switch to the previous window |
| **Prefix** + **n**  |  Switch to the next window |
| **Prefix** + 0-9  |  Switch to a window by index number |
| **Prefix** + **w**  | Choose a window from an interactive list  |
| **exit** |  Close a window |
| **Prefix** + **&**  | Force kill all processes in an unresponsive window  |

By default, tmux names each window according to the process that spawned it (most commonly bash). To give windows names that are easier to remember and work with, you can rename a window with **Prefix** then **,**.

## Manage tmux Panes

Eash window can be divided into multiple panes. This is useful when you want to have outputs from multiple processes visible in a single window.

| Command  | Result  |
|---|---|
| **Prefix** + **"**  |  Split the active pane horizontally |
| **Prefix** + **%**  | Split the active pane vertically  |
| **Prefix** + arrow key  | Switch to another pane  |
| **Prefix** + **ALT+arrow**  | Resize the active pane  |
| **Prefix** + **z**  | Zoom in on the active pane. Press the same combination again to exit zoom mode  |
| **exit**  | Close the active pane  |
| **Prefix** + **x**   | Force kill an unresponsive process in a pane  |

## Manage tmux Sessions

Sometimes even multiple windows and panes aren't enough and you need to separate these layouts logically by grouping them into separate sessions. Open the command prompt with **Prefix** then **:**, then start a new session:

    new-session

{{< note >}}
It's also possible to type shorter versions of a command, for example: "new-se". But this will work only if it there isn't another command that starts with the same string of characters.
{{< /note >}}

| Command  | Result  |
|---|---|
| **Prefix** + **(**  | Switch to the previous session |
| **Prefix** + **)**  | Switch to the next session  |
| **Prefix** + **s**  | Display an interactive session list  |
| `tmux ls`  | List all available sessions  |
| `tmux attach -t 0`  | Zoom in on the active pane. Press the same combination again to exit zoom mode  |
| `tmux kill-server`  | Destroy all sessions and kill all processes  |

## Create a tmux Configuration File

1.  As you get comfortable with tmux, you may wish to change some of the defaults. Using a text editor, create a configuration file in your user's home directory:

    {{< file "~/.tmux.conf" conf >}}
# Uncomment the lines with the options you want to activate (by deleting the preceding "#")

# Allow mouse interaction
# set-option -g mouse on

# Change prefix key to CTRL+A. "C-" stands for CTRL, "M-" stands for ALT key
# set-option -g prefix C-a
# unbind-key C-b
# bind-key C-a send-prefix

# Display CPU load average for the last 1,5 and 15 minutes, in the status bar
set -g status-right "#(cut -d ' ' -f -3 /proc/loadavg) %H:%M %d-%b-%y"
{{< /file >}}

2.  When you have saved the changes to this file, load the new configuration. Enter tmux command mode by pressing **Prefix** then **:**, then use the following command:

        source-file ~/.tmux.conf

3.  With the mouse option enabled you can use the pointer to interact with tmux panes, windows and status bar. For example you can click on a window name in the status bar to switch to it or you can click and drag a delimiting pane line to resize it.

4.  Other configuration options are available in the [tmux manual](http://man.openbsd.org/OpenBSD-current/man1/tmux.1).
