---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing Pydio on Ubuntu 14.04 LTS'
keywords: '14.04,cloud,LTS,Pydio,storage,Ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Monday, January 25th, 2016'
title: 'Installing Pydio on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

Pydio is a web-based file storage solution that allows you to build your own cloud. Instead of depending upon someone else's infrastructure and policies, Pydio allows you to deploy your own private, secure cloud that runs on your rules. In this guide, we will install and configure Pydio on a Linode virtual private server.

## Prerequisites

- A Linode server running Ubuntu 14.04. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- An **A HOST** or **CNAME** DNS record named `storage` pointed at your Linode. Refer to our [Introduction to DNS Records](docs/networking/dns/introduction-to-dns-records) guide if you need help creating this record

## Linux, Apache, MySQL, and PHP (LAMP) Stack

This section will cover installing Apache, MySQL, PHP, and SSL on your Linode from scratch. If you already have a functioning LAMP stack, skip ahead to the **Creating an Apache Virtual Host with SSL** section.

### Installing LAMP Stack Packages

1. Update your Linode's software packages:

        sudo apt-get update && sudo apt-get upgrade

2. Install the `lamp-server^` *metapackage*, which installs Apache, MySQL, and PHP as dependencies:

        sudo apt-get install lamp-server^

3. Choose a password for the **root** MySQL user. For simplicity, use the same password as your Linode's **root** UNIX user.

4. Secure your new MySQL installation:

        sudo mysql_secure_installation

### Creating an Apache Virtual Host with SSL

We will construct a brand new *virtual host* for Pydio in this section. This creates a new webroot for Pydio, separating it from any other webroots on your Linode. Replace `storage.example.com` with the desired domain name or subdomain of your installation.

1. Position your Linode's shell prompt within the `/etc/apache2/sites-available` directory:

        cd /etc/apache2/sites-available

2. Download a copy of our `apache2-pydio.sample.conf` virtual host configuration file:

        sudo wget https://linode.com/docs/assets/apache2-pydio.sample.conf

3. Transfer the file's ownership to **root**:

        sudo chown root:root apache2-pydio.sample.conf

4. Next, change the file's access permissions to `644`:

        sudo chmod 644 apache2-pydio.sample.conf

5. Open `apache2-pydio.sample.conf` and update the following options to match your desired configuration:

        sudo nano apache2-pydio.sample.conf

- **ServerAdmin:** administrative email address for your Linode (e.x. `admin@example.com` or `webmaster@example.com`)
- **ServerName:** full domain name of the virtual host (e.x. `storage.example.com`)
- **ErrorLog (optional):** path to the custom error log file (e.x. `/var/log/apache2/storage.example.com/error.log`; uncomment by removing `# `)
- **CustomLog (optional):** path to the custom access log file (e.x. `/var/log/apache2/storage.example.com/access.log`; again, uncomment by removing `# `)

{: .caution }
>
> Make sure the custom directory and desired `.log` files exist **before** specifying it in your virtual host configuration. Failure to do so will prevent Apache from starting. The files should be owned by the `www-data` user with `644` permissions.

6. Determine what type of Secure Socket Layer (SSL) encryption certificate is best for your Pydio deployment. A [self-signed SSL certificate](/docs/security/ssl/how-to-make-a-selfsigned-ssl-certificate) is easy and free, but triggers a **your connection is not private** error message in most modern browsers. [Let's Encrypt offers browser trusted, free SSL certificates](/docs/security/ssl/obtaining-lets-encrypt-certificates-on-ubuntu-14-04), but does not support Extended Validated (EV) or multi-domain (wildcard) certificates. To gain those features, use a [commercially purchased SSL certificate](/docs/security/ssl/obtaining-a-commercial-ssl-certificate).

7. Once you have obtained a SSL certificate, update the following options to match it:

- **SSLCertificateFile:** path to the SSL certificate information (`.crt`) file
- **SSLCertificateKeyFile:** path to the SSL certificate private key (`.key`) file

8. Save your file changes and exit the text editor.

{: .note }
>
> Saving the configuration file does not affect Apache... until we explicitly enable it in the **Enabling Pydio's Apache Virtual Host** section.

9. Lastly, rename your configuration file to match its full domain name:

        sudo mv apache2-pydio.sample.conf storage.example.com.conf

### Creating a MySQL Database and User

1. Log into the MySQL command prompt as the **root** user:

        mysql -u root -p

2. Enter the password for your root MySQL user:

        Password: <your invisible password>

{: .note }
>
> Your password will not be shown on screen as you type it. This is a security feature built into most linux programs to protect your password from people standing behind you; it is not a programming glitch.

3. Once logged in and a `mysql>` prompt is shown, create a new MySQL database called `pydiodb`:

        CREATE DATABASE pydiodb;

4. Visit [Secure Password Generator](http://passwordsgenerator.net) and generate a 15 character randomized password, making sure to check the **Exclude Ambiguous Characters** checkbox.

5. Create a new MySQL user called `pydio` and replace `h84GJ7T88drBuSU` with the password you just generated in step four:

        CREATE USER 'pydio'@'localhost' IDENTIFIED BY 'h84GJ7T88drBuSU';

6. Grant the new user `pydio` full access to Pydio’s database `pydiodb`:

        GRANT ALL PRIVILEGES ON pydiodb.* TO 'pydio'@'localhost';

7. Flush the MySQL privilege tables to reload them:

        FLUSH PRIVILEGES;

8. Log out of the MySQL command prompt and return to a regular Linux shell prompt:

        exit

## Making Final Preparations for Pydio

1. Install and enable the packages `php-pear`, `php5-gd`, and `php5-mcrypt`:

        sudo apt-get install php-pear php5-gd php5-mcrypt && sudo php5enmod gd mcrypt

2. Enable the Apache modules `rewrite` and `ssl`:

        sudo a2enmod rewrite ssl

3. Open the `/etc/php5/apache2/php.ini` PHP configuration file in a text editor.

        sudo nano /etc/php5/apache2/php.ini

4. Disable the **output_buffering** option by setting it to **Off**.

{: .file}
/etc/php5/apache2/php.ini
:   ~~~ conf
    # Disable output buffering for improved Pydio performance
    output_buffering = Off
    ~~~

In `nano`, invoke the "find" dialogue using **CTRL+W** to find parameters more quickly.

5. Uncomment and specify Universal Time Coordinated (UTC) as the **date.timezone** option. If your Linode does not use UTC, choose its [local timezone listed on PHP.net](http://nl1.php.net/manual/en/timezones.php).

{: .file}
/etc/php5/apache2/php.ini
:   ~~~ conf
    #  Replace UTC with your server's local timezone if preferred
    date.timezone = 'UTC'
    ~~~

6. Save your changes and exit the text editor.

## Downloading and Installing Pydio

1. Make sure your Linode's shell prompt is operating inside your user's home directory. The `~/Downloads` folder is preferable, but `~/` is also acceptable. We won't judge:

        cd ~/Downloads

2. Download Pydio version 6.2.2:

        wget http://iweb.dl.sourceforge.net/project/ajaxplorer/pydio/stable-channel/6.2.2/pydio-core-6.2.2.tar.gz

If the **latest stable core** package listed at [Pydio's SourceForge download page](http://sourceforge.net/projects/ajaxplorer/files/pydio/stable-channel/) is newer than `6.2.2`, replace any occurrences of the older version number with the newer one in the command above.

3. Decompress and copy Pydio to the `/var/www` directory. Again, replace any occurrences of `6.2.2` in the filename with the newer version number:

        sudo tar -zxvf pydio-core-6.2.2.tar.gz -C /var/www

4. Eliminate the version number from Pydio's directory name. This will make updating easier later on down the road:

        sudo mv /var/www/pydio-core-6.2.2 /var/www/pydio

5. Transfer ownership of the renamed `/var/www/pydio` directory to the **www-data** user:

        sudo chown -R www-data:www-data /var/www/pydio

6. Now set its directory permissions to `750` and its file permissions to `640`. This prevents <insert here?>:

        sudo chmod 750 $(find /var/www/pydio -type d)
        sudo chmod 640 $(find /var/www/pydio -type f)

## Enabling Pydio's Apache Virtual Host

1. Enable the `storage.example.com` virtual host you just wrote in the **Creating an Apache Virtual Host with SSL** section:

        sudo a2ensite storage.example.com.conf

2. Restart Apache to apply *all* configuration changes and enable your new virtual host:

        sudo service apache2 restart

If `* Restarting web server apache2 ... [ OK ]` appears in your Terminal without any errors, rock on! Your new virtual host is live and you can move on to the next section.

Otherwise, use the error messages to troubleshoot your configuration. Missing files, incorrect permissions, and typos are well-known enemies to Apache.

## Configuring Pydio

1. Navigate to `https://storage.example.com` in your favorite web browser, making sure to replace `example.com` and `storage` if you chose a different subdomain name.

2. You will be greeted with the **Pydio Diagnostic Tool**. Everything except **Server charset encoding** should be **OK**. You will resolve this warning later on in the configuration. Click the **CLICK HERE TO CONTINUE TO PYDIO** button to continue.

3. Select your language and click **Start Wizard**.

4.
