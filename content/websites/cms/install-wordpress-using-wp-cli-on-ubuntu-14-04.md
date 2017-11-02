---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install WordPress Using WP-CLI on Ubuntu 14.04'
keywords: ["install WP-CLI", "ubuntu", "wordpress", "apache", "bash completion", "plugin", "WP-CLI", "themes"]
aliases: ['websites/cms/install-and-configure-wordpress-using-wp-cli']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-03-11
modified: 2017-02-15
modified_by:
    name: Linode
title: 'Install WordPress Using WP-CLI on Ubuntu 14.04'
contributor:
    name: Navjot Singh
    link: https://github.com/navjotjsingh
external_resources:
 - '[WP-CLI Commands](http://wp-cli.org/commands/)'
 - '[WP-CLI Community Commands](https://github.com/wp-cli/wp-cli/wiki/List-of-community-commands)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>


Everyone is probably familiar with WordPress and its renowned 5-minute install routine. It's simple and works without fuss. But when you have multiple sites to manage, repeating the same routine can waste plenty of time which you could have used elsewhere.

![Install WordPress Using WP-CLI on Ubuntu 14.04](/docs/assets/install-wordpress-using-wpcli-on-ubuntu-14-04.png "Install WordPress Using WP-CLI on Ubuntu 14.04")

This is where WP-CLI, a powerful command line tool with which you can manage WordPress, can help. This tutorial covers how to install WP-CLI and how to perform some common, practical tasks using it.

## Prerequisites

This guide is written for Ubuntu 14.04. Before moving ahead, make sure you have completed the following guides:

* [Getting Started with Linode](/docs/getting-started)
* [Securing your Server](/docs/security/securing-your-server)
* [How to Install a LAMP Stack on Ubuntu 14.04](/docs/websites/lamp/lamp-on-ubuntu-14-04)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install WP-CLI

1.  WP-CLI is available as a PHP Archive file (.phar). You can download it using either `wget` or `curl` commands:

        curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

    **Or**

        wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

2.  You need to make this .phar file executable and move it to `/usr/local/bin` so that it can be run directly:

        chmod +x wp-cli.phar
        sudo mv wp-cli.phar /usr/local/bin/wp

3.  Check if it is installed properly:

        wp --info

    You should see a similar output like that displayed below, which means you can proceed:

        PHP binary:	/usr/bin/php5
        PHP version:	5.6.11-1ubuntu3.1
        php.ini used:	/etc/php5/cli/php.ini
        WP-CLI root dir:	phar://wp-cli.phar
        WP-CLI global config:
        WP-CLI project config:
        WP-CLI version:	0.21.1

You can use the above three steps for upgrading WP-CLI as well.

### Activate Bash Completion

The bash completion feature of WP-CLI allows you to see all the available commands on the fly.

1.  Download the bash script in your home directory:

        cd ~/
        wget https://github.com/wp-cli/wp-cli/raw/master/utils/wp-completion.bash

2.  Edit the `.bashrc` file so that it is loaded by the shell every time you login. Open the file and add the following line in the editor:

    {{< file-excerpt "~/.bashrc" bash >}}
source /home/$USER/wp-completion.bash

{{< /file-excerpt >}}


3.  Run the following command to reload the bash profile:

        source ~/.bashrc

That's it. Bash completion is now enabled. To test it, type `wp theme ` (include the trailing space) and press **Tab** twice. You will see the list of available commands with `wp theme` again on the prompt.

## Basics of WP-CLI
Before moving on, let's learn some basics of how WP-CLI works. This will help you feel comfortable with the upcoming steps.

So far, we have seen WP-CLI accessed through the main command, `wp`. You can follow the main command with nested subcommands. For example, we have a command to download WordPress, which is:

    wp core download

Here `wp` is the main command while `core` and `download` are its nested subcommands. Nesting subcommands can extend one or two levels.

WP-CLI also comes with a detailed help section, which displays all the commands you might need. To access help:

    wp help

The output should resemble:

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


`:` is a prompt that, with subcommands, can help you navigate through this help menu. Up and down arrow keys will let you scroll through the entire help command list. Typing `q` will exit the help menu. For additional details on how to further navigate through the complete help section, you can always type `h` at the above prompt.

You can use the enabled bash completion to demonstrate WP-CLI's readily available command list. Simply type `wp` and press tab twice. You will see the list of available commands. Now, type `wp core` and press tab twice. You will see a list of commands that can be used with `core`. This double tabbing after a command can be repeated for any primary or subcommand.

## Install WordPress

### Setting up Database

1.  Before you proceed, you need to setup a database. Log in to the MySQL server, replacing `user` with your MySQL username:

        mysql -u user -p

2.  Create a database:

        create database wordpress;

3.  Grant required privileges to the database for the mysql user to which WordPress will permit database access. Replace `user` and `password` with those of the permitted mysql user:

        grant all on wordpress.* to 'user' identified by 'password';

4.  Type `quit` to exit the MySQL command line.

### Main Install

1.  Move to the Apache `example.com` directory:

        cd /var/www/html/example.com

2. Change the ownership of the `public_html` directory. Apache comes with its own usergroup `www-data`. As a recommended practice, you should change the ownership of your installation directory to this group. You also need to add your `username` to the group, and enable group write permissions to perform any commands in the directory:

        sudo chown -R www-data public_html
        sudo usermod -aG www-data username
        sudo chmod -R g+w public_html

3.  Next, download the WordPress files. Here, you need to use the prefix `sudo -u www-data` for running WP-CLI commands under `www-data` group. You would need to use this every time you run a command which requires WP-CLI to write to the directory, like installing or upgrading:

        wp core download

3.  Create a wp-config.php file:

        wp core config --dbname=wordpress --dbuser=user --dbpass=password --dbhost=localhost --dbprefix=wp_

    `dbhost` and `dbprefix` are entirely optional and can be omitted unless you need to change their default values.

4.  Run the installation:

        wp core install --url="http://example.com" --title="Blog Title" --admin_user="adminuser" --admin_password="password" --admin_email="email@domain.com"

Your WordPress blog is now ready for use.

## Common Commands

### Install and Update Plugins

Let's say you want to install the Yoast SEO plugin. Your first step will be to find the plugin slug. In this case, slug is the last part of a permalink url which describes the plugin directory. For example, a plugin is available at http://wordpress.org/plugins/plugin-dir/. Here, `plugin-dir` is the slug of the plugin. You install the plugin under the same directory on your blog at http://example.com/wp-content/plugins/plugin-dir/. Since this slug is unique to every plugin, you can search for the slug of any plugin using WP-CLI and then install it:

    wp plugin search yoast

You will get an output similar to this.

    Success: Showing 10 of 259 plugins.
    +---------------------------------+----------------------------------+--------+
    | name                            | slug                             | rating |
    +---------------------------------+----------------------------------+--------+
    | Yoast SEO                       | wordpress-seo                    | 90     |
    | SO Clean Up Yoast SEO           | so-clean-up-wp-seo               | 96     |
    | All Meta Stats Yoast SEO Addon  | all-meta-stats-yoast-seo-addon   | 100    |
    | Google Analytics by Yoast       | google-analytics-for-wordpress   | 80     |
    | Import Settings into WordPress  | yoast-seo-settings-xml-csv-impor | 0      |
    | SEO by Yoast                    | t                                |        |
    | Surbma - Yoast Breadcrumb Short | surbma-yoast-breadcrumb-shortcod | 84     |
    | code                            | e                                |        |
    | Meta Box Yoast SEO              | meta-box-yoast-seo               | 0      |
    | Keyword Stats Addon for Yoast S | keyword-stats-addon-for-yoast-se | 100    |
    | EO                              | o                                |        |
    | Meta Description Stats Addon fo | meta-description-stats-addon-for | 100    |
    | r Yoast SEO                     | -yoast-seo                       |        |
    | Title Stats Addon for Yoast SEO | title-stats-addon-for-yoast-seo  | 100    |
    +---------------------------------+----------------------------------+--------+

You can see more than 10 plugins per page by modifying the command:

    wp plugin search yoast --per-page=20

Now that you know the slug of the plugin you want to install (wordpress-seo), copy it to your command and activate it:

    wp plugin install wordpress-seo
    wp plugin activate wordpress-seo

To update any plugin, you can use:

    wp plugin update wordpress-seo

Or, to update all plugins, you can use:

    wp plugin update --all

Or, to list all the installed plugins on your blog, you can use:

    wp plugin list

To uninstall a plugin, you use:

    wp plugin uninstall wordpress-seo

### Install and Update Themes

The procedure for installing and activating a theme is nearly identical to that of the plugin. Just swap `plugin` for `theme` in all the commands.

So, to search for the theme, you can use:

    wp theme search twentytwelve

To install and activate, you can use:

    wp theme install twentytwelve
    wp theme activate twentytwelve

To update one or all themes, you can use:

    wp theme update twentytwelve
    wp theme update --all

To list all the themes in a tabular form, you can use:

    wp theme list

To uninstall a theme, you can use:

    wp theme uninstall twentytwelve

### Update WordPress

You can update your blog through the following commands:

    wp core update
    wp core update-db

The first command updates the files. The second one completes the database upgrade.

## Conclusion

Congratulations! You have installed and can now further configure WP-CLI. These commands are just the tip of the iceberg about how you can manage WordPress from the command line. Write or edit posts, perform database queries, manage user capabilities, manage cron events, import or export content, manage attachments and even manage multi-site installations are all now available to you through a few, quick and practical keystrokes. You have refined WordPress management and conserved valuable time. Sweet!
