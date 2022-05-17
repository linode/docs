---
slug: ssh-config
author:
  name: Lars Kotthoff
  email: lars@larsko.org
description: "This guide will give you an understanding of how to use the SSH user configuration to persistently customize settings for hosts, remembering user names, port numbers, and other details so you don't have to remember them."
og_description: "This guide will give you an understanding of how to use the SSH user configuration to persistently customize settings for hosts, remembering user names, port numbers, and other details so you don't have to remember them."
keywords: ['linux','ssh','command line']
tags: ["linux","ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: "Use SSH like a pro with user configuration files"
h1_title: "Use SSH like a pro with user configuration files"
enable_h1: true
external_resources:
- '[Ubuntu Manual page for SSH](https://manpages.ubuntu.com/manpages/focal/en/man1/ssh.1.html)'
- '[Ubuntu Manual page for scp](https://manpages.ubuntu.com/manpages/focal/en/man1/scp.1.html)'
- '[Ubuntu Manual page for SSH config](https://manpages.ubuntu.com/manpages/focal/en/man1/ssh_config.5.html)'
---

You use SSH all the time to connect to remote servers; sometimes, this can be a pain. What was my user name for this server again? Which non-standard port is it running on? And why do I have to type my password all the time even when I have an active session to the same server? The SSH user configuration file allows you to take care of all of this, and more. In this guide, you will have a look at making common SSH tasks easier. And the best part is that you only have to do this once -- SSH configuration files are easily copied to other machines.

## Setup

First, make sure that you have an SSH user configuration file or create it. The standard location is `$HOME/.ssh/config`, but you can provide a different location to the `ssh` command with the `-F` option, e.g. `ssh -F /tmp/test_config`. Note that if you use the `-F` option, the system-wide SSH configuration file (usually `/etc/ssh/ssh_config` will *not* be read. If your system administrator has customized file, things might stop working.

A common way to use SSH user configuration files is to specify custom options for particular hosts, essentially saving having to type them every time when running the `ssh` command. In this scenario, the user configuration consists of a series of `Host` stanzas that give these options.

## `User`, `Port`, and `IdentityFile`

The `ssh` command assumes a default username (the name of the current user), port (22), and SSH key file, if present, when connecting to a host. Different values can be given through commandline options, and you can make them persistent through a `Host` configuration stanza:

    Host foo.com
      User foo
      Port 2222
      IdentifyFile ~/.ssh/foo_key.private

Let's take this apart. The host you're specifying custom options for is `foo.com` (if you connect by IP address to the same host, a separate configuration stanza where `foo.com` is replaced by the IP address is required). For multiple hosts that have names, you can use `*`, e.g. `Host *.foo.com`. There are more flexible options for matching destinations to connect to, for example the `Match` keyword (see man page for `ssh_config` for more details).

The lines after the `Host` declaration specify custom options for the user, port to connect to, and SSH key file to use for the connection. Now, you can simply type `ssh foo.com` to connect to the host, and all of our custom options will be picked up automatically. Depending on the shell you're using and its autocompletion settings, the hosts you configure will also show up as tab completions for `ssh` -- a great way to easily remember full host names, especially if they are automatically generated and/or very long.

## Control Sockets

In many cases it is useful and necessary to have multiple SSH connections to the same server, for example an interactive shell session and `scp` to copy files back and forth. However, repeatedly typing in a password every time you copy a file is frustrating. One way to avoid this is to use SSH key files and an SSH agent, but in some cases this may not be possible. For example, the SSH connection could require second factor authentication, or you're working on a remote server that doesn't have an SSH agent available.

Luckily, you can instruct SSH to share a single session across multiple invocations to the same server, so for example an existing interactive terminal session can be used to copy a file. This avoids having to type a password (or second factor) repeatedly and also reduces the number of connections that have to be open. The `Control*` options control this behavior; a basic configuration for connection sharing looks like this:

    Host foo.com
      ControlMaster auto
      ControlPath ~/.ssh/ssh-%r@%h:%p

This stanza instructs SSH to automatically share connections to `foo.com` if the control socket is present, otherwise it opens a new connection and creates the control socket at the specified path. Here, the path contains the remote user name (`%r`), the host (`%h`), and the port (`%p`). The SSH documentation recommends that the path to the control socket contain at least these properties of the connection to disambiguate between multiple sockets -- you wouldn't want to share connections to different hosts!

The above configuration will keep a shared connection alive as long as the initial connection is alive (e.g. the interactive terminal session). SSH also allows to persist shared connections indefinitely, without the need for the initial session to remain open. The `ControlPersist` option specifies this:

    Host foo.com
      ControlMaster auto
      ControlPath ~/.ssh/ssh-%r@%h:%p
      ControlPersist yes

Such persistent shared connections have to be closed explicitly, e.g. by killing the SSH command running in the background.

## `ProxyJump` and `ConnectTimeout`

Some servers might be difficult to reach, for example because they are behind a firewall or on a slow network connection. One way to deal with the former is to use a "jump host", i.e. connect to a non-firewalled host and then from there to the intended destination. This requires two steps, and can be confusing when two remote terminal sessions are nested within each other. We can avoid this with the `ProxyJump` option.

    Host hidden.foo.com
      ProxyJump jump@proxy.foo.com
      ConnectTimeout 30

Here, when attempting to connect to `hidden.foo.com`, SSH first connects to `proxy.foo.com` as user `jump` and then opens a connection from there to the target host. All the user sees is a connection to the target host; SSH transparently uses the jump host to get there. We also increased the connection time out to 30 seconds, which may be necessary if the connection is slow. Several jump hosts can be specified; each one increases the latency and time needed to establish the connection though.

## Dealing with Exotic SSH Installations

Finally, SSH installations can be outdated or so tightly locked down that you cannot even connect to them with default SSH parameters. Again the SSH user configuration allows to specify custom parameters without having to remember and type them every time.

    Host old-sun.foo.com
      KexAlgorithms +diffie-hellman-group1-sha1
      Ciphers +aes128-cbc
      HostkeyAlgorithms +ssh-rsa

In this example, you're allowing outdated encryption algorithms to be used. Of course it is preferable to update the destination and use secure algorithms, but if this is not an option (for example for embedded devices), the SSH configuration file gives us a way of allowing insecure connections to this host only. In this case, you allow outdated key exchange algorithms (`KexAlgorithms`, note that this keyword starts with `Kex` and not `Key`), ciphers (`Ciphers`), and host key signature algorithms (`HostkeyAlgorithms`).

There are many more options that can be customized this way; the man page for `ssh_config` has more details.
