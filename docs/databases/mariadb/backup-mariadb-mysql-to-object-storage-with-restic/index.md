---
author:
  name: Andy Heathershaw
  email: docs@linode.com
description: 'This guide shows you how to use Restic to backup your MariaDB or MySQL databases onto Linode Object Storage.'
og_description: 'Learn how to backup your MariaDB and MySQL databases off your Linode and onto Linode Object Storage with Restic.'
keywords: ['mariadb','mysql','backup','backups','restic','off-site backups','Object Storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-08
modified_by:
  name: Linode
title: "Backup MariaDB databases to Linode Object Storage with Restic"
h1_title: "Backup MariaDB or MySQL databases to Linode Object Storage with Restic"
contributor:
  name: Andy Heathershaw
  link: https://andysh.uk
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

{{< note >}}
MariaDB is a generally-compatible fork of MySQL. Where you see a reference to "MariaDB" in this guide, it will apply to MySQL also.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started/), the [Securing Your Server](/docs/security/securing-your-server/) guides, and the ["How to Install MariaDB on..." guides](/docs/databases/mariadb/) for your Linode's operating system.

1.  Update your system:

        sudo apt update

1.  Create an Object Storage bucket to hold your backups.

    {{< caution >}}
Creating an Object Storage bucket will incur charges on your account for the [Object Storage](https://www.linode.com/products/object-storage/) service.
{{< /caution >}}


## Set Up Automated Database Backups

The mysqldump utility is used to dump the contents of a database to a SQL file on-disk on your Linode. This simple shell script will loop through all
databases on your server, and dump each one to its own SQL file.

Create a file in /usr/local/bin:

    sudo nano /usr/local/bin/backup_mariadb

{{< note >}}
You can use "vi" in place of "nano" if you wish.
{{< /note >}}
    
Copy the following contents into the file:

{{< file "/usr/local/bin/backup_mariadb" >}}
#!/bin/bash
mysql -N -e 'show databases' | while read dbname; do /usr/bin/mysqldump --complete-insert "$dbname" > "/var/backups/mariadb/$dbname".sql; done
{{< /file >}}

Make the script executable and create the folder to hold the backup files if it doesn't already exist:

    chmod u+x /usr/local/bin/backup_mariadb
    mkdir -p /var/backups/mariadb/
    
You can now run your first backup:

    backup_mariadb

Check your backups have been created:

    ls /var/backups/mariadb
    
{{< output >}}
TODO - output of the ls command
{{< /output >}}

## Install Restic

## Create the Restic Repository

## Upload Backups to Object Storage using Restic