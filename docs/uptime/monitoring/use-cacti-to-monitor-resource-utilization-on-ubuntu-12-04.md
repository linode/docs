---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy Cacti, a Powerful Server-monitoring Solution That Uses SNMP to Track Resource Usage on Ubuntu 12.04.'
keywords: ["Cacti", "Ubuntu", " Ubuntu 12.04", "SNMP", "spine", "client machine"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['server-monitoring/cacti/ubuntu-12-04-precise-pangolin/','uptime/monitoring/monitoring-resource-utilization-with-cacti-on-ubuntu-12-04-precise/']
modified: 2012-10-11
modified_by:
  name: Linode
published: 2012-10-11
title: 'Use Cacti to Monitor Resource Utilization on Ubuntu 12.04'
external_links:
 - '[Cacti Website](http://www.cacti.net/index.php)'
 - '[Cacti Users Plugin Community](http://cactiusers.org/index.php)'
 - '[Linux Security Basics](/docs/security/basics)'
---

The Linode Manager provides some basic monitoring of system resource utilization, which includes information regarding Network, CPU, and Input/Output usage over the last 24 hours and 30 days. While this basic information is helpful for monitoring your system, there are cases where more fine-grained information is useful. The simple monitoring tool [Munin](http://munin-monitoring.org/) is capable of monitoring needs of a small group of machines. In some cases, Munin may not be flexible enough for advanced monitoring needs.

For these kinds of deployments we encourage you to consider a tool like Cacti, which is a flexible front end for the RRDtool application. Cacti simply provides a framework and a mechanism to poll a number of sources for data regarding your systems, which can then be graphed and presented in a clear web-based interface. Whereas packages like Munin provide monitoring for a specific set of metrics on systems which support the Munin plug in, Cacti provides increased freedom to monitor larger systems and more complex deployment by way of its plug-in framework.

Before installing Cacti we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Prerequisites

### Set the Timezone

Begin by setting the timezone of your server if it isn't already set. Set your server to your timezone or to that of the bulk of your users. If you're unsure which timezone would be best, consider using Universal Coordinated Time (or UTC, ie. Greenwich Mean Time). Keep in mind that Cacti uses the timezone set on the monitoring machine when generating its graphs. Run the following command to set the timezone:

    dpkg-reconfigure tzdata

### Enable the Universe Repositories

The `universe` repositories should be enabled on your Linode by default. You can double-check this by editing the `/etc/apt/sources.list` file, and verifying that lines resemble the following (you may have to uncomment or add the `universe` lines):

{{< file "/etc/apt/sources.list" >}}
## N.B. software from this repository is ENTIRELY UNSUPPORTED by the Ubuntu
## team. Also, please note that software in universe WILL NOT receive any
## review or updates from the Ubuntu security team.
deb http://us.archive.ubuntu.com/ubuntu/ precise universe
deb-src http://us.archive.ubuntu.com/ubuntu/ precise universe
deb http://us.archive.ubuntu.com/ubuntu/ precise-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ precise-updates universe

{{< /file >}}


If you had to enable new repositories, issue the following command to update your package lists:

    apt-get update
    apt-get upgrade

### Install Dependencies

  Before installing Cacti we must install a few basic dependencies that are critical to the installation of Cacti. Cacti uses the Simple Network Management Protocol (SNMP) to poll the devices it tracks. We'll need to install the `snmpd` and `snmp` packages to allow Cacti to use SNMP. Cacti's web interface requires a database, web server, and PHP to be installed. Issue the following command to install these prerequisites:

    apt-get install snmpd snmp mysql-server apache2 libapache2-mod-php5 \
    php5-mysql php5-cli php5-snmp

You will need to create a password for the `root` user of your MySQL database during the installation. After the installation completes, be sure to run `mysql_secure_installation` to disable some of MySQL's less for configuration recommendations.

The above command will additionally install the Apache web server. Consider our documentation on [installing the Apache HTTP server](/docs/websites/apache/apache-2-web-server-on-ubuntu-12-04-lts-precise-pangolin) for more information regarding this server. Additionally Cacti can function with alternate web server configurations, including [Apache with PHP running as a CGI process](/docs/websites/apache/run-php-applications-under-cgi-with-apache-on-ubuntu-12-04-lts-precise-pangolin) and with [nginx](/docs/websites/nginx/nginx-and-phpfastcgi-on-ubuntu-12-04-lts-precise-pangolin) running PHP as a FastCGI process.

### Install Cacti

To install the Cacti package from the distribution software repositories, issue the following command:

    apt-get install cacti

You will be presented with several prompts during this installation. On the "libphp-adodb" prompt you can safely select "Ok". During the "Configuring Cacti" prompt, make sure to select "Apache2". You will be presented with an additional "Configuring cacti" prompt that will ask if you'd like to configure your database with dbconfig-common. Select "Yes" and continue. On the MySQL prompt, enter the root password you created earlier. On the next screen, either create your own password for cacti's database access, or leave it blank for it to automatically generate one for you.

From here, we'll continue configuring Cacti through the browser. Visit the domain you have pointed at your Linode or your Linode's IP address, and add `/cacti`. Follow the instructions shown on each page. The default values for each prompt should work for this installation, including the selection of "New Installation", "NET-SNMP 5.X" for the SNMP Utility Version, and "RRDTool 1.4.x" for the RRDTool Utility Version.

At the login screen, enter `admin/admin` for the username/password combination. You'll be prompted to change your password on the next screen. Cacti is now installed and ready to be configured.

### Configure Cacti

At this point Cacti will contain an entry for `localhost`, which we'll need to modify. Click the "Console" tab in the top left corner, and select "Create Devices for network". Click the "Localhost" entry to begin making the needed changes. Select the Host Template drop-down and pick the "ucd/net SNMP Host". Scroll down to SNMP Options and click the drop down box for SNMP Version, picking "Version 2". The default values for SNMP Community, Port, Timeout and Max OIDs should be suitable for now. The "Associated Graph Templates" section allows you to add additional graphs. Hit "Save" to keep the changes.

Click "Settings" under "Configuration" and set your "SNMP Version" to "Version 2" in the drop down box.

## Configure Client Machines

This section is optional and for those looking to use Cacti to monitor additional devices. These steps are written for Debian-based distributions, but with modification, they will work on any flavor of Linux. You will need to follow these instructions for each client machine you'd like to monitor with Cacti. Client machines need an SNMP daemon in order to serve Cacti information. First, install `snmp` and `snmpd` on the client:

    apt-get install snmp snmpd

Since snmpd binds to localhost by default, we'll need to edit the `/etc/snmp/snmpd.conf`  file to allow snmpd to serve requests on other interfaces. Please note that  allowing snmpd to run on a public IP address will have security implications,  such as allowing anyone with your IP address to access the snmp daemon running  on your Linode. If you choose to allow snmp to listen on all interfaces, we  strongly recommend [implementing firewall rules](/docs/security/firewalls) that  restrict access to only specific ip addresses that you control.

Open the file and find the section labeled `Agent Behaviour`. Comment out the line that specifies `127.0.0.1` as the agent address by placing a `#`  in front of it. Uncomment the other line that defines the agentAddress as all  interfaces. The `Agent Behavior` section should now resemble the following:

.. file:: /etc/snmp/snmpd.conf

    \#  Listen for connections from the local system only     \#agentAddress  udp:127.0.0.1:161     \#  Listen for connections on all interfaces (both IPv4 \*and\* IPv6)     agentAddress udp:161,udp6:[::1]:161

After saving your changes to the configuration file, you'll need to reload  settings for snmpd by running the following command:

`service snmpd reload`

At this point your machine is ready for polling. Go into the Cacti interface to add the new "Device". Under the "Console" tab, select "New Graphs" and then "Create New Host". Enter the pertinent information in the fields required. Make sure to select "Ping" for "Downed Device Detection". Click the "create" button to save your configuration. On the "save successful" screen, select your newly created device and from the drop down next to "Choose an Action" select "Place on a Tree" and then click "go". Hit "yes" on the next screen. On the "New Graphs" screen, you'll be able to create several different types of graphs of your choice. Follow the on-screen instructions to add these graphs to your tree.

## Use the Spine Polling Daemon

By default, Cacti uses a PHP script to poll the devices it tracks. "Spine" is a faster replacement for the default polling script written in C++. Installing Spine is relatively easy and a good idea if you plan on keeping track of many hosts. Begin the Spine installation by running the following command :

    apt-get install cacti-spine

After the installation completes, go back to the Cacti administrative panel and click "Settings" under "Configuration". Click the "Paths" tab and check to see that Cacti found your spine binary correctly. Click the "Poller" tab and choose "Spine" from the drop-down for "Poller Type". Click "Save" to keep these changes. You are now successfully using Spine.
