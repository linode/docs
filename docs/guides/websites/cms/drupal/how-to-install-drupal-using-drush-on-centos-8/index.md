---
slug: how-to-install-drupal-using-drush-on-centos-8
author:
    name: Linode
    email: docs@linode.com
description: 'This guide will show you how to install the popular content management system Drupal on CentOS 8 using the Drush command line tool on CentOS 8..'
og_description: 'This guide will show you how to install the popular content management system Drupal on CentOS 8 using the Drush command line tool on CentOS 8.'
keywords: ["drupal", "cms", "content management system", "content management framework","drush", "centos"]
tags: ["drupal","centos","cms","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-29
modified_by:
    name: Linode
published: 2020-02-29
title: How to Install Drupal using Drush on CentOS 8
h1_title: Install Drupal using Drush on CentOS 8
relations:
    platform:
        key: how-to-install-drupal-drush
        keywords:
           - distribution: CentOS 8
image: InstallDrupalUsingDrushCentOS8.png
aliases: ['/websites/cms/drupal/drush-drupal/how-to-install-drupal-using-drush-on-centos-8/','/websites/cms/drupal/how-to-install-drupal-using-drush-on-centos-8/']
---
[Drupal](https://www.drupal.org/docs/8) is a content management system (CMS) designed for building custom websites for personal and business use. Built for high performance and scalability, Drupal provides the necessary tools to create rich, interactive “community” websites with forums, user blogs, and private messaging. Drupal also has support for personal publishing projects and can power podcasts, blogs, and knowledge-based systems, all within a single, unified platform.

[Drush](https://www.drush.org/) is a command line tool for creating, administrating, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/guides/set-up-and-secure/#configure-a-custom-hostname) and [timezone](/docs/guides/set-up-and-secure/#set-the-timezone).

1. Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account), [harden SSH access](/docs/guides/set-up-and-secure/#harden-ssh-access), [remove unnecessary network services](/docs/guides/set-up-and-secure/#remove-unused-network-facing-services) and [create firewall rules](/docs/guides/set-up-and-secure/#configure-a-firewall) for your web server; you may need to make additional firewall exceptions for your specific application.

    {{< content "limited-user-note-shortguide" >}}

1.  Install and configure a [LAMP stack on CentOS 8](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8)

1.  Install [Composer and Drush on CentOS 8](/docs/websites/cms/drupal/drush-drupal/how-to-install-drush-on-centos-8)

1.  Install the `wget` and `tar` utilities. You will need this in a later section to install the Drupal 8 core.

        sudo yum install wget -y && sudo yum install tar -y

1. In order to work with Drupal 8 and SELinux, you will need to install Python's policy core utilities, which give you access to useful tools to manage SELinux settings.

        sudo yum install policycoreutils-python-utils -y

## Download and Prepare Drupal 8

1. Navigate to your site's document root. If you installed and configured your Apache server using our [LAMP stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/) guide, your document root should be located in the `/var/www/html/example.com/public_html/` directory. Replace `example.com` with your own document root path's name.

        cd /var/www/html/example.com

1. Download the Drupal 8 tarball. As of writing this guide, Drupal 8.8.3 is the latest version. See [Drupal's download page](https://www.drupal.org/project/drupal) for their latest core tarball. Replace `8.8.3` with the version number you wish to download.

        sudo wget http://ftp.drupal.org/files/projects/drupal-8.8.3.tar.gz

    {{< caution >}}
Ensure that the version number matches the Drupal 8 version you wish to download.
{{< /caution >}}

1.  Extract the downloaded tarball's contents into your site's document root:

        sudo tar -zxvf drupal-8.*.tar.gz --strip-components=1 -C public_html

1.  Drupal depends on a PHP graphics library called GD. Install GD and other dependencies:

        sudo yum install -y php php-{cli,mysqlnd,json,opcache,xml,mbstring,gd,curl}

1. Create your Drupal 8 installation's `settings.php` file from the default settings file. This file will be configured when you run through Drupal's automated web configuration. See the [Install and Configure Drupal on CentOS 8](/docs/websites/cms/drupal/how-to-install-and-configure-drupal-on-centos-8/#drupal-first-start) guide for more details.

        sudo cp /var/www/html/example.com/public_html/sites/default/default.settings.php /var/www/html/example.com/public_html/sites/default/settings.php

1.  Enforce [trusted hostnames](https://www.drupal.org/node/2410395) with those that users will access your site from. With the text editor of your choice, edit your `settings.php` file replacing the [regular expression (RegEx)](https://www.php.net/manual/en/reference.pcre.pattern.syntax.php) with a pattern that matches your own site's URL(s).

    {{< file "/var/www/html/example.com/public_html/sites/default/settings.php" conf >}}
$settings['trusted_host_patterns'] = array(
  '^www\.example\.com$',
  '^example\.com$',
  );

{{< /file >}}


    {{< note >}}
`trusted_host_patterns` also accepts IP addresses or localhost.
{{< /note >}}

## Configure Apache 2.4

1.  Enable Apache's [rewrite module](https://httpd.apache.org/docs/current/mod/mod_rewrite.html). This module is necessary since Drupal 8 enables [Clean URLs](https://www.drupal.org/getting-started/clean-urls) by default. To enable this module, edit your Apache configuration to include the `LoadModule` line displayed in the example file below.

    {{< file "/etc/httpd/conf/httpd.conf" apache >}}
LoadModule rewrite_module modules/mod_rewrite.so
    {{</ file >}}

2.  Specify the rewrite conditions for your Drupal site's document root in Apache's configuration file using the text editor of your choice. If you installed and configured your Apache server using [LAMP stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/) guide, the configuration file for your site is located at `/etc/httpd/conf.d/example.com.conf`.

    {{< file "/etc/httpd/sites-enabled/example.com.conf" conf >}}
<Directory /var/www/html/example.com/public_html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
      RewriteEngine on
      RewriteBase /
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule ^(.*)$ index.php?q=$1 [L,QSA]
</Directory>
{{< /file >}}

1. Set the SELinux context for your site's directories in order to read and write to them. This includes your site's root directory and subdirectories.

        sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/html/example.com/public_html(/.*)?"
        sudo chcon -Rt public_content_rw_t /var/www/html/example.com/public_html/sites/default/files
        sudo setsebool -P allow_httpd_anon_write=1

1.  Change the ownership of your site's document root from `root` to `apache`. This allows you to install modules and themes, and to update Drupal, without being prompted for FTP credentials.

        sudo chown apache:apache -R /var/www/html/example.com/public_html

1.  Restart Apache so all your changes are applied.

        sudo systemctl restart httpd


### Create a Drupal Website with Drush

In this section, you will use [Drush](https://www.drush.org/) to install a Drupal site with just a few commands.

1.  Change the working directory to the location of your new Drupal website. The previous guides created a `/var/www/html/example.com/public_html` directory, where `public_html` is the document root or the publicly viewable directory. Replace `example.com` with your own site's name.

        cd  /var/www/html/example.com/public_html

1.  Your Linode is now ready for you to install a Drupal site. In the command below, replace `mysql://username:password@localhost/databasename` with your own site's username, password, and database. For example, if you followed the [How to Install a LAMP stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/) your username is `webuser`, password is `password`, and the database is `webdata`. Also, replace `--site-name=example.com` with your own website's name.

        drush si standard --db-url=mysql://username:password@localhost/databasename --site-name=example.com

    {{< note >}}
Although MySQL accepts passwords with a special character, for example an exclamation point, the `drush si standard` command does not. If you have a special character in your MySQL password, you may need to change it.
    {{< /note >}}

    {{< note >}}
If you encounter errors related to writing to the `sites/default` directory, follow the steps in the [Setting the Site's Ownership and Permissions](#setting-the-site-s-ownership-and-permissions) section to ensure the web server belongs to the current user's group.
    {{</ note >}}

    After the installation is complete, Drush creates a user, named `admin`, and a random password. An example is pictured below. These credentials are used for the Drupal sign-in page.


    ![Drush Username Password](drush-username-password.png)

1.  Optionally, if you'd like to change the admin's password, it is best to do so with Drush, rather than sending the password over a non-secure HTTP connection. To update the admin password execute the following command and replace `newpass` with your new password:

        sudo drush user-password admin user-password=newpass

### Setting the Site's Ownership and Permissions

In server administration, there are many options for user and group permissions. The directions below create a site owner and a site owner's group. The site owner will be added to the Apache web server's group, named `apache`. Then, read, write, and execute permissions are granted to the `apache` user and group.

1. To create a new user for the site owner position, see the [Add a Limited User Account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) section of the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide.

1.  From the `public_html` directory, change ownership of the site to the `apache` user and group.

        sudo chown -R apache:apache sites/default

2.  Add the `example_user` to the `apache` group:

        sudo usermod -a -G apache example_user

4.  Make sure the permissions are set to allow access for the site owner and site owner's group. Replace `example.com` with your own domain name.

        sudo chmod 774 -R /var/www/html/example.com/public_html

    Now, `apache`, `example_user`, and any user within the `apache` group has read, write, and execute permissions for the entire Drupal site directory tree.

3.  Restart Apache:

        sudo systemctl restart httpd

5.  Finally, check the status of the new site:

        drush status

    {{< note >}}
When installing new files, like a module or theme, make sure the Apache user has access rights. Use the command `ls -al` to list the file permissions within a directory to determine which permissions are assigned to it.
    {{</ note  >}}

Navigate to your site's domain (or IP address if you did not set up a domain name). Sign-in with the generated username and password to begin [creating content](https://www.drupal.org/docs/8/administering-a-drupal-8-site/managing-content) for your Drupal site.

## Additional Options

There are many ways to set up administration for a website. Below are sections explaining some additional options. It's important to be aware of multi-site setups and additional security measures. The topics below touch on these subjects.

### File Ownership, Permissions, and Security

The above setup is designed for ease of use. However, there are setups designed for tighter security and other considerations.

- To design your own setup, read Linode's documentation on [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide
- For an extremely secure setup, read Drupal's [Securing File Permissions and Ownership](https://www.drupal.org/node/244924) guide

### Multi-site Servers

At a high-level, the steps you will need to follow to begin configuring a Drupal multisite set up are:

- Add a new [MySQL user, password, and database](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/#mysql)
- Create a new [Apache virtual hosts file and corresponding directories](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/#virtual-hosts)
- See [Drupal's Multisite documentation](https://www.drupal.org/docs/8/multisite/drupal-8-multisite) for more details.
