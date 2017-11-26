---
author:
  name: Angel
  email: docs@linode.com
description: 'This guide shows how to install and set up Redmine, a free and open-source project management web application, written using Ruby on Rails, that is is cross-platform and cross-database.'
keywords: ["nginx", "ubuntu", "redmine"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-14
modified: 2017-09-26
modified_by:
  name: Linode
title: 'How to Install and Configure Redmine on Ubuntu 16.04'
external_resources:
- '[Redmine Official Docs](https://www.redmine.org/guide/)'
- '[Redmine Users Guide](https://www.redmine.org/projects/redmine/wiki/Getting_Started)'
- "[Andrew Hosch's Guide on Redmine](http://www.untrustedconnection.com/2016/04/redmine-passenger-and-nginx-on-ubuntu.html)"
---
## What is Redmine?

Redmine is a project management web app that allows users to manage projects flexibly while offering robust tracking tools and an extensive library of plug-ins. This free and open source solution offers an alternative to paid project management tools and includes support for wikis, forums, calendars, and data visualization tools.

This guide will show you how to install and set up Redmine on Ubuntu 16.04 through the Passenger application server connected to Nginx.

### Before You Begin

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Dependencies

    sudo apt install build-essential mysql-server ruby ruby-dev libmysqlclient-dev imagemagick libmagickwand-dev

## Configure MySQL

MySQL needs to be configured so that Redmine can store data. You can log in to the root account of your database using the password that you set when you installed `mysql-server`.

     mysql -u root -p

1.  After logging in, create a new database and database user:

        CREATE DATABASE redmine;

        CREATE USER 'redmine'@'localhost' IDENTIFIED BY 'password';

        GRANT ALL PRIVILEGES ON redmine.* TO 'redmine'@'localhost';

        FLUSH PRIVILEGES;

        quit;

### Install Ruby

Redmine requires Ruby to run. Use the Ruby Version Manager (RVM) to install Ruby 2.2.3 and up.

1. Curl the latest version of RVM.

        gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
        curl -sSL https://get.rvm.io | bash -s stable
        source /home/username/.rvm/scripts/rvm

    <!---
            sudo apt-add-repository -y ppa:rael-gc/rvm
            sudo apt-get update
            sudo apt-get install rvm
    -->
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

        sudo apt install -y dirmngr gnupg
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


### Install Redmine

1. Create a `redmine` user and add the new user to the `sudo` group:

        sudo adduser --system --shell /bin/bash --gecos 'Redmine Administrator' --group --home /data/redmine redmine; sudo usermod -a -G rvm redmine
        sudo adduser redmine sudo

2.  Log in as the `redmine` user:

        su -
        passwd redmine
        su redmine
        cd

3.  Download Redmine tarball as the new user. Extract it, and rename the directory to `redmine` for convenience:

        wget https://www.redmine.org/releases/redmine-3.4.2.tar.gz
        tar -zxvf redmine-3.4.2.tar.gz
        mv redmine-3.4.2 redmine

4. Add the database information created earlier to Redmine's config file. Only complete the section marked "Production," as you will not be using the development or test environments.

        cd redmine
        cp -pR config/database.yml.example config/database.yml
        emacs config/database.yml

5. In the `redmine` directory, install the Ruby dependencies:

        sudo gem install bundler
        sudo bundle install --without development test

6. After the installation finishes, you need to use Rake to start the server:

        bundle exec rake generate_secret_token
        RAILS_ENV=production bundle exec rake db:migrate
        RAILS_ENV=production bundle exec rake redmine:load_default_data

7. Restart Nginx, and navigate to your server's IP address and you will be greeted by the Redmine application:

        sudo service nginx restart

    ![Login](/docs/assets/redmine/firstscreen.png)

## Redmine

The default login and password for Redmine are:

     Login: admin
     Password: admin

After logging in for the first time, you will be prompted to change your credentials. Replace them with something secure.

#### Install a Plug-in

Redmine is built to be used with plug-ins. Plug-ins are installed to `redmine/plugins`. This section will demonstrate installing a plug-in by installing [scrum2b](https://github.com/scrum2b/scrum2b), a plug-in for managing a Scrum/Agile workflow.

If not installed, install git or download the plug-in directly through the Github website:

        sudo apt install git

1. Move to `redmine/plugins` and clone the plug-in:

        cd plugins
        git clone https://github.com/scrum2b/scrum2b

2. Use Bundle to install the plug-in, then restart Nginx:

        bundle install
        sudo service nginx restart

3. Navigate to Redmine in your browser. Log in, click **admin** then click **plugins**

    ![scrum2b](/docs/assets/redmine/thirdscreen.png)

### Next Steps
You now have a working Redmine setup on your Linode. If you plan on using it in production, explore plug-ins that will be useful for your team. Take a look at some of the guides below to customize Redmine for your team.
