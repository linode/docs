---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Track development bugs and coordinate with team members using Mantis bug tracker on CentOS 5.'
keywords: ["mantis", "mantis fedora", "mantis linux", "bug tracker", "development"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/mantis/centos-5/','applications/development/manage-development-with-the-mantis-bug-tracker-on-centos-5/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2011-04-05
title: Manage Development with the Mantis Bug Tracker on CentOS 5
external_resources:
 - '[MantisBT Website](http://www.mantisbt.org/)'
 - '[MantisBT Plugin Page](http://deboutv.free.fr/mantis/)'
 - '[MantisBT Wiki](http://www.mantisbt.org/wiki/doku.php)'
 - '[MantisBT Administration Guide](http://www.mantisbt.org/manual/)'
---

Mantis Bug Tracker (commonly referred to as MantisBT) is a free web-based bug tracking system. Mantis offers many of the same capabilities as other trackers like Bugzilla, but is simpler and easy to set up.

Before beginning this guide, we assume that you've completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend considering the [beginner's guide](/docs/beginners-guide/) and the article concerning [systems administration basics](/docs/using-linux/administration-basics). Additionally, you'll need to have followed the [LAMP guide for CentOS 5](/content/lamp-guides/centos-5/) and be able to [send email from your Linode](/content/tools-reference/linux-system-administration-basics/#send-email-from-your-server) if you don't already have a means of sending mail from your server.

## Installing Prerequisites

Before we begin installing Mantis, we'll need to install PHPMailer, an additional PHP library that allows Mantis to send email via PHP. The PHPMailer packages are not available in the standard CentOS repositories. As a result, "[EPEL](https://fedoraproject.org/wiki/EPEL)" must be installed in order to install PHPMailer. EPEL, or "Extra Packages for Enterprise Linux", is a product of the Fedora Project that attempts to provide current versions of software packages that may not be available in the CentOS repositories. Enable EPEL with the following commands:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm
    yum update

Once the EPEL repository has been added install PHPMailer by running:

    yum install php-PHPMailer

Before restarting Apache, modify your `php.ini` file to match MantisBT's upload file size. Find the following line in your `php.ini` file and tweak it to match the example below:

{{< file "/etc/php.ini" ini >}}
; Maximum allowed size for uploaded files.
upload_max_filesize = 5M

{{< /file >}}


Afterwards, restart Apache by running the following command:

    service httpd restart

## Installing Mantis

For this installation, we'll assume you're installing Mantis to a directory under your document root (in this example the directory is named `Mantis`). To begin, we'll change into the site directory, download the latest MantisBT package, and unpack it. When running the following commands, be sure to download the latest release. You can find the latest version of MantisBT on the [SourceForge page for MantisBT](http://sourceforge.net/projects/mantisbt/files/). Additionally, replace `example.com` with the name of your site:

    cd /srv/www/example.com/
    wget http://downloads.sourceforge.net/project/mantisbt/mantis-stable/1.2.4/mantisbt-1.2.4.tar.gz
    tar xvzf mantisbt-1.2.4.tar.gz

Next, we'll move the `mantisbt-1.2.4` directory to our `public_html` directory under the name `mantis`. Additionally, we'll give Apache ownership in order to create the needed configuration files:

    mv mantisbt-1.2.4/ /srv/www/example.com/public_html/mantis
    chown -R apache:apache /srv/www/example.com/public_html/mantis/

Visit the location of MantisBT in your browser. In our first example, the URL would be `http://example.com/mantis`. Follow the installation instructions by providing the credentials to the MySQL database you created in the LAMP guide, or especially for Mantis. For additional MySQL help, see our [MySQL guide](/docs/databases/mysql/fedora-13). At this point Mantis is installed and ready to configure.

## Configuring Mantis

After the installation completes, you will be redirected to the login page. The default account credentials are `administrator/root`. Immediately log in and create another administrative account, and delete the default `administrator` account. You can manage users in the `"Manage"` section of the MantisBT interface.

Next, we'll set the timezone in `config_inc.php`. You can find a list of supported timezones at the [List of Supported Timezones in the PHP Manual](http://php.net/manual/en/timezones.php) page. You'll need to add the `$g_default_timezone` line yourself. This section of the files should look similar to the following:

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


Ensure that you have no whitespace at the end of this file, or Mantis will throw an error. Save and close the file. Finally, make sure to remove the `admin` folder under your MantisBT installation. In our example, the command would look like the following command. Note: Make sure to double-check your syntax when using the `rm -rf` command:

    rm -rf /srv/www/example.com/public_html/mantis/admin/

At this point, MantisBT is ready to use for your development project! For specific Mantis help and instruction, see the [administration guide](http://www.mantisbt.org/manual/) available on the MantisBT website. You can also install a number of plugins that allow you to customize MantisBT to your needs. Each of these plugins has a specific set of instructions that come with it. You can read more about these on the plugins section of the MantisBT site, listed below.

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the Mantis project blog, development list, and announcement list to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Mantis Blog](http://www.mantisbt.org/blog/)
-   [Maitis Development List](https://lists.sourceforge.net/lists/listinfo/mantisbt-dev)
-   [Mantis Announcement List](https://lists.sourceforge.net/lists/listinfo/mantisbt-announce)

When upstream sources offer new releases, repeat the instructions for installing the Mantis software as needed. These practices are crucial for the ongoing security and functioning of your system.
