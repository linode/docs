---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Self-host your RSS reader on a CentOS 7 Linode with Tiny Tiny RSS.'
keywords: ["apache", "centos", "rss", "reader", "ttrss", "tt-rss"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/apache/host-your-own-rss-reader-with-tiny-tiny-rss-on-centos-7/']
published: 2017-03-30
modified: 2017-03-30
modified_by:
    name: Nick Brewer
title: 'Host Your Own RSS Reader with Tiny Tiny RSS on CentOS 7'
contributor:
  name: Tyler Langlois
  link: https://github.com/tylerjl
external_resources:
 - '[Tiny Tiny RSS Installation Notes](https://tt-rss.org/gitlab/fox/tt-rss/wikis/InstallationNotes)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr/>

[Tiny Tiny RSS](https://tt-rss.org/) (or tt-rss for short) is an open-source, self-hosted RSS reader that runs on PHP and a traditional SQL database. Running your own RSS aggregator puts you in control of your data, and Tiny Tiny RSS even supports [mobile apps](https://play.google.com/store/apps/details?id=org.ttrssreader) that connect to your server.

![Install Tiny Tiny RSS on CentOS 7](/docs/assets/host-your-own-rss-reader-with-tiny-tiny-rss-on-centos-7.png)

This guide will walk through the steps necessary to install and configure Tiny Tiny RSS on a Linode running CentOS 7, using MariaDB as the database and Apache as the web server.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Follow the steps in the [LAMP on CentOS 7](/docs/websites/lamp/lamp-on-centos-7) guide.

3.  Make sure your system is up to date:

        sudo yum update

## Preparing MySQL

1.  Connect to your MariaDB database as the root user:

        mysql -u root -p

2.  From the MariaDB shell, issue the following commands to create a new database and user for Tiny Tiny RSS. Replace **MyPassword** with a strong password:

    ~~~
    create database ttrss;
    grant all on ttrss.* to 'ttrss' identified by 'MyPassword';
    exit
    ~~~

## Preparing Apache

1.  Ensure that necessary PHP prerequisites are installed:

        sudo yum install -y php-mysql php-mbstring php-intl

2.  Add a configuration file under `/etc/httpd/conf.d/ttrss.conf` to secure the directories that Tiny Tiny RSS will use:

    {{< file "/etc/httpd/conf.d/ttrss.conf" aconf >}}
<Directory /var/www/html/cache>
    Require all denied
</Directory>

<Directory /var/www/html>
    <Files "config.php">
        Require all denied
    </Files>
</Directory>

{{< /file >}}


3.  Restart Apache to apply your changes:

        sudo systemctl restart httpd

## Install Tiny Tiny RSS

The recommended installation method for Tiny Tiny RSS is to clone the repository with `git`, as this simplifies the update process.

1.  Install `git`:

        sudo yum install -y git

2.  Clone the codebase into `/var/www/html`:

        sudo git clone https://tt-rss.org/git/tt-rss.git /var/www/html

    {{< note >}}
This command will clone tt-rss into the `/var/www/html` directory at the root, which means you will access the application at the root URL of your webserver (for example, at http://myserver).
If you would prefer to use Tiny Tiny RSS under a separate URL (for example, at http://myserver/tt-rss), you can change the directory indicated in the `git clone` command to `/var/www/html/tt-rss`.

If you decide to use a different location, note that you'll need to replace instances of `/var/www/html` in your Apache `ttrss.conf` file with the directory of your choosing.
{{< /note >}}

3.  Restart Apache to ensure that your changes have been applied:

        sudo systemctl restart httpd

## Configure Tiny Tiny RSS

At this point the application should be accessible under Apache. As an example, if your Linode had the IP address of `1.2.3.4`, browsing to `http://1.2.3.4` should result in the following screen:

![Tiny Tiny RSS Installation Page](/docs/assets/tiny-tiny-rss-install-page.png)

1.  Fill in the fields with the appropriate information:

    *   From the **Database type** dropdown, choose `MySQL`.
    *   Under **Username**, fill in `ttrss`.
    *   Under **Password**, fill in the password chosen when setting up the ttrss database in MariaDB/MySQL.
    *   Use `ttrss` as the Database name.
    *   The **Host name** and **Port** fields can be left blank.
    *   The **Tiny Tiny RSS URL** section should automatically populate with the correct IP address for your Linode. If you are accessing your Linode via a DNS name instead of an IP address, be sure update the field to reflect this.

2.  After filling in the fields, click **Test configuration** to perform a preliminary check of your setup. If everything is ready, click the **Initialize database** button.

    {{< note >}}
Initializing the database will wipe all data in the `ttrss` database.
If you are installing over a previous installation, perform any backups as necessary.
{{< /note >}}

3.  After the application initializes the MariaDB database, a message should appear warning you that TinyRSS cannot update `config.php` because the parent directory is not writeable. This is a *good* thing because any potential vulnerabilities in the web application cannot write files to disk. In order to finish configuring the application, follow the instructions to copy the full contents of the text box beginning with `<?php`, and paste them into `/var/www/html/config.php`.

    The following snippet shows what the first few lines of the file should look like:

      {{< file "/var/www/html/config.php" php >}}
<?php
// *******************************************
// *** Database configuration (important!) ***
// *******************************************

define('DB_TYPE', 'mysql');
............

{{< /file >}}


    If you need to customize your Tiny Tiny RSS configuration further (for example, if you have an SMTP server that you wish to use in conjunction with Tiny Tiny RSS to email you with feed news), you should do so by editing `config.php` now.

4.  Before using Tiny Tiny RSS, a few directory permissions must be changed so that Apache can write to them. The following commands will change only the necessary directories that require additional permissions:

        cd /var/www/html
        sudo chgrp -R apache cache lock feed-icons
        sudo chmod -R g+w cache lock feed-icons

5.  This command must be used to permit Apache to write to these directories on CentOS 7 systems with SELinux enabled. If SELinux has been disabled (check the output of the `sestatus` command if unsure), this step is not necessary:

        sudo chcon -R unconfined_u:object_r:httpd_sys_rw_content_t:s0 cache feed-icons lock

### Feed Updates

Now that Tiny Tiny RSS is up and running, create a systemd unit to automate the updating of your RSS feed. Create a file under `/etc/systemd/system/ttrss-updater.service` and copy the following information into it:

{{< file "/etc/systemd/system/ttrss-updater.service" ini >}}
[Unit]
Description=ttrss_backend
After=network.target mysql.service

[Service]
User=apache
ExecStart=/var/www/html/update_daemon2.php

[Install]
WantedBy=multi-user.target

{{< /file >}}


Start the service, and enable it to start at boot:

    sudo systemctl enable --now ttrss-updater

## Using the Application

1.  Browse to the URL of your server, which should render the Tiny Tiny RSS login page:

    ![Tiny Tiny RSS Login Page](/docs/assets/tiny-tiny-rss-login.png)

2.  Log in with the username `admin` and default password `password`.

3.  Change the administrator password to something stronger by clicking the **Actions** button in the top-right corner of the Tiny Tiny RSS main page. Select **Preferences**, then click the **Users** tab that appears. Click on the `admin` user and you'll see the following screen, with the option to change the user password:

    ![Tiny Tiny RSS User Editor](/docs/assets/ttrss-user-editor.png)

    Note that if you prefer to log in with a less privileged user, you can create additional users from the **Users** page, by clicking **Create user**.

At this point you can begin using Tiny Tiny RSS to subscribe to and read feeds. To get started, click on the **Actions** button (click *Exit preferences* if you are still in the preferences panel), and click the **Subscribe to feed...** link.
