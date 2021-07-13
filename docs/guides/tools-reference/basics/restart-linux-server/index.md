---
slug: restart-linux-server
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to restart a Linux server via a command line command."
og_description: "Learn how to restart a Linux server via a command line command."
keywords: ['linux restart','linux restart command','restart linux server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-13
modified_by:
  name: Nathaniel Stickman
title: "How to Restart a Linux Server from the Command Line"
h1_title: "How to Restart a Linux Server from the Command Line"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

Needing to restart a Linux server? Whether you are working directly over SSH, through PuTTY, or on your server's console interface, this guide shows you how.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## When Do I Need to Restart a Linux Server?

Generally, you do not need to regularly restart your Linux server. It should be able to keep running for weeks or months, without needing to be "refreshed" with a reboot.

However, several factors may make you want to restart your server. Some software installations require a manual reboot after installation, and some applications benefit from the system being periodically rebooted. Moreover, plenty of administrative processes necessitate restarting the server for changes to take.

For those cases and others, it can be helpful to know the couple of commands available for quickly initiating a graceful system reboot.

## How Do I Restart a Linux Server from the Command Line?

Here, you can see how to reboot your Linux server using the command line. These commands work whether you are connecting directly to your server's console or are connecting to it over SSH.

### How to Restart a Linux Server with the reboot Command

The most straightforward way to restart your Linux server is with the `reboot` command:

    sudo reboot

This command starts a graceful shutdown, letting processes exit, temporary files be dealt with, etc.

If you need to force reboot, you can do so with the `--force` option. However, this should only be used when no other option is available. This option forces a reboot without allowing the usual "wrapping up," which can lead to loss and/or corruption of data.

### How to Schedule a Restart on a Linux Server with the shutdown Command

The `reboot` command is, essentially, the same as the `shutdown` command with the `-r` option and scheduled for `now`, as in:

    sudo shutdown -r now

You can safely use the above command and alter the time (`now`) to schedule when your Linux server restarts. For the time, the `shutdown` command takes either a number of minutes or a local time in 24-hour format. The command below, as an example, schedules the server to reboot in 15 minutes:

    sudo shutdown -r 15

The server then sends out a warning message to all logged-on users:

{{< output >}}
Broadcast message from root@localhost on pts/0 (Wed 2021-06-30 12:00:00 UTC):

The system is going down for reboot at Wed 2021-06-30 12:15:00 UTC!
{{< /output >}}

You can even send a custom message. In the example below, the server is scheduled to restart at 3:30 PM (local time), and a custom message is provided:

    sudo shutdown -r 15:30 "Please wrap up your current tasks and save your work."

{{< output >}}
Broadcast message from root@localhost on pts/0 (Wed 2021-06-30 19:15:00 UTC):

Please wrap up your current tasks and save your work.
The system is going down for reboot at Wed 2021-06-30 19:30:00 UTC!
{{< /output >}}

{{< note >}}
While the time you give in the `shutdown` command is local time, it gets broadcast to users in UTC time.
{{< /note >}}

Finally, you may want to cancel a scheduled reboot. You can do that with the following command:

    sudo shutdown -c

## How Do I Restart a Linux Server over PuTTY?

The process for restarting your Linux server over PuTTY is the same as above. The only difference is that you need to use PuTTY to open an SSH connection to your server.

If you are unsure how to do that, take a look at our guide on [Connecting to a Remote Server Over SSH using PuTTY](/docs/guides/connect-to-server-over-ssh-using-putty/).
