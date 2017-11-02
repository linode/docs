---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install GitLab on an Ubuntu 14.04 (Trusty Tahr).'
keywords: ["version control", "git", "gitlab", "ruby", " ruby on rails", "mysql", "postgresql", "nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['gitlab-with-ubuntu/','applications/development/gitlab-on-ubuntu-14-04/','applications/development/install-gitlab-on-ubuntu-14-04-trusty-tahr/', 'applications/development/how-to-install-and-configure-gitlab-on-ubuntu-14-04-trusty-tahr/']
contributor:
    name: Nashruddin Amin
    link: https://twitter.com/bsd_noobz
modified: 2017-06-21
modified_by:
  name: Linode
published: 2014-09-04
title: 'Install GitLab on Ubuntu 14.04 (Trusty Tahr)'
external_resources:
 - '[GitLab Community Edition](https://www.gitlab.com/gitlab-ce/)'
 - '[GitLab Documentation](https://www.gitlab.com/documentation/)'
 - '[GitLab Requirements](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/install/requirements.md)'
 - '[GitLab Manual Installation](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/install/installation.md)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

GitLab is a free git repository management application based on Ruby on Rails. It is an interesting alternative if you want to host your own git repositories, since third-party hosting is not always the best option when writing private or closed-source software.

GitLab provides a [.deb package](https://www.gitlab.com/downloads/) which contains GitLab Community Edition and all its dependencies (Ruby, PostgreSQL, Redis, Nginx, Unicorn and other gems) already compiled. Installing this package is [straightforward](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md#installation). But since it will install its own package dependencies (Nginx, PostgreSQL, etc), this installation method is suitable if the server is dedicated only to managing git repositories. If you want GitLab to use your existing resources (i.e: you already have Nginx and PostgreSQL installed), you need to install GitLab manually.

This guide will help you install and configure GitLab on your Ubuntu 14.04 (Trusty Tahr) Linode. We will be using the latest Ruby and GitLab as of this writing, so check for the latest version. We will assume that you want to install GitLab on `git.example.com` and you have configured the DNS properly. If you are new to Linux system administration, you might want to consider the [Introduction to Linux Concepts guide](/docs/tools-reference/introduction-to-linux-concepts) and [Linux Administration Basics guide](/docs/tools-reference/linux-system-administration-basics) guides. Hosting your own software projects could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/how-to-use-block-storage-with-your-linode) service with this setup.

 {{< note >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with sudo. If you are not familiar with the sudo command, you can check out our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## System Requirements

GitLab is a large and heavy application. To get the most of GitLab, the recommended hardware is as follows:

- **CPU:** 2 cores to support up to 500 users.
- **Memory:** 2 GB to support up to 500 users.

## Prepare System for Deployment

Before beginning with the GitLab installation, make sure that your system's package database is up to date and that all installed software is running the latest version.

1. Update your system by issuing the following commands from your shell:

        sudo apt-get update
        sudo apt-get upgrade

2. Also create a git user for GitLab:

        sudo adduser --disabled-login --gecos 'GitLab' git

### Install Package Dependencies

In this section you will install the development tools and the required packages for GitLab.

1. Install the required packages to compile Ruby and native extensions to Ruby gems:

        sudo apt-get install build-essential cmake zlib1g-dev libyaml-dev libssl-dev libgdbm-dev libreadline-dev libncurses5-dev libffi-dev curl openssh-server redis-server checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev logrotate

2. Install Git:

        sudo apt-get install git

3. In order to receive mail notifications, you need to install a mail server. Issue the following command to install Postfix mail server:

        sudo apt-get install postfix

   Select `Internet site` and enter your hostname to complete the installation. If you need to set up a complete SMTP/IMAP/POP3 server, refer to the [Email with Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) guide.

### Install Ruby

While GitLab is a Ruby on Rails application, using ruby version managers such as [RVM](http://rvm.io/) and [rbenv](https://github.com/sstephenson/rbenv) is not supported. For example, GitLab shell is called from OpenSSH and having a version manager can prevent pushing and pulling over SSH. Thus GitLab can only work with system-wide Ruby installation. In addition, GitLab requires Ruby 2.0 or higher while the default version on Ubuntu 14.04 is 1.9.3.

1. Remove the old Ruby if present:

        sudo apt-get remove ruby

2. The current stable Ruby version as of this writing is 2.1.2. To install Ruby, download the source code and compile the package:

        mkdir /tmp/ruby && cd /tmp/ruby
        wget http://ftp.ruby-lang.org/pub/ruby/2.1/ruby-2.1.2.tar.gz
        tar xvzf ruby-2.1.2.tar.gz
        cd ruby-2.1.2
        ./configure --disable-install-rdoc --prefix=/usr/local
        make
        sudo make install

3. Check if the installation succeed by checking the Ruby version:

        ruby -v

### Setup PostgreSQL Database for GitLab

GitLab supports both MySQL and PostgreSQL for the database backend, but the latter is recommended. GitLab requires PostgreSQL version 9.1 or higher since it needs to make use of extensions.

1. Install PostgreSQL if you haven't installed it:

        sudo apt-get install postgresql postgresql-client libpq-dev

2. Create new database and new user by issuing the following commands:

        sudo -u postgres createuser --createdb git
        sudo -u postgres createdb --owner=git gitlabhq_production

3. Try connecting to the new database with the new user and display PostgreSQL version for testing:

        sudo -u git -H psql -d gitlabhq_production -c "SELECT VERSION()"

   If everything is ok, you should see the PostgreSQL version displayed on the console like this:

                                                       version
        ------------------------------------------------------------------------------------------------------
         PostgreSQL 9.3.4 on x86_64-unknown-linux-gnu, compiled by gcc (Ubuntu 4.8.2-16ubuntu6) 4.8.2, 64-bit
        (1 row)

## Install GitLab

In this section you will install GitLab and make some configuration changes.

1. We will install GitLab into home directory of the user git. Change the current working directory:

        cd /home/git

2. Download the GitLab source:

        sudo -u git -H git clone https://gitlab.com/gitlab-org/gitlab-ce.git -b 6-9-stable gitlab
        cd gitlab

   The command above will download the 6-9-stable branch from the GitLab repository. Feel free to select other stable branches, but never install the master branch on a production server.

3. Create the GitLab config file:

        sudo -u git -H cp config/gitlab.yml.example config/gitlab.yml

   Open the file:

        sudo nano config/gitlab.yml

   You need to change the value of host to the fully-qualified domain of your server. Also set the email_from and support_email to the email addresses intended for GitLab.

   {{< file-excerpt "/home/git/gitlab/config/gitlab.yml" >}}
production: &base
  gitlab:
    host: git.example.com
    port: 80
    https: false
    ...
    email_from: gitlab@example.com
    ...
    support_email: support@example.com

{{< /file-excerpt >}}


     {{< note >}}
If you specified a database name other than `gitlabhq_production` when creating the PostgreSQL database in the previous section, edit the `config/database.yml` file to match with your database name.
{{< /note >}}

4. Save and exit the file.

5. Make sure GitLab can write to the log/ and tmp/ directories:

        sudo chown -R git {log,tmp}
        sudo chmod -R u+rwX {log,tmp,tmp/pids,tmp/sockets,public/uploads}

6. Create directory for satellites:

        sudo -u git -H mkdir /home/git/gitlab-satellites
        sudo chmod u+rwx,g+rx,o-rwx /home/git/gitlab-satellites

7. Create the Unicorn, Rack attack, and PostgreSQL configuration files:

        sudo -u git -H cp config/unicorn.rb.example config/unicorn.rb
        sudo -u git -H cp config/initializers/rack_attack.rb.example config/initializers/rack_attack.rb
        sudo -u git cp config/database.yml.postgresql config/database.yml


8. Make sure that config/database.yml is readable to git only:

        sudo -u git -H chmod o-rwx config/database.yml

9. Install the gems:

        sudo gem install bundler
        sudo -u git -H bundle install --deployment --without development test mysql aws

10. Install GitLab shell, which is an SSH access and repository management software for GitLab:

        sudo -u git -H bundle exec rake gitlab:shell:install[v1.9.4] REDIS_URL=redis://localhost:6379 RAILS_ENV=production

11. Open the GitLab shell configuration file:

        sudo nano /home/git/gitlab-shell/config.yml

12. Check if the value of `gitlab_url` matches with the URL of your server.

    {{< file-excerpt "/home/git/gitlab-shell/config.yml" >}}
user: git
gitlab_url: http://git.example.com/
http_settings:
  self_signed_cert: false
repos_path: "/home/git/repositories/"
auth_file: "/home/git/.ssh/authorized_keys"
redis:
  bin: "/usr/bin/redis-cli"
  host: localhost
  port: 6379
  namespace: resque:gitlab
log_level: INFO
audit_usernames: false

{{< /file-excerpt >}}


    When you are satisfied with the configuration, save and exit the file.

13. Initialize database and activate advanced features:

        sudo -u git -H bundle exec rake gitlab:setup RAILS_ENV=production

    The command will display the following message

        This will create the necessary database tables and seed the database.
        You will lose any previous data stored in the database.
        Do you want to continue (yes/no)?

    Type **yes** and press Enter to continue.

14. Install the init script and make GitLab start on boot:

        sudo cp lib/support/init.d/gitlab /etc/init.d/gitlab
        sudo update-rc.d gitlab defaults 21

15. Set up logrotate:

        sudo cp lib/support/logrotate/gitlab /etc/logrotate.d/gitlab

16. Check application status:

        sudo -u git -H bundle exec rake gitlab:env:info RAILS_ENV=production

    Sample output

        System information
        System:         Ubuntu 14.04
        Current User:   git
        Using RVM:      no
        Ruby Version:   2.1.2p95
        Gem Version:    2.2.2
        Bundler Version:1.6.3
        Rake Version:   10.3.1
        Sidekiq Version:2.17.0

        GitLab information
        Version:        6.9.2
        Revision:       e46b644
        Directory:      /home/git/gitlab
        DB Adapter:     postgresql
        URL:            http://git.example.com
        HTTP Clone URL:	http://git.example.com/some-project.git
        SSH Clone URL:	git@git.example.com:some-project.git
        Using LDAP:     no
        Using Omniauth: no

        GitLab Shell
        Version:        1.9.4
        Repositories:   /home/git/repositories/
        Hooks:          /home/git/gitlab-shell/hooks/
        Git:            /usr/bin/git

17. Compile assets:

        sudo -u git -H bundle exec rake assets:precompile RAILS_ENV=production

18. Configure Git global settings for the git user:

        sudo -u git -H git config --global user.name "GitLab"
        sudo -u git -H git config --global user.email "gitlab@example.com"
        sudo -u git -H git config --global core.autocrlf input


     {{< note >}}
Set the value for user.email according to what is set in config/gitlab.yml
{{< /note >}}

19. Start GitLab:

        sudo service gitlab start

## Set Up Nginx Virtual Host for GitLab

Nginx is the only supported web server for GitLab. In this section, you will create a new virtual host for GitLab and activate the site.

1. Install Nginx if you haven't installed it:

        sudo apt-get install nginx

2. Copy the sample site config:

        sudo cp lib/support/nginx/gitlab /etc/nginx/sites-available/gitlab

3. Open the config file:

        sudo nano /etc/nginx/sites-available/gitlab

4. Modify the value for `server_name` to the fully-qualified domain name of your server:

   {{< file-excerpt "/etc/nginx/sites-available/gitlab" >}}
listen 80;
server_name git.example.com;
server_tokens off;
root /home/git/gitlab/public;

{{< /file-excerpt >}}


   Save and exit the file.

5. Deactivate the default virtual host

        sudo rm /etc/nginx/sites-enabled/default

6. Activate the site and restart Nginx to take effect

        sudo ln -s /etc/nginx/sites-available/gitlab /etc/nginx/sites-enabled/gitlab
        sudo service nginx restart

7.  If Nginx failed to start with the following message

        Restarting nginx: nginx: [emerg] could not build the server_names_hash, you should increase server_names_hash_bucket_size: 32

    Open /etc/nginx/nginx.conf and uncomment the following line

        server_names_hash_bucket_size 64;

    Then restart Nginx.

## Open GitLab on Your Browser

Double check the application status:

        cd /home/git/gitlab
        sudo -u git -H bundle exec rake gitlab:check RAILS_ENV=production

If most of the items are green and some are purple (which is okay since you don't have any git project yet), then you have successfully installing GitLab. Below are the sample output:

        Checking Environment ...

        Git configured for git user? ... yes

        Checking Environment ... Finished

        Checking GitLab Shell ...

        GitLab Shell version >= 1.9.4 ? ... OK (1.9.4)
        Repo base directory exists? ... yes
        Repo base directory is a symlink? ... no
        Repo base owned by git:git? ... yes
        Repo base access is drwxrws---? ... yes
        Satellites access is drwxr-x---? ... yes
        update hook up-to-date? ... yes
        update hooks in repos are links: ... can't check, you have no projects
        Running /home/git/gitlab-shell/bin/check
        Check GitLab API access: OK
        Check directories and files:
            /home/git/repositories/: OK
            /home/git/.ssh/authorized_keys: OK
        Test redis-cli executable: redis-cli 2.8.4
        Send ping to redis server: PONG
        gitlab-shell self-check successful

        Checking GitLab Shell ... Finished

        Checking Sidekiq ...

        Running? ... yes
        Number of Sidekiq processes ... 1

        Checking Sidekiq ... Finished

        Checking LDAP ...

        LDAP is disabled in config/gitlab.yml

        Checking LDAP ... Finished

        Checking GitLab ...

        Database config exists? ... yes
        Database is SQLite ... no
        All migrations up? ... yes
        Database contains orphaned UsersGroups? ... no
        GitLab config exists? ... yes
        GitLab config outdated? ... no
        Log directory writable? ... yes
        Tmp directory writable? ... yes
        Init script exists? ... yes
        Init script up-to-date? ... yes
        projects have namespace: ... can't check, you have no projects
        Projects have satellites? ... can't check, you have no projects
        Redis version >= 2.0.0? ... yes
        Your git bin path is "/usr/bin/git"
        Git version >= 1.7.10 ? ... yes (1.9.1)

        Checking GitLab ... Finished

Now you can open http://git.example.com on your browser. GitLab will show you the login page.

![GitLab Login Page](/docs/assets/gitlab-login-page-s.png)

You can login using **root** as the username and **5iveL!fe** for the password.

## Securing GitLab

Now that you have GitLab running on your server, you might want to add SSL support to secure your GitLab site. Refer to the [SSL Certificates with Nginx](/docs/security/ssl/ssl-certificates-with-nginx) guide to protect your site with SSL.

