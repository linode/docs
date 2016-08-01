---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Unbundle the default Nginx server from Omnibus Gitlab and install and configure your own to enable virtual hosting.'
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

Are you a software developer fond of one-click installs? If so, you have probably heard of Omnibus GitLab, a software package that allows you to easily install and run GitLab together with some dependencies (Ruby, PostgreSQL, Redis, Nginx and Unicorn, among others).

However, one-click installs sometimes bring a series of challenges to those who need to customize specific default settings. If this is your case, you might even consider [installing GitLab from source](https://www.linode.com/docs/applications/development/how-to-install-and-configure-gitlab-on-ubuntu-14-04-trusty-tahr "How to Install and Configure GitLab on Ubuntu 14.04 (Trusty Tahr)"), but this is a bit tricky for some users.

One drawback to Omnibus is that was designed to run one single Nginx server per machine. Thus, Omnibus' Nginx was tied to GitLab and you simply couldn't take advantage of your server's potential by running multiple virtual hosts.

Nevertheless, newer versions of Omnibus CE allows developers to disable GitLab's Nginx and install their own web server without having to compile anything.

This guide walks you through the process of installing and setting up your own Nginx server on a typical Omnibus installation. This way, you are not forced to use Omnibus' default settings, and can create as many virtual servers as you want.

By the way, keep in mind that GitLab Omnibus 7 may not allow you to unbundle Nginx from the stack. As I say, this is a relatively new feature which is available on version 8. Specifically, note that I am showing how to configure a custom Nginx server on the 8.10.1 environment.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  This guide has been written for Ubuntu 14.04 LTS <and 16?>. The installation process should be similar on other distros, but certain commands and file paths may vary.

4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

<!--Remove? vvv-->
This is the specific environment on which I've run the steps required for the task:

- **OS**: Ubuntu 14.04.4 LTS (Trusty Tahr)
- **Hard disk drive**: 50 GB
- **RAM**: 2 GB
- **Installation type**: GitLab CE Omnibus package
- **GitLab version**: 8.10.1
- **Deb package**: [gitlab-ce_8.4.5-ce.0_amd64.deb](https://packages.gitlab.com/gitlab/gitlab-ce/packages/ubuntu/trusty/gitlab-ce_8.4.5-ce.0_amd64.deb "gitlab-ce_8.4.5-ce.0_amd64.deb for Ubuntu 14.04.4 LTS (Trusty Tahr)")

## Install Omnibus GitLab

If you're already running an Omnibus GitLab environment you can take this moment to update to the newest version. If you're installing GitLab for the first time, this section will explain how to do so.

Note that Nginx cannot be disabled in older versions of GitLab CE. If this is your case and you have installed an older version, it is recommended to upgrade incrementally so that the major new features and fixes won't break anything. Please refer to [Updating GitLab via omnibus-gitlab](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/update.md "Updating GitLab via omnibus-gitlab") for further information on how to update from an older version.

1.  Install the necessary dependencies:

        sudo apt-get install curl openssh-server ca-certificates postfix

2.  Add the GitLab CE repository and install the `gitlab-ce` package:

        curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
        sudo apt-get install gitlab-ce

    You can view the above script in its entirety on the [GitLab website](https://packages.gitlab.com/gitlab/gitlab-ce/install) if you're hesitant to run it sight-unseen. The [GitLab downloads page](https://about.gitlab.com/downloads/) also contains an alternative download method if you're still not comfortable running their script.

## Unbundle Nginx from Omnibus GitLab

1. To unbundle Nginx from GitLab, we'll need to disable the version included in the Omnibus package. Add the following lines to `/etc/gitlab/gitlab.rb`:

{: .file-excerpt}
/etc/gitlab/gitlab.rb
:   ~~~
	# Unbundle nginx from Omnibus GitLab
	nginx['enable'] = false
	# Set your Nginx's username
	web_server['external_users'] = ['www-data']
    ~~~

2.  Reconfigure GitLab to apply the changes:

	    sudo gitlab-ctl reconfigure

For more information on how to customize Omnibus Nginx please [click here](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/nginx.md) to read the official documentation.

## Install Ruby, Passenger, and Nginx

Well done! At this point, GitLab's bundled Nginx has been disabled. The next step is to install and configure the web server from scratch, globally on the OS.

1.  Since GitLab is written in Ruby, install Ruby on your system:

		sudo apt-get install ruby
		sudo gem install rubygems-update
		sudo update_rubygems

2.  We'll also need to install Passenger, a web application server for Ruby. Install Phusion Passenger's PGP key and add HTTPS support for APT:
		
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
		sudo apt-get install -y apt-transport-https ca-certificates

	Add Phusion Passenger's APT repository:
		
        sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger trusty main > /etc/apt/sources.list.d/passenger.list'
		sudo apt-get update

	Install Passenger and Nginx:
		
        sudo apt-get install -y nginx-extras passenger

3. Finally, let's enable our brand new Passenger module by uncommenting the `include /etc/nginx/passenger.conf;` line from the `/etc/nginx/nginx.conf` file.

4. And restart Nginx:

		sudo service nginx restart

For further information on this installation process please read Phusion Passenger's resource entitled [Installing Passenger + Nginx on Ubuntu 14.04 LTS (with APT)](https://www.phusionpassenger.com/library/install/nginx/install/oss/trusty/ "Installing Passenger + Nginx").

## Create a New Virtual Host

In this section, we'll create a new virtual host to serve GitLab. Since we unbundled Nginx, we'll also be able to configure other virtual hosts for other websites and apps.

1.  Copy the default virtual host file to a new virtual host file, replacing `example.com` with the hostname you'll use to serve GitLab:

	    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/example.com

2.  Edit your new virtual host file. To make things simple, here is a basic virtual host configuration example that I particularly used just to start the web server. Feel free to adapt it to your needs:


	    upstream gitlab {
       	    server unix:/var/opt/gitlab/gitlab-rails/sockets/gitlab.socket;
	    }

	    server {
            listen 80;
            server_name example.com;
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

3.  At this point, enable your new virtual host by symlinking it to `sites-enabled`:

	    sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com

4.  Restart Nginx to load your changes:

	    sudo service nginx restart

5.  Since Nginx needs to access GitLab you must add the `www-data` user to the `gitlab-www` group:

	    sudo usermod -aG gitlab-www www-data

This is all for now, thank you for reading this guide. We just turned a default Omnibus GitLab server into a multi-purpose one. Now, our custom Nginx web server can manage plenty of web apps.
