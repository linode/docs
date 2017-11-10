---
author:
    name: Edward Angert
    email: docs@linode.com
description: 'This guide will show you how to update and secure an installation of Drupal 8 CMS on your Linode running Ubuntu or Debian.'
keywords: ["drupal", "cms", "apache", "php", "content management system", "drupal 8", "update"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-05-11
modified_by:
    name: Edward Angert
published: 2016-05-11
title: Update and Secure Drupal 8 on Ubuntu or Debian
---

Drupal 8 is the latest version of the popular [Drupal](https://www.drupal.org/) content management system. While a simple incremental update feature is included in version 8.1, manual core updates are required for all preceding versions. This guide demonstrates how to manually install an incremental Drupal 8 update on your Linode. This guide assumes you have a functional Drupal 8 installation running on Apache and Debian or Ubuntu.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/w7l9omoxr3?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Before You Begin

1.  Ensure that you have completed the following guides:

    -   [Getting Started](/docs/getting-started)
    -   [Securing Your Server](/docs/security/securing-your-server)
    -   [Install a LAMP stack](/docs/websites/lamp/lamp-on-ubuntu-14-04)
    -   [Install and Configure Drupal 8](/docs/websites/cms/install-and-configure-drupal-8)

2.  Confirm the name of your site's Document Root folder by running the following command on your Linode:

        ls /var/www/html

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
- This guide will use `sudo` wherever possible.
- You may need additional firewall rules for your specific application.
- Replace each instance of `example.com` and `user` with the names appropriate to your site, and `203.0.113.52` with your Linode's IP address or domain name.
{{< /note >}}

## Create Backups

Back up existing files and move the archive into the backups directory. This process can also be scripted and run on a regular basis using [cron](/docs/tools-reference/tools/schedule-tasks-with-cron):

    cd /var/www/html/example.com/public_html
    sudo tar -cvzf example.com-BCKP-$(date +%Y%m%d).tar.gz ./
    sudo mv -v example.com-BCKP-*.tar.gz ../backups

## Download Updates

1.  Log in to your Drupal site and navigate to the Admin Toolbar. Click **Reports**, then **Available updates**.

    {{< note >}}
If **Available updates** is not listed, enable the Update Manager plugin under **Extend**.
{{< /note >}}

2.  Right click "Download" to the right of the desired version and copy the link address:

    [![A Drupal Update](/docs/assets/drupal-updates-download-small.png)](/docs/assets/drupal-updates-download.png)

3.  Connect to your Linode over SSH:

        ssh user@203.0.113.52

4.  Navigate to the Apache DocumentRoot directory. Download the new file by using `wget` and pasting the link address you copied from Step 2:

        cd /var/www/html/example.com
        wget https://ftp.drupal.org/files/projects/drupal-8.1.1.tar.gz

## Upgrade Your Site

###  Put the Site into Maintenance Mode

1.  Back in your browser navigate to **Configuration**, **Development**, then **Maintenance mode**.

    ![Maintenance Mode](/docs/assets/drupal-updates-maintenance.png)

2.  Check the box next to "Put site into maintenance mode." Enter a message if desired, and click **Save Configuration**.

    [![Title](/docs/assets/drupal-updates-maintenance2-small.png)](/docs/assets/drupal-updates-maintenance2.png)

### Replace System Files

1.  While in the site's `public_html` folder on your Linode, remove existing files and folders except `sites` and `profiles`:

        sudo rm -ifr autoload.php composer.* example.gitignore index.php LICENSE.txt README.txt robots.txt update.php web.config && sudo rm -ifr core/ modules/ vendor/ themes/

2.  Go up one directory, then expand the update into your `public_html` folder. Replace `drupal-8.1.1.tar.gz` with the current update:

        cd ..
        sudo tar -zxvf drupal-8.1.1.tar.gz --strip-components=1 -C public_html

3.  From a browser on your local machine, navigate to `example.com/update.php`:

    {{< note >}}
If `update.php` does not load or returns a 403 Forbidden error, you can try to change the ownership and permissions of the newly expanded files:

    chgrp www-data /var/www/html/example.com/public_html/sites/default/files
    chmod 775 /var/www/html/example.com/public_html/sites/default/files
    chmod 757 /var/www/html/example.com/public_html/sites/default/settings.php
{{< /note >}}

4.  Follow the prompts to continue the update.

5.  If installing additional modules or configuring additional security settings, proceed to the *[Additional Security](/docs/websites/cms/update-and-secure-drupal-8-on-ubuntu#additional-security)* section below. Return to Step 6 once those configurations are complete.

6.  Rebuild the site's cache by clicking **Configuration** in the Admin Toolbar, then **Performance** under Development. Click **Clear all caches**.

7.  Click **Reports** in the Admin Toolbar, then **Status report**.

8.  From your Linode, open `/var/www/html/example.com/public_html/sites/default/settings.php` and confirm that `$update_free_access = FALSE`.

9.  If everything looks good, take the site out of maintenance mode *[described above](/docs/websites/cms/update-and-secure-drupal-8-on-ubuntu#put-the-site-into-maintenance-mode)* by unchecking the box next to "Put site into maintenance mode."

## Additional Security

1.  Increase password security by adding the following to `services.yml`:

    {{< file-excerpt "/var/www/html/example.com/public_html/sites/default/services.yml" yaml >}}
# Increase the number of password hash iterations. Minimum = 7; Maximum = 30; Default = 16
  services:
  password:
  class: Drupal\Core\Password\PhpassHashedPassword
  arguments: [19]

{{< /file-excerpt >}}


      {{< note >}}
You may need to add write permission to this file before you can edit it:

chmod u+w /var/www/html/example.com/public_html/sites/default/services.yml
{{< /note >}}

2. Consider installing additional security modules from the [Drupal Project Module](https://www.drupal.org/project/project_module):
    * [Secure Login](https://www.drupal.org/project/securelogin) enforces secure authenticated session cookies
    * [Password Policy](https://www.drupal.org/project/password_policy): Define a user password policy
    * [Security Review](https://www.drupal.org/project/security_review): Automated security testing
