---
author:
  name: Linode
  email: docs@linode.com
description: 'Beginner''s Guide to Linode''s Platform answers common configuration questions about the Linode cloud.'
keywords: ["linode beginners guide", "linux beginner", "linode beginner", "Linode guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['beginners-guide/']
modified: 2017-03-02
modified_by:
  name: Phil Zona
published: 2009-11-16
title: 'Linode Beginner''s Guide'
---

If you're relatively new to Linux system administration, or just new to our platform, this guide will help address some of the most common questions we receive. If you've just created your first Linode account, please first refer to our [Getting Started](/docs/getting-started/) Guide and return here once your Linode has been deployed.

![Linode Beginners Guide](/docs/assets/linode-beginners-guide.png)

## How do I log into my Linode?

By default, all Linodes are deployed with SSH enabled. This allows command line access through the shell. You can learn more about connecting to your Linode for the first time in the [connecting to your Linode with SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) section of our [Getting Started](/docs/getting-started/) guide.

## How do I host websites on my Linode?

Since you have full root access to your Linode, you're free to choose between a number of popular web servers to host your websites. If you'd like to install a full LAMP stack (including support for PHP/Perl/Python scripting and databases), our [LAMP guides](/docs/lamp-guides/) will explain each step of the process. If you'd just like to host a site that consists of static pages, these guides explain the installation of a few popular web server packages:

-   [Hosting Websites with Apache](/docs/websites/apache/) - Apache is the most popular web server software on the Internet.
-   [Hosting Websites with Nginx](/docs/websites/nginx) - Nginx is a fast, scalable web server that is well suited for both static and dynamic content.
-   [Hosting Websites with Lighttpd](/docs/websites/lighttpd/) - Lighttpd is popular with users who want a very small, lightweight web server.

## How can I send and receive email with my Linode?

If you'd prefer to leave the management of your email to a third party, you may follow our [Google Apps guide](/docs/email/google-mail/). Those desiring to operate their own mail server will find these guides helpful:

-   [Postfix Guides](/docs/email/postfix/) - Information on using the highly popular Postfix MTA (mail transfer agent).
-   [Zimbra Guides](/docs/email/zimbra/) - Instructions for deploying Zimbra, a unified messaging system that includes email and calendar.
-   [Citadel Groupware](/docs/email/citadel/) - An easy to use "all in one" email system with a web-based administration panel.

## Does my Linode have a control panel?

We provide a base system install of the Linux distribution of your choice. Although there isn't a control panel installed by default, you're welcome to obtain and install one if you like. You may wish to try an open-source control panel; we have numerous [control panel guides](/docs/websites/cms) available to assist you with getting one installed.

Please note that we do *not* sell control panel licenses. If you decide you'd like to use a commercial product, you'll need to obtain a license for it separately.

## How do I upload files to my Linode?

By default, SSH is enabled on all newly deployed Linodes. You may use any file transfer program that supports the SFTP standard to upload files. We've created guides for some commonly used programs:

-   [WinSCP](/docs/networking/file-transfer/transfer-files-winscp) - Windows 95 through Windows 10
-   [Cyberduck](/docs/networking/file-transfer/transfer-files-cyberduck) - Mac OS X
-   [Filezilla](/docs/tools-reference/file-transfer/filezilla) - Available on all major desktop platforms, including Linux-based operating systems

## How can I download a backup of my Linode?

First, you might want to give the [Linode Backup Service](http://www.linode.com/backups/) a try. It's a fast, flexible and cost-effective way to make extra copies of your data. That said, the old saying "you can never have too many backups" is certainly true. In case you'd like to "roll your own" solution, we've created guides that explain various ways of creating backups of your Linode's filesystems:

-   [Introduction to Rsync](/docs/tools-reference/tools/introduction-to-rsync/) - Using `rsync` to mirror files to another server.
-   [Using Rdiff-backup with SSHFS](/docs/security/backups/using-rdiff-backup-with-sshfs/) - An easy approach to using the `rdiff-backup` utility to maintain differential backups.
-   [Duplicating a Disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#duplicating-a-disk) - Creating an exact copy of a disk in the Linode Manager.
-   [Copying a Disk Over SSH](/docs/migrate-to-linode/disk-images/copying-a-disk-image-over-ssh) - How to download an exact binary image of your Linode's disk over SSH.

## How can I install software on my Linode?

Please refer to our guide on [Linux package management](/docs/tools-reference/linux-package-management/) for distribution-specific instructions on getting software installed on your Linode. Since you have full root access to your system, you're allowed to install anything that complies with our [terms of service](http://www.linode.com/tos).

## How do I add another IP address?

You may add an additional public IP address from the "Remote Access" tab in the Linode Manager. After you've added a new IP address, you must [configure static networking](/docs/networking/linux-static-ip-configuration/) or enable [Network Helper](/docs/platform/network-helper#turn-network-helper-on-for-individual-configuration-profiles) and reboot your Linode before it can be used.

{{< note >}}
We require technical justification for the issuance of new IP addresses; you may need to open a ticket from the "Support" tab of the Linode Manager explaining the reason for the new IP.
{{< /note >}}

If you'd like to take advantage of our private networking feature, you may add a private IP to your Linode from the "Remote Access" tab of the Linode Manager. Private IP addresses are not publicly accessible, although they are accessible from other Linodes in the same datacenter. Although we take measures to prevent others from intercepting your private IP traffic, you may still wish to configure a firewall to allow access from only the Linodes that you operate.

## How do I set the reverse DNS for an IP address?

You may use the "Reverse DNS" link on the "Remote Access" tab in the Linode Manager. Please note that the value you specify needs to match an A record or CNAME in DNS pointing to your Linode's IP address. It may take up to 48 hours for reverse DNS updates to take effect.

## Why does my Linode keep crashing?

You may be running out of memory, disk space, or other resources. Have a look at our [troubleshooting guide](/docs/troubleshooting/) for tips on diagnosing problems and easy steps for fixing common issues.

If an application is crashing, be sure to check its error logs. These are typically located within an application-specific directory under `/var/log`.

## Why is my connection to my Linode slow or broken?

First, check to be sure that the service (SSH, HTTP, etc.) you're trying to access is running. If your Linode runs a firewall, [check your firewall rules](/docs/security/firewalls/control-network-traffic-with-iptables#view-your-current-iptables-rules) to ensure that you're allowing traffic to the desired destination. If this doesn't help, generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr) to and from your Linode, and submit them via the "Support" tab in the Linode Manager. You may need to use [Lish](/docs/troubleshooting/using-lish-the-linode-shell) if you're having problems reaching your Linode via normal networking.

## How can I upgrade or downgrade my Linode?

Resizing your Linode is automated via the "Resize" tab in the Linode Manager, pending availability for the plan you wish to move to in your datacenter. If you're downgrading, please make sure you've resized your disk images to fit within your desired plan's disk space allocation before issuing the resize job. For more information, refer to our guide on [resizing a Linode](/docs/migrate-to-linode/disk-images/resizing-a-linode)

## How can I test downloads speeds from different datacenters?

You may use our [speed test](http://www.linode.com/speedtest/) page to check latency and download speeds from your location to each of our datacenters. Many customers with a large Asia-Pacific presence find that our Singapore and Tokyo facilities work best, while those with a visitor base in Europe tend to prefer our London or Frankfurt datacenters.

## Can I transfer my Linode to another datacenter?

Yes! Any time you'd like to transfer your Linode, you may open a ticket via the "Support" tab in the Linode Manager to request a DC migration. Your disks and configuration profiles will move with your Linode, although your IP addresses will need to change. Once we stage your migration, you'll see a "migration pending" link in the Linode Manager, which you may use at your convenience to migrate your Linode.

## Where can I learn about Linux basics?

For those just getting started with Linux systems, we've created a series of guides that will help explain basic concepts:

-   [Introduction to Linux Concepts](/docs/tools-reference/introduction-to-linux-concepts/) - An introduction to Linux and Unix-like systems.
-   [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) - An introduction to the principal concepts and use of the users and groups system.
-   [Using the Terminal](/docs/networking/ssh/using-the-terminal/) - Introducing the command line interface known as the shell or terminal.
-   [Linux Package Management](/docs/tools-reference/linux-package-management/) - How to install software on your Linode.
-   [Securing your Server](/docs/security/securing-your-server) - Keeping your Linode safe from unauthorized access or abuse.

## Where can I get help with something not covered here?

We always recommend consulting our excellent [user community](https://forum.linode.com) first when faced with a question that doesn't seem to be addressed in our documentation. There is also an active community of users available to help on [IRC](https://www.linode.com/chat). If you get stuck you may also open a [support](https://www.linode.com/contact) ticket from the "Support" tab in the Linode Manager.
