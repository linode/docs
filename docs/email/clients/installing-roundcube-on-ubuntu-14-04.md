---
author:
    name: Sean Webber
    email: swebber@yazzielabs.com
description: 'Installing Roundcube and its dependencies on Ubuntu 14.04 LTS'
keywords: 'IMAP,Roundcube,webmail'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: Sunday, November 30th, 2015
modified_by:
    name: Sean Webber
title: 'Installing Roundcube on Ubuntu 14.04'
contributor:
    name: Sean Webber
    link: http://seanthewebber.com
---

## Introduction

Roundcube is a web-based IMAP email client that offers an user interface similar to Google’s Gmail or Microsoft’s Hotmail. It is a server-side application written in PHP designed to access only one email server or service. Email users interact with Roundcube over the internet using a web browser.

## Prerequisites

- A Linode server running Ubuntu 14.04. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- A functioning email server. You are welcome to use any type of email server, but we recommend using our guide on [Installing Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql). If you plan on installing Roundcube on a Linode other than your email server, you need to replace `localhost` with the domain name or IP address of your email server
- A functioning [LAMP (Apache, MySQL, and PHP) stack](/docs/websites/lamp/lamp-server-on-ubuntu-14-04) on your Linode
- In addition to a LAMP stack, an [SSL virtual host](/docs/security/ssl/ssl-certificates-with-apache-2-on-ubuntu)

## Creating a MySQL Database and User

Roundcube needs a SQL database to store session information about active users. Since you already installed MySQL as a prerequisite, you can use it for Roundcube as well. Log into the MySQL command prompt as the root user.

        mysql -u root -p

Enter the password for your root MySQL user. It will not be shown on your screen as you type it. This is a security feature built into most linux programs to protect your password from people standing behind you; it is not a programming glitch.

        Password: (Your invisible password)

Once you are logged in, you will see this:

        mysql>

This is a MySQL command prompt. It is similar to a typical `somebody@your_server:~$` linux shell prompt, but for MySQL instead. First, create the database.

        CREATE DATABASE roundcubemail;

{: .note }
>
> The trailing semicolon (`;`) after the command tells MySQL where one command ends and the next begins.

Before you create a MySQL user, head over to the [Secure Password Generator](http://passwordsgenerator.net) and generate a 15 character randomized password making sure to check the **Exclude Ambiguous Characters** checkbox. This will help secure your MySQL database against *brute-force* attacks, where the attacking computer keeps guessing passwords until it guesses the right one. Brute-force attacks usually guess passwords that contain common words, phrases or numbering sequences (e.g. newark123). Replace the password `3ENDqKF4jX6fNQh9` below with the password you have generated.

        CREATE USER 'roundcube'@'localhost' IDENTIFIED BY '3ENDqKF4jX6fNQh9';

Grant the new user `roundcube` full access to Roundcube’s database `roundcubemail`.

        GRANT ALL PRIVILEGES ON roundcubemail.* TO 'roundcube'@'localhost';

You need to flush your MySQL privileges. MySQL stores its privilege tables in your server’s memory, so it needs to re-fetch the updated privilege tables from your Linode’s storage and reload it the memory.

        FLUSH PRIVILEGES;

Log out of the MySQL command prompt and return to a regular linux shell prompt.

        exit

## Preparing for Roundcube

Before you download Roundcube, install and enable the packages `php-pear`, `php5-intl`, and `php5-mcrypt`.

        sudo apt-get install php-pear php5-intl php5-mcrypt && sudo php5enmod intl mcrypt

Next, enable the Apache modules `deflates`, `expires`, `headers` and `rewrite`.

        sudo a2enmod deflates expires headers rewrite

You also need to install the PHP PEAR packages `Auth_SASL`, `Net_SMTP`, `Net_IDNA2-0.1.1`, `Mail_mime`, and `Mail_mimeDecode`.

        sudo pear install Auth_SASL Net_SMTP Net_IDNA2-0.1.1 Mail_mime Mail_mimeDecode

: .note }
>
> PEAR is an acronym for "PHP Extension and Application Repository". Common PHP code libraries, written officially or by third parties, can be easily installed and referenced using the `pear` command.

PEAR will print an **install ok** confirmation message for each package that it successfully installs. In this case, a complete installation will look similar to this:

{: .file-excerpt}
/dev/stdout
:   ~~~ ini
    install ok: channel://pear.php.net/Auth_SASL-1.0.6
    install ok: channel://pear.php.net/Net_SMTP-1.7.1
    install ok: channel://pear.php.net/Net_IDNA2-0.1.1
    install ok: channel://pear.php.net/Mail_mime-1.10.0
    install ok: channel://pear.php.net/Mail_mimeDecode-1.5.5
    ~~~

Lastly, make sure your linux shell prompt is operating inside your UNIX user's home directory. The `~/Downloads` folder is preferable, but `~/` is also acceptable. We won't judge.

        cd ~/Downloads

## Downloading and Installing Roundcube

The following command will download Roundcube version `1.1.3`. Our editors are busy, so that may not download the latest version of Roundcube. To check for a later version, go to [Roundcube’s download page](https://roundcube.net/download/) and compare the **Stable > Complete** package’s version to the one listed here.

[![Roundcube download webpage](/docs/assets/roundcube-download-webpage.png)]

If the versions are different, right click on the **Download** button for the **Stable > Complete** package, click on **Copy link address** (Or something similar to that depending on your web browser). Replace any occurrences of `1.1.3` in the URL below with the newer version number on Roundcube’s download page.

        wget http://downloads.sourceforge.net/project/roundcubemail/roundcubemail/1.1.3/roundcubemail-1.1.3.tar.gz

{: .note }
>
> The `.tar.gz` file extension means that Roundcube downloads as a *compressed tarball*. Tarballs are used to package many files as one, similar to Windows ZIP folders, but without the compression. In this case, the tarball was compressed using `gzip`, which makes up for the lack of compression.

To decompress and copy Roundcube to the `/var/www/html/example.com/public_html` directory, execute the command below. Again, replace any occurrences of `1.1.3` in the filename with the newer version number.

        sudo tar -zxvf roundcubemail-1.1.3.tar.gz -C /var/www/html/example.com/public_html

To make Roundcube’s URL on your Linode version-neutral, execute the following command. It will change Roundcube’s directory name from `roundcubemail-1.1.3` to `roundcube`. Doing so also makes the URL shorter for your users to type into their web browsers.

        sudo mv /var/www/html/example.com/public_html/roundcube-1.1.3 /var/www/html/example.com/public_html/roundcube

Next, grant Apache write access to Roundcube’s directory. This will allow Roundcube to save its own configuration file, instead of you having to download it and manually upload it to your Linode later in this tutorial.

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html/roundcube

Lastly, you should add Roundcube’s `cleandb.sh` shell script as a *Cron job* on your Linode. In this case, the `cleandb.sh` shell script located in the `/var/www/html/example.com/public_html/roundcube/bin` directory will run every 24 hours at midnight. According to Roundcube’s developers, the script removes no longer needed temporary data from Roundcube’s MySQL database.

{: .note }
>
> A Cron job is a task scheduled in advance by a system administrator (you) and executed using the `cron` program. It allows system administrators to schedule commands to be run on their servers at set times, dates and intervals in the future automatically.

        sudo echo '0 0 * * * root bash /var/www/html/example.com/public_html/roundcube/bin/cleandb.sh > /dev/null' >> /etc/crontab

## Configuring Roundcube

Before you configure Roundcube, you should make sure that your Linode’s timezone is specified in PHP’s `/etc/php5/apache2/php.ini` configuration file. Instead of opening the file in the text editors `nano` or `vim`, you can use the command below to set the PHP timezone. If your server is not using `UTC`, replace it with the correct [PHP timezone listed on PHP.net](http://nl1.php.net/manual/en/timezones.php). For example, if your Linode is located in our **US East** region, you could use the timezone `America/New_York`.

        sudo sed -i -e "s/^;date\.timezone =.*$/date\.timezone = 'UTC'/" /etc/php5/apache2/php.ini

Restart Apache to apply your PHP timezone addition.

        sudo service apache2 restart

To begin configuring Roundcube, use your favorite web browser and navigate to `http://example.com/roundcube/installer`. Make sure to replace `example.com` with the domain name or IP address of your Linode.

The first step of Roundcube’s graphical configuration is an *environment check*. Since you have already installed everything it needs, you will only see five **NOT AVAILABLE** warnings under the **Checking available databases** section. That is because Roundcube supports six different SQL engines, but only needs one. Click on the **NEXT** button at the bottom of the page to continue.

Now you are ready to specify your Roundcube configuration options. The list of options below will get you a proper, working configuration, but you can adjust any unmentioned options as you see fit.

- **General configuration > product_name:** Name of your email service (e.g. **Linode Webmail** or **University of Michigan Webmail**)
- **General configuration > support_url:** Where should your users go if they need help? A URL to a web-based contact form or an email address should be used. (e.g. `http://example.com/support` or `mailto:support@example.com`)
- **General configuration > skin_logo:** Replaces the default Roundcube logo with an image of your choice. The image must be located within the `/var/www/html/example.com/public_html/roundcube` directory and be linked relatively (e.g. `skins/larry/linode.png`). Recommended image resolution is `177px` by `49px`
- **Database setup > db_dsnw > Database password:** Password for the **roundcube** MySQL user you created in step one (e.g. 3ENDqKF4jX6fNQh9).
- **IMAP Settings > default_host:** Hostname of your IMAP server. Use `ssl://localhost` to access the local server (i.e. your server) using OpenSSL
- **IMAP Settings > default_port:** TCP port for incoming IMAP connections to your server. Use port `993` to ensure OpenSSL is used
- **IMAP Settings > username_domain:** What domain name should Roundcube assume all users are part of? This allows users to only have to type in their email username (e.g. `**somebody**`) instead of their full email address (e.g. `**somebody**@example.com`)
- **SMTP Settings > smtp_server:** Hostname of your SMTP server. Use `ssl://localhost` to access the local server (i.e. your server) using OpenSSL
- **SMTP Settings > smtp_port:** TCP port for incoming SMTP connections to your server. Use port `587` to ensure OpenSSL is used
- **SMTP Settings > smtp_user/smtp_pass:** Click and check the **Use the current IMAP username and password for SMTP authentication** checkbox so that users can send mail without re-typing their user credentials
- **Display settings & user prefs > language:** This allows you to select a default [RFC1766](http://www.faqs.org/rfcs/rfc1766)-compliant *locale* for Roundcube. A locale is used to set language and user interface options for users based on their language and country. For example, while **G**reat **B**ritain and the **U**nited **S**tates both use **En**glish as their primary language, some of their grammar rules and spellings are different. Thus, Britain's RFC1766 locale is `en_GB` and the United States’ is `en_US`.
- **Display settings & user prefs > draft_autosave:** Due to services like Gmail and Hotmail, most users will expect their drafts to be saved almost instantaneously while they type them. While Roundcube does not offer instantaneous draft saving as an option, it can save a user’s draft every minute. Select `1 min` from the dropdown menu

Click on the **CREATE CONFIG** button at the bottom of the webpage to save your new configuration. The message **The config file was saved successfully into RCMAIL_CONFIG_DIR directory of your Roundcube installation.** will be displayed near the top of the corresponding webpage. Click on the **CONTINUE** button to complete your configuration.

[![Roundcube configuration saved successfully](/docs/assets/roundcube-configuration-saved-successfully.png)]

The next webpage will display more environment checks to make sure everything on your server is configured properly. **DB Schema** will still have a red **NOT OK** warning message next to it. This is because Roundcube has not imported its MySQL database structure into its database yet. Click on the **Initialize database** button to import Roundcube’s MySQL database structure into its database.

{: .note }
>
> MySQL databases use a structure similar to a Google Docs or Microsoft Office Excel Spreadsheets to store data in columns and rows.

[![Roundcube MySQL database initialization](/docs/assets/roundcube-mysql-database-initialization.png)]

## Securing Roundcube’s Installation

### Removing the Installer Directory

You should delete the `/var/www/html/example.com/public_html/roundcube/installer` directory, which contains the files of the webpage you just used to configure Roundcube. While Roundcube has automatically disabled the installer functionality within its configuration file, not deleting the installer directory only leaves you one line of defence against hackers.

        sudo rm -rf /var/www/html/example.com/public_html/roundcube/installer

Deleting the installer directory creates two lines of defence; the more lines of defences you have in any computer system, the better.

### Forcing HTTPS

The second, and perhaps most important, thing you need to do to secure your Roundcube installation is forcing HTTPS encryption. It will encrypt the data moving between your Linode and your users (interacting with Roundcube), which is very vulnerable since it is travelling over the public internet.

To force clients who do not request HTTPS to use an encrypted connection, add an URL rewriting rule to Roundcube’s `.htaccess` file. Open the file using `nano`.

        sudo nano /var/www/html/example.com/public_html/roundcube/.htaccess

Highlight the text below, right click on it and select **Copy**.

{: .file-excerpt }
/var/www/html/example.com/public_html/roundcube/.htaccess
: ~~~
        <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{SERVER_PORT} 80
        RewriteCond %{REQUEST_URI} roundcube
        RewriteRule ^(.*)$ https://www.example.com/roundcube/$1 [R,L]
        </IfModule>
~~~

Within your Terminal window, use the arrow keys on your keyboard to move your cursor to the end of the file. Right click on the Terminal and select **Paste**. The text above will appear inside of nano. Replace `example.com` to match your configuration.

Press the `CONTROL + X` keys simultaneously for a moment. The bottom of nano will ask you this:

        Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES) ?                    
        Y Yes
        N No           ^C Cancel

Press the `Y` key on your keyboard to save your changes and force.

## Testing Roundcube’s Installation

To verify that Roundcube is functional and able to connect to your email server, you need to log into Roundcube and try a few things:

- Can you read emails you have received in the past?
- Can you send an email and verify that the recipient receives it?

Navigate to `https://example.com/roundcube` and use the username and password of your email account to log into Roundcube.

[![Roundcube login](/docs/assets/roundcube-login.png)]

{: .note }
>
> If your email address is `**somebody**@example.com`, you only have to enter `**somebody**` as your username. Roundcube assumes that any users trying to log in exist at `example.com`.

If your configuration is functional, Roundcube will allow you to receive, read, and send emails from inside and outside of your domain name.

## Knowing How to Update Roundcube

As new versions of Roundcube are released in the future, you should update it to gain new features and receive security patches.

{: .note }
>
> A **patch** means the same thing as software update, but the term is more often used to describe fixing an unexpected problem in the software rather than adding new features.

Roundcube is not installed from a Debian software repository, so you cannot use the `sudo apt-get upgrade` command to update it. You have to use the `/var/www/html/example.com/public_html/roundcube/bin/installto.sh` PHP script that is included with Roundcube instead.

To check if an update for Roundcube is available, go to [Roundcube’s download page](http://roundcube.net/download/) and compare the **Stable > Complete** package’s version to the version of Roundcube that is currently installed on your server. If the version listed is newer than the version on your server, right click on the **Download** button for the **Stable > Complete** package and click on **Copy link address**. Again, replace any occurrences of `1.1.3` in the filename with the newer version number.

        cd ~ && wget http://downloads.sourceforge.net/project/roundcubemail/roundcubemail/1.1.3/roundcubemail-1.1.3.tar.gz

Extract and unzip the tarball. Unlike the initial installation, you can extract Roundcube to your UNIX user’s home directory and not the `/var/www/html/example.com/public_html` directory. Make sure to replace the file name with the name of the file you downloaded.

        tar -zxvf roundcubemail-1.1.3.tar.gz

Execute the `/var/www/html/example.com/public_html/roundcube/bin/installto.sh` PHP script to update Roundcube. If you did not install Roundcube in the `/var/www/html/example.com/public_html/roundcube` directory, replace the trailing directory with the location of Roundcube on your server.

        cd roundcubemail-1.1.3
        sudo php bin/installto.sh /var/www/html/example.com/public_html/roundcube

The script will ask you if you are *really* sure you want to upgrade Roundcube before it begins. You need to type the letter `y` followed by the `ENTER` or `RETURN` key to start the upgrade process. A successful upgrade will show something similar to this in your Terminal:

        Upgrading from 1.1.3. Do you want to continue? (y/N)
        y
        Copying files to target location...sending incremental file list

        …

        Running update script at target...
        Executing database schema update.
        This instance of Roundcube is up-to-date.
        Have fun!
        All done.

Once **All done.** is printed to your Terminal, the update process is complete, and you can delete the Roundcube directory and tarball from your home directory.

        rm -rfd roundcubemail-1.1.3 roundcubemail-1.1.3.tar.gz

## Conclusion

Now that you have installed Roundcube, you have your very own free, web-based email client similar to Google’s Gmail or Microsoft’s Hotmail. Users can access their email by navigating to `https://example.com/roundcube`.

From here, you can [install plugins to add additional functionality](http://trac.roundcube.net/wiki/Doc_Plugins) and [customize the theme](http://trac.roundcube.net/wiki/Doc_Skins) to match your organization’s color scheme.
