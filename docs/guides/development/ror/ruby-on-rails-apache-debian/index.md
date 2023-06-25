---
slug: ruby-on-rails-apache-debian
description: 'Using the Apache web server with Debian to serve Ruby on Rails applications.'
og_description: 'This tutorial will teach you how to use an Apache web server with Debian 8 to serve Ruby on Rails applications'
keywords: ["ruby on rails", "rails on debian", "rails apps", "rails and apache", "deploy rails"]
tags: ["web applications","debian","apache","ruby"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/ror/ruby-on-rails-apache-debian/','/websites/ror/ruby-on-rails-apache-debian-9/','/frameworks/ruby-on-rails-apache/ubuntu-10.04-lucid/']
published: 2018-03-12
modified: 2018-03-12
modified_by:
  name: Jared Kobos
title: 'Install Ruby on Rails with Apache on Debian 9'
external_resources:
 - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
 - '[Phusion Passenger](https://www.phusionpassenger.com/)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["ruby"]
relations:
    platform:
        key: ruby-on-rails-apache
        keywords:
            - distribution: Debian 9
authors: ["Linode"]
---

![Ruby on Rails with Apache on Debian](ruby_on_rails_with_apache_debian.jpg "Ruby on Rails with Apache on Debian")

## What is Ruby on Rails?

[Ruby on Rails](http://rubyonrails.org/) is a server-side web application framework. It maintains a curated set of components and a "convention over configuration" philosophy that makes it possible to develop applications quickly and without large amounts of boilerplate. This guide will show you how to deploy Rails applications on your Linode using Phusion Passenger. Passenger allows you to embed Rails apps directly in Apache applications without needing to worry about FastCGI or complex web server proxies.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) to create a standard user account, harden SSH access and remove unnecessary network services.

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

{{< content "install-ruby-with-rvm" >}}

## Install Passenger and Dependencies

1.  Install Passenger and other required packages:

        sudo apt-get install build-essential libapache2-mod-passenger ruby ruby-dev libruby zlib1g-dev libsqlite3-dev

2.  Rails requires a working JavaScript runtime on your system in order to run. If you do not already have one installed, use Node.js:

        sudo curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
        sudo apt install nodejs

## Install Ruby on Rails

1.  Use the Rubygems package manager to install Rails:

        gem install rails --version=5.1.4

2.  Move your Rails app to your Linode, or create a new app if you don't have one yet. Replace `example-app` with a descriptive name:

        rails new example-app

## Configure Apache to Work with Passenger

1.  Check the path that Passenger is using to access Ruby:

        sudo passenger-config about ruby-command

    {{< note respectIndent=false >}}
Make sure that Passenger reports the version of Ruby that you installed with RVM. Normally RVM uses paths similar to `~/.rvm/wrappers/ruby-X.X.X/ruby`.
{{< /note >}}

2.  Open `/etc/apache2/sites-available/example.com.conf` in a text editor and edit it as follows. Substitute the path to your Rails app, path to your Ruby interpreter (from the previous step), hostname or IP address, and any other information as necessary.

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
<VirtualHost *:80>
    ServerName www.example.com

    ServerAdmin webmaster@localhost
    DocumentRoot /home/username/example-app/public
    RailsEnv development
    PassengerRuby /path-to-ruby

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    <Directory "/home/username/example-app/public">
        Options FollowSymLinks
        Require all granted
    </Directory>
</VirtualHost>
{{< /file >}}


2.  Activate the Rails site:

        sudo a2ensite example.com.conf

3.  Restart Apache:

        sudo systemctl restart apache2

4.  Navigate to your Linode's public IP address in a browser. You should see the default Rails page displayed.
