---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Apache web server with Ubuntu 10.10 to serve Ruby on Rails applications.'
keywords: ["ruby on rails", "rails on ubuntu", "rails apps", "rails and apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-apache/ubuntu-10-10-maverick/','websites/ror/ruby-on-rails-with-apache-on-ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-02-17
title: 'Ruby on Rails with Apache on Ubuntu 10.10 (Maverick)'
deprecated: true
external_resource:
  - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
  - '[mod\_rails Documentation for Apache Servers](http://www.modrails.com/documentation/Users%20guide%20Apache.html)'
  - '[Install the Apache HTTP Server on Ubuntu 10.10 (Maverick)](/docs/web-servers/apache/installation/ubuntu-10-10-maverick)'
  - '[Install the MySQL Database System on Ubuntu 10.10 (Maverick)](/docs/databases/mysql/ubuntu-10-10-maverick)'
---

Ruby on Rails is a popular rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications quickly that is written in the Ruby programming language. Rails enables developers to produce inventive applications on tight time scales. Examples of well known Rails-powered sites include Hulu, GitHub, and the applications provided by 37 Signals, among many others. This guide deploys Rails applications using the Phusion Passenger or `mod_rails` method. Passenger allows you to embed Rails apps directly in Apache applications without needing to worry about FastCGI or complex web server proxies.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing Passenger and Dependencies

Issue the following command to reload your system's package repositories and ensure that all installed programs are up to date:

    apt-get update
    apt-get upgrade

Use the following command to install system packages required for using Ruby, building Ruby modules, and running Rails applications:

    apt-get install build-essential libapache2-mod-passenger apache2 rubygems ruby1.8-dev libopenssl-ruby

Using the `gem` package manager for Ruby modules, install the `fastthread` gem:

    gem install fastthread

Finally, install the version of Ruby On Rails that your application requires. Issue one the following commands for the version you need:

    gem install rails --version 2.1.2
    gem install rails --version 2.2.2
    gem install rails --version 2.3.5
    gem install rails --version 3.0.4

If you are unsure of the version you require, you can install the latest version with the following command:

    gem install rails

This should install the appropriate versions of all required packages including ruby, rack, and other dependencies needed for basic Rails development. To install support for the [MySQL database system](/docs/databases/mysql/ubuntu-10-10-maverick) in Rails, issue the following commands:

    apt-get install mysql-server libmysqlclient16 libmysqlclient16-dev mysql-client mysql-common
    gem install mysql

Additionally, the application you deploy will likely have additional dependencies. Install these dependencies before proceeding.

## Configuring Apache to Work with Passenger

If you configured Apache virtual hosting as outlined in the [Ubuntu 10.10 (Maverick) Apache guide](/docs/web-servers/apache/installation/ubuntu-10-10-maverick), the public directory for your domain (e.g. `example.com`) is located in `/srv/www/example.com/public_html/`, and your `<VirtualHost >` configuration block contains a line that reads:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/

{{< /file-excerpt >}}


Modify this line to point to the `public/` folder within your Rails application's root directory. For instance, if your Rail application is located within `/srv/www/example.com/application/` then the `DocumentRoot` would point to `/srv/www/example.com/application/public/`, as in the following example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/application/public

{{< /file-excerpt >}}


Restart Apache once to ensure all settings have been loaded using the following command:

    /etc/init.d/apache2 restart

## Deploying Multiple Rails Apps

There are a number of strategies for deploying more than one Rails application using Passenger. The most simple approach requires running multiple distinct virtual hosts configured as above to host a single Rails app each. Alternatively, you may host multiple Rails apps within a single virtual host. Add `RailsBaseURI` directives that specify the path to your Rails application within the VirtualHost configuration as in the following example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/
RailsBaseURI /lollipop
RailsBaseURI /frogs
RailsBaseURI /simon

{{< /file-excerpt >}}


These directives configure Passenger to run three Rails apps on the `example.com` site at the three locations specified. Rather than linking the `public/` directory of your Rails app to the `public_html/` directory as above, link the `public/` directory of the application to a directory within the `public_html/` directory. These links would be created in the following manner:

    ln -s /srv/www/example.com/lollipop/public/ /srv/www/example.com/public_html/lollipop/
    ln -s /srv/www/example.com/frogs/public/ /srv/www/example.com/public_html/frogs/
    ln -s /srv/www/example.com/simon/public/ /srv/www/example.com/public_html/simon/

The files for each Rails application are located in a `/srv/www/example.com/` directory, which is inaccessible to the web server. Congratulations! You have successfully deployed Ruby On Rails applications with the Apache Web server and Passenger.
