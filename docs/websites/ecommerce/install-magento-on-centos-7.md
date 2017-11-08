---
author:
  name: Linode
  email: docs@linode.com
description: 'Install Magento Community Edition on CentOS 7 to manage your e-commerce site.'
keywords: ["magento", "centos", "e-commerce", "magento centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-12-28
modified_by:
  name: Phil Zona
published: 2016-12-28
title: Install Magento on CentOS 7
external_resources:
 - '[Magento Documentation](http://docs.magento.com/m2/ce/user_guide/getting-started.html)'
 - '[Magento Resources Library](https://magento.com/resources)'
---

In this guide you'll learn how to install Magento on CentOS 7. Magento Community Edition (CE) is a free, open-source e-commerce platform. It's one of the most popular solutions for self-hosted online stores due to its simple yet powerful admin panel and large developer community.

![Install Magento on CentOS 7](/docs/assets/install-magento-centos-title.png "Install Magento on CentOS 7")

Considering the resources some Magento plugins demand, we strongly recommend that you have at least a **Linode 4GB**. You'll need to allocate up to 2GB of memory for PHP and Magento to use; running Magento on a smaller Linode may result in server crashes or unreliability under medium to heavy traffic. For more memory-intensive Magento setups, we recommend using a [high memory Linode](https://www.linode.com/pricing#high-memory).

{{< note >}}
This guide explains how to install the latest Magento release at the time of publication. For the Community Edition, this will be version 2.1.x. If you plan to use data, themes and extensions from an older Magento site, be sure to check for compatibility issues between the two versions since not everything may function as it did in older releases.
{{< /note >}}

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Magento runs on a LAMP stack, and this guide assumes you have already installed and configured Apache. If you haven't, refer to our [Apache on CentOS 7](/docs/websites/apache/install-and-configure-apache-on-centos-7) guide. However, do not install MariaDB or PHP. We will explain how to install compatible versions of those packages in this guide.

3.  Update your system:

        sudo yum update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prepare Your Server for Magento

The LAMP stack serves as the basis for a Magento site, but its component parts need to be configured a bit more before installing the Magento software. In this section, we'll explain how to add some extra settings to Apache as well as how to install MySQL 5.7 and PHP 7.

### Configure Apache

Since Magento will be served by Apache, some additional configuration is needed to ensure the application is served properly. In this section, we'll configure Apache for Magento to ensure that styles and other settings display properly in your storefront.

1.  Be sure you're using Apache version 2.4:

        httpd -v

    If this shows version 2.2 or another version, upgrade your packages before proceeding.

2.  Modify the virtual host file for your Magento site to resemble the example below. If you have not previously created a virtual host file, do so now and refer to our [Apache on CentOS 7](/docs/websites/apache/install-and-configure-apache-on-centos-7) guide for additional guidance.

    {{< file-excerpt "/etc/httpd/conf.d/vhost.conf" aconf >}}
<Directory /var/www/html/example.com/public_html>
    Require all granted
</Directory>
<VirtualHost *:80>
    ServerName example.com
    ServerAlias www.example.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/example.com/public_html

    ErrorLog /var/www/html/example.com/logs/error.log
    CustomLog /var/www/html/example.com/logs/access.log combined

    <Directory /var/www/html/example.com/public_html>
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
    </Directory>

		</VirtualHost>

{{< /file-excerpt >}}


    The `Directory` block inside the `Virtual Host` block should point to the directory where you plan to install Magento. For simplicity, we will be installing it in our web root, but if you want to put it elsewhere (e.g., a subdirectory of your web root), then modify this setting.

    It's important to note the value of `AllowOverride` as this affects which settings in each directory's `.htaccess` file will apply and which will be ignored. If you're not sure if the `All` option is optimal for your site, refer to the [Apache documentation](http://httpd.apache.org/docs/current/mod/core.html#allowoverride) for more information on this setting.

3.  Restart Apache to apply these changes:

        sudo systemctl restart httpd

### Install MySQL and Create a Database and User

As of this guide's publication, Magento 2 is not compatible with MariaDB, which is normally an equivalent replacement for MySQL in CentOS 7. Instead, we'll install MySQL 5.7 from a separate repository.

1.  Download and install the MySQL RPM:

        sudo wget http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm -P /tmp/
        sudo yum localinstall /tmp/mysql57-community-release-el7-7.noarch.rpm
        sudo yum update
        sudo yum install mysql-community-server

2.  Start the MySQL daemon:

        sudo systemctl start mysqld

3.  When starting MySQL for the first time, a temporary password is generated for root access to the database. Use `grep` to find it in the log file:

        sudo grep 'temporary password' /var/log/mysqld.log

    {{< note >}}
If you previously installed MariaDB or MySQL and set a root password, this installation may not override your existing database credentials. If that's the case, use the root password you set previously.
{{< /note >}}

4.  Secure your MySQL installation and change the root password with the `mysql_secure_installation` script:

        mysql_secure_installation

5.  Log into the MySQL shell as the root user, entering your new password when prompted:

        mysql -u root -p

6.  Create a Magento database and user, and set the permissions. In this example, we'll call our database and user `magento`, Replace `P@ssword1` with a secure password. You may optionally replace the other values as well:

        CREATE DATABASE magento;
        CREATE USER 'magento' IDENTIFIED BY 'P@ssword1';
        GRANT ALL PRIVILEGES ON magento.* TO 'magento';

    This section assumes that your database is hosted on the same server as your Magento application. If this is not the case, perform these steps and then refer to Magento's guide on using a [remote database server](http://devdocs.magento.com/guides/v2.0/install-gde/prereq/mysql_remote.html).

    {{< note >}}
You may receive an error about the complexity of your password if it is not secure enough. By default, CentOS 7 enables the `validate-password` plugin for MySQL. For more information, refer to the official [MySQL documentation](https://dev.mysql.com/doc/refman/5.7/en/validate-password-plugin.html).

Don't use an exclamation point (`!`) in your password. The Magento installation script does not parse them correctly in its command options.
{{< /note >}}

7.  Exit the MySQL shell:

        quit

### Install and Configure PHP 7

Magento is a PHP application, so you will need to install PHP 7 and make some adjustments to its settings.

1.  CentOS 7's default repositories include PHP 5.4, which is not compatible with Magento 2. Install the *IUS* (Inline with Upstream Stable) repository to get PHP 7:

        sudo wget http://dl.iuscommunity.org/pub/ius/stable/CentOS/7/x86_64/ius-release-1.0-14.ius.centos7.noarch.rpm -P /tmp
        sudo yum localinstall /tmp/ius-release-1.0-14.ius.centos7.noarch.rpm
        sudo yum update

2.  Install PHP 7 and its required extensions from the IUS repository:

        sudo yum install php70u php70u-pdo php70u-mysqlnd php70u-opcache php70u-xml php70u-mcrypt php70u-gd php70u-devel php70u-mysql php70u-intl php70u-mbstring php70u-json php70u-iconv

3.  Modify the following settings in your `php.ini` file:

    {{< file-excerpt "/etc/php.ini" >}}
max_input_time = 30
memory_limit= 2G
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
date.timezone = America/New_York
{{< /file-excerpt >}}

This sets the time zone for PHP's `date()` function and imposes a 2GB limit to the amount of memory PHP can use. This value is recommended for a 4GB Linode, but could be increased for a larger server.

{{< note >}}
The value for `date.timezone` will vary based on your system's time zone. Refer to the [PHP time zone documentation](http://php.net/manual/en/timezones.php) and ensure this value matches the time zone you set when you configured your Linode.
{{< /note >}}

4.  Create the log directory for PHP and give the Apache user ownership:

    sudo mkdir /var/log/php
    sudo chown apache /var/log/php

5.  Because you installed a PHP module for Apache in Step 2, restart the web server to apply the changes and allow Apache to serve PHP pages:

    sudo systemctl restart httpd

6.  **Optional**: You may want to take this opportunity to create a `phpinfo.php` page to ensure that PHP is active and working properly with Apache:

    {{< file >}}
/var/www/html/example.com/public_html/phpinfo.php
:
{{< /file >}}

    {{< file-excerpt "/var/www/html/example.com/public_html/phpinfo.php" php >}}
<?php phpinfo(); ?>
{{< /file-excerpt >}}

    Once you've visited this page in your browser and confirmed that PHP is working, delete the test page.

## Install Magento

### Download Magento Community Edition

In this section, we'll explain how to get the Magento Community Edition (CE) software on your Linode. There are several ways to do this, but here we'll cover the simplest method.

1.  On your local computer, download a copy of Magento from their [official website](https://www.magentocommerce.com/download). Several versions are available, but we recommend downloading the latest release. As of this writing, the latest version is 2.1.2:

    ![The Magento download screen](/docs/assets/magento-download-screen.png)

    Next to your selected version, there will be a dropdown menu that says "Select your format." Choose the option ending with the `.tar.gz` extension and click **Download**. Be sure to note where you saved the downloaded file.

    ![Select the option ending in ".tar.gz"](/docs/assets/magento-tar-gz.png)

    In this step, you'll also be able to download the software with optional sample data. Whether you choose this or the basic version is up to you.

    {{< note >}}
When choosing a version, refer to Magento's [prerequisites](http://devdocs.magento.com/guides/v2.0/install-gde/prereq/prereq-overview.html) to ensure a particular version's compatibility with the components of your LAMP stack. As of this writing, Magento version 2.1.2 is compatible with all package versions covered in this guide.
{{< /note >}}

2.  From your local computer, copy the file to your Linode. Replace `/path/on/local/` with the path of your downloaded file, `user` with your standard user account on your Linode, and `yourhost` with your Linode's hostname or IP address:

        scp /path/on/local/Magento-CE-2.*.tar.gz user@yourhost:~/

    Alternatively, you can use an FTP client, like [Filezilla](/docs/tools-reference/file-transfer/filezilla), if you're running Windows or are otherwise unable to use a command-line tool like `scp`.

3.  Log into your Linode via SSH as your standard user account. Navigate to the document root you specified in your virtual host file:

        cd /var/www/html/example.com/public_html

    Extracting the archive directly into your webroot, as you'll do in the next step, will make it accessible as the main page on your domain. For instance, if your domain is `example.com`, the Magento storefront will display when you visit `example.com` in your browser.

    If you want to run a Magento store as a subsection of your site, move and extract the archive in a directory within your webroot. For instance, if you intend to make your site accessible by visiting `example.com/store`, create the subdirectory `/var/www/html/example.com/public_html/store` and navigate to that directory before proceeding to the next step.

4.  Move the Magento archive into your document root and extract its contents:

        sudo mv ~/Magento-CE-2.*.tar.gz .
        sudo tar -xvf Magento-CE-2.*.tar.gz

### Configure Users and Permissions

1.  Create a Magento user, which will run the software. For simplicity, call this user `magento`:

        sudo useradd magento

2.  Next, add the Magento user to the web server's user group. For Apache, the default user is `apache`:

        sudo usermod -g apache magento

3.  The commands in this step should be run from your Magento installation directory (where you extracted the archive). If you are not still in that directory, navigate there before proceeding.

    Run these commands in order:

        sudo find var vendor pub/static pub/media app/etc -type f -exec chmod g+w {} \;
        sudo find var vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} \;
        sudo chown -R magento:apache .
        sudo chmod u+x bin/magento

    This allows your `magento` user (and members of the `apache` group) to write to the various files they need to run and serve Magento on your site.

    {{< note >}}
The first two commands may take some time to run because they are matching various files and directories in your installation folder. It may appear that the system is inactive, but be sure to allow a couple minutes before cancelling the operations. You can always start a new SSH connection, or run these commands in a [screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session, and use tools like [htop & iotop](/docs/uptime/monitoring/top-htop-iotop#additional-top-like-programs) to monitor progress.
{{< /note >}}

4.  Restart Apache:

        sudo systemctl restart httpd

### Install Magento CE

1.  Switch to the `magento` user and navigate to the `bin` directory in your Magento installation folder:

        sudo su magento
        cd bin

2.  Run the Magento installation script with the following options:

        ./magento setup:install --admin-firstname="John" --admin-lastname="Doe" --admin-email="your@email.com" --admin-user="john" --admin-password="password1" --db-name="magento" --db-host="localhost" --db-user="magento" --db-password="P@ssword1"

    Replace the values in the options as follows:

    -   **admin-firstname** / **admin-lastname** - This will set the full name of your admin user. Replace these with your name if you'll be the administrator.
    -   **admin-email** - This is your email for resetting passwords and receiving admin notifications.
    -   **admin-user** / **admin-password** - These are your login credentials for the Magento admin control panel. Be sure to set a secure password here and store it in a safe place. Note that the Magento script requires you to use both letter and number characters in your password, and will return an error if you do not.
    -   **db-name** - This is the name of the database you set up in MySQL. In our example, we called it `magento`, but if you chose a different value, substitute it here.
    -   **db-host** - If you're running Magento on the same server as its database, use `localhost` here. If not, this value will be the hostname of the server on which your database lives.
    -   **db-user** - This is the MySQL database user you set up previously. In our example, we called it `magento` but if you chose a different name, use that here instead.
    -   **db-password** - This will be the password you configured for the `magento` MySQL user.

    {{< note >}}
These are just a few of the available options to configure your Magento installation. For more information, refer to the [Magento Installation Guide](http://devdocs.magento.com/guides/v2.1/install-gde/install/cli/install-cli-install.html) and feel free to use additional options when running the script.
{{< /note >}}

3.  The installation script may take several minutes to run. Once it's finished, you'll see a success message:

        [SUCCESS]: Magento installation complete.
        [SUCCESS]: Magento Admin URI: /admin_a61e40

4.  Exit from the `magento` user:

        exit

Congratulations, you've successfully installed Magento on your Linode! You can log into your admin panel by entering your domain, followed by the "Magento Admin URI" displayed above, in a web browser. The **admin-user** and **admin-password** options you specified when running the installation script will be your credentials.

## Configure Magento

The dashboard is functional at this point, but you've still got work to do before the site is ready to use. In this section, we'll explain how to set up cron jobs and secure the Magento software to be suitable for a live e-commerce site.

### Set Cron Jobs

Magento relies on [cron](/docs/tools-reference/tools/schedule-tasks-with-cron) to perform tasks like continuously reindexing your site and generating emails and newsletters. If you logged into your admin panel, you may have noticed an error message saying that cron jobs needed to be set. Fortunately, the cron jobs Magento uses for a base installation are easy to configure.

1.  Open the crontab for your `magento` user. Perform this step as a user with `sudo` privileges:

        sudo crontab -u magento -e

2.  If this is your first time using cron, you may be prompted to select a text editor. If you don't have a preference, select **2** to use nano.

3.  Add the following lines to the end of the file, substituting your Magento installation directory in each:

        * * * * * /bin/php /var/www/html/example.com/public_html/bin/magento cron:run | grep -v "Ran jobs by schedule" >> /var/www/html/example.com/public_html/var/log/magento.cron.log
        * * * * * /bin/php /var/www/html/example.com/public_html/update/cron.php >> /var/www/html/example.com/public_html/var/log/update.cron.log
        * * * * * /bin/php /var/www/html/example.com/public_html/bin/magento setup:cron:run >> /var/www/html/example.com/public_html/var/log/setup.cron.log

    The first line handles reindexing. The second and third lines are needed by the Component Manager and System Upgrade, respectively. The `/bin/php` part of each line specifies your PHP binary. If you installed PHP using this guide, you can leave this value as we have shown it, but if you installed PHP by some other method, you can check its location with `which php` and substitute that value.

    When you're done, save and exit the file.

4.  To verify that the rules have been set properly, log out of your Magento admin and log back in. If everything has been configured correctly, you should no longer see the notification.

    If the message persists, wait several minutes before logging back in so that the cron jobs have time to take effect on the system.

For more information about setting up cron jobs for development servers and custom Magento modules, refer to the [Magento Cron Documentation](http://devdocs.magento.com/guides/v2.1/config-guide/cli/config-cli-subcommands-cron.html#config-cli-cron-bkg).

### Configure X-Frame Options

We strongly recommended that you disable the ability to display your Magento storefront in a frame to prevent [clickjacking](https://en.wikipedia.org/wiki/Clickjacking) attacks. To do this, modify the following line in your `env.php` file:

{{< file-excerpt "/var/www/html/example.com/public_html/app/etc/env.php" php >}}
'x-frame-options' => 'DENY',

{{< /file-excerpt >}}


This prevents attackers from embedding your site in a frame (for example, on a malicious site that mimics your store) in an attempt to intercept payment and other sensitive customer information.

### Set Directory Permissions

At a minimum, you should restrict write access to the `app/etc` directory before opening the site to customers. Run these commands from within your Magento installation directory:

    sudo find app/etc -type f -exec chmod g-w {} \;
    sudo find app/etc -type d -exec chmod g-ws {} \;

Depending on whether you install custom themes or extensions, you may need to do additional configuration. This will vary depending on what you have installed. Once you're ready to deploy your site into production mode, refer to [Magento's ownership and permissions guide](http://devdocs.magento.com/guides/v2.1/config-guide/prod/prod_file-sys-perms.html) for a more comprehensive set of recommendations.

{{< note >}}
If you need to make additional configuration changes in the future, you'll need to manually add write permissions again before you can do so. For more information, see our guide on [Linux users and groups](/docs/tools-reference/linux-users-and-groups).
{{< /note >}}

### Secure your Site with SSL

Secure sockets layer (SSL) certificates are a vital part of e-commerce. They enable encrypted transmission of sensitive data, such as credit card numbers, that can be verified and trusted by clients. In fact, some payment vendors such as PayPal, require SSL certificates to be used for customer transactions.

For instructions on how to use SSL certificates in your store, see our guides on [obtaining a commercially signed SSL certificate](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-centos-and-fedora) and [using SSL certificates with Apache](/docs/security/ssl/ssl-apache2-centos).

{{< note >}}
Many payment vendors that require SSL do not support self-signed certificates. Depending on how you handle payments, it is likely you will need to purchase a commercially signed certificate.

When you [configure Apache to use the SSL certificate](/docs/security/ssl/ssl-apache2-centos#configure-apache-to-use-the-ssl-certificate), if you installed Magento in a subdirectory of your site and only want that section to be encrypted, make sure to modify your `<VirtualHost *:443>` block to match.
{{< /note >}}

Once you've installed your SSL certificate and configured Apache to serve your site securely, you'll need to configure Magento to use secure URLs.

1.  Log into your Magento admin panel using the URL you obtained after running the installation script.

2.  Click on **Stores** in the sidebar on the left of your screen, and select **Configuration** under the Settings submenu.

    ![Go to "Configuration" in the "Stores" menu.](/docs/assets/magento-stores-config.png)

3.  On the next screen, you'll see a list of configuration settings including "General," "Catalog" and "Customers". Click on **General**, and select **Web** from its submenu.

    ![Select "Web" from the "General" menu.](/docs/assets/magento-general-web.png)

4.  Select **Base URLs (Secure)**, which will open to display several text fields. Modify the first field, **Secure Base URL**, to use the HTTPS protocol, as opposed to HTTP:

        https://example.com

    ![Enter your domain with the HTTPS protocol.](/docs/assets/magento-secure-base-url.png)

    This assumes that you used `/var/www/html/example.com/public_html` as your Magento installation directory, as we did in our examples. If you installed Magento in a subdirectory of your web root, you will need to modify that here. For example, if you installed Magento in a folder called `/var/www/html/example.com/public_html/magento`, you'll need to enter:

        https://example.com/magento

5.  Save your configuration.

6.  To verify that SSL has been configured correctly, visit your domain with the HTTPS protocol in a web browser and navigate to a few links. You should see a green lock icon in your browser's URL bar on each page, confirming that each page you (and your future customers) visit is secure.

## Next Steps

If you've followed this guide from the beginning, you should now have a secure, functional installation of Magento. You're now ready to configure your store and start selling products.

You may wish to install extensions to add functionality, or themes to change your site's user experience. If you do, be sure that the extensions and themes you purchase or install are compatible with Magento 2.

You may also want to configure caching with Varnish or other software to increase the speed of your site. For more information on this and other configuration options, see [Magento's configuration guide](http://devdocs.magento.com/guides/v2.1/config-guide/bk-config-guide.html).

Finally, be sure to keep your Magento software and its components up to date. Not only is this important to the security of your site, but it will also allow you to use the latest features and functions Magento has to offer. For more information, refer to the [Magento upgrade documentation](http://devdocs.magento.com/guides/v2.1/comp-mgr/bk-compman-upgrade-guide.html).
