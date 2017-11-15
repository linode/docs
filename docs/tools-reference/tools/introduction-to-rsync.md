---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides an introduction to rsync, the incremental file transfer utility.'
keywords: ["rsync", "backup", "back up", "copy", "file transfer", "synchronize", "sync"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/utilities/rsync/']
modified: 2017-09-14
modified_by:
  name: Linode
published: 2009-09-08
title: Introduction to rsync
external_resources:
 - '[rsync Linux Man Page](https://linux.die.net/man/1/rsync)'
 - '[Rsync tips at Calomel.org](https://calomel.org/rsync_tips.html)'
---

[Rsync](https://rsync.samba.org/) is a command line utility which synchronizes files and folders from one location to another. Some workflows that can be implemented using rsync are updating a production host from a development machine, or using a cron job to call rsync to regularly back up data to a storage location. You can even use rsync to [migrate your server to Linode](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) from other providers.

![rsync title graphic](/docs/assets/rsync-title-graphic.jpg)

Rsync is incremental, so once the initial operation has completed, successive backup operations complete very quickly. Only the differences between the source and the destination files are copied. This property of rsync makes it an ideal solution for automated operations.


## How Do You Get rsync?
**Linux/Unix**: Not all *nix systems include rsync by default, but it can be installed from your distribution's software repository or compiled from source.

**Apple OS X**: rsync is included in recent versions of OS X.

**Windows**: As a standalone tool, rsync is not as popular on Windows. There are multiple GUI programs available which use rsync as a backend, and some are open source. [Cygwin](https://cygwin.com/) and [DeltaCopy](http://www.aboutmyip.com/AboutMyXApp/DeltaCopy.jsp) are two which you'll find recommended on StackExchange.


## Reasons to Consider rsync Over cp or SCP
- Creates incremental data backups.
- Copies from source to destination only the data which is different between the two locations.
- Each file is checksummed on transfer using MD5.
- rsync's `--del` option deletes files located at the destination which are no longer at the source.
- rsync can resume failed transfers (as long as they were started with rsync).
- rsync can be run as a daemon.
- rsync can compress data with the `-z` option, so no need to pipe to an archiving utility.


## Working With rsync
There exists a large number of options to use with rsync, and many people have their favorite set of options to use when calling the tool. Single rsync options can also be aliases of multiple others, so for example, running `rsync -a` would give the same result as `rsync -rlptgoD`.

Thus, rsync is a tool you want to be especially careful with when copying commands from forum posts and other sites on the internet without knowing exactly what they do. You will get the most out of rsync if you take the time to research and experiment a little before using it on your data.

To start becoming more familiar with rsync, the two commands you'll need are:

    man rsync
    rsync -help

The basic structure of an rsync command is similar to `cp` and SCP.

    rsync -[options] source destination

If you have multiple destinations, they're appended to the end of the string like is done with the `cp` command:

    rsync -[options] source destination1 destination2 destination3

Either the source or the destination, or both, can be local or remote. If you're synchronizing files over a network, then both the local and remote machines will need rsync installed. Rsync uses SSH when transferring over networks so your data is encrypted, and it works with SSH keys for quick authentication with remote servers.

Remote locations are formatted like SSH or SCP commands. For example, to synchronize a local folder with one on a remote server, you'd use:

    rsync -[options] /path/to/source_folder username@<remote_host>:/path/to/destination_folder
