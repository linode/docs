---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Keep processes running even if your SSH session disconnects. Examples on how to manage tmux sessions, windows and panes'
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

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps included.

2.  This guide will use `sudo` to install tmux. The rest of the actions do not require superuser privileges. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

## Install tmux

1.  To install tmux on Debian 9 or Ubuntu 16.04:

        sudo apt install tmux

2.  To install it on CentOS:

        sudo yum install tmux

3.  On an Arch Linux system run:

        sudo pacman -S tmux

4.  And on Gentoo type:

        emerge app-misc/tmux

## How to Manage tmux Windows

1.  When tmux is started it creates a new session with one window and one pane. Start a session:

    tmux

2.  Simulate an activity that will take 5 minutes to complete:

        for i in `seq 1 $((5*60)) | tac`; do clear; echo $i; sleep 1; done; echo "Finished!"

    This will start a counter and show how many seconds are left until the job finishes.

3.  Although it's not related to windows, it's useful to learn at this point tmux's most useful aspect. Close your SSH client window, log back in to your server and reattach to the previous session:

        tmux attach

    As you can see, the job continued in the background without experiencing any kind of interruptions. Without running it inside tmux, it would have been killed when your SSH client disconnected. In some cases, jobs can survive even when your SSH connection drops, but there's no easy way to reattach to the terminal so you can see the output or interact with the terminal input.

4.  As you wait for a long-running job to finish, you may want to enter other commands on your Linode. You can do so by opening another window. Tmux uses a so-called *prefix key*, which is **CTRL+b** by default. This allows you to signal that the next key you press is meant to be caught by the application. Press **CTRL+b**, release both keys and then press **c**. A new windows is created and you can see the list with all windows in the bottom status bar.

5.  You can switch to the previous window with **CTRL+b** then **p** and to the next with **CTRL+b** then **n**. When you're dealing with a lot of windows it's more useful to select them by their index number (**CTRL+b** and then a key from **0** to **9**). You can also display an interactive list which you can navigate through with the arrow keys. Press **CTRL+b** then **w** to access it.

6.  Type `exit` when you want to close a window. If you want to force kill all the processes contained within, instead of cleanly exiting the active terminal, then **CTRL+b** and **&** will do the job.

## How to Manage tmux Panes

1.  Another way to run multiple processes in one session is to split a window in panes. This is usually useful when you want to have outputs from multiple processes or jobs visible in a single window. Run the following command to output memory usage and update it every 0.2 seconds:

        watch -n 0.2 free -h

2.  Split the window horizontally by pressing **CTRL+b** then **"**.

3.  And now you can watch how memory usage spikes up when you update your distribution's package information with `sudo apt update` for Debian/Ubuntu, `sudo yum update` for CentOS or the equivalent command for your operating system.

4.  While for outputs that are distributed horizontally, the previous split makes sense, other times you may need to split your window vertically. Press **CTRL+b** then **%**.

5.  You now have 3 panes. To navigate them press **CTRL+b** then one of your arrow keys to select the pane in the respective direction, relative to the currently active pane.

6.  Many times you'll also need to resize your panes. Press **CTRL+b** and then **CTRL+UP** to extend the size of your pane in the upper direction. For other directions, use the other arrow keys. Press an arrow key multiple times to increase or decrease the pane size by multiple character blocks.

7.  When you need to focus on the output of one pane, you can press **CTRL+b** then **z** to zoom in on it. Press the same combination again to exit zoom mode.

8.  You normally exit a pane by typing `exit` and closing the shell session but you can force kill an unresponsive process in a pane with **CTRL+b** then **x**.

## How to Manage tmux Sessions

1.  Sometimes even multiple windows and panes aren't enough and you need to separate these layouts logically by grouping them into separate sessions. You will also learn another way to interact with tmux, by using its command prompt from the bottom status bar. Enter this mode by pressing **CTRL+b** then **:**. Now create a new session by typing:

        new-session

        It's also possible to type shorter versions of a command, for example: "new-se". But it will work only if it there isn't another command that starts with the same string of characters.

2.  Switch to the previous session by pressing **CTRL+b** then **(**. Use **)** to go to the next session.

3.  For an interactive session list press **CTRL+b** then **s**.

4.  Detach from the session by using a third way to interact with tmux, the regular command line:

        tmux detach

5.  List the sessions in tmux:

        tmux ls

6.  Attach to the first session, session 0:

        tmux attach -t 0

7.  To destroy all sessions and kill all processes within:

        tmux kill-server

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

    With the mouse option enabled you can now use the pointer to interact with tmux panes, windows and status bar. For example you can click on a window name in the status bar to switch to it or you can click and drag a delimiting pane line to resize it.

    In the following link you can find other [tmux options](http://man.openbsd.org/OpenBSD-current/man1/tmux.1#OPTIONS) that you can add to the config file or adjust from tmux's command prompt in an active session.
