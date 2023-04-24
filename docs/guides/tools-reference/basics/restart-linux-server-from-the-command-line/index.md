---
slug: restart-linux-server-from-the-command-line
description: "This guide shows how you can restart your Linux system, a task you might need to do on occasion when installing or configuring new software or packages."
keywords: ['linux restart','linux restart command','restart linux server']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-06
image: HowtoRestartaLinuxServerfromtheCommandLine.jpg
modified_by:
  name: Nathaniel Stickman
title: "Restart a Linux Server from the Command Line"
title_meta: "Using the Linux Restart Command from the Command Line"
authors: ["Nathaniel Stickman"]
---

While your Linux server can run continuously for weeks or months, some configuration tasks may require a manual system reboot. This guide shows you how to restart a Linux server over SSH, using PuTTY, or on your server's console interface.

## When Do I Need to Restart a Linux Server?

Generally, you do not need to regularly restart your Linux server. It should be able to keep running for weeks or months, without needing to be "refreshed" with a reboot.

However, several factors may make you want to restart your server. Some software installations require a manual reboot after installation, and some applications benefit from the system being periodically rebooted. There are also many administrative processes that require restarting the server for changes to take effect.
Linode Compute Instances have a feature called Lassie (Linode Autonomous System Shutdown Intelligent rEbooter), also referred to as the Shutdown Watchdog. When this feature is enabled, a Compute Instance automatically reboots if it ever powers off unexpectedly. To have a normal `reboot` functionality, ensure that you have enabled this feature. For more information, see the [Shutdown Watchdog guide](/docs/products/compute/compute-instances/guides/lassie-shutdown-watchdog/).

For those cases and others, it is helpful to know the available commands to quickly initiate a graceful system reboot.

## How Do I Restart a Linux Server from the Command Line?

In this section, you learn how to reboot your Linux server using the command line. These commands work whether you are connected directly to your server's console or are connecting to it over SSH.

### How to Restart a Linux Server with the reboot Command

The most straightforward way to restart your Linux server is with the `reboot` command.

    sudo reboot

This command starts a graceful shutdown, letting processes exit, temporary files are removed, and other system clean up tasks.

If you need to force a reboot, you can do so with the `--force` option. However, this should only be used when no other option is available. This option forces a reboot without allowing the usual clean up tasks, which can lead to loss and/or corruption of data.

### How to Schedule a Restart on a Linux Server with the shutdown Command

The `reboot` command accomplishes the same system state as the `shutdown` command with the `-r` option and a schedule of `now`. The complete command is as follows:

    sudo shutdown -r now

You can safely use the above command and alter the time (`now`) to schedule when your Linux server restarts. For the time option, the `shutdown` command accepts either several minutes or a local time in 24-hour format. The command below, for example, schedules the server to reboot in 15 minutes.

    sudo shutdown -r 15

The server then sends out a warning message to all logged-in users.

{{< output >}}
Broadcast message from root@localhost on pts/0 (Wed 2021-06-30 12:00:00 UTC):

The system is going down for reboot at Wed 2021-06-30 12:15:00 UTC!
{{< /output >}}

You can even send a custom message. In the example below, the server is scheduled to restart at 3:30 PM (local time), and a custom message is provided.

    sudo shutdown -r 15:30 "Please wrap up your current tasks and save your work."

{{< output >}}
Broadcast message from root@localhost on pts/0 (Wed 2021-06-30 19:15:00 UTC):

Please wrap up your current tasks and save your work.
The system is going down for reboot at Wed 2021-06-30 19:30:00 UTC!
{{< /output >}}

{{< note respectIndent=false >}}
While the time you give in the `shutdown` command is local time, it gets broadcast to users in UTC.
{{< /note >}}

Finally, you may want to cancel a scheduled reboot. You can do that with the following command:

    sudo shutdown -c

## How Do I Restart a Linux Server over PuTTY?

The process for restarting your Linux server over PuTTY is the same as above. The only difference is that you need to use PuTTY to open an SSH connection to your server.

If you are unsure how to do that, take a look at our guide on [Connecting to a Remote Server Over SSH using PuTTY](/docs/guides/connect-to-server-over-ssh-using-putty/).
