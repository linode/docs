---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: Best practices in preparation for a server reboot.
keywords: ["uptime", "reboot", "downtime", "fault tolerance"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-10-28
modified_by:
  name: Alex Fornuto
published: 2015-02-27
title: Reboot Survival Guide
---

Although constant server uptime is optimal, downtime is inevitable. Cloud infrastructure and RAID arrays offer resilience, but all servers rely on physical hardware, which eventually need maintenance. Hardware aside, kernel updates and other software patches can mean rebooting to ensure your system is secure and up-to-date.

This guide covers best practices to ensure that your server is prepared to handle an unexpected reboot, and considerations for scheduled downtime.

## Testing for Reboot Issues

The best way to know what occurs during a server reboot is to test for it. During your development process, or whenever you make significant changes to your stack, reboot your system and test to ensure that your stack is fully operational afterwards. By conducting scheduled reboot tests, you can be sure that your system is prepared for the unexpected.

## When to Reboot

In most cases a reboot is required when upgrading to a newer Linux kernel. By default, Linode configuration profiles are set to use the latest kernel available provided by Linode at each boot. If you've changed this option or are using a custom configuration, you're responsible for updating the kernel on your system.

{{< note >}}
Linode maintains an RSS feed and web page for cataloging current and deprecated Linux kernels. When the support status of a kernel changes, that change will always be recorded and be pushed out to RSS subscribers. See [Available Kernels](https://www.linode.com/kernels).
{{< /note >}}

Updating certain packages will occasionally require a system reboot too. This does not happen often, but when necessary, the terminal output will inform you that a reboot is needed.

It's not uncommon to see *[fsck](http://linux.die.net/man/8/fsck)* run a filesystem scan on reboot. This does not mean anything is broken--fsck is a regularly scheduled process for optimal system health. Some Linux distros run fsck on every boot, others run the tool after a certain duration, and most distros perfom a filesystem check after unclean shutdowns.

## Backups

All critical data should be backed up, and if possible in more than one location. RAID arrays offer a level of fault tolerance against hard drive failure, but backups are a necessary additional option. Linode provides an integrated [Backups](https://www.linode.com/backups) solution with daily, weekly, and bi-weekly backup windows, as well as a manual snapshot option. Our backups solution is one of many Linode services to ensure that your data is never in only one place.

### Backing up Databases

Proper backup knowledge for a database is important. Steps for properly backing up your MySQL or MariaDB database can be found [here](/docs/databases/mysql/back-up-your-mysql-databases#option-1-create-backups-of-an-entire-database-management-system-using-the-mysqldump-utility).

### Backing up Important Files

If you aren't implementing a system wide backups solution like Linode Backups, you'll need to know specifically what files and folders are important to back up. Although this is dependent on your custom software stack and configuration, here are the most common places to backup:

 * `/home/` - This directory contains the home folders for all of your users, excluding the root user.
 * `/root/` - Your root user's home directory.
 * `/etc/` - The common area for software configuration files.
 * `/var/www` - The common location for web server files. On some systems this may be `/srv/www/`.

## Autostart Services

For future reboots, ensure that any critical stack software is configured to start at boot. This differs depending on operating systems.

{{< note >}}
This guide is a high-level overview, and does not discuss runlevels. Read more about runlevels [here](https://www.centos.org/docs/5/html/5.2/Installation_Guide/s2-init-boot-shutdown-rl.html).
{{< /note >}}

### Debian and Ubuntu

1.  Display which services are currently running, and which are listed to start on boot:

        sudo service --status-all

    The output will resemble the following:

         [ + ]  apache2
         [ + ]  atd
         [ - ]  bootlogs
         [ ? ]  bootmisc.sh
         [ ? ]  checkfs.sh
         [ - ]  checkroot.sh
         [ - ]  console-setup
         [ + ]  cron
         [ + ]  dbus
         [ + ]  exim4
         [ - ]  hostname.sh
         [ ? ]  hwclock.sh
        ...

    Services preceded by a `[ + ]` are currently running, while those following a `[ - ]` are not.

2.  Use `update-rc.d` to add or remove services from startup:

        sudo update-rc.d apache2 defaults
        update-rc.d: using dependency based boot sequencing

        sudo update-rc.d -f rsyslog remove
        update-rc.d: using dependency based boot sequencing

### CentOS 7

1.  Display which services are set to run on boot:

        sudo systemctl list-unit-files

    The output resembles the following:

        UNIT FILE                                   STATE
        proc-sys-fs-binfmt_misc.automount           static
        dev-hugepages.mount                         static
        dev-mqueue.mount                            static
        ...
        ebtables.service                            disabled
        emergency.service                           static
        firewalld.service                           disabled
        getty@.service                              enabled
        halt-local.service                          static
        htcacheclean.service                        static
        httpd.service                               disabled
        ...

2.  Check that the services you need to run on startup are enabled:

        sudo systemctl enable httpd.service

### CentOS 6

1.  Display which services are set to run on boot:

        sudo chkconfig --list

    The output resembles the following:

        auditd          0:off   1:off   2:on    3:on    4:on    5:on    6:off
        crond           0:off   1:off   2:on    3:on    4:on    5:on    6:off
        dovecot         0:off   1:off   2:on    3:on    4:on    5:on    6:off
        htcacheclean    0:off   1:off   2:off   3:off   4:off   5:off   6:off
        httpd           0:off   1:off   2:off   3:off   4:off   5:off   6:off
        ip6tables       0:off   1:off   2:on    3:on    4:on    5:on    6:off
        iptables        0:off   1:off   2:on    3:on    4:on    5:on    6:off
        mysqld          0:off   1:off   2:on    3:on    4:on    5:on    6:off
        netconsole      0:off   1:off   2:off   3:off   4:off   5:off   6:off
        netfs           0:off   1:off   2:off   3:on    4:on    5:on    6:off
        network         0:off   1:off   2:on    3:on    4:on    5:on    6:off
        ntpd            0:off   1:off   2:on    3:on    4:on    5:on    6:off
        ntpdate         0:off   1:off   2:off   3:off   4:off   5:off   6:off
        postfix         0:off   1:off   2:on    3:on    4:on    5:on    6:off
        rdisc           0:off   1:off   2:off   3:off   4:off   5:off   6:off
        restorecond     0:off   1:off   2:off   3:off   4:off   5:off   6:off
        rsyslog         0:off   1:off   2:on    3:on    4:on    5:on    6:off
        saslauthd       0:off   1:off   2:off   3:off   4:off   5:off   6:off
        sshd            0:off   1:off   2:on    3:on    4:on    5:on    6:off
        udev-post       0:off   1:on    2:on    3:on    4:on    5:on    6:off

    Optionally, run `chkconfig --list` on specific services to see only their status:

        sudo chkconfig --list httpd
        httpd           0:off   1:off   2:off   3:off   4:off   5:off   6:off

2.  Check that the services you need at boot are enabled:

        sudo chkconfig --level 3 httpd on

## SSL Passphrases

Remember, if you use SSL certificates that require a passphrase, enter the passphrase on boot, or your web services will not come up. Use the [LISH](/docs/networking/using-the-linode-shell-lish) console to enter your passphrase on reboot:

    Starting web server (apache2)...[Mon Sep 22 09:03:45 2008] [warn] module ssl_module is already loaded, skipping
    Apache/2.2.3 mod_ssl/2.2.3 (Pass Phrase Dialog)
    Some of your private key files are encrypted for security reasons.
    In order to read them you have to provide the pass phrases.

    Server 127.0.0.1:443 (RSA)
    Enter pass phrase:

    OK: Pass Phrase Dialog successful.

The console does not display any characters (ex: **\***) as you enter your passphrase.

{{< note >}}
If you use full-disk encryption, enter your password in the LISH console after a reboot.
{{< /note >}}

## Firewall Rules

If you followed the [Creating a Firewall](/docs/security/securing-your-server#configure-a-firewall) section of our [Securing your Server](/docs/security/securing-your-server) guide, your firewall rules should already be saved, and loaded on boot automatically. If, however, you've manually configured your `iptables` exceptions live, they may not persist through a server reboot.

1.  Ensure that your custom firewall rules are saved:

        sudo iptables-save > /etc/iptables.firewall.rules

2.  Follow the steps linked above for your operating system to ensure that your `iptables` rules load on reboot.

## Load Balancing for Fault Tolerance

If your system absolutely **cannot** afford any downtime, then scale the platform across multiple servers. Multi-server availability ensures that your service can remain live even if one of the servers goes down. The services and options for enabling highly available stacks are too numerous to detail here, but refer to these guides to get started with high availability:

{{< note >}}
You can deploy your services to an additional Linode to enable high availability.  New Linodes will automatically be placed on known good hosts, and can ensure that vital services remain online throughout the reboot process.
{{< /note >}}

 - [Linode NodeBalancers](/docs/platform/nodebalancer/)
 - [Using Nginx for Proxy Services and Software Load Balancing](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
 - [MySQL Master-Master Replication](/docs/databases/mysql/mysql-master-master-replication)
 - [MariaDB Clusters with Galera](/docs/databases/mariadb/clustering-with-mariadb-and-galera)
