---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Loomio is a social networking app that's very similar to Facebook groups. It promotes itself as a way for groups and organizations to easily make decisions together. This guide covers the installation and setup for Ubuntu 16.04.
keywords: 'loomio,ubuntu,debian,facebook alternative,facebook groups,collaboration,social media,messaging,forum,chat'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, May 18th, 2017'
modified:
modified_by:
  name:
title: 'Install Loomio on Ubuntu 16.04'
contributor:
  name: Mark Wakeling
  link: '[@boardmark](https://twitter.com/boardmark)''
  external_resources:
- '[Loomio Website](https://www.loomio.org/)'
- '[Loomio User Guide](https://help.loomio.org/en/)'
- '[Secure Rails](https://github.com/ankane/secure_rails)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

----

[Loomio](https://www.loomio.org/) is an open source social networking app that's very similar to Facebook groups. It promotes itself as a way for groups to easily make decisions together. Each thread/discussion within a group or sub-group has access to a selection of tools all geared towards making decisions.

![Loomio screenshot](/docs/assets/loomio-screenshot01.png "Loomio Screenshot ")

This guide covers the installation and environment setup to run a development and production version.

Loomio is built with AngularJS, CoffeeScript, Sass and Haml (HTML abstraction markup language). It runs in Ruby on Rails using Postgresql as the database and Thin web server (in development) and Puma web server (in production).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Remember to open any ports used in this guide in your choosen firewall.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  This guide uses nano for editing files and curl for downloads.

        sudo apt-get install nano curl

{: .caution}
>
>This install of Loomio requires a specific version of Node.js and uses [Node Version Manager](https://github.com/creationix/nvm) (NVM) to achieve this. Although the commands are included, you may want to familiarize yourself with [NVM](https://github.com/creationix/nvm) and be aware of how installing it could affect any Node dependant packages currently on your system. Use `node -v` to check what version you may have already.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

This guide assumes that Loomio is cloned to the current Linux user home. Replace any instance of `/home/[user]/loomio` or `~/loomio`  with your cloned Loomio path.

## Install Node via Node Version Manager (NVM)

1.  **Read the Node caution above** Install the latest version of NVM see [here](https://github.com/creationix/nvm#install-script) for up-to-date curl command

        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

2.  Source .bashrc or close and reopen your terminal

        source .bashrc

3.  Check NVM has installed successfully, response should be `nvm`

        command -v nvm

4.  At the time of writing Loomio required Node v7.4.0 so lets use NVM to install it. To check which version Loomio currently requires look in [github.com/loomio/loomio/blob/master/angular/package.json](https://github.com/loomio/loomio/blob/master/angular/package.json)

        nvm install v7.4.0

{: .note}
>
>You may see this message if you have Node already installed without NVM *nvm is not compatible with the npm config "prefix" option: currently set to "/home/\[user\]/.npm-global" Run npm config delete prefix or nvm use --delete-prefix v7.4.0 to unset it*

5.  If you did see this message, lets do what it says

        nvm use --delete-prefix v7.4.0

6.  Check if the required Node version is in use

        node -v

## Install and configure Postgresql Server and Setup Databases

1.  Check which version of *postgresql-server-dev* is available in your Linux distro

        apt-cache search postgresql-server-dev

2.  Install Postgres, replace *postgresql-server-dev-x.y* with available version

        sudo apt-get install postgresql postgresql-server-dev-x.y

3.  Login to Postgres cli with default user `postgres` and sudo password

        sudo -u postgres psql postgres

4.  Set a password for user: postgres so non-root user can connect to postgres databases. `\q and enter = exit`

        \password postgres
        \q

5.  Check Postgres is up and running

        sudo service postgresql status

## Install Ruby, Bundler and Dependencies

1.  Install Ruby

        sudo apt-get install ruby-full

2.  Install Bundler using gem. Bundler uses bundles to install the right gem dependencies and versions specified by the Loomio team. Visit [bundler.io](https://bundler.io/) to find out more.

        sudo gem install bundler

3.  Install system dependencies that Loomio requires

        sudo apt-get install libsqlite3-dev git build-essential libffi-dev imagemagick apt-transport-https memcached

## Git Clone Loomio, Bundle Install, Gulp/Node Modules Install

1.  Clone the latest Loomio source from Github to your home directory

        git clone https://github.com/loomio/loomio.git

2.  Enter the Loomio git clone directory and install bundle. NOTE: The following steps assume that your current working directory is the Loomio root clone. e.g `cd ~/loomio`

        bundle install --path vendor/bundle

3.  Create .nvmrc file to force NVM to always use the correct Node version. Replace 7.4.0 with current Loomio recommended version.

        echo 7.4.0 > .nvmrc

4.  Install Node Gulp globally

        npm install -g gulp

5.  Enter Angular directory and install Node modules.

        cd angular && npm install && cd ../

{: .note}
>
>If you get any unmet dependencies you can try `npm install` again or install the missing packages individually `npm i [package name]`

## Build Loomio Database

1.  Create Postgresql database.yml File. NOTE: The following steps assume that your current working directory is the Loomio root clone.

        nano config/database.yml

2.  Add the following and amend with your Postgres database password that we configured in the Postgresql section.

        ~~~~
        development:
          adapter: postgresql
          encoding: unicode
          database: loomio_development
          pool: 5
          username: postgres
          password: [postgres password]
          host: localhost

        test:
          adapter: postgresql
          encoding: unicode
          database: loomio_test
          pool: 5
          username: postgres
          password: [postgres password]
          host: localhost

        production:
          adapter: postgresql
          encoding: unicode
          database: loomio_production
          pool: 5
          username: postgres
          password: [postgres password]
          host: localhost
        ~~~~

3.  Use 'rake' (Ruby Make) to build the database and create a Loomio user login. This will need to be done for each database (not production - see 'Production Environment Additional Setup' section below). db:setup will create the database with the details specified in config/database.yml Alternatively you could create databases with `sudo -u postgres createdb loomio_development` and to delete/drop a database use `sudo -u postgres dropdb loomio_development` Rake also has create and delete/drop database tasks see `bundle exec rake --tasks` for a list of available rake tasks.

        RAILS_ENV=development bundle exec rake db:setup bootstrap:create_user[user@email.com,userpasswd]

{: .note}
>
> For production database setup see 'Production Environment Additional Settings' section at the bottom of this guide.

## Gulp

[Gulp](http://gulpjs.com/) is used to build the frontend assets. `gulp compile` will build the assets into public/client/development directory. Run `gulp compile` after making changes, or use `gulp dev` to show real time changes during development. [Learn more about Loomio Gulp tasks here](https://github.com/loomio/loomio/blob/master/angular/README.md)

    cd angular && gulp compile && cd ../

## Start Loomio in Ruby Rails Server

Rails server defaults to port 3000, `netstat -a|grep 3000` will check this port is available. If you need to run rails server with an alternative port, skip to the next step. The `-e` option is used to set the environment development/test/production. Rails server is started from your cloned Loomio root directory.

    bundle exec rails s -e development

Loomio should now be running [http://localhost:3000](http://localhost:3000) login with the username and password you created in step 3 of the 'Build Loomio Database' section.

### Start Rails Server With Alternative Port

1.  Amend the required Loomio environment file with your desired port e.g `CANONICAL_PORT=8080`

        nano .env.development

2.  Start rails server with alternative port option

        bundle exec rails s -p 8080 -e development

{: .note}
>
> Use the PiD file option if you want to run two different environments at the same time `s -p 8888 -e test -P /tmp/pids/alternate_server.pid`

## Give Loomio User Admin Privileges

1.  From Loomio root directory enter the `rails console`

        bundle exec rails console development

    For production environment use Heroku. see Heroku install in 'Production Environment Additional Setup' section below.

        heroku local:run bundle exec rails console

2.  Run the following console commands, replacing the email with your Loomio user login or the user you want to give admin privileges to.

        u = User.find_by email: 'user@email.com'
        u.is_admin = true
        u.save
        exit

Admin options will now be available at [localhost:3000/admin](http://localhost:3000/admin)

## Start Loomio with PM2 Process Manager

The [PM2](http://pm2.keymetrics.io/) Node package can also be used to start Ruby packages on system boot. Stop Loomio with **CTRL+C** if it's running in terminal.

1.  Install PM2 globally.

        npm install pm2 -g

2.  Run PM2 start process. Add `-p 8080` option before `-e development` if you're using an alternative port and set -e option to your required environment (development/test). Replace `~/loomio` with your loomio root path.

        pm2 start ~/loomio/script/rails --name "loomio-dev" --interpreter=ruby -- s -e development

###  PM2 Production

Starting Loomio with Heroku in production environment requires changing to Loomio root for the current working directory (CWD). PM2 only supports this from its [startup process files](http://pm2.keymetrics.io/docs/usage/application-declaration/)

1.  Create a Json process file and amend with the path to your Loomio root. Amend the port option also if required `-p 3000`

        nano pm2loomio.json

    Add the following

        ~~~~
        {
          "name" : "Loomio-Heroku",
          "script" : "heroku",
          "cwd" : "/path/to/loomio",
          "args" : "local -p 3000"
        }
        ~~~~

2.  Run PM2 start process file.

        pm2 start pm2loomio.json

### Create PM2 init startup.

This will make PM2 processes start at boot.

    pm2 startup

## Production Environment Additional Setup

For the production environment we will be using Heroku Local, this will use Ruby Puma web server. For Loomio to function properly it will require SMTP. It's also recommended that you use TLS/SSL which can be achieved with Letsencrypt. You may also want to [Secure Rails](https://github.com/ankane/secure_rails)

{: .note}
>
> Secure information stored in config/database.yml and .env will be ignored by Git in .gitignore this should be updated if you change where secure information is stored.

### Install Heroku Local

Add Heroku repository and install it. [More about Heroku Local here](https://devcenter.heroku.com/articles/heroku-local)

    curl -L https://cli-assets.heroku.com/apt/release.key | sudo apt-key add -
    echo "deb https://cli-assets.heroku.com/branches/stable/apt ./" | sudo tee /etc/apt/sources.list.d/heroku.list
    sudo apt-get update && sudo apt-get install heroku

### Setup Production ENV file.

1.  Create production environment file in your Loomio root directory, these are hidden files. NOTE: The next series of steps assumes that Loomio root is your working directory. e.g `cd ~/loomio`

        nano .env

2.  Add and amend the following environment settings

        ~~~~
        # this is the hostname of your app used by loomio
        CANONICAL_HOST=REPLACE_WITH_HOSTNAME
        CANONICAL_PORT=REPLACE_WITH_PORT

        # the number of dots in your hostname
        TLD_LENGTH=REPLACE_WITH_TLD_LENGTH

        # smtp settings
        SUPPORT_EMAIL=REPLACE_WITH_CONTACT_EMAIL
        SMTP_DOMAIN=REPLACE_WITH_HOSTNAME

        SMTP_SERVER=smtp.example.com
        SMTP_PORT=465
        SMTP_USERNAME=smtpusername
        SMTP_PASSWORD=smtppassword

        # helper bot is the account which welcomes people to their groups
        HELPER_BOT_EMAIL=no-reply@REPLACE_WITH_HOSTNAME
        RAILS_ENV=production
        FORCE_SSL=1

        # Secret keys, these will be generated during install
        ~~~~

3.  Generate and add secret keys to .env


        echo DEVISE_SECRET=`openssl rand -base64 48` >> .env && echo SECRET_COOKIE_TOKEN=`openssl rand -base64 48` >> .env


### Build Production Database

Make sure you have entered production database connection details into config/database.yml. Here we use Heroku Local to invoke Rake. Heroku will use the .env environment file by default. You can use the -e option if you want to use an alternative .env file or location. `heroku local:run -e .env.production` remember to update .gitignore if you do.

    heroku local:run bundle exec rake db:setup bootstrap:create_user[user@email.com,userpasswd]

### Install Loomio Plugins

Loomio plugins are available as separate repositories on [github.com/loomio](https://github.com/loomio/) to see the default plugins use `cat config/plugins.yml`

1.  We don't want all of the default plugins so we will create a custom plugins yaml file.

        nano config/plugins.custom.yml

        ~~~~
        loomio_webhooks:
          repo:         loomio/loomio_webhooks

        loomio_tags:
          repo:         loomio/loomio_tags

        loomio_content_preview:
          repo:         loomio/loomio_content_preview
        ~~~~

2.  Fetch and install plugins.

        bundle exec rake 'plugins:fetch[plugins.custom]' plugins:install

### Copy Gulp Compiled Assets

If you've made changes or haven't run gulp compile, do so now `cd angular && gulp compile && cd ../` This next command will copy the compiled assets to a Loomio 'current version' directory.

    cp -r public/client/development public/client/`ruby -r "./lib/version.rb" -e "puts Loomio::Version.current"`

### Precompile Controller Assets

In production environment, controller assets need to be precompiled.  [guides.rubyonrails.org/v4.0/asset_pipeline.html#precompiling-assets](http://guides.rubyonrails.org/v4.0/asset_pipeline.html#precompiling-assets)
NOTE: To remove previous precompiled assets run `bundle exec rake assets:clobber`

    bundle exec rake assets:precompile

### Starting Production

Production Loomio can now be run with Heroku local. Run from your Loomio root directory. Use the PM2 process manager to keep Loomio production running. The instructions for PM2 are in the 'Start Loomio with PM2 Process Manager' section above.

    heroku local -p 3000

### Cron Tasks

This assumes you have crontab installed and have set it to use the default editor of your choice.

    crontab -e

Add the following to run hourly tasks on Loomio production. You can see see more about what these tasks are and other tasks that may need to be run [here](https://github.com/loomio/loomio/blob/master/lib/tasks/loomio.rake) Replace `~/loomio` with your loomio root path.

    0 * * * *  cd ~/loomio && heroku local:run bundle exec rake loomio:hourly_tasks
