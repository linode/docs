---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing Roundcube and its dependencies on Ubuntu 14.04 LTS'
keywords: '14.04,IMAP,LTS,Roundcube,Ubuntu,webmail'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Sunday, December 12th, 2015'
title: 'Installing Roundcube on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

Roundcube is a web-based IMAP email client that offers an user interface similar to Google’s Gmail or Microsoft’s Hotmail. It is a server-side application written in PHP designed to access **one** email server or service. Email users interact with Roundcube over the internet using a web browser.

## Prerequisites

- A Linode server running Ubuntu 14.04. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- A functioning email server. This guide is designed to work with our [Installing Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) tutorial, but you **can** use a different mail server. Replace `localhost` with the Fully Qualified Domain Name (FQDN) or IP address of your email server if ...
- A functioning [LAMP (Apache, MySQL, and PHP) stack](/docs/websites/lamp/lamp-server-on-ubuntu-14-04)
- In addition to a LAMP stack, an [SSL virtual host](/docs/security/ssl/ssl-certificates-with-apache-2-on-ubuntu)

## Creating a MySQL Database and User

1. Log into the MySQL command prompt as the root user.

        mysql -u root -p

2. Enter the password for your root MySQL user.

        Password: <your invisible password>

{: .note }
>
> Your password will not be shown on screen as you type it. This is a security feature built into most linux programs to protect your password from people standing behind you; it is not a programming glitch.

3. Once logged in and a `mysql>` prompt is shown, create a new MySQL database called `roundcubemail`.

        CREATE DATABASE roundcubemail;

{: .note }
>
> The trailing semicolon (`;`) tells MySQL where one command ends and the next begins.

4. Visit [Secure Password Generator](http://passwordsgenerator.net) and generate a 15 character randomized password, making sure to check the **Exclude Ambiguous Characters** checkbox.

This will help secure your MySQL database against *brute-force* attacks, where the attacking computer keeps guessing passwords until it guesses the right one. Brute-force attacks usually guess passwords that contain common words, phrases, or numbering sequences (e.g. "newark123").

5. Create a new MySQL user called `roundcube` and replace `3ENDqKF4jX6fNQh9` with the password you just generated in step four.

        CREATE USER 'roundcube'@'localhost' IDENTIFIED BY '3ENDqKF4jX6fNQh9';

6. Grant the new user `roundcube` full access to Roundcube’s database `roundcubemail`.

        GRANT ALL PRIVILEGES ON roundcubemail.* TO 'roundcube'@'localhost';

7. Flush your MySQL privileges.

        FLUSH PRIVILEGES;

MySQL stores its privilege tables in your server’s memory, so it needs to re-fetch the updated privilege tables from your Linode’s storage and reload it the memory.

8. Log out of the MySQL command prompt and return to a regular linux shell prompt.

        exit

## Preparing for Roundcube

1. Install and enable the packages `php-pear`, `php5-intl`, and `php5-mcrypt`.

        sudo apt-get install php-pear php5-intl php5-mcrypt && sudo php5enmod intl mcrypt

2. Enable the Apache modules `deflates`, `expires`, `headers` and `rewrite`.

        sudo a2enmod deflates expires headers rewrite

3. Additionally, install the PHP PEAR packages `Auth_SASL`, `Net_SMTP`, `Net_IDNA2-0.1.1`, `Mail_mime`, and `Mail_mimeDecode`.

        sudo pear install Auth_SASL Net_SMTP Net_IDNA2-0.1.1 Mail_mime Mail_mimeDecode

: .note }
>
> PEAR is an acronym for "PHP Extension and Application Repository". Common PHP code libraries, written officially or by third parties, can be easily installed and referenced using the `pear` command.

PEAR will print an **install ok** confirmation message for each package that it successfully installs. In this case, a complete installation will look similar to this:

        install ok: channel://pear.php.net/Auth_SASL-1.0.6
        install ok: channel://pear.php.net/Net_SMTP-1.7.1
        install ok: channel://pear.php.net/Net_IDNA2-0.1.1
        install ok: channel://pear.php.net/Mail_mime-1.10.0
        install ok: channel://pear.php.net/Mail_mimeDecode-1.5.5

4. Lastly, make sure your linux shell prompt is operating inside your UNIX user's home directory. The `~/Downloads` folder is preferable, but `~/` is also acceptable. We won't judge.

        cd ~/Downloads

## Downloading and Installing Roundcube

1. Download Roundcube version 1.1.3.

        wget http://downloads.sourceforge.net/project/roundcubemail/roundcubemail/1.1.3/roundcubemail-1.1.3.tar.gz

If the **Stable > Complete** package listed at [Roundcube’s download page](https://roundcube.net/download/) is newer than `1.1.3`, replace any occurances of the older version number with the newer one in the command below.

2. Decompress and copy Roundcube to the `/var/www/html/example.com/public_html` directory. Again, replace any occurrences of `1.1.3` in the filename with the newer version number.

        sudo tar -zxvf roundcubemail-1.1.3.tar.gz -C /var/www/html/example.com/public_html

3. Eliminate the version number from Roundcube's directory name. This will shorten your Linode's Roundcube URL and make updating easier later on down the road.

        sudo mv /var/www/html/example.com/public_html/roundcube-1.1.3 /var/www/html/example.com/public_html/roundcube

4. Grant Apache write access to Roundcube’s directory. This will allow Roundcube to save its own configuration file, instead of you having to download it and manually upload it to your Linode later in this tutorial.

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html/roundcube

5. Lastly, you should enable Roundcube's automatic cache cleaning shell script.

        echo '0 0 * * * root bash /var/www/html/example.com/public_html/roundcube/bin/cleandb.sh' | sudo tee --append /etc/crontab

The command above utilizes a *cron job* to run the `cleandb.sh` shell script included with Roundcube once per day at midnight. Read our [Scheduling Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron) guide to learn about Cron.

## Configuring Roundcube

1. Specify your Linode's time zone in the `/etc/php5/apache2/php.ini` PHP configuration file. If you are not using `UTC`, replace it with your local [timezone listed on PHP.net](http://nl1.php.net/manual/en/timezones.php).

        sudo sed -i -e "s/^;date\.timezone =.*$/date\.timezone = 'UTC'/" /etc/php5/apache2/php.ini

2. Restart Apache to apply your PHP timezone addition.

        sudo service apache2 restart

3. Launch your favorite web browser and navigate to `http://example.com/roundcube/installer`. Make sure to replace `example.com` with the FQDN or IP address of your Linode.

4. Begin configuring Roundcube. The first step of Roundcube’s graphical configuration is an *environment check*. Click on the **NEXT** button at the bottom of the page to continue.

{: .note }
>
> Since Roundcube supports six different SQL engines, five **NOT AVAILABLE** warnings will appear under the **Checking available databases** section. You just installed MySQL, so you can ignore those warnings.

5. Specify your Roundcube configuration options. The list of options below will get you a proper, working configuration, but you can adjust any unmentioned options as you see fit.

- **General configuration > product_name:** Name of your email service (e.g. **Linode Webmail** or **University of Michigan Webmail**)
- **General configuration > support_url:** Where should your users go if they need help? A URL to a web-based contact form or an email address should be used. (e.g. `http://example.com/support` or `mailto:support@example.com`)
- **General configuration > skin_logo:** Replaces the default Roundcube logo with an image of your choice. The image must be located within the `/var/www/html/example.com/public_html/roundcube` directory and be linked relatively (e.g. `skins/larry/linode.png`). Recommended image resolution is `177px` by `49px`
- **Database setup > db_dsnw > Database password:** Password for the **roundcube** MySQL user you created in step one (e.g. `3ENDqKF4jX6fNQh9`).
- **IMAP Settings > default_host:** Hostname of your IMAP server. Use `ssl://localhost` to access the local server (i.e. your server) using OpenSSL
- **IMAP Settings > default_port:** TCP port for incoming IMAP connections to your server. Use port `993` to ensure OpenSSL is used
- **IMAP Settings > username_domain:** What domain name should Roundcube assume all users are part of? This allows users to only have to type in their email username (e.g. **somebody**) instead of their full email address (e.g. `somebody@example.com`)
- **SMTP Settings > smtp_server:** Hostname of your SMTP server. Use `ssl://localhost` to access the local server (i.e. your server) using OpenSSL
- **SMTP Settings > smtp_port:** TCP port for incoming SMTP connections to your server. Use port `587` to ensure OpenSSL is used
- **SMTP Settings > smtp_user/smtp_pass:** Click and check the **Use the current IMAP username and password for SMTP authentication** checkbox so that users can send mail without re-typing their user credentials
- **Display settings & user prefs > language:** Allows you to select a default [RFC1766](http://www.faqs.org/rfcs/rfc1766)-compliant *locale* for Roundcube. A locale is used to set language and user interface options for users based on their language and country. For example, while **G**reat **B**ritain and the **U**nited **S**tates both use **En**glish as their primary language, some of their grammar rules and spellings are different. Thus, Britain's RFC1766 locale is `en_GB` and the United States’ is `en_US`.
- **Display settings & user prefs > draft_autosave:** Due to services like Gmail and Hotmail, most users will expect their drafts to be saved almost instantaneously while they type them. While Roundcube does not offer instantaneous draft saving as an option, it can save a user’s draft every minute. Select `1 min` from the dropdown menu

6. Click on the **CREATE CONFIG** button toward the bottom of the webpage to save your new configuration. You should see a **The config file was saved successfully into RCMAIL_CONFIG_DIR directory of your Roundcube installation** confirmation message on the corresponding page.

7. Complete the configuration by clicking **CONTINUE**.

[![Roundcube configuration saved successfully](/docs/assets/roundcube-configuration-saved-successfully.png)]

8. Lastly, import Roundcube’s MySQL database structure by clicking on the **Initialize database** button.

[![Roundcube MySQL database initialization](/docs/assets/roundcube-mysql-database-initialization.png)]

## Securing Roundcube’s Installation

### Removing the Installer Directory

1. Delete the `/var/www/html/example.com/public_html/roundcube/installer` directory, which contains the web page files we just used to configure Roundcube.

        sudo rm -rf /var/www/html/example.com/public_html/roundcube/installer

While Roundcube automatically disabled the installer functionality within its configuration file, deleting the installer directory adds another layer of protection against hackers.

### Configuring Apache Directory Permissions

1. Create a new configuration file called `roundcube.conf` in the `/etc/apache2/conf-available` directory.

        sudo touch /etc/apache2/conf-available/roundcube.conf

2. Open your new configuration file in `nano`.

        sudo nano /etc/apache2/conf-available/roundcube.conf

3. Copy the directory permission rules below and paste them into your configuration file. Use **CTRL + SHIFT + V** to paste into the Linux Terminal and Windows Command Prompt, or use **COMMAND + V** to paste into the Mac OS X Terminal.

~~~
<Directory /var/www/html/example.com/public_html/roundcube>
	Options -Indexes
	AllowOverride All
</Directory>

<Directory /var/www/html/example.com/public_html/roundcube/config>
	Order Deny,Allow
	Deny from All
</Directory>

<Directory /var/www/html/example.com/public_html/roundcube/temp>
	Order Deny,Allow
	Deny from All
</Directory>

<Directory /var/www/html/example.com/public_html/roundcube/logs>
	Order Deny,Allow
	Deny from All
</Directory>
~~~

4. Save your changes (**CTRL + X** followed by **Y**, then **ENTER** or **RETURN**) and exit `nano`.

5. Create a symbolic link of `/etc/apache2/conf-available/roundcube.conf` in the `../conf-enabled` directory.

        sudo ln -s /etc/apache2/conf-available/roundcube.conf /etc/apache2/conf-enabled/roundcube.conf

6. Restart Apache to apply your directory permission changes.

        sudo service apache2 restart

### Forcing HTTPS

The second, and perhaps most important, thing you can do to secure your Roundcube installation is force HTTPS encryption. This will encrypt *all* of the data moving between your Linode and your users (interacting with Roundcube), which is otherwise vulnerable traveling over the public internet.

1. Open Roundcube's `.htaccess` file using `nano`.

        sudo nano /var/www/html/example.com/public_html/roundcube/.htaccess

2. Copy the Apache URL rewriting rule below and paste it into `nano`.

        ~~~
        <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteCond %{SERVER_PORT} 80
        RewriteCond %{REQUEST_URI} roundcube
        RewriteRule ^(.*)$ https://www.example.com/roundcube/$1 [R,L]
        </IfModule>
        ~~~

3. Replace `example.com` with the FQDN or IP address of your Linode.

4. Save you changes and exit `nano`.

## Testing Roundcube’s Installation

1. Navigate to `https://example.com/roundcube` and log in using the your email account's username and password.

[![Roundcube login](/docs/assets/roundcube-login.png)]

{: .note }
>
> If your email address is `somebody@example.com`, you only have to enter **somebody** as your username. Roundcube assumes that all users exist at `example.com`.

2. If your configuration is functional, Roundcube will allow you to receive, read, and send emails from inside and outside of your domain name.

## Knowing How to Update Roundcube

1. Compare the **Stable > Complete** package version listed on [Roundcube's download page](http://roundcube.net/download/) to the version currently installed on your Linode.

2. If a newer version is available, replace any occurrences of `1.1.3` with the newest version in the command below. This will download Roundcube to your `~/Downloads` directory.

        cd ~/Downloads && wget http://downloads.sourceforge.net/project/roundcubemail/roundcubemail/1.1.3/roundcubemail-1.1.3.tar.gz

3. Extract and unzip the *gzipped tarball* (`.tar.gz`) to `~/Downloads`.

        tar -zxvf roundcubemail-1.1.3.tar.gz

4. Begin updating Roundcube by executing the `/var/www/html/example.com/public_html/roundcube/bin/installto.sh` PHP script. If you did not install Roundcube in the `/var/www/html/example.com/public_html/roundcube` directory, replace the trailing directory with that of Roundcube's on your server.

        cd roundcubemail-1.1.3
        sudo php bin/installto.sh /var/www/html/example.com/public_html/roundcube

{: .note }
>
> Roundcube is not installed from a Debian software repository, so you cannot use `sudo apt-get upgrade` to update it.

5. Press the **Y** key followed by **ENTER** to confirm the update. A successful upgrade will print something similar to this in your Terminal:

        Upgrading from 1.1.3. Do you want to continue? (y/N)
        y
        Copying files to target location...sending incremental file list

        …

        Running update script at target...
        Executing database schema update.
        This instance of Roundcube is up-to-date.
        Have fun!
        All done.

**All done** means the update was successful; unless you don't see this message, proceed to step six.

6. Delete the Roundcube directory and gzipped tarball from `~/Downloads`.

        cd ~/Downloads && rm -rfd roundcubemail-1.1.3 roundcubemail-1.1.3.tar.gz

## Conclusion

Now that you have installed Roundcube, you have your very own free, web-based email client similar to Google’s Gmail or Microsoft’s Hotmail. Users can access their email by navigating to `https://example.com/roundcube`.

From here, you can [install plugins to add additional functionality](http://trac.roundcube.net/wiki/Doc_Plugins) and [customize the theme](http://trac.roundcube.net/wiki/Doc_Skins) to match your organization’s color scheme.
