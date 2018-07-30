---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
description: 'How to migrate a LAMP website from another hosting provider to Linode.'
keywords: ["lamp", "migrate", "website migration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-07-19
modified_by:
  name: Linode
published: 2018-07-19
title: How to Migrate a LAMP Website to Linode
---

This guide describes how to migrate a website running in a [LAMP](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-18-04/#what-is-a-lamp-stack) environment on another host to a new Linode. Reading the [Best Practices when Migrating to Linode](/docs/platform/migrate-to-linode/best-practices-when-migrating-to-linode/) guide prior to following this guide is recommended (but is not required).

This guide includes commands that need to be run at the command line of your current host, which may not be available if you have a shared hosting environment. Ubuntu 18.04 will be used as the distribution for the new Linode deployment. If you'd like to choose another distribution, these instructions can still be used as an approximation for the commands you'll need to run.

## Migrate Your System

### Deploy Your Linode

1.  Follow Linode's [Getting Started](/docs/getting-started/) guide and choose Ubuntu 18.04 as your Linux image when deploying. Choose a Linode plan which will offer enough storage space to accommodate the website data from your current host.

1.  Follow the [How to Secure Your Server](/docs/security/securing-your-server/) guide. When following this guide, be sure to create a limited Linux user with `sudo` privileges. This guide will assume this user is named `linode_user`.

### Install LAMP

1.  [Connect to your Linode via SSH.](/docs/getting-started/#connect-to-your-linode-via-ssh)

1.  If you did not do so previously, update your software:

        sudo apt-get update && sudo apt-get upgrade

1.  Install and use `tasksel` to install the `lamp-server` metapackage.

        sudo apt install tasksel
        sudo tasksel install lamp-server

### Prepare and Backup Your Current Host

The data that needs to be transferred includes:

-   Files from the website document root. This guide will assume this to be `/var/www/html/`, but your server may have it located in another directory.
-   MySQL database data (which will be exported using the `mysqldump` utility)
-   Apache's configuration files; specifically, `/etc/apache2/apache2.conf` and `/etc/apache2/sites-available/example.com.conf`. These may be named differently on your system--in particular, the files in the `sites-available` directory may be labelled with another name.

Your server may have relevant website data stored in other directories, but these are the common locations for most files in a LAMP deployment.

A *database dump* needs to be performed on your MySQL process prior to transferring the data. This will result in a file on disk that encapsulates your database data and can be copied over the network as a normal file:

1.  Connect to your current host via SSH.

1.  Stop your web server on your current host:

        sudo systemctl stop apache2

    This will prevent new requests on your website, which will stop new writes to your database. This ensures that the MySQL backup that is taken does not result in an inconsistent dataset.

    {{< caution >}}
Stopping services on your current host will make your website temporarily unavailable for visitors.
{{< /caution >}}

1.  Perform a database dump of the entire database on your current host:

        sudo mysqldump --all-databases --single-transaction --quick --lock-tables=false > full-backup-$(date +%F).sql -u root -p

    This command results in a file called `full-backup-*.sql` with the current date inserted.

1.  (Optional) Restart your web server on the current host to continue serving visitors in the interim:

        sudo systemctl start apache2

    {{< note >}}
If any new information is added to the database on the current host prior to fully transferring service to Linode, that new information is not included in the MySQL backup that was performed in the previous step.
{{< /note >}}

### Transfer Data to Linode

The following commands will copy files into the home directory of your Linode's Linux user. The next section will ensure that these files are moved to the right locations on disk and that their file owneship is correct. This work is done in two steps because the Linux user is assumed to have limited privileges and is unable to write to certain locations on disk.

1.  From your current host, upload the Apache configuration files to your new Linode:

        rsync -az /etc/apache2/apache2.conf linode_user@linode_ip_address:/etc/apache2/
        rsync -az /etc/apache2/sites-available/example.com.conf linode_user@linode_ip_address:~

1.  Upload your website files to your Linode:

        rsync -av /var/www/html/ linode_user@linode_ip_address:~/document_root

1.  Upload your database dump file to your Linode:

        rsync -az full-backup-*.sql linode_user@linode_ip_address:~

### Finish Setting Up Your Linode

1.  From your Linode, move the transferred Apache configuration files to the appropriate locations:

        cd ~
        sudo mv apache2.conf /etc/apache2
        sudo mv example.com.conf /etc/apache2/sites-available

1.  Set `root` as the owner and group for the files:

        sudo chown root:root /etc/apache2/apache2.conf /etc/apache2/sites-available/example.com.conf

1.  Move the website files and set the owner and group to be `www-data`:

        sudo mv document_root/* /var/www/html
        sudo chown -R www-data:www-data /var/www/html

1.  Restore the database dump file; replace `full-backup-*.sql` with the name of your file:

        sudo mysql -u root < full-backup-*.sql

    {{< caution >}}
This will overwrite all current data in the MySQL database system of your Linode. It is not recommended that you perform this command on a Linode with other existing websites.
{{< /caution >}}

    {{< note >}}
It is not necessary to supply the `-p` password option when restoring the backup file, as MySQL on Ubuntu 18.04 uses [`auth_socket` authentication](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-18-04/#mysql) instead of password authentication by default.
{{< /note >}}

1.  [Reload MySQL's grant tables](https://dev.mysql.com/doc/refman/8.0/en/privilege-changes.html). This is necessary when a web application includes a user in the `mysql.users` table. If this is not performed, the application will not have permission to read from the database:

        sudo mysqladmin flush-privileges -u root -p

1.  Disable the default Apache example site and enable yours:

        sudo a2dissite 000-default.conf
        sudo ensite example.com.conf

1.  Restart Apache:

        sudo systemctl restart apache

### Test Your New Environment

Go to your Linode's IP address in a web browser. In most cases, your website should appear.

If your website does not load normally, one possible reason is that your IP address could be hard-coded in some areas of the website files or in the database. If this is the case, consult your PHP application framework's documentation for ways to search for and replace those values. For example, WordPress's [WP-CLI interface](https://developer.wordpress.org/cli/commands/search-replace/) and Drupal's [Drush interface](https://www.drupal.org/project/sar) provide methods that help with this task.

Another reason the site may not load is if your website configuration expects your domain name to be supplied in the HTTP headers of a web request. When you visit your IP directly, this information is not supplied in your request. The [Previewing Websites Without DNS](https://www.linode.com/docs/networking/dns/previewing-websites-without-dns/) guide describes a workaround for this issue. When you have updated your DNS records, this workaround will no longer be necessary to view your site.

If you are seeing any other errors from your site, try reviewing Apache's error logs for further clues. The locations for these logs will be listed in your /etc/apache2/apache2.conf or /etc/apache2/sites-available/ files.

## Migrating DNS Records

The last step required to migrate is to update your DNS records to reflect your new Linode's IP. Once this is done, visitors will start loading the page from your Linode.

{{< content "use-linode-name-servers" >}}