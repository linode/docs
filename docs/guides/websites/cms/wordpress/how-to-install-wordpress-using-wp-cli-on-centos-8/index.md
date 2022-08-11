---
slug: how-to-install-wordpress-using-wp-cli-on-centos-8
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install WordPress Using WP-CLI on CentOS 8'
og_description: 'Install WordPress Using WP-CLI on CentOS 8'
keywords: ["install WP-CLI", "centos", "wordpress", "apache", "bash completion", "plugin", "WP-CLI", "themes"]
tags: ["centos","wordpress","cms","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-06
modified: 2020-02-17
modified_by:
    name: Linode
title: 'How to Install WordPress Using WP-CLI on CentOS 8'
h1_title: 'Install WordPress Using WP-CLI on CentOS 8'
contributor:
    name: Linode
external_resources:
- '[WP-CLI Handbook](https://make.wordpress.org/cli/handbook/)'
- '[WP-CLI Commands](https://developer.wordpress.org/cli/commands/)'
- '[WP-CLI Tools](https://make.wordpress.org/cli/handbook/tools/)'
relations:
    platform:
        key: how-to-install-wordpress-using-wp-cli
        keywords:
           - distribution: CentOS 8
aliases: ['/websites/cms/wordpress/how-to-install-wordpress-using-wp-cli-on-centos-8/','/websites/cms/wp-cli/how-to-install-wordpress-using-wp-cli-on-centos-8/']
---

WordPress is well-known for its rich content management feature set, ease of use, and quick installation time. The [WordPress command line interface (WP-CLI)](https://wp-cli.org/) provides useful commands and utilities to install, configure, and manage a WordPress site. This guide walks you through some common tasks you can complete using the WP-CLI.

## In this Guide:

This tutorial covers how to complete the following tasks:

- [Install the WP-CLI on a Linode running CentOS 8](#install-wp-cli)
- [Install a WordPress instance using the WP-CLI](#install-wordpress)
- [Helpful and common WP-CLI commands you can use to manage your WordPress site](#common-commands)

## Prerequisites

Before moving ahead, make sure you have completed the following steps.

1.  If you'd like to use your own [Domain Name](/docs/guides/dns-records-an-introduction/) to host your WordPress installation, ensure that your domain name is [pre-configured](/docs/guides/dns-manager/#dns-set-up-checklist) to point to your Linode's IP address.

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

1.  Follow the [Install a LAMP Stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/) guide. **Skip the steps** in the [Configure Name-Based Virtual Hosts](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/#configure-name-based-virtual-hosts), the [Create a MariaDB Database](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/#create-a-mariadb-database), and the [Optional: Test and Troubleshoot the LAMP Stack](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/#optional-test-and-troubleshoot-the-lamp-stack) section. Those steps will be covered later on in this guide.

## Install WP-CLI

1.  WP-CLI is available as a PHP Archive file (`.phar`). You can download it using either `wget` or `curl` commands:

        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

    **Or**

        wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

1.  You need to make this `.phar` file executable and move it to `/usr/local/bin` so that it can be run directly:

        chmod +x wp-cli.phar
        sudo mv wp-cli.phar /usr/local/bin/wp

1. Install the JSON extension for PHP 7. You will need this extension in order to use the WP-CLI.

        sudo yum install php-json

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

1. Install the wget package:

        sudo yum install wget
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

1. Shell completion is now enabled. To test it, type `wp theme ` (include the trailing space) **Without Hitting Enter** and press **Tab** twice. You will see the list of available commands with `wp theme` again on the prompt.

## Basics of WP-CLI

In this section, you will learn some basics of how WP-CLI works. This will help you when using the tool in the upcoming sections of the guide.

- So far, we have seen WP-CLI accessed through the main command, `wp`. You can follow the main command with nested subcommands. For example, WP-CLI includes a command to download WordPress:

    {{< note >}}
Do not issue the example `wp` command. You will install WordPress in the [Download and Configure WordPress](#download-and-configure-wordpress) section of the guide.
    {{</ note >}}

        wp core download

    In the example, `wp` is the main command while `core` and `download` are its nested subcommands. Nesting subcommands can extend one or two levels.

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

1.  Log in to the MariaDB command line as the database's root user:

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

1. Type `quit` to exit the MariaDB command line.

1. Install the `policycoreutils-python` package to manage SELinux and open your MySQL port:

        sudo yum install python3-policycoreutils

1. Configure SELinux to allow your Apache web server to make database connections:

        sudo setsebool httpd_can_network_connect_db 1

### Download and Configure WordPress

1. Create your WordPress site's document root. Replace `example.com` with your site's name:

        sudo mkdir -p /var/www/html/example.com/public_html

1. Change the ownership of the `public_html` directory and give the group write permissions. Apache comes with its own `apache` user and group. As a recommended practice, you should change the ownership of your installation directory to `apache`:

        sudo chown -R apache:apache /var/www/html/example.com/public_html
        sudo chmod g+w /var/www/html/example.com/public_html

1. Add your limited user account to the `apache` group:

        sudo usermod -a -G apache user

    {{< note >}}
You may need to log out of your SSH session and log back in for the user group change to take effect. To verify, issue the following command. You should see the `apache` group returned as one of the groups.

    groups

{{< output >}}
user wheel apache
{{</ output >}}
    {{</ note >}}

1. Change the user and group ownership of the `/var/www` directory. This will allow the `apache` user to write to the directory when caching downloaded files to the `/var/www/.wp-cli/cache` directory:

        sudo chown apache:apache /var/www

1.  Download the WordPress files:

        cd /var/www/html/example.com/public_html
        wp core download

1.  Create a `wp-config.php` file. Replace `wpuser` and `password` with your WordPress database user and password. Also, replace `example_hostname` with your Linode's hostname. `dbprefix` is entirely optional and can be omitted unless you need to change their default values:

        wp core config --dbname='wordpress' --dbuser='wpuser' --dbpass='password' --dbhost='example_hostname' --dbprefix='wp_'

1.  Run the installation. Replace `adminuser` with the username you'd like to login to WordPress, and replace `password` with a unique password. Replace `example.com` with your domain, or replace it with your IP address if you haven't set up a domain yet:

        wp core install --url='http://example.com' --title='Blog Title' --admin_user='adminuser' --admin_password='password' --admin_email='email@domain.com'

### Configure Apache Virtual Hosts File

You will need to configure Apache so that you can access your WordPress site from a browser.

1. Create directories for your WordPress site's Apache error and access logs:

        sudo mkdir /var/log/httpd/example.com/

1. Create directories for Apache's virtual hosts file:

        sudo mkdir /etc/httpd/sites-available /etc/httpd/sites-enabled

1. Create your WordPress site's Apache error and access log files:

        sudo touch /var/log/httpd/example.com/access.log
        sudo touch /var/log/httpd/example.com/error.log

1. Edit Apache's configuration file to let it know to look for virtual host files in the `/etc/httpd/sites-enabled` directory. Add the example line to the bottom of your `httpd.conf` file:

      {{< file "/etc/httpd/conf/httpd.conf" apache>}}
IncludeOptional sites-enabled/*.conf
      {{</ file >}}

1. Navigate to your `/var/www/html/example.com` directory if you are not already there:

        cd /var/www/html/example.com

1. Create the virtual host file for your website. Replace the `example.com` in `example.com.conf` with your domain name:

        sudo nano /etc/httpd/sites-available/example.com.conf

1. Create a configuration for your virtual host. Copy the basic settings in the example below and paste them into the virtual host file you just created. Replace all instances of `example.com` with your domain name:

    {{< file "/etc/httpd/sites-availabe/example.com.conf" apache>}}
<Directory /var/www/html/>
    Require all granted
</Directory>
<VirtualHost *:80>
    ServerName example.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/example.com/public_html
    ErrorLog /var/log/httpd/example.com/error.log
    CustomLog /var/log/httpd/example.com/access.log combined
    <files xmlrpc.php>
      order allow,deny
      deny from all
    </files>
</VirtualHost>
    {{</ file>}}

1.  Save the changes to the virtual host configuration file by pressing **CTRL+X** and then pressing **Y**. Press **ENTER** to confirm.

1. Create a symbolic link from your virtual hosts file in the `sites-available` directory to the `sites-enabled` directory. Replace `example.com.conf` with the name of your own virtual hosts file:

        sudo ln -s /etc/httpd/sites-available/example.com.conf /etc/httpd/sites-enabled/example.com.conf

1.  Reload to apply your new configuration:

        sudo systemctl reload httpd

    {{< note >}}
For more details on configuring your Apache virtual hosts file, see [Apache's official documentation](http://httpd.apache.org/docs/current/vhosts/).
    {{</ note >}}

1.  Visit `http://example.com/wp-admin` (or `http://<Linode IP address>/wp-admin` if you haven't set up a domain) and verify that you can log in with the WordPress user you created in the [Download and Configure WordPress](#download-and-configure-wordpress) section of the guide.

## Common Commands

### Install Plugins

This section covers common WP-CLI commands related to installing and updating WordPress plugins. As an example, this section will use the [Yoast SEO plugin](https://wordpress.org/plugins/wordpress-seo/).

To install a plugin, your first step will be to find the *plugin slug*. In this case, the slug is the last part of a permalink URL which describes the plugin. If a plugin is available at http://wordpress.org/plugins/plugin-dir/, then `plugin-dir` is the slug of the plugin. You install the plugin under the same directory on your WordPress site at `http://example.com/wp-content/plugins/plugin-dir/`. Since this slug is unique to every plugin, you can search for the slug of any plugin using WP-CLI and then install it.

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

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

        wp plugin install wordpress-seo
        wp plugin activate wordpress-seo

### Update Plugins
To update any plugin on your WordPress site:

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. Issue the plugin update command followed by the name of the plugin:

        wp plugin update wordpress-seo

    Or, to update all plugins issue the following command:

        wp plugin update --all

1. To list all the installed plugins on your WordPress site, you can use the following command:

        wp plugin list

### Uninstall Plugins

To uninstall a WordPress plugin:

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. Deactivate and uninstall the plugin:

        wp plugin deactivate wordpress-seo
        wp plugin uninstall wordpress-seo

### Install Themes

The procedure for installing and activating a theme is nearly identical to that of a plugin. Just swap `plugin` for `theme` in all of the commands.

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. Search for the theme you'd like to install. Replace `twentyfourteen` with the theme you'd like to install:

        wp theme search twentyfourteen

1. Install and activate the theme:

        wp theme install twentyfourteen
        wp theme activate twentyfourteen

### Update Themes

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. To list all the themes in a tabular form issue the example command. You can use this command to find the theme you would like to update:

        wp theme list

1. Update your theme:

        wp theme update twentyfourteen

    To update all themes installed on your WordPress site, issue the following command:

        wp theme update --all

### Uninstall Themes

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. To uninstall a theme, activate a different theme first:

        wp theme activate twentyseventeen

1. Once you've activated another theme, you can safely uninstall the previously active theme:

        wp theme uninstall twentynineteen

### Update WordPress

To update your WordPress site:

{{< note >}}
For more details on best practices when updating your WordPress site, see [WordPress' official documentation](https://wordpress.org/support/article/updating-wordpress/).
{{</ note >}}

1. Navigate to your WordPress site's root directory. Replace `example.com` with your own site's root directory:

        cd /var/www/html/example.com/public_html

1. Update all your site's files first:

        wp core update

1. Update your site's database:

        wp core update-db

## Next Steps

You can now further configure WP-CLI. These commands are just the tip of the iceberg about how you can manage WordPress from the command line. Write or edit posts, perform database queries, manage user capabilities, manage `cron` events, import or export content, manage attachments, and even manage multi-site installations through a few, quick and practical keystrokes. You have refined WordPress management, and conserved valuable time.
