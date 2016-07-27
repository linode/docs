---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Omnibus GitLab was originally designed on the idea of running one single Nginx server per machine. However, the newest versions of Omnibus allow you to unbundle the default Nginx server and install and configure your own as you like. This way, you can run multiple virtual servers on one machine.'
keywords: 'version control, git, gitlab, install gitlab on ubuntu, how to manage repositories with gitlab'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['gitlab-with-ubuntu/','applications/development/gitlab-on-ubuntu-14-04/']
contributor:
    name: Jordi Bassagañas
    link: https://twitter.com/programarivm
modified: Monday, February 29th, 2016
modified_by:
  name: Jordi Bassagañas
published: 'Monday, February 29th, 2016'
title: 'How to Unbundle Nginx from Omnibus GitLab for Serving Multiple Websites'
external_resources:
 - '[gitlab-ce_8.4.5-ce.0_amd64.deb](https://packages.gitlab.com/gitlab/gitlab-ce/packages/ubuntu/trusty/gitlab-ce_8.4.5-ce.0_amd64.deb)'
 - '[Updating GitLab via omnibus-gitlab](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/update.md)'
 - '[Installing Passenger + Nginx](https://www.phusionpassenger.com/library/install/nginx/install/oss/trusty/)'

---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Are you a software developer fond of one-click installs? If so, you'll probably have heard of Omnibus GitLab. This is a software package that allows you to easily install and run GitLab together with some dependencies (Ruby, PostgreSQL, Redis, Nginx and Unicorn, among others). It's just a couple of minutes.

However, like everything else in life, one-click installs are a good thing but they sometimes bring a series of challenges to those who need to thoroughly customize specific default settings. If this is your case you might even consider to [install GitLab from source](https://www.linode.com/docs/applications/development/how-to-install-and-configure-gitlab-on-ubuntu-14-04-trusty-tahr "How to Install and Configure GitLab on Ubuntu 14.04 (Trusty Tahr)"), but this is a bit tricky for some users.

One drawback to Omnibus is that was originally designed on the idea of running one single Nginx server per machine. Thus, Omnibus' Nginx was tied to GitLab and you simply couldn't take advantage of your computer's potential, optimize it and run multiple virtual web servers.

Nevertheless, Omnibus CE is a living creature and the newest versions do allow developers to disable GitLab's Nginx and install their own web server without having to compile anything.

This guide walks you through the process of installing and setting up your own Nginx server on a typical Omnibus installation. This way, you are not forced to use Omnibus' anymore, and can create as many virtual servers as you want.

Are you ready to make the most of your computer? These are the steps to be performed:

- Unbundle Nginx from GitLab
- Install your own Nginx web server
- Create a virtual host on your own Nginx
- Proxy the incoming requests to GitLab

By the way, keep in mind that GitLab Omnibus 7 may not allow you to unbundle Nginx from the stack. As I say, this is a relatively new feature which is available on version 8. Specifically, note that I am showing how to configure a custom Nginx server on the 8.10.1 environment.

## Before You Begin

This is the specific environment on which I've run the steps required for the task:

- **OS**: Ubuntu 14.04.4 LTS (Trusty Tahr)
- **Hard disk drive**: 50 GB
- **RAM**: 2 GB
- **Installation type**: GitLab CE Omnibus package
- **GitLab version**: 8.10.1
- **Deb package**: [gitlab-ce_8.4.5-ce.0_amd64.deb](https://packages.gitlab.com/gitlab/gitlab-ce/packages/ubuntu/trusty/gitlab-ce_8.4.5-ce.0_amd64.deb "gitlab-ce_8.4.5-ce.0_amd64.deb for Ubuntu 14.04.4 LTS (Trusty Tahr)")

## Update Your System

As a rule of thumb, it is always a good idea to keep your software up-to-date.

1. First of all, make sure your Ubuntu OS is up-to-date:

		sudo apt-get update
		sudo apt-get upgrade

2. Install the newest GitLab CE Omnibus package from [here](https://about.gitlab.com/downloads/#ubuntu1404). Otherwise, if you're already running an Omnibus GitLab environment you can take this moment to update to the newest version.

	 Nginx cannot be disabled in older versions of GitLab CE. If this is your case and you have installed, let's say, version 7, it is a good idea for you to upgrade in minor version steps: 7.3 > 7.5 > 7.5, and so on, so that the major new features and fixes won't break anything.

   Please, read the resource entitled [Updating GitLab via omnibus-gitlab](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/update.md "Updating GitLab via omnibus-gitlab") for further information on how to update your Omnibus environment.

## Unbundle Nginx from Omnibus GitLab

Now we are editing GitLab's config file:

	sudo vim /etc/gitlab/gitlab.rb

Update the following settings as follows:

	# Unbundle nginx from Omnibus GitLab
	nginx['enable'] = false
	# Set your Nginx's username
	web_server['external_users'] = ['www-data']

And then reconfigure:

	sudo gitlab-ctl reconfigure

For more information on how to customize Omnibus Nginx please [click here](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/nginx.md) to read the official documentation.


## Install Ruby, Passenger and Nginx

Well done! At this point GitLab's bundled Nginx is disabled.

The next thing to do is installing and configuring the web server from scratch, globally on the OS.

1. As you already know, GitLab is written in Ruby, so we need Ruby on our system:

		sudo apt-get install ruby
		sudo gem install rubygems-update
		sudo update_rubygems

2. Unlike Apache, where modules can be dynamically added on the fly, Nginx requires to be recompiled whenever a new module is to be plugged in. Let's do this right away and install Passenger, a web application server for Ruby.

		# Install Phusion Passenger's PGP key and add HTTPS support for APT:
		sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
		sudo apt-get install -y apt-transport-https ca-certificates

		# Add Phusion Passenger's APT repository:
		sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger trusty main > /etc/apt/sources.list.d/passenger.list'
		sudo apt-get update

		# Install Passenger + Nginx:
		sudo apt-get install -y nginx-extras passenger

3. Finally, let's enable our brand new Passenger module by uncommenting the `include /etc/nginx/passenger.conf;` line from the `/etc/nginx/nginx.conf` file.

4. And restart Nginx:

		sudo service nginx restart


For further information on this installation process please read Phusion Passenger's resource entitled [Installing Passenger + Nginx on Ubuntu 14.04 LTS (with APT)](https://www.phusionpassenger.com/library/install/nginx/install/oss/trusty/ "Installing Passenger + Nginx").

## Create a New Virtual Host

That's easy:

	sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/foo.com
	sudo vim /etc/nginx/sites-available/foo.com

To make things simple, here is a quite basic Nginx configuration example that I particularly used just to start the web server. Feel free to adapt it to your needs:

	upstream gitlab {
       	server unix:/var/opt/gitlab/gitlab-rails/sockets/gitlab.socket;
	}

	server {
    listen 80;
		server_name foo.com;
		server_tokens off; # don't show the version number, a security best practice
    root /opt/gitlab/embedded/service/gitlab-rails/public;

        # Increase this if you want to upload large attachments
        # Or if you want to accept large git objects over http
        client_max_body_size 250m;

        # individual nginx logs for this gitlab vhost
        access_log  /var/log/nginx/gitlab_access.log;
        error_log   /var/log/nginx/gitlab_error.log;

        location / {
            proxy_redirect off;
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_pass http://gitlab;
		}
	}

At this point, enable your new virtual host by creating a symbolic link as follows:

	sudo ln -s /etc/nginx/sites-available/foo.com /etc/nginx/sites-enabled/foo.com

And restart Nginx:

	sudo service nginx restart

Since Nginx needs to access GitLab you must add the `www-data` user to the `gitlab-www` group:

	sudo usermod -aG gitlab-www www-data

This is all for now, thank you for reading this guide. We just turned a default Omnibus GitLab server into a multi-purpose one. Now, our custom Nginx web server can manage plenty of web apps.
