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

Like any skilled Rails developer, you probably have several play apps. But just because these aren't serious production apps doesn't mean that you should have to host them somewhere that forces you to shut them down for six hours a day. Instead, follow this guide to host several Rails apps on a single Linode and subsequently avert daily shutdowns.

## Before you begin

This guide provides step-by-step instructions for hosting multiple Rails apps on Ubuntu 14.04 (Trusty Tahr) with Linode.

Before you begin, ensure that you have followed the [Getting Started](https://www.linode.com/docs/getting-started) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides.

This guide assumes that you have created and are logged in as a non-root user with sudo privileges. This guide uses the name rick, but you can use whatever name you choose and alter your commands accordingly.

##Configuring your first Rails app

### Install Postgres

1.  Update the system and install essentials by entering: 

        sudo apt-get update
        sudo apt-get upgrade --show-upgraded
        sudo apt-get install -y build-essential libssl-dev libreadline-dev zlib1g-dev git postgresql postgresql-contrib libpq-dev nodejs nginx

2.  Setup a postgres user with the same name as the current user:

        sudo -u postgres createuser --superuser $USER

    Log into postgres and set the password for your user, if you wish:

        sudo -u postgres psql
        \password username

    This guide assumes you will be using a local Postgres database; thus, you may wish to leave the password blank.

3.  To exit Postgres, type: 

        \q


### Install rbenv

1.  To install rbenv as user, type:

        git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
        echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
        echo 'eval "$(rbenv init -)"' >> ~/.bashrc

2.  Now, restart the shell (log out and back in) and check that rbenv is installed by entering: 

        type rbenv

3.  To install ruby-build as an rbenv plugin, enter: 

        git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

4.  To install rbenv-vars to manage environment variables, enter:

        git clone https://github.com/sstephenson/rbenv-vars.git ~/.rbenv/plugins/rbenv-vars

5.  To install the latest version of Ruby, enter: 
        
        rbenv install 2.2.3

6.  To set the global ruby version, enter: 
        
        rbenv global 2.2.3

7.  To confirm that it worked, enter:

        ruby -v
        ruby 2.2.3p173 (2015-08-18 revision 51636) [x86_64-linux]

### Configure Rails

1.  To install the rails gem, enter:

        gem install rails

    {:.note }
    >
    >You may wish to speed up your install by omitting the docs; do so by entering:
    >
    >       gem install rails --no-ri --no-rdoc

2.  Likely, you will instead be cloning in a repo git repository. But for demo purposes, lets spin up a default Rails app:

        mkdir ~/www
        cd ~/www
        rails new default_app -T --database=postgresql

3.  Next, edit the database username in config/database.yml for the production environment by entering:

        cd ~/www/default_app
        vim config/database.yml

4.  Once inside database.yml, you should see the following on your screen:

        ...
        production:
          <<: *default
          database: default_app_production
          username: rick
          password: <%= ENV['DEFAULT_APP_DATABASE_PASSWORD'] %>

5.  To setup your database, enter the commands: 

        RAILS_ENV=production rake db:create
        RAILS_ENV=production rake db:migrate

6.  To add puma to the Gemfile, enter: 

        vim Gemfile

    Once inside your Gemfile, add puma by entering:

        gem 'puma'

7.  Save and exit your Gemfile and bundle it by entering:

        bundle

8.  You can add a secret to the environment by running rake secret. Enter the command: 

        rake secret

9.  Now, copy the secret and add it to the .rbenv-vars file by entering: 

        vim .rbenv-vars

    and then, paste in your secret by entering:

        SECRET_KEY_BASE=7ecb33b12412...

    {:.note }
    >
    >You can view your rbenv vars by entering:
    >    
    >       rbenv vars

### Configure Puma

Optimal configuration of Puma depends upon your Linode choice. The following config is based on the Linode 1GB plan. When needed, you can scale up your workers as your CPU count increases.

1.  Check the number of CPUs on your server. Type:

        grep -c processor /proc/cpuinfo

2.  Then, create a Puma config file by entering:

        vim config/puma.rb

    and paste in the following:

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

3.  Now, create the directories listed in the Puma config by entering: 

        mkdir -p shared/pids shared/sockets shared/log

4.  Next, install Jungle to manage your Puma upstart scripts by entering:

        cd ~
        wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma-manager.conf
        wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma.conf

5.  To edit the puma.conf you just grabbed and set the user equal to your user, enter:

        vim ~/puma.conf

    Your file should have setuid apps and setgid apps. Change them using the name you chose in place of rick:
    
        setuid rick
        setgid rick

6.  Copy the scripts to the init directory by entering:

        cd ~
        sudo cp puma.conf puma-manager.conf /etc/init

    The puma-manager.conf script references /etc/puma.conf for a list of applications that it should manage. You can create and edit that inventory file by entering:

        sudo vim /etc/puma.conf

    and then, add the following. (Be sure to update the path with your username in place of rick.):

        /home/rick/www/default_app

You have just configured your application to start at boot.

7.  To start your Puma managed Rails app, run this command:
    
        sudo start puma-manager

    You may also start a single Puma application by entering the Puma script:
    
        sudo start puma app=/home/rick/www/default_app

    You may also use stop and restart to control the application:

        sudo stop puma-manager
        sudo restart puma-manager

Your application is not yet accessible to the outside world. To allow that access, you next have to configure nginx.

### Configure nginx

We already installed nginx when we setup our server. Let's configure it now.

1.  Open the default nginx virtual host, enter:

        sudo vim /etc/nginx/sites-available/default

2.  Replace the contents of the file with the following command. Be sure to update the app path with your user (two locations):

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

3.  Finally, restart nginx to put the changes into effect, enter:

        sudo service nginx restart

Congratulations! The production environment of your Rails app should now be available via your server's public IP address or domain name. Unless you went off script, you are likely staring at a Rails error message; this is because we did not install a default route. But your Rails app is running!

To fix that error message situation quickly, enter:

    vim ~/www/default_app/config/routes.rb

You can uncomment by entering:

    root 'welcome#index'

You can then make a controller by entering:

    vim ~/www/default_app/app/controllers/welcome_controller.rb

And then, generate a welcome message by entering:

    class WelcomeController < ApplicationController
      def index
        render inline: "Welcome to the default app!"
      end
    end

Last, you need to restart Puma; so enter the command:

    sudo restart puma-manager

Bam! You did it. You have installed a default route.

## Adding a second Rails App

The first Rails app you setup was configured as your default route in nginx, so it is accessible via your IP address as well as it's domain name. For this second app you will want to point an FQDN (Fully Qualified Domain Name) at your Linode.

For the purposes of this example, let's name this second app, stocks_app.

The following command sequence by which you will add a second (and subsequent) rails app gets repetitive for a bit.

1.  First, create the app by entering the command:

        cd ~/www
        rails new stocks_app -T --database=postgresql

2.  Next, edit the database username in config/database.yml for the production environment:

        cd ~/www/stocks_app
        vim config/database.yml

    Once inside database.yml, you should see the following on your screen:

        ...
        production:
          <<: *default
          database: stocks_app_production
          username: rick
          password: <%= ENV['STOCKS_APP_DATABASE_PASSWORD'] %>

3.  To setup your database, enter:

        RAILS_ENV=production rake db:create
        RAILS_ENV=production rake db:migrate

4.  And then, add puma to the Gemfile:

        vim Gemfile

    Once inside your Gemfile, add:

        gem 'puma'

5.  To save and exit your Gemfile and bundle it, enter:

        bundle

6.  To add a secret to the environment, run rake secret:

        rake secret

7.  Copy the secret and add it to the .rbenv-vars file by entering:

        vim .rbenv-vars

    and then, paste in your secret:

        SECRET_KEY_BASE=7ecb33b12412...

8.  Create a puma config file inside the second Rails app by entering:

        vim config/puma.rb

    and then, paste in the following:

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

9.  Create the directories listed in the Puma config with the command:

        mkdir -p shared/pids shared/sockets shared/log

10. Update the /etc/puma.conf script, adding the following at the end:

        /home/rick/www/stocks_app

11. Restart Puma. Enter:

        sudo restart puma-manager

Your application is not yet accessible to the outside world. To allow that access, you have to add another virtual host to nginx.

### Nginx configuration for the second app

1.  Add the second virtual host by entering: 

        sudo vim /etc/nginx/sites-available/stocks_app

    and then, paste in the following (updated to suit your variables, stocks_app occurs in 4 places):

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

2.  Symlink the stocks_app host file into the sites-enabled folder by entering:

        sudo ln -s /etc/nginx/sites-available/stocks_app /etc/nginx/sites-enabled/stocks_app

3.  Now, restart nginx by entering: 

        sudo service nginx restart

(Congratulations! You should be up and running.)

4.  Configure the routes for the second site, enter: 

        vim config/routes.rb

    And then, uncomment:

        root 'welcome#index'

5.  To make a controller, enter:

        vim app/controller/welcome_controller.rb

    Then, generate a welcome message by entering:

        class WelcomeController < ApplicationController
          def index
            render inline: "Welcome to the stocks app!"
          end
        end

    Last, restart Puma. Enter:

        sudo restart puma-manager

You can repeat these steps to add each additional app you want.  
