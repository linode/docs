---
author:
  name: Linode
  email: docs@linode.com
description: 'How to move an existing Linux server to your new Linode'
keywords: ["migrate", "migration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['migration/migrate-server-to-linode/','migrate-to-linode/disk-images/migrating-a-server-to-your-linode/','platform/disk-images/migrating-a-server-to-your-linode/']
modified: 2018-05-24
modified_by:
  name: Linode
published: 2018-05-24
title: Migrate a Server to Your Linode
---

Migrating a server is no easy task. It requires patience and organization, and preparedness for some eventual troubleshooting. Large-scale deployments have entire teams orchestrating the migration, with their own policies, procedures, and rollout milestones. This guide is instead aimed at relatively smaller use cases-private websites and projects, game servers, a VPN or media streaming server, etc.

Even then, there are too many possible migration scenarios to detail here. Databases, applications, web servers, content management systems, broader software stacks, etc., mixed with personal preference and tolerances, all ultimately decide how and when you choose to migrate to a new hosting service.

## Have a Plan

To try to keep things relatively simple, we'll use a WordPress site running on Ubuntu 18.04 as an example throughout this guide.

The basic roadmap will be:

1.  Create a backup of your current working system-be it a snapshot, tarball archives, a `.iso` file, or whatever else you need or prefer.

2.  Take inventory of everything you want transferred over to your new Linode.

3.  Deploy the Linode and configure it how you need.

4.  Move your data to your Linode in three main stages:

    a.  User data (user account scripts, shell profiles,)

    b.  System data (configuration files, log files, user lists.)

    c.  Application data (media files, site data, database restores)


### Avoid One Common Pitfall

Some online writeups advise to SCP an entire filesystem up to a new server as a migration, or to use `dd` to make a disk image of the system partition which is then written to a VPS provider's raw disk. Whether you're coming from another hosting provider or your personal hardware, this is not a good solution.

With this method, you end up with running your old provider's (or your local) system on Linode. While that alone doesn't present problems, there will be differences compared to if you built a new Linode and imported only your data. You can expect things like package repository URLs to differ, along with filesytem mount points, included packages, boot/grub options, network interface names, possibly added services, and other aspects.

Furthermore, you won't have serial console (Lish and Glish) access and if you ever have trouble with the system, it could take longer for support staff to diagnose.

The bottom line is that you're setting yourself up for a smoother experience if you first deploy one of our distribution images on your Linode and build your system up from that rather than copying over the full OS filesytem.

The only scenario where this may be desirable (albeit we still recommend it only as a temporary one) is for mail servers, which are notoriously cantankerous and time consuming to configure properly. In this case, you'd need to boot your Linode use the Direct Disk boot option.


## Migrate Your System

1.  Deploy your operating system of choice on your Linode and build up the server with our [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/security/securing-your-server/) guides. Assume we made a user account `wpuser` to do administrative tasks in which we'll use again later.

2.  Install the packages needed to re-create your software stack, making way for your application data to be imported. Since we're running in Ubuntu, we can take advantage of `tasksel` to install the `lamp-server` metapackage. 

        sudo apt install tasksel
        sudo tasksel install lamp-server

3.  Stop the running services on the old system-MySQL, Apache, etc. Note that this means the example WordPress site will be temporarily unavailable to web traffic until the DB dump is complete and MySQL restarted.

        sudo systemctl stop apache2 mysqld
        sudo systemctl stop mysqld

4.  Export or compress any data on the old system which must be transferred to your Lindoe. Our example site has three main areas of data we want to migrate:

    - Site data located at /var/www/html/example.com/
    - The MariaDB database (which we'll use MySQLdump to export).
    - Apache's configuration files (specifically, `/etc/apache2/apache2.conf` and `/etc/apache2/sites-available/example.com.conf`).

5.  From your old host, make the transfer using SCP or rsync over SSH:

    Copy the Apache configuration files:

        scp /etc/apache2/apache2.conf wpuser@203.0.113.2:/etc/apache2/
        scp /etc/apache2/sites-available/example.com.conf wpuser@203.0.113.2:/etc/apache2/sites-available/example.com.conf

    Copy your site data (assuming your site lives in `/var/www/html/example.com/` on your old host:

        scp /var/www/html/example.com/ wpuser@203.0.113.2:/var/www/html/example.com/

    Export the database. The example user name is *wpuser* and database names is *wordpressdb*.

        mysqldump -u wpuser -p wordpressdb --single-transaction --quick --lock-tables=false > wordpressdb-backup-$(date +%F).sql

    SCP the database export to the new Linode:

        scp wordpressdb-backup-*.sql wpuser@203.0.113.2:/home/wpuser/

6.  SSH in to your Linode and ensure permissions are correct for everything you just transferred. They should look as shown below:

        wpuser@localhost:/etc/apache2# ls -la apache2.conf
        -rw-r--r-- 1 root root 7224 Apr 25 11:38 apache2.conf
        
        wpuser@localhost:~# ls -la /etc/apache2/sites-available/example.com.conf
        -rw-r--r-- 1 root root 420 May 23 17:02 /etc/apache2/sites-available/example.com.conf
        
        wpuser@localhost:~# ls -la /var/www/html/example.com/
        total 20
        drwxr-xr-x 2 www-data www-data 4096 May 23 17:03 logs
        drwxr-xr-x 5 www-data www-data 4096 May 23 17:18 public_html
        drwxr-xr-x 3 www-data www-data 4096 May 23 17:17 src

7.  Stop MariaDB and import the database back into MySQL or MariaDB:

        sudo systemctl stop mysql
        mysql -u wpuser -p wordpressdb < wordpressdb-backup-$(date +%F).sql

8.  Disable the default Apache example site and enable yours:

        sudo a2dissite 000-default.conf
        sudo ensite example.com.conf

9.  Restart Apache and MariaDB:

        sudo systemctl restart apache
        sudo systemctl restart mysql

10. Go to your Linode's IP address in a web browser. You should see your site.

11. Log in to your domain registrar's website and [prepare your domain to move](/docs/platform/migrate-to-linode/migrate-from-shared-hosting-to-linode/#prepare-your-domain-name-to-move) to Linode from your previous hosting provider.

11.  Log in to the Linode Manager. [Move your domain](h/docs/platform/migrate-to-linode/migrate-from-shared-hosting-to-linode/#move-your-domain and [configure reverse DNS](/docs/networking/dns/configure-your-linode-for-reverse-dns/).