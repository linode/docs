---
slug: advanced-irssi-usage
description: "Irssi is a popular IRC client featuring a flexible plugin architecture and embedded Perl interpeter. Here's how to use it."
keywords: ["irssi", "irc", "oftc", "freenode", "real time", "chat"]
tags: ["perl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/messaging/advanced-irssi-usage/','/communications/irc/advanced-irssi/']
modified: 2018-04-10
modified_by:
  name: Linode
published: 2010-03-29
title: "Advanced Irssi Usage for IRC"
external_resources:
 - '[Irssi Script Repository](http://scripts.irssi.org/)'
 - '[Irssi Themes Page](http://irssi.org/themes/)'
 - '[An Effective Guide for Using Screen and Irssi](http://quadpoint.org/articles/irssi)'
 - '[The Open and Free Technology Community](https://www.oftc.net/)'
 - '[The Freenode IRC Network](http://freenode.net/)'
 - '[GNU Screen](http://www.gnu.org/software/screen/)'
authors: ["Linode"]
---

Irssi is a popular IRC client with a flexible plugin architecture and an embedded Perl interpreter. It can be customized to greatly improve the off-the-shelf experience. This guide will demonstrate some of the most useful features, plugins, and customizations to help you get the most out of Irssi.

This guide assumes that you are familiar with basic Irssi commands and usage. To review these commands, or for instructions on installing Irssi on your system, see our [Using Irssi for Internet Chat](/docs/guides/using-irssi-for-internet-relay-chat/) guide.

## Key Bindings and Aliases

Frequently used commands can be mapped with key bindings. For example, this command binds `/window last` to `Alt-x` or `Esc-x`:

    /bind meta-x /window last

This will create a key binding for `meta-x` (depending on your terminal emulation, this may be `Alt-x` or `Esc-x`) that runs the command `/window last`. When you press `Alt-m-x`, the focus of your Irssi session will toggle between your two most recent windows. If you would like to specify bindings for `Control-` combinations, use `^X` or `^v`, where `X` and `v` are the keys to be bound (`C-X` or `C-v` in emacs-style notation).

{{< note >}}
key bindings are case sensitive.
{{< /note >}}

Alternatively, you may want to create an **alias**:

    /alias wj join -window
    /alias wm window move

Once you've created this alias, rather than typing `/window join #channel`, you can instead type `/wj #channel` to join a channel in the current window. Similarly, rather than typing `/window move [number]`, you can type `/wm` to move the window elsewhere.

You can also create aliases with variables. Irssi does not pass unrecognized commands on to the IRC server, so you will get an unknown command error when you try to use commands like `/cs` or `/ns`. To fix this, add the following aliases:

    /alias cs quote cs $0-
    /alias ns quote ns $0-

When you use `/cs` or `/ns`, it will be as if you had typed `/msg chanserv` or `/msg nickserv`, respectively. The variable `$0-` in the aliases above passes anything after `/cs` or `/ns` on to the service you are trying to use (ChanServ or NickServ in this case).

## Save State

Unless your configuration is explicitly saved, modifications to your Irssi session will be lost when you exit Irssi. To avoid this, you can save all current configuration modifications to your `~/.irssi/config` file:

    /save

You may also want to run `/layout save` to save the arrangement of windows so that when you start Irssi again, you do not have to rearrange all of the channels that you have set to automatically join.

Additionally, you may want to create the following `ADDALLCHAN` alias to save all of your current channels:

    /alias ADDALLCHAN script exec foreach my \$channel (Irssi::channels()) { Irssi::command("channel add -auto \$channel->{name} \$channel->{server}->{tag} \$channel->{key}")\;}

The `/ADDALLCHAN` command saves all of your currently joined channels and automatically joins them the next time you run Irssi.

## Use Plugins

There are many plugins for Irssi. Check the [Irssi script repository](http://scripts.irssi.org/) to find scripts. Use these commands for managing scripts:

-   `/script` displays a list of all loaded scripts and full paths to their source files
-   `/script load [script]` loads the specified script. Irssi expects all scripts to be located in the `~/.irssi/scripts/` directory. If you have stored a script in a subdirectory of `~/.irssi/scripts/`, you need to specify that in the load command. Scripts placed in the `~/.irssi/scripts/autorun/` directory are loaded when Irssi starts.
-   `/script unload [script]` unloads the specified script
-   `/script exec [script]` runs the specified script once
-   `/script reset` unloads all scripts and resets the Perl interpreter.

The following plugins are popular among the Linode community:

-   [trackbar.pl](http://scripts.irssi.org/scripts/trackbar.pl) generates a horizontal rule in a channel to mark the last time you viewed this channel's window. This is useful if you are monitoring a number of channels and would like to be reminded of the last time you viewed this window.
-   [go.pl](http://scripts.irssi.org/scripts/go.pl) provides advanced completion for accessing windows with a `/go` command that offers tab completion for all windows, and is even able to complete based on character combinations from the middle of the channel or private message names.
-   [nickcolor.pl](http://scripts.irssi.org/scripts/nickcolor.pl) colorizes the nicknames of all members of a channel, based on activity and join time, in an effort to make the flow of conversation a bit easier to read.
-   [screen_away.pl](http://scripts.irssi.org/scripts/screen_away.pl) automatically detects if your Irssi session resides within an attached or detached screen session. If your screen session is detached, this plugin will set your status to away. When you reattach to the session, the plugin unsets the away status.
-   [highlite.pl](http://scripts.irssi.org/scripts/highlite.pl) collects in one window all channel events like joins, parts, and quits.

You can install all of these scripts to run automatically when you start Irssi:

    cd ~/.irssi/scripts/autorun/
    wget http://scripts.irssi.org/scripts/trackbar.pl
    wget http://scripts.irssi.org/scripts/go.pl
    wget http://scripts.irssi.org/scripts/nickcolor.pl
    wget http://scripts.irssi.org/scripts/screen_away.pl
    wget http://scripts.irssi.org/scripts/highlite.pl

From within Irssi, load these plugins:

    /script load autorun/trackbar.pl
    /script load autorun/go.pl
    /script load autorun/nickcolor.pl
    /script load autorun/screen_away.pl
    /script load autorun/highlite.pl

To install but not auto-load the scripts, use `cd ~/.irssi/scripts/` before starting your wget commands. They'll end up in the main `scripts` directory, not the `autorun` directory. To load these scripts in Irssi:

    /script load trackbar.pl
    /script load go.pl
    /script load nickcolor.pl
    /script load screen_away.pl
    /script load highlite.pl
