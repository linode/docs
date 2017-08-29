---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Installing PrestaShop on LAMP (with MariaDB), adding a TLS certificate and turning on a few optimizations'
keywords: 'prestashop,ecommerce,cms'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, August 29th, 2017'
modified: Tuesday, August 29th, 2017
modified_by:
  name: Alexandru Andrei
title: 'How to Install PrestaShop on Ubuntu 16.04'
contributor:
  name: Alexandru Andrei
  link:
  external_resources:
- '[PrestaShop's Homepage](https://www.prestashop.com/en)'
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----

When deciding to create an online store, while we're lucky enough to have so many open-source platforms available, this can also confuse newcomers. Maybe you've already decided you're going to use PrestaShop or maybe you're unfamiliar with it and wonder how it's different from Magento, OpenCart and other free ecommerce solutions. They've all matured since their inception and each one has its strengths and weaknesses. We'll focus on what PrestaShop has to offer.

Because of so many features it bundles out of the box, plus the plugins that may be installed, it will take awhile to get familiarized with how things work. But this doesn't mean that it's hard, just that there's a lot to go through if you plan to explore the entire administrative backend. Everything is neatly structured in menus, terms are usually intuitive and the interface is easy to navigate. It's worth mentioning that customizing your website is much more user-friendly than other content management systems, with many *What You See Is What You Get* (WYSIWYG) tools. This is in contrast with Magento, for example, where you often have to touch and edit the source code.

Many people coming from the world of shared hosting may be intimidated by the work required to install this script on a private server. But worry not, the rewards are great: you will have better performance since you have reserved server resources and greater flexibility with the freedom to tweak your settings as you see fit; no more asking and waiting for support to change some PHP setting for you. Furthermore, [High Availability](/docs/websites/introduction-to-high-availability), Load Balancing, advanced backup schemes and other goodies become easily accessible, allowing you to scale your business and increase your site's reliability.


## Before We Begin

{: .note}
>
> This tutorial assumes you have read the [Getting Started](/docs/getting-started) guide and completed the steps for setting your Linode's hostname and timezone.

Although PrestaShop is a complex piece of software, backed by a demanding database, this is easily handled by Linode's hardware. Its solid-state drives help a lot with the parallel reads required by busy web servers. However, you must keep in mind that as your website grows, you will also outgrow the capacities you start with. That's why you need to be prepared. If you know you'll add a lot of products on a constant basis, the images may take up a lot of disk space after some time, exhausting initial resources. On a very active website, it's a good idea to separate everything on at least three servers: one that runs Apache and hosts the PHP code running the ecommerce platform, one for the database and one for storing static content like images.

In most cases though, you can safely start out with an Ubuntu 16.04 instance with 1GB of RAM. Just keep a close eye on memory usage for a few days and grow your instance to 2GB (or more) if you see free memory starts to get low. Keep in mind that a large number of complex plugins you may add later on put additional stress on CPU and RAM usage.

It's very important that the first thing you start with is to configure your domain name to point to Linode's nameservers and create your Domain Name System (DNS) records. It can take awhile for those settings to *propagate*, meaning some time has to pass from the moment you configure them, to the moment everyone else on the Internet receives those updated values (usually a matter of some cache expiring and then getting refreshed). The most important reason why we need the DNS changes to be propagated before we continue is that generating a *Let's Encrypt Transport Layer Security (TLS) certificate* with `certbot` requires your domain name to point to your server. This is how it verifies that you own it. In case your changes didn't yet propagate to Let's Encrypt's servers, wait one hour and retry. It shouldn't take that long since it will check your authoritative nameservers for answers, bypassing slave/caching nameservers but just in case. Usually, you should be able to continue 15 minutes after adding a master zone in Linode's DNS manager.

To summarize, here's a list of all the things we need to do before continuing:

1. Launch an Ubuntu 16.04 instance with at least 1GB of RAM (keep in mind though that this gives your server very little space to "breathe" in case it gets a sudden burst of traffic).
2. Set up your domain name to point to your newly created server by following this tutorial: [DNS Manager Overview](/docs/networking/dns/dns-manager-overview)
3. Follow this guide to add a *sudo* capable user: [Securing your server](/docs/security/securing-your-server#ubuntu). It's highly recommended you also follow the steps to automate security updates (`unattended-upgrades`), setup SSH key authentication and disable password logins. Weak passwords and old, unpatched software are usually the most common ways servers get exploited.

## Install Apache and MariaDB

Although we could follow one of the _LAMP_ (Linux, Apache, MySQL, PHP) stack tutorials from Linode, we'll opt for a slightly different setup, using MariaDB instead of MySQL. Most of the major Linux distributions already switched to it as the default SQL server for various reasons. You can read more about it here: [MariaDB vs MySQL - Features](https://mariadb.com/kb/en/the-mariadb-library/mariadb-vs-mysql-features/). What's of interest to us is that it performs slightly better in some cases and an online shop benefits from every millisecond we can shave off page loading times.

1. Initially, we should make sure that our server has the latest software installed:

    sudo apt-get update && sudo apt-get upgrade

It might be a good idea to also issue a `sudo systemctl reboot` if you notice core packages have been upgraded, e.g. systemd, linux-image.

2. The most basic components for an Apache server, a module for it to run PHP and a MariaDB server can be easily installed with the following command:

    sudo apt-get install apache2 libapache2-mod-php mariadb-server

3. Now we'll take some basic steps to make MariaDB a little bit more secure by default.

    sudo mysql_secure_installation

This script will ask you a series of questions. The first ones will be about setting up a root password for our database server. This is mostly irrelevant nowadays since in Ubuntu 16.04, by default, MariaDB doesn't allow you to login as root by using a password. It uses the *auth_socket plugin* which just checks for the username currently logged in to allow or deny access. Another way to explain it is that you have to be logged in as root on your Ubuntu server to be able to log in as root in MariaDB.

To the rest of the questions we can answer with `y`. Detailed explanations are provided in the terminal output.

### Configure Apache

1. The next step is to create a basic configuration file for Apache, telling it where it will find our website files and what our domain name is. We start by copying the default config file to use it as a template. 

{: .note}
>
> Be careful to replace `example.com` with your domain name every time you see it in a command.

    sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

2. Next, we edit this file:

    sudoedit /etc/apache2/sites-available/example.com.conf

Here we'll edit three lines and ignore the rest. Don't forget to delete the `#` sign that precedes **ServerName**. If we leave `#` there, the line will have no effect since it will be interpreted as a comment line.

{: .file }
/etc/apache2/sites-available/example.com.conf
:   ~~~ conf
    . . .
    ServerName example.com
    
    ServerAdmin webmaster@example.com
    DocumentRoot /var/www/html/example.com
    . . .
    ~~~

Now press `CTRL+X` then type `y` and press `ENTER` to save your changes.

3. Let's create the directory where our website files will reside:

    sudo mkdir /var/www/html/example.com

This way, if later on we decide we also want a `blog.example.com`, we can create a new config file and directory and add a Wordpress website there. This helps keep things neatly organized.

4. Since we will be using the new configuration file, let's disable the old one:

    sudo a2dissite 000-default.conf

5. And enable the newly configured one:

    sudo a2ensite example.com.conf

6. Finally, we restart Apache so that changes take effect:

    sudo systemctl restart apache2.service

### Allow PrestaShop to Use .htaccess Files

PrestaShop can make use of so-called `.htaccess` files. This allows it to adjust Apache's settings when it places such an object in a directory that the web server reads. It's a feature that almost all users want since it makes administration much easier. It has a very small cost on performance but without it you won't be able to enable features like "pretty links", web page compression or *https* redirects from the administration backend (PrestaShop's admin page). You'd be forced to write them manually in Apache's configuration files.

1. Let's open the config file:

    sudoedit /etc/apache2/sites-available/example.com.conf

2. And add the following text at the end of the file to enable .htaccess overrides:

{: .file }
/etc/apache2/sites-available/example.com.conf
:   ~~~ conf
    <Directory /var/www/html/example.com>
        AllowOverride All
    </Directory>
    ~~~

In the next step, the script we'll use to secure data between clients and server will use these settings as a template for the new configuration files it will create.

## Install TLS (SSL) Certificate to Encrypt Website Traffic

Referred to as SSL certificates (Secure Sockets Layer), they're actually *TLS* nowadays (Transport Layer Security). SSL is the predecessor of TLS but the old term is still used (usually  incorrectly) because of familiarity and inertia.

There are two main reasons why this certificate is important. Security reasons come first. Some of your customers will create login accounts and passwords would be sent from client to server without being encrypted if TLS wouldn't be active. TLS encrypts data in transit so that nobody can snoop on sensitive information while it's sent on the network, from device to device, until it reaches its destination. This will also protect your backend administrator password. Another big reason to use encryption is that Google, in its search results, penalizes sites that aren't using https.

1. Before continuing, we need to make sure that DNS changes have propagated at least to Google's servers. We do this by using a DNS lookup utility called `dig`.

    dig @8.8.8.8 example.com

You should look for an answer that looks like this in the output:

    example.com.		36173	IN	A	203.0.113.10

If the **A** value is equal to the IP address of your server, you can continue. Otherwise, come back to this step later.

After you notice DNS changes have propagated, follow the steps below: 

2. Add the official Personal Package Archive (PPA) of the Let's Encrypt Team, update the package repository and install certbot (**don't** copy-paste all commands at once, only the first would get executed):

    sudo apt-get install software-properties-common
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python-certbot-apache

3. Before continuing, please read step four below then request and install the TLS certificate:

    sudo certbot --apache

Now follow the instructions from the terminal output.

4. Make sure https is working correctly before continuing. You do this by accessing `https://example.com` in your web browser.

5. Since certificates expire after 90 days, we need to set up an automated way of renewing them.

sudo crontab <<< "33 3 * * Sat /usr/bin/certbot renew -q"

This will set up a *cron* job and `certbot renew -q` command will run every Saturday at 3:33 AM. The script will only take action when the certificates expire in less than 30 days.

## Prepare Environment for PrestaShop and Install Dependencies

PrestaShop has the ability to install and remove plugins, upgrade itself and do all kinds of useful things with the click of a few buttons. All of these fancy features need the right file permissions though. So we need to make Apache the owner of `/var/www/html/example.com`.

    sudo chown www-data: /var/www/html/example.com/

{: .note}
>
> Initially, root is the only owner of `example.com` directory. Apache could read there but it couldn't write. After we enter the above command and make `www-data` own that directory, PrestaShop, through Apache that is running under that username, can now make all the changes it desires. While this is useful for easy administration it also comes with a small price in security: if an attacker finds a serious vulnerability on your website, he also has the power to write files in `/var/www/html/example.com` now. So keep that in mind when you'll research ways to secure your installation. And always keep PrestaShop updated to get the latest bug and security fixes.

### Download and Unzip PrestaShop's Files

1. Let's change our working directory to the place where our website's code will be installed:

    cd /var/www/html/example.com/

2. Now we can download the zip archive containing all of the necessary files. At the time of writing this tutorial, the latest version was `1.7.2.1`. Check this website for the newest version available: [PrestaShop's Download Page](https://www.prestashop.com/en/download)

Make sure to change the link in the following command so that it reflects the current release:

    sudo curl -O https://download.prestashop.com/download/releases/prestashop_1.7.2.1.zip

3. To decompress this file we will need to install the `unzip` package:

    sudo apt-get install unzip

4. Now we can decompress our zip archive:

    sudo unzip prestashop_1.7.2.1.zip

### Install and Configure PrestaShop Dependencies

1. At this point, the setup files are ready to be accessed through a web browser but PrestaShop needs access to some additional PHP modules. We will install everything that it requires with the following command:

    sudo apt-get install php7.0-curl php7.0-gd php7.0-mysql php7.0-zip php7.0-xml php7.0-intl

In order, these modules allow PrestaShop to: download stuff, process images, access the database, unzip files, process XML data and access internationalization functions.

2. Our website also requires that the Apache rewrite module is active. We can enable it with:

    sudo a2enmod rewrite

This enables PrestaShop to set up and enable its own redirects and use "*pretty links*", important for search engine optimization (SEO) in the past. These are no longer very important in Google's ranking algorithm but they can still be valuable for human beings `example.com/computers/ram` is more readable than `example.com/index.php?category=12&products=14`. And it's also possible that other search engines still rank your site higher when you have pretty links enabled.

3. To make Apache aware of the new modules installed and enabled, we need to restart it again:

    sudo systemctl restart apache2.service

4. Our ecommerce platform makes use of a *Structured Query Language* (SQL) database to store information about products, users, categories and so on. Let's login as the superuser (root) to MariaDB:

    sudo mysql

5. Now let's create a database for PrestaShop to work with, a user so it can log in to MariaDB and grant that user all the privileges it can have over that database, so it can interact with it, unrestricted.

Replace `your_database_name`, `prestashop_user` and `choose_password` below. Don't leave them as they are as that would be a security risk. Also, remember the values you choose, you will need to enter them in a web form in a few moments.

    CREATE DATABASE your_database_name;
    CREATE USER 'prestashop_user'@'localhost' IDENTIFIED BY 'choose_password';
    GRANT ALL ON your_database_name.* TO 'prestashop_user'@'localhost';
    exit

## Install PrestaShop

1. Since everything is prepared now, switch to your favorite browser and go to `https://example.com`. Be careful not to omit the preceding "https". It's very important since you'll be filling in some forms with sensitive data, like your administrative password.

When visiting your website, you'll be presented with a user-friendly install wizard that will guide you through the setup process. The first steps are well explained and easy to follow.

When you get to the form asking for the database credentials, fill it with the values you set up earlier (when you entered CREATE DATABASE). Leave the first field as it is: **127.0.0.1**. That means the server will connect to itself to access the database. The **table prefix** can be left unchanged as well.

![Database Credentials Form](/docs/assets/prestashop-ubuntu1604-database-credentials-form.png)

2. Now we can test our connection to the database server. It should pass. If it doesn't work, it means the data you have entered here doesn't coincide with the credentials you have added earlier in MariaDB. Check your terminal window, scroll up, and pay attention to the values you entered at the SQL console.

3. After clicking **Next** the installer will create the necessary tables and finalize setting up the store. You should now be presented with a page like this:

![PrestaShop Installation Completed](/docs/assets/prestashop-ubuntu1604-installation-completed.png)

Clicking on **Back Office** will take you to the administration backend of the platform. But that won't work before completing the next step.

4. Let's get back to our terminal and remove the `install` directory since it's no longer needed and may also present a security risk. We'll also remove the zip archive we have downloaded earlier. Your working directory should still be `/var/www/html/example.com` as that's the state we left it in earlier. If that's not the case for some reason, you can go back with `cd /var/www/html/example.com`. Let's delete the directory and file:

    sudo rm -r install prestashop_1.7.2.1.zip

-r stands for recursive so that `rm` deletes all of the contents it finds in that directory. Without that, `rm` would throw an error and refuse to delete directories.

5. Now we can go back to the browser and log in to the backend.

6. Note the text in the address bar. You will notice a string like **admin230ukr83q**. It will be something randomly generated and unique for you. This is an attempt to keep unauthorized strangers on the Internet from trying to access the URL of your admin page. Note the address somewhere or bookmark it. If you lose it, you can just go back to your server and `ls /var/www/html/example.com`. The directory starting with **admin** is the same one that should be used in the address bar of your browser to access the administrative backend.

## Optimize Prestashop and Enable TLS/SSL

1. We don't want users or site administrators to visit an unencrypted page by mistake so we'll enable https redirection. In the PrestaShop backend, in the far-left menu, look for **CONFIGURE**. Click on **Shop Parameters** under it. 

![Far-left menu from PrestaShop](/docs/assets/prestashop-ubuntu1604-left-side-menu.png)

Choose **YES** for **Enable SSL** and **Enable SSL on all pages**. Now scroll down and click **Save** (you'll see a floppy disk icon in the bottom-right corner). A picture is attached below with the settings turned on.

If you can't switch on **Enable SSL on all pages**, try again after enabling SSL and saving your settings.

![SSL switches turned on in settings](/docs/assets/prestashop-ubuntu1604-SSL-switches.png)

2. Now go back to the left menu, and as your mouse pointer hovers on top of **Shop Parameters** you'll see a submenu pop up. Click on **Traffic and SEO**. Now scroll down until you find the settings exemplified in the picture below:

![PrestaShop SEO and URL settings](/docs/assets/prestashop-ubuntu1604-SEO-and-URL-switches.png)

Select **YES** for **Friendly URL** and **301 Moved Permanently** for **Redirect to the canonical URL**. Now save your settings by clicking on the diskette icon.

3. Out of the box, PrestaShop includes some features that help it render pages faster for your clients. You can access these from the far-left menu. Under **CONFIGURE**, hover over **Advanced Parameters** and click on **Performance** in the submenu that opens up. Select **Recompile templates if the files have been updated** under **Template compilation** and **YES** for **Cache**. This will activate Smarty cache and decrease the need for your server to compile parts of the PHP code, decreasing load times for the frontend. The final settings should look like in the following picture:

![Smarty cache settings](/docs/assets/prestashop-ubuntu1604-smarty-cache-settings.png)

4. Now scroll down until you find **CCC (COMBINE, COMPRESS AND CACHE)**. Switch everything there to **YES**. Click on the diskette to save all the changes.

![CCC (COMBINE, COMPRESS AND CACHE settings) ](/docs/assets/prestashop-ubuntu1604-combine-compress-cache-settings.png)

5. Go to the front end of your website and navigate to some pages to check if everything is working alright.

6. Now let's go back to the terminal and look at three important PHP settings.

    sudoedit /etc/php/7.0/apache2/php.ini

In this file, look for `memory_limit = 128M`. You can use `PAGE DOWN` to scroll down or press `CTRL+W` then type `memory_limit` to search for that text. There is no predetermined "right value" for this field, it all depends on how your website is used. You can increase this size if you ever need to. This limits the amount of memory a single PHP script can use. It's not a total. If 20 people request a page simultaneously, each of those PHP requests is allowed to use the set maximum. PHP documentation mentions this: "This sets the maximum amount of memory in bytes that a script is allowed to allocate. This helps prevent poorly written scripts for eating up all available memory on a server."

Another setting that may be of interest is `max_execution_time`. By default, its value is 30. This shouldn't be changed now but it's something to remember if you ever have a script that needs more than 30 seconds to execute. For example, it may happen that when you use a backup feature written in PHP that takes a long time to complete, you may need to increase this.

The last variable we'll be looking at is `upload_max_filesize`. By default it's set at 2 megabytes. We may hit this limit when uploading product pictures that have a file size larger than that. Let's change it to 10M. Hit `CTRL+X`, then `Y`, then `ENTER` to save your file.

7. For the changes to take effect, we need to restart Apache.

    sudo systemctl restart apache2.service

## Set Up Mail Delivery

Setting up mail delivery in PrestaShop is vital since so much happens through emails: customer account confirmations, subscriptions, delivery statuses, order confirmations, etc. Although an email server [like this one](/docs/email/email-with-postfix-dovecot-and-mysql) can be hosted on Linode, it's fairly complicated to set it up, to maintain it and especially to keep off blacklists and avoid getting flagged as spam by your customers' email providers. An easier approach is to use an all-in-one solution like [Mail-in-a-Box](/docs/email/mailinabox/how-to-install-mail-in-a-box), but it's recommended you use a dedicated solution like Google Apps/G Suite, Fastmail or similar if you need something professional and highly reliable. This way you can focus on maintaining your store and get dependable email service without worrying about the technical side of things. And if you need to send out a large number of emails, make sure to check if you're within limits. Google's G Suite limits the number of monthly emails you can send out.

Once you have decided about the solution you are going to use, you can configure PrestaShop's email system this way: in the left menu, under **CONFIGURE**, hover over **Advanced Parameters** and click **E-mail** in the submenu. Once the page loads, look for **Set my own SMTP parameters (for advanced users ONLY)**. 

![PrestaShop email settings](/docs/assets/prestashop-ubuntu1604-email-settings.png)

After selecting this, new options will appear further down in the page, like in the following picture:

![Email server connection settings](/docs/assets/prestashop-ubuntu1604-email-server-connection-settings.png)

## Conclusion

You now have an online store, capable of everything you ever saw on professional websites. It's recommended you use a good backup scheme since client data, orders you need to process, payments, are very important and losing them can be a logistical nightmare. If you have a very active store with multiple orders placed daily, then a weekly backup is not enough and you should look for solutions that back up daily at least. Good luck in your endeavours!
