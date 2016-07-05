---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Tiny Tiny RSS is an open-source RSS reader that you can host yourself. This guide will explain how to set up and configure Tiny Tiny RSS on your own server.'
keywords: 'nginx,centos,rss,reader,ttrss,tt-rss'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, July 5th, 2016'
title: 'Self-Hosted RSS Reader with Tiny Tiny RSS and Apache'
contributor:
  name: Tyler Langlois
  link: https://github.com/tylerjl
external_resources:
 - '[Tiny Tiny RSS Installation Notes](https://tt-rss.org/gitlab/fox/tt-rss/wikis/InstallationNotes)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr/>

[Tiny Tiny RSS](https://tt-rss.org/) is an open-source, self-hosted RSS reader that runs on PHP and a traditional SQL database (in this case, MariaDB).
Running your own RSS aggregator puts you in control of your data, and Tiny Tiny RSS even supports [mobile apps](https://play.google.com/store/apps/details?id=org.ttrssreader) that can tie into the server you set up.

This guide will walk through the steps necessary to install and configure Tiny Tiny RSS on a CentOS 7 system.

{ .note }
> SELinux is installed and enabled by default on CentOS 7.
> While common practice is to disable it out of the box, this guide contains necessary commands to install and use Tiny Tiny RSS while SELinux is enabled to retain the security features it provides.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access, and remove unnecessary network services. When configuring the firewall, be sure to open port **80** and potentially port **443** if you will be configuring SSL/TLS for your webserver.

3.  Follow the steps in the [LAMP on CentOS 7](/docs/websites/lamp/lamp-on-centos-7) guide. When initializing the new MariaDB database, use the following example to create a database for Tiny Tiny RSS (remember to replace "MyPassword" with a different, strong password and save it for later):

~~~
create database ttrss;
grant all on ttrss.* to 'ttrss' identified by 'MyPassword';
exit
~~~

## Preparing Apache

Ensure that necessary php prerequisites are installed:

    sudo yum install -y php-mysql php-mbstring

Add one additional configuration file to the apache `conf.d` folder in order to more completely secure some directories that Tiny Tiny RSS will use:

{: .file}
/etc/httpd/conf.d/ttrss.conf
:   ~~~ conf
    <Directory /var/www/html/cache>
        Require all denied
    </Directory>

    <Directory /var/www/html>
        <Files "config.php">
            Require all denied
        </Files>
    </Directory>
    ~~~

Restart apache for the configuration file to take effect.

    sudo systemctl restart httpd

## Install Tiny Tiny RSS

The recommended method to install Tiny Tiny RSS is to clone the repository over `git`, which makes updating the application simpler.
First, install `git`:

    sudo yum install -y git

Then clone the codebase into `/var/www/html`:

    sudo git clone https://tt-rss.org/git/tt-rss.git /var/www/html

{ .note }
> This command will clone tt-rss into the `/var/www/html` directory at the root, which means you will access the application at the root URL of your webserver (for example, at http://myserver).
> If you would prefer to use Tiny Tiny RSS under a separate URL (for example, at http://myserver/tt-rss), you can change the directory indicated in the `git clone` command to `/var/www/html/tt-rss`.

Before using the webapp, restart Apache again to ensure any changes to Apache have been cleanly applied.

    sudo systemctl restart httpd

## Configure Tiny Tiny RSS

At this point the application should be accessible under Apache.
As an example, if your Linode had the IP address of `1.2.3.4`, browsing to `http://1.2.3.4` should result in the following screen:

![Tiny Tiny RSS Installation Page](/docs/assets/tiny-tiny-rss-install-page.png)

Fill in the fields with the appropriate information:

*   From the "Database type" dropdown, choose MySQL.
*   Under "Username", fill in "ttrss".
*   Under "Password", fill in the password chosen when setting up the ttrss database in MariaDB/MySQL.
*   Use "ttrss" as the Database name.
*   The "Host name" and "Port" fields can be left blank.
*   The final URL field is what address Tiny Tiny RSS expects to be accessed under. If you are accessing your Linode via a DNS name rather than IP address, be sure to correctly fill in the field with the method you will use.

After filling in the fields, click "Test configuration".
Some preliminary checks will be performed, and, if everything is ready, another button with "Initialize database" will appear.
Click the button when you are ready to initialize the database.

{ .note }
> Initializing the databse will wipe all data in the `ttrss` database.
> If you are installing over a previous installation, perform any backups as necessary.

After the application initializes the MariaDB database, a message should appear about being unable to save `config.php` because the parent directory is not writeable.
This is a **good** thing because any potential vulnerabilities in the web application cannot write files to disk.
In order to finish configuring the application, follow the instructions to copy the contents of the text box (the block of text beginning with `<?php`) and paste the contents into `/var/www/html/config.php`

The following snippet shows the beginning of what the file should look like (note that you should have many additional lines with fields for the database username, password, and so on):

{: .file}
/var/www/html/config.php
:   ~~~ php
    <?php
    // *******************************************
    // *** Database configuration (important!) ***
    // *******************************************

    define('DB_TYPE', 'mysql');
    ............
    ~~~

If you need to customize your installation configuration further (for example, if you have an SMTP server that you wish to use in conjunction with Tiny Tiny RSS to email you with feed news), you should do so by editing `config.php` now.

Before using Tiny Tiny RSS, a few directory permissions must be changed so the webserver can write to them.
We'll change only the necessary directories that require additional permissions:

    cd /var/www/html
    sudo chgrp -R apache cache lock feed-icons
    sudo chmod -R g+w cache lock feed-icons

{ .note }
> The following command must be used to permit the webserver to write to these directories on CentOS 7, where SELinux is enabled by default.
> If SELinux has been disabled (check the output of the `sestatus` command if unsure), this step is not necessary.

    sudo chcon -R unconfined_u:object_r:httpd_sys_rw_content_t:s0 cache feed-icons lock

### Feed Updates

In order for Tiny Tiny RSS to update feeds continuously, a systemd service can be set up in order to automate the process.
Create the following systemd service:

{: .file}
/etc/systemd/system/ttrss-updater.service
:   ~~~ ini
    [Unit]
    Description=ttrss_backend
    After=network.target mysql.service

    [Service]
    User=apache
    ExecStart=/var/www/html/update_daemon2.php

    [Install]
    WantedBy=multi-user.target
    ~~~

Then start and enable the service at boot:

    sudo systemctl enable --now ttrss-updater

## Using The Application

Browse to the URL of your server, which should render the Tiny Tiny RSS login page:

![Tiny Tiny RSS Login Page](/docs/assets/tiny-tiny-rss-login.png)

Log in with the username "admin" and default password "password".
Your RSS reader should be functional!
You should immediately change the administrator password to something stronger by clicking the "Actions" button in the top-right corner of the Tiny Tiny RSS main page, selecting "Preferences", then clicking the "Users" tab that appears.
Click on the "admin" user, which should open a dialogue that contains an interface to change the user's password.

Note that if you prefer to log in with a less-privileged user, you can create additional users on this page as well.

At this point you can begin using Tiny Tiny RSS to subscribe and read feeds.
To get started, click on the "Actions" button (click "Exit preferences" if you are still in the preferences panel) and click the "Subscribe to feed..." link.
