---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Apache web server with Debian to serve Ruby on Rails applications.'
og_description: 'This tutorial will teach you how to use an Apache web server with Debian 8 to serve Ruby on Rails applications'
keywords: ["ruby on rails", "rails on debian", "rails apps", "rails and apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/ror/ruby-on-rails-apache-debian-8/']
modified: 2018-03-08
modified_by:
  name: Jared Kobos
deprecated_link: 'development/ror/ruby-on-rails-apache-debian'
title: 'Install Ruby on Rails with Apache on Debian 9'
external_resources:
 - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
 - '[mod_rails Documentation for Apache Servers](http://www.modrails.com/documentation/Users%20guide%20Apache.html)'
---

![Ruby on Rails with Apache on Debian 8](/docs/assets/ruby_on_rails_with_apache_debian_8.png "Ruby on Rails with Apache on Debian 8")

## What is Ruby on Rails?

Ruby on Rails is a rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications. This guide deploys Rails applications using the Phusion Passenger or `mod_rails` method. Passenger allows you to embed Rails apps directly in Apache applications without needing to worry about FastCGI or complex web server proxies.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install Apache

1.  Install Apache and its dependencies:

        sudo apt-get install apache2 apache2-doc apache2-utils

2.  Copy the default site configuration file:

        sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

3.  Disable the default site:

        sudo a2dissite 000-default.conf

## Install RVM and Ruby

Ruby will be installed with the Ruby Version Manager (RVM), which makes it easy to install and manage different versions of Ruby on the same system.

{{< content "install-ruby-with-rvm.md" >}}

## Install Ruby on Rails

Use the Rubygems package manager to install Rails:

        sudo gem install rails --version=5.1.4

## Install Passenger and Dependencies

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential libapache2-mod-passenger ruby ruby-dev libruby zlib1g-dev libsqlite3-dev

2.  Rails requires a working Javascript runtime on your system in order to run. If you do not already have one installed, use Node.js:

        sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        sudo apt install nodejs

3.  Add `rails` to your $PATH environment variable. Make sure to replace `VERSION` with the version of Ruby you are running:

        ls /var/lib/gems
        PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/var/lib/gems/VERSION/bin"

    {{< note >}}
The step above will only add this PATH to your current session. To retain the change persistently, add the PATH to your local \~/.bashrc file:

echo "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/var/lib/gems/VERSION/bin" >> ~/.bashrc
{{< /note >}}

4.  Move your Rails app to your Linode, or create a new app if you don't have one yet. Replace `example-app` with a descriptive name:

        rails new example-app

## Configure Apache to Work with Passenger

1.  Open `/etc/apache2/sites-available/example.com.conf` in a text editor and edit it as follows:

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
<VirtualHost *:80>
    #ServerName www.example.com

    ServerAdmin webmaster@localhost
    DocumentRoot /home/username/example-app/public
    RailsEnv development

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory "/var/www/html/example.com/public_html/application_testing/public">
        Options FollowSymLinks
        Require all granted
    </Directory>
</VirtualHost>
{{< /file >}}


2.  Restart Apache to ensure all settings have been loaded:

        sudo systemctl restart apache2

8.  Navigate to your Linode's public IP address in a browser. You should see the default Rails page displayed.
