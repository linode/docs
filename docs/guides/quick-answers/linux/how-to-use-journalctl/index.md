---
slug: how-to-use-journalctl
author:
  name: Linode
  email: docs@linode.com
description: This guide shows how to use journalctl to view, search, and filter your system's logs.
og_description: This guide shows how to use journalctl to view, search, and filter your system's logs.
keywords: ["systemd","journalctl","logging"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-05
modified_by:
  name: Linode
published: 2018-09-05
title: Use journalctl to View Your System's Logs
external_resources:
  - '[journalctl man page](https://www.freedesktop.org/software/systemd/man/journalctl.html)'
  - '[systemd-journald man page](https://www.freedesktop.org/software/systemd/man/systemd-journald.service.html#)'
  - '[journald.conf man page](https://www.freedesktop.org/software/systemd/man/journald.conf.html)'
tags: ["linux"]
aliases: ['/quick-answers/linux/how-to-use-journalctl/']
---

## What is journalctl?

*journalctl* is a command for viewing logs collected by systemd. The systemd-journald service is responsible for systemd's log collection, and  it retrieves messages from the kernel, systemd services, and other sources.

These logs are gathered in a central location, which makes them easy to review. The log records in the journal are structured and indexed, and as a result journalctl is able to present your log information in a variety of useful formats.

## Using journalctl for the First Time

Run the `journalctl` command without any arguments to view all the logs in your journal:

    journalctl

If you do not see output, try running it with `sudo`:

    sudo journalctl

If your Linux user does not have sudo privileges, [add your user to the sudo group](/docs/guides/set-up-and-secure/#add-a-limited-user-account).

### Default Log Format and Ordering

journalctl will display your logs in a format similar to the traditional syslog format. Each line starts with the date (in the server's local time), followed by the server's hostname, the process name, and the message for the log.

{{< output >}}
Aug 31 12:00:25 debian sshd[15844]: pam_unix(sshd:session): session opened for user example_user by (uid=0)
{{< /output >}}

Your logs will be displayed from oldest to newest. To reverse this order and display the newest messages at the top, use the `-r` flag:

    journalctl -r

### Paging through Your Logs

journalctl pipes its output to [the `less` command](/docs/guides/how-to-use-less/), which shows your logs one page at a time in your terminal. If a log line exceeds the horizontal width of your terminal window, you can use the left and right arrow keys to scroll horizontally and see the rest of the line:

Furthermore, your logs can be navigated and searched by using all the same key commands available in `less`:

{{< content "how-to-navigate-less-shortguide" >}}

### View journalctl without Paging

To send your logs to standard output and avoid paging them, use the `--no-pager` option:

    journalctl --no-pager

It's not recommended that you do this without first filtering down the number of logs shown.

### Monitor New Log Messages

Run `journalctl` with the `-f` option to view a live log of new messages as they are collected:

    journalctl -f

The key commands from `less` are not available while in this mode. Enter `Control-C` on your keyboard to return to your command prompt from this mode.

## Filter journalctl Output

In addition to searching your logs with the `less` key commands, you can invoke `journalctl` with options that filter your log messages before they are displayed.

These filters can be used with the normal paged display, and with the `--no-pager` and `-f` options. Filters of different types can also be combined together to further narrow the output.

### Show Logs within a Time Range

Use the `--since` option to show logs after a specified date and time:

    journalctl --since "2018-08-30 14:10:10"

Use the `--until` option to show logs up to a specified date and time:

    journalctl --until "2018-09-02 12:05:50"

Combine these to show logs between the two times:

    journalctl --since "2018-08-30 14:10:10" --until "2018-09-02 12:05:50"

Dates and times should be specified in the `YYYY-MM-DD HH:MM:SS` format. If the time is omitted (i.e. only the `YYYY-MM-DD` date is specified), then the time is assumed to be `00:00:00`.

journalctl can also accept some alternative terms when specifying dates:

-   The terms `yesterday`, `today`, and `tomorrow` are recognized. When using one of these terms, the time is assumed to be `00:00:00`.

-   Terms like `1 day ago` or `3 hours ago` are recognized.

-   The `-` and `+` symbols can be used to specify relative dates. For example, `-1h15min` specifies 1 hour 15 minutes in the past, and `+3h30min` specifies 3 hours 30 minutes in the future.

### Show Logs for a Specific Boot

Use the `-b` option to show logs for the last boot of your server:

    journalctl -b

Specify an integer offset for the `-b` option to refer to a previous boot. For example, `journalctl -b -1` show logs from the previous boot, `journalctl -b -2` shows logs from the boot before the previous boot, and so on.

List the available boots:

    journalctl --list-boots

Each boot listed in the output from `journalctl --list-boots` command includes a 32-bit *boot ID*. You can supply a boot ID with the `-b` option; for example:

    journalctl -b a09dce7b2c1c458d861d7d0f0a7c8c65

If no previous boots are listed, your journald configuration may not be set up to persist log storage. Review the [Persist Your Logs](#persisting-your-logs) section for instructions on how to change this configuration.

### Show Logs for a systemd Service

Pass the name of a systemd unit with the `-u` option to show logs for that service:

    journalctl -u ssh

### View Kernel Messages

Supply the `-k` option to show only kernel messages:

    journalctl -k

## Change the Log Output Format

Because the log records for systemd's journals are structured, journalctl can show your logs in different formats. Here are a few of the formats available:

| Format Name | Description |
| --------- | -------------- |
| short | The default option, displays logs in the traditional syslog format. |
| verbose | Displays all information in the log record structure. |
| json | Displays logs in JSON format, with one log per line. |
| json-pretty | Displays logs in JSON format across multiple lines for better readability. |
| cat | Displays only the message from each log without any other metadata. |

Pass the format name with the `-o` option to display your logs in that format. For example:

    journalctl -o json-pretty

### Anatomy of a Log Record

The following is an example of the structured data of a log record, as displayed by `journalctl -o verbose`. For more information on this data structure, review [the man page for journalctl](https://www.freedesktop.org/software/systemd/man/journalctl.html):

{{< output >}}
Fri 2018-08-31 12:00:25.543177 EDT [s=0b341b44cf194c9ca45c99101497befa;i=70d5;b=a09dce7b2c1c458d861d7d0f0a7c8c65;m=9fb524664c4;t=57517dfc5f57d;x=97097ca5ede0dfd6]
    _BOOT_ID=a09dce7b2c1c458d861d7d0f0a7c8c65
    _MACHINE_ID=1009f49fff8fe746a5111e1a062f4848
    _HOSTNAME=debian
    _TRANSPORT=syslog
    PRIORITY=6
    SYSLOG_IDENTIFIER=sshd
    _UID=0
    _GID=0
    _COMM=sshd
    _EXE=/usr/sbin/sshd
    _CAP_EFFECTIVE=3fffffffff
    _SYSTEMD_CGROUP=/system.slice/ssh.service
    _SYSTEMD_UNIT=ssh.service
    _SYSTEMD_SLICE=system.slice
    SYSLOG_FACILITY=10
    SYSLOG_PID=15844
    _PID=15844
    _CMDLINE=sshd: example_user [priv
    MESSAGE=pam_unix(sshd:session): session opened for user example_user by (uid=0)
    _AUDIT_SESSION=30791
    _AUDIT_LOGINUID=1000
    _SOURCE_REALTIME_TIMESTAMP=1536120282543177
{{< /output >}}

{{< note >}}

In addition to the types of filters listed in the previous section, you can also filter logs by specifying values for the variables in the log record structure. For example, `journalctl _UID=0` will show logs for user ID 0 (i.e. the root user).

{{< /note >}}

## Persist Your Logs

systemd-journald can be configured to persist your systemd logs on disk, and it also provides controls to manage the total size of your archived logs. These settings are defined in `/etc/systemd/journald.conf`.

To start persisting your logs, uncomment the `Storage` line in `/etc/systemd/journald.conf` and set its value to `persistent`. Your archived logs will be held in `/var/log/journal`. If this directory does not already exist in your file system, systemd-journald will create it.

After updating your `journald.conf`, load the change:

    sudo systemctl restart systemd-journald

### Control the Size of Your Logs' Disk Usage

The following settings in `journald.conf` control how large your logs' size can grow to when persisted on disk:

| Setting | Description |
| --------- | -------------- |
| SystemMaxUse | The total maximum disk space that can be used for your logs. |
| SystemKeepFree | The minimum amount of disk space that should be kept free for uses outside of systemd-journald's logging functions. |
| SystemMaxFileSize | The maximum size of an individual journal file. |
| SystemMaxFiles | The maximum number of journal files that can be kept on disk. |

systemd-journald will respect both `SystemMaxUse` and `SystemKeepFree`, and it will set your journals' disk usage to meet whichever setting results in a smaller size.

To view your default limits, run:

    sudo journalctl -u systemd-journald

You should see a line similar to the following which describes the current limits in place:

{{< output >}}
Permanent journal is using 32.0M (max allowed 2.3G, trying to leave 3.5G free of 21.2G available → current limit 2.3G).
{{< /output >}}

{{< note >}}
A parallel group of settings is used when journald.conf is set to only persist the journals in memory (instead of on disk): `RuntimeMaxUse`, `RuntimeKeepFree`, `RuntimeMaxFileSize`, and `RuntimeMaxFiles`.
{{< /note >}}

### Manually Clean Up Archived Logs

journalctl offers functions for immediately removing archived journals on disk. Run `journalctl` with the `--vacuum-size` option to remove archived journal files until the total size of your journals is less than the specified amount. For example, the following command will reduce the size of your journals to 2GiB:

    journalctl --vacuum-size=2G

Run `journalctl` with the `--vacuum-time` option to remove archived journal files with dates older than the specified relative time. For example, the following command will remove journals older than one year:

    journalctl --vacuum-time=1years

Run `journalctl` with the `--vacuum-files` option to remove archived journal files until the specified number of files remains. For example, the following command removes all but the 10 most recent journal files:

    journalctl --vacuum-files=10