---
slug: ruby-on-rails-apache-debian-8
description: 'Using the Apache web server with Debian 8 Wheezy to serve Ruby on Rails applications.'
keywords: ["ruby on rails", "rails on debian", "rails apps", "rails and apache"]
tags: ["web applications","debian","apache","ruby"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/ror/ruby-on-rails-apache-debian-8/','/websites/ror/ruby-on-rails-apache-debian-8/']
modified: 2017-09-13
modified_by:
  name: Elle Krout
published: 2013-07-13
deprecated: true
deprecated_link: 'development/ror/ruby-on-rails-apache-debian'
title: 'Install Ruby on Rails with Apache on Debian 8'
og_description: 'This tutorial will teach you how to use an Apache web server with Debian 8 to serve Ruby on Rails applications'
external_resources:
 - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
 - '[mod_rails Documentation for Apache Servers](http://www.modrails.com/documentation/Users%20guide%20Apache.html)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["ruby"]
relations:
    platform:
        key: ruby-on-rails-apache
        keywords:
            - distribution: Debian 8
authors: ["Linode"]
---

Ruby on Rails is a rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications. This guide deploys Rails applications using the Phusion Passenger or `mod_rails` method. Passenger allows you to embed Rails apps directly in Apache applications without needing to worry about FastCGI or complex web server proxies.

![Ruby on Rails with Apache on Debian 8](ruby_on_rails_with_apache_debian_8.png "Ruby on Rails with Apache on Debian 8")

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system and configure your hostname. You may also wish to set the timezone, create a limited user account, and harden SSH access.

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN) if you have one assigned.

## Installing Passenger and Dependencies

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential libapache2-mod-passenger apache2 ruby ruby-dev libruby zlib1g-dev libsqlite3-dev

2.  Using the `gem` package manager for Ruby modules, install the `fastthread` gem:

        sudo gem install fastthread

3.  Install Ruby On Rails:

        sudo gem install rails

    {{< note respectIndent=false >}}
If you require a specific version of Ruby On Rails, issue one of the following commands for the version you need:

gem install rails --version 2.1.2
gem install rails --version 2.2.2
gem install rails --version 2.3.5
gem install rails --version 3.0.4
{{< /note >}}

    This will install the appropriate versions of all required packages including ruby, rack, and other dependencies needed for basic Rails development.

4.  (Optional) Install additional dependencies for your application, such as [MySQL](/docs/guides/how-to-install-mysql-on-debian-8/) support:

        sudo apt-get install mysql-server libmysqlclient-dev mysql-client mysql-common
        sudo gem install mysql

    Any other dependencies can be installed mimicking the steps above: Install the needed packages, then the needed gem.

5.  Add `rails` to your $PATH environment variable. Make sure to replace `VERSION` with the version of Ruby you are running:

        ls /var/lib/gems
        PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/var/lib/gems/VERSION/bin"

    {{< note respectIndent=false >}}
The step above will only add this PATH to your current session. To retain the change persistently, add the PATH to your local \~/.bashrc file:

echo "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/var/lib/gems/VERSION/bin" >> ~/.bashrc
{{< /note >}}

6.  In your website's public folder start a new rails project, to ensure everything is properly configured. Replace `application` with your application's name:

        sudo rails new /var/www/html/example.com/public_html/application


## Configuring Apache to Work with Passenger

If your Apache virtual hosts file(s) mimics the ones create in the [Apache Web Server on Debian 8](/docs/guides/apache-web-server-debian-8/) guide, you will have a `<VirtualHost>` block containing a `DocumentRoot` value similar to `/var/www/html/example.com/public_html/`.

1.  Open the file in a text editor, and edit the `DocumentRoot` to reflect the public directory of your application:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
DocumentRoot /var/www/html/example.com/application/public

{{< /file >}}


2.  Restart Apache to ensure all settings have been loaded:

        sudo systemctl restart apache2


### Deploying Multiple Rails Apps

There are a number of strategies for deploying more than one Rails application using Passenger. The simplest approach requires running multiple distinct virtual hosts configured as above to host a single Rails app each. Alternatively, you may host multiple Rails apps within a single virtual host. This section covers the latter option.

1.  Add `RailsBaseURI` directives that specify the path to your Rails application within the VirtualHost configuration as in the following example:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
DocumentRoot /var/www/html/example.com/public_html/
RailsBaseURI /app1
RailsBaseURI /app2
RailsBaseURI /app3

{{< /file >}}


    These directives configure Passenger to run three Rails apps on the `example.com` site at the three locations specified.

2.  Link the `public/` directory of the application to a directory within the `public_html/` directory:

        ln -s /var/www/html/example.com/app1/public/ /var/www/html/example.com/public_html/app1/
        ln -s /var/www/html/example.com/app1/app2/ /var/www/html/example.com/public_html/app2/
        ln -s /var/www/html/example.com/app1/app3/ /var/www/html/example.com/public_html/app3/

Congratulations! You have successfully deployed Ruby On Rails applications with the Apache Web server and Passenger.
