---
slug: install-canvas-lms-on-ubuntu-2204
description: 'Canvas is a learning management system that you can use to create a fully-featured website for education or training courses. This guide walks you through installing Canvas on Ubuntu 22.04.'
keywords: ['Install canvas lms', 'canvas lms', 'install canvas ubuntu 22.04', 'self-host canvas lms']
tags: ['canvas', 'ubuntu', 'ssl', 'apache', 'redis']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-04-25
modified_by:
  name: Linode
title: How to Install Canvas on Ubuntu 22.04
title_meta: Installing Canvas on Ubuntu 22.04
external_resources:
- '[Canvas](https://www.instructure.com/canvas)'
- '[What is Learning Management System](https://www.shareknowledge.com/blog/what-learning-management-system-and-why-do-i-need-one)'
- '[PostgreSQL Client Authentication](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)'
---

[Canvas](https://www.instructure.com/canvas) is a modern open-source Learning Management System (LMS) by Instructure, Inc. that helps makes distance learning possible. An LMS like Canvas is a software application or web-based technology that you use to plan, implement, and assess a specific learning process. This guide helps you install all of its prerequisites, install Canvas LMS on Ubuntu, perform required Canvas setups, ensure your Canvas setup is secure, and then access your Canvas setup. This guide uses the **Ubuntu 22.04** distribution.

The result of following this process is the creation of a self-hosted Canvas LMS, rather than using the [online site](https://www.instructure.com/canvas). The advantage of this approach is that you have a setup you can easily customize.

## Install Prerequisites

Before you can clone and install Canvas, you must ensure certain prerequisite applications are in place. In addition, your system needs to meet these [minimum hardware requirements](https://github.com/instructure/canvas-lms/wiki/Quick-Start#automated-setup). You can use a [shared CPU](https://www.linode.com/community/questions/20991/dedicated-vs-shared-cpu-plans) on a hosted system, rather than a [dedicated CPU](https://www.linode.com/content/linode-dedicated-cpus-explained-dedicated-vs-shared-cpu-instances/):

- 150GB of available hard drive space
- 8GB of RAM
- Four core CPU

The following sections help you install the software you need before you can clone and install Canvas. Here is a quick list of the software and versions used for this guide:

- Ruby [version 2.7 minimum](https://github.com/instructure/canvas-lms/wiki/Quick-Start#dependency-installation), version 3.0 and above are untested
- Apache version 2.4.52
- Passenger version 6.0.10
- Git version 2.34.1
- PostgreSQL [version 12 minimum](https://github.com/instructure/canvas-lms/wiki/Quick-Start#debianubuntu), version 14.4 used for guide
- Node.js version v16.16.0, version 10.19 version does not work
- (Optional) Redis version 6.0.16

You may have one or more of these software installed. To verify installation, type the name of the software followed by `--version`, such as `git --version`, and press **Enter**. Some products, such as Node.js, use `-v` in place of `--version`. If the version you have installed is equal to or higher than the version used for the guide, then you don’t need to perform another installation. If you have an older software version, update it.

You also need to install an email application. Canvas uses this email service to send notifications to users. There are numerous email server options and the one you choose depends on how you want to configure email for your server. One option is to use a third-party mail service such as [Mailgun](https://www.mailgun.com/). Another option is to install and configure a local email server using a product combination like [Postfix, Dovecot, and MySQL](/docs/guides/email-with-postfix-dovecot-and-mysql/). You can also use an existing email server that you already have in place. You need to know email essentials like the email domain, the username and password for an email account, and the address of the Simple Mail Transfer Protocol (SMTP) server for this guide.

### Update and Upgrade Your Ubuntu 22.04 Instance

Make sure the server is up-to-date before you install and configure Canvas LMS. The following steps detail how:

1. Update your system using the following command:

    ```command
    sudo apt update
    ```

    You see a number of updates performed on your system. The final message tells you that a certain number of packages can be upgraded.

1. Perform any required package upgrades using the following command:

    ```command
    sudo apt -y upgrade
    ```

    - The progress indicators keep you apprised of how the process is going
    - If there is a kernel upgrade, reboot your system to install it
    - You may have to restart services using outdated libraries using the GUI screens provided


### Check for Git and Curl

You should have Git and Curl already installed on your server.

1. To verify if Git is installed, enter the following command:

    ```command
    git --version
      ```

    The output appears as:

    ```output
    git version 2.34.1
    ```

    If you are missing Git, install it using the following command:

    ```command
    sudo apt -y install git
    ```

1. To verify if Curl is installed, enter the following command:

    ```command
    curl --version
    ```

    The output appears as:

    ```output
    curl 7.81.0
    ```

    If you are missing Curl, install it using the following command:

    ```command
    sudo apt -y install curl
    ```

### Install Node JS

Canvas requires Node.js version 10.19 or higher. You can install latest version of Node.js, which you can install using the Node Version Manager (NVM) command-line utility as explained below:

1. Install the required library support for Node.js using the following command:

    ```command
    sudo apt -y install zlib1g-dev libxml2-dev libsqlite3-dev postgresql libpq-dev libxmlsec1-dev curl make g++
    ```
1. Obtain the Node.js source using the following command:

    ```command
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash
    ```

1. Install the Node.js 16.x version using the following command:

    ```command
    sudo apt -y install nodejs
    ```

1. Verify that the correct version of Node.js is installed by running the following command:

    ```command
    node -v
    ```
    This should print the `v16.16.0` version or above of Node.js.

1. Ensure that the most current version of npm is installed by running the following command:

    ```command
    sudo npm install -g npm@latest
    ```

### Install Ruby

The steps in this section explain how to install Ruby using the Ruby Environment (Rbenv) method.

1. Verify if Ruby is installed on your system using the following command:

    ```command
    ruby -v
    ```

    If you have an old version of Ruby, you can upgrade it using the procedure explained in this section and select the version needed for the Canvas LMS installation.

    {{< note type="warning">}}
    You must use Ruby version 2.7.x, rather than version 3 and above. Version 3 is untested with Canvas and may cause problems.
    {{< /note >}}

1. Obtain the Rbenv installation script using the following command:

    ```command
    curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
    ```
1. Complete the configuration of the Rbenv path using the following commands:

    ```command
    echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
    echo 'eval "$(rbenv init -)"' >> ~/.bashrc
    source ~/.bashrc
    ```

1. Restart your terminal session to ensure the changes take place.

1. Verify the setup is usable by executing the following command:

    ```command
    rbenv -v
    ```

    You should see output similar to the following:

    ```output
    rbenv 1.2.0-16-gc4395e5
    ```

1. (Optional) See the latest iteration of each version using the following command:

    ```command
    rbenv install -l
    ```

    {{< note>}}
    You should see the Ruby version 2.7.6 is on the list.
    {{< /note >}}

1. Install the 2.7.6 version of Ruby used for this guide using the following command. The installation process takes several minutes to complete the installation.

    ```command
    rbenv install 2.7.6 --verbose
    ```

    Eliminate the `--verbose` switch if you don’t want to see the installation process taking place.

1. Select the 2.7.6 version of Ruby using the following command:

    ```command
    export RBENV_VERSION=2.7.6
    ```

1. Verify the Ruby installation using the following command:

    ```command
    ruby -v
    ```

### Install Ruby Bundler

To install Ruby on Ubuntu 22.04, you don't necessarily need to install the Ruby Bundler. The Ruby Bundler is a package management tool used to manage dependencies in Ruby projects. However, if you plan on developing Ruby applications on your Ubuntu machine, then you may want to consider installing the Ruby Bundler, as it can help you manage dependencies, and ensure that your Ruby projects run smoothly.

To install the Ruby Bundler on Ubuntu 22.04, you need to have a few prerequisites installed:

- **Ruby**: The Ruby programming language should be installed on your Ubuntu 22.04 machine. You can install it by following the steps explained in the [Install Ruby](/docs/guides/install-canvas-lms-on-ubuntu-2204/#install-ruby) section.

- **RubyGems**: RubyGems is a package manager for the Ruby programming language. It should be installed with Ruby by default. You can check if it's installed by running the command `gem -v` in the terminal. If a version number is displayed, then RubyGems is installed.

- **GCC**: GCC is a compiler for the C and C++ programming languages, which is required to build some Ruby gems that have native extensions. You can install GCC by running the `sudo apt install build-essential` command.

Once you have the above prerequisites installed, follow the steps below to install Ruby Bundler:

1. Add the specific version of Ruby Bundler to your Ruby by running the following command:

    ```command
    sudo gem install bundler --version 2.2.19
    ```

    You should see an output as shown below:

    ```output
    1 gem installed
    ```

    {{< note>}}
    Using other installation methods tends to overwrite your Ruby installation with a 3.x version.
    {{< /note >}}

1. You can check if the Bundler is installed correctly by running the following command:

    ```command
    bundler -v
    ```
    You should see an output as shown below:

    ```output
    Bundler version 2.2.19
    ```

1. Verify that installing Bundler didn’t update Ruby by running the following command:

    ```command
    ruby -v
    ```
    You should see an output as shown below:

    ```output
    2.7.6
    ```

### Install Apache and Passenger

Before proceeding, verify if Apache is already installed using the `apache2 -v` command. If Apache is not installed, follow the steps below:

1. Install Apache using the following commands:

    ```command
    sudo apt-get update
    sudo apt -y install apache2
    ```

    Verify that the Apache service is up and running by running the following command:

    ```command
    systemctl status apache2
    ```

    You should see output similar to the following:

    ```output
    apache2.service - The Apache HTTP Server
     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
     Active: active (running) since Sun 2022-08-07 19:40:54 UTC; 1min 59s ago
       Docs: https://httpd.apache.org/docs/2.4/
   Main PID: 35598 (apache2)
      Tasks: 55 (limit: 9409)
     Memory: 5.4M
        CPU: 61ms
     CGroup: /system.slice/apache2.service
             ├─35598 /usr/sbin/apache2 -k start
             ├─35599 /usr/sbin/apache2 -k start
             └─35600 /usr/sbin/apache2 -k start

    Aug 07 19:40:54 localhost systemd[1]: Starting The Apache HTTP Server...
    Aug 07 19:40:54 localhost apachectl[35597]: AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using ::1. Set the 'ServerName' directive globally to suppress this message
    Aug 07 19:40:54 localhost systemd[1]: Started The Apache HTTP Server.
    ```

1. If you need to upgrade Apache, you can use the Personal Package Archives (PPA) by following the steps below:

    - Run the below command to add the PPA.

      ```command
      sudo add-apt-repository ppa:ondrej/apache2
      ```

    - Update the package manager using the command below:

      ```command
      sudo apt-get update
      ```

1. Verify you can access your Apache server by opening a browser of your choice and navigating to `http://<The IP Address of the Server>`. You should see the default Apache page. The IP address is the same one you use to access your server using an SSH utility like PuTTY.

1. Install Passenger using the following command:

    ```command
    sudo apt -y install passenger libapache2-mod-passenger
    ```

1. Verify your Passenger setup using the following command:

    ```command
    dpkg -l | grep passenger
    ```

    You should see the output with version number `6.0.10-3build2` or higher.

    ```output
    Version: 6.0.10-3build2
    ```

### Install PostgreSQL on the Same Server

It’s common practice to install a database management system (DBMS) on a separate server to ensure the DBMS has all of the resources it needs. In addition, the amount of disk activity generated by a DBMS can cause delays for other parts of an application. However, for a smaller installation, you can install the DBMS on the same server. Canvas uses PostgreSQL as its DBMS. To verify that you need to install PostgreSQL on your system, enter the command `service postgresql status` and press **Enter**. If it’s already installed, you should see the service statistics. The following steps show you how to install PostgreSQL on your Ubuntu 22.04 server:

1. Install the PostgreSQL DBMS using the following command:

    ```command
    sudo apt -y install postgresql
    ```

1. Verify that PostgreSQL is running using the following command:

    ```command
    service postgresql status
    ```

    You should see the output as follows:

    ```output
    postgresql.service - PostgreSQL RDBMS
      Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
      Active: active (exited) since Sun 2022-08-07 20:05:00 UTC; 6min ago
      Process: 37808 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
      Main PID: 37808 (code=exited, status=0/SUCCESS)
      CPU: 1ms

    Aug 07 20:05:00 localhost systemd[1]: Starting PostgreSQL RDBMS...
    Aug 07 20:05:00 localhost systemd[1]: Finished PostgreSQL RDBMS.
    ```

1. Switch the current user to the `postgres` user account using the `sudo` command as follows:

    ```command
    sudo su - postgres
    ```

    The prompt changes to `postgres@localhost:~$`.

1. Verify that you can connect to the database by using the `psql` command. This starts the interactive interface. The prompt changes to: `postgres=#`.

1. Display the information about the current database connection using the following command:

    ```command
    \conninfo
    ```

    The output, as per this example displays the following information:

    - The name of the current database, `postgres`. This is the default database that is created when you install PostgreSQL.
    - The username, `postgres` is to connect to the database. This is also the default superuser account created when you install PostgreSQL.
    - The database connection is established via a Unix domain socket file located at `/var/run/postgresql`.
    - The port number used for the database connection is `5432`. This is the default port number used by PostgreSQL.
    - The connection status (either "connected" or "disconnected")

    ```output
    postgres=# \conninfo
    You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".
    ```

1. Enter `\q` to exit the interactive environment.

1. Enter `exit` to exit the PostgreSQL environment. You should see the following output indicating that you have successfully disconnected from the PostgreSQL server.

    ```output
    postgres=# logout
    ```

### (Optional) Install Redis for Caching

Redis is a key-value database store that Canvas uses to cache data and make your installation run faster. Developers use Redis because it’s extremely fast when compared to a full-fledged DBMS and because it’s also limited to storing just key-value pairs. The following steps install Redis on your server:

1. Install the Redis server using the following command:

    ```command
    sudo apt -y install redis-server
    ```

1. Verify the Redis version installed using the following command:

    ```command
    redis-server -v
    ```

    You should see the output as follows with version number `6.0.16` or higher.

    ```output
    Redis server v=6.0.16 sha=00000000:0 malloc=jemalloc-5.2.1 bits=64 build=a3fdef44459b3ad6
    ```

1. Verify the Redis service is running using the following command:

    ```command
    sudo systemctl status redis
    ```

    You should see the output as follows:

    ```output
    redis-server.service - Advanced key-value store
    Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
    Active: active (running) since Sun 2022-08-07 20:27:19 UTC; 3min 11s ago
    Docs: http://redis.io/documentation,
             man:redis-server(1)
    Main PID: 38259 (redis-server)
    Status: "Ready to accept connections"
    Tasks: 5 (limit: 9409)
    Memory: 2.6M
    CPU: 562ms
    CGroup: /system.slice/redis-server.service
             └─38259 "/usr/bin/redis-server 127.0.0.1:6379" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" "" ""

    Aug 07 20:27:19 localhost systemd[1]: Starting Advanced key-value store...
    Aug 07 20:27:19 localhost systemd[1]: Started Advanced key-value store.
    ```

1. Verify that you can access Redis from the command line using the following command:

    ```command
    redis-cli
    ```

    This connects you to the default Redis server running on `127.0.0.1` (localhost) and port `6379`. Once you're connected, you can type `ping` and press **Enter** to test the connection. If the connection is working properly, you should see `PONG` as the output.

1. Create a test entry by entering the command `set testKey "Test Test"`. You see `OK` as output.

1. Enter `get testKey` to see the output of `Test Test`.

1. Enter `quit` to exit the command prompt.


## Configure PostgreSQL

1. Switch to the `postgres` user and launch the PostgreSQL command-line interface using the following commands:

    ```command
    sudo su postgres
    psql
    ```

    You see the `postgres=#` prompt.

1. Create a new user with a username using the following command:

    ```command
    CREATE USER canvas;
    ```

    You should see the output as follows:

    ```output
    CREATE ROLE
    ```

1. Verify the new user by typing `\du` and pressing **Enter**. You should see `canvas` as one of the users and canvas should have no roles assigned to it.

1. For the `canvas` user, add a password of your choice using the following command:

    ```command
    ALTER USER canvas WITH PASSWORD '<Password>';
    ```

    You should see the output as follows:

    ```output
    ALTER ROLE
    ```

    Keep track of this password because you need it for the Canvas configuration later.

1. Create a new database for Canvas using the following command:

    ```command
    CREATE DATABASE canvas_production WITH OWNER canvas;
    ```

     You should see the output as follows:

    ```output
    CREATE DATABASE
    ```

1. Display the list of all databases that have been created on your PostgreSQL server by typing `\l` and pressing **Enter**. From the output, verify the `canvas_production` database has an owner of the `canvas`.

    ```output
                                      List of databases
        Name      |  Owner   | Encoding | Collate |  Ctype  |   Access privileges
    ---------------+----------+----------+---------+---------+-----------------------
    canvas_prod...| canvas   | UTF8     | C.UTF-8 | C.UTF-8 |
    postgres      | postgres | UTF8     | C.UTF-8 | C.UTF-8 |
    template0     | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
                  |          |          |         |         | postgres=CTc/postgres
    template1     | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
                  |          |          |         |         | postgres=CTc/postgres
    (4 rows)
    ```

1. Test the new user and database connection using the following command:

    ```command
    psql canvas_production -U canvas
    ```

    After entering the password you assigned to the user, you should see a `canvas_production=>` prompt. If this isn’t the case, modify the `pg_hba.conf` file using the following steps.

    {{< note >}}
    The `pg_hba.conf` file is a configuration file for the PostgreSQL database server that controls [client authentication](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html). It specifies which hosts are allowed to connect to the PostgreSQL server and how they can authenticate themselves.
    {{< /note >}}

    - Start the PostgreSQL command-line utility, `psql` as the user `postgres`.
    - Locate the `pg_hba.conf` file using the `SHOW hba_file;` command. You see the location of the `pg_hba.conf` file, such as `/etc/postgresql/14/main/pg_hba.conf`.
    - Open the `pg_hba.conf` file in a text editor such as vi or nano. You may need to use `sudo` to open it.
    - Create a new entry for the user `canvas`: Copy the existing `local all postgres` entry as a template and paste it at the bottom of the file. Change the values to match the following:

      ```output
      # TYPE  DATABASE            USER            ADDRESS                 METHOD
      local   canvas_production   canvas                                  md5
      ```

      This creates a new rule that allows the user `canvas` to connect to any database using the `md5` authentication method via a Unix-domain socket connection.

    - Save the modified `pg_hba.conf` file and exit the text editor.
    - Restart the PostgreSQL service using the `service postgresql restart` command to apply the changes to the `pg_hba.conf` file.
    - Ensure the PostgreSQL service started using the `service postgresql status` command.

1. Enter `\q` to exit the interactive environment.



## Clone, Install and Configure the Canvas LMS Repository

1. Clone the Canvas LMS repository from GitHub using the following command:

    ```command
    git clone https://github.com/instructure/canvas-lms.git
    ```

    This creates a new directory named `canvas-lms` in your current working directory and downloads the repository files into it.

1. Give the user rights to the current working directory using the following command:

    ```command
    sudo chown -R $USER .
    ```

1. Enter `git checkout prod` to check out the code.

1. Copy the example configuration files for several components of the Canvas LMS application using the following command:

    ```command
    for config in amazon_s3 database delayed_jobs domain file_store outgoing_mail security external_migration; do cp config/$config.yml.example config/$config.yml; done
    ```

    The command above creates a copy of each `.yml.example` configuration file and renames it to `.yml` so that the Canvas LMS can use these files to configure various aspects of the application. The command copies the following files:

    - `config/amazon_s3.yml.example`
    - `config/database.yml.example`
    - `config/delayed_jobs.yml.example`
    - `config/domain.yml.example`
    - `config/file_store.yml.example`
    - `config/outgoing_mail.yml.example`
    - `config/security.yml.example`
    - `config/external_migration.yml.example`

1. Use your favorite text editor, such as `vi`, to open the `config/database.yml` file and modify the `password` field for the `production` database entry as shown below:

    ```command
    production:
      adapter: postgresql
      database: canvas_production
      host: localhost
      username: canvas
      password: <secure_password_here>
    ```

1. Open the `config/domain.yml` file and modify the `production` entry's `domain` to match the domain for your server. If you do not have a domain name, you can obtain one along with a DNS record for your server using a service like [Namecheap](https://www.namecheap.com/) or [Freenom](https://www.freenom.com/en/index.html). If you need to test your installation without SSL first, you could consider setting the `ssl` entry in the `config/domain.yml` file to `false`.

1. Open the `config/outgoing_mail.yml` file and update the `production` entry’s outgoing email settings to match your email server.

1. Open the `config/security.yml` file and update the `production` entry’s `encryption_key` setting to a random series of at least twenty letters and numbers. You can use the `cat /dev/urandom | tr -dc 'A-Za-z0-9' | head -c 24; echo ''` command to create a random string of 24 letters and numbers.

1. By default, Bundler installs gems in a global location on the system, which can cause conflicts if different projects require different versions of the same gem. To avoid these conflicts, it is common practice to install gems locally for each project using the below command:

    ```command
    bundle config set --local path 'vendor/bundle'
    ```
    The bundle `config set` command with the `--local` option sets the gem installation path for the current project to vendor/bundle.

1. Type `bundle _2.2.19_ install` and press **Enter** to install to a specific directory.

## Install Yarn

You can rely on *Corepack* to install Yarn on your system. CorePack is a package manager that provides a simple and fast way to install and manage software packages on Linux. It comes automatically with all versions of Node.js starting with 16.10. Follow the steps below to install Yarn on your system.

1. Install Yarn 1.19.1 using the following command:

    ```command
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install yarn=1.19.1-1
    ```

1. Check the version of Yarn installed on your system using `yarn -v` command. If Yarn is installed correctly, you should see a version number similar to `1.19.1` as the output.

## Generate Canvas Assets and Data

The steps in this section generate assets that Canvas needs to function and performs some data-related tasks. Before you begin, ensure you’re in the `/var/canvas` directory.

1. Perform the required user configuration using the following commands:

    ```command
    mkdir -p log tmp/pids public/assets app/stylesheets/brandable_css_brands
    touch app/stylesheets/_brandable_variables_defaults_autogenerated.scss
    touch Gemfile.lock
    touch log/production.log
    ```

1. Ensure the user account has the correct access rights using the following command:

    ```command
    sudo chown -R $USER config/environment.rb log tmp public/assets app/stylesheets/_brandable_variables_defaults_autogenerated.scss app/stylesheets/brandable_css_brands Gemfile.lock config.ru
    ```

1. Perform the required Yarn setup using the `yarn install` command.

1. Compile the Canvas assets using the following command:

    ```command
    RAILS_ENV=production bundle exec rake canvas:compile_assets
    ```

    This step takes a while, but you see progress as it works. Make certain that this process completes fully. If there is a connection problem to the database, you may not see it until you scroll up and read the various outputs. Currently, this step ends in a well-known, [documented](https://github.com/instructure/canvas-lms/issues/2023) error.

1. Ensure that the user has access to the required files using the following command:

    ```command
    chown -R $USER public/dist/brandable_css
    ```

## Populate Database

To populate the database for a Canvas LMS installation, follow the steps below:

1. Set four environment variables to reduce the amount of work required for later steps. Make sure the password meets the complexity requirements for your system:

    ```command
    export CANVAS_LMS_ADMIN_EMAIL=<Administrator Email Address>
    export CANVAS_LMS_ADMIN_PASSWORD=<Administrator Password>
    export CANVAS_LMS_ACCOUNT_NAME=<Account Name Seen by Users>
    export CANVAS_LMS_STATS_COLLECTION=[opt_in | opt_out | anonymized]
    ```

1. Move the following files using the `mv` command as shown below:

    ```command
    mv db/migrate/20210823222355_change_immersive_reader_allowed_on_to_on.rb .
    mv db/migrate/20210812210129_add_singleton_column.rb db/migrate/20111111214311_add_singleton_column.rb
    ```

1.  Initialize the Canvas LMS database using the following command:

    ```command
    RAILS_ENV=production bundle exec rake db:initial_setup
    ```

    You may encounter a [script error](https://github.com/instructure/canvas-lms/wiki/Production-Start#database-population) during this process. Use the commands below to resolve the error:

    ```command
    mv db/migrate/20210823222355_change_immersive_reader_allowed_on_to_on.rb .

    mv db/migrate/20210812210129_add_singleton_column.rb db/migrate/20111111214311_add_singleton_column.rb
    RAILS_ENV=production bundle exec rake db:initial_setup

    mv 20210823222355_change_immersive_reader_allowed_on_to_on.rb db/migrate/.
    RAILS_ENV=production bundle exec rake db:migrate
    ```

1. Move the database migration file named `20210823222355_change_immersive_reader_allowed_on_to_on.rb` to the `db/migrate/` directory using the following command:

    ```command
    mv 20210823222355_change_immersive_reader_allowed_on_to_on.rb db/migrate/.
    ```

1. Complete the migration process using the following command:

    ```command
    RAILS_ENV=production bundle exec rake db:migrate
    ```

1. Remove the previously created environment variables using the `unset` command as shown below:

    ```command
    unset CANVAS_LMS_ADMIN_EMAIL CANVAS_LMS_ADMIN_PASSWORD CANVAS_LMS_ACCOUNT_NAME CANVAS_LMS_STATS_COLLECTION
    ```

    After running this command, the environment variables are removed and their values are longer accessible in the current shell session.

## Secure Canvas

Securing the canvas is an important step to ensure the safety of your data and the privacy of your users. Following are the steps to secure your canvas setup:

1. Create a new system user account named `canvasuser` with no password and no shell access using the following command:

    ```command
    sudo adduser --disabled-password --gecos canvas canvasuser
    ```

1. Change the ownership of all files in the `config` directory that end with the `.yml` extension to the user account `canvasuser` using the following command:

    ```command
    sudo chown canvasuser config/*.yml
    ```

1. Restrict the access permissions of all files in the `config` directory that end with the `.yml` extension using the following command:

    ```command
    sudo chmod 400 config/*.yml
    ```


## Configure Apache

Configure Apache to work with Passenger using the following steps:

1. Enable the Apache module, `mod_rewrite` by running the `sudo a2enmod rewrite` command.

1. Restart Apache to apply the changes by running the `sudo systemctl restart apache2` command.

1. Ensure that Passenger is enabled by running the `sudo a2enmod passenger` command.


## Configure SSL

Following are the steps to configure SSL for security reasons.

1. Enable SSL support on Apache by running the `sudo a2enmod ssl` command.

1. Restart Apache to apply the changes by running the `systemctl restart apache2` command.

### Use a Self-Signed SSL Certificate

The steps in this section describe how to create and use a self-signed certificate. If you have a certificate from a [Certificate Authority (CA)](https://wpmudev.com/blog/ssl-certificate-authorities-reviewed/), you need to install it on your Apache server separately. Some browsers won’t accept a self-signed certificate. The steps below help you create and install a certificate:

1. Generates an [X.509](https://www.techtarget.com/searchsecurity/definition/X509-certificate) certificate for your Apache server with a validity period of `365` days and uses 2048-bit encryption using the command below:

    ```command
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
    ```

    OpenSSL prompts you for information to use as part of the certificate. You are also prompted for information such as your organization name, location, and contact information. After you provide this information, OpenSSL generates a self-signed certificate and stores it in the `/etc/ssl/certs/apache-selfsigned.crt` file.

1. Use your favorite text editor, to open the `/etc/apache2/sites-available/<your_domain_or_ip>.conf` file. In a default setup, this information appears in the `/etc/apache2/sites-available/default-ssl.conf` file.

1. Locate the `SSLCertificateFile` and `SSLCertificateKeyFile` directives in the virtual host configuration file. Update these directives to point to the correct SSL certificate and private key files. The updated directives should look like the following:

    ```output
    SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
    SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key
    ```

1. Enable the SSL virtual host using the `sudo a2ensite default-ssl.conf` command.

1. Test the new configuration using the `sudo apache2ctl configtest` command. You see a warning or error message on the first line of the output. The most important thing is to see `Syntax OK` as the final output.

1. Reload the Apache2 configuration files using the `sudo systemctl reload apache2` command.

1. Test the SSL setup by entering `https://<Your Domain or IP Address>` in your browser. Most browsers complain about the self-signed certificate and some disallow displaying the page without your explicit permission, but you should see the Apache default website in the end.

## Access Canvas

Following are the steps to configure Apache for accessing Canvas:

1. Enable the Apache module `rewrite` by running the following command:

    ```command
    sudo a2enmod rewrite
    ```

1. Use your favorite text editor to open the `/etc/apache2/apache2.conf` file and find the following section:

    ```command
    <Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    ```

1. Change `AllowOverride None` to `AllowOverride All` and save the file.

1. Use your favorite text editor to create a new file at `/etc/apache2/sites-available/canvas.conf`.

1. Define the following content in the file, replacing the ServerName, ServerAdmin, DocumentRoot, SetEnv, and Directory entries as needed:

    ```file {title="/etc/apache2/sites-available/canvas.conf"}
    <VirtualHost *:80>
        ServerName canvas.example.com
        ServerAlias canvasfiles.example.com
        ServerAdmin youremail@example.com
        DocumentRoot /var/canvas/public
        RewriteEngine On
        RewriteCond %{HTTP:X-Forwarded-Proto} !=https
        RewriteCond %{REQUEST_URI} !^/health_check
        RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [L]
        ErrorLog /var/log/apache2/canvas_errors.log
        LogLevel warn
        CustomLog /var/log/apache2/canvas_access.log combined
        SetEnv RAILS_ENV production
        <Directory /var/canvas/public>
          Allow from all
          Options -MultiViews
        </Directory>
    </VirtualHost>
    <VirtualHost *:443>
        ServerName canvas.example.com
        ServerAlias canvasfiles.example.com
        ServerAdmin youremail@example.com
        DocumentRoot /var/canvas/public
        ErrorLog /var/log/apache2/canvas_errors.log
        LogLevel warn
        CustomLog /var/log/apache2/canvas_ssl_access.log combined
        SSLEngine on
        BrowserMatch "MSIE [17-9]" ssl-unclean-shutdown
        # the following ssl certificate files are generated for you from the ssl-cert package.
        SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
        SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key
        SetEnv RAILS_ENV production
        <Directory /var/canvas/public>
          Allow from all
          Options -MultiViews
        </Directory>
    </VirtualHost>
    ```

1. Save the changes and exit the editor.

1. Enable the new virtual host by running the following command:

    ```command
    sudo a2ensite canvas.conf
    ```

1. Test the Apache configuration and check for any syntax errors using the following command:

    ```command
    sudo apache2ctl configtest
    ```

1. Restart Apache by running the following command:

    ```command
    sudo systemctl restart apache2
    ```

1. Navigate to the Canvas website in a browser. In this example, the URL would be `https://canvas.example.com`.

## Conclusion

This guide has taken you through the process of installing Canvas on *Ubuntu 22.04*. It’s essential to verify the versions of each of the software before you proceed because you may already have some of them installed for use with other applications. Updating and upgrading your server is also important to ensure you don’t have any outdated libraries that cause compatibility issues. When you complete this process, you have a basic Canvas LMS setup to use to start training programs in your organization.
