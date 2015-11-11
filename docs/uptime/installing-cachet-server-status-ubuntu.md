---
author:
    name: Fuzzy
    email: fuzzy@thefuzz.xyz
description: 'How to install Cachet server status page on Ubuntu'
keywords: 'cachet, status page, ubuntu, server status, uptime, monitor'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 0th, 2015'
modified: Weekday, Month 0th, 2015
modified_by:
    name: Linode
title: Installing Cachet status page on Ubuntu
contributor:
    name: Fuzzy
    link: https://twitter.com/fuzzymannerz
external_resources:
 - '[Cachet Website](https://cachethq.io/)'
 - '[Cachet on Github](https://github.com/cachethq/Cachet)'
 - '[Cachet Docs](https://docs.cachethq.io/docs/)'
---

**[Cachet](https://cachethq.io/)** is a beautiful looking open source service status page that's easy to setup and use.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Pre-Cachet Setup

### Install The Dependencies

1. Add the *PPA repo* for *PHP*:

        add-apt-repository ppa:ondrej/php5-5.6

2. Install *Git* and *Supervisor*:

        apt-get install git supervisor

3. If you don't already have *Apache*, *curl* and *MySQL* installed, you'll need these too but if you already have them then you can just skip this step.
        
        apt-get install apache2 mysql-server mysql-client curl

    You'll be asked for a MySQL root password, be sure to enter something you'll remember.    

4.  Install the PHP dependencies:

        apt-get install php5 php-pear php5-apcu php5-cli php-db php5-intl php5-mysql php5-mcrypt php5-readline

5. Download *Composer*:
        
        curl -sS https://getcomposer.org/installer | php

6. Then move it to `/usr/local/bin/composer` so that the system knows where to find it:
        
        mv composer.phar /usr/local/bin/composer

### Setting up a MySQL Database

Cachet need a *MySQL* database to store your settings and such.

1. Login to MySQL

        mysql -u root -p

2. Create a database for Cachet:

        CREATE DATABASE cachet;

3. Give the database a user and password:

        GRANT ALL PRIVILEGES ON cachet.* TO 'cachet'@'localhost' IDENTIFIED BY 'whatever password you want here';

4. Flush the priveleges and exit MySQL:

        FLUSH PRIVILEGES;
        QUIT;

## Install & Configure Cachet

### Get Cachet

We'll get Cachet from *GitHub* as that way you can download the latest version if you wish.

1. Navigate to the Apache web files directory:

        cd /var/www

2. Clone Cachet using `git` and change into its directory:

        git clone https://github.com/cachethq/Cachet.git
        cd Cachet

3. Check for available versions:

        git tag -l

4. Checkout a version. For the sake of this guide we will use `v2.0.0-beta2`.

        git checkout v2.0.0-beta2

5. Edit the config example file:
        
        nano .env.example

    The main parts that need to be changed are as follows:

        APP_URL=http://YOUR WEBSITE LINK
        APP_DEBUG=false
        DB_HOST=localhost  
        DB_DATABASE=cachet  
        DB_USERNAME=cachet  
        DB_PASSWORD=MysqlDatabasePassword
    You can change the SMTP setting if you wish for Cachet to send out e-mails to subscribers.    
    The part that says `APP_KEY=` can be left default as it gets automatically filled in later.


    {: .caution}
    >
    >If you have `APP_DEBUG=true` and there is an error, your MySQL details will be publicly visible to anyone visiting the site. This includes your password! Be sure to make it `false` when in production!

6. Save and exit with **CTRL+O** then **CTRL+X** and hit **Y** to save.

7. Rename the example file to just `.env`:

        mv .env.example .env

8. Run the composer:
 
        composer install --no-dev -o

9. When it's done we need to setup the database with:

        php artisan migrate


    {: .note}
    >
    >If you get an error at this stage it means your MySQL details are incorrect in the .env file. If this is the case edit it again and then continue from step eight.

10. Generate a key for the `APP_KEY=` part of the `.env` file:
 
        php artisan key:generate


    {: .caution}
    >
    >If you go back and change or edit this key you will lose database data!

### Setting up Apache

1. Open `000-default.conf` with nano:
 
        nano /etc/apache2/sites-enabled/000-default.conf

2. Remove everything by holding down **CTRL+K**.

3. Paste in the following text and replace the two `status.example.com` with your site info:
 
        <VirtualHost *:80>  
             ServerName status.example.com
                ServerAlias status.example.com
                ServerAdmin webmaster@localhost
                DocumentRoot /var/www/Cachet/public
                ErrorLog ${APACHE_LOG_DIR}/error.log
                CustomLog ${APACHE_LOG_DIR}/access.log combined
        <Directory "/var/www/Cachet/public">  
                Require all granted
                Options Indexes FollowSymLinks
                AllowOverride All
                Order allow,deny
                Allow from all
        </Directory>  
        </VirtualHost>

4. Save with **CTRL+O**, overwrite changes with **Y** then **CTRL+X** to exit.

5. Let Apache own the files and folders:
 
        chown -R www-data:www-data /var/www/Cachet
        chmod -R guo+w /var/www/Cachet/storage/

6. Make sure you have *mod rewrite* enabled:
 
        a2enmod rewrite

7. Restart apache with `service apache2 restart`.

### Done!
If you navigate to your site, it should all be working fine and present you with a setup page.

If at anytime you change things or run into problems you can clear the config cache with `php artisan config:clear`, just make sure you `cd /var/www/Cachet` first.

### Issues
If you get a blank page then make sure you have all the PHP dependencies installed and then try `composer install --no-dev -o` again and then `php artisan config:clear` sometimes a `reboot` also does the trick and kicks it into action.    
Changing `APP_DEBUG=false` to `APP_DEBUG=true` will show you the errors on the site, if any.