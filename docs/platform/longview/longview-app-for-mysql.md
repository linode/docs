---
author:
  name: Linode
  email: docs@linode.com
description: Longview App for MySQL
keywords: ["Longview", " MySQL", " statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['longview/longview-for-mysql/']
modified: 2013-11-06
modified_by:
  name: Linode
published: 2013-11-06
title: Longview App for MySQL
---

Longview for MySQL is a Longview App. The Longview MySQL tab appears in the Linode Manager when Longview detects that you have MySQL installed on your Linode. With the Longview MySQL App, you'll be able to view statistics for MySQL on your Linode. It can help you keep track of MySQL's settings, queries, system resource consumption, and other information.

## Installing

Prerequisites:

-   Install and start [MySQL](/docs/databases/mysql)
-   Install the [Longview client](/docs/platform/longview/longview/#installing-the-client)

### Debian and Ubuntu Automatic Configuration

If MySQL is installed and running when you install the Longview client, the MySQL App should enable and configure itself automatically.

If you already have Longview installed, and later want to install MySQL and enable the Longview App for it, you can run Longview through its automatic configuration sequence again. In most cases, it will find everything it needs to get the MySQL App started. And don't worry - your old Longview data will stay safe. To run the automatic Longview configuration, first make sure that MySQL is running, and then run the following command on your Linode via SSH:

    dpkg-reconfigure -phigh linode-longview

For most people, Longview should be able to configure itself automatically, and you will receive output something like this:

    [ ok ] Stopping Longview Agent: longview.
    Checking MySQL configuration...
    Successfully connected to MySQL
    [ ok ] Starting Longview Agent: longview.
    update-rc.d: using dependency based boot sequencing

Once you see this successful message, the Longview MySQL App should automatically start collecting MySQL data. Refresh the Longview MySQL tab in the Linode Manager to start viewing your stats.

 {{< note >}}
Unless you already have a specific Longview database user set up in the `/etc/linode/longview.d/MySQL.conf` file, Longview will locate and use the `debian-sys-maint` database user credentials if it can, located at `/etc/mysql/debian.cnf`.
{{< /note >}}

If you receive a failure message or the popup shown below, you should visit the [Troubleshooting](#troubleshooting) section at the end of this article.

[![Unable to automatically configure MySQL plugin: Longview has detected MySQL running on this server but was unable to automatically configure the connection. To allow Longview to access your MySQL instance please run the following query: CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*'; \<Ok\>](/docs/assets/1459-longview_mysql_popup_crop.png)](/docs/assets/1459-longview_mysql_popup_crop.png)

### Manual Configuration (All Distributions)

To enable the MySQL Longview app manually, follow these steps on your Linode via SSH:

1.  Create a new MySQL user with minimal privileges for Longview. Run the following queries on your database as the root MySQL user to create the new user:

        CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '***************';
        flush privileges;

2.  Edit `/etc/linode/longview.d/MySQL.conf` to include the same username and password you just added. It should look like the following:

    {{< file "/etc/linode/longview.d/MySQL.conf" aconf >}}
#username root
#password example_password
username linode-longview
password ***************

{{< /file >}}


3.  Restart Longview:

        service longview restart

4.  Refresh the Longview MySQL tab in the Linode Manager.

You should now be able to see Longview data for MySQL. If that's not the case, proceed to the [Troubleshooting](#troubleshooting) section at the end of this article.

## Viewing Statistics

To see the output for the Longview MySQL App:

1.  Log in to the [Linode Manager](https://manager.linode.com/).
2.  Select the **Longview** tab.
3.  Select the **MySQL** tab.

Click the image for a full-size view.

[![The Longview MySQL App.](/docs/assets/1458-longview_mysql_stats_sm.png)](/docs/assets/1457-longview_mysql_stats.png)

You'll see the current version of MySQL listed on the upper right.

Mouse over a data point to see the exact numbers for that time. You can also zoom in on data points, or view older time periods with Longview Pro. For details, jump to this section in the main article about [navigating the Longview interface](/docs/platform/longview/longview#using-the-interface). The next sections cover the Longview MySQL App in detail.

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

### Max Connections

Longview displays the maximum number of MySQL connections.

### Queries in Cache

Longview shows the current number of queries in MySQL's cache.

### CPU

The **CPU** graph shows the percentage of your Linode's CPU being used by MySQL at the selected time. If you want to see the total CPU use instead, check the [Overview tab](/docs/platform/longview/longview#overview-tab).

### Memory

The **Memory** graph shows the amount of RAM being used by MySQL at the selected time. If you want to see your Linode's total memory use instead, check the [Overview tab](/docs/platform/longview/longview#overview-tab).

### Disk IO

The **Disk IO** graph shows the amount of input to and output from the disk caused by MySQL at the selected time. To see the total IO instead, visit the [Disks tab](/docs/platform/longview/longview#disks-tab).

### Process Count

The **Process Count** graph shows the total number of processes on your Linode spawned by MySQL at the selected time. If you want to see more details, and how this stacks up against the total number of processes on your Linode, see the [Process Explorer tab](/docs/platform/longview/longview#process-explorer-tab).

# Troubleshooting

If you don't see Longview data for MySQL, you'll instead get an error on the page and instructions on how to fix it. As a general tip, you can check the `/var/log/linode/longview.log` file for errors as well.

### Unable to Automatically Configure MySQL Popup

If you run the [automatic Longview configuration tool](#debian-and-ubuntu-automatic-configuration), and get the popup message shown below:

[![Unable to automatically configure MySQL plugin: Longview has detected MySQL running on this server but was unable to automatically configure the connection. To allow Longview to access your MySQL instance please run the following query: CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*'; \<Ok\>](/docs/assets/1459-longview_mysql_popup_crop.png)](/docs/assets/1459-longview_mysql_popup_crop.png)

This indicates that Longview can't locate any valid MySQL user credentials, so it will create some for itself (in the `/etc/linode/longview.d/MySQL.conf` file) and ask you to add them to MySQL. To finish getting Longview set up, copy the command shown in the popup message, log in to your database as the root MySQL user, then run the query that was shown in the popup message:

    CREATE USER 'linode-longview'@'localhost' IDENTIFIED BY '***************';
    flush privileges;

Refresh the Longview MySQL tab in the Linode Manager to verify that it's working now.

If you've added the credentials to MySQL and it still doesn't work, double-check your MySQL installation, and then do a [manual configuration](#manual-configuration-all-distributions).

### Unable to Connect to the Database, No Credentials Found

If you receive the error `Unable to connect to the database, no credentials found`, this indicates that you need to add a MySQL user for Longview, and make sure the Longview configuration file has the appropriate credentials. See the [manual configuration](#manual-configuration-all-distributions) section for details.

### Unable to Connect to the Database

This error will state `Unable to connect to the database:` and then a specific reason. This type of error could occur if the password isn't correct, for example. The list of errors that could cause this issue is pretty long, so you may want to reference the [MySQL documentation](http://dev.mysql.com/doc/refman/5.5/en/error-messages-client.html) if you need help understanding a specific error message.

### Unable to Collect MySQL Status Information

If you receive the error `Unable to collect MySQL status information`, this indicates that Longview was able to connect to the MySQL database, but the query it uses to collect statistics has failed. This could occur if the database crashes while the query is being executed. The specific reason that it failed will be listed with the error. If the problem persists, contact Linode [support](/docs/support).

### MySQL Tab is Missing

If the Longview MySQL tab is missing entirely, this indicates that MySQL is either not installed, or has stopped. If you restart MySQL, you will be able to see the tab again and view all of your old data.
