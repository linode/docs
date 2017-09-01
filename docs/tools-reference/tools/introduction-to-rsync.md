---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides an introduction to rsync, the incremental file transfer utility.'
keywords: 'rsync,backup,back up,copy,transfer,synchronize,sync'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['linux-tools/utilities/rsync/']
modified: Thursday, August 31st, 2017
modified_by:
  name: Linode
published: 'Tuesday, September 8th, 2009'
title: Introduction to rsync
external_resources:
 - '[rsync Linux Man Page](https://linux.die.net/man/1/rsync)'
 - '[Rsync tips at Calomel.org](https://calomel.org/rsync_tips.html)'
---

[Rsync](https://rsync.samba.org/) is a command-line utility that synchronizes files across systems. The are countless use cases for rsync. You could edit a production host from a development machine, or use Cron to schedule backup migrations. rsync backups are handled incrementally. Once the initial backup is complete, successive backups complete quickly, because rsync compares the differences between the source and the destination, and only copies the differences. This process makes rsync ideal for automation. You can even use rsync to [migrate your server to Linode](/docs/migrate-to-linode/disk-images/migrating-a-server-to-your-linode) from other providers.



## How Do You Get rsync?
**Linux/Unix**: Not all *nix systems include rsync by default, but it can be installed from your distribution's software repository or compiled from [source](https://rsync.samba.org/download.html).

**Apple OS X**: rsync is included in recent versions of OS X.

**Windows**: As a standalone tool, rsync is not as popular on Windows. There are alternatives available that emulate rsync, or provide functionality similar to rsync, like [DeltaCopy](http://www.aboutmyip.com/AboutMyXApp/DeltaCopy.jsp). 


## Reasons to Consider **rsync** Over **cp** or **SCP**
- Creating incremental data backups.
- Copying from source to destination only the data which is different between the two locations. 
- Each file is checksummed on transfer using MD5.
- rsync's `--del` option deletes files located at the destination which are no longer at the source.
- rsync can resume failed transfers (as long as they were started with rsync).
- rsync can be run as a daemon.
- rsync can compress data with the `-z` option, so no need to pipe to an archiving utility.


## Working With rsync
There are a large number of option flags for rsync. Users usually have a preferred way of triggering options in conjunction with Rsync. Some rsync options serve as aliases of others options, for example, running `rsync -a` would result in the same behavior as running `rsync -rlptgoD`.


To access the rsync manual and the help documentation for rsync use: 

    man rsync
    rsync -help

The basic syntax of rsync commands is similar to `cp` and SCP: 

    rsync -[options] source destination

If you have multiple destinations, append them to the string:

    rsync -[options] source destination1 destination2 destination3

The source, the destination, or both, can be local or remote. If you're synchronizing files over a network, then both the local and remote machines will need rsync installed. Rsync uses SSH when transferring over networks so your data will be encrypted; it works with SSH keys for quick authentication with remote servers.

Remote locations are formatted like SSH or SCP commands. For example, to synchronize a local folder with one on a remote server, use:

    rsync -[options] /path/to/source_folder username@<remote_host>:/path/to/destination_folder
