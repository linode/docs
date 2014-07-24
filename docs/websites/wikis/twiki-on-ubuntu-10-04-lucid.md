---
deprecated: true
author:
  name: Linode
  email: skleinman@linode.com
description: 'Install and configure a structured wiki with TWiki.'
keywords: 'wiki,twiki,structured wiki,enterprise wiki'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/wikis/twiki/ubuntu-10-04-lucid/']
modified: Friday, October 4th, 2013
modified_by:
  name: Linode
published: 'Tuesday, February 15th, 2011'
title: 'TWiki on Ubuntu 10.04 (Lucid)'
---



TWiki is a robust "structured wiki" roughly comparable to other "Enterprise" wiki solutions such as [Confluence](/docs/web-applications/wikis/confluence/). Structured wikis provide a powerful way to share, store, and work with information in task centric applications. TWiki is a foundation for supporting content-centric workflows including bug and issue tracking, knowledge management, and data entry. Written in Perl and distributed under the terms of the GNU GPL, TWiki is highly extensible and has a robust and active plug-in infrastructure. Because of this flexibility, TWiki straddles the boundary between web application and web application framework. This guide outlines a basic TWiki installation, setup, and configuration process.

Prepare System and Install TWiki
--------------------------------

### Install Prerequisites

Issue the following commands to update your system's package database and ensure that all installed packages are up to date:

    apt-get update
    apt-get upgrade 

Issue the following command to install all required dependencies for TWiki:

    apt-get install apache2 libgdal-perl libcgi-session-perl libhtml-tree-perl liberror-perl libfreezethaw-perl libgd2-xpm

### Install TWiki

At the time of writing the most recent release of TWiki is 5.0.1. Check the [TWiki upstream](http://twiki.org/) to confirm this is the most current version. Issue the following sequence of commands to download TWiki, extract the files, and set the appropriate permissions:

    cd /opt
    wget http://downloads.sourceforge.net/project/twiki/TWiki%20for%20all%20Platforms/TWiki-5.0.1/TWiki-5.0.1.tgz
    tar -zxvf /opt/TWiki-5.0.1.tgz 
    mkdir -p /srv/www/ducklington.org/
    mv /opt/twiki /srv/www/ducklington.org/twiki
    chown -R www-data:www-data /srv/www/ducklington.org/twiki
    cp /srv/www/ducklington.org/twiki/bin/LocalLib.cfg.txt /srv/www/ducklington.org/twiki/bin/LocalLib.cfg

The TWiki files are now installed in the `/srv/www/ducklington.org/` directory. This is not, and should not be, within the public `DocumentRoot` for your site.

Configure Software
------------------

### Configure Apache Web Server

Create a virtual host specification that resembles the following. Modify the references to `ducklington.org` and `/srv/www/ducklington.org/` to reflect the domain name and file paths for you deployment.

{: .file-excerpt }
/etc/apache2/conf.d/twiki.conf
:   ~~~ apache
    <VirtualHost *:80>
           ServerName ducklington.org
           ServerAlias www.ducklington.org

           DocumentRoot /srv/www/ducklington.org/public_html 

           ErrorLog /srv/www/ducklington.org/logs/error.log 
           CustomLog /srv/www/ducklington.org/logs/access.log combined

           ScriptAlias /bin "/srv/www/ducklington.org/twiki/bin"
           Alias /pub "/srv/www/ducklington.org/twiki/pub"
           Alias / "/srv/www/ducklington.org/twiki/bin/view/"
           <Location "/">
              Options -Indexes +ExecCGI
           </Location>

           SetEnvIf Request_URI "pub/.*\.[hH][tT][mM]?$" blockAccess
           SetEnvIf Request_URI "pub/TWiki/.*\.[hH][tT][mM]?$" !blockAccess
           BrowserMatchNoCase ^$ blockAccess
           <Directory "/srv/www/ducklington.org/twiki/bin">
              AllowOverride None
              Order Allow,Deny
              Allow from all
              Deny from env=blockAccess

              Options ExecCGI FollowSymLinks
              SetHandler cgi-script

              <FilesMatch "^configure.*">
                 SetHandler cgi-script
                 Order Deny,Allow
                 Deny from all
                 Allow from 127.0.0.1
              </FilesMatch>
           </Directory>
           <Directory "/srv/www/ducklington.org/twiki/bin">
              Options None
              AllowOverride Limit
              Allow from all
              AddType text/plain .shtml .php .php3 .phtml .phtm .pl .py .cgi
           </Directory>
    </VirtualHost> 
    ~~~

In this configuration your wiki will be located at the root level of the `ducklington.org` domain. Modify the following lines if you wish to deploy TWiki at a different location on your domain.

{: .file-excerpt }
/etc/apache2/conf.d/twiki.conf
:   ~~~ apache
    ScriptAlias /wiki/bin "/srv/www/ducklington.org/twiki/bin"
    Alias /wiki/pub "/srv/www/ducklington.org/twiki/pub"
    Alias /wiki/ "/srv/www/ducklington.org/twiki/bin/view/"
    </VirtualHost> 
    ~~~

In this example, TWiki will be accessible by at the `http://ducklington.org/wiki` location. The path you configure for TWiki need not correlate to the actual location of the files on the file system. Issue the following commands to create the required directories:

    mkdir -p /srv/www/ducklington.org/public_html
    mkdir -p /srv/www/ducklington.org/logs

### Configure TWiki

Edit the `$twikiLibPath` value in the `/srv/www/ducklington.org/twiki/bin/LocalLib.cfg` file to reflect the location of the `lib` files in the TWiki directory on your system, as in the following example:

{: .file-excerpt }
/srv/www/ducklington.org/twiki/bin/LocalLib.cfg
:   ~~~ perl
    $twikiLibPath = "/srv/www/ducklington.org/twiki/lib";
    ~~~

Before you can proceed with the installation process, you will need to configure the access control settings in the Apache Configuration (as above) so that you will be able to access your TWiki instance. Consider the following configuration directives:

{: .file-excerpt }
/etc/apache2/conf.d/twiki.conf
:   ~~~ apache
    <FilesMatch "^configure.*">
           SetHandler cgi-script
           Order Deny,Allow
           Deny from all
           Allow from 127.0.0.1
    </FilesMatch>
    ~~~

Add your local IP address to the `Allow from` directive in the `FilesMatch` block to allow access to the configuration scripts. For more information about access control with Apache, consider the [Rule Based Access Control](/docs/web-servers/apache/configuration/rule-based-access-control) document.

When you've completed these modifications, reload the web server configuration by issuing the following command:

    /etc/init.d/apache2 reload

Install TWiki
-------------

If your wiki is accessible at `http://ducklington.org`, visit `http://ducklington.org/bin/configure` to begin the configuration process. Enter an administrative password, and click the "Configure" button. Next, click on the "General path settings" option to ensure that the configuration script has properly deduced the location of all required files. Once you have confirmed these setting click on the "Next" option. On the next page select the "Save" option to save these settings.

Add the following line to the `/srv/www/ducklington.org/twiki/lib/LocalSite.cfg`" file. Make sure that you do not append this line to the very end of the file.

{: .file-excerpt }
/srv/www/ducklington.org/twiki/lib/LocalSite.cfg
:   ~~~ perl
    $TWiki::cfg{ScriptUrlPaths}{view} = '';
    ~~~

Log into the configuration section at `http://ducklington.org/bin/configure`, using the password configured above. In the "Store Settings" change the value of the `{StoreImpl}` value to `RcsLite`. Click "Next" and "Save" to store these values. Visit `http://ducklington.org/TWiki/TWikiRegistration`" to register new users to be able to edit the wiki. Although mail configuration is beyond the scope of this document, you will need to install a mail server and configure TWiki in the "Mail and Proxies" section of the configuration interface before TWiki will be able to successfully send email notifications and messages.

Congratulations! You have successfully installed TWiki. You can now visit your wiki at `http://ducklington.org/`

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [TWiki Project Upstream](http://twiki.org/)
- [Apache HTTP Server Documentation](/docs/web-servers/apache)
- [Exim Send Only MTA](/docs/email/exim/send-only-mta-ubuntu-10.04-lucid)
- [Postfix Mail Gateway MTA](/docs/email/postfix/gateway-ubuntu-10.04-lucid)



