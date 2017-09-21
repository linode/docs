---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide shows hot to install PrestaShop on LAMP (with MariaDB), adding a TLS certificate and turning on a few optimizations'
keywords: 'prestashop,ecommerce,cms'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: Tuesday, August 29th, 2017
modified: Thursday,September 21st, 2017
modified_by:
  name: Linode
title: 'How to Install PrestaShop on Ubuntu 16.04'
contributor:
  name: Alexandru Andrei
external_resources:
 - '[Magento Documentation](http://docs.magento.com/m2/ce/user_guide/getting-started.html)'
 - '[Magento Resources Library](https://magento.com/resources)'
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
---

If you've ever thought about opening an online store, you may have felt overwhelmed by the wide variety of options available. The free ecommerce solutions on the market have matured over the years, and while having so many options means that there is almost certainly a good solution for your particular situation, it can also be confusing for newcomers. This guide will focus on PrestaShop, a comprehensive solution used by thousands of shops around the world.

PrestaShop comes with a large number of features out of the box, and has many plugins that can be installed. The size of PrestaShop can make it seem daunting to learn; however, everything is neatly structured in menus, terms are intuitive and the interface is easy to navigate. In addition, customizing your website is much more user-friendly than other content management systems, with many *What You See Is What You Get* (WYSIWYG) tools. This is in contrast with tools like Magento, for example, where you often have to inspect and edit the source code.

Installing Prestashop on a remote server is more involved and time-consuming than using cloud hosting, but the rewards are great: you will have better performance, since you have reserved server resources; and greater flexibility, with the freedom to tweak your settings as you see fit. You won't have to wait for a support team to change PHP settings for you. Furthermore, [high availability](/docs/websites/introduction-to-high-availability), load balancing, advanced backup schemes, and other features become easily accessible, allowing you to scale your business and increase your site's reliability.


## Before We Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  In order to obtain a free SSL certificate from [Let's Encrypt](https://letsencrypt.org/), you will need to buy a Fully Qualified Domain Name (FQDN and set it to point to your newly created server. See our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview) guide for more information.

      {: .note}
      >
      > Throughout this guide, replace `example.com` with the public IP address or Fully Qualified Domain Name (FQDN) of your Linode.

## Server Requirements

In most cases, you can safely start out with an Ubuntu 16.04 instance with 1GB of RAM. As your online store grows, keep an eye on your memory usage and scale to a higher-sized Linode when necessary. If your business becomes especially large, it may be a good idea to separate your store across at least three servers: one that runs Apache and hosts the PHP code running the ecommerce platform, one for the database, and one for storing static content like images.

## Install Apache and MariaDB

This guide will run PrestaShop on a modified LAMP stack using MariaDB instead of MySQL. You can read more about MariaDB and its benefits here: [MariaDB vs MySQL - Features](https://mariadb.com/kb/en/the-mariadb-library/mariadb-vs-mysql-features/). If you would prefer to use a more traditional LAMP stack, please see our guide on [How to Install a LAMP Stack on Ubuntu 16.04](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04).

1. Install the basic components for an Apache server, a module for it to run PHP, and a MariaDB server:

        sudo apt-get install apache2 libapache2-mod-php mariadb-server

2. Use the following command to secure your MariaDB installation:

        sudo mysql_secure_installation

  This script will ask you a series of questions. You can leave the first question (for MariaDB's root password blank), then choose 'n' to decline to create a new root password. Answer 'y' for the remaining questions.

### Configure Apache

1. The next step is to create a basic configuration file for Apache, telling it where it will find our website files and what our domain name is. Start by copying the default config file to use it as a template.

    sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

2. Edit the configuration file. Uncomment the `ServerName` line, replace `example.com` with your Linode's domain name or IP address, and edit the remaining lines as follows:

    {: .file-excerpt }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ conf
        . . .
        ServerName example.com

        ServerAdmin webmaster@example.com
        DocumentRoot /var/www/html/example.com
        . . .
        ~~~

3. Create the directory for our website files:

        sudo mkdir /var/www/html/example.com

4. Disable the default configuration file and enable the newly created one:

        sudo a2dissite 000-default.conf
        sudo a2ensite example.com.conf

5. Restart Apache:

        sudo systemctl restart apache2.service

### Allow PrestaShop to Use .htaccess Files

PrestaShop can make use of `.htaccess` files. This allows it to automatically adjust Apache's settings and makes it possible to enable advanced features such as "pretty links", web page compression or **https** redirects from the administration backend (PrestaShop's admin page).

1.  Edit the config file to enable .htaccess overrides:

  {: .file }
  /etc/apache2/sites-available/example.com.conf
  :   ~~~ conf
      <Directory /var/www/html/example.com>
          AllowOverride All
      </Directory>
      ~~~

## Install TLS (SSL) Certificate to Encrypt Website Traffic

Obtaining an SSL certificate for your store will help keep your customers' data secure, and will avoid Google search ranking penalties for sites that don't use `https`. Note that it is not possible to complete this step using the public IP address of a Linode; you need to have a FQDN that is already listed in the DNS servers.

1. Check to see if your domain name has propagated to the DNS servers:

        dig @8.8.8.8 example.com

    You should receive a response that looks like this:

        example.com        36173   IN  A   203.0.113.10

    If the **A** value is equal to the IP address of your server, you can continue. Otherwise, review the DNS configuration of your Linode and try this step again in a few minutes.

2. Add the official Personal Package Archive (PPA) of the Let's Encrypt Team, update the package repository, and install certbot:

        sudo apt-get install software-properties-common
        sudo add-apt-repository ppa:certbot/certbot
        sudo apt-get update
        sudo apt-get install python-certbot-apache

3. Request and install the TLS certificate:

          sudo certbot --apache

4. When asked if you want https redirection answer **2**.

        Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
        -------------------------------------------------------------------------------
        1: No redirect - Make no further changes to the webserver configuration.
        2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
        new sites, or if you're confident your site works on HTTPS. You can undo this
        change by editing your web server's configuration.
        -------------------------------------------------------------------------------
        Select the appropriate number [1-2] then [enter] (press 'c' to cancel):

5. Make sure https is working correctly before continuing. You do this by navigating to `https://example.com` in your web browser.

6. Since certificates expire after 90 days, it's a good idea to set up automatic renewal:

        sudo crontab <<< "33 3 * * Sat /usr/bin/certbot renew -q"

## Prepare Environment for PrestaShop and Install Dependencies

Set ownership of `/var/www/html/example.com` to allow PrestaShop to enable plugins, automatic updates, and other features.

    sudo chown www-data: /var/www/html/example.com/

You can also use:

    chown -R www-data *
    chgrp -R www-data *

{: .note}
>
> Initially, root is the only owner of `example.com` directory. Apache could read there but it couldn't write. After we enter the above command and make `www-data` own that directory, PrestaShop, through Apache that is running under that username, can now make all the changes it desires. While this is useful for easy administration it also comes with a small price in security: if an attacker finds a serious vulnerability on your website, he also has the power to write files in `/var/www/html/example.com` now. And always keep PrestaShop updated to get the latest bug and security fixes.

### Download and Unzip PrestaShop's Files

1. Change the working directory to where the website's code will be installed:

        cd /var/www/html/example.com/

2. Download the zip archive containing all of the necessary files. At the time of writing this tutorial, the latest version was `1.7.2.1`. Check this website for the newest version available: [PrestaShop's Download Page](https://www.prestashop.com/en/download) and change the link in the following command so that it reflects the current release:

        sudo curl -O https://download.prestashop.com/download/releases/prestashop_1.7.2.1.zip

3. Install the `unzip` package:

        sudo apt-get install unzip

4. Decompress the zip archive:

        sudo unzip prestashop_1.7.2.1.zip

### Install and Configure PrestaShop Dependencies

1. At this point, the setup files are ready to be accessed through a web browser but PrestaShop needs access to some additional PHP modules.

        sudo apt-get install php7.0-curl php7.0-gd php7.0-mysql php7.0-zip php7.0-xml php7.0-intl

    These modules allow PrestaShop to download content, process images, access the database, unzip files, process XML data, and access internationalization functions.

2. Enable the Apache `rewrite` module:

        sudo a2enmod rewrite

3. Restart Apache:

        sudo systemctl restart apache2.service

4. PrestaShop makes use of a SQL database to store information about products, users, categories and so on. Log in as the superuser (root) to MariaDB:

        sudo mysql

5. Create a database and a user with the appropriate permissions. Replace `your_database_name`, `prestashop_user` and `choose_password` below and record the information for later use.

        CREATE DATABASE your_database_name;
        CREATE USER 'prestashop_user'@'localhost' IDENTIFIED BY 'choose_password';
        GRANT ALL ON your_database_name.* TO 'prestashop_user'@'localhost';
        exit

## Install PrestaShop

1. Navigate to `https://example.com` in a browser. Be sure to include the `https` so your connection is secure.

    An install wizard will guide you through the setup process. When prompted, fill in the database credentials you set up earlier. Leave the first field as it is: **127.0.0.1**. The **table prefix** can be left unchanged as well.

    ![Database Credentials Form](/docs/assets/prestashop-ubuntu1604-database-credentials-form.png)

2. Test your connection to the database server.

3. After clicking **Next** the installer will create the necessary tables and finalize setting up the store. You should now be presented with a page like this:

  ![PrestaShop Installation Completed](/docs/assets/prestashop-ubuntu1604-installation-completed.png)

4. Remove the `install` directory and `zip` archive.

        cd /var/www/html/example.com
        sudo rm -r install prestashop_1.7.2.1.zip

## Optimize Prestashop and Enable TLS/SSL

1. We don't want users or site administrators to visit an unencrypted page by mistake so we'll enable https redirection. In the PrestaShop backend, in the far-left menu, look for **CONFIGURE**. Click on **Shop Parameters** under it.

    ![Far-left menu from PrestaShop](/docs/assets/prestashop-ubuntu1604-left-side-menu.png)

    Choose **YES** for **Enable SSL** and **Enable SSL on all pages**. Scroll down and click **Save** (you'll see a floppy disk icon in the bottom-right corner). A picture is attached below with the settings turned on.

    If you can't switch on **Enable SSL on all pages**, try again after enabling SSL and saving your settings.

    ![SSL switches turned on in settings](/docs/assets/prestashop-ubuntu1604-SSL-switches.png)

2. Now go back to the left menu, and as your mouse pointer hovers on top of **Shop Parameters** you'll see a submenu pop up. Click on **Traffic and SEO**. Now scroll down until you find the settings exemplified in the picture below:

    ![PrestaShop SEO and URL settings](/docs/assets/prestashop-ubuntu1604-SEO-and-URL-switches.png)

    Select **YES** for **Friendly URL** and **301 Moved Permanently** for **Redirect to the canonical URL**. Save your settings by clicking on the diskette icon.

3. Out of the box, PrestaShop includes some features that help it render pages faster for your clients. You can access these from the far-left menu. Under **CONFIGURE**, hover over **Advanced Parameters** and click on **Performance** in the submenu that opens up. Select **Recompile templates if the files have been updated** under **Template compilation** and **YES** for **Cache**. This will activate Smarty cache and decrease the need for your server to compile parts of the PHP code, decreasing load times for the frontend. The final settings should look like in the following picture:

    ![Smarty cache settings](/docs/assets/prestashop-ubuntu1604-smarty-cache-settings.png)

4. Now scroll down until you find **CCC (COMBINE, COMPRESS AND CACHE)**. Switch everything there to **YES**. Click on the diskette to save all the changes.

    ![CCC (COMBINE, COMPRESS AND CACHE settings)](/docs/assets/prestashop-ubuntu1604-combine-compress-cache-settings.png)

5. Go to the front end of your website and navigate to some pages to check if everything is working alright.

6. Open `/etc/php/7.0/apache2/php.ini` in a text editor.

    {:.file-excerpt}
    /etc/php/7.0/apache2/php.ini
    : ~~~
      memory_limit = 128M
      upload_max_filesize = 2M
      max_execution_time = 30
      ~~~

7. Restart Apache:

        sudo systemctl restart apache2.service

## Set Up Mail Delivery

Setting up mail delivery in PrestaShop is vital since so much happens through email: customer account confirmations, subscriptions, delivery statuses, order confirmations, etc. Although an email server [like this one](/docs/email/email-with-postfix-dovecot-and-mysql) can be hosted on a Linode, it's fairly complicated to set up, maintain, and especially to keep off blacklists and avoid getting flagged as spam by your customers' email providers. It's also possible to use an all-in-one solution like [Mail-in-a-Box](/docs/email/mailinabox/how-to-install-mail-in-a-box), but the easiest approach is to use a dedicated solution like G Suite or Fastmail. This way you can focus on maintaining your store and get dependable email service without worrying about the technical details. If you need to send out a large number of emails, make sure to check if you're within limits. Google's G Suite limits the number of monthly emails you can send out.

Once you have decided on an email provider, configure PrestaShop's email system: in the left menu, under **CONFIGURE**, hover over **Advanced Parameters** and click **E-mail** in the submenu. Once the page loads, look for **Set my own SMTP parameters (for advanced users ONLY)**.

![PrestaShop email settings](/docs/assets/prestashop-ubuntu1604-email-settings.png)

New options will appear further down in the page:

![Email server connection settings](/docs/assets/prestashop-ubuntu1604-email-server-connection-settings.png)

## Conclusion

You now have an online store, capable of everything you ever saw on professional websites. It's recommended you use a good backup scheme since client data, orders you need to process, payments, are important and losing them can be a logistical nightmare. If you have an active store with multiple orders placed daily, then a weekly backup is not enough and you should look for solutions that back up daily at least.
