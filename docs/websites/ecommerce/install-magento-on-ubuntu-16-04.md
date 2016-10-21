---
author:
  name: Linode
  email: docs@linode.com
description: 'A collection of security practices to help you prevent common system exploits.'
keywords: 'magento,ubuntu,e-commerce'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['security/basics/','using-linux/security-basics/']
modified: Tuesday, October 18th, 2016
modified_by:
  name: Phil Zona
published: 'Tuesday, October 18th, 2016'
title: Install Magento on Ubuntu 16.04
external_resources:
 - '[Magento Documentation](http://docs.magento.com/m2/ce/user_guide/getting-started.html)'
 - '[Magento Resources Library](https://magento.com/resources)'
---

In this guide you'll learn how to install Magento on Ubuntu 16.04. Magento Community Edition (CE) is a free, open-source e-commerce platform. It is one of the most popular solutions for self-hosted online stores due to its simple yet powerful admin panel and its large community of developers.

Because of the resources needed by some Magento plugins, it is strongly recommended that you have at least a **4GB Linode**. Running Magento on a smaller Linode may result in certain scripts causing the server to crash under medium to heavy traffic. 

{: .note}
> This guide explains how to install the latest Magento release. For the Community Edition, this will be version 2.1. If you plan to use data, themes, and extensions from an older Magento site, be sure to check for compatibility issues between the two versions since not everything may function as it did in older releases.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. 

3.  Magento runs on a LAMP stack, and this guide assumes you have already installed and configured Apache, MySQL and PHP. If you haven't, refer to our [LAMP stack guides](https://www.linode.com/docs/websites/lamp/). Be aware that there are known compatibility issues with PHP 7.0.5, so check your version before proceeding.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Configure LAMP Stack

In addition to the standard [LAMP stack](https://www.linode.com/docs/websites/lamp/install-lamp-on-ubuntu-16-04) software in our guide, Magento requires a few extra dependencies. To install them: 

    sudo apt-get install php7.0-common php7.0-gd php7.0-mcrypt php7.0-curl php7.0-intl php7.0-xsl php7.0-mbstring php7.0-zip php7.0-iconv mysql-client

{: .note}
> These packages are in addition to those specified in our guide on installing [LAMP on Ubuntu 16.04](https://www.linode.com/docs/websites/lamp/install-lamp-on-ubuntu-16-04).

### Configure Apache

Since Magento will be served by Apache, some additional configuration is needed to ensure the application is served properly. In this section, we'll configure Apache for Magento to ensure that styles and other settings display properly in your storefront.

1.  Be sure you're using Apache version 2.4:

        apache2 -v

    If this shows version 2.2 or another version, upgrade your packages before proceeding.

2.  Enable the Apache rewrite module:

        sudo a2enmod rewrite

3.  Modify the virtual host file for your Magento site to resemble the following. If you have not previously created a virtual host file, do so now and refer to our [LAMP stack guide](https://www.linode.com/docs/websites/lamp/install-lamp-on-ubuntu-16-04) for additional guidance.

    {: .file}
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ conf
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
        ~~~

    The `Directory` block inside the `Virtual Host` block should point to the directory where you plan to install Magento. For simplicity, we will be installing it in our web root, but if you want to put it elsewhere, modify this setting.

    It's important to note the value of `AllowOverride` as this affects which settings in each directory's `.htaccess` file will apply and which will be ignored. If you're not sure if the `All` option is optimal for your site, refer to the [Apache documentation](http://httpd.apache.org/docs/current/mod/core.html#allowoverride) for more information on this setting.

4.  If you haven't already, make sure your site is enabled:

        sudo a2ensite example.com

    Replace `example.com` with the name of your site's virtual host.

4.  Restart Apache to apply these changes:

        sudo systemctl restart apache2

### Create a MySQL Database and User

If you previously installed a LAMP stack using our guide, you should already have set up MySQL root login credentials. If not, you'll need to go back and do so before proceeding.

1.  Log into the MySQL shell as the root user, entering your password when prompted:

        mysql -u root -p

2.  Create a Magento database with a user and permissions. In this example, we'll call our database `magento`, use our `magento` UNIX user from the previous section, and our password will be set to `password`. You should replace `password` with a secure password, and you may optionally replace the other values as well:

        CREATE DATABASE magento;
        GRANT ALL ON magento.* TO magento@localhost IDENTIFIED BY 'password';

    This section assumes that your database is hosted on the same server as your Magento application. If this is not the case, perform these steps and then refer to Magento's guide on using a [remote database server](http://devdocs.magento.com/guides/v2.0/install-gde/prereq/mysql_remote.html).

3.  Exit the MySQL shell:

        quit

### Configure PHP

Because Magento is a PHP application, we'll need to make some adjustments to our system's PHP settings. 

1.  Modify the following settings in your `php.ini` files for the CLI and Apache PHP configurations. These files can be found at `/etc/php/7.0/apache2/php.ini` and `/etc/php/7.0/cli/php.ini`:

    {: .file-excerpt}
    /etc/php/7.0/apache2/php.ini AND /etc/php/7.0/cli/php.ini
    :   ~~~  ini
        date.timezone = America/New_York

        memory_limit=2G
        ~~~

    It is necessary to modify **both** files. This sets the time zone for PHP's `date()` function and imposes a 2GB limit to the amount of memory PHP, and by extension, Magento, can use. This value is recommended for a 4GB Linode, but could be increased for a larger server.

    {: .note}
    > The value for `date.timezone` will vary based on your system's time zone. Refer to the [PHP time zone documentation](http://php.net/manual/en/timezones.php) and ensure this value matches the time zone you set when you configured your Linode. 

## Install Magento

### Download Magento Community Edition

In this section, we'll explain how to get the Magento Community Edition (CE) software on your system. There are several ways to do this, but here we'll cover the simplest method.

1.  On your local computer, download a copy of Magento from their [official website](https://www.magentocommerce.com/download). There are several versions available, but we recommend downloading the latest release. As of this writing, the latest version is 2.1.2:

    ![The Magento download screen](/docs/assets/magento-download-screen.png)

    Next to your selected version, there will be a dropdown menu that says "Select your format." Choose the option ending with the `.tar.gz` extension and click **Download**. Be sure to note where you saved the downloaded file.

    ![Select the option ending in ".tar.gz"](/docs/assets/magento-tar-gz.png)

    {: .note}
    > When choosing a version, refer to Magento's [prerequisites](http://devdocs.magento.com/guides/v2.0/install-gde/prereq/prereq-overview.html) to ensure a particular version's compatibility with the components of your LAMP stack. As of this writing, Magento version 2.1.2 is compatible with all packages we'll be using from the Ubuntu repositories.

2.  Copy the file to your Linode. Replace `/path/on/local/` with the path to the location of your downloaded file, `you` with the username you set on your Linode, and `yourhost` with your Linode's hostname or IP address:

        scp /path/on/local/Magento-CE-2.*.tar.gz you@yourhost:~/

    Alternatively, you can use an FTP client like [Filezilla](https://www.linode.com/docs/tools-reference/file-transfer/filezilla) to do this.

3.  Log into your Linode via SSH as the user you used to copy the file in the previous step. Navigate to the document root you specified into your virtual host file:

        cd /var/www/html/example.com/public_html

    Extracting the archive directly into your webroot, as we'll do in the next step, will make it accessible as the main page on your domain. For instance, if your domain is `example.com`, the Magento storefront will display when you visit `example.com` in your browser. 

    If you want to run a Magento store as a subsection of your site, move and extract the archive in a directory within your webroot. For instance, if you intend to make your site accessible by visiting `example.com/store`, create the subdirectory `/var/www/html/example.com/public_html/store` and navigate to that directory before proceeding to the next step.

4.  Move the Magento archive into your document root and extract its contents:

        sudo mv ~/Magento-CE-2.*.tar.gz .
        sudo tar -xvf Magento-CE-2.*.tar.gz

### Configure Users and Permissions

1.  Create a Magento user, which will run the software. For simplicity, we'll call this user `magento`:

        sudo adduser magento

    Be sure to set a *strong* password when prompted.

2.  Next, we'll need to add the Magento user to the web server's user group. For Apache, the default user is `www-data`:

        sudo usermod -g www-data magento

3.  The commands in this step should be run from your Magento installation directory (where you extracted . If you are not still in that directory, navigate there before proceeding.

    Run these commands in order:

        sudo find var vendor pub/static pub/media app/etc -type f -exec chmod g+w {} \;
        sudo find var vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} \;
        sudo chown -R magento:www-data .
        sudo chmod u+x bin/magento

    This allows your `magento` user (and members of the `www-data` group) to access the various files they'll need to run and serve Magento on your site.

4.  Restart Apache:

        sudo systemctl restart apache2

### Install Magento Community Edition

1.  Switch to the `magento` user and navigate to the `bin` directory in your Magento installation folder:

        su magento
        cd bin

2.  Run the Magento installation script with the following options:

        ./magento setup:install --admin-firstname="John" --admin-lastname="Doe" --admin-email="your@email.com" --admin-user="john" --admin-password="password" --db-name="magento" --db-host="localhost" --db-user="magento" --db-password="password" 
    
    Replace the values in the options as follows:

    -   **admin-firstname / admin-lastname** - This will set the full name of your admin user. Replace these with your name if you'll be the administrator.
    -   **admin-email** - This is your email for resetting passwords and receiving admin notifications.
    -   **admin-user / admin-password** - These are your login credentials for the Magento admin control panel. Be sure to set a secure password here and store it in a safe place. Note that the Magento script requires you to use both letter and number characters in your password, and will return an error if you do not.
    -   **db-name** - This is the name of the database you set up in MySQL. In our example, we called it `magento`, but if you chose a different value, substitute it here.
    -   **db-host** - If you're running Magento on the same server as its database, use `localhost` here. If not, this value will be the hostname of the server on which your database lives.
    -   **db-user** - This is the MySQL database user you set up previously. In our example, we called it `magento` but if you chose a different name use that here instead.
    -   **db-password** - This will be the MySQL password you configured for the `magento` MySQL user.

    {: .note}
    > These are just a few of the available options to configure your Magento installation. For more information, refer to the [Magento Installation Guide](http://devdocs.magento.com/guides/v2.1/install-gde/install/cli/install-cli-install.html) and feel free to use additional options when running the script.

3.  The installation script may take several minutes to run. Once it's finished, you'll see a success message:

        [SUCCESS]: Magento installation complete.
        [SUCCESS]: Magento Admin URI: /admin_d61f38

Congratulations, you've successfully installed Magento on your Linode! You can log into your admin panel by entering your domain, followed by the "Magento Admin URI" displayed above, in a web browser. The **admin-user** and **admin-password** options you specified when running the installation script will be your credentials. 

## Configure Magento

The dashboard will be functional at this point, but there is still some work to be done before the site is ready to use. In this section, we'll explain how to set up cron jobs and secure the Magento software to be suitable for a live e-commerce site.

### Set Cron Jobs

Magento relies on [cron](https://www.linode.com/docs/tools-reference/tools/schedule-tasks-with-cron) to perform tasks like continuously reindexing your site and generating emails and newsletters. If you logged into your admin panel once your installation finished, you may have noticed an error message saying that cron jobs needed to be set. Fortunately, the cron jobs Magento uses for a base installation are very easy to configure.

1.  Open the crontab for your `magento` user:

        sudo crontab -u magento -e

2.  If this is your first time using cron, you'll be prompted to select a text editor. If you don't have a preference, select **2** to use nano.

3.  Add the following lines to the end of the file, substituting your Magento installation directory in each:

        * * * * * /usr/bin/php /var/www/html/example.com/public_html/bin/magento cron:run | grep -v "Ran jobs by schedule" >> /var/www/html/example.com/public_html/var/log/magento.cron.log
        
        * * * * * /usr/bin/php /var/www/html/example.com/public_html/update/cron.php >> /var/www/html/example.com/public_html/var/log/update.cron.log
        
        * * * * * /usr/bin/php /var/www/html/example.com/public_html/bin/magento setup:cron:run >> /var/www/html/example.com/public_html/var/log/setup.cron.log

    The first line handles reindexing. The second and third lines are needed by the Component Manager and System Upgrade, respectively. The `/usr/bin/php` part of each line specifies your PHP binary. If you installed PHP using our LAMP stack guide, you can leave this value as we have shown it, but if you installed PHP by some other method, you can check its location with `which php` and substitute that value.

    When you're done, be sure to save the file.

4.  To verify that the rules have been set properly, log out of your Magento admin and log back in. If everything has been configured correctly, you should no longer see the notification.

For more information about setting up cron jobs for development servers and custom Magento modules, refer to the [Magento Cron Documentation](http://devdocs.magento.com/guides/v2.1/config-guide/cli/config-cli-subcommands-cron.html#config-cli-cron-bkg).

### Configure X-Frame Options

It is strongly recommended to disable the ability to display your Magento storefront in a frame to prevent [clickjacking](https://en.wikipedia.org/wiki/Clickjacking) attacks. To do this, modify the following line in your `env.php` file:

{: .file-excerpt}
/var/www/html/example.com/public_html/app/etc/env.php
:   ~~~ php
    'x-frame-options' => 'DENY',
    ~~~

This prevents attackers from embedding your site in a frame (for example, on a malicious site that mimics your store) in an attempt to intercept payment and other sensitive customer information.

### Set Directory Permissions

At a minimum, you should restrict write access to the `app/etc` directory before opening the site to customers. Run these commands from within your Magento installation directory:

    sudo find app/etc -type f -exec chmod g-w {} \;
    sudo find app/etc -type d -exec chmod g-ws {} \;

Depending on whether you install custom themes or extensions, you may need to do additional configuration. This will vary depending on what you have installed, but in general, you should disable write access for any directories that contain themes or extensions.

{: .note}
> If you need to make additional configuration changes in the future, you'll need to manually add write permissions again before you can do so. For more information, see our guide on [Linux users and groups](https://www.linode.com/docs/tools-reference/linux-users-and-groups).

### Secure your Site with SSL

Secure sockets layer (SSL) certificates are a vital part of e-commerce. They enable encrypted transmission of sensitive data, such as credit card numbers, that can be verified and trusted by clients. In fact, some payment vendors such as PayPal, require SSL certificates to be used for customer transactions.

For instructions on how to use SSL certificates in your store, see our guides on [obtaining a commercially signed SSL certificate](https://www.linode.com/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-debian-and-ubuntu) and [using SSL certificates with Apache](https://www.linode.com/docs/security/ssl/ssl-apache2-debian-ubuntu).

{: .note}
> Many payment vendors that require SSL do not support self-signed certificates. Depending on how you handle payments, it is likely you will need to purchase a commercially signed certificate.

Once you've installed your SSL certificate and configured Apache to serve your site securely, you'll need to configure Magento to use secure URLs.

1.  Log into your Magento admin panel using the URL you obtained after running the installation script.

2.  Click on **Stores** in the sidebar on the left of your screen, and select **Configuration** under the Settings submenu.

    ![Go to "Configuration" in the "Stores" menu.](/docs/assets/magento-stores-config.png)

3.  On the next screen, you'll see a list of configuration settings including "General," "Catalog," and "Customers" among others. Click on General, and select **Web** from its submenu.

    ![Select "Web" from the "General" menu.](/docs/assets/magento-general-web.png)

4.  Select **Base URLs (Secure)**, which will open to display several text fields. Modify the first field, **Secure Base URL**, to use the HTTPS protocol, as opposed to HTTP:

        https://example.com

    ![Enter your domain with the HTTPS protocol.](/docs/assets/magento-secure-base-url.png)

    This assumes that you used `/var/www/html/example.com/public_html` as your Magento installation directory as we did in our examples. If you installed Magento in a subdirectory of your web root, you will need to modify that here. For example, if you installed Magento in a folder called `/var/www/html/example.com/public_html/magento`, you'll need to enter:

        https://example.com/magento

5.  Save your configuration.

6.  To verify that SSL has been configured correctly, visit your domain with the HTTPS protocol in a web browser and navigate to a few links. You should see a green lock icon in your browser's URL bar on each page, confirming that each page you (and your future customers) visit is secure.

## Next Steps

If you've followed this guide from the beginning, you should now have a secure, functional installation of Magento. You're now ready to configure your store and start selling products.

You may wish to install extensions to add functionality, or themes to change your site's user experience. If you do so, be sure that the extensions and themes you purchase or install are compatible with Magento 2.x.

You may also want to configure caching with Varnish or other software to increase the speed of your site. For more information on this and other configuration options, see [Magento's configuration guide](http://devdocs.magento.com/guides/v2.1/config-guide/bk-config-guide.html).

Finally, be sure to keep your Magento software and its components up to date. Not only is this important to the security of your site, it will allow you to use the latest features and functions Magento has to offer. For more information, refer to the [Magento upgrade documentation](http://devdocs.magento.com/guides/v2.1/comp-mgr/bk-compman-upgrade-guide.html).

