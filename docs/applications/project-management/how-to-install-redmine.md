---
author:
  name: Angel
  email: docs@linode.com
description: 'This guide will show you how to install Redmine'
keywords: 'nginx,ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: Thursday, September 14, 2017
modified: Friday, September 15, 2017
modified_by:
  name: Linode
title: 'How to Install and Configure Redmine'
external_resources:
- '[Fish Shell](https://fishshell.com/)'
- '[Fish Shell Tutorial](https://geowarin.github.io/the-missing-fish-shell-tutorial.html)'
- '[Arch Wiki Fish Entry](https://wiki.archlinux.org/index.php/Fish)'
- '[Fish Cookbook](https://github.com/jbucaran/fish-shell-cookbook#how-to-find-my-current-location-in-fish)'
---

Redmine is a free and open source project management tool.  Redmine is one of the most popular project management tools. 


### Before You Begin

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Install Dependencies

    apt install build-essentials mysql-server ruby ruby-dev libmysql-client-dev imagemagick libmagickwand-dev

    


## Configuring MySQL

MySQL needs to be configured so that Redmine can store data. You can log in to the root account of your database using the password that you set when you created the database. 

     mysql -u root -p
 
 1.  After logging in, create a new database and database user:
 
        CREATE DATABASE redmine;
        
        CREATE USER 'redmine'@'localhost' IDENTIFIED BY 'password';
 
        GRANT ALL PRIVILEGES ON redmine.* TO 'redmine'@'localhost';

        FLUSH PRIVILEGES;
 

### Install Passenger + Nginx

[Passenger](https://github.com/phusion/passenger) is an application server. It runs your web app, and then communicates with the web server to deploy your app on the server. They have brilliant [documentation](https://www.phusionpassenger.com/library/install/nginx/install/oss/xenial/), on installing Passenger and Nginx on Ubuntu 16.04 with an apt repsoitory.

1. Install the Passenger PGP key and HTTPS support for the package manager:

        sudo apt install -y dirmngr gnupg
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
        sudo apt install -y apt-transport-https ca-certificates

2. Add the Passenger APT repository:

        sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger xenial main > /etc/apt/sources.list.d/passenger.list'
        sudo apt update

3. Install Passenger + Nginx

        sudo apt install -y nginx-extras passenger

Passenger has now installed Nginx, with Passenger compiled in. You have to configure Nginx to make sure it uses Passenger correctly:

1. Uncomment the `include /etc/nginx/passenger.conf;` line in `/etc/nginx/nginx.conf`:

        sudo emacs /etc/nginx/nginx.conf
 2. Make sure your config file resembeles the one below:       
    
    {:.file}
    /etc/nginx/nginx.conf
    : ~~~ conf

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
    
      ~~~

3. Validate the installation of Passenger and Nginx:

        sudo /usr/bin/passenger-config validate-install

Pressing **enter** when the first option is selected:


         If the menu doesn't display correctly, press '!'

        ‣ ⬢  Passenger itself
          ⬡  Apache

          -------------------------------------------------------------------------

        * Checking whether this Passenger install is in PATH... ✓
        * Checking whether there are no other Passenger installations... ✓

        Everything looks good. :-()
  
Finally, check if Nginx has started the Passenger core process from the line you uncommented earlier:


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


### Installing Redmine

The final step is to install Redmine. 

1. Make a Redmine user:

        sudo adduser --system --shell /bin/bash --gecos 'Redmine Administrator' --group --disabled-password --home /data/redmine redmine; sudo usermod -a -G rvm redmine 

2. Download Redmine as the new user, install it, and clean up the directory:  
          
        wget https://www.redmine.org/releases/redmine-3.4.2.tar.gz
        tar -zxvf redmine-3.4.2.tar.gz
        mv -r redmine-3.4.2 redmine

3. Add the database information you created earlier to Redmine's config file.

        cd redmine
        cp -pR config/database.yml.example config/database.yml
        emacs config/database.yml
https://www.redmine.org/projects/redmine/wiki/RedmineInstall


