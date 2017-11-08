---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy simple web applications with the Sinatra web development framework.'
keywords: 'sinatra,ruby,web applications,development,deployment'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['frameworks/sinatra/fedora-14/','websites/frameworks/sinatra-framework-and-nginx-on-fedora-14/']
modified: Thursday, September 26th, 2013
modified_by:
  name: Linode
published: 'Tuesday, April 5th, 2011'
title: Sinatra Framework and nginx on Fedora 14
---



Sinatra is a simple lightweight framework for web application development in the Ruby programming language. Rather than providing a complete development system, Sinatra provides a basic URL-mapping system that developers can use to create powerful custom applications.

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install Software
----------------

Issue the following commands to update your system's package database, ensure that the latest version of all installed packages are up to date, and install all dependencies required for Sinatra:

    yum update
    yum install ruby-devel ruby ruby-irb  rubygems zlib-devel wget openssl-devel pcre pcre-devel make gcc gcc-c++ curl-devel

Install the `rack`, `rake` and `sinatra` gems:

    gem install rack rake sinatra

Your application may require additional dependencies. If this is the case, install these gems at this point using the `gem install` tool.

Install Nginx
-------------

Proceed to the [Phusion Passenger](http://www.modrails.com/install.html) site and locate the link for the current source code tarball. Download it as follows (substitute the link for the current version):

    cd /opt
    wget http://rubyforge.org/frs/download.php/74326/passenger-3.0.3.tar.gz
    tar xzvf passenger-3.0.3.tar.gz

Run the Phusion Passenger installer for Nginx:

    cd /opt/passenger-3.0.3/bin
    ./passenger-install-nginx-module

Press "Enter" to continue with the installation. When prompted for the Nginx installation method, we recommend you choose "1" to allow the installer to automatically download, compile, and install Nginx for you. Unless you have specific needs that would necessitate passing custom options to Nginx at compile time, this is the safest way to proceed.

Do **not** remove the Passenger files from `opt` after the install. They need to stay in place or your install will not function correctly.

Configure Web Server
--------------------

Nginx is now installed in `/opt/nginx`, but there are no "init" scripts to control this process. Issue the following sequence of commands to download a script, move it to the proper directory, set the proper permissions and set system startup links:

    cd /opt
    wget -O init-rpm.sh http://www.linode.com/docs/assets/606-init-rpm.sh
    mv /opt/init-rpm.sh /etc/init.d/nginx
    chmod +x  /etc/init.d/nginx
    chkconfig --add nginx
    chkconfig nginx on

You can now start, stop, and restart Nginx using the following commands:

    /etc/init.d/nginx start
    /etc/init.d/nginx stop
    /etc/init.d/nginx restart

To start the web server for the first time, issue the following command:

    /etc/init.d/nginx start

Create the following directories beneath the `/srv/www` hierarchy for your application. Modify `example.com` to match the domain of the site you are deploying:

    mkdir -p /srv/www/example.com/application
    mkdir -p /srv/www/example.com/application/public
    mkdir -p /srv/www/example.com/application/log
    mkdir -p /srv/www/example.com/application/tmp
    mkdir -p /srv/www/example.com/logs
    mkdir -p /srv/www/example.com/public

Insert the following line into the `/opt/nginx/conf/nginx.conf` file, modifying the path for `/srv/www/example.com/nginx.conf` to match the directory created above:

{: .file-excerpt }
/opt/nginx/conf/nginx.conf
:   ~~~ nginx
    # [...]
    http {
        include /srv/www/example.com/nginx.conf;
        passenger_root /opt/passenger-3.0.1;
        passenger_ruby /usr/bin/ruby;
    # [...]
    ~~~

This inserts the contents of `/srv/www/example.com/nginx.conf` into your nginx configuration, and allows you to specify the configuration of the virtual host for the `example.com` site. Consider the following example configuration, and modify this file to meet the needs of your deployment:

{: .file }
/srv/www/example.com/nginx.conf
:   ~~~ nginx
    server {
            listen 80;
            server_name www.example.com example.com;

        access_log /srv/www/example.com/logs/access.log;
            error_log /srv/www/example.com/logs/error.log;

            root /srv/www/example.com/application/public;
            passenger_enabled on;

        location /static {
                root   /srv/www/example.com/public;
                index  index.html index.htm;
            }

    }
    ~~~

Your Sinatra application will handle all requests for the `www.example.com` and `example.com` domains, except those that begin with `/static` which are handled directly by nginx. When this configuration has been created and properly modified, issue the following command to restart the web server:

    /etc/init.d/nginx restart

Create a Basic Sinatra Application
----------------------------------

The following is a very basic Sinatra application. Place the following code in the `/srv/www/example.com/application/app.rb` file.

{: .file }
/srv/www/example.com/application/app.rb
:   ~~~ ruby
    require 'rubygems'
    require 'sinatra'

    get '/' do
      "Hello and Goodbye"
    end

    get '/hi' do
      "Hello World! :)"
    end

    get '/bye' do
      "Goodbye World! :("
    end
    ~~~

Deploy Sinatra Applications with Rack
-------------------------------------

Create a Rack configuration file located at `/srv/www/example.com/application/config.ru` to allow Passenger to run your application properly. Deploy the following `config.ru` file:

{: .file }
/srv/www/example.com/application/config.ru
:   ~~~ ruby
    require 'rubygems'
    require 'sinatra'

    require 'app'
    run Sinatra::Application
    ~~~

The `require 'app'` statement references the `app.rb` file. Modify this line to `require` your application. Any time you make changes to your Rack file or your application, issue the following command so that Passenger will restart your application:

    touch /srv/www/example.com/application/tmp/restart.txt

You can now access your Sinatra application by visiting `http://example.com/`in your web browser. If you used the example application above, visit "`http://example.com/`, `http://example.com/hi`, and `http://example.com/bye` to view different messages.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Sintra Project Home Page](http://www.sinatrarb.com/)



