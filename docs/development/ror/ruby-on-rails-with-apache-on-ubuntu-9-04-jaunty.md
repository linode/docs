---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Apache web server with Ubuntu 9.04 to serve Ruby on Rails applications.'
keywords: ["ruby on rails", "rails on ubuntu", "rails apps", "rails and apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-apache/ubuntu-9-04-jaunty/','websites/ror/ruby-on-rails-with-apache-on-ubuntu-9-04-jaunty/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-08-13
title: 'Ruby on Rails with Apache on Ubuntu 9.04 (Jaunty)'
external_resources:
  - '[Ruby on Rails Homepage](http://rubyonrails.org/)'
---



Ruby on Rails is a popular rapid development web framework that allows web designers and developers to implement, dynamic, fully featured web applications quickly, written in the Ruby programing language.

Rails enables developers to produce inventive applications on tight time scales. Some examples of well known Rails-powered sites include Hulu, GitHub, and the applications provided by 37 Signals, among many others.

This guide takes us from a fresh install of Ubuntu 9.04 (Jaunty), to a running Rails stack suitable for deployment in production. There are many different ways to deploy Rails stacks; if you have experience with an alternate stack, we encourage you to deploy your application in whatever you are most familiar. We've chosen to deploy with Phusion Passenger (e.g. mod\_rails or mod\_rack,) which allows us to embed Rails apps directly in Apache applications without needing to worry about FastCGI architectures and complex web server proxies.

Our goal is to provide instructions that are accessible and will have you up and running your with your Rails app as quickly as possible. We assume you've deployed and updated your Ubuntu 9.04 Jaunty Linode according to our [getting started](/docs/getting-started/) guide.

In addition to updating your system before beginning this guide, we recommend you review other guides in the Linode Docs so that you have a functioning installation of the [Apache web server](/docs/web-servers/apache/installation/ubuntu-9-04-jaunty) and a working installation of the [MySQL database server](/docs/databases/mysql/ubuntu-9-04-jaunty). With those prerequisites out of the way, we can get started with Rails. We will assume that you're logged in to your Linode via SSH and have a root prompt for the purpose of this tutorial.

## Installing Passenger and Dependencies

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Before we get started there are a number of system-level dependencies that you will almost certainly need as you begin deploying your Rails app. Lets get them out of the way at the beginning:

    apt-get install make build-essential

We going to add a repository to our `/etc/apt/sources.list` to install pakages of Passenger from Ubuntu's "universe" repository. Add the following lines to your `sources.list` with the text editor of your choice:

{{< file "/etc/apt/sources.list" >}}
deb http://us.archive.ubuntu.com/ubuntu/ jaunty universe
deb-src http://us.archive.ubuntu.com/ubuntu/ jaunty universe

{{< /file >}}


When you've saved this file, you will need to rebuild the package database:

    apt-get update

The collection of dependencies and extra software you install at this point will depend on your requirements. Ubuntu's package management tool will automatically download all required dependencies for the software you install. We'll begin by installing Ruby gems (for installing additional Ruby packages), the development packages for Ruby, and the Phusion passenger module for Apache 2.

    apt-get install libapache2-mod-passenger rubygems ruby1.8-dev

You will also want to install the `fastthread` Ruby gem:

    gem install fastthread

This should install the latest versions of all packages, including ruby, rake, rack, and other dependencies needed for basic Rails development. Additional dependencies may also include:

-   the OpenSSL library for Ruby.

        apt-get install libopenssl-ruby

-   other dependencies required by the application you wish to deploy.

## Configuring Apache to Work with Passenger

Passenger should be installed by default following the installation using `apt-get`, you can verify this by checking the contents of the `/etc/apache2/mods-enabled` directory with the following command:

    ls /etc/apache2/mods-enabled/passenger*

The output of this should look like this:

    /etc/apache2/mods-enabled/passenger.conf  /etc/apache2/mods-enabled/passenger.load

These files load and enable the Passenger module for use in your sites. If you configured Apache virtual hosting as outlined in the [Apache guide](/docs/web-servers/apache/installation/ubuntu-9-04-jaunty), the public directory for your domain (e.g. `example.com`) is located in `/srv/www/example.com/public_html/`, and your `<VirtualHost >` configuration block contains a line that reads:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/

{{< /file-excerpt >}}


In typical Passenger-based Rails deployments the application directory would be located in `/srv/www/example.com/`; for example `my-app/` would be located at `/srv/www/example.com/my-app/` and we would symbolically link (symlink) the `my-app/public/` folder to `/srv/www/example.com/public_html/`. We'll begin by removing the current `public_html/` directory if it already exists:

    rmdir /srv/www/example.com/public_html/

Then we'll create the symbolic link:

    ln -s /srv/www/example.com/my-app/public/ /srv/www/example.com/public_html

We'll want to restart Apache once to make sure all of our settings and configurations have been loaded:

    /etc/init.d/apache2 restart

**Note:** Passenger requires that the log files in your application be world writable (eg. chmod 666) and will produce an HTTP 500 Internal Server Error if the log files are not writable. Issue the following command to change the permissions of the files in the log directory of the "my-app" application in the setup above.

    chmod 666 /srv/www/example.com/my-app/log/*

You now have a functioning environment for your Ruby on Rails application.

## Deploying Multiple Rails Apps

If you need to install multiple Rails applications the easiest way to accomplish this is by installing each application in its own virtual host. Create multiple virtual hosts, as described in [Apache guide](/docs/web-servers/apache/installation/ubuntu-9-04-jaunty) and link the `public/` directory of your application to the DocumentRoot (e.g. `public_html/`) of the virtual host, as described above.

This presents a number of advantages. The Apache mpm\_itk module (described in the [Apache guide](/docs/web-servers/apache/installation/ubuntu-9-04-jaunty)) allows you to isolate the permissions of each running application from Apache and each other. Furthermore, virtual hosting allows you to separate all log files for each host (and thus application) from the other applications and sites on your server.

Passenger also supports deploying more than one Rails application within a single virtual host configuration. By adding `RailsBaseURI` options with the path to your Application within the virtual host, you can deploy multiple applications within one site. For example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
DocumentRoot /srv/www/example.com/public_html/
RailsBaseURI /my-app
RailsBaseURI /frogs
RailsBaseURI /simon

{{< /file-excerpt >}}


These lines, taken from a fictitious `<VirtualHost >` tell Passenger about three Rails apps in the `example.com` host. Rather than linking the `public/` directory of your Rails app to the `public_html/` directory of the Host, we'll link the public directory of the application to a folder below the `public_html/` directory. In this example the following commands will create the necessary symbolic links:

    ln -s /srv/www/example.com/my-app/public/ /srv/www/example.com/public_html/my-app/
    ln -s /srv/www/example.com/my-app/frogs/ /srv/www/example.com/public_html/frogs/
    ln -s /srv/www/example.com/my-app/simon/ /srv/www/example.com/public_html/simon/

In this setup the directories for each Rails application are located in the `/srv/www/example.com/` directory, which is not accessible to the web server. In practice, the application directories could be located wherever you like.

## Additional Tools

If you're new to Linux systems administration or Debian/Ubuntu based systems, we've collected some additional tips which you might find helpful.

-   Consider reading the Debian/Ubuntu section of our [package management guide](/docs/using-linux/package-management) to learn how to get the most out of the `apt` and `dpkg` tools.
-   Note that if you want to use the [Git Version Control System](http://www.git-scm.com/), the package name in Ubuntu is "git-core", not "git".
