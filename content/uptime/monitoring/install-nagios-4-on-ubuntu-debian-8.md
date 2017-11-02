---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Nagios is a widely used tool for monitoring systems and services.'
keywords: ["nagios", "ubuntu", "monitoring", "install nagios", "nagios 4 ubuntu", "debian 8"]
aliases: ['uptime/monitoring/monitor-services-with-nagios-4-on-ubuntu-14-04/','uptime/monitoring/install-nagios-4-on-ubuntu-14-04-debian-8/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-04-12
modified: 2016-04-12
modified_by:
  name: Edward Angert
title: 'Install Nagios 4 on Ubuntu and Debian 8'
contributor:
  name: Paulo Telles
  link: http://github.com/paulotfilho
external_resources:
 - '[Nagios Website](http://www.nagios.org/)'
 - '[Nagios Library](http://library.nagios.com/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

A monitoring tool is a key application in a production server. Nagios is a popular tool that provides monitoring and alerting services for your servers, applications and services. Using Nagios and a wide variety of available plugins, you can keep track of the status of your critical services like HTTP, SSH and SMTP. In this guide, you'll learn how to install Nagios 4 on your Linode.

## Before You Begin

1.  In order to run Nagios on your Linode, follow the configuration steps for Ubuntu or Debian 8 from our [Getting Started guide](/docs/getting-started/).

2.  Install and configure a LAMP stack (Linux, Apache, MySQL and PHP stack). Follow the [LAMP on Ubuntu 14.04](/docs/websites/lamp/lamp-on-ubuntu-14-04) or [LAMP on Debian 8](/docs/websites/lamp/lamp-on-debian-8-jessie) guide for instructions.

3.  Install updates:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Nagios


### Create Users and Groups

Create a user, `nagios`, and a distinct group, `nagcmd`. Add `nagios` and the Apache user, `www-data`, to the `nagcmd` group in order to run external commands on Nagios through the web interface:

    sudo useradd nagios
    sudo groupadd nagcmd
    sudo usermod -a -G nagcmd nagios && sudo usermod -a -G nagcmd www-data

### Build Nagios 4 from Source Code

The latest stable version of Nagios 4 is not available in Ubuntu or Debian's default repositories as of this writing. To install Nagios, download and install it from the source code:

1.  Install dependencies:

        sudo apt-get install build-essential unzip openssl libssl-dev libgd2-xpm-dev xinetd apache2-utils

2.  In your web browser, go to [the Nagios Core DIY download page](https://www.nagios.org/downloads/core-stay-informed/). If you prefer not to register for updates, click **Skip to download**.

3.  Under **Nagios Core**, find the release that says **Latest stable release** under **Notes**, then copy the download link to your clipboard.

4.  Download and extract Nagios to your Linode using `wget` and `tar`, pasting the link from Step 3:

        wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz
        tar -xvf nagios-4.*.tar.gz

5.  Move to the newly created directory:

        cd nagios-4.*

6.  Configure, compile and install Nagios:

        ./configure --with-nagios-group=nagios --with-command-group=nagcmd
        make all
        sudo make install
        sudo make install-init
        sudo make install-config
        sudo make install-commandmode


## Prepare Apache and Configure Nagios Web Interface


1.  Make sure Apache has `mod_rewrite` and `mod_cgi` enabled:

        sudo a2enmod rewrite && sudo a2enmod cgi

2.  Copy the sample virtual host configuration Nagios provides to `sites-available`:

        sudo cp sample-config/httpd.conf /etc/apache2/sites-available/nagios4.conf

3.  Restrict `nagios4.conf` file permissions:

        sudo chmod 644 /etc/apache2/sites-available/nagios4.conf

4.  Enable the new virtual host:

        sudo a2ensite nagios4.conf

5.  The web interface requires login. Create a `nagiosadmin` account and record the password you assign:

        sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

6.  Restart Apache

        sudo service apache2 restart

## Install Nagios Plugins

Nagios Plugins allow you to monitor services like DHCP, FTP, HTTP and NTP. To use Nagios Plugins, go to [the Nagios Plugins downloads page](https://nagios-plugins.org/downloads/) and copy the download link for the current stable release (e.g., `http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz`):

1.  Download and extract Nagios Plugins to your Linode using `wget` and `tar`, pasting the link you copied:

        wget http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz
        tar -xvf nagios-plugins-2*.tar.gz

2.  Change to the newly created directory, then configure, compile, and install Plugins:

        cd nagios-plugins-2.*
        ./configure --with-nagios-user=nagios --with-nagios-group=nagios --with-openssl
        make
        sudo make install

## Access the Nagios Web Interface

1.  Before accessing the Nagios Web Interface, start the Nagios service:

        sudo service nagios start

    {{< note >}}
For Ubuntu versions after 14.04, see the [Systemd section below](#systemd) before running this step.
{{< /note >}}

2.  The interface can be accessed in your web browser by appending `/nagios` to your domain or Public IP. When prompted at login, use `nagiosadmin` as the user and use the password you assigned in the **Configure Nagios Web Interface** section.


    You will be greeted with a screen like this one:

    ![Nagios 4 Greeting](/docs/assets/greeting_nagios4.png)

    To view monitoring status, click the **Hosts** link in the menu on the left. This example screenshot shows an active Nagios server called `localhost`:

    ![Nagios 4 Hosts](/docs/assets/hosts_nagios4.png)


### Systemd

As of this guide's publication, the Nagios build process does not create a systemd service file. In order to manage the service with systemd, create a Nagios service file for the system to load on initialization:

 {{< file "/etc/systemd/system/nagios.service" ini >}}
[Unit]
Description=Nagios
BindTo=network.target

[Install]
WantedBy=multi-user.target

[Service]
User=nagios
Group=nagios
Type=simple
ExecStart=/usr/local/nagios/bin/nagios /usr/local/nagios/etc/nagios.cfg

{{< /file >}}



Enable the link, start the Nagios service, and check the status:

    sudo systemctl enable /etc/systemd/system/nagios.service
    sudo systemctl start nagios
    systemctl status nagios

You can now continue at [Access the Nagios Web Interface](#access-the-nagios-web-interface)

## Next Steps

Nagios contains numerous features that are beyond the scope of this document. Explore the Nagios administrative interface as well as the resources listed below to access more information regarding the setup and configuration of Nagios.

Congratulations on your new Nagios monitoring and notification system!
