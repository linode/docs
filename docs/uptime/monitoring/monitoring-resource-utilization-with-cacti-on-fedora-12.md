---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Monitor resource usage through the powerful server monitoring tool Cacti on Fedora 12.'
keywords: 'Cacti,Fedora,Monitoring,SNMP'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['server-monitoring/cacti/fedora-12/']
modified: Tuesday, October 1st, 2013
modified_by:
  name: Linode
published: 'Thursday, February 11th, 2010'
expiryDate: 2015-10-01
deprecated: true
title: Monitoring Resource Utilization with Cacti on Fedora 12
---



The Linode Manager provides some basic monitoring of system resource utilization, which includes information regarding Network, CPU, and Input/Output usage over the last 24 hours and 30 days. While this basic information is helpful for monitoring your system, there are cases where more fine-grained information is useful. The simple monitoring tool [Munin](/docs/uptime/monitoring/monitoring-servers-with-munin-on-fedora-14) is capable of monitoring needs of a small group of machines. In some cases, Munin may not be flexible enough for some advanced monitoring needs.

For these kinds of deployments we encourage you to consider a tool like Cacti, which is a flexible front end for the RRDtool application. Cacti simply provides a framework and a mechanism to poll a number of sources for data regarding your systems, which can then be graphed and presented in a clear web based interface. Whereas packages like Munin provide monitoring for a specific set of metrics on systems which support the Munin plug in, Cacti provides increased freedom to monitor larger systems and more complex deployment by way of its plug in framework and web-based interface.

Before installing Cacti we, assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

Installing Prerequisites
------------------------

Before proceeding with the installation of Cacti, ensure your package repositories and installed programs are up to date by issuing the following commands:

    yum update

### Set the Timezone

Begin by setting the timezone of your server if it isn't already set. Set your server to your timezone or to that of the bulk of your users. If you're unsure which timezone would be best, consider using Universal Coordinated Time (or UTC, ie. Greenwich Mean Time). Keep in mind that Cacti uses the timezone set on the monitoring machine when generating its graphs. To change the time zone, you must find the proper zone file in `/usr/share/zoneinfo/` and link that file to `/etc/localtime`. See the example below for common possibilities. Please note that all contents following the double hashes (eg. `##`) are comments and need not be copied into your terminal.

    ln -sf /usr/share/zoneinfo/UTC /etc/localtime ## for Universal Coordinated Time

    ln -sf /usr/share/zoneinfo/EST /etc/localtime ## for Eastern Standard Time

    ln -sf /usr/share/zoneinfo/US/Central /etc/localtime ## for American Central time (including DST)

    ln -sf /usr/share/zoneinfo/US/Eastern /etc/localtime ## for American Eastern (including DST)

### Installing Dependencies

Before installing Cacti we must install a few basic dependencies that are critical to the installation of Cacti. Cacti uses the Simple Network Management Protocol (SNMP) to poll the devices it tracks. We'll need to install the `snmpd` and `snmp` packages to allow Cacti to use SNMP. Cacti's web interface requires a database, web server, and PHP to be installed. Issue the following command to install these prerequisites:

    yum install net-snmp net-snmp-utils mysql-server httpd php php-mysql php-cli php-snmp rrdtool-perl wget

You will need to create a password for the `root` user of your MySQL database during the installation. After the installation completes, be sure to run `mysql_secure_installation` to disable some of MySQL's less secure components.

The above command will additionally install the Apache web server. Consider our documentation of [installing the Apache HTTP Server](/docs/web-servers/apache/installation/fedora-12) for more information regarding this server. Additionally Cacti can function with alternate web server configurations, including Apache with PHP running as a CGI process and with [nginx](/docs/web-servers/nginx/) running PHP as a FastCGI process.

### Configuring SNMPD

SNMPD binds to all local interfaces by default. If you only plan on using Cacti locally to monitor your Linode, you may want to consider modifying `/etc/sysconfig/snmpd.options` to limit the exposure of SNMP to the Internet at large. Uncomment the following line and append the addresses you would like the SNMP daemon to "listen" for data, as follows:

{: .file }
/etc/sysconfig/snmpd.options

> OPTIONS="-Lsd -Lf /dev/null -p /var/run/snmpd.pid -a 192.168.169.170"

In this example, SNMPD is configured to listen for data only on the LAN IP address `192.168.169.170`. To limit access to SNMPD so that only local data can access the daemon, use `127.0.0.1` as the IP address. If, however, you need to receive data from machines on the Internet at large, do not append any IP addresses to this line.

We'll create an SNMP "community" to help identify our group of devices for Cacti. In this instance, our hostname is "example.org", so we've named the community "example". The community name choice is up to the user. Add the following line to the section of `snmpd.conf` with `com2sec` directives making sure to only grant `readonly` privileges.

{: .file }
/etc/snmp/snmpd.conf

> com2sec readonly localhost example

If you want a remote machine to connect to Cacti, replace "localhost" with the IP address of the remote machine.

You need to restart snmpd any time `/etc/snmp/snmpd.conf` is modified. Run the following command after closing the file:

    /etc/init.d/snmpd restart

Installing Cacti
----------------

To install the Cacti package from the distribution software repositories, issue the following command:

    yum install cacti

Install all packages as recommended. Before we can begin using Cacti we must first configure MySQL. Use the following commands to start the MySQL server and enter the secure installation configuration:

    /etc/init.d/mysqld start
    mysql_secure_installation

Your MySQL instance does not have a root password when installed, but you will want to set a secure password, remove anonymous users, disallow root logins, and remove all of the test databases. Finally accept the invitation to reload all privilege tables and you will return to the root prompt. Issue the following command to enter the MySQL prompt and create a database and MySQL user for Cacti:

    mysql -u root -p

Supply the requested password and issue the following SQL statements at the `mysql>` prompt.

    CREATE DATABASE cactidb;

    CREATE USER 'cactiuser'@localhost IDENTIFIED BY 'c@t1u53r';

    GRANT ALL PRIVILEGES ON cactidb.* TO 'cactiuser'@localhost;

    exit

Before we can begin to configure Cacti in the conventional manner, we must set up the database by issuing the following commands:

    cd /opt/
    wget http://svn.cacti.net/viewvc/cacti/tags/0.8.7e/cacti.sql?view=co
    mv cacti.sql\?view\=co cacti.sql
    mysql -u cactiuser -p cactidb < cacti.sql

Enter the password created above (e.g. `c@t1u53r`) and press return. Now edit the `/etc/cacti/db.php` file to include the relevant settings as in the below example:

{: .file-excerpt }
/etc/cacti/db.php
:   ~~~ php
    $database_type = "mysql";
    $database_default = "cactidb";
    $database_hostname = "localhost";
    $database_username = "cactiuser";
    $database_password = "c@t1u53r";
    $database_port = "3306";
    ~~~

Issue the following command to start Apache if you have not already:

    /etc/init.d/httpd start

From this point we'll continue the configuration of Cacti through the browser. By default, the Cacti interface only accepts traffic from the local interface. Modify `/etc/httpd/conf.d/cacti.conf` to allow traffic to your local machine's IP address, as in the following example:

{: .file-excerpt }
/etc/httpd/conf.d/cacti.conf

> \<Directory /usr/share/cacti/\>
> :   Order Deny,Allow Deny from all Allow from 193.194.195.196
>
> \</Directory\>

Where `193.194.195.196` is the IP address of your *local* Internet connection. Conversely you can copy the **entire** contents of the `/etc/httpd/conf.d/cacti.conf` into a [virtual hosting directive](/docs/web-servers/apache/configuration/configuration-basics) and provide [authentication based access control](/docs/web-servers/apache/configuration/http-authentication). When you have completed the modification of `cacti.conf` be sure to restart Apache to ensure that the settings will take effect. Issue the following command:

    /etc/init.d/httpd restart

Visit the domain you have pointed at your Linode, or your Linode's IP address, and add `/cacti`. If you've inserted the contents of `/etc/httpd/conf.d/cacti.conf` into a virtual host, visit the location of that virtual host, with `/cacti` appended. Follow the instructions shown on each page. Make sure to select `RRDTool 1.2.x` in the "RRDTool Utility Version" drop down. You should be able to continue through these pages into the login page without alteration.

At the login screen, enter `admin/admin` for the username/password combination. You'll be prompted to change your password on the next screen. At this point, Cacti is installed and ready to be configured.

Configuring Cacti
-----------------

At this point Cacti will contain an entry for `localhost`, which we'll need to modify. Click the "Console" tab in the top left corner, and select "Create Devices for network". Click the "Localhost" entry to begin making the needed changes. Select the Host Template drop down and pick the "ucd/net SNMP Host". Scroll down to SNMP Options and click the drop down box for SNMP Version, picking "Version 1". Enter "example" (or the community name you created above) in the box for the "SNMP Community" field. The "Associated Graph Templates" section allows you to add additional graphs. Hit "Save" to keep the changes.

Click "Settings" under "Configuration" and set your "SNMP Version" to "Version 1" in the drop down box. Type the name of your community for the "SNMP Community" (in this example, "example") and save.

Returning to the command line, issue the following command to create a new cron, or regular scheduled task:

    crontab -e

Now insert the following line:

{: .file-excerpt }
crontab

> */5* \* \* \* /usr/bin/php /usr/share/cacti/poller.php \> /dev/null 2\>&1

To learn more about using [cron to schedule tasks](/docs/linux-tools/utilities/cron), consider our documentation. The above "cronjob" runs Cacti's PHP poller every five minutes. If you need to alter this interval, modify the cron specification and modify the "Poller" settings from within Cacti's console tab. Be aware that it takes Cacti a full polling cycle to gather data and graphs.

Configuring Client Machines
---------------------------

This section is optional and for those looking to use Cacti to monitor additional devices. These steps are written for other Fedora-based distributions, but with modification, they will work on any flavor of Linux. You will need to follow these instructions for each client machine you'd like to monitor in Cacti. Client machines need an SNMP daemon in order to serve Cacti information. First, install `snmp` and `snmpd` on the client:

    yum install net-snmp

Next we'll need to modify the `/etc/snmp/snmpd.conf` file with the name of our community. Run the following commands to backup your existing `snmpd.conf` file and replace the contents with the name of your community:

    mv /etc/snmp/snmpd.conf /etc/snmp/old.snmpd.conf
    echo "rocommunity mycommunity" > /etc/snmp/snmpd.conf

Note that the format is "rocommunity community\_name", where `community_name` is the name of the community you originally used with Cacti, e.g. `example`. If you're monitoring a Fedora machine and you need to configure which interface SNMPD binds to you must edit the `/etc/sysconfig/snmpd.options` file. Append any IP address needed to the end of the following line, and uncomment it by removing the `#` at the beginning if needed. You should not need to edit this file.

{: .file }
/etc/sysconfig/snmpd.options

> OPTIONS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid'

Finally, restart the SNMP daemon to ensure that your changes to these files will take effect:

    /etc/init.d/snmpd restart

At this point your machine is ready for polling. Go into the Cacti interface to add the new "Device". Under the "Console" tab, select "New Graphs" and then "Create New Host". Enter the pertinent information in the fields required. Make sure to select "Ping" for "Downed Device Detection". Additionally, ensure that you've typed the right community name in the "SNMP Community" field. Click the "create" button to save your configuration. On the "save successful" screen, select your newly created device and from the "Choose an Action" drop down select "Place on a Tree" and then click "go". Hit "yes" on the next screen. On the "New Graphs" screen, you'll be able to create several different types of graphs of your choice. Follow the on-screen instructions to add these graphs to your tree.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Cacti Website](http://www.cacti.net/index.php)
- [Cacti Users Plugin Community](http://cactiusers.org/index.php)
- [Linux Security Basics](/docs/security/basics)



