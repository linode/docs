---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy simple web applications with the Sinatra web development framework.'
keywords: ["sinatra", "ruby", "web applications", "development", "deployment"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/sinatra/debian-5-lenny/','websites/frameworks/sinatra-framework-and-nginx-on-debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-01-21
title: 'Sinatra Framework and nginx on Debian 5 (Lenny)'
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

To install a more current version of Ruby Gems, which is required for running Sinatra Applications on Debian 5 (Lenny), you must install several packages from the [Backports project](http://backports.debian.org). Insert the following line in your `/etc/apt/sources.list` file:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://backports.debian.org/debian-backports lenny-backports main

{{< /file-excerpt >}}


Issue the following commands to update your system's package database and all installed packages, and install the backports repository's key:

    apt-get update
    apt-get upgrade
    apt-get install debian-backports-keyring

Add the following snippet to the `/etc/apt/preferences` file (you may need to create it):

{{< file-excerpt "/etc/apt/preferences" nginx >}}
# [...]
http {
    include /srv/www/example.com/nginx.conf;
    passenger_root /opt/passenger-3.0.1;
    passenger_ruby /usr/bin/ruby1.8;
# [...]

{{< /file-excerpt >}}


This inserts the contents of `/srv/www/example.com/nginx.conf` into your nginx configuration, and allows you to specify the configuration of the virtual host for the `example.com` site. Consider the following example configuration, and modify this file to meet the needs of your deployment:

{{< file "/srv/www/example.com/nginx.conf" nginx >}}
server {
        listen 80;
        server_name www.example.com example.com;

    access_log /srv/www/example.com/logs/access.log;
        error_log /srv/www/example.com/logs/error.log;

        root /srv/www/example.com/application/public;
        passenger_enabled on;

    location /static {
            root   /srv/www/example.com/public;
            index  index.html index.htm index.php;
        }

}

{{< /file >}}


Your Sinatra application will handle all requests for the `www.example.com` and `example.com` domains, except those that begin with `/static` which are handled directly by nginx. When this configuration has been created and properly modified, issue the following command to restart the web server:

    /etc/init.d/nginx restart

Create a Basic Sinatra Application
----------------------------------

The following is a very basic Sinatra application. Place the following code in the `/srv/www/example.com/application/app.rb` file.

{{< file "/srv/www/example.com/application/app.rb" ruby >}}
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

{{< /file >}}


Deploy Sinatra Applications with Rack
-------------------------------------

Create a Rack configuration file located at `/srv/www/example.com/application/config.ru` to allow Passenger to run your application properly. Deploy the following `config.ru` file:

{{< file "/srv/www/example.com/application/config.ru" ruby >}}
require 'rubygems'
require 'sinatra'

require 'app'
run Sinatra::Application

{{< /file >}}


The `require 'app'` statement references the `app.rb` file. Modify this line to `require` your application. Any time you make changes to your Rack file or your application, issue the following command so that Passenger will restart your application:

    touch /srv/www/example.com/application/tmp/restart.txt

You can now access your Sinatra application by visiting `http://example.com/`in your web browser. If you used the example application above, visit "`http://example.com/`, `http://example.com/hi`, and `http://example.com/bye` to view different messages.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Sintra Project Home Page](http://www.sinatrarb.com/)



