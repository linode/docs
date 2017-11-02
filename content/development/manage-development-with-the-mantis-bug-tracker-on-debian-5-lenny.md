---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Track development bugs and coordinate with team members using Mantis bug tracker on Debian 5 (Lenny).'
keywords: ["mantis", "mantis debian", "mantis linux", "bug tracker", "development"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/mantis/debian-5-lenny/','applications/development/manage-development-with-the-mantis-bug-tracker-on-debian-5-lenny/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-02-16
title: 'Manage Development with the Mantis Bug Tracker on Debian 5 (Lenny)'
---

Mantis Bug Tracker (commonly referred to as MantisBT) is a free web-based bug tracking system. Mantis offers many of the same capabilities as other trackers like Bugzilla, but is simpler and easy to set up.

Before beginning this guide, we assume that you've completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend considering the [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics). Additionally, you'll need to have followed both the [LAMP guide for Debian Lenny](/docs/lamp-guides/debian-5-lenny/) as well as the [Exim guide](/docs/email/exim/send-only-mta-debian-5-lenny) if you don't already have a means of sending mail from your server.

Installing Prerequisites
------------------------

Before we begin installing Mantis, we'll need to install PHPMailer, an additional PHP library that allows Mantis to send email via PHP. Install this package using the following command:

    apt-get install libphp-phpmailer

Before restarting Apache, modify your `php.ini` file to match MantisBT's upload file size. Find the following line in your `php.ini` file and tweak it to match the example below:

{{< file "/etc/php5/apache2/php.ini" ini >}}
; Maximum allowed size for uploaded files.
upload_max_filesize = 5M

{{< /file >}}


Afterwards, restart Apache by running the following command:

    /etc/init.d/apache2 restart

Installing Mantis
-----------------

For this installation, you will install Mantis to a directory under the document root (in this example the directory is named `Mantis`) for your server. To begin, change to the site directory, download the latest MantisBT package, and unpack it. When running the following commands, be sure to download the latest release. You can find the latest version of MantisBT on the [SourceForge page for MantisBT](http://sourceforge.net/projects/mantisbt/files/). Additionally, replace `example.com` with the name of your site:

    cd /srv/www/example.com/
    wget http://downloads.sourceforge.net/project/mantisbt/mantis-stable/1.2.3/mantisbt-1.2.3.tar.gz
    tar zxvf mantisbt-1.2.3.tar.gz

Next, move the `mantisbt-1.2.1` directory to the `public_html` directory under the name `mantis`. Additionally, modify the permissions and ownership of Mantis to enable the proper files to be modified and executed by the web server:

    mv mantisbt-1.2.3/ /srv/www/example.com/public_html/mantis
    chown -R root:root /srv/www/example.com/public_html/mantis/
    chmod -R 755 /srv/www/example.com/public_html/mantis/
    chmod 777 /srv/www/example.com/public_html/mantis/

Visit the location of MantisBT in your browser. In this example, the URL would be `http://example.com/mantis`. Follow the installation instructions by providing the credentials to the MySQL database you created in the LAMP guide, or especially for Mantis. For additional information regarding MySQL, see the [MySQL guide](/docs/databases/mysql/debian-5-lenny). At this point Mantis is installed and ready to configure.

Configuring Mantis
------------------

After the installation completes, you will be redirected to the login page. The default account credentials are `administrator/root`. Immediately log in and create another administrative account, and delete the default `administrator` account. You can manage users in the `"Manage"` section of the MantisBT interface.

Next, set the timezone in `config_inc.php`. You can find a list of supported timezones at the [List of Supported Timezones in the PHP Manual](http://php.net/manual/en/timezones.php) page. You'll need to add the `$g_default_timezone` line yourself. This section of the files should look similar to the following:

{{< file "/srv/www/example.com/public\\_html/mantis/config\\_inc.php" php >}}
<?php
    $g_hostname = 'localhost';
    $g_db_type = 'mysql';
    $g_database_name = 'mantis';
    $g_db_username = 'mantisuser';
    $g_db_password = 'p@$$w0rd';

    # You can add this at the end of the file
    $g_default_timezone = 'America/New_York';
?>

{{< /file >}}


Ensure that you have no whitespace at the end of this file, or Mantis will throw an error. Save and close the file. Finally, make sure to remove the `admin` folder under your MantisBT installation and reset the permissions as follows. In our example, the command would resemble the following. Note: Make sure to double-check your syntax when using the `rm -rf` command:

    rm -rf /srv/www/example.com/public_html/mantis/admin/
    chmod 755 /srv/www/example.com/public_html/mantis/

At this point, MantisBT is ready to use for your development project! For specific Mantis help and instruction, see the [administration guide](http://www.mantisbt.org/manual/) available on the MantisBT website. You can also install a number of plugins that allow you to customize MantisBT to your needs. Each of these plugins has a specific set of instructions that come with it. You can read more about these on the plugins section of the MantisBT site, listed below.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the Mantis project blog, development list, and announcement list to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Mantis Blog](http://www.mantisbt.org/blog/)
-   [Maitis Development List](https://lists.sourceforge.net/lists/listinfo/mantisbt-dev)
-   [Mantis Announcement List](https://lists.sourceforge.net/lists/listinfo/mantisbt-announce)

When upstream sources offer new releases, repeat the instructions for installing the Mantis software as needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [MantisBT Website](http://www.mantisbt.org/)
- [MantisBT Plugin Page](http://deboutv.free.fr/mantis/)
- [MantisBT Wiki](http://www.mantisbt.org/wiki/doku.php)
- [MantisBT Administration Guide](http://www.mantisbt.org/manual/)



