---
slug: use-unicorn-and-nginx-on-ubuntu-18-04
description: 'Use Unicorn and Nginx to Configure a Ruby on Rails Stack on Ubuntu 18.04 '
keywords: ["ruby on rails", "unicorn rails", "ruby on rails ubuntu 18.04", " nginx", "reverse proxy", "ubuntu 18.04"]
tags: ["web applications","proxy","ruby","nginx","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/ror/use-unicorn-and-nginx-on-ubuntu-18-04/','/websites/ror/use-unicorn-and-nginx-on-ubuntu-18-04/']
published: 2020-01-03
modified: 2020-01-03
modified_by:
    name: Linode
image: UseUnicornandNginxtoConfigureRubyon-RailsApplicationsonUbuntu1804.png
title: "Deploy a Ruby on Rails App with Unicorn and nginx on Ubuntu 18.04"
title_meta: "Deploy a Rails App with Unicorn and nginx on Ubuntu 18.04"
external_resources:
 - '[Ruby on Rails](http://rubyonrails.org/)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["ruby"]
relations:
    platform:
        key: unicorn-nginx
        keywords:
            - distribution: Ubuntu 18.04
authors: ["Linode"]
---

Ruby on Rails is a popular web-application framework that allows developers to create dynamic web applications. This guide describes how to deploy Rails applications on servers using Unicorn and nginx on Ubuntu 18.04.

Unicorn is an HTTP server, just like Passenger or Puma. Since Unicorn cannot be accessed by users directly we will be using nginx as the reverse proxy that will buffer requests and response between users and Rails application.

## Before You Begin

Before starting this guide, make sure that  you have read through and completed our [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) and [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

-  Before you install any package, ensure that your hostname is correct:

        hostname
        hostname -f

-  Make sure your system is up to date:

        sudo apt-get update && apt-get upgrade

## Install Node.js
   Some of the features in Rails, such as the Asset Pipeline, depend on a JavaScript Runtime and Node.js provides this functionality.

1.  Install Node.js using a PPA (personal package archive) maintained by NodeSource:

        curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh

2.  Run the script:

        sudo bash nodesource_setup.sh

3.  Install the Node.js package:

        sudo apt-get install nodejs

4.  Check the version of Node.js:

        nodejs -v

## Install Yarn

1. Configure the repository to install Yarn using Debian package repository:

        curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
        echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

2. Install Yarn:

        sudo apt update && sudo apt install yarn


## Install Ruby

1.  Install Ruby dependencies:

        sudo apt-get install autoconf bison build-essential libssl-dev libyaml-dev libreadline-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm-dev libsqlite3-dev

2.  Download the latest version of Ruby. At the time of writing this article, the current, most recent and stable version is 2.7, but you can check for the latest version [here](https://www.ruby-lang.org/en/downloads/):

        wget https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.0.tar.gz

3.  Unpack the tarball:

        tar -xzvf ruby-2.7.0.tar.gz

4.  Move to the extracted directory:

        cd ruby-2.7.0

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
app_dir = File.expand_path("../..", __FILE__)
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

    {{< note respectIndent=false >}}
Please note that we are still in the Rails application directory.
{{< /note >}}

## Install and Configure Nginx

1.  Install nginx:

        sudo apt-get install nginx

2.  We need to configure nginx to work as the reverse proxy. Edit the config file `/etc/nginx/nginx.conf` and paste the following configuration in the HTTP block:

    {{< file "/etc/nginx/nginx.conf" nginx >}}
upstream rails {
# Path to Unicorn socket file
server unix:/home/username/example/shared/sockets/unicorn.sock fail_timeout=0;
}

{{< /file >}}


    {{< note respectIndent=false >}}
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


    {{< note respectIndent=false >}}
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

    {{< note respectIndent=false >}}
Make sure you are in the application directory; otherwise, you will need to type in the whole path	name.
{{< /note >}}

- To stop Unicorn, issue the following command:

        sudo pkill unicorn
