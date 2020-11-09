---
slug: how-to-secure-wordpress
author:
  name: Hackersploit
description: 'How to secure your WordPress installation with SSL, secure password policies, two factor authentication, backups, and a firewall.'
og_description: 'How to secure your WordPress installation with SSL, secure password policies, two factor authentication, backups, and a firewall.'
keywords: ["how to secure wordpress site", "how to make wordpress site secure"]
tags: ["wordpress","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-10-28
modified_by:
  name: Linode
published: 2020-10-28
title: How to Secure Wordpress
h1_title: Securing Wordpress
external_resources:
- '[WordPress.org](http://wordpress.org)'
- '[WordPress Codex](http://codex.wordpress.org)'
- '[WordPress Support](http://wordpress.org/support)'
- '[Installing Plugins](https://wordpress.org/support/article/managing-plugins/#installing-plugins)'
aliases: ['/websites/cms/wordpress/how-to-secure-wordpress/']
image: How_to_Secure_WordPress.png
---

WordPress is a popular content management and website creation software system used by millions of users today. It's easy to use and offers thousands of plugins making it simple for non-developers to create beautiful websites without having to write a single line of code. This guide helps you keep your WordPress site secure with suggestions like installing SSL certificates, installing a firewall, enabling two-factor authentication, and more.

## Setting Up an SSL Certificate with CertBot

The first step in securing your WordPress installation is to ensure that you have an SSL certificate configured. You can easily generate one directly on your Linux server by using the `apache-certbot` utility.

1.  To install apache-certbot run the following command:

        sudo apt install apache-certbot python-certbot-apache

1.  You can now run the certbot command, replacing `hackersploit.org` with your domain name, so that an SSL certificate can be generated and activated:

        sudo certbot --apache -d hackersploit.org

## Enforcing a Strong Password Policy

Passwords and authentication security is an extremely important aspect of the security posture of your website. A weak password can undo all the work and security configurations you have made to secure your WordPress site. It is therefore vital to ensure that all user and administrator accounts use strong and complex passwords to prevent unauthorized logins.

A strong password policy encourages users to utilize a password generator and a password manager to keep all their passwords safe and secure.

### Password Generators

You can find various password generators for your browser of choice. This example uses the plugin [Secure Password Generator](https://addons.mozilla.org/en-US/firefox/addon/secure-password-generator/) from the Mozilla add-ons site. This allows you to generate strong and complex passwords.

![FireFox Secure Plugin Secure Password Generator](secure-password-generator.png "FireFox Secure Plugin Secure Password Generator")

This plugin allows you to set multiple options for your generated password such as:
  - How many letters to use
  - How many digits to use
  - How many and which other characters to use
  - Which characters to exclude
  - And the total length of the password

Additionally, many password managers have password generators built in. [Bitwarden](https://bitwarden.com/) is a free and open source password manager that offers both password management and generation. It's available on all platforms including browsers and mobile devices.

### Change Passwords Regularly

Another good policy to implement, is to ensure that all users on the site, including `admin`, change their passwords regularly. Setup reminders to have everyone change their passwords monthly or every 90 days.

## Change the “admin” username

By default, most WordPress installations automatically recommend the username **admin** for the administrator account. This poses an immediate threat, as most brute-force attacks on the WordPress login page use the username **admin** as it is always associated with the administrator account that has elevated privileges.

It is recommended that the username for the administrative account be something as clandestine as possible, avoid using common names or personal information. This reduces the attack surface greatly.

Most WordPress installers prompt you to specify your administrator account username before the installation. If not, you can use a plugin to change the account username after WordPress has been installed. One such plugin is [Username Changer](https://wordpress.org/plugins/username-changer/).

### Enable Two-factor Authentication

An additional layer of security that can be added to the default WordPress username and password authentication system is the use of two-factor authentication (2FA). 2FA adds an additional step to authentication. The first step involves entering your username and password and the next step entails entering an authentication code generated by your authenticator application.

To set up 2FA, you need to install a 2FA plugin for WordPress. There are plenty of options that exist; this example uses the plugin [2FAS Light - Google Authenticator](https://wordpress.org/plugins/2fas-light/).

1.  Download and install the plugin into your WordPress installation. For detailed instructions, see [installing plugins](https://wordpress.org/support/article/managing-plugins/#installing-plugins).

1.  After installing the plugin, all you need to do is scan the QR code with an authenticator app on your mobile device, a popular option is Google Authenticator.

    ![2FAS Light Google Authenticator Instructions](secure-wordpress-2fas-light.png "2FAS Light Google Authenticator Instructions")

    ![2FAS Light QR Code](secure-wordpress-2fas-light-qrcode.png "2FAS Light QR Code")

1.  After scanning the QR code, you now have an additional layer of security when you login. Now you need to provide your authentication token in addition to your username and password combinations. This is extremely effective at preventing intruders from accessing your account if they have been able to obtain your username and password either through phishing or a password leak.

    ![WordPress Two Factor Authentication Login](secure-wordpress-2fa-login.png "WordPress Two Factor Authentication Login")

## Setting Up Backups

Backups are an essential pillar of security as they offer a way to roll back changes or recover from an attack or hack. This is one of the most important security steps as it ensures that you can restore your website to its original state at any time without consequence. It is also useful if you are migrating to a different host or server as you can easily migrate from one hosting environment to another with virtually no changes to your WordPress installation.

There are many plugins available that offer backup solutions. However, most of these plugins only make a backup of your site data like images and posts. This is useful but not reliable. A much more reliable solution is to take entire backups, or snapshots, that encompass all data on your server including the database, posts, and preferences.

A great plugin that offers this snapshot functionality is called [Duplicator](https://wordpress.org/plugins/duplicator/).

![Wordpress Duplicator Backup Plugin](secure-wordpress-duplicator.png "Wordpress Duplicator Backup Plugin")

1.  Download and install the Duplicator backup plugin. For detailed instructions, see [installing plugins](https://wordpress.org/support/article/managing-plugins/#installing-plugins).

1.  After installing the plugin you can create a new backup by clicking on packages and new package.

1.  This brings up the configuration page where backup options can be specified and customized depending on your requirements. It is recommended that you leave them on their default settings.

    ![Duplicator Backup New Package Configuration](secure-wordpress-duplicator-new-package.png "Duplicator Backup New Package Configuration")

1.  After the backup process has been completed, you can download the backup package and store it in an offsite location.

    ![Duplicator Backup Package Complete](secure-wordpress-duplicator-package-complete.png "Duplicator Backup Package Complete")

    It is a good practice to ensure that your backups are stored on another server or in another location as attackers can potentially delete backups if they are stored on the same server.

## Web Application Firewall (WAF)

It is recommended to run a WAF to protect your site from web application attacks like SQL injection and cross site scripting which can be a cumbersome task to manage given the variety and quantity of potential attacks. A WAF automatically monitors, analyzes, and blocks potential threats or attacks on your site.

A recommended WAF is [Wordfence](https://wordpress.org/plugins/wordfence/). Wordfence includes an endpoint firewall and malware scanner that were built from the ground up to protect WordPress.

![WordPress Wordfence Firewall Dashboard](secure-wordpress-wordfence.png "WordPress Wordfence Firewall Dashboard")

Wordfence automatically prevents attacks, provides you with the ability to scan your website for potential security issues, and offers advice and instructions on how they can be fixed.

## Disable PHP File Execution

File execution in web applications is a potentially dangerous vulnerability that can give attackers direct access to your server and content. Attackers typically try uploading executable PHP files in the default WordPress upload directory that is typically located in in `/var/www/wordpress/wp-content/uploads/`.

You can disable file execution by typing in the following code and saving it in an `.htaccess` file in the `/var/www/wordpress/wp-content/uploads/` directory:

{{< file "/var/www/wordpress/wp-content/uploads/.htaccess" >}}
<Files *.php>
deny from all
</Files>
{{</ file >}}

## Disabling Directory Browsing

Directory browsing is a common security misconfiguration that, if left unfixed, can be used by attackers to browse through your uploaded files and images, and reveal important information like your directory structure.

![Example of Directory Browsing](secure-wordpress-directory-browsing.png "Example of Directory Browsing")

To disable directory browsing, create an `.htaccess` file in your site’s root directory.

{{< note >}}
If an `.htaccess` file already exists you do not need to create a new one, simply add the following line to the file.
{{</ note >}}

{{< file ".htaccess" >}}
Options -Indexes
{{</ file >}}

After you have created or edited the `.htaccess` file, save the file and restart your web server.
