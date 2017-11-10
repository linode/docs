---
author:
  name: Linode
  email: docs@linode.com
description: 'Steps to take if your Linode becomes compromised by unauthorized parties.'
keywords: ["root compromise", "Linode troubleshooting", "Linode troubleshooting", "Linux configuration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['troubleshooting/compromise-recovery/']
modified: 2013-07-12
modified_by:
  name: Linode
published: 2009-08-26
title: Recovering from a System Compromise
---

Sometimes, your system gets compromised. Whether it was because of a weak user password, a vulnerable system package, or an unpatched web application, sometimes you've got to put the brakes on your server and see what you can salvage. Unfortunately, after a hack, it's virtually impossible to determine the full scope of an attacker's reach into a compromised system. The server should not be trusted for production use.

This guide offers a few methods to recover from a system compromise:

-   **The Rebuild Button**: Fast, easy, destructive, and 100% secure. It deletes everything so you can start over.
-   **Copying Data Offsite**: Access your data while your server is offline, and copy what you need before you wipe your Linode.
-   **Using a Second Linode**: This is the most involved approach, but provides the most seamless transition to your new system.

If you choose to keep your data, you will need to audit all the content on the affected system to prevent the transfer of malicious components to a new system. Please understand that compromised servers have a negative affect on our network resources, and prompt actions must be taken to prevent service interruption.

## The Rebuild Button

This is the easiest option, yet the most destructive. It will wipe all of your data from your Linode and let you start over with a fresh disk.

1.  Log in to the [Linode Manager](https://manager.linode.com/).
2.  Select the **Linodes** tab.
3.  Select the compromised Linode.
4.  Select the **Rebuild** tab.
5.  Choose your new distribution, disk size, swap disk, and root password.
6.  Click **Rebuild**.

This will delete your current compromised images and deploy fresh disks. All data that was stored on the Linode previously will be unrecoverable, but your system will be free of compromise. At this point, we recommend that you follow the instructions in the [Securing Your Server](/docs/securing-your-server) guide to disable root logins via SSH, or to disable password logins, in favor of SSH keys only, for all accounts.

## Copying Data Offsite

If there is data on the compromised Linode that you need to retain, you can use the [Finnix rescue environment](/docs/troubleshooting/rescue-and-rebuild) to examine your old disks first. Once you have verified the integrity of your data, copy it to the appropriate location on your new server or another offsite location. Our [SSH disk copy guide](/docs/migrate-to-linode/disk-images/copying-a-disk-image-over-ssh) explains how to copy your entire disk offsite.

## Using a Second Linode

You can use a second Linode for the most seamless transition to a new system.

1.  Begin by adding a new Linode to your account. See the [Getting Started](/docs/getting-started) guide for instructions.
2.  Set a strong password for **root** and all user accounts, making sure not to reuse any passwords from the compromised system.
3.  Upgrade all system packages:

    Debian/Ubuntu:

        apt-get update
        apt-get upgrade --show-upgraded

    CentOS/Fedora:

        yum update

4.  Follow the instructions in the [Securing Your Server](/docs/securing-your-server) guide to disable root logins via SSH, or to disable password logins, in favor of SSH keys only, for all accounts.

### Rebuild Your Configuration

Rebuild your production server's configuration on the new Linode.

-   Install updated versions of all applications
-   Restrict access to all applications appropriately, using firewall software or any other methods deemed appropriate
-   Assign new administrative passwords for all web applications

### Copy and Audit Your Data

The next task is to copy your data to the new Linode, and make sure you've purged all compromised portions. Follow these steps:

1.  Create a temporary directory on the new Linode.
2.  Copy any needed user and configuration data from the compromised Linode using [rsync](/docs/linux-tools/utilities/rsync) or `scp`. If you are not familiar with these programs, you can find more information by entering the `man rsync` or `man scp` commands.

    {{< caution >}}
Do not log in to the new Linode from the compromised Linode. Files should be pulled from the compromised server to your new setup instead.
{{< /caution >}}

3.  Audit your data using tools such as `rkhunter` and `clamav`. You may wish to use additional malware scanners as well to be certain you aren't retaining tainted files. Examine all system scripts manually for contaminated code, and replace all suspicious executable files with known good copies.

Alternately, if you're not comfortable copying anything from the compromised system to your new server prior to auditing the data, you may wish to use the [Finnix rescue environment](/docs/troubleshooting/finnix-rescue-mode) to examine your old disks first. Once you have verified the integrity of your data, copy it to the appropriate location on your new server.

### Swap IP Addresses

Next, you'll want to swap IP addresses so the new Linode uses the IP address assigned to the old Linode. Please note that if you configured any network services to use the new Linode's IP address, you will most likely want to modify their configurations now to use the old Linode's IP instead. For instructions, see [Swapping IP Addresses](/docs/networking/remote-access/#swapping-ip-addresses).

 {{< note >}}
To swap IP addresses, both Linodes must be located in the same data center.
{{< /note >}}

Alternately, you may wish to [update your DNS entries](/docs/websites/hosting-a-website/#add-dns-records) to point to the new Linode's IP address instead. Please be aware that DNS propagation across the Internet may take some time. Boot the new Linode to resume normal operations.

### Preserving Data for Forensics and Linode Cancellation

You may wish to download a complete copy of the old Linode's disk(s) for forensic analysis. To do this, follow the instructions in our [SSH disk copy guide](/docs/migrate-to-linode/disk-images/copying-a-disk-image-over-ssh). Even if you don't need a full copy of the affected disks, you may still want to make a copy of all system log files for later review.

When you no longer need the old Linode's disks, you should [remove the Linode](/docs/platform/billing-and-payments/#removing-services). Your account will be issued a pro-rated credit for that Linode's charges in the current billing period.
