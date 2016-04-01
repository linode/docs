---
author:
    name: Edward Angert
    email: docs@linode.com
description: 'This guide will show you how to update and secure an installation of Drupal 8 CMS on your Linode running Ubuntu or Debian.'
keywords: 'drupal,cms,apache,php,content management system,drupal 8,update'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, April 1, 2016
modified_by:
    name: Edward Angert
published: 'Friday, April 1, 2016'
title: Update and Secure Drupal 8 on Ubuntu or Debian
---

Drupal 8 is the lastest version of the popular [Drupal](https://www.drupal.org/) content management system. This guide demonstrates how to manually install an incremental Drupal 8 update on your Linode. This guide assumes you have a functional Drupal 8 installation running on Apache and Debian or Ubuntu.

## Before You Begin

Ensure that you have followed the following guides:

1.  [Getting Started](/docs/getting-started)
2.  [Securing Your Server](/docs/security/securing-your-server)
3.  [Install a LAMP stack](/docs/websites/lamp/lamp-on-ubuntu-14-04) 
4.  [Install and Configure Drupal 8](/docs/websites/cms/install-and-configure-drupal-8)

Confirm the name of your site's folder by running the following command on your Linode: ``ls /var/www/html``

{: .note}
>
>  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access, remove unnecessary network services and create firewall rules for your web server; you may need to make addional firewall exceptions for your specific application.
>   Replace each instance of ``examplesite`` and ``exampleuser`` with the names appropriate to your site.

## Backing up and Updating 

1.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

2.  Using a browser on your local machine, navigate to your Drupal site /?q=exampleuser/login

        www.examplesite.com/?q=exampleuser/login

3.  In the Drupal Admin Toolbar, click Reports then Available updates

4.  Right click "Download" to the right of the desired version and copy the link address

5.  ssh to your Linode

6.  Navigate to the Apache DocumentRoot directory and download the new file:

        cd /var/www/html/examplesite
        wget https://ftp.drupal.org/files/projects/drupal-8.0.5.tar.gz

7.  Backup existing files and move the archive into the backups directory

        cd public_html
        tar -cvzf examplesite-BCKP-$(date +%Y%m%d).tar.gz ./
        mv -v example-file-name.tar.gz ../backups

8.  Put site into Maintenance Mode
    1.  Navigate to your browser /admin/config/development/maintenance
    2.  Check the box next to "Put site into maintenance mode"
    3.  Enter a message if desired
    4.  Click *Save Configuration*

9.  From the Linode, while still in the site's ``public_html`` folder, remove existing files and folders except "sites" and "profiles":

        sudo rm -ifr autoload.php composer.* example.gitignore index.php LICENSE.txt README.txt robots.txt update.php web.config && sudo rm -ifr core/ modules/ vendor/ themes/

10. Expand the update into your Drupal folder

        cd /var/www/html/examplesite
        tar -zxvf drupal-8.*.tar.gz --strip-components=1 -C public_html

11. From a browser on your local machine, navigate to your site /update.php

        www.examplesite.com/update.php

    *  If update.php does not load or returns a 403 Forbidden error:
        1. Confirm Apache's user group: ``ps aux | egrep '(apache|httpd)`` (The user group is the beginning of the result. E.g. ``www-data``)
        2. Allow the Apache and Drupal installations to access, write, and read settings files:

~~~
            chgrp exampleuser /var/www/html/examplesite/public_html/sites/default/files
            chmod 775 /var/www/html/examplesite/public_html/sites/default/files
            chmod 757 /var/www/html/examplesite/public_html/sites/default/settings.php
~~~

12.  Follow the prompts to continue the update

13.  If installing additional modules or configuring additional security settings as shown in the *Additional Security* section below. Proceed to Step 14 once those configurations are complete.

14.  Rebuild the site's cache in ``/admin/config/development/performance``

    www.examplesite.com/admin/config/development/performance

15.  Navigate to your site /admin/reports/status to check and deal with messages

    www.examplesite.com/admin/reports/status

16.  Confirm that ``$update_free_access = FALSE`` in ``/var/www/html/examplesite/public_html/sites/default/settings.php``

17.  If everything looks good, take the site out of maintenance mode by navigating to your site's ``/admin/config/development/maintenance``

    www.examplesite.com/admin/config/development/maintenance

## Additional Security 

1. Increase password security by adding the following to ``/var/www/html/examplesite/public_html/sites/default/services.yml``:
    {: .file-excerpt}
~~~

    # Increase the number of password hash iterations. Minimum = 7; Maximum = 30; Default = 16
    services:
      password:
        class: Drupal\Core\Password\PhpassHashedPassword
        arguments: [19]
~~~

2. Consider installing additional security modules from ``https://www.drupal.org/project/project_module``:
    * [Secure Login](https://www.drupal.org/project/securelogin) enforces secure authenticated session cookies
    * [Password Policy](https://www.drupal.org/project/password_policy): Define a user password policy
    * [Security Review](https://www.drupal.org/project/security_review): Automated security testing
