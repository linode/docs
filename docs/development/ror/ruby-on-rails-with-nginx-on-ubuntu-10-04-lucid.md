---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using the Ruby on Rails framework for Nginx web applications on the Ubuntu 10.04 operating system.'
keywords: ["ruby on rails", "ruby on nginx", "rails apps"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/ruby-on-rails-nginx/ubuntu-10-04-lucid/','websites/ror/ruby-on-rails-with-nginx-on-ubuntu-10-04-lucid/']
modified: 2014-02-05
modified_by:
  name: Alex Fornuto
published: 2010-07-29
title: 'Ruby on Rails with Nginx on Ubuntu 10.04 (Lucid)'
---



Ruby on Rails is a popular rapid development web framework that allows web designers and developers to implement fully featured dynamic web applications using the Ruby programming language. This guide describes the required process for deploying Ruby on Rails with Passenger and the nginx web server on Ubuntu 10.04 (Lucid).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following command to reload your system's package repositories and ensure that all installed programs are up to date:

    apt-get update
    apt-get upgrade

Use the following command to install system packages required for using Ruby, building Ruby modules, and running Rails applications:

    apt-get install wget build-essential ruby1.8 ruby1.8-dev irb1.8 rdoc1.8 zlib1g-dev libopenssl-ruby1.8 libopenssl-ruby libzlib-ruby libssl-dev libpcre3-dev

Issue the following sequence of commands to install the latest version of Ruby Gems for managing ruby-specific packages:

    cd /opt/
    wget http://production.cf.rubygems.org/rubygems/rubygems-1.5.1.tgz
    tar -zxvf rubygems-1.5.1.tgz
    cd /opt/rubygems-1.5.1/
    ruby setup.rb
    ln -s /usr/bin/gem1.8 /usr/bin/gem

In the future you can issue the following command to update your version of `gem` to the latest release:

    gem update --system

Create symbolic links to the installed version of Ruby:

    ln -s /usr/bin/ruby1.8 /usr/bin/ruby
    ln -s /usr/bin/irb1.8 /usr/bin/irb

Install the `rake` and `rack` gems:

    gem install rake rack
    ln -s /var/lib/gems/1.8/bin/rake /usr/bin/

Finally, install the version of Ruby On Rails that your application requires. Issue one the following commands for the version you need:

    gem install rails --version 2.1.2
    gem install rails --version 2.2.2
    gem install rails --version 2.3.5
    gem install rails --version 3.0.4

If you are unsure of the version you require, you can install the latest version with the following command:

    gem install rails

Additionally, the application you deploy will likely have additional dependencies. Install these dependencies before proceeding.

# Install Passenger and Nginx

Proceed to the [Phusion Passenger](http://www.modrails.com/install.html) site and locate the link for the current source code tarball. Download it as follows (substitute the link for the current version):

    cd /opt
    wget http://rubyforge.org/frs/download.php/73563/passenger-3.0.1.tar.gz
    tar xzvf passenger-3.0.1.tar.gz

Run the Phusion Passenger installer for Nginx:

    cd /opt/passenger-3.0.1/bin
    ./passenger-install-nginx-module

You'll be greeted by the Phusion Passenger nginx installer program. Press "Enter" to continue with the installation.

[![Phusion Passenger nginx installer program running on Ubuntu 10.04 (Lucid).](/docs/assets/350-01-passenger-nginx-installer.png)](/docs/assets/350-01-passenger-nginx-installer.png)

The installation process will begin an interactive session that will guide you through the process of building Phusion Passenger. When prompted for the nginx installation method, we recommend you choose "1" for both options to allow the installer to automatically download, compile, and install nginx for you. Unless you have specific needs that would necessitate passing custom options to nginx at compile time, this is the safest way to proceed. Accept the default installation location for nginx.

Please do **not** remove the Passenger files from `opt` after the installation. They need to stay in place or your installation will not function correctly.

# Set up an Init Script for Nginx

Nginx is now installed in `/opt/nginx`, but there are no "init" scripts to control this process. Issue the following sequence of commands to download a script, move it to the proper directory, set the proper permissions and set system startup links:

    cd /opt
    wget -O init-deb.sh http://www.linode.com/docs/assets/601-init-deb.sh
    mv /opt/init-deb.sh /etc/init.d/nginx
    chmod +x /etc/init.d/nginx
    /usr/sbin/update-rc.d -f nginx defaults

You can now start, stop, and restart Nginx just like any other server daemon. For example, to start the server, issue the following command:

    /etc/init.d/nginx start

The configuration file for Nginx is located at `/opt/nginx/conf/nginx.conf`. This is the file you'll need to edit to add support for your Rails applications. A default server is already configured in this file, and it also contains examples for alternate virtual host and SSL configurations.

# Install MySQL Support (optional)

If your application uses MySQL, install the database server by following our [MySQL on Ubuntu 10.04 (Lucid) guide](/docs/databases/mysql/ubuntu-10-04-lucid). Once it's installed and configured properly, issue the following commands:

    apt-get install libmysqlclient15-dev libmysql-ruby
    gem install mysql --no-rdoc --no-ri -- --with-mysql-dir=/usr/bin --with-mysql-lib=/usr/lib/mysql --with-mysql-include=/usr/include/mysql

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Ruby on Rails Home Page](http://rubyonrails.org/)
- [Ruby on Rails Documentation](http://rubyonrails.org/documentation)
- [Nginx Home Page](http://nginx.org/)
- [Nginx Documentation](http://nginx.org/en/docs/)
- [Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)



