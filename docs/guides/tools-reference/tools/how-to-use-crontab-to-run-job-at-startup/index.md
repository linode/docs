---
slug: run-jobs-or-scripts-using-crontab-on-boot
author:
  name: Jeff Novotny
description: 'This guide explains how to use the cron utility and the crontab file to run jobs or scripts on system boot. You also learn best practices when using cron. For example, you can create a script to store your desired commands and use cron to run your script. '
og_description: 'This guide explains how to use the cron utility and the crontab file to run jobs or scripts on system boot. You also learn best practices when using cron. For example, you can create a script to store your desired commands and use cron to run your script. '
keywords: ['crontab on boot']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
modified_by:
  name: Linode
title: "Run Jobs or Scripts Using Crontab on Boot"
h1_title: "How to Run Jobs or Scripts Using Crontab on Boot"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny
external_resources:
- '[Wikipedia Cron Page](https://en.wikipedia.org/wiki/Cron)'
- '[Crontab Man Page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html)'
---

The cron utility is a job-scheduling tool found on all Linux and Unix operating systems, as well as macOS. Although cron is typically used to schedule jobs at fixed times, dates, and intervals, it can also launch jobs at system boot time. This guide explains how to use the cron utility and the crontab file to run a job or script when the system boots.

## What is the Crontab File?

Each cron job represents a command or script that automatically runs according to a predetermined schedule. The cron utility periodically scans the crontab entries and launches any job that is due to run. The `cron` jobs for the system are listed in the `/etc/crontab` file, where each line represents a different job. Every job must include a schedule, along with a command or script to run. There are different crontab files for different users, allowing jobs to be associated with an owner.

The following example demonstrates a crontab entry to run the `check-routers` script on an hourly basis.

{{< output >}}
0 \* \* \* \* /opt/bin/check-routers
{{< /output >}}

The first five fields represent the minute, hour, day of the month, month, and day of the week when the job should run. The `*` symbol is a wildcard meaning *always*. So, the example job runs at the top of the hour, every hour of the day, and every day of the year.

To simplify the syntax, crontab offers shortcuts for very common schedules. For instance, the `@hourly` shortcut runs a job at the start of every hour. So the last example can also be entered as seen in the following example.

{{< output >}}
@hourly /opt/bin/check-routers
{{< /output >}}

Similarly, the `@reboot` shortcut tells the cron task to run the job at system boot time.

## Before You Begin

1. Familiarize yourself with Linode's [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of Linode's [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. **Do not** follow the *Configure a Firewall* section yet as this guide includes firewall rules specifically for an OpenVPN server.

1. Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Use Crontab to Schedule a Job or Script to Run at System Startup

To schedule a job to run every time the system boots or reboots, add a new entry to the crontab file as follows.

1. View all of the currently scheduled crontab entries to see whether the entry already exists.

        crontab -l

1. Open the root crontab file for editing using the following command:

        sudo crontab -e

    {{< caution >}}
The command `sudo crontab -e` opens the crontab file for the root user, while the `crontab -e` command opens the file for the current user. Do not add too many root-level jobs as the output can easily become overwhelming and be ignored.
    {{< /caution >}}

1. The program asks you to select an editor. Select a number from the list of all available choices. If you do not enter a number, the default editor is selected.

    {{< output >}}
Select an editor.  To change later, run 'select-editor'.
1. /bin/nano        <---- easiest
2. /usr/bin/vim.basic
3. /usr/bin/vim.tiny
4. /bin/ed

Choose 1-4 [1]:
    {{< /output >}}

1. Add the job to the end of the file. Start a new line with the `@reboot` shortcut, followed by the full path to the command or script and any arguments. The following example adds a job that reads the system time and date when the system boots and appends it to the `clock.txt` file.

        @reboot date >> ~/clock.txt

    {{< note >}}
To add a delay before running the job, prefix the string `sleep <numseconds> &&` to the command. The example above would become `@reboot sleep 30 && date >> ~/clock.txt`.
    {{< /note >}}

1. Save and close the file. The utility displays a message indicating the new crontab entry has been installed.

    {{< output >}}
crontab: installing new crontab
    {{< /output >}}

1. Ensure the `cron` service is enabled when the system activates. Verify the status of the service using the following command. If you see a status of `active (running)`, the service is already running.

        sudo systemctl status cron.service

    {{< output >}}
cron.service - Regular background program processing daemon
     Loaded: loaded (/lib/systemd/system/cron.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2021-04-22 22:10:31 UTC; 14h ago
...
    {{< /output >}}

1. To configure the cron service to start running at boot time, use the following command:

        sudo systemctl enable cron.service

## Some Tips on Effectively Using the Cron Utility

- Test any new cron entries before putting them into production. To validate a new cron entry, reboot the system and ensure the job ran correctly. To test the sample job, reboot the system and verify the system time has been added to the `~/clock.txt` file. If the job is very complicated, thoroughly test all combinations and scenarios.

- If the commands are very lengthy or complicated, consider turning them into a script. Configure the cron entry to call the script, specifying its full path, as in the following example:

        @reboot ~/util/record_start_time

- The `init.d` system might be a better alternative to `@reboot` in some circumstances. An init script allows you to stop or start services, and precisely order a series of events. The `@reboot` service is easier to use and any user can add a job.

- The system launches the cron daemon at boot time, before some processes and after others. This means a service the job or script depends on might not have started yet, which would cause it to fail. Add some sleep time to the script to work around this problem.

- The `@reboot` shortcut might not work consistently on all distributions and all versions, especially after a full shut down and restart sequence.

- To delete a crontab entry, edit the file using `crontab -e` and remove the entry.

- The cron utility sends an email if a job fails or it encounters errors. By default, the email is sent to the owner of the crontab file. You can override this setting with a `MAILTO` directive.

        MAILTO=user@example.com

  - For a local user, enter the following.

        MAILTO=localuser

  - To turn off emails completely, set `MAILTO` to the empty string. This is generally not recommended as you might miss important error messages.

        MAILTO=""

## Learn More About the Cron Utility

To learn more about cron jobs, see our [Schedule Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron/) guide. To view highly-detailed and technical information about cron and crontab, you can also refer to the [*Linux 'man' page for the crontab command*](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html).
