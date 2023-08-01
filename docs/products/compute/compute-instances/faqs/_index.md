---
title: "FAQs"
title_meta: "FAQs for Compute Instances"
description: "Find quick answers to some of the most commonly asked questions about Compute Instances."
tab_group_main:
    weight: 60
published: 2009-11-16
modified: 2023-01-18
aliases: ['/beginners-guide/','/platform/linode-beginners-guide/','/platform/billing-and-support/linode-beginners-guide/','/guides/linode-beginners-guide/']
---

If you're relatively new to Linux system administration, or just new to our platform, this guide will help address some of the most common questions we receive. If you've just created your first Linode account, please first refer to our [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide and return here once your Compute Instance has been deployed.

## How do I log into my Compute Instance?

All Compute Instances can be accessed through [Lish](/docs/products/compute/compute-instances/guides/lish/) and [SSH](/docs/guides/connect-to-server-over-ssh/) (if properly configured). Both methods provide you with command line access to your system. You can learn more about connecting to your Linode for the first time in the [connecting to your Linode with SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) section of our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide.

## How do I host websites on my Compute Instance?

Since you have full root access to your Compute Instance's system, you're free to choose between a number of popular web servers to host your websites. If you'd like to install a full LAMP stack (including support for PHP/Perl/Python scripting and databases), our [LAMP guides](/docs/lamp-guides/) will explain each step of the process. If you'd just like to host a site that consists of static pages, these guides explain the installation of a few popular web server packages:

- [Hosting Websites with Apache](/docs/websites/apache/): Apache is the most popular web server software on the Internet.
- [Hosting Websites with Nginx](/docs/websites/nginx): Nginx is a fast, scalable web server that is well suited for both static and dynamic content.
- [Hosting Websites with Lighttpd](/docs/websites/lighttpd/): Lighttpd is popular with users who want a very small, lightweight web server.

## How can I send and receive email with my Compute Instance?

{{< content "email-warning-shortguide" >}}

If you'd prefer to leave the management of your email to a third party, you may follow our [Google Workspace](/docs/guides/using-google-workspace-for-email/) guide. Those desiring to operate their own mail server will find these guides helpful:

- [Postfix Guides](/docs/email/postfix/): Information on using the highly popular Postfix MTA (mail transfer agent).
- [Zimbra Guides](/docs/email/zimbra/): Instructions for deploying Zimbra, a unified messaging system that includes email and calendar.
- [Citadel Groupware](/docs/email/citadel/): An easy to use "all in one" email system with a web-based administration panel.

## Does my Compute Instance have a control panel?

We provide a base system install of the Linux distribution of your choice. Although there isn't a control panel installed by default, you're welcome to obtain and install one if you like. You may wish to try an open-source control panel; we have numerous [control panel guides](/docs/websites/cms/) available to assist you with getting one installed.

Please note that we do *not* sell control panel licenses. If you decide you'd like to use a commercial product, you'll need to obtain a license for it separately.

## How do I upload files to my Compute Instance?

By default, SSH is enabled on all newly deployed Compute Instances. You may use any file transfer program that supports the SFTP standard to upload files. We've created guides for some commonly used programs:

- [WinSCP](/docs/guides/transfer-files-with-winscp-on-windows/): Windows 95 through Windows 10
- [Cyberduck](/docs/guides/transfer-files-with-cyberduck-on-mac-os-x/): Mac OS X
- [Filezilla](/docs/guides/filezilla/): Available on all major desktop platforms, including Linux-based operating systems

## How can I download a backup of my Compute Instance?

First, you might want to give the [Linode Backup Service](http://www.linode.com/backups/) a try. It's a fast, flexible and cost-effective way to make extra copies of your data. That said, the old saying "you can never have too many backups" is certainly true. In case you'd like to "roll your own" solution, we've created guides that explain various ways of creating backups of your Compute Instance's filesystems:

- [Introduction to Rsync](/docs/guides/introduction-to-rsync/): Using `rsync` to mirror files to another server.
- [Using Rdiff-backup with SSHFS](/docs/guides/using-rdiff-backup-with-sshfs/): An easy approach to using the `rdiff-backup` utility to maintain differential backups.
- [Cloning a Disk](/docs/products/compute/compute-instances/guides/clone-instance/#cloning-to-an-existing-linode): Creating an exact copy of a disk in the Cloud Manager.
- [Copying a Disk Over SSH](/docs/products/compute/compute-instances/guides/copy-a-disk-image-over-ssh/): How to download an exact binary image of your Compute Instance's disk over SSH.

## How can I install software on my Compute Instance?

Please refer to our guide on [Linux package management](/docs/guides/linux-package-management-overview/) for distribution-specific instructions on getting software installed on your Compute Instance. Since you have full root access to your system, you're allowed to install anything that complies with our [terms of service](http://www.linode.com/tos).

## How do I add another IP address?

You may add an [additional public IP address](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#adding-an-ip-address) from the **Networking** tab for each Compute Instance in the Cloud Manager. After you've added a new IP address, you must [configure static networking](/docs/products/compute/compute-instances/guides/manual-network-configuration/) or enable [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#turn-network-helper-on-for-individual-configuration-profiles) and reboot your instance before it can be used.

{{< note >}}
We require technical justification for the issuance of new IP addresses; you may need to open a ticket from the [Support Tickets](https://cloud.linode.com/support/tickets) section of the Cloud Manager explaining the reason for the new IP.
{{< /note >}}

If you'd like to take advantage of our private networking feature, you may add a private IP to your Compute Instance from the **Networking** tab for each instance in the Cloud Manager. Private IP addresses are not publicly accessible, although they are accessible from other Compute Instances in the same data center. Although we take measures to prevent others from intercepting your private IP traffic, you may still wish to configure a firewall to allow access from only the Compute Instances that you operate.

## How do I set the reverse DNS for an IP address?

To [set rDNS](/docs/products/compute/compute-instances/guides/configure-rdns/), you can use the **More Options** ellipsis next to your Compute Instance's IPv4 address from the **Networking** tab in the Cloud Manager. Please note that the value you specify needs to match an A record or CNAME in DNS pointing to your Compute Instance's IP address. It may take up to 48 hours for reverse DNS updates to take effect.

## Why does my Compute Instance keep crashing?

You may be running out of memory, disk space, or other resources. Have a look at our [troubleshooting guide](/docs/troubleshooting/) for tips on diagnosing problems and easy steps for fixing common issues.

If an application is crashing, be sure to check its error logs. These are typically located within an application-specific directory under `/var/log`.

## Why is my connection to my Compute Instance slow or broken?

First, check to be sure that the service (SSH, HTTP, etc.) you're trying to access is running. If your Compute Instance runs a firewall, [check your firewall rules](/docs/guides/control-network-traffic-with-iptables/#view-your-current-iptables-rules) to ensure that you're allowing traffic to the desired destination. If this doesn't help, generate [MTR reports](/docs/guides/diagnosing-network-issues-with-mtr/) to and from your Compute Instance, and [submit them](/docs/products/platform/get-started/guides/support/#contacting-linode-support) via the  [Support Tickets](https://cloud.linode.com/support/tickets)  section in the Cloud Manager. You may need to use [Lish](/docs/products/compute/compute-instances/guides/lish/) if you're having problems reaching your Compute Instance via normal networking.

## How can I upgrade or downgrade my Compute Instance?

You can change your Compute Instance's plan by using the Resize feature in the Cloud manager. If you're downgrading, please make sure you've resized your disk images to fit within your desired plan's disk space allocation before issuing the resize job. For instructions, refer to our guide on [Resizing a Compute Instance](/docs/products/compute/compute-instances/guides/resize/).

## How can I test downloads speeds from different data centers?

You may use our [speed test](http://www.linode.com/speedtest/) page to check latency and download speeds from your location to each of our data centers. Many customers with a large Asia-Pacific presence find that our Singapore and Tokyo facilities work best, while those with a visitor base in Europe tend to prefer our London or Frankfurt data centers.

## Can I transfer my Compute Instance to another data center?

Yes. Any time you'd like to transfer your Compute Instance, you can proceed with a migration from the **Disks/Configs** tab for any instance within the [Cloud Manager](https://cloud.linode.com). For more information, see our [Data Center Migration Guide](/docs/products/compute/compute-instances/guides/migrate-to-different-dc/).

A migration will result in some changes that will be displayed in a caution message for your review before officially beginning the migration process. Your disks and configuration profiles will move with your Compute Instance, although your IP addresses will need to change. We strongly recommend reviewing this  caution message carefully before proceeding for a list of all changes that you can expect.

## Where can I learn about Linux basics?

For those just getting started with Linux systems, we've created a series of guides that will help explain basic concepts:

- [Introduction to Linux Concepts](/docs/guides/introduction-to-linux-concepts/): An introduction to Linux and Unix-like systems.
- [Linux Users and Groups](/docs/guides/linux-users-and-groups/): An introduction to the principal concepts and use of the users and groups system.
- [Using the Terminal](/docs/guides/using-the-terminal/): Introducing the command line interface known as the shell or terminal.
- [Linux Package Management](/docs/guides/linux-package-management-overview/): How to install software on your Compute Instance.
- [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/): Keeping your Linode safe from unauthorized access or abuse.

## Where can I get help with something not covered here?

We always recommend consulting our excellent [user community](https://www.linode.com/community/questions/) first when faced with a question that doesn't seem to be addressed in our documentation. There is also an active community of users available to help on [IRC](https://www.linode.com/chat). If you get stuck you may also open a [support](https://www.linode.com/contact) ticket from the "Get Help" sidebar in the Cloud Manager.