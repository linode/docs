---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Movable Type dynamic content platform to publish a website.'
keywords: ["Movable Type", "MT HOWTO"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/cms-guides/movable-type/']
modified: 2013-10-02
modified_by:
  name: Linode
published: 2009-07-23
title: Manage Web Content with Movable Type
deprecated: true
---

Movable Type is a free, open source content management system designed to facilitate easy creation of blogs and websites. We assume you have a working LAMP environment set up on your Linode already; if not, please refer to our [LAMP guides](/docs/lamp-guides/) for setup instructions before continuing with this tutorial.

For this example, we'll be using a LAMP server built on Debian Lenny. Your server environment may be based on a different distribution, but the installation steps should be very similar. For additional help beyond the scope of this document, you may want to consult the [Movable Type Install Guide](http://www.movabletype.org/documentation/installation/).

# Making Sure Perl/CGI Works

If your LAMP environment isn't already set up to allow Perl scripts to be run on your website, you'll need to take the following steps. Otherwise, you may proceed to "Download Movable Type" to continue with installation.

Next, we'll make sure Apache knows where CGI scripts are allowed to be run.

{{< file "/etc/apache2/sites-available/example.com" apache >}}
<VirtualHost *:80>
     ServerAdmin support@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
     AddHandler cgi-script .cgi .pl
</VirtualHost>

<Directory /srv/www/example.com/public_html/>
     Options +ExecCGI
</Directory>

{{< /file >}}


We've added a line to the `<VirtualHost>` section of our site's Apache configuration file which uses "AddHandler" to tell Apache how to treat files that end in `.pl` or `.cgi`. We've added a \<Directory\> section as well to allow CGI scripts to be run from the public\_html directory. Reload Apache as follows:

    /etc/init.d/apache2 reload

# Installing Support Modules

You may skip this step if desired; we're going to install some optional Perl modules that enable enhanced functionality in Movable Type. The installation commands shown here make use of the CPAN interactive shell. First, we need to update our system and install some prerequisite packages:

    apt-get update
    apt-get upgrade
    apt-get install build-essential libssl-dev libgd2-xpm-dev libxml2-dev perlmagick libgraphics-magick-perl

Next, start the CPAN shell:

    perl -MCPAN -e 'shell'

If this is your first time running the shell, you'll be asked if you'd like most options configured automatically. This is a safe option for beginners, although those familiar with the shell may wish to proceed with manual configuration. After configuration is done, issue the following commands:

    install Crypt::DSA
    install IPC::Run
    install Archive::Zip
    install HTML::Entities
    install Crypt::SSLeay
    install GD
    install Digest::SHA1
    install LWP::UserAgent
    install XML::Atom
    install Mail::Sendmail
    install HTML::Parser

# Create a Database for Movable Type

From the command line issue the following (inserting MySQL's root password):

    mysql -p

In the MySQL console that appears, run the following commands:

    use mysql
    CREATE USER bamboo IDENTIFIED BY 'changeme';
    CREATE DATABASE bamboo_db;
    GRANT ALL PRIVILEGES ON bamboo_db.* TO 'bamboo';
    exit

Remember to change "changeme" to a strong password; write this down for later reference.

# Download Movable Type

Visit the [Movable Type download](http://www.movabletype.org/download.html) page. Copy the download link to the most recent version into your clipboard (typically by right-clicking on the download link and selecting "copy link location").

Log into your Linode as root through SSH, navigate to your website's website directory, and use `wget` followed by the download link you copied to get the current version of Movable Type. We're using the site "example.com" for example purposes.

    cd /srv/www/example.com/
    wget http://www.movabletype.org/downloads/stable/MTOS-5.03-en.zip

Unpack the installation archive as follows (you may need to install the `unzip` program, as with `apt-get install unzip`):

    unzip MTOS*zip
    rm MTOS*zip

Move the files from the newly create directory to your public HTML and cgi-bin directories and change a directory to be owned by the Apache user:

    mv MTOS-5.03-en/ public_html/
    chown www-data:www-data public_html/
    chown www-data:www-data public_html/mt-static/support

# Install Movable Type

Bring up your website in your favorite browser, and you'll be greeted by the Movable Type installation wizard. Your system will be checked to make sure you meet the requirements for Movable Type. When you reach the "Database Configuration" section, you will be asked to provide some information. We've used these values:

-   Database Type: MySQL Database
-   Database Server: localhost
-   Database Name: bamboo\_db
-   Username: bamboo
-   Password: [from mysql setup]

After basic configuration is complete, you'll be asked to enter a username, display name, and email address for your Movable Type administrator account. Choose a strong password to protect your account. When asked to choose a "Blog URL" you may want to make it the base URL of your site ("example.com" in our case), and for "Publishing Path" you may want to enter the path to your public\_html directory (`/srv/www/example.com/public_html/` in our case). Alternately, you can accept the defaults provided to host the system under a subdirectory of your site's root. You're done!

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the following [Movable Type mailing lists](http://www.movabletype.org/opensource/mailing-lists.html) to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Movable Type Development List](https://movabletype.org/documentation/developer/)
-   [Movable Type Announcements List](https://movabletype.org/news/)

When upstream sources offer new releases, repeat the instructions for installing the Movable software as needed. These practices are crucial for the ongoing security and functioning of your system.



