---
slug: install-wordpress-using-wp-cli-on-ubuntu-18-04
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install WordPress Using WP-CLI on Ubuntu 18.04'
keywords: ["install WP-CLI", "ubuntu", "wordpress", "apache", "bash completion", "plugin", "WP-CLI", "themes"]
aliases: ['/websites/cms/wordpress/install-wordpress-using-wp-cli-on-ubuntu-18-04/']
tags: ["ubuntu","wordpress","cms","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-06
modified: 2018-08-10
modified_by:
    name: Linode
title: 'Install WordPress Using WP-CLI on Ubuntu 18.04'
deprecated: true
noindex: true
contributor:
    name: Navjot Singh
    link: https://github.com/navjotjsingh
external_resources:
- '[WP-CLI Handbook](https://make.wordpress.org/cli/handbook/)'
- '[WP-CLI Commands](https://developer.wordpress.org/cli/commands/)'
- '[WP-CLI Tools](https://make.wordpress.org/cli/handbook/tools/)'
relations:
    platform:
        key: how-to-install-wordpress-using-wp-cli
        keywords:
           - distribution: Ubuntu 18.04
---

Everyone is probably familiar with WordPress and its renowned 5-minute install routine. It's simple and works without fuss. But when you have multiple sites to manage, repeating the same routine can waste plenty of time which you could have used elsewhere.

<!-- ![Install WordPress Using WP-CLI on Ubuntu 14.04](install-wordpress-using-wpcli-on-ubuntu-14-04.png "Install WordPress Using WP-CLI on Ubuntu 14.04") -->

This is where WP-CLI, a powerful command line tool with which you can manage WordPress, can help. This tutorial covers how to install WP-CLI and how to perform some common, practical tasks using it.

## Prerequisites

This guide is written for Ubuntu 18.04. Before moving ahead, make sure you have completed the following guides:

* [Getting Started with Linode](/docs/guides/getting-started/)
* [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/)
* [How to Install a LAMP Stack on Ubuntu 18.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

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
        OS:	Linux 4.15.0-29-generic #31-Ubuntu SMP Tue Jul 17 15:39:52 UTC 2018 x86_64
        Shell:	/usr/bin/bash
        PHP binary:	/usr/bin/php7.2
        PHP version:	7.2.7-0ubuntu0.18.04.2
        php.ini used:	/etc/php/7.2/cli/php.ini
        WP-CLI root dir:	phar://wp-cli.phar
        WP-CLI vendor dir:	phar://wp-cli.phar/vendor
        WP_CLI phar path:	/home/linode_username
        WP-CLI packages dir:
        WP-CLI global config:
        WP-CLI project config:
        WP-CLI version:	2.0.0
    {{</ output >}}

You can use the above three steps for upgrading WP-CLI as well.

### Activate Bash Completion

The bash completion feature of WP-CLI allows you to see all its available commands on the fly when pressing **Tab**. WP-CLI supports tab completion for [Bash](https://www.gnu.org/software/bash/) and [Zsh](https://en.wikipedia.org/wiki/Z_shell).

1.  Download the bash script in your home directory:

        cd ~
        wget https://github.com/wp-cli/wp-cli/raw/master/utils/wp-completion.bash

1. Edit your shell's configuration file so that wp-completion is loaded by the shell every time you open a new shell session:

    **Bash**
    - Open the `.bashrc`file and add the following line in the editor:

        {{< file "~/.bashrc" bash >}}
source /home/$USER/wp-completion.bash
{{< /file >}}

    - Run the following command to reload the bash profile:

            source ~/.bashrc

    **Zsh**

    - Open the `.zshrc`file and add the following lines in the editor:

        {{< file "~/.zshrc" bash >}}
autoload bashcompinit
bashcompinit
source /home/$USER/wp-completion.bash
{{< /file >}}

    - Run the following command to reload the Zsh profile:

            source ~/.zshrc

Shell completion is now enabled. To test it, type `wp theme ` (include the trailing space) and press **Tab** twice. You will see the list of available commands with `wp theme` again on the prompt.

## Basics of WP-CLI
Before moving on, let's learn some basics of how WP-CLI works. This will help you feel comfortable with the upcoming steps.

So far, we have seen WP-CLI accessed through the main command, `wp`. You can follow the main command with nested subcommands. For example, we have a command to download WordPress, which is:

    wp core download

Here `wp` is the main command while `core` and `download` are its nested subcommands. Nesting subcommands can extend one or two levels.

WP-CLI also comes with a detailed help section, which displays all the commands you might need. To access help:

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

`:` is a prompt that, with subcommands, can help you navigate through this help menu. Up and down arrow keys will let you scroll through the entire help command list. Typing `q` will exit the help menu. For additional details on how to further navigate through the complete help section, you can always type `h` at the above prompt.

You can use the enabled bash completion to demonstrate WP-CLI's readily available command list. Simply type `wp` and press tab twice. You will see the list of available commands. Now, type `wp core` and press tab twice. You will see a list of commands that can be used with `core`. This double tabbing after a command can be repeated for any primary or subcommand.

## Install WordPress

### Prepare the WordPress Database

1.  Log in to the MySQL command line as the database's root user:

        sudo mysql -u root

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

1.  Move to the Apache `example.com` directory:

        cd /var/www/html/example.com

1. Change the ownership of the `public_html` directory. Apache comes with its own `www-data` user and group. As a recommended practice, you should change the ownership of your installation directory to `www-data`:

        sudo chown -R www-data:www-data public_html

1.  Download the WordPress files. Here, you need to use the prefix `sudo -u www-data` for running WP-CLI commands under `www-data` group. You would need to use this every time you run a command which requires WP-CLI to write to the directory, like installing or upgrading:

        cd public_html
        sudo -u www-data wp core download

1.  Create a wp-config.php file:

        sudo -u www-data wp core config --dbname='wordpress' --dbuser='wpuser' --dbpass='password' --dbhost='localhost' --dbprefix='wp_'

    Replace `wpuser` and `password` with your WordPress database user and password. `dbhost` and `dbprefix` are entirely optional and can be omitted unless you need to change their default values.

1.  Run the installation. Replace `adminuser` with the username you'd like to login to WordPress, and replace `password` with a unique password. Replace example.com with your domain, or replace it with your IP address if you haven't set up a domain yet.

        sudo -u www-data wp core install --url='http://example.com' --title='Blog Title' --admin_user='adminuser' --admin_password='password' --admin_email='email@domain.com'

1.  Visit `http://example.com/wp-admin` (or `http://<Linode IP address>/wp-admin` if you haven't set up a domain) and verify that you can log in with the WordPress user you created in the previous step.

## Common Commands

### Install and Update Plugins

Let's say you want to install the Yoast SEO plugin. Your first step will be to find the *plugin slug*. In this case, the slug is the last part of a permalink URL which describes the plugin directory. If a plugin is available at http://wordpress.org/plugins/plugin-dir/, then `plugin-dir` is the slug of the plugin. You install the plugin under the same directory on your blog at `http://example.com/wp-content/plugins/plugin-dir/`. Since this slug is unique to every plugin, you can search for the slug of any plugin using WP-CLI and then install it:

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

Now that you know the slug of the plugin you want to install (`wordpress-seo`), copy it to your command and activate it:

    sudo -u www-data wp plugin install wordpress-seo
    sudo -u www-data wp plugin activate wordpress-seo

To update any plugin:

    sudo -u www-data wp plugin update wordpress-seo

Or, to update all plugins:

    sudo -u www-data wp plugin update --all

Or, to list all the installed plugins on your blog, you can use:

    wp plugin list

To uninstall a plugin:

    sudo -u www-data wp plugin deactivate wordpress-seo
    sudo -u www-data wp plugin uninstall wordpress-seo

### Install and Update Themes

The procedure for installing and activating a theme is nearly identical to that of a plugin. Just swap `plugin` for `theme` in all the commands:

    wp theme search twentyfourteen

To install and activate:

    sudo -u www-data wp theme install twentyfourteen
    sudo -u www-data wp theme activate twentyfourteen

To update one or all themes:

    sudo -u www-data wp theme update twentyfourteen
    sudo -u www-data wp theme update --all

To list all the themes in a tabular form:

    wp theme list

To uninstall a theme, activate a different theme first:

    sudo -u www-data wp theme activate twentyseventeen
    sudo -u www-data wp theme uninstall twentyfourteen

### Update WordPress

You can update your blog through the following commands. The first command updates the files. The second one completes the database upgrade.

    sudo -u www-data wp core update
    sudo -u www-data wp core update-db

## Conclusion

You can now further configure WP-CLI. These commands are just the tip of the iceberg about how you can manage WordPress from the command line. Write or edit posts, perform database queries, manage user capabilities, manage `cron` events, import or export content, manage attachments, and even manage multi-site installations are all now available to you through a few, quick and practical keystrokes. You have refined WordPress management and conserved valuable time.
