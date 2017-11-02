---
author:
  name: Linode
  email: docs@linode.com
description: Using the Ruby on Rails framework for Nginx web applications on Debian 8
keywords: ["ruby on rails", "ruby on nginx", "rails apps", "debian", "debian 8", " ruby", " nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/ror/ruby-on-rails-nginx-debian-8/']
modified: 2015-06-25
modified_by:
  name: Elle Krout
published: 2015-06-25
title: 'Ruby on Rails with Nginx on Debian 8'
external_resources:
 - '[Ruby on Rails Home Page](http://rubyonrails.org/)'
 - '[Ruby on Rails Documentation](http://rubyonrails.org/documentation)'
 - '[Nginx Home Page](http://nginx.org/)'
 - '[Nginx Documentation](http://nginx.org/en/docs/)'
 - '[Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

Ruby on Rails is a rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications. This guide describes the required process for deploying Ruby on Rails with Passenger and the Nginx web server on Debian 8.

![Ruby on Rails with nginx on Debian 8](/docs/assets/ruby_on_rails_with_nginx_debian_8_smg.png "Ruby on Rails with nginx on Debian 8")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Follow the [Getting Started](/docs/getting-started) and [Securing the Server](/docs/security/securing-your-server) guides, and [set the Linode's hostname](/docs/getting-started#setting-the-hostname).

    To check the hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

3.  Uninstall Nginx, if currently installed on the Linode. Nginx does not support loadable modules and is contained in the Phusion Passenger package:

        sudo apt-get remove nginx nginx-full nginx-light nginx-common


## Install Passenger and Nginx

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential ruby ruby-dev zlib1g-dev libruby libssl-dev libpcre3-dev libcurl4-openssl-dev rake ruby-rack rails

    Additionally, the deployed application will likely have dependencies. Install these dependencies before proceeding.

2.  Phusion hosts a repository containing the latest version of Phusion Passenger. To add this to the package manager, first install the Phusion PGP key:

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7

3.  With `sudo` or as the root user, create the file `/etc/apt/sources.list.d/passenger.list` with the following contents:

    {{< file "/etc/apt/sources.list.d/passenger.list" aconf >}}
deb https://oss-binaries.phusionpassenger.com/apt/passenger jessie main

{{< /file >}}


4.  Enable HTTPS support for APT:

        sudo apt-get install apt-transport-https

5.  Update the local package database and install Phusion Passenger:

        sudo apt-get update
        sudo apt-get install nginx-extras passenger

6.  Run the Phusion Passenger installer for Nginx:

        sudo passenger-install-nginx-module

    This starts the Phusion Passenger Nginx installer program. Press "Enter" to continue with the installation.

    The installation process will begin an interactive session that will navigate through the process of building Phusion Passenger. When prompted for the Nginx installation method, we recommend selecting "1" for both options to allow the installer to automatically download, compile, and install Nginx.


## Enable Passenger Support and Start Nginx

1.  Nginx is now installed on the system, but support for Phusion Passenger is not enabled. As root, or with the `sudo ` command, edit the file `/etc/nginx/nginx.conf` and uncomment these lines:

    {{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
passenger_root /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini;
passenger_ruby /usr/bin/passenger_free_ruby;

{{< /file-excerpt >}}


2.  Restart Nginx:

        sudo systemctl restart nginx

3.  To verify that Passenger support has been installed and enabled correctly:

        sudo passenger-memory-stats

    If Passenger is running, a few running processes should be displayed under the "Passenger processes" section:

        ----- Passenger processes -----
        PID    VMSize    Private  Name
        -------------------------------
        14337  420.8 MB  1.1 MB   Passenger watchdog
        14340  559.3 MB  1.4 MB   Passenger core
        14345  292.5 MB  1.2 MB   Passenger ust-router

    The configuration file for Nginx is located at `/etc/nginx/nginx.conf`. This file must be edited to add support for Rails applications. A default server is already configured in this file, and it also contains examples for alternate virtual host and SSL configurations.


## Install MySQL Support (Optional)

If the application deployed uses MySQL, install the database server by following our [MySQL on Debian 8](/docs/databases/mysql/mysql-relational-databases-debian-8) guide. Once it's installed and configured properly, issue the following command:

    sudo apt-get install libmysqlclient-dev