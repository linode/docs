---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to install Nagios monitoring tool in a Ubuntu 14.04 Linode'
keywords: 'nagios,ubuntu,monitoring'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'Monitor Services with Nagios 4 on Ubuntu 14.04'
contributor:
  name: Paulo Telles
  link: http://github.com/paulotfilho
  external_resources:
- '[Nagios Website](http://www.nagios.org/)'
- '[Nagios Library](http://library.nagios.com/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Nagios is a very popular monitoring tool, providing monitoring and alerting services for your servers, applications and services. Using a wide variety of available plugins, you can keep track of the status of your critical services like HTTP, SSH, SMTP. A monitoring tool is a key application in a production server. In this guide, you'll learn how to setup a Nagios instance on your Linode.

## Before You Begin

1. In order to run an instance of Nagios in your Linode, follow the usual steps for Ubuntu 14.04 from the [Getting Started guide](/docs/getting-started/). 

2. A running [LAMP stack](docs/websites/lamp/lamp-on-ubuntu-14-04) is also required (Linux, Apache, MySQL and PHP stack). Follow the "[LAMP on Ubuntu 14.04](docs/websites/lamp/lamp-on-ubuntu-14-04)" guide for instructions on how to set up this stack.

3. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

## Installing Nagios


### Steps before installation

1.  As always, make sure that your package repository and packages are updated. In order to do that, simply enter the following commands:

        sudo apt-get update && sudo apt-get upgrade

2.  Nagios requires a separate user and group to run its process. We will create a user `nagios` and a group `nagioscmd`, and insert the user into the group. We are also going to add the Apache user `www-data` to the `nagcmd` group in order to run external commands on Nagios using the web interface:

        sudo useradd nagios
        sudo groupadd nagcmd
        sudo usermod -a -G nagcmd nagios
        sudo usermod -G nagcmd www-data

3. Next we will install the latest stable version of Nagios, which we'll have to download and build from source code. In order to fulfill the dependencies to build Nagios, install the following packages:

        sudo apt-get install build-essential unzip openssl libssl-dev libgd2-xpm-dev xinetd apache2-utils

### Building Nagios

We are now ready to build Nagios 4 from source code. The following steps will guide you through this process.

1. In order to download Nagios 4 source code, go to [this page](https://www.nagios.org/downloads/core-stay-informed/). Click "Skip to download" in case you don't want to fill in the form. Under "Nagios Core", find the release that says "Latest stable release" in "Notes" and copy the download link (e.g. https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz)

2. Download and extract Nagios to your Linode using `wget` and `tar`, pasting the link from step 4:

        wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz
        tar -xvf nagios-4.1.1.tar.gz

3. We are now ready to build Nagios. Change to the newly created directory:

        cd nagios-4.1.1

4. Now we need to configure it, compile it and install it:

        ./configure --with-nagios-group=nagios --with-command-group=nagcmd
        make all
        sudo make install
        sudo make install-init
        sudo make install-config
        sudo make install-commandmode

{: .note}
>
>The latest stable version of Nagios 4 is not available in default repositories, that's why we cover how to build it from source code in this guide. 

## Configuring Nagios Web Interface

Now that Nagios is installed, we may setup the web interface. In order to use the Nagios web interface, we need to configure Apache first. The following steps will guide you through the configuration.

1. Make sure Apache has mod_rewrite and mod_cgi enabled:

        sudo a2enmod rewrite && sudo a2enmod cgi
If mod_rewrite and/or mod_cgi were not already enabled, you'll have to restart Apache with `sudo service apache2 restart`.

2. Install the web interface config file in Apache's "sites-available" directory using the following commands. We will be copying a sample configuration file to Apache, setting permissions to 644 and enabling the site on Apache. Remember to run this command from Nagios source code directory:

        sudo cp sample-config/httpd.conf /etc/apache2/sites-available/nagios4.conf
        sudo chmod 644 /etc/apache2/sites-available/nagios4.conf
        sudo a2ensite nagios4.conf

4. For safety, the web interface requires login. Create a nagiosadmin account and note down the password assigned.

        sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

5. Restart Apache in order to reload settings:

        sudo service apache2 reload

## Installing Nagios Plugins

Nagios Plugins is a pack of well-written checking scripts, which will allow you to monitor services like DHCP, FTP, HTTP, NTP. In order to use Nagios Plugins, go to [this link](https://nagios-plugins.org/downloads/) and copy the download link for the current stable release (e.g. http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz)

1. Download and extract Nagios Plugins to your Linode using wget and tar, pasting the link you copied:

        wget http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz
        tar -xvf nagios-plugins-2.1.1.tar.gz

6. Just like we did with Nagios, we need to build Nagios Plugins. Change to the newly created directory:

        cd nagios-plugins-2.1.1

7. Now we need to configure it, compile it and install it:

        ./configure --with-nagios-user=nagios --with-nagios-group=nagios --with-openssl
        make
        sudo make install

## Accessing the Nagios Web Interface

We finally can access Nagios Web Interface! But first, we need to start Nagios itself:

        sudo service nagios start

The interface can be accessed from your domain or Public IP (change example.com with your Linode IP address). When prompted for login, insert nagiosadmin as user and the assigned password:

        http://example.com/nagios

You will be greeted with a screen like this one:

![Nagios 4 Greeting](/docs/assets/greeting_nagios4.png)

If you click Hosts on the left menu, you can see that localhost (your Nagios server) is already being monitored:

![Nagios 4 Hosts](/docs/assets/hosts_nagios4.png)


## Next Steps

Nagios contains numerous features that are beyond the scope of this document. You are encouraged to explore the resources listed below and the administrative interface for more information regarding the setup and configuration of Nagios.

Congratulations on your new Nagios monitoring and notification system!

[Nagios Website](http://www.nagios.org/)

[Nagios Library](http://library.nagios.com/)
