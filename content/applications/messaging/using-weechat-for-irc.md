---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Use WeeChat and GNU Screen to create and maintain connections to IRC networks'
keywords: ["weechat", "irc", "oftc", "real time", "chat"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributor:
  name: Samuel Damashek
modified: 2016-03-10
modified_by:
    name: 'Linode'
published: 2014-08-27
title: 'Using WeeChat for Internet Relay Chat'
external_resources:
 - '[WeeChat Home Page](http://www.weechat.org/)'
 - '[GNU Screen](http://www.gnu.org/software/screen/)'
 - '[Screen for Persistent Terminal Sessions](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[WeeChat](https://weechat.org/) is a multi-platform, terminal-based Internet Relay Chat (IRC) client written in C. Weechat is intended to be flexible and extensible, and thus has all sorts of plugins written in different languages including Python, Perl, and Ruby.

Many users prefer WeeChat over other graphical and terminal-based clients because of its many features and its customizability. One advantage of terminal-based clients over graphical IRC clients is the ability to detach from your WeeChat instance and come back later, locally or remotely, using a terminal multiplexer such as [Screen](https://www.gnu.org/software/screen/) or [tmux](https://tmux.github.io/).

WeeChat is usually run in a terminal emulator. It may be run either on your computer, a Linode instance, or any computer running a supported platform. If you run WeeChat on your Linode, you can access WeeChat at any time from any system simply by connecting via SSH and attaching to your Screen or tmux instance. This guide assumes you have read [Using The Terminal](/docs/networking/ssh/using-the-terminal) and [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics), along with the [Getting Started Guide](/docs/getting-started/).

## What is IRC?

Internet Relay Chat (IRC) is a protocol that is used to create IRC "networks," sets of IRC servers that can be connected to using IRC clients. Networks are usually independent. Inside a network, there are many channels which can be joined by users. Usually anybody can create a channel. Channels are usually prefixed with hash signs (**#**), and sometimes contain multiple hash signs to represent different types of channels. Individual users can also chat with each other privately using private messages. Many Linode customers use IRC to get technical help and exchange knowledge.

The official Linode channel is **#linode** on the OFTC network (**irc.oftc.net**).

On IRC, users are classified by four characteristics:

  * Nickname, a unique user-chosen string which is shown as their handle.
  * Username, a separate string from the nickname which is provided by the user. Does not have to be unique.
  * Host, the IP or hostname from which a user is connecting.
  * Real Name, an optional argument containing your name (spaces are allowed)

A user is often represented as `nickname!username@host`.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Also follow the section to create a firewall, but omit the lines for ports 80 and 443 as these are not needed for a WeeChat server.

3.  Update your system:

    **CentOS**

        sudo yum update

    **Debian / Ubuntu**

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Using GNU Screen

GNU Screen allows you to start WeeChat and leave it running, even if you disconnect from your Linode. We recommend running WeeChat in Screen, so our instructions include Screen-specific commands. For more information, see [Using GNU Screen to Manage Persistent Terminal Sessions](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions).

## Installing WeeChat

Below are instructions for installing WeeChat and Screen on different Linux distributions and operating systems.

### Arch Linux

    sudo pacman -S weechat screen

### CentOS

    sudo yum install weechat screen

### Debian / Ubuntu

WeeChat provides repositories for various Debian and Ubuntu releases. See [their downloads page](https://weechat.org/download/debian/) for the repo addresses. The repo address for your version should look similar to `https://weechat.org/distribution version sid main`. Debian and Ubuntu both include Screen by default.

Using the address you found above, create a file so that your system knows where to check for the correct version of WeeChat, substituting the actual repo address for `address`:

    echo "address" | sudo tee /etc/apt/sources.list.d/weechat.list

You are now ready to install WeeChat:

    sudo apt-get install weechat

### Fedora

    sudo dnf install weechat screen

### Mac OS X (HomeBrew)

    brew update
    brew install screen
    brew install weechat

### Mac OS X (MacPorts)

    port install screen
    port install weechat

### Windows (Cygwin)

1. Install Cygwin. Ensure that subversion and wget are marked to be included during the installation process

2. Install apt-cyg with the following commands

        svn --force export http://apt-cyg.googlecode.com/svn/trunk/ /bin/
        chmod +x /bin/apt-cyg

3. Install WeeChat using the apt-cyg package

        apt-cyg install weechat


## Running WeeChat

To start WeeChat in a screen on most systems (including Debian 7), run:

    screen weechat-curses

You should now see the WeeChat chat window. If you don't, try running `screen weechat` instead of `screen weechat-curses`.

When you first launch WeeChat, it automatically creates a configuration file in `~/.weechat`.

## Using WeeChat

### Adding and Connecting to a Server

To add a server (in this case the OFTC network), you will use the `/server` command.

    /server add oftc irc.oftc.net/6697 -ssl -autoconnect

This adds a server named "oftc" with hostname "irc.oftc.net" connecting on port 6697. WeeChat will connect using SSL and will automatically connect when you start WeeChat. Once you define the server, you can run:

    /connect oftc

This will tell WeeChat to connect to the server you just set up.

To disconnect, run:

    /disconnect oftc

### Joining and Parting Channels

To join a channel, run:

    /join channel

For example, `/join #linode`.

Make sure to run join/part commands in the proper server window. You can use **ALT+X** to switch server windows.

To part, or leave, a channel, run:

    /part channel

For example, `/part #linode`.

### Switching Channels/Buffers

If you have mouse support enabled and also have installed buffers.pl (see the WeeChat Commands section below), then you can simply click on buffers you have joined then type messages in the bottom bar. Pressing **Enter** will submit your message.

Otherwise, you can use `/buffer` to switch between buffers by number or name. For example, `/buffer 1` will switch to buffer 1, while `/buffer #linode` will switch to the #linode buffer.
You can also press **ALT+number** (**ESC+number** on a Mac), where "number" is 1-9, to switch to that buffer number. **ALT+4** (**ESC+4** on a Mac) will switch to buffer 4.

<!--- My friend tells me that you have to use Esc instead of Alt. For example, Option-4 would give him ¢.
Pressing `Ctrl-N` will switch to the next buffer, and `Ctrl-P` will switch to the previous buffer. You can also use `/buffer +1` to go to the next buffer, or `/buffer -1` to go to the previous buffer.
-->

### Sending Private Messages

To send a private message to a nickname, run:

    /msg nick message

For example, to send the message "Have you heard about Linode?" to someone with the nickname `friend`, run:

    /msg friend Have you heard about Linode?

You can also open a buffer for a nickname with `/query`. This will create a new buffer which you can send and receive messages in to and from a user. For example, `/query friend` will open a conversation with "friend".

### Changing your Nickname

To change your nickname after you have connected, run:

    /nick newnickname

Note that this will only work if the new nickname is not already in use.

### Quitting WeeChat

To quit WeeChat completely, run:

    /quit

## Configuring WeeChat

You usually will not have to directly edit any WeeChat configuration files. Most configuration is done through WeeChat commands.

### Installing Plugins

WeeChat has a plugins system which allows you to install different modifications to WeeChat for different use-cases and user preference. In WeeChat versions 0.3.9 and above, a script management system is included. `/script` will open up a list of available and installed scripts. From there, you can follow the instructions to install scripts interactively, or install a script using `/script install` followed by the script name.

### WeeChat Commands

All WeeChat commands begin with a **/**. Every channel in WeeChat is a *buffer*. Servers are also buffers. By default, WeeChat does not include a list of buffers, but you may install a plugin that does. The buffers.pl plugin is recommended and displays a list of buffers on the left of the screen. This allows you to see what channels and servers you are in without having to remember special commands.

    /script install buffers.pl

`/mouse enable` will enable mouse support, which allows you to scroll as well as click buffers to change channels and servers.

A list of basic commands is below.

    | Command    | Description                                                                     |
  | --------   | ------------------------------------------------------------------------------- |
  | `/help`    | Lists commands, if a command is given then shows command usage and description  |
  | `/join`    | Joins a channel                                                                 |
  | `/close`   | Closes a buffer, parting the channel if you are in it                           |
  | `/quit`    | Quit WeeChat                                                                    |
  | `/msg`     | Send a message to a nick (or channel)                                           |
  | `/query`   | Opens a private buffer with a nick                                              |
  | `/ban`     | Ban a user from a channel                                                       |
  | `/unban`   | Unban a user from a channel                                                     |
  | `/kick`    | Kick a user from a channel                                                      |
  | `/kickban` | Kick and ban a user from a channel                                              |
  | `/part`    | Parts a channel but does not close the buffers                                  |
  | `/topic`   | Sets channel topic                                                              |
  | `/whois`   | Shows information about a user                                                  |

### Setting Default Channels

WeeChat uses the `/set` command to manipulate WeeChat settings. It allows you to change many different attributes about WeeChat, including appearance and functionality.

You can tell WeeChat to automatically connect to some channels when it connects to a server using the `irc.server.name.autojoin` setting substituting the server to which you are connected for `name`. In the above configuration, we connected to `oftc`. This setting should be a comma separated list of channels to join. For example, if I want to join #linode when I connect to the oftc network, I would run:

    /set irc.server.oftc.autojoin "#linode"

Then, whenever I connect to the `oftc` server, I will automatically join #linode.

### Setting Default Nickname, Username, and Real Name

Setting the default nickname, username, and real name is just as simple. To set your default nickname, run:

    /set irc.server_default.nicks "nickname"

You can also specify backup nicknames in case the one you want is taken when you connect.

    /set irc.server_default.nicks "nickname,othernickname"

Setting the default username:

    /set irc.server_default.username "username"

Setting the default real name:

    /set irc.server_default.realname "realname"

## Accessing your WeeChat instance

If you ran WeeChat in a screen as specified above, you have the ability to detach from your WeeChat instance and to reattach later. To detach from the screen, press **CTRL+A**, then **D**. To reattach to your screen, run **screen -r**. You can reattach to your screen even if you have logged out from your Linode instance and connected later.