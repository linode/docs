---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use Nagios to Monitor Services and Send Status Updates on Ubuntu 12.04 (Precise Pangolin).'
keywords: ["nagios", "monitor services", "ubuntu 12.04", "smtp", "pop3", "http", "icmp", "ssh", "notifications", "alerts", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['server-monitoring/nagios/ubuntu-12-04-precise-pangolin/','uptime/monitoring/monitor-services-with-nagios-on-ubuntu-12-04-precise-pangolin/']
modified: 2013-04-05
modified_by:
  name: Linode
published: 2012-11-07
title: 'Monitor Services with Nagios on Ubuntu 12.04'
external_resources:
 - '[Nagios Home Page](http://www.nagios.org/)'
 - '[Nagios IRC Bot](http://exchange.nagios.org/directory/Addons/Notifications/IRC/nagircbot/details)'
 - '[Nagios Library](http://library.nagios.com/)'
 - '[Nagios Security](http://nagios.sourceforge.net/docs/3_0/cgisecurity.html)'
---

Nagios is a monitoring tool that allows you to monitor services on a single server or a pool of servers. It can keep an eye on a broad range of network services, including SMTP and POP3 (email), HTTP (web), ICMP (ping), and SSH. In addition to simple uptime monitoring, Nagios also allows administrators to create their own plugins to monitor additional services or devices.

## Install Nagios

Before installing Nagios, make sure your hostname is properly set by following the steps outlined in the [Getting Started guide](/docs/getting-started/). You also need to have a functioning [LAMP stack](/docs/lamp-guides/ubuntu-12-04-precise-pangolin) set up on your Linode.

Now you're ready to install Nagios. Here's how:

1.  Ensure that your system's package repository and installed packages are up to date by entering the following commands, one by one:

        sudo apt-get update
        sudo apt-get upgrade

2.  Install Nagios from the Ubuntu repository by entering the following command:

        sudo apt-get install -y nagios3

3.  Enter an administrator password to complete the installation.

 {{< note >}}
If you do not already have an email server installed on your Linode, Postfix will be installed automatically. The *Internet Site* configuration will be used by default. You'll also have to enter a mail name for the system.
{{< /note >}}

## Access the Nagios Web Interface

You can now access the Nagios web interface for administration and reporting by visiting `http://example.com/nagios3/`, where `example.com` refers to your Linode's default virtual host. You may also access this interface by visiting `http://12.34.56.78/nagios3/`, where `12.34.56.78` is the IP address of your Linode. You will need to authenticate with the `nagiosadmin` user you created earlier.

{{< note >}}
The above example does not use SSL, and your password will be sent unencrypted. If you want to use encryption, you will need to generate (or purchase) and install an SSL certificate. Steps for generating and using your own certificate can be found in our [SSL guide](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate).
{{< /note >}}

## Configure Notifications

A great deal of the power of Nagios is its ability to send notifications and alerts regarding the status of services and devices. While most of this fine-grained configuration is beyond the scope of this document, we have outlined some basic notifications below.

### Email Alerts

Nagios can send alerts by email, but to receive them you'll need to add your email address to the Nagios configuration file. Here's how:

1.  Open the Nagios configuration file for editing by entering the following command:

        sudo nano /etc/nagios3/conf.d/contacts_nagios2.cfg

2.  Enter your system username and your email address by replacing `your_username` with your username, and `youremail@example.com` with your email address.

    {{< file-excerpt "/etc/nagios3/conf.d/contacts\\_nagios2.cfg" >}}
define contact{
    contact_name your_username
    service_notification_period 24x7
    host_notification_period 24x7
    service_notification_options w,u,c,r,f
    host_notification_options d,u,r,f
    service_notification_commands notify-service-by-email
    host_notification_commands notify-host-by-email
    email <youremail@example.com>
}

{{< /file-excerpt >}}


    {{< note >}}
To send email alerts to more than one user, duplicate the `define contact` section for as many users as you want. Or, to configure notifications to a [group](/docs/tools-reference/linux-users-and-groups), edit the `define contactgroup` section.
{{< /note >}}

3.  Save the changes to the configuration file by pressing `Control + x` and then pressing `y`.

4.  Restart Nagios to apply the changes:

        sudo service nagios3 restart

### IRC Notifications

You can also configure Nagios to send notifications to an IRC channel through a bot. Here's how:

1.  Enter the following command to install the IRC bot:

        sudo apt-get install nagircbot

2.  You'll need to provide a few parameters to the IRC bot - such as its nickname and server - in order to use it. To see a list of parameters, enter the following command:

        nagircbot -h

3.  To start the Nagios IRC bot, enter the following command:

        sudo nagircbot

4.  Now you need to set those parameters. Use the following example as a starting point. Replace `irc.example.com` with the address of your IRC network, and `#example` with the name of the IRC channel to which the bot should send notifications. Replace `nagircbot` with the desired nickname for your bot, and `ident` and `realname` with the ident and real name strings for the IRC bot.

        nagircbot -f /var/cache/nagios3/status.dat -s irc.example.com:6667 -c \#example -C -n nagircbot -u ident -U realname -I 900

    In the above example, `-f /usr/local/nagios/var/status.dat` tells the bot where to get status updates. The `-C` flag allows the bot to send colored messages to the channel depending on the status of the service. When services are down, red status messages are displayed. These messages turn green when the service has recovered. Warnings are displayed in yellow, but do not typically represent a critical issue.

    The `-I 900` parameter tells the bot to send a status message to the channel every 900 seconds (15 minutes). For example, the bot may send something like `Critical: 0, warning: 1, ok: 6, up: 2, down: 0, unreachable: 0, pending: 0`, which indicates that there are no critical messages and 1 warning.

## Accept External Commands

Nagios can accept *external commands* so that you can acknowledge problems, add comments, and more. Here's how to enable external commands:

1.  Open the Nagios configuration file for editing by entering the following command:

        sudo nano /etc/nagios3/nagios.cfg

2.  Change the `check_external_commands` setting to `check_external_commands=1`.
3.  Save the changes to the configuration file by pressing `Control + x` and then pressing `y`.
4.  Restart Apache by entering the following command:

        sudo service apache2 restart

5.  Open the system group file for editing by entering the following command:

        sudo nano /etc/group

6.  Change the `nagios:x:118` setting to `nagios:x:118:www-data`.
7.  Save the changes to the configuration file by pressing `Control + x` and then pressing `y`.
8.  Enter the following command to change the permissions of a Nagios configuration file:

        sudo chmod g+x /var/lib/nagios3/rw

9.  Enter the following command the change the permissions of the Nagios directory:

        sudo chmod g+x /var/lib/nagios3

10. Restart Nagios by entering the following command:

        sudo service nagios3 restart

Congratulations! External commands are now enabled.

## Next Steps

Nagios contains numerous features that are beyond the scope of this document. You are encouraged to explore the resources listed below and the administrative interface for more information regarding the setup and configuration of Nagios.

Congratulations on your new Nagios monitoring and notification system!
