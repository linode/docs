---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Apache web server with Ubuntu 9.10 to serve Ruby on Rails applications.'
keywords: ["ruby on rails", "rails on ubuntu", "rails apps", "rails and apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-apache/ubuntu-9-10-karmic/','websites/ror/ruby-on-rails-with-apache-on-ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-07-29
title: 'Ruby on Rails with Apache on Ubuntu 9.10 (Karmic)'
external_links:
    - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
    - '[mod\_rails Documentation for Apache Servers](http://www.modrails.com/documentation/Users%20guide%20Apache.html)'
    - '[Install the Apache HTTP Server on Ubuntu 9.10 (Karmic)](/docs/web-servers/apache/installation/ubuntu-9-10-karmic)'
    - '[Install the MySQL Database System on Ubuntu 9.10 (Karmic)](/docs/databases/mysql/ubuntu-9-10-karmic)'
---



Ruby on Rails is a popular rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications quickly that is written in the Ruby programming language. Rails enables developers to produce inventive applications on tight time scales. Examples of well known Rails-powered sites include Hulu, GitHub, and the applications provided by 37 Signals, among many others. This guide deploys Rails applications using the Phusion Passenger or `mod_rails` method. Passenger allows you to embed Rails apps directly in Apache applications without needing to worry about FastCGI or complex web server proxies.

## Installing Passenger and Dependencies

Before updating your system and installing the required software, edit the `/etc/apt/sources.list` file to enable the Ubuntu's "universe" repository, so that it resembles the following:

{{< file-excerpt "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-updates main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-updates main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories - uncomment to enable
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe

deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file-excerpt >}}


Issue the following command to reload your system's package repositories and ensure that all installed programs are up to date:

    apt-get update
    apt-get upgrade

Install the following command to install a number of required system packages required for using Ruby, building Ruby modules, and running Rails applications:

    apt-get install build-essential libapache2-mod-passenger apache2 rubygems ruby1.8-dev libopenssl-ruby

Using the `gem` package manager for Ruby modules, install the `fastthread` gem:

    gem install fastthread

Finally, install the version of Ruby On Rails that your application requires. Issue one the following commands for the version you need:

    gem install rails --version 2.1.2
    gem install rails --version 2.2.2
    gem install rails --version 2.3.5
    gem install rails --version 3.0.4

If you are unsure of the version you require, you can install the default latest version with the following command:

    gem install rails

This should install the appropriate versions of all required packages, including ruby, rack, and other dependencies needed for basic Rails development. To install support for the [MySQL database system](/docs/databases/mysql/ubuntu-9-10-karmic) in Rails, issue the following commands:

    apt-get install mysql-server libmysqlclient15off libmysqlclient15-dev mysql-client mysql-common
    gem install mysql

Additionally, the application you deploy will likely have additional dependencies. Install these dependencies before proceeding.

## Configuring Apache to Work with Passenger

If you configured Apache virtual hosting as outlined in the [Ubuntu 9.10 (Karmic) Apache guide](/docs/web-servers/apache/installation/ubuntu-9-10-karmic), the public directory for your domain (e.g. `example.com`) is located in `/srv/www/example.com/public_html/`, and your `<VirtualHost >` configuration block contains a line that reads:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/

{{< /file-excerpt >}}


In typical Passenger-based Rails deployments, the application directory would be located in `/srv/www/example.com/`. For example `my-app/` would be located at `/srv/www/example.com/my-app/`. Issue the following commands to remove the existing `public_html/` directory and create a new symbolic link to the application's public directory:

    rmdir /srv/www/example.com/public_html/
    ln -s /srv/www/example.com/my-app/public/ /srv/www/example.com/public_html

Passenger requires that the log files within your application be world writable (eg. `chmod 666`) and will produce an "HTTP 500 Internal Server Error" if the log files are not writable. Issue the following command to change the permissions of the files in the log directory of the "my-app" application:

    chmod 666 /srv/www/example.com/my-app/log/

Restart Apache once to ensure all settings have been loaded using the following command:

    /etc/init.d/apache2 restart

## Modify Rails Applications to Work With Passenger

The version of Passenger distributed with Ubuntu 9.10 (Karmic) may have a minor compatibility issue with your Ruby on Rails application. To correct this, change directories to the `app/controllers/` folder of your application and issue the following command to create a symbolic link:

    ln -s application_controller.rb application.rb

If your application requires additional configuration including database migrations, configurations, or updates, you may wish to perform those operations at this point.

## Deploying Multiple Rails Apps

There are a number of strategies for deploying more than one Rails application using Passenger. The most simple approach requires running multiple distinct virtual hosts configured as above to host a single Rails app each. Alternatively you may host multiple Rails apps within a single virtual host. Add `RailsBaseURI` directives that specify the path to your Rails application within the VirtualHost configuration, as in the following example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/
RailsBaseURI /my-app
RailsBaseURI /frogs
RailsBaseURI /simon

{{< /file-excerpt >}}


These directives configure Passenger to run three Rails apps on the `example.com` site at the three locations specified. Rather than linking the `public/` directory of your Rails app to the `public_html/` directory as above, link the `public/` directory of the application to a directory within the `public_html/` directory. These links would be created in the following manner:

    ln -s /srv/www/example.com/my-app/public/ /srv/www/example.com/public_html/my-app/
    ln -s /srv/www/example.com/my-app/frogs/ /srv/www/example.com/public_html/frogs/
    ln -s /srv/www/example.com/my-app/simon/ /srv/www/example.com/public_html/simon/

The files for each Rails application are located in a `/srv/www/example.com/` directory, which is inaccessible to the web server. Congratulations! You have successfully deployed Ruby On Rails applications with the Apache Web server and Passenger.
