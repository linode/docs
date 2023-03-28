---
slug: use-logrotate-to-manage-log-files
description: "Learn how to make system logs easier to manage and keep track of with logrotate."
keywords: ["logrotate", "log files", "access logs"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linux-tools/utilities/logrotate/','/uptime/logs/use-logrotate-to-manage-log-files/']
modified: 2018-03-20
modified_by:
  name: Linode
published: 2010-10-11
title: "Using logrotate to Manage Log Files"
title_meta: "How to Use logrotate to Manage Log Files"
authors: ["Linode"]
---

## What is logrotate?

`Logrotate` is a tool for managing log files created by system processes. This tool automatically compresses and removes logs to maximize the convenience of logs and conserve system resources. Users have extensive control over how and when log rotation is processed.

![How to use logrotate](logrotate.jpg "How to use logrotate title graphic")

## Use Logrotate

`logrotate`'s behavior is determined by options set in a configuration file, typically located at `/etc/logrotate.conf`:

    logrotate /etc/logrotate.conf

Beyond the system-wide log rotation configuration, you can also configure `logrotate` on a per-user basis. If your deployment requires that non-privileged users rotate their own logs, each can create distinct configuration files.

### Run logrotate as a cronjob

Run `logrotate` as a [cronjob](/docs/guides/schedule-tasks-with-cron/) to ensures that logs will be rotated as regularly as configured. Logs will only be rotated when `logrotate` runs, regardless of configuration. For example, if you configure `logrotate` to rotate logs every day, but `logrotate` only runs every week, the logs will only be rotated every week.

For most daemon processes, logs should be rotated by the root user. In most cases, `logrotate` is invoked from a script in the `/etc/cron.daily/` directory. If one does not exist, create a script that resembles the following in the `/etc/cron.daily/` folder:

{{< file "/etc/cron.daily/logrotate" bash >}}
#!/bin/sh
logrotate /etc/logrotate.conf

{{< /file >}}

You may also use an entry in the root user's `crontab`.

## Understand logrotate.conf

The configuration file for log rotation begins with a number of global directives that control how log rotation is applied globally. Most configuration of log rotation does not occur in the `/etc/logrotate.conf` file, but rather in files located in the `/etc/logrotate.d/` directory. Every daemon process or log file will have its own file for configuration in this directory. The `/etc/logrotate.d/` configurations are loaded with the following directive in `logrotate.conf`:

{{< file "logrotate.conf" >}}
include /etc/logrotate.d

{{< /file >}}

Configuration settings for rotation of specific logs is instantiated in a block structure:

{{< file "logrotate.conf" >}}
/var/log/mail.log {
  weekly
  rotate 5
  compress
  compresscmd xz
  create 0644 postfix postfix
}

{{< /file >}}

The size and rotation of `/var/log/mail.log` is managed according to the directives instantiated between the braces. The above configuration rotates logs every week, saves the last five rotated logs, compresses all of the old log files with the `xz` compression tool, and recreates the log files with permissions of `0644` and `postfix` as the user and group owner. These specific configuration options override global configuration options which are described below.

## Remove or Email Old Logs with Rotate Count

{{< file "logrotate.conf" >}}
rotate 4

{{< /file >}}

The `rotate` directive controls how many times a log is rotated before old logs are removed. If you specify a rotation number of `0`, logs will be removed immediately after they are rotated. If you specify an email address using the `mail` directive as file, logs are emailed and removed.

{{< file "logrotate.conf" >}}
mail <username@example.com>

{{< /file >}}

Your system will need a functioning [Mail Transfer Agent](/docs/email/) to be able to send email.

{{< content "email-warning-shortguide" >}}

## Configure Log Rotation Intervals

To rotate logs every week, set the following configuration directive:

{{< file "logrotate.conf" >}}
weekly

{{< /file >}}

When `weekly` is set, logs are rotated if the current week day is lower than the week day of the last rotation (i.e., Monday is less than Friday) or if the last rotation occurred more than a week before the present.

To configure monthly log rotation, use the following directive:

{{< file "logrotate.conf" >}}
monthly

{{< /file >}}

Logs with this value will rotate every month that `logrotate` runs.

For annual rotation:

{{< file "logrotate.conf" >}}
yearly

{{< /file >}}

Logs are rotated when the current year differs from the date of the last rotation.

To rotate based on size, use the following directive:

{{< file "logrotate.conf" >}}
size [value]

{{< /file >}}

The `size` directive forces log rotation when a log file grows bigger than the specified `[value]`. By default, `[value]` is assumed to be in bytes. Append a `k` to `[value]` to specify a size in kilobytes, `M` for megabytes, or `G` for gigabytes. For example, `size 100k` or `size 100M` are valid directives.

## Compress Rotated (Old) Logs

{{< file "logrotate.conf" >}}
compress

{{< /file >}}

The `compress` directive compresses all logs after they have been rotated. If this directive is placed in the global configuration, all logs will be compressed. If you want to disable a globally enabled compression directive for a specific log, use the `nocompress` directive.

{{< file "logrotate.conf" >}}
compresscmd xz

{{< /file >}}

By default, `logrotate` compresses files using the `gzip` command. You can replace this with another compression tool such as `bzip2` or `xz` as an argument to the `compresscmd` directive.

## Delay Log File Compression

{{< file "logrotate.conf" >}}
delaycompress

{{< /file >}}

In some situations it is not ideal to compress a log file immediately after rotation when the log file needs additional processing. The `delaycompress` directive above postpones the compression one rotation cycle.

## Maintain Log File Extension

`Logrotate` will append a number to a file name so the `access.log` file will be rotated to `access.log.1`. To ensure that an extension is maintained, use the following directive:

{{< file "logrotate.conf" >}}
extension log

{{< /file >}}

If you enable compression, the compressed log will be named `access.1.log.gz`.

## Control Log File Permissions

If your daemon process requires that a log file exist to function properly, `logrotate` may interfere when it rotates logs. As a result, it is possible to have `logrotate` create new, empty log files after rotation. Consider the following example:

{{< file "logrotate.conf" >}}
create 640 www-data users

{{< /file >}}

In this example, a blank file is created with the permissions `640` (owner read/write, group read, other none) owned by the user `www-data` and in the `users` group. This directive specifies options in the form: `create [mode(octal)] [owner] [group]`.

## Run Commands Before or After Rotation

`logrotate` can run commands before and after rotation to ensure that routine tasks associated with log ration, such as restarting or reloading daemons and passing other kinds of signals, are run.

### Prerotate - Run commands before logrotate

To run a command before rotation begins, use a directive similar to the following:

{{< file "logrotate.conf" >}}
prerotate
    touch /srv/www/example.com/application/tmp/stop
endscript

{{< /file >}}

The command `touch /srv/www/example.com/application/tmp/stop` runs before rotating the logs. Ensure that there are no errant directives or commands on the lines that contain `prerotate` and `endscript`. Remember that all lines between these directives will be executed.

### Postrotate - Run commands after logrotate

To run a command or set of commands after log rotation, consider the following example:

{{< file "logrotate.conf" >}}
postrotate
    touch /srv/www/example.com/application/tmp/start
endscript

{{< /file >}}

`postrotate` is identical to `prerotate` except that the commands are run after log rotation.

For a more comprehensive listing of possible directives, run `man logrotate`.
