---
slug: how-to-use-crontab-to-run-job-at-startup
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide explains how to use the cron utility and the crontab file to run a job or script when the system boots.'
og_description: 'This guide explains how to use the cron utility and the crontab file to run a job or script when the system boots.'
keywords: ['cron','crontab','reboot','scheduling']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-22
modified_by:
  name: Linode
title: "Using Crontab to Run a Job or Script at System Startup"
h1_title: "How to Use Crontab to Run a Job or Script at System Startup."
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[Wikipedia Cron Page](https://en.wikipedia.org/wiki/Cron)'
- '[Crontab Man Page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html)'
---

The `cron` utility is a job-scheduling tool found on all Linux and Unix operating systems, as well as MacOS. Although `cron` is typically used to schedule jobs at fixed times, dates, and intervals, it can also launch jobs at system boot time. This guide explains how to use the `cron` utility and the `crontab` file to run a job or script when the system boots.

## Learning About the Cron Utility and the Crontab File

Each `cron` job represents a command or script that automatically runs according to a predetermined schedule. The `cron` utility periodically scans the `crontab` entries and launches any job that is due to run. The `cron` jobs for the system are listed in the `/etc/crontab` file, where each line represents a different job. Every job must include a schedule, along with a command or script to run. There are different `crontab` files for different users, allowing jobs to be associated with an owner.

The following example demonstrates a `crontab` entry to run the `check-routers` script on an hourly basis.

{{< output >}}
0 \* \* \* \* /opt/bin/check-routers
{{< /output >}}

The first five fields represent the minute, hour, day of the month, month, and day of the week when the job should run. The `*` symbol is a wildcard meaning always. So this job runs at the top of the hour, every hour of the day and every day of the year.

To simplify the syntax, `crontab` offers shortcuts for very common schedules. For instance, the `@hourly` shortcut runs a job at the start of every hour. So the last example can also be entered this way:

{{< output >}}
@hourly /opt/bin/check-routers
{{< /output >}}

Similarly, the `@reboot` shortcut tells the `cron` task to run the job at system boot time.

## Before You Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of Linode's [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Using Crontab to Schedule a Job or Script to Run at System Startup

To schedule a job to run every time the system boots or reboots, add a new entry to the `crontab` file as follows.

1.  View all of the currently scheduled `crontab` entries to see whether the entry already exists.

        crontab -l
2.  Open the root `crontab` file for editing using the following command.

        sudo crontab -e
    {{< note >}}
The command `sudo crontab -e` opens the `crontab` file for the root user, while the `crontab -e` command opens the file for the current user. Be careful not to add too many root-level jobs as the output can easily become overwhelming and be ignored.
    {{< /note >}}
3.  The program asks you to select an editor. Select a number from the list of all available choices. If you do not enter a number, the default editor is selected.
    {{< output >}}
Select an editor.  To change later, run 'select-editor'.
  1. /bin/nano        <---- easiest
  2. /usr/bin/vim.basic
  3. /usr/bin/vim.tiny
  4. /bin/ed

Choose 1-4 [1]:
    {{< /output >}}
4.  Add the job to the end of the file. Start a new line with the `@reboot` shortcut, followed by the full path to the command or script and any arguments. The following example adds a job that reads the system time and date when the system boots and appends it to the `clock.txt` file.

        @reboot date >> ~/clock.txt
    {{< note >}}
To add a delay before running the job, add the string `sleep <numseconds> &&` to the front of the command. The example above would become `@reboot sleep 30 && date >> ~/clock.txt`.
    {{< /note >}}
5.  Save and close the file. The utility displays a message indicating the new `crontab` entry has been installed.
    {{< output >}}
crontab: installing new crontab
    {{< /output >}}
6.  Ensure the `cron` service is enabled when the system activates. Verify the status of the service using the following command. If you see a status of `active (running)`, the service is already running.

        sudo systemctl status cron.service
    {{< output >}}
cron.service - Regular background program processing daemon
     Loaded: loaded (/lib/systemd/system/cron.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2021-04-22 22:10:31 UTC; 14h ago
...
    {{< /output >}}
7.  To configure the `cron` service to start running at boot time, use the following command.

        sudo systemctl enable cron.service

## Some Tips on Effectively Using the Cron Utility

*   Test any new cron entries before putting them into production. To validate a new cron entry, reboot the system and ensure the job ran correctly. To test the sample job, reboot the system and verify the system time has been added to the `~/clock.txt` file. If the job is very complicated, thoroughly test all combinations and scenarios.
*   If the commands are very lengthy or complicated, consider turning them into a script. Configure the `cron` entry to call the script, specifying its full path, as in the following example.

        @reboot ~/util/record_start_time
*   The `init.d` system might be a better alternative to `@reboot` in some circumstances. An init script allows you to stop or start services, and precisely order a series of events. The `@reboot` service is easier to use and any user can add a job.
*   The system launches the `cron` daemon at boot time, before some processes and after others. This means a service the job or script depends on might not have started yet, which would cause it to fail. Add some sleep time to the script to work around this problem.
*   The `@reboot` shortcut might not work consistently on all distributions and all versions, especially after a full shut down and restart sequence.
*   To delete a `crontab` entry, edit the file using `crontab -e` and remove the entry.
*   The `cron` utility sends an email if a job fails or it encounters errors. By default, the email is sent to the owner of the `crontab` file. You can override this setting with a `MAILTO` directive.

        MAILTO=user@example.com
    For a local user, enter the following.

        MAILTO=localuser
    To turn off emails completely, set `MAILTO` to the empty string. This is generally not recommended as you might miss important error messages.

        MAILTO=""

## Learning More About the Cron Utility

To learn more about `cron` jobs, see the [Linode guide to scheduling cron jobs](/docs/tools-reference/tools/schedule-tasks-with-cron/). The [*Linux 'man' page for the crontab command*](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html) contains highly technical information about the command. The [*Wikipedia page*](https://en.wikipedia.org/wiki/Cron) features a good overview along with some examples.