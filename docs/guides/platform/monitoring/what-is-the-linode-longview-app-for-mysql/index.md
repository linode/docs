---
slug: what-is-the-linode-longview-app-for-mysql
author:
  name: Linode
  email: docs@linode.com
description: Using the Linode Longview App for MySQL
keywords: ["Longview", "MySQL", "statistics"]
tags: ["cloud manager","statistics","monitoring","linode platform","mysql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/longview/longview-for-mysql/','/platform/longview/longview-app-for-mysql/','/platform/longview/what-is-the-linode-longview-app-for-mysql/']
modified: 2020-01-28
modified_by:
  name: Linode
published: 2013-11-06
title: What is the Linode Longview App for MySQL
h1_title: Using the Linode Longview App for MySQL
classic_manager_link: platform/longview/longview-app-for-mysql-classic
relations:
    platform:
        key: what-is-longview
        keywords:
            - distribution: MySQL
---

Longview for MySQL is a Longview App. The Longview MySQL tab appears in the Linode Cloud Manager when Longview detects that you have MySQL installed on your Linode. With the Longview MySQL App, you'll be able to view statistics for MySQL on your Linode. It can help you keep track of MySQL's settings, queries, system resource consumption, and other information.

## In this Guide
This guide discusses Linode Longview for NGINX. The guide covers the following topics:

- [Configuring Linode Longview for MySQL](#debian-and-ubuntu-automatic-configuration).
- [Interacting with the MySQL data provided by Longview in the Linode Cloud Manager](#viewing-statistics).
- [Troubleshooting Linode Longview for MySQL](#troubleshooting).

## Before you Begin
In order to use the Longview App for Apache, ensure you have completed the following things:

- A Linode with [MySQL installed and running](/docs/databases/mysql/).
- Create a [Longview client](/docs/platform/longview/what-is-longview/#install-linode-longview) instance using the Cloud Manager.
- Install the [Longview Agent](/docs/platform/longview/what-is-longview/#install-the-longview-agent) on your Linode.

### Debian and Ubuntu Automatic Configuration

If MySQL is installed and running when you install the Longview client, the MySQL App should enable and configure itself automatically.

If you already have Longview installed, you may find that MySQL is not automatically detected on initial setup. If this is the case, you can run Longview through its automatic configuration sequence again. In most cases, it will find everything it needs to get the MySQL App started. Your existing Longview data will stay safe during the automatic configuration process.

To run the automatic Longview configuration:

1. [SSH into your Linode](/docs/getting-started/#connect-to-your-linode-via-ssh) whose system you are monitoring with Longview.

1. Ensure that MySQL is running:

        sudo systemctl status mysql

1. Run the automatic Longview configuration command on your Linode:

        dpkg-reconfigure -phigh linode-longview

    For most people, Longview should be able to configure itself automatically, and you will receive output similar to the following:

    {{< output >}}
[ ok ] Stopping Longview Agent: longview.
Checking MySQL configuration...
Successfully connected to MySQL
[ ok ] Starting Longview Agent: longview.
update-rc.d: using dependency based boot sequencing
    {{</ output >}}
Once you see this success message, the Longview MySQL App should automatically start collecting MySQL data. Refresh Longview in the Cloud Manager to verify that the MySQL tab is now present and collecting data for your Longview client instance.

    {{< note >}}
Unless you already have a specific Longview database user set up in the `/etc/linode/longview.d/MySQL.conf` file, Longview will locate and use the `debian-sys-maint` database user credentials if it can, located at `/etc/mysql/debian.cnf`.
    {{< /note >}}

    If you receive a failure message or the popup shown below, you should visit the [Troubleshooting](#troubleshooting) section at the end of this article.

    [![Unable to automatically configure MySQL plugin: Longview has detected MySQL running on this server but was unable to automatically configure the connection. To allow Longview to access your MySQL instance please run the following query: CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*'; \<Ok\>](1459-longview_mysql_popup_crop.png)](1459-longview_mysql_popup_crop.png)

### Manual Configuration (All Distributions)

{{< note >}}
You cannot configure the location of a socket for the Longview client.
{{< /note >}}

To enable the MySQL Longview app manually, follow these steps on your Linode:

1. [SSH into your Linode](/docs/getting-started/#connect-to-your-linode-via-ssh) whose system you are monitoring with Longview.

1. Log into MySQL. For example, to log in as the root user:

        mysql -u root -p

1.  Create a new MySQL user with minimal privileges for Longview. Run the following queries on your database as the root MySQL user to create the new user. Ensure your replace `*****************` with your desired password.

        CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '***************';
        flush privileges;

1. Exit the MySQL:

        exit

2.  Edit `/etc/linode/longview.d/MySQL.conf` to include the same username and password you just added. It should look like the following:

    {{< file "/etc/linode/longview.d/MySQL.conf" aconf >}}
#username root
#password example_password
username linode-longview
password ***************

{{< /file >}}


3.  Restart Longview:

        sudo systemctl restart longview

4.  Refresh Longview in the Cloud Manager to verify that the MySQL tab is now present and collecting data for your Longview client instance.

You should now be able to see Longview data for MySQL. If that's not the case, proceed to the [Troubleshooting](#troubleshooting) section at the end of this article.

## Viewing Statistics

To see the output for the Longview MySQL App:

1.  Log in to the [Linode Cloud Manager](https://cloud.linode.com/).
1.  Click on the **Longview** link in the sidebar.
1.  Select the Longview client instance whose MySQL data you’d like to view.
1.  Select the **MySQL** tab.

![The Longview MySQL App.](longview_mysql_stats.png)

You'll see the current version of MySQL listed on the upper left-hand corner.

Mouse over a data point to see the exact numbers for that time. You can also zoom in on data points, or view older time periods with Longview Pro. For details, jump to this section in the main article about [navigating the Longview interface](/docs/platform/longview/what-is-longview/#longview-s-data-explained). The next sections cover the Longview MySQL App in detail.

### Queries

The **Queries** graph shows the total number of select, update, insert, and delete queries MySQL handled at the selected time.

### Throughput

The **Throughput** graph shows the amount of data that MySQL sent and received at the time selected.

### Connections

The **Connections** graph shows all of the MySQL connections at the selected time.

### Slow Queries

The **Slow Queries** graph shows the number of slow MySQL queries at the selected time.

### Aborted

The **Aborted** graph shows the number of aborted MySQL connections and clients at the selected time.

### CPU

The **CPU** graph shows the percentage of your Linode's CPU being used by MySQL at the selected time. If you want to see the total CPU use instead, check the [Overview tab](/docs/platform/longview/what-is-longview/#overview).

### RAM

The **RAM** graph shows the amount of RAM or memory being used by MySQL at the selected time. If you want to see your Linode's total memory use instead, check the [Overview tab](/docs/platform/longview/what-is-longview/#overview).

### Disk IO

The **Disk IO** graph shows the amount of input to and output from the disk caused by MySQL at the selected time. To see the total IO instead, visit the [Disks tab](/docs/platform/longview/what-is-longview/#disks).

### Process Count

The **Process Count** graph shows the total number of processes on your Linode spawned by MySQL at the selected time. If you want to see more details, and how this stacks up against the total number of processes on your Linode, see the [Processes tab](/docs/platform/longview/what-is-longview/#processes).

## Troubleshooting

If you don't see Longview data for MySQL, you'll instead get an error on the page and instructions on how to fix it. As a general tip, you can check the `/var/log/linode/longview.log` file for errors as well.

### Unable to Automatically Configure MySQL Popup

If you run the [automatic Longview configuration tool](#debian-and-ubuntu-automatic-configuration), and get the popup message shown below:

[![Unable to automatically configure MySQL plugin: Longview has detected MySQL running on this server but was unable to automatically configure the connection. To allow Longview to access your MySQL instance please run the following query: CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*'; \<Ok\>](1459-longview_mysql_popup_crop.png)](1459-longview_mysql_popup_crop.png)

This indicates that Longview can't locate any valid MySQL user credentials, so it will create some for itself (in the `/etc/linode/longview.d/MySQL.conf` file) and ask you to add them to MySQL. To finish getting Longview set up:

1. Copy the command shown in the popup message. You will need it for the next steps.

1. Log in to your database as the root MySQL user:

        mysql -u root -p

1. Run the query that was shown in the popup message to create the Longview user. Ensure you replace `*****************` with the password provided to you by the popup.

        CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '***************';
        flush privileges;

    Refresh Longview in the Cloud Manager to verify that the MySQL tab is now present and collecting data for your Longview client instance.

If you've added the credentials to MySQL and it still doesn't work, double-check your MySQL installation, and then do a [manual configuration](#manual-configuration-all-distributions).

### Unable to Connect to the Database, No Credentials Found

-   You may receive this error:

    {{< output >}}
Unable to connect to the database, no credentials found.
{{< /output >}}

    This indicates that you need to add a MySQL user for Longview, and make sure the Longview configuration file has the appropriate credentials. See the [manual configuration](#manual-configuration-all-distributions) section for details.

-   You may also encounter this error message:

    {{< output>}}
Unable to connect to the database: Authentication plugin 'sha256_password' cannot be loaded: /usr/lib/x86_64-linux-gnu/mariadb18/plugin/sha256_password.so: cannot open shared object file: No such file or directory.
{{< /output >}}

    If this is the case, follow the above instructions for [manual configuration](#manual-configuration-all-distributions).

### Unable to Connect to the Database

This error will state `Unable to connect to the database:` and then specify a reason. An incorrect password is one example of something that can generate this type of error. The list of errors that could cause this issue is pretty long, so you may want to reference the [MySQL documentation](https://dev.mysql.com/doc/) if you need help understanding a specific error message.

### Unable to Collect MySQL Status Information

If you receive the error `Unable to collect MySQL status information`, this indicates that Longview was able to connect to the MySQL database, but the query it uses to collect statistics has failed. This could occur if the database crashes while the query is being executed. The specific reason that it failed will be listed with the error. If the problem persists, contact Linode [support](/docs/platform/billing-and-support/support/).

### MySQL Tab is Missing

If the Longview MySQL tab is missing entirely, this indicates that MySQL is either not installed, or has stopped. If you restart MySQL, you will be able to see the tab again and view all of your old data.
