---
deprecated: true
author:
  name: Jonathan Frederickson
  email: docs@linode.com
description: 'Using the Ruby on Rails framework for Nginx web applications on Ubuntu 12.04'
keywords: ["ruby on rails", "ruby on nginx", "rails apps"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-nginx/ubuntu-12-04-precise/','websites/ror/ruby-on-rails-with-nginx-on-ubuntu-12-04-precise/index.cfm/','websites/ror/ruby-on-rails-with-nginx-on-ubuntu-12-04-precise/']
modified: 2014-02-11
modified_by:
  name: Alex Fornuto
published: 2014-02-05
title: 'Ruby on Rails with Nginx on Ubuntu 12.04 LTS (Precise)'
external_resources:
 - '[Ruby on Rails Home Page](http://rubyonrails.org/)'
 - '[Ruby on Rails Documentation](http://rubyonrails.org/documentation)'
 - '[Nginx Home Page](http://nginx.org/)'
 - '[Nginx Documentation](http://nginx.org/en/docs/)'
 - '[Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

[Ruby on Rails](http://rubyonrails.org/) is a rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications. This guide describes the required process for deploying Ruby on Rails with [Phusion Passenger](https://www.phusionpassenger.com/) and the [Nginx](https://www.nginx.com/) web server on Debian 8.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Follow the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and [set the Linode's hostname](/docs/getting-started#setting-the-hostname).

    To check the hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

3.  Uninstall Nginx if currently installed on the Linode. Phusion Passenger includes their own build of Nginx which supports loadable modules:

        sudo apt-get remove nginx nginx-full nginx-light nginx-naxsi nginx-common


## Install Passenger and Nginx

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential ruby1.8 ruby1.8-dev zlib1g-dev rubygems1.8 libruby libssl-dev libpcre3-dev libcurl4-openssl-dev rake ruby-rack rails

    Additionally, the application you deploy will likely have additional dependencies. Install these dependencies before proceeding.

2.  Phusion hosts a repository containing the latest version of Phusion Passenger. To add this to your package manager, first install the Phusion PGP key:

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7

3.  With `sudo`, or as the root user, create the file `/etc/apt/sources.list.d/passenger.list` containing Phusion's repository info:

    {{< file "/etc/apt/sources.list.d/passenger.list" sourceslist >}}
deb https://oss-binaries.phusionpassenger.com/apt/passenger precise main

{{< /file >}}


4.  Update your local package database and install Phusion Passenger:

        sudo apt-get update
        sudo apt-get install nginx-extras passenger

5.  Run the Phusion Passenger installer for Nginx:

        sudo passenger-install-nginx-module

    You'll be greeted by the Phusion Passenger Nginx installer program. Press **Enter** to continue with the installation:

    The installation process will begin an interactive session that will guide you through the process of building Phusion Passenger. When prompted for the Nginx installation method, it is recommended that you choose **1** for both options to allow the installer to automatically download, compile, and install Nginx for you.


## Enable Passenger Support and Start Nginx

1.  Nginx is now installed on your system, but you need to enable support for Phusion Passenger. Edit the file `/etc/nginx/nginx.conf` and uncomment these lines:

    {{< file "/etc/nginx/nginx.conf" aconf >}}
passenger_root /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini;
passenger_ruby /usr/bin/ruby;

{{< /file >}}


2.  Restart Nginx:

        sudo service nginx restart

3.  Verify that Passenger support has been installed and enabled correctly:

        sudo passenger-memory-stats

    If Passenger is running, you should see a few running processes under the **Passenger processes** section.

    The configuration file for Nginx is located at `/etc/nginx/nginx.conf`. This is the file you'll need to edit to add support for your Rails applications. A default server is already configured in this file, and it also contains examples for alternate virtual host and SSL configurations.


## Install MySQL Support (optional)

If your application uses MySQL, install the database server by following our [MySQL on Ubuntu 12.04 (Precise) guide](/docs/databases/mysql/deploy-mysql-relational-databases-on-ubuntu-12-04-precise-pangolin). Once it's installed and configured properly, issue the following command:

    sudo apt-get install libmysqlclient-dev libmysql-ruby
