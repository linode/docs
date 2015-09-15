---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Host multiple rails apps with Nginx, Puma, Postgres, and rbenv on Ubuntu 14.04'
keywords: 'rails,ruby on rails,ror,ubuntu,linux,14.04,hosting,apps,puma,postgres,rbenv,nginx'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, September 10th, 2015'
modified: Thursday, September 10th 2013
modified_by:
    name: Linode
title: 'Hosting Multiple Rails Apps on Ubuntu 14.04'
contributor:
    name: Rick Peyton
    link: https://github.com/rickpeyton
---

Like any awesome Rails developer you likely have several play apps. But just because these aren't serious production apps doesn't mean that you should have to host them somewhere that forces you to shut them down for 6 hours a day. You can host several Rails apps on a single Linode by utilizing this guide.

## Before you begin

This guide provides step by step instructions for hosting multiple Rails apps on Ubuntu 14.04 (Trusty Tahr) with Linode.

Before you begin ensure that you have followed the [Getting Started](https://www.linode.com/docs/getting-started) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides.

This guide assumes that you have created, and are logged in as, a non-root user with sudo privileges. This guide uses the name rick, but update your commands appropriately.

##Configuring your first Rails app

### Install Postgres

1.  Update the system and install essentials

        sudo apt-get update
        sudo apt-get upgrade --show-upgraded
        sudo apt-get install -y build-essential libssl-dev libreadline-dev zlib1g-dev git postgresql postgresql-contrib libpq-dev nodejs nginx

2.  Setup a postgres user with the same name as the current user

        sudo -u postgres createuser --superuser $USER

    Log into postgres and set the password for your user, if you wish

        sudo -u postgres psql
        \password username

    As this guide assumes you will be using a local Postgres database you may wish to leave the password blank

3.  To exit Postgres

        \q


### Install rbenv

1.  Install rbenv as user

        git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
        echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
        echo 'eval "$(rbenv init -)"' >> ~/.bashrc

2.  Restart shell (log out and back in) and check that rbenv is installed

        type rbenv

3.  Install ruby-build as an rbenv plugin

        git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

4.  Install rbenv-vars to manage environment variables

        git clone https://github.com/sstephenson/rbenv-vars.git ~/.rbenv/plugins/rbenv-vars

5.  Install latest version of Ruby
        
        rbenv install 2.2.3

6.  Set the global ruby version
        
        rbenv global 2.2.3

7.  Check to see that it worked

        ruby -v
        ruby 2.2.3p173 (2015-08-18 revision 51636) [x86_64-linux]

### Set up Rails

1.  Install the rails gem.

        gem install rails

    {:.note }
    >
    >You may wish to speed up your install by omitting the docs
    >
    >       gem install rails --no-ri --no-rdoc

2.  Likely you will instead be cloning in a repo git repository, but for demo purposes lets spin up a default Rails app

        mkdir ~/www
        cd ~/www
        rails new default_app -T --database=postgresql

3.  Edit the database username in config/database.yml for the production environment

        cd ~/www/default_app
        vim config/database.yml

4.  inside database.yml

        ...
        production:
          <<: *default
          database: default_app_production
          username: rick
          password: <%= ENV['DEFAULT_APP_DATABASE_PASSWORD'] %>

5.  Setup your database

        RAILS_ENV=production rake db:create
        RAILS_ENV=production rake db:migrate

6.  Add puma to the Gemfile

        vim Gemfile

    Inside your Gemfile add

        gem 'puma'

7.  Save and exit your Gemfile and bundle

        bundle

8.  Add a secret to the environment by running rake secret

        rake secret

9.  Copy the secret and and add it to the .rbenv-vars file

        vim .rbenv-vars

    and add paste in your secret

        SECRET_KEY_BASE=7ecb33b12412...

    {:.note }
    >
    >You can view your rbenv vars with
    >    
    >       rbenv vars

### Configure Puma

Optimal configuration of Puma is dependent upon your Linode choice. The following config is based on the Linode 1GB plan. Just scale up your workers as your CPU count increases.

1.  Check the number of cpus on your server

        grep -c processor /proc/cpuinfo

2.  Create a Puma config file

        vim config/puma.rb

    and paste in the following

        # Change to match your CPU count
        workers 1

        threads 1, 6

        app_dir = File.expand_path("../..", __FILE__)
        shared_dir = "#{app_dir}/shared"

        rails_env = ENV['RAILS_ENV'] || "production"
        environment rails_env

        bind "unix://#{shared_dir}/sockets/puma.sock"

        stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

        pidfile "#{shared_dir}/pids/puma.pid"
        state_path "#{shared_dir}/pids/puma.state"
        activate_control_app

        on_worker_boot do
          require "active_record"
          ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
          ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
        end

3.  Create the directories listed in the Puma config

        mkdir -p shared/pids shared/sockets shared/log

4.  Install Jungle to manage your Puma upstart scripts

        cd ~
        wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma-manager.conf
        wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma.conf

5.  Edit the puma.conf you just grabbed and set the user equal to your user

        vim ~/puma.conf

    Your file should have setuid apps and setgid apps. Change them.
    
        setuid rick
        setgid rick

6.  Copy the scripts to the init directory

        cd ~
        sudo cp puma.conf puma-manager.conf /etc/init

    The puma-manager.conf script references /etc/puma.conf for a list of applications that it should manage. Create and edit that inventory file.

        sudo vim /etc/puma.conf

    and add the following. Be sure to update the path with your username.

        /home/rick/www/default_app

Now your application is configured to start at boot time.

7.  To start your Puma managed Rails app now, run this command:
    
        sudo start puma-manager

    You may also start a single Puma application by using the Puma script
    
        sudo start puma app=/home/rick/www/default_app

    You may also use stop and restart to control the application

        sudo stop puma-manager
        sudo restart puma-manager

Your application is not yet accessible to the outside world. For that lets install nginx.

### Setup nginx

We already installed nginx when we setup our server. Lets configure it now.

1.  Open the default nginx virtual host

        sudo vim /etc/nginx/sites-available/default

2.  Replace the contents of the file with the following. Be sure to update the app path with your user (two locations).

        upstream app {
            # Path to Puma SOCK file, as defined previously
            server unix:/home/rick/www/default_app/shared/sockets/puma.sock fail_timeout=0;
        }

        server {
            listen 80;
            server_name localhost;

            root /home/rick/www/default_app/public;

            try_files $uri/index.html $uri @app;

            location @app {
                proxy_pass http://app;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_redirect off;
            }

            error_page 500 502 503 504 /500.html;
            client_max_body_size 4G;
            keepalive_timeout 10;
        }

3.  Restart nginx to put the changes into effect

        sudo service nginx restart

Sweet! The production environment of your Rails app should now be available via your server's public IP address or domain name. Unless you went off script you are likely staring at a Rails error message. That is because we did not install a default route. But your Rails app is running!

If you want to fix that quick.

    vim ~/www/default_app/config/routes.rb

And uncomment

    root 'welcome#index'

Make a controller

    vim ~/www/default_app/app/controllers/welcome_controller.rb

Toss in some code

    class WelcomeController < ApplicationController
      def index
        render inline: "Welcome to the default app!"
      end
    end

And restart Puma

    sudo restart puma-manager

Bam.

## Adding a second Rails App

The first Rails app you setup was configured as your default route in nginx. That means that it is accessible via your IP address as well as it's domain name. For this second app you will want to have pointed a FQDN at your Linode.

For the purposes of this example we are going to call this second app stocks_app.

It is going to get repetitive here for a bit.

1.  Create the app

        cd ~/www
        rails new stocks_app -T --database=postgresql

2.  Edit the database username in config/database.yml for the production environment

        cd ~/www/stocks_app
        vim config/database.yml

    inside database.yml

        ...
        production:
          <<: *default
          database: stocks_app_production
          username: rick
          password: <%= ENV['STOCKS_APP_DATABASE_PASSWORD'] %>

3.  Setup your database

        RAILS_ENV=production rake db:create
        RAILS_ENV=production rake db:migrate

4.  Add puma to the Gemfile

        vim Gemfile

    Inside your Gemfile add

        gem 'puma'

5.  Save and exit your Gemfile and bundle

        bundle

6.  Add a secret to the environment by running rake secret

        rake secret

7.  Copy the secret and and add it to the .rbenv-vars file

        vim .rbenv-vars

    and add paste in your secret

        SECRET_KEY_BASE=7ecb33b12412...

8.  Create a puma config file inside the second Rails app

        vim config/puma.rb

    and paste in the following

        # Change to match your CPU count
        workers 1

        threads 1, 6

        app_dir = File.expand_path("../..", __FILE__)
        shared_dir = "#{app_dir}/shared"

        rails_env = ENV['RAILS_ENV'] || "production"
        environment rails_env

        bind "unix://#{shared_dir}/sockets/puma.sock"

        stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

        pidfile "#{shared_dir}/pids/puma.pid"
        state_path "#{shared_dir}/pids/puma.state"
        activate_control_app

        on_worker_boot do
          require "active_record"
          ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
          ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
        end

9.  Create the directories listed in the Puma config

        mkdir -p shared/pids shared/sockets shared/log

10. Update the /etc/puma.conf script, adding the following at the end

        /home/rick/www/stocks_app

11. Restart Puma

        sudo restart puma-manager

Your application is not yet accessible to the outside world. For that lets add another virtual host to nginx.

### Nginx configuration for the second app

1.  Add the second virtual host

        sudo vim /etc/nginx/sites-available/stocks_app

    and paste in the following (updated to suit your variables, stocks_app occurs in 4 places).

        upstream stocks_app {
            # Path to Puma SOCK file, as defined previously
            server unix:/home/rick/www/stocks_app/shared/sockets/puma.sock fail_timeout=0;
        }

        server {
            listen 80;
            server_name stocks.example.com;

            root /home/rick/www/stocks_app/public;

            try_files $uri/index.html $uri @stocks_app;

            location @stocks_app {
                proxy_pass http://stocks_app;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_redirect off;
            }

            error_page 500 502 503 504 /500.html;
            client_max_body_size 4G;
            keepalive_timeout 10;
        }

2.  Symlink the stocks_app host file into the sites-enabled folder

        sudo ln -s /etc/nginx/sites-available/stocks_app /etc/nginx/sites-enabled/stocks_app

3.  Restart nginx

        sudo service nginx restart

You should be up and running!

4.  Configure the routes for the second site

        vim config/routes.rb

    And uncomment

        root 'welcome#index'

5.  Make a controller

        vim app/controller/welcome_controller.rb

    Toss in some code

        class WelcomeController < ApplicationController
          def index
            render inline: "Welcome to the stocks app!"
          end
        end

    And restart Puma

        sudo restart puma-manager

Repeat these steps to add additional apps.  