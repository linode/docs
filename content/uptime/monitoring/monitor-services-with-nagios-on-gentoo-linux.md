---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use Nagios to monitor services and send status updates on your Gentoo Linode.'
keywords: ["nagios", "monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['server-monitoring/nagios/gentoo/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2010-11-15
title: Monitor Services with Nagios on Gentoo Linux
---



Nagios is a monitoring tool that makes it possible to monitor services on a single server or a pool of servers. It provides the capability to monitor a broad range of network services including SMTP and POP3 (email), HTTP (web), ICMP (ping), and SSH. In addition to simple uptime monitoring, Nagios also allows administrators to create their own plugins to monitor additional services or devices.

Before installing Nagios, you will need to ensure that your hostname is properly set by following the steps outlined in the [getting started guide](/docs/getting-started/). Additionally, you will need to have a functioning [LAMP stack](/docs/lamp-guides/) in order to use Nagios.

Prepare for Nagios Installation
-------------------------------

Ensure that your system's package repository and installed packages are up to date by issuing the following commands:

    emerge --sync
    emerge --update world

Install Nagios
--------------

Issue the following command to install Nagios:

    USE="jpeg png" emerge 'nagios'

This command will install Nagios and place the website files in `/usr/share/nagios/htdocs`. You will need to issue the following commands to create and change the owner of the `/etc/nagios/auth.users` file to the Nagios user and allow Apache to access it:

    touch /etc/nagios/auth.users
    chown nagios:nagios /etc/nagios/auth.users
    cd /usr/share/nagios/htdocs
    ln -s /etc/nagios/auth.users

Configure Apache
----------------

Edit the `APACHE2_OPTS` line in your `/etc/conf.d/apache2` so that it resembles the following:

{{< file-excerpt "/etc/conf.d/apache2" >}}
APACHE2_OPTS="-D DEFAULT_VHOST -D INFO -D SSL -D SSL_DEFAULT_VHOST -D LANGUAGE -D PHP5 -D NAGIOS"

{{< /file-excerpt >}}


You will also need to copy the Nagios Apache config to `/etc/apache2/modules.d/`:

    cp /usr/portage/net-analyzer/nagios-core/files/99_nagios3.conf /etc/apache2/modules.d/

Configure Nagios
----------------

Begin by editing the `/etc/nagios/objects/contacts.cfg` file's email field, according to the example below:

{{< file-excerpt "/etc/nagios/objects/contacts.cfg" >}}
define contact{
    contact_name nagiosadmin ; Short name of user use generic-contact
    ; Inherit default values from generic-contact template (defined above)
    alias John Doe ; Full name of user
    email nagiosuser@example.com> ; <<***** CHANGE THIS TO YOUR EMAIL ADDRESS ******
}

{{< /file-excerpt >}}


Issue the following command to create a password for the `nagiosadmin` user. You will use this password to log into the Nagios administration panel when it is configured.

    htpasswd -c /etc/nagios/htpasswd.users nagiosadmin

You will now need to restart the web server by issuing the following command:

    /etc/init.d/apache2 restart

Running Nagios
--------------

Issue the following commands to ensure that Nagios is started when your system boots:

    rc-update add nagios default

Run the following command to check your Nagios configuration file for errors:

    nagios -v /etc/nagios/nagios.cfg

Any errors will be shown in red. If everything is okay, you may issue the following command to start Nagios for the first time:

    /etc/init.d/nagios start

You may now access the web based administration and reporting tools by visiting `http://example.com/nagios/`, where `example.com` refers to your Linode's default virtual host. You may also access this interface by visiting `http://12.34.56.78/nagios/` where `12.34.56.78` is the IP address of your Linode. You will need to authenticate with the nagiosadmin user you created earlier.

**Please note:** The above example does not use SSL, and your password will be sent unencrypted. You will need to generate an SSL certificate and install it yourself. Steps for doing so can be found in our [SSL guide](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate).

Configure Nagios Alerts
-----------------------

A great deal of the power of Nagios is its ability to send notifications and alerts regarding the status of services and devices. While most of this fine-grained configuration is beyond the scope of this document, we have outlined some basic notifications below.

### Installing Prerequisites to send Mail Alerts

Before Nagios can send alerts by email, basic mail services need to be installed. Issue the following command:

    apt-get install mailutils postfix

When the installation process prompts you to define the type of mail setup you're running, select "Internet Site". You will also want to specify the machine specific hostname for this server during the installation process. Next, you'll need to update the path to the mail binary in the Nagios command file. Change both references from `/bin/mail` to `/usr/bin/mail`. The relevant section of this file should look like this:

{{< file "/etc/nagios/objects/commands.cfg" >}}
define command{
    command_name    notify-host-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nAddress: $HOSTADDRESS$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Host Alert: $HOSTNAME$ is $HOSTSTATE$ **" $CONTACTEMAIL$
}

# 'notify-service-by-email' command definition
define command{
    command_name    notify-service-by-email
    command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n\n$SERVICEOUTPUT$" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **" $CONTACTEMAIL$
}

{{< /file >}}


In order for these changes to take effect, you will need to restart Nagios:

    /etc/init.d/nagios restart

### Configuring Basic IRC Notifications

You can also configure Nagios to send notifications to an IRC channel through a bot. Issue the following commands to download, extract, and build the IRC bot:

    cd /opt/
    wget http://www.vanheusden.com/nagircbot/nagircbot-0.0.29b.tgz
    tar -zxvf /opt/nagircbot-0.0.29b.tgz
    cd /opt/nagircbot-0.0.29b
    make
    make install

You will need to provide a few parameters to the IRC bot such as its nickname and server in order to use it. For a list of parameters, issue the following command:

    nagircbot -h

To start the Nagios IRC bot issue the `nagircbot` command. See the following example as a starting point. Replace `irc.example.net` with the address of your IRC network, and `#example` with the name of the IRC channel that the bot should send notifications to. Replace `nagircbot` with the desired nickname for your bot, and `ident` and `realname` with the ident and real name strings for the IRC bot.

    nagircbot -f /usr/local/nagios/var/status.dat -s irc.duckligton.net:6667 -c \#example -C -n nagircbot -u ident -U realname -I 900

In the above example, "-f /usr/local/nagios/var/status.dat" tells the bot where to get status updates. The "-C" flag will allow the bot to send colored messages to the channel depending on the status of the service. When services are down, red status messages are displayed. These messages turn green when the service has recovered. Warnings are displayed in yellow, but do not typically represent a critical issue. The "-I 900" parameter tells the bot to send a status message to the channel every 900 seconds (or 15 minutes). For example, the bot may send something like "Critical: 0, warning: 1, ok: 6, up: 2, down: 0, unreachable: 0, pending: 0", which indicates that there are no critical messages and 1 warning.

Nagios contains numerous features that are beyond the scope of this document. You are encouraged to explore the resources listed below and the administrative interface for more information regarding the setup and configuration of Nagios. Congratulations on your new Nagios monitoring and notification system!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Nagios Home Page](http://www.nagios.org/)
- [Nagios IRC Bot](http://exchange.nagios.org/directory/Addons/Notifications/IRC/nagircbot/details)
- [Nagios Library](http://library.nagios.com/)
- [Nagios Security](http://nagios.sourceforge.net/docs/3_0/cgisecurity.html)



