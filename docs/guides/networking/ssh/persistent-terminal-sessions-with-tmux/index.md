---
slug: persistent-terminal-sessions-with-tmux
description: "This guide will show you how to use tmux Terminal multiplexer to host a server on your Linode and connect to it."
keywords: ['tmux','terminal','multiplexer','attach','detach','panes','sessions']
tags: ["networking","ssh","ubuntu","debian","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-06
modified: 2021-12-26
modified_by:
  name: Linode
title: "Use tmux (a Terminal Multiplexer)"
title_meta: "How to Use tmux (a Terminal Multiplexer)"
image: tmux.jpg
external_resources:
- '[tmux Manual](http://man.openbsd.org/OpenBSD-current/man1/tmux.1)'
- '[The Tao of tmux](https://leanpub.com/the-tao-of-tmux/read)'
aliases: ['/networking/ssh/persistent-terminal-sessions-with-tmux/']
authors: ["Alexandru Andrei"]
---

## What is tmux?

Tmux is a **terminal multiplexer**. It creates a host **server** on your Linode and connects to it with a client window. If the client is disconnected, the server keeps running. When you reconnect to your Linode after rebooting your computer or losing your Internet connection, you can reattach to the tmux session and the files you were working with will still be open, and the processes you had running will still be active.

By attaching multiple sessions, windows, and panes to a tmux server, you can organize your workflow and easily manage multiple tasks and processes.

## Install tmux

### Debian or Ubuntu:

Install tmux on CentOS by using the apt package manager:

    sudo apt install tmux

### CentOS:

Install tmux on CentOS by using the yum package manager:

    yum install tmux

### Mac OSX:

Install tmux on Mac OS X by using Homebrew:

    brew install tmux

## Creating, Detaching, and Attaching tmux Sessions

1.  Start a new tmux session with the following command:

        tmux

    The commands `tmux new` or `tmux new-session` can be used as well. You can create a new session with a specific name by running `tmux new -s $name`, replacing *$name* with a unique name for your session.

    Running any of the above commands will result in a new session being created with one window and one page. At this point, your terminal window should have a green menu bar at the bottom, similar to the one below:

    ![Tmux menu](tmux_menu.png)

1. Detach from the session:

        tmux detach

    This will return you to the basic terminal.

1. To attach to the last session you used, run:

        tmux attach

    The command `tmux a` can be used as well. To attach to a specific session, run `tmux attach -t $name`, replacing *$name* with the unique name given to the session you wish to use.

Once a session has been started, it will continue to run as long as the Linode is running or until you stop the session.

## tmux Commands

There are three ways to issue commands to tmux:

- **shortcuts**: tmux uses what is called a *prefix key*, which is `CTRL+b` by default. tmux will interpret the keystroke following the prefix as a tmux shortcut. For example: to detach from your session using a shortcut: press `CTRL+b`, release both keys and then press `d`.

- **command mode**: Enter command mode by pressing the prefix followed by `:`. This will open a command prompt at the bottom of the screen, which will accept tmux commands.

- **command line**: Commands can also be entered directly to the command line within a tmux session. Usually these commands are prefaced by `tmux`. The `tmux attach` command used in the previous section was an example of this type of command.

Most tmux tasks can be accomplished using any of these three methods.

{{< note respectIndent=false >}}
You can change the prefix key by editing the `~/.tmux.conf` file. For the remainder of this guide, **Prefix** will be used to refer to either the default `CTRL+b` or the combination you have chosen in your configuration file.
{{< /note >}}

### Getting Help with tmux by Reviewing Keyboard Shortcuts

At any time, you can display tmux keyboard shortcuts by entering your prefix followed by `?`:

    Prefix + ?

## Manage tmux Windows

When a tmux session starts, a single window is created by default. It is possible to attach multiple windows to the same session and switch between them as needed. This can be helpful when you want to run multiple jobs in parallel.

| Command  |  Result |
|---|---|
| **Prefix** + **c** | Create a new window  |
| **Prefix** + **p** | Switch to the previous window |
| **Prefix** + **n** | Switch to the next window |
| **Prefix** + **0-9** | Switch to a window using it's index number |
| **Prefix** + **w** | Choose a window from an interactive list |
| **exit** | Close a window |
| **Prefix** + **&** | Force kill-all processes in an unresponsive window |
| **Prefix + %** | Split windows horizontally |
| **Prefix + “** | Split windows vertically |
| **Prefix + M-n** | Switch between windows. Switching to a window that has a content alert, an activity or a bell |
| **Prefix + M-p** | Switch back to a previous window that has a content alert, an activity or a bell |

By default, tmux names each window according to the process that spawned it (most commonly bash). To give windows names that are easier to remember and work with, you can rename a window with **Prefix + ,**.

## Manage tmux Panes

Each window can be divided into multiple panes. This is useful when you want outputs from multiple processes visible within a single window.

| Command  | Result  |
|---|---|
| **Prefix** + **"**  |  Split the active pane horizontally |
| **Prefix** + **%**  | Split the active pane vertically  |
| **Prefix** + **arrow key**  | Switch to another pane  |
| **Prefix** + **ALT+arrow**  | Resize the active pane  |
| **Prefix** + **z**  | Zoom in on the active pane. Press the same combination again to exit zoom mode  |
| **exit**  | Close the active pane  |
| **Prefix** + **x**   | Force kill an unresponsive process in a pane  |
| **Prefix + k**  | To move the pane above  |
| **Prefix + j**  | To move the pane below  |
| **Prefix + h**  | To move the left panes  |
| **Prefix + l**  | To move the right pane  |
| **Prefix + q**  | Display pane numbers  |
| **Prefix +  o** | Toggle / jump to the other pane  |
| **Prefix + }**  | swap current pane with the pane from the left  |
| **Prefix + {**  | swap current pane with the page from the right  |
| **Prefix + !**  | move the pane out of current window  |
| **Prefix + ;**  | Go to the last used pane  |
| **Prefix + M-1**  | Predefined layout to switch to even-horizontal layout  |
| **Prefix + M-2**  | Predefined layout to switch to even-vertical layout  |
| **Prefix + M-3**  | Predefined layout to switch to main-horizontal layout  |  |
| **Prefix + M-4**  | Predefined layout to switch to main-vertical layout  |
| **Prefix + M-5**  | Predefined layout to switch to a tiled layout  |
| **Prefix + space**  |Predefined layout to switch to the next layout  |
| **Prefix + C-o**  | To move all panes, rotating the window up  |
| **Prefix + M-o**  | To move all panes, rotating the window down  |
| **tmux bind-key k resize-pane -U [i]**  |   To move the divider up i lines (for horizontal divider)  |
| **tmux bind-key k resize-pane -D [i]**  | To move the divider down i lines (for horizontal divider)  |
| **tmux bind-key k resize-pane -L [i]**  | To move the divider left i columns (for vertical divider)  |
| **tmux bind-key k resize-pane -R [i]**  | To move the divider right i columns (for vertical divider)  |
| **C-a C-up, C-a C-down, C-a C-left, C-a C-right** | To resize panes by 1 row/column  |
| **C-a M-up, C-a M-down, C-a M-left, C-a M-right** | To resize panes by 5 rows/columns  |

## Manage tmux Sessions

Sometimes even multiple windows and panes aren't enough and you need to separate the layouts logically by grouping them into separate sessions. Open the command prompt with **Prefix** then **:**, then start a new session:

    new-session

{{< note respectIndent=false >}}
It's also possible to type shorter versions of a command, for example: "new-se". But this will work only if there isn't another command that starts with the same string of characters.
{{< /note >}}

| Command  | Result  |
|---|---|
| **Prefix** + **(**  | Switch to the previous session |
| **Prefix** + **)**  | Switch to the next session  |
| **Prefix** + **s**  | Display an interactive session list  |
| **Prefix + d**  | detach from the current session  |
| **Prefix + $**  | rename a session in tmux  |
| **Prefix + L**  | Select the most recently used session (or the last session). Use the same combination again to return.  |
| `tmux ls`  | List all available sessions  |
| `tmux kill-server`  | Destroy all sessions and kill all processes  |

## Create a tmux Configuration File

1.  As you get comfortable with tmux, you may want to change some of the defaults. Using a text editor, create a configuration file in your user's home directory:

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

2.  When you have saved your changes to this file, load the new configuration. Enter the tmux command mode by pressing **Prefix** then **:**, then use the following command:

        source-file ~/.tmux.conf

3.  With the mouse option enabled you can use the pointer to interact with tmux panes, windows and status bar. For example you can click on a window name in the status bar to switch to it or you can click and drag a pane line to resize it.

4.  Other configuration options are available in the [tmux manual](http://man.openbsd.org/OpenBSD-current/man1/tmux.1).

## Servers in Tmux

Whenever you launch tmux, a server is initiated. You can connect to a tmux server under a specific socket name by using the command `tmux -L <socket name>`. For example, to connect to a server with the socket name “linode_socket”, run the following command:

    tmux -L linode_socket

This attaches a new session. If a session already exists and want to attach to it, run the following command instead:

    tmux -L linode_socket attach