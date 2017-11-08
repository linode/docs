---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Use Unicorn and Nginx to Configure a Ruby on Rails Stack on Ubuntu 14.04 '
keywords: ["ruby on rails", "unicorn rails", "ruby on rails ubuntu 14.04", " nginx", "reverse proxy", "ubuntu 14.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/ror/use-unicorn-and-nginx-on-ubuntu-14-04/']
published: 2016-03-30
modified: 2016-03-30
modified_by:
    name: Alex Fornuto
title: 'Use Unicorn and Nginx to Configure Ruby on Rails Applications on Ubuntu 14.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/rootaux
external_resources:
 - '[Ruby on Rails](http://rubyonrails.org/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

Ruby on Rails is a popular web-application framework that allows developers to create dynamic web applications. This guide describes how to deploy Rails applications on servers using Unicorn and nginx on Ubuntu 14.04.

Unicorn is an HTTP server, just like Passenger or Puma. Since Unicorn cannot be accessed by users directly we will be using nginx as the reverse proxy that will buffer requests and response between users and Rails application.

![Use Unicorn and Nginx to Configure Ruby on Rails Applications on Ubuntu 14.04](/docs/assets/use_unicorn_and_nginx_to_configure_ruby_on_rails_apps_on_ubuntu_14_04.png "Use Unicorn and Nginx to Configure Ruby on Rails Applications on Ubuntu 14.04")

## Before You Begin

Before starting this guide, make sure that  you have read through and completed our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server/) guides.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

1.  Before you install any package, ensure that your hostname is correct:

        hostname
        hostname -f

2.  Make sure your system is up to date:

        sudo apt-get update && apt-get upgrade

## Install Ruby

1.  Install Ruby dependencies:

        sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev nodejs

2.  Download the latest version of Ruby. At the time of writing this article, the current, most recent and stable version is 2.3, but you can check for the latest version [here](https://www.ruby-lang.org/en/downloads/):

        wget https://cache.ruby-lang.org/pub/ruby/2.3/ruby-2.3.0.tar.gz

3.  Unpack the tarball:

        tar -xzvf ruby-2.3.0.tar.gz

4.  Move to the extracted directory:

        cd ruby-2.3.0

5.  Configure and install Ruby from source:

        ./configure
        make
        sudo make install

## Install and Create a Rails Application

1.  Install Rails on the server using `gem` (the package management framework for Ruby):

        sudo gem install rails

2.  Before creating your project, move to the home directory:

        cd

3.  Create a new Rails project. You will be using `example` as your project name:

        rails new example

4.  Move to the project directory:

        cd example

## Install and Configure Unicorn

1.  Install Unicorn on the server using `gem`:

        sudo gem install unicorn

2.  Create the file `config/unicorn.rb` which contains the unicorn configuration and paste the following configuration in the file.

    {{< file "/home/username/example/config/unicorn.rb" aconf >}}
# set path to the application
app_dir git File.expand_path("../..", __FILE__)
shared_dir = "#{app_dir}/shared"
working_directory app_dir

# Set unicorn options
worker_processes 2
preload_app true
timeout 30

# Path for the Unicorn socket
listen "#{shared_dir}/sockets/unicorn.sock", :backlog => 64

# Set path for logging
stderr_path "#{shared_dir}/log/unicorn.stderr.log"
stdout_path "#{shared_dir}/log/unicorn.stdout.log"

# Set proccess id path
pid "#{shared_dir}/pids/unicorn.pid"

{{< /file >}}


3.  Now, create the directories mentioned in the Unicorn config file:

        mkdir -p shared/pids shared/sockets shared/log

    {{< note >}}
Please note that we are still in the Rails application directory.
{{< /note >}}

## Install and Configure Nginx

1.  Install nginx:

        sudo apt-get install nginx

2.  We need to configure nginx to work as the reverse proxy. Edit the config file `/etc/nginx/nginx.conf` and paste the following configuration in the HTTP block:

    {{< file-excerpt "/etc/nginx/nginx.conf" nginx >}}
upstream rails {
# Path to Unicorn socket file
server unix:/home/username/example/shared/sockets/unicorn.sock fail_timeout=0;
}

{{< /file-excerpt >}}


    {{< note >}}
Edit `username` and `example` with appropriate values.
{{< /note >}}

3.  Remove the default nginx site configuration:

        sudo rm /etc/nginx/sites-enabled/default

4.  Create new nginx site configuration file for the Rails application:

    {{< file "/etc/nginx/sites-available/example" nginx >}}
server {
listen 80;
server_name localhost;

root /home/username/example;

try_files $uri/index.html $uri @rails;

location @rails {
   proxy_pass http://rails;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
   proxy_redirect off;
}

error_page 500 502 503 504 /500.html;
client_max_body_size 4G;
keepalive_timeout 10;
}

{{< /file >}}


    {{< note >}}
Make sure you change the username and example with the appropriate values.
{{< /note >}}

5.  Create a symlink to nginx’s `sites-enabled` directory to enable your site configuration file:

        sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled

6.  Restart nginx:

        sudo service nginx restart

## Start Unicorn

- To start Unicorn in the development environment:

      sudo unicorn -c config/unicorn.rb -E development -D

- To start Unicorn in the production environment:

      sudo unicorn -c config/unicorn.rb -E production -D

    {{< note >}}
Make sure you are in the application directory; otherwise, you will need to type in the whole path	name.
{{< /note >}}

- To stop Unicorn, issue the following command:

      sudo pkill unicorn
