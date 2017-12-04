---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Keep processes running even if your SSH connection drops. Examples on how to manage tmux sessions, windows and panes'
keywords: 'tmux, terminal, multiplexer, attach, detach, panes, sessions'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'How to Use tmux, a Terminal Multiplexer'
contributor:
  name: Alexandru Andrei
  link: Github/Twitter Link
  external_resources:
- '[tmux Manual - Key Bindings](http://man.openbsd.org/OpenBSD-current/man1/tmux.1#KEY_BINDINGS)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

Some of the processes you launch on your Linode can take a very long time to finish their job. If your Internet connection drops, your client machine reboots unexpectedly or you get disconnected from your SSH session for any other reason, the processes that run inside your terminal will usually get terminated. Running a *terminal multiplexer* like *tmux* will prevent this from happening. Furthermore, you can reattach to the terminal, see output you've missed and continue your work.

tmux is also often used as a container for processes that should always be on. For example you might run a game server this way or an IRC client.

## Install tmux

1.  To install tmux on Debian 9 or Ubuntu 16.04:

        sudo apt install tmux

2.  To install it on CentOS:

        sudo yum install tmux

3.  On an Arch Linux system run:

        sudo pacman -S tmux

4.  And on Gentoo type:

        emerge app-misc/tmux

## Attach and Detach from a tmux Session

1.  When tmux is started it creates a new session with one window and one pane. Start a session:

        tmux

2.  Generate some output:

        ls

3.  Tmux uses a so-called *prefix key*, which is **CTRL+b** by default. This allows you to signal that the next key you press is meant to be caught by the application. Press **CTRL+b**, release both keys and then press **d**.

4.  To re-attach to the previous session enter the following command:

        tmux attach

## Manage tmux Windows

When you want to run multiple jobs in parallel, you can do so by creating additional tmux windows. Names of all windows will be listed in the bottom status bar.

Press **CTRL+b**, release both keys and then press **c**.

*   Create a new window with **CTRL+b** then **c**.
*   Switch to the previous window with **CTRL+b** then **p**.
*   Switch to the next with **CTRL+b** then **n**.
*   Switch to a window by using its index number with **CTRL+b** followed by a key from **0** to **9**.
*   Display an interactive list which you can navigate through with the arrow keys: **CTRL+b** then **w**.
*   Close a window by typing exit.
*   Force kill all processes in an unresponsive window with **CTRL+b** and **&**.

## Manage tmux Panes

Another way to run multiple jobs in one session is to split a window in panes. This is usually useful when you want to have outputs from multiple processes visible in a single window.

*   Split the window horizontally by pressing **CTRL+b** then **"**.
*   Split the window vertically with **CTRL+b** then **%**.
*   Switch to another pane with **CTRL+b** then press one of your arrow keys to select the pane in the respective direction, relative to the currently active pane.
*   Resize a pane by pressing **CTRL+b** and then **CTRL+UP** to extend the size of your pane in the upper direction. For other directions, use the other arrow keys. Press an arrow key multiple times to increase or decrease the pane size by multiple character blocks.
*   Zoom in on the active pane with **CTRL+b** then **z**. Press the same combination again to exit zoom mode.
*   Cleanly exit a pane by typing `exit`.
*   Force kill an unresponsive process in a pane with **CTRL+b** then **x**.

## Manage tmux Sessions

Sometimes even multiple windows and panes aren't enough and you need to separate these layouts logically by grouping them into separate sessions. You will also learn another way to interact with tmux, by using its command prompt from the bottom status bar. Enter this mode by pressing **CTRL+b** then **:**. Now create a new session by typing:

    new-session

It's also possible to type shorter versions of a command, for example: "new-se". But it will work only if it there isn't another command that starts with the same string of characters.

*   Switch to the previous session by pressing **CTRL+b** then **(**.
*   Switch to the next session with **CTRL+b** then **)**.
*   Display an interactive session list with **CTRL+b** then **s**.

There is a third way to interact with tmux, the regular command line:

*   To detach from a session: `tmux detach`.
*   List all available sessions with `tmux ls`.
*   Attach to the first session, session 0: `tmux attach -t 0`
*   Destroy all sessions and kill all processes within: `tmux kill-server`.

## Create a tmux Configuration File

1.  As you get comfortable with tmux, you may wish to change some of the defaults. Create a configuration file in your user's home directory:

        nano ~/.tmux.conf

2.  Below you'll find an example configuration you can use, modify and build upon:

{: .file }
/path/to/file.html
:   ~~~ conf
    # Uncomment the lines with the options you want to activate (by deleting the preceding "#")

    # Allow mouse interaction
    set-option -g mouse on

    # Change prefix key to CTRL+A. "C-" stands for CTRL, "M-" stands for ALT key
    #set-option -g prefix C-a
    #unbind-key C-b
    #bind-key C-a send-prefix

    # Display CPU load average for the last 1,5 and 15 minutes, in the status bar
    set -g status-right "#(cut -d ' ' -f -3 /proc/loadavg) %H:%M %d-%b-%y"
    ~~~

3.  With the mouse option enabled you can now use the pointer to interact with tmux panes, windows and status bar. For example you can click on a window name in the status bar to switch to it or you can click and drag a delimiting pane line to resize it.

4.  In the following link you can find other [tmux options](http://man.openbsd.org/OpenBSD-current/man1/tmux.1#OPTIONS) that you can add to the config file or adjust from tmux's command prompt in an active session.
