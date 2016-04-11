---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install Nagios 4 on Ubuntu 14.04'
keywords: 'nagios,ubuntu,monitoring,install nagios,nagios 4 ubuntu 14.04'
alias: ['uptime/monitoring/monitor-services-with-nagios-4-on-ubuntu-14-04/']
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: ''
modified: Monday, March 28th, 2016
modified_by:
  name: Linode
title: 'Install Nagios 4 on Ubuntu 14.04'
contributor:
  name: Paulo Telles
  link: http://github.com/paulotfilho
external_resources:
 - '[Nagios Website](http://www.nagios.org/)'
 - '[Nagios Library](http://library.nagios.com/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

A monitoring tool is a key application in a production server. Nagios is a popular tool that provides monitoring and alerting services for your servers, applications and services. Using Nagios and a wide variety of available plugins, you can keep track of the status of your critical services like HTTP, SSH and SMTP.  In this guide, you'll learn how to install Nagios 4 on your Linode.

## Before You Begin

1. In order to run Nagios on your Linode, follow the usual configuration steps for Ubuntu 14.04 from our [Getting Started guide](/docs/getting-started/). 

2. A running [LAMP stack](docs/websites/lamp/lamp-on-ubuntu-14-04) (Linux, Apache, MySQL and PHP stack) is also required. Follow the "[LAMP on Ubuntu 14.04](docs/websites/lamp/lamp-on-ubuntu-14-04)" guide for instructions on how to set up this stack.

3. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

## Install Nagios


### Steps before installation

1.  As always, make sure that your package repository and packages have been updated:

        sudo apt-get update && sudo apt-get upgrade

2.  To run Nagios, you will need to create both a separate user, `nagios`, and a distinct group, `nagcmd` before inserting the user into the group. You are also going to add the Apache user, `www-data`, to the `nagcmd` group in order to run external commands on Nagios through the web interface:

        sudo useradd nagios
        sudo groupadd nagcmd
        sudo usermod -a -G nagcmd nagios
        sudo usermod -G nagcmd www-data

3.  Next, we will install the latest stable version of Nagios, which we'll have to download and build from source code. In order to fulfill the dependencies to build Nagios, install the following packages:

        sudo apt-get install build-essential unzip openssl libssl-dev libgd2-xpm-dev xinetd apache2-utils

{: .note}
>
>The latest stable version of Nagios 4 is not available in default repositories. The following steps will walk you through building it from source code. 

### Build Nagios 4 from Source Code

The following steps will guide you through building Nagios 4 from source code.

1. In order to download Nagios 4 source code, go to [the Nagios Core DIY download page](https://www.nagios.org/downloads/core-stay-informed/). If you prefer not to register for updates, click "Skip to download." Under "Nagios Core," find the release that says "Latest stable release" in "Notes," then copy the download link (e.g., https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz).

2. Download and extract Nagios to your Linode using `wget` and `tar`, pasting the link from step 1 and specifying the version number when expanding the archive in the `tar -xvf` line:

        wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz
        tar -xvf nagios-4.1.1.tar.gz

3. You are now ready to build Nagios. Change to the newly created directory:

        cd nagios-4.1.1

4. Now, we need to configure, compile and install Nagios:

        ./configure --with-nagios-group=nagios --with-command-group=nagcmd
        make all
        sudo make install
        sudo make install-init
        sudo make install-config
        sudo make install-commandmode


## Configure Nagios Web Interface

Now that Nagios is installed, you can configure its web interface. In order to use the Nagios web interface, you need to configure Apache first. The following steps will guide you through the configuration.

1. Make sure Apache has mod_rewrite and mod_cgi enabled:

        sudo a2enmod rewrite && sudo a2enmod cgi
        
If mod_rewrite and/or mod_cgi were not already enabled, you'll have to restart Apache with `sudo service apache2 restart`.

2. Install the web interface config file in Apache's "sites-available" directory using the following command sequence run from the Nagios source directory. You will be copying a sample configuration file to Apache, setting file permissions to 644 through chmod, and enabling the site on Apache:

        sudo cp sample-config/httpd.conf /etc/apache2/sites-available/nagios4.conf
        sudo chmod 644 /etc/apache2/sites-available/nagios4.conf
        sudo a2ensite nagios4.conf

4. For safety, the web interface requires login. Create a `nagiosadmin` account and record the password assigned:

        sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin

5. Restart Apache in order to reload settings:

        sudo service apache2 reload

## Install Nagios Plugins

Nagios Plugins, a pack of well-written checking scripts, will allow you to monitor services like DHCP, FTP, HTTP and NTP. In order to use Nagios Plugins, go to [the Nagios Plugins downloads page](https://nagios-plugins.org/downloads/) and copy the download link for the current stable release (e.g., http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz):

1. Download and extract Nagios Plugins to your Linode using wget and tar, pasting the link you copied:

        wget http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz
        tar -xvf nagios-plugins-2.1.1.tar.gz

6. As you did with Nagios, you will need to build Nagios Plugins. Change to the newly created directory:

        cd nagios-plugins-2.1.1

7. Now, configure, compile, and install Plugins:

        ./configure --with-nagios-user=nagios --with-nagios-group=nagios --with-openssl
        make
        sudo make install

## Access the Nagios Web Interface

Before you can access the Nagios Web Interface, you need to start Nagios, itself:

        sudo service nagios start

The interface can be accessed from your domain or Public IP (swap example.com with your Linode IP address). When prompted at login, insert `nagiosadmin` as user and the assigned password:

        http://example.com/nagios

You will be greeted with a screen like this one:

![Nagios 4 Greeting](/docs/assets/greeting_nagios4.png)

If you click Hosts on the left menu, you can see that localhost (your Nagios server) is already being monitored:

![Nagios 4 Hosts](/docs/assets/hosts_nagios4.png)


## Next Steps

Nagios contains numerous features that are beyond the scope of this document. You are encouraged to explore the resources listed below and the administrative interface to acquire more information regarding the setup and configuration of Nagios.

Congratulations on your new Nagios monitoring and notification system!
