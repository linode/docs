---
slug: archive-mariadb-tables-to-object-storage
author:
  name: Andy Heathershaw
  email: andy@andysh.uk
description: 'This guide shows how to archive MariaDB database tables to Linode Object Storage using the MariaDB S3 Storage Engine.'
og_description: 'This guide shows how to archive MariaDB database tables to Linode Object Storage using the MariaDB S3 Storage Engine.'
keywords: ['mariadb','s3','object storage','archive','data','storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-22
modified_by:
  name: Andy Heathershaw
title: "Archive MariaDB Tables to Linode Object Storage"
h1_title: "Archive MariaDB Tables to Linode Object Storage"
enable_h1: true
contributor:
  name: Andy Heathershaw
  link: https://andysh.uk
external_resources:
- '[MariaDB S3 Storage Engine](https://mariadb.com/kb/en/s3-storage-engine/)'
- '[Employees sample database](https://dev.mysql.com/doc/employee/en/)'
---

## Introduction

MariaDB is a fork of the MySQL database server. Starting with version 10.5, MariaDB includes an [S3 storage engine](https://mariadb.com/kb/en/s3-storage-engine/) that allows database tables to be archived to an S3-compatible service, such as [Linode Object Storage](https://www.linode.com/products/object-storage/), in a read-only state.

This could be used to archive transactional data - like payments, order histories or historical customer data - that will not change, to highly-available, flexible cloud storage.

{{<note>}}
Limitations

The S3 storage engine is based off the Aria storage engine and therefore does not support foreign keys. Ensure any foreign key references to the table you wish to archive have been dropped.
{{</note>}}

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3. Install MariaDB on your Linode.

   {{<note>}}
   The S3 Storage Engine used in this guide was released in MariaDB 10.5.4. Some distributions may not carry this version in their repositories.

   It's recommended to install the latest version of MariaDB from the official repositories by selecting your distribution and following the instructions on the [MariaDB.org Downloads page](https://mariadb.org/download/?t=repo-config).
   {{</note>}}

   This guide uses Debian 10 and MariaDB 10.6 installed from the official MariaDB repositories.

4. Create an Object Storage bucket to hold your database tables. Follow the [Create a Bucket](/docs/platform/object-storage/how-to-use-object-storage/#create-a-bucket) section of the [How to Use Linode Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide if you do not already have one.

    {{< content "object-storage-cancellation-shortguide" >}}

5. [Generate Object Storage access keys](/docs/guides/how-to-use-object-storage/#generate-a-key-pair).

6. Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Install the MariaDB S3 plugin

The MariaDB S3 plugin is not installed by default. The name of the package containing the plugin will vary based on distribution and whether you are using the official MariaDB packages or those included in your distribution.

### Debian 10, 11

{{< note >}}
Debian 10 includes MariaDB version 10.3. The official MariaDB packages are required to run version 10.5.

Debian 11 includes MariaDB 10.5. No additional repositories are required.
{{< /note >}}

    apt-get install mariadb-plugin-s3

### Ubuntu

{{< note >}}
Ubuntu 20.04, 18.04 and 16.04 ship with MariaDB releases older than 10.5, therefore the official MariaDB packages are required to run version 10.5.

Ubuntu 21.10 includes MariaDB 10.5. No additional repositories are required.
{{< /note >}}

    apt-get install mariadb-plugin-s3

### CentOS 8

{{< note >}}
CentOS 8 includes MariaDB version 10.3. The official MariaDB packages are required to run version 10.5.
{{< /note >}}

    dnf install MariaDB-s3-engine

### Fedora 35

{{< note >}}
Fedora 35 includes MariaDB version 10.5. No additional repositories are required.
{{< /note >}}

    dnf install mariadb-s3-engine

## Add Object Storage keys to MariaDB

The first step is to add the Linode Object Storage (S3) credentials to your MariaDB configuration. The location of the configuration file varies on each distribution, and whether you are using the official MariaDB packages or those included in your distribution.

Official MariaDB packages allow for individual configuration files to be added to `/etc/mysql/conf.d` or `/etc/my.cnf.d`, depending on your distribution.

It is recommended this configuration is added to an `s3.cnf` file. On some distributions, `s3.cnf` is created with default values when the S3 plugin package is installed, and the values can be modified to your needs.

| Distribution | File location | Default file exists? |
| - | - | - |
| Debian 10, 11 | /etc/mysql/conf.d/s3.cnf | No |
| Ubuntu | /etc/mysql/conf.d/s3.cnf | No |
| CentOS 8 | /etc/my.cnf.d/s3.cnf | Yes |
| Fedora 35 | /etc/my.cnf.d/s3.cnf | Yes |

{{< note >}}
In this file, replace the following placeholders:

* `your-bucket-name` with the name of your bucket to hold your data files.
* `eu-central-1` with the region name of your bucket's assigned Object Storage cluster.
* `eu-central-1.linodeobjects.com` with your bucket's assigned Object Storage cluster hostname.
* `your-key` with the Object Storage access key you created in step 5.
* `your-secret` with the Object Storage secret key you created in step 5.
{{< /note >}}

{{< file "s3.cnf" ini >}}
[mariadb]
plugin-load-add = ha_s3
s3=ON
s3-bucket=your-bucket-name
s3-access-key=your-key
s3-secret-key=your-secret
s3-region=eu-central-1
s3-host-name=eu-central-1.linodeobjects.com
{{< /file >}}

## Restart MariaDB

After adding the Object Storage configuration, restart MariaDB.

    systemctl restart mariadb

## Archive your tables to Object Storage

With the Object Storage configured, you can now archive your tables.

{{< note >}}
This article uses the [Employees sample database](https://dev.mysql.com/doc/employee/en/). You can do the same for testing after [installing the sample database](https://dev.mysql.com/doc/employee/en/employees-installation.html). 

To archive your data, you would run the commands shown below against your own database and tables.
{{< /note >}}

{{< caution >}}
As soon as the `ALTER TABLE` command below is executed against a table in your database, it will become read-only. Do not run this
on production databases, or for tables that still need to be written to.
{{< /caution >}}

1. Connect to MariaDB.

        mariadb

   You should see a similar output:

   {{< output >}}
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 32
Server version: 10.6.5-MariaDB-1:10.6.5+maria~buster mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]>
{{< /output >}}

1. Select your database. Replace `sampledb` with the name of your database.

        use sampledb;

    You should see a similar output:

    {{< output >}}
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [sampledb]>
{{< /output >}}

1. Switch the tables you would like to archive to Object Storage using the following command. Replace `employees` with the name of the table you want to archive:

        ALTER TABLE `employees` ENGINE=S3;

    {{<note>}}
If you see an error like `errno: 138 "Unsupported extension used for table"`, check your S3 configuration. You can do this using the following query:

`SHOW VARIABLES LIKE '%s3%'`

You should see an output like:

| Variable_name                       | Value                          |
|-------------------------------------|--------------------------------|
| s3_access_key                       | *****                          |
| s3_block_size                       | 4194304                        |
| s3_bucket                           | your-bucket-name               |
| s3_debug                            | OFF                            |
| s3_host_name                        | eu-central-1.linodeobjects.com |
{{</note>}}

The table is now archived in Object Storage. Browse to your bucket in [Linode Manager](https://cloud.linode.com) and you should see a container for your database name, with a nested container for the table.

If you try to modify any data in the table, you will receive the following error:

`ERROR 1036 (HY000): Table 'employees' is read only`

However any `SELECT` queries can be carried out on the table as normal:

    SELECT * FROM employees WHERE first_name = 'Billie' AND gender = 'F';

{{< output >}}
MariaDB [sampledb]> SELECT * FROM employees WHERE first_name = 'Billie' AND gender = 'F';
+--------+------------+------------+---------------+--------+------------+
| emp_no | birth_date | first_name | last_name     | gender | hire_date  |
+--------+------------+------------+---------------+--------+------------+
|  12215 | 1960-10-18 | Billie     | Ecklund       | F      | 1991-05-24 |
... truncated ...
+--------+------------+------------+---------------+--------+------------+
85 rows in set (0.103 sec)
{{< /output >}}

## Retrieve your tables from Object Storage

If you wish to take your tables back out of Object Storage, you run the same command but switch to a different storage engine: Replace `employees` with the name of the table you want to retrieve:

    ALTER TABLE `employees` ENGINE=InnoDB;

Your table is now back on local storage and can be modified as needed.