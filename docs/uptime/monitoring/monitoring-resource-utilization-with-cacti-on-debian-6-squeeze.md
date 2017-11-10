---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Monitor resource usage through the powerful server monitoring tool Cacti on Debian 6 (Squeeze).'
keywords: ["monitoring", "cacti", "snmp", "debian", "debian 6", "squeeze", "debian squeeze"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['server-monitoring/cacti/debian-6-squeeze/']
modified: 2011-11-09
modified_by:
  name: Linode
published: 2011-11-09
expiryDate: 2011-11-09
title: 'Monitoring Resource Utilization with Cacti on Debian 6 (Squeeze)'
---

The Linode Manager provides some basic monitoring of system resource utilization, which includes information regarding Network, CPU, and Input/Output usage over the last 24 hours and 30 days. While this basic information is helpful for monitoring your system, there are cases where more fine-grained information is useful. The simple monitoring tool [Munin](/docs/uptime/monitoring/monitoring-servers-with-munin-on-debian-6-squeeze) is capable of monitoring needs of a small group of machines. In some cases, Munin may not be flexible enough for some advanced monitoring needs.

For these kinds of deployments we encourage you to consider a tool like Cacti, which is a flexible front end for the RRDtool application. Cacti simply provides a framework and a mechanism to poll a number of sources for data regarding your systems, which can then be graphed and presented in a clear web based interface. Whereas packages like Munin provide monitoring for a specific set of metrics on systems which support the Munin plug in, Cacti provides increased freedom to monitor larger systems and more complex deployment by way of its plug in framework and web-based interface.

Before installing Cacti we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing Prerequisites

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

### Set the Timezone

Begin by setting the timezone of your server if it isn't already set. Set your server to your timezone or to that of the bulk of your users. If you're unsure which timezone would be best, consider using universal coordinated time (or UTC, ie. Greenwich Mean Time). Keep in mind that Cacti uses the timezone set on the monitoring machine when generating its graphs. Run the following command to set the timezone:

    dpkg-reconfigure tzdata

### Installing Dependencies

Before installing Cacti we must install a few basic dependencies that are critical to the installation of Cacti. Cacti uses the Simple Network Management Protocol (SNMP) to poll the devices it tracks. We'll need to install the `snmpd` and `snmp` packages to allow Cacti to use SNMP. Cacti's web interface requires a database, web server, and PHP to be installed. Issue the following command to install these prerequisites:

    apt-get install snmpd snmp mysql-server apache2 libapache2-mod-php5 \
    php5-mysql php5-cli php5-snmp

You will need to create a password for the `root` user of your MySQL database during the installation. After the installation completes, be sure to run `mysql_secure_installation` to disable some of MySQL's less secure components.

The above command will additionally install the Apache web server. Consider our documentation of [installing the Apache HTTP Server](/docs/web-servers/apache/installation/debian-6-squeeze) for more information regarding this server. Additionally Cacti can function with alternate web server configurations, including [Apache with PHP running as a CGI process](/docs/web-servers/apache/php-cgi/debian-5-lenny) and with [Nginx with PHP running as a FastCGI process](/docs/web-servers/nginx/php-fastcgi/debian-6-squeeze).

### Configuring SNMPD

SNMPD binds to all addresses by default. If you only plan on using Cacti to monitor your Linode, you have the option to configure SNMPD to only bind to `localhost` by editing the `/etc/default/smnpd` file. Open the file and find the line that starts with `SNMPDOPTS=` and add `127.0.0.1` at the end. This line will now look like this:

{{< file >}}
/etc/default/snmpd
{{< /file >}}

> SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -g snmp -I -smux -p /var/run/snmpd.pid 127.0.0.1'

You can also specify which external IP address SNMPD binds to by adding it to the end as well. Now we'll open `/etc/snmp/snmpd.conf` to establish which host is trusted to receive data.

We'll create an SNMP "community" to help identify our group of devices for Cacti. In this instance, our hostname is "example.org", so we've named the community "example". The community name choice is up to the user. Locate the section of `snmpd.conf` that begins with `com2sec` and make sure the `readonly` line is the only uncommented line. This section of the file should now look like this:

{{< file >}}
/etc/snmp/snmpd.conf
{{< /file >}}

> \#com2sec paranoid default public com2sec readonly localhost example \#com2sec readwrite default private

If you want a remote machine to connect to Cacti, replace "localhost" with the IP address of the remote machine.

You need to restart snmpd any time `/etc/snmp/snmpd.conf` is modified. Run the following command after closing the file:

    /etc/init.d/snmpd restart

# Installing Cacti

To install the Cacti package from the distribution software repositories, issue the following command:

    apt-get install cacti

You will be presented with several prompts during this installation. On the "libphp-adodb" prompt you can safely select "Ok". During the "Configuring Cacti" prompt, make sure to select "Apache2." You will be presented with an additional "Configuring cacti" prompt that will ask if you'd like to configure your database with dbconfig-common. Select "Yes" and continue. On the MySQL prompt, enter the root password you created earlier. On the next screen, either create your own password for cacti's database access, or leave it blank for it to automatically generate one for you.

From here we'll continue configuring Cacti through the browser. Visit the domain you have pointed at your Linode, or your Linode's IP address, and add `/cacti`. Follow the instructions shown on each page. Make sure to select `RRDTool 1.2.x` in the "RRDTool Utility Version" drop down. You should be able to continue through these pages into the login page without alteration.

At the login screen, enter `admin/admin` for the username/password combination. You'll be prompted to change your password on the next screen. At this point, Cacti is installed and ready to be configured.

# Configuring Cacti

At this point Cacti will contain an entry for `localhost`, which we'll need to modify. Click the "Console" tab in the top left corner, and select "Create Devices for network". Click the "Localhost" entry to begin making the needed changes. Select the Host Template drop down and pick the "ucd/net SNMP Host". Scroll down to SNMP Options and click the drop down box for SNMP Version, picking "Version 1". Enter "example" (or the community name you created above) in the box for the "SNMP Community" field. The "Associated Graph Templates" section allows you to add additional graphs. Hit "Save" to keep the changes.

Click "Settings" under "Configuration" and set your "SNMP Version" to "Version 1" in the drop down box. Type the name of your community for the "SNMP Community" (in this example, "example") and save.

# Configuring Client Machines

This section is optional and for those looking to use Cacti to monitor additional devices. These steps are written for other Debian-based distributions, but with modification, will work on any flavor of Linux. You will need to follow these instructions for each client machine you'd like to monitor in Cacti. Client machines need an SNMP daemon in order to serve Cacti information. First, install `snmp` and `snmpd` on the client:

    apt-get install snmp snmpd

Next we'll need to modify the `/etc/snmp/snmpd.conf` file with the name of our community. Run the following commands to backup your existing `snmpd.conf` file and replace the contents with the name of your community:

    mv /etc/snmp/snmpd.conf /etc/snmp/old.snmpd.conf
    echo "rocommunity community_name" > /etc/snmp/snmpd.conf

Note that the format is "rocommunity community\_name", where `community_name` is the name of the community you originally used with Cacti. Next, we'll open the `/etc/default/snmpd` file and remove the binding on `localhost`. Like the "Configuring SNMP" section above, you'll want to find the line that begins with `SNMPDOPTS` and remove the reference to `127.0.0.1` at the end. This line should now resemble the one below:

{{< file >}}
/etc/default/snmpd
{{< /file >}}

> SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid'

Finally, restart the SNMP daemon to push the changes you've made to these files:

    /etc/init.d/snmpd restart

At this point your machine is ready for polling. Go into the Cacti interface to add the new "Device". Under the "Console" tab, select "New Graphs" and then "Create New Host". Enter the pertinent information in the fields required. Make sure to select "Ping" for "Downed Device Detection". Additionally, ensure that you've typed the right community name in the "SNMP Community" field. Click the "create" button to save your configuration. On the "save successful" screen, select your newly created device and from the drop down next to "Choose an Action" select "Place on a Tree" and then click "go". Hit "yes" on the next screen. On the "New Graphs" screen, you'll be able to create several different types of graphs of your choice. Follow the on-screen instructions to add these graphs to your tree.

# Using the Spine Polling Daemon

By default, Cacti uses a PHP script to poll the devices it tracks. "Spine" is a faster replacement for the default polling script written in C++. Installing Spine is relatively easy and a good idea if you plan on keeping track of many hosts. Begin installing Spine by running the following command :

    apt-get install cacti-spine

After the installation completes, go back to the Cacti administrative panel and click "Settings" under "Configuration". Click the "Paths" tab and check to see that Cacti found your spine binary correctly. Click the "Poller" tab and choose "Spine" from the drop-down for "Poller Type". Click "Save" to keep these changes. You are now successfully using Spine.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Cacti Website](http://www.cacti.net/index.php)
- [Cacti Users Plugin Community](http://cactiusers.org/index.php)
- [Linux Security Basics](/docs/security/basics)
- [Control Network Traffic with iptables](/docs/security/firewalls/iptables)



