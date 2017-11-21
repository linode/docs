---
author:
  name: Linode
  email: docs@linode.com
description: Using the Ruby on Rails framework for Nginx web applications on Debian.
keywords: ["ruby on rails", "ruby on nginx", "rails apps", "debian", "debian 8", " ruby", " nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/ror/ruby-on-rails-nginx-debian-8/']
modified: 2017-11-21
modified_by:
  name: Jared Kobos 
published: 2015-06-25
title: 'Ruby on Rails with Nginx on Debian'
external_resources:
 - '[Ruby on Rails Home Page](http://rubyonrails.org/)'
 - '[Ruby on Rails Documentation](http://rubyonrails.org/documentation)'
 - '[Nginx Home Page](http://nginx.org/)'
 - '[Nginx Documentation](http://nginx.org/en/docs/)'
 - '[Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

Ruby on Rails is a rapid development web framework that allows web designers and developers to implement dynamic fully featured web applications. This guide describes the required process for deploying Ruby on Rails with Passenger and the Nginx web server on Debian 8.

![Ruby on Rails with nginx on Debian](/docs/assets/ruby_on_rails_with_nginx_debian_8_smg.png "Ruby on Rails with nginx on Debian 8")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Follow the [Getting Started](/docs/getting-started) and [Securing the Server](/docs/security/securing-your-server) guides, and [set the Linode's hostname](/docs/getting-started#setting-the-hostname).

    To check the hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

3.  Uninstall Nginx, if currently installed on the Linode. Nginx does not support loadable modules and is contained in the Phusion Passenger package:

        sudo apt-get remove nginx nginx-full nginx-light nginx-common


## Install Dependencies

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential dirmngr gnupg ruby ruby-dev zlib1g-dev libruby libssl-dev libpcre3-dev libcurl4-openssl-dev rake ruby-rack rails 

    Additionally, the deployed application will likely have dependencies. Install these dependencies before proceeding.


### Install Ruby

Redmine requires Ruby to run. Use the Ruby Version Manager (RVM) to install Ruby 2.2.3 and up.

1. Curl the latest version of RVM.

        gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
        curl -sSL https://get.rvm.io | bash -s stable
        source /home/username/.rvm/scripts/rvm

2. Users of RVM must be in the `rvm` group. Create this group, add a user, log out, and log back in:

        sudo groupadd rvm
        sudo usermod -a -G rvm username
        exit

3. Check the requirements for the install, and install Ruby (version 2.2.3):

        rvm requirements
        rvm install 2.2.3
        rvm use 2.2.3 --default


### Install Passenger and Nginx

[Passenger](https://github.com/phusion/passenger) is an application server that runs your web application then communicates with the web server. The project has well-written [documentation](https://www.phusionpassenger.com/library/install/nginx/install/oss/xenial/) on installing Passenger and Nginx on Ubuntu 16.04 with an apt repository.

1. Install the Passenger PGP key and HTTPS support for the package manager:

        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
        sudo apt install -y apt-transport-https ca-certificates

2. Add the Passenger APT repository:

        sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger xenial main > /etc/apt/sources.list.d/passenger.list'
        sudo apt update

3. Install Passenger and Nginx

        sudo apt install -y nginx-extras passenger

Passenger has now installed Nginx with Passenger compiled in. You have to configure Nginx to make sure it uses Passenger correctly:

1. Uncomment the `include /etc/nginx/passenger.conf;` line in `/etc/nginx/nginx.conf`. Edit your config file to resemble the one below:

    {{< file "/etc/nginx/nginx.conf" aconf >}}
##
# Phusion Passenger config
##
# Uncomment it if you installed passenger or passenger-enterprise
##

include /etc/nginx/passenger.conf;

##
# Virtual Host Configs
##

include /etc/nginx/conf.d/*.conf;

{{< /file >}}


2. Copy the default nginx site configuration file. The working configuration file in this guide will be `/etc/nginx/sites-available/default`:

           cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.orig

3. Change the `root` directory for the website, and add additional passenger configurations. To do this, add these lines to the `server{}` block of the file:

    {{< file "/etc/nginx/sites-availble/default" aconf >}}
root /data/redmine/redmine/public;
passenger_enabled on;
client_max_body_size 10m;

{{< /file >}}


4. In the same file, comment out the `#location` section:

    {{< file "/etc/ningx/site-available/default" aconf >}}
#location / {
# First attempt to serve request as file, then
# as directory, then fall back to displaying a 404.
    #try_files $uri $uri/ =404;
#}

{{< /file >}}


5. Change the permissions for `/var/www`:

        sudo mkdir /var/www
        sudo chown -R www-data /var/www

6. Restart `nginx`:

        sudo service nginx restart

7. Validate the installation of Passenger and Nginx:

        sudo /usr/bin/passenger-config validate-install

    Press **enter** when the first option is selected:


         If the menu doesn't display correctly, press '!'

        ‣ ⬢  Passenger itself
          ⬡  Apache

          -------------------------------------------------------------------------

        * Checking whether this Passenger install is in PATH... ✓
        * Checking whether there are no other Passenger installations... ✓

        Everything looks good. :-()

8.  Finally, check if Nginx has started the Passenger core process from the line uncommented earlier:

        sudo /usr/sbin/passenger-memory-stats

    If Passenger was installed with Nginx correctly, your output should resemble:


        --------- Nginx processes ----------
        PID   PPID  VMSize    Private  Name
        ------------------------------------
        6399  1     174.9 MB  0.6 MB   nginx: master process /usr/sbin/nginx -g daemon on; master_process on;
        6404  6399  174.9 MB  0.7 MB   nginx: worker process
        ### Processes: 2
        ### Total private dirty RSS: 1.23 MB


        ---- Passenger processes -----
        PID   VMSize    Private  Name
        ------------------------------
        6379  441.3 MB  1.2 MB   Passenger watchdog
        6382  660.4 MB  2.9 MB   Passenger core
        6388  449.5 MB  1.4 MB   Passenger ust-router
        ### Processes: 3



<!------- inserted here ------>
2.  Phusion hosts a repository containing the latest version of Phusion Passenger. To add this to the package manager, first install the Phusion PGP key:

		sudo apt-get install -y dirmngr gnupg
		sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
		sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger stretch main > /etc/apt/sources.list.d/passenger.list'

3.  Enable HTTPS support for APT:

        sudo apt-get install apt-transport-https ca-certificates

4.  Update the local package database and install Phusion Passenger:

        sudo apt-get update
        sudo apt-get install libnginx-mod-http-passenger

## Enable Passenger Support and Start Nginx

1.  Nginx is now installed on the system, but support for Phusion Passenger is not enabled. As root, or with the `sudo ` command, open the file `/etc/nginx/conf.d/mod-http-passenger.conf` and verify that the following two lines are present and uncommented: 

    {{< file-excerpt "/etc/nginx/conf.d/mod-http-passenger.conf" aconf >}}
passenger_root /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini;
passenger_ruby /usr/bin/passenger_free_ruby;
{{< /file-excerpt >}}

	{{< note >}}
If the file does not already exist, you will need to create it and add the lines manually.
{{< /note >}}

2.  Restart Nginx:

        sudo systemctl restart nginx

3.  To verify that Passenger support has been installed and enabled correctly:

        sudo passenger-memory-stats

    If Passenger is running, a few running processes should be displayed under the "Passenger processes" section:

        ----- Passenger processes -----
        PID    VMSize    Private  Name
        -------------------------------
        14337  420.8 MB  1.1 MB   Passenger watchdog
        14340  559.3 MB  1.4 MB   Passenger core
        14345  292.5 MB  1.2 MB   Passenger ust-router

    The configuration file for Nginx is located at `/etc/nginx/nginx.conf`. This file must be edited to add support for Rails applications. A default server is already configured in this file, and it also contains examples for alternate virtual host and SSL configurations.

## Install MySQL Support (Optional)

If the application deployed uses MySQL, install the database server by following our [MySQL on Debian 8](/docs/databases/mysql/mysql-relational-databases-debian-8) guide. Once it's installed and configured properly, issue the following command:

    sudo apt-get install libmysqlclient-dev
