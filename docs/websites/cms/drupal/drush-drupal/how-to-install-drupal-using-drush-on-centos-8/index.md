---
author:
    name: Linode
    email: docs@linode.com
description: 'Drupal 8 is the lastest version of the popular Drupal content management system. This guide will show you how to install, configure, and optimize the Drupal CMS on your Linode so you can begin developing your own websites.'
keywords: ["drupal", "WordPress", "joomla", "cms", "content management system", "content management framework", "drush", "ubuntu", "centos"]
aliases: ['websites/cms/drush-drupal/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-29
modified_by:
    name: Linode
published: 2020-02-29
title: How to Install Drupal using Drush on CentOS 8
h1_title: Install Drupal using Drush on CentOS 8
---


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1. Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services) and [create firewall rules](/docs/security/securing-your-server/#configure-a-firewall) for your web server; you may need to make additional firewall exceptions for your specific application.

    {{< content "limited-user-note-shortguide" >}}

1.  Install and configure a [LAMP stack on CentOS 8](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8)

1.  Install [Composer and Drush on CentOS 8](/docs/websites/cms/drupal/drush-drupal/how-to-install-drush-on-centos-8)

1.  Install the `wget` and `tar` utilities. You will need this in a later section to install the Drupal 8 core.

        sudo yum install wget -y && sudo yum install tar

1. In order to work with Drupal 8 and SELinux, you will need to install Python's policy core utilities, which give you access to useful tools to manage SELinux settings.

        sudo yum install policycoreutils-python-utils

## Download and Prepare Drupal 8

1. Navigate to your site's document root. If you installed and configured your Apache server using our [LAMP stack on CentOS 8](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8/) guide, your document root should be located in the `/var/www/html/example.com/public_html/` directory. Replace `example.com` with your own document root path's name.

        cd /var/www/html/example.com

1. Download the Drupal 8 tarball. As of writing this guide, Drupal 8.8.2 is the latest version. See [Drupal's download page](https://www.drupal.org/project/drupal) for their latest core tarball.

        sudo wget http://ftp.drupal.org/files/projects/drupal-8.8.2.tar.gz

    {{< caution >}}
Ensure that the version number matches the Drupal 8 version you wish to download.
{{< /caution >}}

1.  Extract the downloaded tarball's contents into your site's document root:

        sudo tar -zxvf drupal-8.*.tar.gz --strip-components=1 -C public_html

1.  Drupal depends on a PHP graphics library called GD. Install GD and other dependencies:

        sudo yum install -y php php-{cli,mysqlnd,json,opcache,xml,mbstring,gd,curl}

1. Create your Drupal 8 installation's `settings.php` file from the default settings file. This file will be configured when you run through Drupal's web configuration in the [Drupal First Start](#drupal-first-start) section.

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

2.  Specify the rewrite conditions for your Drupal site's document root in Apache's configuration file using the text editor of your choice. If you installed and configured your Apache server using [LAMP stack on CentOS 8](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8/) guide, the configuration file for your site is located at `/etc/httpd/conf.d/example.com.conf`.

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

1. Set the SELinux context for the directories Drupal 8 and Apache in order to read and write to them. This includes your site's root directory and subdirectories.

        sudo semanage fcontext -a -t httpd_sys_rw_content_t "/var/www/html/example.com/public_html(/.*)?"

1.  Change the ownership of your site's document root from `root` to `apache`. This allows you to install modules and themes, and to update Drupal, without being prompted for FTP credentials.

        sudo chown apache:apache -R /var/www/html/example.com/public_html

1.  Restart Apache so all your changes are applied.

        sudo systemctl restart httpd


### Create a Drupal Website with Drush

Drush can install a Drupal site with just a few commands.

1.  Change the working directory to the location of the new website. The previous guides created a **/var/www/html/`example.com`/public_html** directory, replacing **`example.com`**, and made **`public_html`** the document root or the publicly viewable directory.

        cd  /var/www/html/example.com/public_html

2.  Now the server is ready for the installation of a Drupal site. Below, provide a MySQL username, password, and database in the mysql://`username`:`password`@localhost/`databasename` link option and the site's name in the --site-name=`example.com` option:

        sudo drush si standard --db-url=mysql://username:password@localhost/databasename --site-name=example.com


    {{< note >}}
Although MySQL accepts passwords with a special character, for example an exclamation point, the `drush si standard` command does not. If you have a special character in your MySQL password, you may need to change it.
{{< /note >}}

    After installation is complete, Drush creates a user, named `admin`, and a random password. An example is pictured below. These credentials are used for the Drupal sign-in page.


    ![Drush Username Password](drush-username-password.png)

8.  Optionally, if you'd like to change the admin's password, we recommend you do so with Drush, rather than sending the password over a non-secure HTTP connection. In the following command, replace `newpass` with your new password:

        sudo drush user-password admin user-password=newpass

### Setting the Site's Ownership and Permissions

In server administration, there are many options for user and group permissions. The directions below create a site owner and a site owner's group. The Apache user, named **apache**, is added to the site owner's group. Then read, write, and execute permissions are granted to both the site owner and the site owner's group.

To create a new user for the site owner position, review the [Securing Your Server](/docs/security/securing-your-server#add-a-limited-user-account) guide.

1.  From the `public_html` directory, change ownership of the site to the chosen owner and that owner's group. Replace `exampleuser` below with the chosen owner's username:

        sudo chown -R example:exampleuser .

2.  Add Apache's **apache** user to the site owner's group:

        sudo usermod -a -G exampleuser apache

3.  Restart Apache:

        sudo service httpd restart

3.  Make sure the permissions are set to allow access for the site owner and site owner's group:

        sudo chmod -R 770 .

    Now, **apache**, **exampleuser**, and any user within the exampleuser group has read, write, and execute permissions for the entire Drupal site directory tree.

4.  Finally, check the status of the new site:

        drush status

    {{< caution >}}
File permissions are a constant concern for the system owner or root user. When installing new files, like a module or theme, make sure the Apache user apache has access rights. Use the command `ls -al` to list the file permissions within a directory.
{{< /caution >}}

Your site is now available at **`example.com`** or **`ipaddress`**. Sign-in with the generated username and password and start delivering content to the world!

## Additional Options

There are many ways to set up administration for a website. Below are sections explaining some additional options. It's important to be aware of multi-site setups and additional security measures. The topics below touch on these subjects.

### File Ownership, Permissions, and Security

The above setup is designed for ease of use. However, there are setups designed for tighter security and other considerations.

- To design your own setup, read Linode's documentation on [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide
- For an extremely secure setup, read Drupal's [Securing File Permissions and Ownership](https://www.drupal.org/node/244924) guide

### Multi-site Servers

To start, add a virtual host file with Apache. Next, build another site including the appropriate MySQL, PHP, and CMS configurations.

- To add a virtual host file, read Linode's [Configure Name-based Virtual Hosts](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8/#configure-name-based-virtual-hosts) guide
