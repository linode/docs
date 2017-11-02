---
author:
  name: Linode
  email: docs@linode.com
description: 'Building dynamic websites and applications with Catalyst.'
keywords: ["Catalyst", "dynamic content", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/catalyst/','websites/frameworks/catalyst-and-modperl/']
modified: 2013-09-27
modified_by:
  name: Linode
published: 2010-01-29
title: 'Catalyst and mod_perl'
deprecated: true
---

The Catalyst web framework is a contemporary Perl-based MVC, or Model View Controller. Like similar projects such as [Django](/docs/frameworks/), [Ruby On Rails](/docs/frameworks/), and [Seaside](/docs/frameworks/seaside/), Catalyst promotes efficient and rapid development, clear application logic, and web centric development paradigms. If you are used to developing applications with Perl and would like to develop modern web applications, you may consider using the Catalyst framework.

In this document, we outline deploying applications developed with Catalyst using the Apache web server and the `mod_perl` method of running Perl applications embedded in the web server process. Before installing Catalyst, we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

Installing Catalyst
-------------------

Although the Catalyst framework is packaged and included in the repositories of a number of major Linux-based operating system distributions, this document provides a procedure for installing the Catalyst framework from CPAN repositories. This will ensure that your application will have access to the most recently developed features.

### Preparing the System for Catalyst

If you have not yet installed a development tool chain including Perl and its dependencies, issue the following commands on Debian and Ubuntu systems to install this software and make sure that your system's package database and installed software are up to date:

    apt-get update
    apt-get upgrade
    apt-get install perl build-essential curl

Similarly on CentOS and Fedora systems, use the following commands to update the system and install the required software:

    yum update
    yum groupinstall "Development Tools"
    yum install perl perl-devel curl gcc wget

On Arch Linux systems issue the following commands to download the latest package database and install the Perl dependencies:

    pacman -Sy
    pacman -S perl base-devel curl

This document will install all of the required modules for Catalyst using the [CPAN Minus](/docs/linux-tools/utilities/cpanm) interface for CPAN. Install CPAN Minus by issuing the following sequence of commands:

    cd /opt/
    curl https://github.com/miyagawa/cpanminus/raw/master/cpanm > cpanm
    chmod +x cpanm
    ln -s /opt/cpanm /usr/bin/

Issue the following command to install the required Catalyst dependencies from the CPAN. Do not be alarmed if this process takes a few moments:

    cpanm --sudo --skip-installed Catalyst::Runtime Catalyst::Devel Catalyst::Engine::Apache

### Installing Additional Dependencies

Your application may require additional dependencies and Perl modules. You will want to return to the CPAN Minus interface to install these dependencies before continuing with your deployment. Install additional modules by issuing commands in the following form:

    cpanm --sudo --skip-installed [Module::Name]

`[Module::Name]` represents the name of the module that you need to install. If your Catalyst application depends on a database system, you will also need to [install MySQL](/docs/databases/mysql/debian-5-lenny) or [PostgreSQL](/docs/databases/postgresql/debian-5-lenny).

### Setting up the Apache Server with mod\_perl

Once the required Catalyst and database dependencies are installed, we will continue to install the Apache HTTP server and its `mod_perl` module. For more information regarding general purpose configuration, consider our more in-depth documentation for [installing Apache](/docs/web-servers/apache/installation/debian-5-lenny) and [configuring the HTTP server](/docs/web-servers/apache/configuration/). If you have not already installed these packages, issue the following command:

    apt-get install apache2 libapache2-mod-perl2 apache2-mpm-prefork

In Catalyst deployments, you will need to restart the Apache web server before beginning, and then again in order to deploy new code. To restart the web server, issue the following command:

    /etc/init.d/apache2 restart

Deploying Catalyst Applications
-------------------------------

For the purposes of this document we will assume that you have configured virtual hosting for the domain `example.com` in the manner described in the [installing Apache](/docs/web-servers/apache/installation/debian-5-lenny) document. Please note that you can only deploy one Catalyst application in a given instance of Apache.

### Configuring Apache and mod\_perl

Within your Apache virtual host configuration, set the following directives.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
PerlSwitches -I/srv/www/example.com/application/lib/
<Perl>
   use lib qw( /srv/www/example.com/application/lib/ );
</Perl>
PerlModule application

<Location />
    SetHandler          modperl
    PerlResponseHandler application
</Location>

{{< /file-excerpt >}}


Alter this example to include the path to your Catalyst application's `lib/` directory. The `<Location>` specified above ensures that all responses that begin with a slash will be handled by `modperl`, and thus the Catalyst application. The `<Perl>` directive block provides the Perl process embedded in the web server process information regarding the path of your Catalyst application. The `PerlModule` directive forces Apache to load your application in memory when it starts, which allows for significantly faster execution times.

### Serve Static Content Directly From Apache

It may be more effective to serve some resources directly from Apache without using the `modperl` handler. Include the following or equivalent lines in your virtual hosting configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html
<Location /static>
    SetHandler default-handler
</Location>

{{< /file-excerpt >}}


With these lines, requests for the resources `http://example.com/static/style.css` and `http://example.com/static/bkgrnd.jpg` will be served from the resources `/srv/www/example.com/public_html/static/style.css` and `/srv/www/example.com/public_html/static/bkgrnd.jpg` respectively. You can add exemptions for multiple locations within your virtual host by using the `SetHandler` directive within location specific configuration sections. Ensure that the `<Location>` directive is inserted after the `mod_perl` configuration.

### Apache Virtual Hosting Configuration

The following example represents a complete and fully functional virtual hosting configuration that combines elements from the previous three examples:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
     ServerAdmin admin@example.com
     ServerName example.com
     ServerAlias www.example.com

     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined

         DocumentRoot /srv/www/example.com/public_html/

         PerlSwitches -I/srv/www/example.com/application/lib/
         <Perl>
            use lib qw( /srv/www/example.com/application/lib/ );
         </Perl>

         PerlModule application
         <Location />
            SetHandler          modperl
            PerlResponseHandler application
         </Location>

         <Location /static>
            SetHandler default-handler
         </Location>
         <Location /images>
            SetHandler default-handler
         </Location>
         <Location /media>
            SetHandler default-handler
         </Location>
</VirtualHost>

{{< /file-excerpt >}}


In this example, all requests are handled by the Catalyst application except for requests for resources located beneath `/static`, `/images`, and `/media`. Requests for resources in these locations are served from the file system located beneath the `DocumentRoot`, which is `/srv/www/example.com/public_html/` in this example.

Congratulations, you have now successfully configured a system for deploying Catalyst powered web applications!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Catalyst Web Framework Home Page](http://www.catalystframework.org/)
- [Catalyst Manual](http://search.cpan.org/dist/Catalyst-Manual/)
- [Catalyst Getting Started Guide](http://dev.catalystframework.org/wiki/#Get_Started)



