---
author:
  name: Linode
  email: docs@linode.com
description: 'A step-by-step guide to updating virtual host settings from Apache 2.2 to Apache 2.4'
keywords: ["Apache 2.2", " Apache 2.4", " Ubuntu", " Debian", " CentOS", " Fedora", " Arch", " Gentoo", " update", " upgrade"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/2-2-2-4-upgrade/']
modified: 2014-03-12
modified_by:
  name: Linode
published: 2014-03-12
title: 'Updating Virtual Host Settings from Apache 2.2 to Apache 2.4'
external_resources:
 - '[apache.org](http://httpd.apache.org/docs/2.4/upgrading.html)'
---

This guide explains the configuration changes needed to update a standard virtual host setup, such as the one presented [here](/docs/websites/hosting-a-website/#configure-name-based-virtual-hosts), from Apache 2.2 to Apache 2.4. These configuration updates are necessary, because a working Apache 2.2 virtual host setup will break silently when you upgrade to Apache 2.4. We'll also discuss changes the new version of Apache makes to the default virtual host and module configuration.

![Updating Virtual Host Settings from Apache 2.2 to Apache 2.4](/docs/assets/updating_virtual_host_settings_tg.png "Updating Virtual Host Settings from Apache 2.2 to Apache 2.4")

Before you upgrade, you should make a backup of your main Apache 2.2 configuration file so you don't lose any settings. However, keep in mind that if you try to use it as-is with Apache 2.4, incompatibilities can prevent Apache from starting or running.

This article is not a comprehensive guide to updating from Apache 2.2 to 2.4. For complete information, read the [apache.org guidelines](http://httpd.apache.org/docs/2.4/upgrading.html) on the subject.

## Make a Backup

Make a [backup](/docs/platform/backup-service) of your data before upgrading your Apache software. Upgrading can sometimes cause you to lose data, particularly if you had settings in an Apache configuration file that no longer apply in Apache 2.4. If you use Apache modules, this is especially likely.

Even with the simplest Apache setup, you should back up your Apache settings, modules, and other data in case unforeseen issues arise.

## Virtual Host Settings Updates

You will have to make changes to your Apache 2.2 virtual hosts settings to make your websites work again with Apache 2.4. Blindly upgrading from Apache 2.2 to 2.4 will break for these reasons:

-   Ubuntu and Debian: Virtual host configuration files in the `sites-available` directory must now use the `.conf` extension
-   Virtual host configuration files must have the `Require all granted` line in an appropriate `Directory` block:

    {{< file-excerpt "virtual host configuration file" >}}
<Directory /path/to/public/website/>
   Require all granted
</Directory>


{{< /file-excerpt >}}


Ubuntu and Debian users will need to make both changes. Users of other distributions will need to make the second change. We'll go into detail on how to make these changes in the next two sections.

### Ubuntu and Debian: Adding .conf Extensions

Follow these instructions at any time to update your virtual host configuration files. This change will work with Apache 2.2, so you can make it ahead of time. You can also do it right after you upgrade to Apache 2.4 to make your sites work again.

1.  Use the `mv` command to rename each virtual host file in your `/etc/apache2/sites-available/` directory to include the `.conf` extension:

        mv /etc/apache2/sites-available/example.com /etc/apache2/sites-available/example.com.conf

2.  Use the `a2ensite` command to add the virtual host. Make sure you include the `.conf` extension:

        a2ensite example.com.conf

3.  Use the `a2dissite` command to disable the old virtual host. Make sure you do not include the `.conf` extension:

        a2dissite example.com

4.  Repeat Steps 1-3 for all of your virtual hosts.

5.  Reload Apache:

        service apache2 reload

Your sites have now been added to Apache. Now follow the instructions in the next section to make your sites available.

### All Distros: Permissions

If you are utilizing access control rules within your virtual host files, you will need to follow these instructions to update your permissions for Apache 2.4. You cannot add the `Require all granted` line in Apache 2.2, or you'll get a 500 Internal Server Error. Make this change just after updating to Apache 2.4.

1.  Open your website's virtual host configuration file with your favorite text editor. For Ubuntu and Debian, this is typically a file like `/etc/apache2/sites-available/example.com.conf`. On CentOS and Fedora, this is typically `/etc/httpd/conf.d/vhost.conf`.

    Ubuntu and Debian (replace **example.com.conf** with your own file name):

        nano /etc/apache2/sites-available/example.com.conf

    CentOS and Fedora:

        nano /etc/httpd/conf.d/vhost.conf

2.  Within the `VirtualHost` block for this website, locate or create the `Directory` block for your website's public directory. Add the line `Require all granted`. (If the line `Require all denied` is already there, update it to `Require all granted`). View a sample file below (replace **/path/to/public/website/** with your website's public directory):

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf or /etc/httpd/conf.d/vhost.conf" >}}
<VirtualHost *:80>
  ...
  <Directory /path/to/public/website/>
     Require all granted
  </Directory>
  ...
</VirtualHost>

{{< /file-excerpt >}}


3.  Save your changes.
4.  Repeat Steps 1-3 for all of your virtual hosts.
5.  Reload Apache.

    Ubuntu and Debian:

        service apache2 reload

    CentOS:

        /etc/init.d/httpd reload

    Fedora:

        systemctl reload httpd.service

    {{< note >}}
For more information on how you can enable or restrict access to your websites with various `Require` lines, see the [Apache website](http://httpd.apache.org/docs/current/howto/access.html). Most users will want to use the `Require all granted` line, but there may be exceptions.
{{< /note >}}

Check your websites. If you have completed these steps correctly, they should now be working again.

## Default Virtual Host

If your Apache configuration file is replaced during the upgrade, the location of your default virtual host will change from `/var/www` to `/var/www/html`. You may have to disable the default virtual host again, if you don't want it.

## Module Configurations

If you have any Apache module configurations in your main configuration file that are incompatible with Apache 2.4, this can prevent the software from starting or running. In Apache 2.4, module configurations are no longer included in the main Apache configuration file. Instead, they each have their own configuration files, located in the `mods-available/` or `mods-enabled/` directories, and named something like `module_name.conf`.

The [apache.org upgrade page](http://httpd.apache.org/docs/2.4/upgrading.html) is a good place to start when checking for incompatible modules.

## Errors From Non-Updated Settings

The following symptoms may indicate that you need to make the changes to your Apache 2.4 configuration that are described in this article. Note that other causes can also produce these symptoms, so if you didn't recently upgrade from Apache 2.2 to 2.4, you should pursue additional [troubleshooting](/docs/web-servers/apache/troubleshooting) avenues.

**Symptom:** When you try to visit your website, you see the default **It works!** Apache web page.

Solution: Add the `.conf` extensions to your virtual host configuration files and re-add your sites, as detailed above. You can also make any desired changes to the Apache default site behavior. If you want to disable the default site, you must do so again.

**Symptom:** When you use the Apache `a2ensite` command, you receive the error `Site example.com does not exist!`

Solution: Make sure you have the `.conf` extension at the end of your configuration file name, and that you also use the `.conf` extension with the `a2ensite` command.

**Symptom:** When you try to visit your website, you see a **403 Forbidden** message.

Solution: Add the `Require all granted` line to each of your virtual host configuration files, as detailed above.

**Symptom:** Apache fails to start or run.

Solution: Check for incompatible settings and modules in your Apache configuration files.

## Apache Upgrade Dates by Distribution

Different distributions make Apache 2.4 the norm at different times. When you upgrade to one of the distributions in this chart, you will also be upgrading to Apache 2.4 by default.

|Distribution    | Version    | Release Date
|:--------------|:------------|: -----------------
|Ubuntu         | 13.10       | out
|Ubuntu         | 14.04 LTS   | April 17, 2014
|Debian         | 8.0         | late 2015 ?
|CentOS         | ?           | ?
|Fedora         | 19          | out
|Fedora         | 20          | out
|Gentoo         | NA          | ?
|Arch           | NA          | in the AUR

Use this information to prepare for a smooth upgrade.
