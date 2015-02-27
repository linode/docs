---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: Best practices in preparation for a server reboot.
keywords: 'uptime,reboot,downtime,fault tolerance'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, February 27, 2015
modified_by:
  name: Alex Fornuto
published: 'Friday, February 27, 2015'
title: Preparing for Server Reboots
---

While constant server uptime is often the goal of an admin, the realities of life usually get in the way. While cloud infrastructure and RAID arrays offer a layer of abstraction, all servers run in some form on physical hardware, which eventually needs maintenance. Hardware aside, kernel updates and other software patches can mean rebooting to ensure your system is secure and up to date.

This guide goes over best practices to ensure that your server is prepared to handle an unexpected reboot, and considerations to make for scheduled downtime.

## Backups

First and foremost, any and all critical data should be backed up, and in more than one location if possible. While RAID arrays offer a level of fault tolerance against hard drive failure, RAID != backups. Linode provides an integrated [Backups](https://www.linode.com/backups) solution with daily, weekly, and bi-weekly backup windows, as well as a manual snapshot option. Our backups solution is just one of many services and solutions you can choose from to ensure that your data is never on only one system.

### Backing up Databases

It's important to know how to properly back up your database. On an active server where the database is being written to constantly, file-level backups of a DB can be inconsistent. By "dumping" your database to a file on a regular basis, you can ensure that your backup service pulls a consistent and readable copy of your database, should you need to restore it later. If you're using MySQL or MariaDB, you can dump all databases with a simple one line command:

    mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -p

This will create a timestamped file of your current set of databases. You can automate this process by adding a line to `crontab`;

    0 1 * * * /usr/bin/mysqldump --all-databases > dump-$( date '+%Y-%m-%d_%H-%M-%S' ).sql -u root -pPASSWORD

For the example above, you can use the command `which mysqldump` to confirm the correct path to the command, and be sure to replace `root` with the mysql user you would like to run backups as, and `PASSWORD` with the correct password for that user.

### Backing up Important Files

If you aren't implementing a system wide backups solution like Linode Backups, you'll need to know specifically what files and folders are important to back up. While this is largely dependent on your custom software stack and configuration, here are the most common places to back up:

 * `/home/` - This directory contains the home folders for all of your users, excluding the root user.
 * `/root/` - Your root user's home directory.
 * `/etc/` - The common area for software configuration files.
 * `/var/www` - The common location for web server files. On some systems this may be `/srv/www/`.

## Autostart Services

To be sure your stack is reboot tolerant, ensure that the software critical to your stack starts properly on boot. How to do this depends on your operating system.

{: .note }
> This is a high-level overview, and does not discuss runlevels. You can read more about runlevels [here](https://www.centos.org/docs/5/html/5.2/Installation_Guide/s2-init-boot-shutdown-rl.html).

### Debian and Ubuntu

1.  Start by seeing what services are currently running, and which are listed to start on boot:

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

2.  Now you can use `update-rc.d` to add or remove services from startup:

        sudo update-rc.d apache2 defaults
        update-rc.d: using dependency based boot sequencing
        
        sudo update-rc.d -f rsyslog remove
        update-rc.d: using dependency based boot sequencing

### CentOS 7

1.  Check to see what services are set to run on boot:

        sudo systemctl list-unit-files

    The output will resemble the following:

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

2.  Make sure the services you need on to run on startup are enabled:

        sudo systemctl enable httpd.service

### CentOS 6

1.  Check to see what services are set to run on boot:

        sudo chkconfig --list

    The output will resemble the following:

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

    You can also run `chkconfig --list` on specific services to see just their status:

        sudo chkconfig --list httpd
        httpd           0:off   1:off   2:off   3:off   4:off   5:off   6:off

2.  Make sure the services you need at boot are enabled:

        sudo chkconfig --level 3 httpd on

## SSL Passphrases

It's important to remember that if you use SSL certificates that require a passphrase, you need to enter that passphrase on boot, or your web services will not come up. You can use the [LISH](/docs/networking/using-the-linode-shell-lish) console to enter your passphrase on reboot:

    Starting web server (apache2)...[Mon Sep 22 09:03:45 2008] [warn] module ssl_module is already loaded, skipping
    Apache/2.2.3 mod_ssl/2.2.3 (Pass Phrase Dialog)
    Some of your private key files are encrypted for security reasons.
    In order to read them you have to provide the pass phrases.

    Server 127.0.0.1:443 (RSA)
    Enter pass phrase:

    OK: Pass Phrase Dialog successful.

Take note that the console will not show any characters (ex: **\***) as you enter your passphrase.

{: .note} 
>If you use full-disk encryption you will also need to enter your password in the LISH console after a reboot.

## Firewall Rules

If you followed the [Creating a Firewall](/docs/security/securing-your-server#creating-a-firewall) section of our [Securing your Server](/docs/security/securing-your-server) guide, your firewall rules should already be saved, and loaded on boot automatically. If, however, you've manually configured your `iptables` exceptions live, they may not be persistent through a server reboot. 

1.  Ensure that your custom firewall rules are saved:

        sudo iptables-save > /etc/iptables.firewall.rules

2.  Now follow the steps linked above for your operating system to ensure that your `iptables` rules load on reboot.

## Load Balancing for Fault Tolerance

Finally, if you have a system that absolutely **cannot** afford any downtime, it's important that you scale the platform across multiple servers, to ensure that your service can remain live even if one of the servers goes down. The services and options for enabling highly available stacks are too numerous to detail here, but check out these guides to get started learning about high availability:

 - [Linode NodeBalancers](/docs/platform/nodebalancer/)
 - [Using Nginx for Proxy Services and Software Load Balancing](/docs/uptime/loadbalancing/use-nginx-for-proxy-services-and-software-load-balancing)
 - [MySQL Master-Master Replication](/docs/databases/mysql/mysql-master-master-replication)
 - [MariaDB Clusters with Galera](/docs/databases/mariadb/clustering-with-mariadb-and-galera)