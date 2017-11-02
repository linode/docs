---
author:
  name: Jonathan Frederickson
  email: docs@linode.com
description: Using the Ruby on Rails framework for Nginx web applications on Debian 7
keywords: ["ruby on rails", "ruby on nginx", "rails apps"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-nginx/debian-7-wheezy/','websites/ror/ruby-on-rails-with-nginx-on-debian-7-wheezy/']
modified: 2014-12-09
modified_by:
  name: James Stewart
published: 2014-02-11
title: 'Ruby on Rails with Nginx on Debian 7 (Wheezy)'
external_resources:
 - '[Ruby on Rails Home Page](http://rubyonrails.org/)'
 - '[Ruby on Rails Documentation](http://rubyonrails.org/documentation)'
 - '[Nginx Home Page](http://nginx.org/)'
 - '[Nginx Documentation](http://nginx.org/en/docs/)'
 - '[Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

Ruby on Rails is a popular rapid development web framework that allows web designers and developers to implement fully featured dynamic web applications using the Ruby programming language. This guide describes the required process for deploying Ruby on Rails with Passenger and the Nginx web server on Debian 7 (Wheezy). For the purposes of this tutorial, it is assumed that you've followed the steps outlined in our [getting started guide](/docs/getting-started/), that your system is up to date, and that you've logged into your Linode as root via SSH.

![Using the Ruby on Rails framework for Nginx web applications on Debian 7](/docs/assets/ruby_on_rails_with_nginx_debian_7_smg.png "Using the Ruby on Rails framework for Nginx web applications on Debian 7")

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Install Required Packages

Update your system's repository database and installed packages with the following commands:

    apt-get update
    apt-get upgrade

Issue the following command to install packages required for Ruby on Rails:

    apt-get install wget build-essential ruby1.8 ruby1.8-dev zlib1g-dev libruby1.8 rubygems1.8 libruby libssl-dev libpcre3-dev libcurl4-openssl-dev rake ruby-rack rails

Additionally, the application you deploy will likely have additional dependencies. Install these dependencies before proceeding.

## Install Passenger and Nginx

Nginx does not support loadable modules, so Phusion Passenger includes a copy of Nginx with Passenger support compiled in. If you have previously installed Nginx through the Debian repositories, remove it with the following commands:

    apt-get remove nginx nginx-full nginx-light nginx-naxsi nginx-common

Phusion hosts a repository containing the latest version of Phusion Passenger. To add this to your package manager, first install the Phusion PGP key by running this command:

    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7

Create the file `/etc/apt/sources.list.d/passenger.list` with the following contents:

    deb https://oss-binaries.phusionpassenger.com/apt/passenger wheezy main

Enable HTTPS support for APT by running the command below:

    sudo apt-get install apt-transport-https

Update your local package database and install Phusion Passenger:

    apt-get update
    apt-get install nginx-extras passenger

Run the Phusion Passenger installer for Nginx:

    passenger-install-nginx-module

You'll be greeted by the Phusion Passenger Nginx installer program. Press "Enter" to continue with the installation.

[![Phusion Passenger nginx installer program running on Debian 7 (Wheezy).](/docs/assets/351-01-passenger-nginx-installer.png)](/docs/assets/351-01-passenger-nginx-installer.png)

The installation process will begin an interactive session that will guide you through the process of building Phusion Passenger. When prompted for the Nginx installation method, we recommend you choose "1" for both options to allow the installer to automatically download, compile, and install Nginx for you. Unless you have specific needs that would necessitate passing custom options to Nginx at compile time, this is the safest way to proceed. Accept the default installation location for Nginx.

## Enable Passenger Support and Start Nginx

Nginx is now installed on your system, but you need to enable support for Phusion Passenger. Edit the file `/etc/nginx/nginx.conf` and uncomment these lines:

    passenger_root /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini;
    passenger_ruby /usr/bin/ruby;

You can now restart Nginx with the following command:

    service nginx restart

To verify that Passenger support has been installed and enabled correctly, you can run the following:

    passenger-memory-stats

If Passenger is running, you should see a few running processes under the "Passenger processes" section.

The configuration file for Nginx is located at `/etc/nginx/nginx.conf`. This is the file you'll need to edit to add support for your Rails applications. A default server is already configured in this file, and it also contains examples for alternate virtual host and SSL configurations.

## Install MySQL Support (optional)

If your application uses MySQL, install the database server by following our [MySQL on Debian 7 (Wheezy) guide](/docs/databases/mysql/debian-7-wheezy). Once it's installed and configured properly, issue the following command:

    apt-get install libmysqlclient-dev libmysql-ruby
