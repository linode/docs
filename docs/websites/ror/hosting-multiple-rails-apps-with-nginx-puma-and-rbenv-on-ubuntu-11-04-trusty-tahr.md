# Setting up a server to host multiple Rails 4.2.4 apps with NGINX, Puma, Postgres and rbenv on Ubuntu 14.04

## Server Setup

You have just spun up a barebones Linode of Digital Ocean Ubuntu image. You should have already done basic security setup and created a non-root user with sudo privileges. I recommend the [Linode Getting Started Guide](https://www.linode.com/docs/getting-started).

The process below is what I used while setting up my server "ezra" with the user "rick" -- modify your input as you see fit.

### Set the hostname
    echo "ezra" > /etc/hostname
    hostname -F /etc/hostname

### Setup the hosts file
    vim /etc/hosts
    
    # modify to include the following
    127.0.1.1 ezra ezra
    127.0.0.1 localhost.localdomain localhost
    104.131.61.70 ezra.rickpeyton.com ezra

### Set the time zone
    dpkg-reconfigure tzdata

### Setup automated updates
    apt-get install unattended-upgrades

Modify /etc/apt/apt.conf.d/50unattended-upgrades to suite your needs
I chose to only auto update security patches and to do automatic reboots at 2AM.

    vim /etc/apt/apt.conf.d/50unattended-upgrades

To enable automatic updates, edit /etc/apt/apt.conf.d/10periodic and set the appropriate apt configuration options:

    vim /etc/apt/apt.conf.d/10periodic

The following configuration updates the package list, downloads, and installs available upgrades every day. The local download archive is cleaned every week.

    APT::Periodic::Update-Package-Lists "1";
    APT::Periodic::Download-Upgradeable-Packages "1";
    APT::Periodic::AutocleanInterval "7";
    APT::Periodic::Unattended-Upgrade "1";

### Update the system and install essentials
    apt-get update
    apt-get upgrade --show-upgraded
    apt-get install -y build-essential libssl-dev libreadline-dev zlib1g-dev git postgresql postgresql-contrib libpq-dev nodejs nginx

### If you don't already have a public key that you want to use, go ahead and generate one now on your own computer
    ssh-keygen -t rsa -b 4096 -C "peytorb@gmail.com"
    # Creates a new ssh key, using the provided email as a label
    # I usually give my key name the server name

### Lock it down
    adduser rick
    usermod -a -G sudo rick
    mkdir /home/rick/.ssh

### Secure copy the the public key on your laptop up to the server. Adjust the path as necessary.
    # From your laptop
    scp ~/.ssh/ezra.pub rick@ezra.rickpeyton.com:/home/rick/.ssh/

### Back on your server
    chown -R rick:rick /home/rick/.ssh
    chmod 700 /home/rick/.ssh
    chmod 600 /home/rick/.ssh/authorized_keys

### Edit /etc/ssh/sshd_config
    vim /etc/ssh/sshd_config
    
    # Make the following changes
    PasswordAuthentication no
    PermitRootLogin no
    service ssh restart

### Login to your server as rick in a new window
    ssh -i ~/.ssh/ezra rick@ezra.rickpeyton.com

    # I like to setup an ssh config file at this point.
    # Digital ocean has a nice explanation https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client

### Connect Git
    git config --global user.name "YOUR NAME"
    git config --global user.email "YOUR EMAIL ADDRESS"

### The next 4 steps are optional. I connect to Github via SSH and this is that process.

### On your server generate an ssh key to connect to Github. Just use the defaults and enter a passphrase
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

### Add the key to ssh-agent.
    ssh-add ~/.ssh/id_rsa

###  Copy the id_rsa.pub and add the key to Github
    cat ~/.ssh/id_rsa.pub

### Test the Github connection
    ssh -T git@github.com

## Rails and rbenv setup

### Setup a postgres user with the same name as the current user
    sudo -u postgres createuser --superuser $USER
    sudo -u postgres psql
    \password $USER

### Install rbenv as user
    git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    echo 'eval "$(rbenv init -)"' >> ~/.bashrc

### Restart shell (log out and back in) and check that rbenv is installed
    type rbenv

### Install ruby-build as an rbenv plugin
    git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

### Install latest version of Ruby
    rbenv install 2.2.3

### Set the global ruby version
    rbenv global 2.2.3

### Install Rails
    gem install rails --no-ri --no-rdoc

### Spin up a new rails app
    rails new default_app -T --database=postgresql

## Fire it up

### Add puma to the Gemfile
    vim Gemfile
    gem 'puma' # in the Gemfile
    bundle

### Change the username to current user in config/database.yml in the production environment
    vim config/database.yml

    production:
      <<: *default
      database: default_app_production
      username: rick
      password: <%= ENV['DEFAULT_APP_DATABASE_PASSWORD'] %>

### Setup your database
    RAILS_ENV=production rake db:create
    RAILS_ENV=production rake db:migrate
    RAILS_ENV=production rake db:setup

### Setup rbenv vars
    cd ~/.rbenv/plugins
    git clone https://github.com/sstephenson/rbenv-vars.git

### Add a secret to the environment by running rake secret in the app environment
    rake secret

### Copy the secret and and add it to the .rbenv-vars file
    vim .rbenv-vars
    SECRET_KEY_BASE=...

### Note that you can view your rbenv vars with
    rbenv vars

### Check the number of cpus on your server to configure puma
    grep -c processor /proc/cpuinfo

### Create a puma config file inside each Rails app
    vim config/puma.rb

### The contents of your file should be along these lines, but update workers according to your cpu count
    # Change to match your CPU core count
    workers 1

    # Min and Max threads per worker
    threads 1, 6

    app_dir = File.expand_path("../..", __FILE__)
    shared_dir = "#{app_dir}/shared"

    # Default to production
    rails_env = ENV['RAILS_ENV'] || "production"
    environment rails_env

    # Set up socket location
    bind "unix://#{shared_dir}/sockets/puma.sock"

    # Logging
    stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

    # Set master PID and state locations
    pidfile "#{shared_dir}/pids/puma.pid"
    state_path "#{shared_dir}/pids/puma.state"
    activate_control_app

    on_worker_boot do
      require "active_record"
      ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
      ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
    end

### From your app directory create the directories listed in the config file
    cd ~/www/default_app
    mkdir -p shared/pids shared/sockets shared/log

### Make sure Jungle is installed at your user root to manage puma upstart scripts
    cd ~
    wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma-manager.conf
    wget https://raw.githubusercontent.com/puma/puma/master/tools/jungle/upstart/puma.conf

### Edit puma.conf and set the user equal to your user
    vim ~/puma.conf
    
    # change setuid and setgid to match your user, rick
    setuid rick
    setgid rick

### Now copy the scripts to the Upstart services directory
    sudo cp puma.conf puma-manager.conf /etc/init

### The puma-manager.conf script references /etc/puma.conf for the applications that it should manage. Create and edit that inventory file now
    sudo vim /etc/puma.conf

### Each line in this file should be the path to an application that you want puma-manager to manage. Add the path to your application now. For example
    /home/rick/www/default_app

### Now your application is configured to start at boot time, through Upstart. This means that your application will start even after your server is rebooted

### For future reference

### To start all of your managed Puma apps now, run this command:
    sudo start puma-manager

### You may also start a single Puma application by using the puma Upstart script, like this:
    sudo start puma app=/home/rick/www/default_app

### You may also use stop and restart to control the application, like so:
    sudo stop puma-manager
    sudo restart puma-manager

### Before your application will be accessible to an outside user, you must set up the Nginx reverse proxy.

## NGINX
    sudo apt-get install nginx

### Now open the default server block with a text editor:
    sudo vim /etc/nginx/sites-available/default

### Replace the contents of the file with the following code block. Be sure to replace the app path where necessary (two locations):

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

### Save and exit. This configures Nginx as a reverse proxy, so HTTP requests get forwarded to the Puma application server via a Unix socket. Feel free to make any changes as you see fit.

### Restart Nginx to put the changes into effect
    sudo service nginx restart

### Now the production environment of your Rails application is accessible via your server's public IP address or FQDN

### Initialize a Git repo for the default app
    cd ~/www/default_app
    git init
    # Add whatever you need to in the .gitignore file. Example...
    echo .rbenv-vars >> .gitignore
    git add -A
    git commit -m "Initialized Repo"

## Adding a second app...

### Create the app
    cd ~/www
    rails new stocks_app -T --database=postgresql

### Add puma to the gemfile
    cd ~/www/stocks_app
    vim Gemfile
    gem 'puma' # in the Gemfile
    bundle

### Change the username to current user in config/database.yml in the production environment
    vim config/database.yml

    production:
      <<: *default
      database: default_app_production
      username: rick
      password: <%= ENV['DEFAULT_APP_DATABASE_PASSWORD'] %>

### Setup your database
    RAILS_ENV=production rake db:create
    RAILS_ENV=production rake db:migrate

### Add a secret to the environment by running rake secret in the app environment
    rake secret

### Copy the secret and and add it to the .rbenv-vars file
    vim .rbenv-vars
    SECRET_KEY_BASE=...

### Create a puma config file inside the new Rails app
    vim config/puma.rb

### The contents of your file should be along these lines, but update workers according to your cpu count
    # Change to match your CPU core count
    workers 1

    # Min and Max threads per worker
    threads 1, 6

    app_dir = File.expand_path("../..", __FILE__)
    shared_dir = "#{app_dir}/shared"

    # Default to production
    rails_env = ENV['RAILS_ENV'] || "production"
    environment rails_env

    # Set up socket location
    bind "unix://#{shared_dir}/sockets/puma.sock"

    # Logging
    stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

    # Set master PID and state locations
    pidfile "#{shared_dir}/pids/puma.pid"
    state_path "#{shared_dir}/pids/puma.state"
    activate_control_app

    on_worker_boot do
      require "active_record"
      ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
      ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
    end

### From your app directory create the directories listed in the config file
    cd ~/www/stocks_app
    mkdir -p shared/pids shared/sockets shared/log

### Edit /etc/puma.conf and add this application to the lists of apps it should manage.
    sudo vim /etc/puma.conf

    # The file should now look like this...
    /home/rick/www/default_app
    /home/rick/www/stocks_app

### Restart Puma
    sudo restart puma-manager

### Create another nginx virtual host
    sudo vim /etc/nginx/sites-available/stocks_app
    # take careful note to chage references to app to stocks_app. This occurs in 4 spots.

    upstream stocks_app {
        # Path to Puma SOCK file, as defined previously
        server unix:/home/rick/www/stocks_app/shared/sockets/puma.sock fail_timeout=0;
    }

    server {
        listen 80;
        server_name stocks.rickpeyton.com;

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

### Turn the site on
pending...

### Initialize a Git repo for the default app
    cd ~/www/default_app
    git init
    # Add whatever you need to in the .gitignore file. Example...
    echo .rbenv-vars >> .gitignore
    git add -A
    git commit -m "Initialized Repo"

### Restart nginx
    sudo service nginx restart

## Adding in some SSL

I am going to use a 4096 bit self-signed certificate for the stocks_app. Lets modify things to make that happen.

### Create the key
    mkdir ~/www/stocks_app/ssl
    cd ~/www/stocks_app/ssl
    openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout ./stocks_app.key -out ./stocks_app.crt

### Make some edits to the nginx site config
    sudo vim /etc/nginx/sites-available/stocks_app


    upstream stocks_app {
        # Path to Puma SOCK file, as defined previously
        server unix:/home/rick/www/stocks_app/shared/sockets/puma.sock fail_timeout=0;
    }

    server {
        listen 80;
        server_name stocks.rickpeyton.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443;

        server_name stocks.rickpeyton.com;

        ssl on;
        ssl_certificate /home/rick/www/stocks_app/ssl/stocks_app.crt;
        ssl_certificate_key /home/rick/www/stocks_app/ssl/stocks_app.key;

        ssl_session_timeout 5m;

        ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers "HIGH:!aNULL:!MD5 or HIGH:!aNULL:!MD5:!3DES";
        ssl_prefer_server_ciphers on;

        root /home/rick/www/stocks_app/public;

        try_files $uri/index.html $uri @stocks_app;

        location @stocks_app {
            proxy_pass http://stocks_app;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Host $http_host;
            proxy_redirect off;
        }

        error_page 500 502 503 504 /500.html;
        client_max_body_size 4G;
        keepalive_timeout 10;
    }

### Change config.force_ssl to true for the stocks_app
    vim ~/www/stocks_app/config/environments/production.rb

Uncomment the line

    # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
    config.force_ssl = true

## Updating a running stocks_app

### Bring down your app
    sudo stop puma app=/home/rick/www/stocks_app

### Update your code
    cd ~/www/stocks_app

Grab your code from your repo

    git pull

Update your gems

    bundle

Update your database structure

    RAILS_ENV=production rake db:migrate

Precompile your assets

    RAILS_ENV=production rake assets:precompile

### Bring the app back up
    sudo start puma app=/home/rick/www/stocks_app


# Sample Ruby and rbenv Crontab
Use your rbenv Ruby version for Cron jobs

## Determine the path to ruby
    
    rbenv which ruby

That will give you

    /home/pi/.rbenv/versions/2.2.3/bin/ruby

Now just add that path to your Cron job

    0 */6 * * * /home/pi/.rbenv/versions/2.2.3/bin/ruby /home/pi/dnsimple/dnsimple_script.rb > /dev/null 2>&1

But that did not work in a situation where I had environment variables so I had to do this

    * * * * * /bin/bash -c 'export PATH="$HOME/.rbenv/bin:$PATH" ; eval "$(rbenv init -)"; cd /home/rick/scripts/prison_architect_scraper/; ruby prison.rb > cron_results'
