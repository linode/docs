---
author:
  name: Linode
  email: docs@linode.com
description: 'Advanced tips and tricks for using the Irssi IRC client.'
keywords: ["irssi", "irc", "oftc", "freenode", "real time", "chat"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/irc/advanced-irssi/']
modified: 2013-04-15
modified_by:
  name: Linode
published: 2010-03-29
title: Advanced Irssi Usage
external_resources:
 - '[Irssi Script Repository](http://scripts.irssi.org/)'
 - '[Irssi Themes Page](http://irssi.org/themes/)'
 - '[An Effective Guide for Using Screen and Irssi](http://quadpoint.org/articles/irssi)'
 - '[The Open and Free Technology Community](https://www.oftc.net/)'
 - '[The Freenode IRC Network](http://freenode.net/)'
 - '[GNU Screen](http://www.gnu.org/software/screen/)'
---

With a flexible plugin architecture and embedded Perl interpreter, you can customize Irssi a great deal beyond the off-the-shelf experience. The following sections outline a number of popular commands, modifications, and plugins.

One of the most powerful features of Irssi is its pervasive tab completion. All commands and command arguments can be completed using the tab key by first typing the first few characters of the command or argument, and then pressing the tab key to cycle through possible completions. Nicknames, channel, and window names are also tab-completable.

## Key Bindings and Aliases

If you find yourself using a command frequently and want to avoid typing it repeatedly, you can bind it to a key. For example, this command binds `/window last` to `Alt-x` or `Esc-x`:

    /bind meta-x /window last

This will create a key binding for `meta-x` (depending on your terminal emulation, this may be `Alt-x` or `Esc-x`) that runs the command `/window last`. Henceforth, when you press `Alt-m-x`, the focus of your Irssi session will toggle between your two most recent windows. If you would like to specify bindings for `Control-` combinations, use `^X` or `^v`, where `X` and `v` are the keys to be bound (`C-X` or `C-v` in emacs-style notation). Note that key bindings are case sensitive.

Alternatively, you may want to create an "alias," which is a shortening of a specific command. Consider the following examples aliases for longer `/window` commands:

    /alias wj join -window
    /alias wm window move

Once you've created this alias, rather than typing `/window join #channel`, you can instead type `/wj #channel` to join a channel in the current window. Similarly, rather than typing `/window move [number]`, you can type `/wm` to move the window elsewhere.

You may also create aliases with variables. mIRC users may remember the "slap" command which allows you to slap users in the channel with a trout. While not all users may find this useful or nice, the following command will add a `/slap` alias to Irssi:

    /alias slap /me slaps $0 around a bit with a large trout;

When you type `/slap <nickname>`, you will perform an "action" (or `/me` command) that slaps the user around a bit with a large trout.

Perhaps a more useful example is creating aliases for services. Irssi does not pass on unknown commands to the IRC server, so you will get an unknown command error when you try to use commands like `/cs` or `/ns`. To fix this, you may wish to add the following aliases:

    /alias cs quote cs $0-
    /alias ns quote ns $0-

When you use `/cs` or `/ns`, it will be as if you had typed `/msg chanserv` or `/msg nickserv`, respectively. The `$0-` in the aliases above passes anything after `/cs` or `/ns` on to the service you are trying to use (ChanServ or NickServ in this case). You may add aliases such as these for any other services you use.

## Saving State

Unless you explicitly save your configuration, every modification that you make to your Irssi session will be lost when you exit Irssi. Issue the following command to Irssi to save all current configuration modifications to your `~/.irssi/config` file:

    /save

You may also want to run `/layout save` to save the arrangement of windows so that when you start Irssi again, you do not have to rearrange all of the channels that you have set to automatically join. Additionally, you may want to create the following `ADDALLCHAN` alias to save all of your current channels:

    /alias ADDALLCHAN script exec foreach my \$channel (Irssi::channels()) { Irssi::command("channel add -auto \$channel->{name} \$channel->{server}->{tag} \$channel->{key}")\;}

When you issue the `/ADDALLCHAN` command, all of the channels that you are currently joined to will be auto-joined the next time you run Irssi. Consider running the above commands with some regularity to ensure that your configuration file reflects the current state of your Irssi session. Remember that you cannot safely edit the configuration file while an Irssi session is running.

## Using Plugins

There are many plugins for Irssi that add a large amount of functionality. To find scripts, examine the [Irssi script repository](http://scripts.irssi.org/). Here are some commands for managing scripts:

-   `/script` displays a list of all loaded scripts and full paths to their source files
-   `/script load [script]` loads the specified script. Irssi expects all scripts to be located in the `~/.irssi/scripts/` directory. If you have stored a script in a subdirectory of `~/.irssi/scripts/`, you need to specify that in the load command. Scripts placed in the `~/.irssi/scripts/autorun/` directory are loaded when Irssi starts.
-   `/script unload [script]` unloads the specified script
-   `/script exec [script]` runs the specified script once
-   `/script reset` unloads all scripts and resets the Perl interpreter.

The following plugins are popular among the Linode community:

-   [trackbar.pl](http://scripts.irssi.org/scripts/trackbar.pl) generates a horizontal rule in a channel to mark the last time you viewed this channel's window. This is useful if you are monitoring a number of channels and would like to be reminded of the last time you viewed this window.
-   [go.pl](http://scripts.irssi.org/scripts/go.pl) provides advanced completion for accessing windows with a `/go` command that offers tab completion for all windows, and is even able to complete based on character combinations from the middle of the channel or private message names.
-   [nickcolor.pl](http://scripts.irssi.org/scripts/nickcolor.pl) colorizes the nicknames of all members of a channel, based on activity and join time, in an effort to make the flow of conversation a bit easier to read.
-   [screen\_away.pl](http://scripts.irssi.org/scripts/screen_away.pl) automatically detects if your Irssi session resides within an attached or detached screen session. If your screen session is detached, this plugin will set your status to away. When you reattach to the session, the plugin unsets the away status.
-   [highlite.pl](http://scripts.irssi.org/scripts/highlite.pl) collects in one window all channel events like joins, parts, and quits.
-   [adv\_windowlist.pl](/docs/assets/633-adv_windowlist.pl) provides a more useful and configurable window list if you have trouble with the default window list implementation.

You can install all of these scripts to "autorun" when you invoke Irssi the next time by issuing the following sequence of commands:

    cd ~/.irssi/scripts/autorun/
    wget http://scripts.irssi.org/scripts/trackbar.pl
    wget http://scripts.irssi.org/scripts/go.pl
    wget http://scripts.irssi.org/scripts/nickcolor.pl
    wget http://scripts.irssi.org/scripts/screen_away.pl
    wget http://scripts.irssi.org/scripts/highlite.pl
    wget -O adv_windowlist.pl http://www.linode.com/docs/assets/633-adv_windowlist.pl

From within Irssi, issue the following commands to load these plugins for the first time:

    /script load autorun/trackbar.pl
    /script load autorun/go.pl
    /script load autorun/nickcolor.pl
    /script load autorun/screen_away.pl
    /script load autorun/highlite.pl
    /script load autorun/adv_windowlist.pl

If you would like to install but not auto-load the scripts, use `cd ~/.irssi/scripts/` before starting your wget commands. That way, they'll end up in the main `scripts` directory, not the `autorun` directory. To load these scripts in Irssi, run the following commands:

    /script load trackbar.pl
    /script load go.pl
    /script load nickcolor.pl
    /script load screen_away.pl
    /script load highlite.pl
    /script load adv_windowlist.pl

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.




