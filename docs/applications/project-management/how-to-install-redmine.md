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
- '[Redmine Official Docs](https://www.redmine.org/guide/)'
- '[Redmine Users Guide](https://www.redmine.org/projects/redmine/wiki/Getting_Started)'
- '[Andrew Hosch's Guide on Redmine](http://www.untrustedconnection.com/2016/04/redmine-passenger-and-nginx-on-ubuntu.html)'
---

Redmine is a free and open source project management tool.  Redmine is one of the most popular project management tools. Redmine is a Ruby on Rails application, It allows users to manage projects, flexibly, while offering robust tracking tools, and an extensive library of plug-ins. Redmine supports wikis and forums, calendars and data visualization tools. Redmine can offer you your team an alternative to other non-free project management tools availble. This guide will show you how to install Redmine on Ubuntu 16.04, using Nginx to serve the application, and Passenger to allow Redmine to communicate with the web server. 

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
 

### Install Ruby

Redmine is built on Ruby and requires Ruby to run. Installing Ruby for production projects can be a convuluted process, there are many versions, and different apps require different dependencies. In the case of this guide, use the Ruby Version Manager, to install Ruby. 

1. Curl the latest version of rvm
                    
        gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
        curl -sSL https://get.rvm.io | bash -s stable

2. Users of rvm need to be added to the `rvm` group. Add a user to the `rvm` group, log out, and log back in:

        sudo usermod -a -G rvm username
        exit


3. Check the requirements for the install, and install rvm:

        rvm requirements
        rvm install 2.2.3
        rvm use 2.2.3 --default


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

3. Create a directory for Nginx to serve Redmine, and edit the `sites-availble`  file to function with Passenger:

           cp /etc/nginx/sites-availble/default /etc/nginx/sites-availbe/default.orig
           emacs /etc/nginx/sites-abailble/default

4. Change the `root` directory for the website, and add additional passenger configurations. To do this add these lines to the `server{}` block of the file:

    {:.file}
    /etc/nginx/sites-availble/default
    : ~~~ conf
        root /data/redmine/redmine/public;
        passenger_enabled on;
        client_max_body_size_ 10m;
      ~~~

5. In the same file, comment out the `#location` section:

    {:.file}
    /etc/ningx/site-availble/default
    : ~~~ conf
      #location / {
      # First attempt to serve request as file, then
      # as directory, then fall back to displaying a 404.
          #try_files $uri $uri/ =404;
      #}
      ~~~

6. Change the permissions for `/var/www`

        sudo mkdir /var/www
        sudo chown -R www-data /var/www

7. Validate the installation of Passenger and Nginx:

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

{:.note}
>
>You can add the user Redmine to the sudo group, with: useradd redmine sudo


2. Download Redmine as the new user, install it, and clean up the directory:  
          
        wget https://www.redmine.org/releases/redmine-3.4.2.tar.gz
        tar -zxvf redmine-3.4.2.tar.gz
        mv -r redmine-3.4.2 redmine

3. Add the database information you created earlier to Redmine's config file.

        cd redmine
        cp -pR config/database.yml.example config/database.yml
        emacs config/database.yml
4. In the redmine directory, install the Ruby dependencies:
            
        gem install bundler
        bundle install --without development test

5. After the installation finishes, we need to use Rake to start the server:

        bundle exec rake generate_secret_token
        RAILS_ENV=production bundle exec rake db:migrate
        RAILS_ENV= production bundle exec rake redmine:load_default_data

6. Restart Nginx, and navigate to your server's IP address and you will be greeted by the Redmine application: 

        sudo service nginx restart

![Login](/docs/assets/redmine/firstscreen.png)

### Redmine

The default login and password for Redmine are:
     
     Login: admin
     Password:admin

Those credentials will expire quickly, so be sure to change them into something secure. 

Redmine is built to be used with plug-ins. Plug-ins are installed to `redmine/plugins`.

#### Install a Plug-in

If you want to install the [scrum2b](https://github.com/scrum2b/scrum2b) plug-in, this is how it would be done:

1. Move to `redmine/plugins` and clone the plug-in:

        git clone https://github.com/scrum2b/scrum2b

2. Use Bundle to install the plug-in.
        
        bundle install 

3. Navigate to Redmine in your browser, log in, click **admin** then click **plugins**

![Plugins](/docs/assets/redmine/secondscreen.png)

![scrum2b](/docs/assets/redmine/thirdscreen.png)

### Next Steps
You have a working Redmine set-up on your Linode. If you plan on using it in production, you need to configure it with plug-ins that will be useful for your team. Take a look at some of the guides in the [More Information](#More Information) section, to make Redmine perfect for team.
