---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install WordPress Using WP-CLI on Ubuntu 18.04'
og_description: 'Install WordPress Using WP-CLI on Ubuntu 18.04'
keywords: ["install WP-CLI", "ubuntu", "wordpress", "apache", "bash completion", "plugin", "WP-CLI", "themes"]
aliases: ['/websites/cms/wp-cli/how-to-install-wordpress-using-wp-cli-on-ubuntu-18-04/','/websites/cms/install-wordpress-using-wp-cli-on-ubuntu-18-04/','/websites/cms/install-and-configure-wordpress-using-wp-cli/']
tags: ["ubuntu","wordpress","cms","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-06
modified: 2020-02-17
modified_by:
    name: Linode
title: 'How to Install WordPress Using WP-CLI on Ubuntu 18.04'
h1_title: 'Install WordPress Using WP-CLI on Ubuntu 18.04'
contributor:
    name: Navjot Singh
    link: https://github.com/navjotjsingh
external_resources:
- '[WP-CLI Handbook](https://make.wordpress.org/cli/handbook/)'
- '[WP-CLI Commands](https://developer.wordpress.org/cli/commands/)'
- '[WP-CLI Tools](https://make.wordpress.org/cli/handbook/tools/)'
---

WordPress is well-known for its rich content management feature set, ease of use, and quick installation time. The [WordPress command line interface (WP-CLI)](https://wp-cli.org/) provides useful commands and utilities to install, configure, and manage a WordPress site. This guide walks you through some common tasks you can complete using the WP-CLI.

## In this Guide:

This tutorial covers how to complete the following tasks:

- [Install the WP-CLI on a Linode running Ubuntu 18.04](#install-wp-cli)
- [Install a WordPress instance using the WP-CLI](#install-wordpress)
- [Helpful and common WP-CLI commands you can use to manage your WordPress site](#common-commands)

## Prerequisites

Before moving ahead, make sure you have completed the following steps.

- If you'd like to use your own [Domain Name](/docs/networking/dns/dns-records-an-introduction/) to host your WordPress installation, ensure that your domain name is [pre-configured](/docs/platform/manager/dns-manager/#dns-set-up-checklist) to point to your Linode's IP address.
- Complete the steps in the [Getting Started with Linode](/docs/getting-started/) guide. Specifically, ensure you have completed the [Install software updates](/docs/getting-started/#debian-ubuntu), [Set your Linode's hostname](/docs/getting-started/#arch-centos-7-debian-8-fedora-ubuntu-16-04-and-above), and [Update your system's hosts file](/docs/getting-started/#update-your-system-s-hosts-file) sections.
- Follow the steps in the [How to Secure Your Server](/docs/security/securing-your-server/) guide. Ensure you complete the steps in the following [Add a limited user account](/docs/security/securing-your-server/#ubuntu) section. All steps executed in this guide will be from this account.
    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}
- Follow the [Installation](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/#installation), [Apache Configuration](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/#apache), and [PHP Configuration](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/#php) sections of the [How to Install a LAMP Stack on Ubuntu 18.04](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/) guide. Skip all other sections. This guide will cover the steps needed to configure your [Apache Virtual Hosts File](#configure-apache-virtual-hosts-file).


## Install WP-CLI

1.  WP-CLI is available as a PHP Archive file (`.phar`). You can download it using either `wget` or `curl` commands:

        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

    **Or**

        wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

1.  You need to make this `.phar` file executable and move it to `/usr/local/bin` so that it can be run directly:

        chmod +x wp-cli.phar
        sudo mv wp-cli.phar /usr/local/bin/wp

1.  Check if it is installed properly:

        wp --info

    You should see a similar output like that displayed below, which means you can proceed:

    {{< output >}}
OS:	Linux 4.15.0-50-generic #54-Ubuntu SMP Mon May 6 18:46:08 UTC 2019 x86_64
Shell:	/bin/bash
PHP binary:	/usr/bin/php7.2
PHP version:	7.2.24-0ubuntu0.18.04.2
php.ini used:	/etc/php/7.2/cli/php.ini
WP-CLI root dir:	phar://wp-cli.phar/vendor/wp-cli/wp-cli
WP-CLI vendor dir:	phar://wp-cli.phar/vendor
WP_CLI phar path:	/home/lsalazar
WP-CLI packages dir:
WP-CLI global config:
WP-CLI project config:
WP-CLI version:	2.4.0
    {{</ output >}}

    You can use the above three steps for upgrading WP-CLI as well.

### Activate Bash Completion

The bash completion feature of WP-CLI allows you to see all its available commands on the fly when pressing **Tab**. WP-CLI supports tab completion for [Bash](https://www.gnu.org/software/bash/) and [Zsh](https://en.wikipedia.org/wiki/Z_shell).

1.  Download the bash script in your home directory:

        cd ~
        wget https://github.com/wp-cli/wp-cli/raw/master/utils/wp-completion.bash

1. Edit your shell's configuration file so that wp-completion is loaded by the shell every time you open a new shell session:

    **Bash**
    - Open the `.bashrc` file and add the following line to the bottom of the file:

        {{< file "~/.bashrc" bash >}}
source /home/$USER/wp-completion.bash
{{< /file >}}

    - Run the following command to reload the bash profile:

            source ~/.bashrc

    **Zsh**

    - Open the `.zshrc`file and add the following line to the bottom of the file:

        {{< file "~/.zshrc" bash >}}
autoload bashcompinit
bashcompinit
source /home/$USER/wp-completion.bash
{{< /file >}}

    - Run the following command to reload the Zsh profile:

            source ~/.zshrc

1. Shell completion is now enabled. To test it, type `wp theme ` (include the trailing space) **Without Pressing Enter**, and press **Tab** twice. You will see the list of available commands with `wp theme` again on the prompt.

## Basics of WP-CLI

In this section, you will learn some basics of how WP-CLI works. This will help you when using the tool in the upcoming sections of the guide.

- So far, we have seen WP-CLI accessed through the main command, `wp`. You can follow the main command with nested subcommands. For example, WP-CLI includes a command to download WordPress:

    {{< note >}}
Do not issue the example `wp` command. You will install WordPress in the [Download and Configure WordPress](#download-and-configure-wordpress) section of the guide.
    {{</ note >}}

        wp core download

    In the example, `wp` is the main command while `core` and `download` are its nested subcommands. Nesting subcommands can extend one or two levels.
Î

- WP-CLI also comes with a detailed help section, which displays all the commands you might need. To access help:

        wp help

    The output should resemble:

    {{< output >}}
wp

DESCRIPTION

Manage WordPress through the command-line.

SYNOPSIS

wp <command>

SUBCOMMANDS

cache               Manage the object cache.
cap                 Manage user capabilities.
cli                 Get information about WP-CLI itself.
comment             Manage comments.
core                Download, install, update and otherwise manage WordPress proper.
cron                Manage WP-Cron events and schedules.
db                  Perform basic database operations.
eval                Execute arbitrary PHP code after loading WordPress.
eval-file           Load and execute a PHP file after loading WordPress.
:
    {{</ output >}}

   - `:` is a prompt that, with subcommands, can help you navigate through this help menu.
   - Up and down arrow keys will let you scroll through the entire help command list.
   - Typing `q` will exit the help menu.
   - For additional details on how to further navigate through the complete help section, you can always type `h` at the above prompt.
   - You can use the enabled bash completion to demonstrate WP-CLI's readily available command list. Simply type `wp` and press tab twice. You will see the list of available commands. Now, type `wp core` and press tab twice. You will see a list of commands that can be used with `core`. This double tabbing after a command can be repeated for any primary or subcommand.

## Install WordPress

In this section, you will complete the prerequisite configuration steps needed to install WordPress. Then, you will install WordPress using the WP-CLI.

### Prepare the WordPress Database

1.  Log in to the MySQL command line as the database's root user:

        sudo mysql -u root

    {{< note >}}
If you set up a password for MySQL, you would log in with the `-p` flag as well:

    sudo mysql -u root -p
{{< /note >}}


1.  Create the WordPress database:

    {{< highlight sql >}}
CREATE DATABASE wordpress;
{{< /highlight >}}

1.  Create a database user and grant them privileges for the newly created `wordpress` database, replacing `wpuser` and `password` with the username and password you wish to use:

    {{< highlight sql >}}
CREATE USER 'wpuser' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser';
FLUSH PRIVILEGES;
{{< /highlight >}}

1. Type `quit` to exit the MySQL command line.

### Download and Configure WordPress

1. Create your WordPress site's document root. Replace `example.com` with your site's name:

        sudo mkdir -p /var/www/html/example.com/public_html

1. Change the ownership of the `public_html` directory. Apache comes with its own `www-data` user and group. As a recommended practice, you should change the ownership of your installation directory to `www-data`:

        sudo chown -R www-data:www-data /var/www/html/example.com/public_html

1. Add `www-data` to your limited user account's group and give the group write permissions to your home directory. In the next step, when you install WordPress, this will allow WP-CLI to create the `.wp-cli/cache/` directory in your home directory. Replace `group` with your limited user account's group name:

        sudo adduser www-data group
        sudo chmod 775 $HOME

1.  Download the WordPress files. Here, you need to use the prefix `sudo -u www-data` for running WP-CLI commands under `www-data` group. You will need to use this every time you run a command which requires WP-CLI to write to the directory, like installing or upgrading:

        cd /var/www/html/example.com/public_html
        sudo -u www-data wp core download

1.  Create a `wp-config.php` file. Replace `wpuser` and `password` with your WordPress database user and password. `dbhost` and `dbprefix` are entirely optional and can be omitted unless you need to change their default values:

        sudo -u www-data wp core config --dbname='wordpress' --dbuser='wpuser' --dbpass='password' --dbhost='localhost' --dbprefix='wp_'

1.  Run the installation. Replace `adminuser` with the username you'd like to login to WordPress, and replace `password` with a unique password. Replace `example.com` with your domain, or replace it with your IP address if you haven't set up a domain yet:

        sudo -u www-data wp core install --url='http://example.com' --title='Blog Title' --admin_user='adminuser' --admin_password='password' --admin_email='email@domain.com'

### Configure Apache Virtual Hosts File

You will need to configure Apache so that you can access your WordPress site from a browser.

1. Disable the default Apache virtual host file.

        sudo a2dissite *default

1. Create directories for your WordPress site's Apache error and access logs:

        sudo mkdir /var/log/apache2/example.com/

1. Create your WordPress site's Apache error and access log files:

        sudo touch /var/log/apache2/example.com/access.log
        sudo touch /var/log/apache2/example.com/error.log

1. Navigate to your `/var/www/html/example.com` directory if you are not already there:

        cd /var/www/html/example.com

1. Create the virtual host file for your website. Replace the `example.com` in `example.com.conf` with your domain name:

        sudo nano /etc/apache2/sites-available/example.com.conf

1. Create a configuration for your virtual host. Copy the basic settings in the example below and paste them into the virtual host file you just created. Replace all instances of `example.com` with your domain name:

    {{< file "/etc/apache2/sites-available/example.com.conf" apache>}}
<Directory /var/www/html/>
    Require all granted
</Directory>
<VirtualHost *:80>
    ServerName example.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/example.com/public_html
    ErrorLog /var/log/apache2/example.com/error.log
    CustomLog /var/log/apache2/example.com/access.log combined
    <files xmlrpc.php>
      order allow,deny
      deny from all
    </files>
</VirtualHost>
    {{</ file>}}

1.  Save the changes to the virtual host configuration file by pressing **CTRL+X** and then pressing **Y**. Press **ENTER** to confirm.

1.  Enable your new website, replacing `example.com` with your domain name:

        sudo a2ensite example.com.conf

    This creates a symbolic link to your `example.com.conf` file in the appropriate directory for active virtual hosts.

1.  Reload to apply your new configuration:

        sudo systemctl reload apache2

    {{< note >}}
For more details on configuring your Apache virtual hosts file, see [Apache's official documentation](http://httpd.apache.org/docs/current/vhosts/).
    {{</ note >}}

1.  Visit `http://example.com/wp-admin` (or `http://<Linode IP address>/wp-admin` if you haven't set up a domain) and verify that you can log in with the WordPress user you created in the [Download and Configure WordPress](#download-and-configure-wordpress) section of the guide.

## Common Commands

### Install Plugins

This section covers common WP-CLI commands related to installing and updating WordPress plugins. As an example, this section will use the [Yoast SEO plugin](https://wordpress.org/plugins/wordpress-seo/).

To install a plugin, your first step will be to find the *plugin slug*. In this case, the slug is the last part of a permalink URL which describes the plugin. If a plugin is available at http://wordpress.org/plugins/plugin-dir/, then `plugin-dir` is the slug of the plugin. You install the plugin under the same directory on your WordPress site at `http://example.com/wp-content/plugins/plugin-dir/`. Since this slug is unique to every plugin, you can search for the slug of any plugin using WP-CLI and then install it.

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. Search for the plugin you would like to install:

        wp plugin search yoast

    You will get an output similar to this.

    {{< output >}}
Success: Showing 10 of 574 plugins.
+---------------------------------------------------+------------------------------------+--------+
| name                                              | slug                               | rating |
+---------------------------------------------------+------------------------------------+--------+
| Yoast SEO                                         | wordpress-seo                      | 98     |
| Yoast SEO: Search Index Purge                     | yoast-seo-search-index-purge       | 68     |
| ACF Content Analysis for Yoast SEO                | acf-content-analysis-for-yoast-seo | 90     |
| Glue for Yoast SEO &amp; AMP                      | glue-for-yoast-seo-amp             | 88     |
| Google Analytics for WordPress by MonsterInsights | google-analytics-for-wordpress     | 78     |
| Import Settings into WordPress SEO by Yoast       | yoast-seo-settings-xml-csv-import  | 100    |
| Remove Yoast SEO Comments                         | remove-yoast-seo-comments          | 92     |
| Surbma &#8211; Yoast SEO Breadcrumb Shortcode     | surbma-yoast-breadcrumb-shortcode  | 84     |
| LiteSpeed Cache                                   | litespeed-cache                    | 98     |
| WPGlobus &#8211; Multilingual Everything!         | wpglobus                           | 92     |
+---------------------------------------------------+------------------------------------+--------+
{{</ output >}}

    You can see more than 10 plugins per page by modifying the command:

        wp plugin search yoast --per-page=20

1. Now that you know the slug of the plugin you want to install (`wordpress-seo`), copy it to your command and activate it:

        sudo -u www-data wp plugin install wordpress-seo
        sudo -u www-data wp plugin activate wordpress-seo

### Update Plugins
To update any plugin on your WordPress site:

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. Issue the plugin update command followed by the name of the plugin:

        sudo -u www-data wp plugin update wordpress-seo

    Or, to update all plugins issue the following command:

        sudo -u www-data wp plugin update --all

1. To list all the installed plugins on your WordPress site, you can use the following command:

        wp plugin list

### Uninstall Plugins

To uninstall a WordPress plugin:

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. Deactivate and uninstall the plugin:

        sudo -u www-data wp plugin deactivate wordpress-seo
        sudo -u www-data wp plugin uninstall wordpress-seo

### Install Themes

The procedure for installing and activating a theme is nearly identical to that of a plugin. Just swap `plugin` for `theme` in all of the commands.

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. Search for the theme you'd like to install. Replace `twentyfourteen` with the theme you'd like to install.

        wp theme search twentyfourteen

1. Install and activate the theme:

        sudo -u www-data wp theme install twentyfourteen
        sudo -u www-data wp theme activate twentyfourteen

### Update Themes

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. To list all the themes in a tabular form issue the example command. You can use this command to find the theme you would like to update.

        wp theme list

1. Update your theme:

        sudo -u www-data wp theme update twentyfourteen

    To update all themes installed on your WordPress site, issue the following command:

        sudo -u www-data wp theme update --all

### Uninstall Themes

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. To uninstall a theme, activate a different theme first:

        sudo -u www-data wp theme activate twentyseventeen

1. Once you've activated another theme, you can safely uninstall the previously active theme:

        sudo -u www-data wp theme uninstall twentynineteen


### Update WordPress

To update your WordPress site:

{{< note >}}
For more details on best practices when updating your WordPress site, see [WordPress' official documentation](https://wordpress.org/support/article/updating-wordpress/).
{{</ note >}}

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory.

        cd /var/www/html/example.com/public_html

1. Update all your site's files first:

        sudo -u www-data wp core update

1. Update your site's database:

        sudo -u www-data wp core update-db

## Next Steps

You can now further configure WP-CLI. These commands are just the tip of the iceberg about how you can manage WordPress from the command line. Write or edit posts, perform database queries, manage user capabilities, manage `cron` events, import or export content, manage attachments, and even manage multi-site installations through a few, quick and practical keystrokes. You have refined WordPress management, and conserved valuable time.