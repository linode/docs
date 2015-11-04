---
author:
    name: Khanh Pham
    email: mrpk1906@gmail.com
description: 'Hot backup MySQL Server with Percona XtraBackup'
keywords: 'mysql,xtrabackup,innobackupex,backup,percona'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/mysql/hot-backup-mysql-server-with-percona-xtrabackup/']
modified: Thursday, November 05th, 2015
modified_by:
    name: Khanh Pham
published: 'Thursday, November 05th, 2015'
title: 'Hot backup MySQL Server with Percona XtraBackup'
external_resources:
    - '[Percona XtraBackup Home page](https://www.percona.com/software/mysql-database/percona-xtrabackup)'
---

MySQL is an open source relational database management system (DBMS) which is frequently deployed in a wide assortment of contexts. Most frequently it is deployed as part of the [LAMP Stack](/docs/lamp-guides). The database system is also easy to use and highly portable and is, in the context of many applications, extremely efficient. As MySQL is often a centralized data store for large amounts of mission critical data, making regular backups of your MySQL database is one of the most important disaster recovery tasks a system administrator can perform. This guide addresses a number of distinct methods for creating back ups of your database as well as restoring databases from backups.

Before beginning the installation process, we assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). Additionally, you will need to install the [MySQL Database](/docs/databases/mysql/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. If you're new to Linux server administration you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/linux-users-and-groups/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

## About Percona XtraBackup

*Percona XtraBackup* is an open-source hot backup utility for MySQL - based servers that doesn’t lock your database during the backup.

It can back up data from InnoDB, XtraDB, and MyISAM tables on MySQL 5.1 [1], 5.5 and 5.6 servers, as well as Percona Server with XtraDB. For a high-level overview of many of its advanced features, including a feature comparison, please see [About Percona XtraBackup](https://www.percona.com/doc/percona-xtrabackup/2.3/intro.html)

## Install Percona XtraBackup

### A. Installing Percona XtraBackup on CentOS via Percona yum repository

#### 1. Install the Percona repository

  You can install Percona yum repository by running the following command as a **root** user or with **sudo**:

    yum install http://www.percona.com/downloads/percona-release/redhat/0.1-3/percona-release-0.1-3.noarch.rpm

You should see some output such as the following:

    Retrieving http://www.percona.com/downloads/percona-release/redhat/0.1-3/percona-release-0.1-3.noarch.rpm
    Preparing...                ########################################### [100%]
    1:percona-release        ########################################### [100%]


> *RHEL/Centos 5* doesn’t support installing the packages directly from the remote location so you’ll need to download the package first and install it manually with **rpm**:
>
>   wget http://www.percona.com/downloads/percona-release/redhat/0.1-3/percona-release-0.1-3.noarch.rpm
>   rpm -ivH percona-release-0.1-3.noarch.rpm


#### 2. Testing the repository

Make sure packages are now available from the repository, by executing the following command:

    yum list | grep percona

You should see output similar to the following:

    ...
    percona-xtrabackup-20.x86_64               2.0.8-587.rhel5             percona-release-x86_64
    percona-xtrabackup-20-debuginfo.x86_64     2.0.8-587.rhel5             percona-release-x86_64
    percona-xtrabackup-20-test.x86_64          2.0.8-587.rhel5             percona-release-x86_64
    percona-xtrabackup-21.x86_64               2.1.9-746.rhel5             percona-release-x86_64
    percona-xtrabackup-21-debuginfo.x86_64     2.1.9-746.rhel5             percona-release-x86_64
    percona-xtrabackup-22.x86_64               2.2.13-1.el5                percona-release-x86_64
    percona-xtrabackup-22-debuginfo.x86_64     2.2.13-1.el5                percona-release-x86_64
    percona-xtrabackup-debuginfo.x86_64        2.3.2-1.el5                 percona-release-x86_64
    percona-xtrabackup-test.x86_64             2.3.2-1.el5                 percona-release-x86_64
    percona-xtrabackup-test-21.x86_64          2.1.9-746.rhel5             percona-release-x86_64
    percona-xtrabackup-test-22.x86_64          2.2.13-1.el5                percona-release-x86_64
    ...

#### 3. Install the packages

You can now install Percona XtraBackup by running:

    yum install percona-xtrabackup

### B: Installing Percona XtraBackup on Ubuntu via Percona apt repository

#### 1. Import the public key for the package management system

*Ubuntu* packages from *Percona* are signed with the Percona's GPG key. Before using the repository, you should add the key to **apt**. To do that, run the following commands as **root** or with **sudo**:

    $ sudo apt-key adv --keyserver keys.gnupg.net --recv-keys 1C4CBDCDCD2EFD2A

> In case you’re getting timeouts when using **keys.gnupg.net** as an alternative you can fetch the key from **keyserver.ubuntu.com**.

#### 2. Create the apt source list for Percona’s repository:

You can create the source list and add the Percona repository by running:

    $ echo "deb http://repo.percona.com/apt "$(lsb_release -sc)" main" | sudo tee /etc/apt/sources.list.d/percona.list

#### 3. Remember to update the local cache:

    $ sudo apt-get update

#### 4. After that you can install the package:

    $ sudo apt-get install percona-xtrabackup

## Backup MySQL Server with Percona XtraBackup

We using **innobackupex** utility for create a hot backup MySQL Server.

    $ innobackupex --user=root --password=password --tmpdir=/data2/tmp/ /data2/backup/

> *--user*
        Username for connect to database server.

> *--password*
        Password for connect to database server.

> *--tmpdir=DIRECTORY*
        This option specifies the location where a temporary file will be
        stored. The option accepts a string argument. It should be used when
        --stream is specified. For these options, the transaction log will
        first be stored to a temporary file, before streaming. This option
        specifies the location where that temporary file will be stored. If
        the option is not specified, the default is to use the value of
        tmpdir read from the server configuration.

> */data2/backup/*
        Backup files will stored in this directory.

For more options:

      $ innobackupex --help

You can use `.my.cnf` to run innobackupex without entering a username and password.
Create `.my.cnf` at `$HOME`

      $ vim ~/.my.cnf

Put this lines to file `.my.cnf`

```
[client]
user=root
password=password
```

Chmod 600 to file `.my.cnf` for best security:

      $ chmod 600 ~/.my.cnf

Now you can run innobackupex:

      $ innobackupex --tmpdir=/data2/tmp/ /data2/backup/

When command above finished, **innobackupex** output sample:

      xtrabackup: Creating suspend file '/data2/backup/2015-11-05_00-00-01/xtrabackup_log_copied' with pid '25916'
      151105 00:01:01  innobackupex: All tables unlocked
      151105 00:01:01  innobackupex: Waiting for ibbackup (pid=25916) to finish
      xtrabackup: Transaction log of lsn (27765414135) to (27765471342) was copied.

      innobackupex: Backup created in directory '/data2/backup/2015-11-05_00-00-01'
      151105 00:01:01  innobackupex: Connection to database server closed
      151105 00:01:01  innobackupex: completed OK!

Backup files will locate at */data2/backup/2015-11-05_00-00-01/*
When *innobackupex* running, it will create a directory with name is time present.

## Setup a cronjob for auto backup:

We will setup a cronjob for auto backup, notify via email when backup process failed

### Create a simple script for this process:

      $ vim /opt/script/mysql_backup.sh

Copy lines below to vim and save file:

```shell
#!/bin/bash
# Script backup mysql using Percona XtraBackup
# You will apply log before restore.
#
# Restore: innobackupex --apply-log /backup_dir/
#          mv /backup_dir/ /mysql_data_dir/
#          chown mysql:mysql /mysql_data_dir/
#          service mysqld start

log_file=/var/log/mysql_backup/backup_$(date +%F-%H-%M-%S).log

{
    /usr/bin/innobackupex --tmpdir=/data2/tmp/ /data2/backup/
} 2>&1 | tee ${log_file}

retval=$?

if [ $retval -eq 0 ]; then
    echo "Backup completed!"

else
    echo "Backup failed."
    echo "Please check log at ${log_file}"
    mail -s "Backup failed" email_receive_notify@domain.com < ${log_file}
fi
```

Chmod execute for this script:

      $ chmod +x /opt/script/mysql_backup.sh

###  Setup a cronjob run everyday at midnight:

Add this line to crontab:

      0 0 * * *  /bin/bash /opt/script/mysql_backup.sh

## Restoring MySQL Server from backup:

### Apply binary log to data files backed up:

      $ innobackupex --apply-log --use-memory=4G /data2/backup/2015-11-05_00-00-01/

> *--apply-log*
        Prepare a backup in BACKUP-DIR by applying the transaction log file
        named "xtrabackup_logfile" located in the same directory. Also,
        create new transaction logs. The InnoDB configuration is read from
        the file "backup-my.cnf".

> *--use-memory=B*
        This option accepts a string argument that specifies the amount of
        memory in bytes for xtrabackup to use for crash recovery while
        preparing a backup. Multiples are supported providing the unit (e.g.
        1MB, 1GB). It is used only with the option --apply-log. It is passed
        directly to xtrabackup's --use-memory option. See the xtrabackup
        documentation for details.

> */data2/backup/2015-11-05_00-00-01/*
        Locate directory backup stored

After run command above, **innobackupex** output sample:

      xtrabackup: starting shutdown with innodb_fast_shutdown = 1
      InnoDB: FTS optimize thread exiting.
      InnoDB: Starting shutdown...
      InnoDB: Shutdown completed; log sequence number 27367448506
      151105 02:01:52  innobackupex: completed OK!

### Move backed up directory to MySQL data directory:

      $ mv /var/lib/mysql /var/lib/mysql.bak
      $ mv /data2/backup/2015-11-05_00-00-01 /var/lib/mysql

### Set owner for MySQL data directory:

      $ chown -R mysql:mysql /var/lib/mysql

### Start MySQL service:

#### CentOS 5 & 6:

      $ service mysqld start

#### CentOS 7:

      $ systemctl start mysqld.service

#### Ubuntu:

      $ service mysql start
