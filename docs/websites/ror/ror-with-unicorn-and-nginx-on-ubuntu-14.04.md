---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Setup Ruby on Rails stack on Ubuntu 14.04 using Nginx and Unicorn'
keywords: 'ruby on rails,unicorn rails,ruby on rails ubuntu 14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Tuesday, November 20rd, 2015'
modified: Tuesday, November 20rd, 2015
modified_by:
    name: Linode
title: 'How to deploy Ruby on Rails applications with Unicorn and Nginx on Ubuntu 14.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/rootaux
external_resources:
 - '[Ruby on Rails](http://rubyonrails.org/)'
---

Ruby on Rails is a popular web-application framework that allows developers to create a dynamic web application. This guide describes how to deploy Rails applications on server using Unicorn and Nginx on Ubuntu 14.04.

Unicorn is an HTTP server, just like Passenger or Puma. Since Unicorn cannot be accessed by users directly we will be using Nginx as the reverse proxy that will buffer requests and response between users and Rails application.

Before starting this guide, make sure that  you have read through and completed our [Getting Started](/docs/getting-started#debian-7--slackware--ubuntu-1404) and [Securing Your Server](/docs/security/securing-your-server/) guides.

##Set the hostname

1.  Before you install any package, ensure that your hostname is correct by completing the [Setting Your Hostname](/docs/getting-started#sph_setting-the-hostname) section of the Getting Started guide. Issue the following commands to verify that hostname:

        hostname
        hostname -f

##System Setup

2.  Make sure your system is up to date using apt:

        sudo apt-get update && apt-get upgrade

This ensures that all software is up to date and running the latest version.

##Install Ruby

1.	Install Ruby dependencies using APT:

		sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev nodejs

2.	Download the latest version of Ruby. At the time of writing this article, current latest and stable version is 2.2.3:

		wget https://cache.ruby-lang.org/pub/ruby/2.2/ruby-2.2.3.tar.gz

3.	Unpack the tarball:	

		tar -xzvf ruby-2.2.3.tar.gz

4.	Move to the extracted directory:

		cd ruby-2.2.3.tar.gz

5.	Compile the Ruby:	

		./configure

6.	Getting ready for the installation:

		make

7.	Issue the following command and it will install Ruby:

		sudo make install

##Install Rails

	sudo gem install rails

##Create Rails application

Before creating our project, we should move to the home directory:

	cd

1.	Create a new rails project. We will be using `example` as our project name:

		rails new example

2.	Move to the project directory:

		cd example

##Install Unicorn

	sudo gem install unicorn

##Configure Unicorn

Create the file `config/unicorn.rb` which contains unicorn configuration and paste the following configuration in the file.

{: .file}
/home/username/example/config/unicorn.rb
:	~~~ # set path to the application
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
	~~~

Now create directories which we mentioned in the Unicorn config file:

	mkdir -p shared/pids shared/sockets shared/log

{: .note}
>
>Please note that we are still in the Rails application directory

##Install Nginx

Download and install Nginx using APT:

	sudo apt-get install nginx


##Configure Nginx

1. We need to configure Nginx to work as the reverse proxy. Edit the config file `/etc/nginx/nginx.conf`and paste the configuration in HTTP block:

{: .file-excerpt}
/etc/nginx/nginx.conf
:	~~~ upstream rails {
	    # Path to Unicorn socket file
	    server unix:/home/username/example/shared/sockets/unicorn.sock fail_timeout=0;
		}
	~~~

{: .note}
>
> Edit username and example with appropriate values. 

2. Remove the default nginx site configuration:

	sudo rm /etc/nginx/sites-enabled/default

3. Create new nginx site configuration file for Rails application:

{: .file}
/etc/nginx/sites-available/example
:	~~~	server {
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
    ~~~

{: .note}
>
>Make sure you change the username and example with the appropriate values.

4. Create a symlink to nginx’s `sites-enabled` directory to enable your site configuration file:

	sudo ln -s /etc/nginx/sites-available/example /etc/nginx/sites-enabled
	
5. Restart Nginx

	sudo service nginx restart

##Starting Unicorn

1.  If you want to start Unicorn in the development environment, issue the following command:

	    sudo unicorn -c config/unicorn.rb -E development -D

2.  For production environment, issue the following command:

	    sudo unicorn -c config/unicorn.rb -E production -D
	    
{: .note}
>
>Make sure you is in project directory else you need to type the whole path	

3.  To stop the Unicorn, issue the following command:

	    sudo pkill unicorn
