---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring Redmine, an open source project management system on an Ubuntu 9.10 (Karmic) Linode.'
keywords: ["redmine", "redmine ubuntu 9.10", "project management software", "redmine postgresql", "redmine linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/redmine/ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-11-23
title: 'Manage Projects with Redmine on Ubuntu 9.10 (Karmic)'
---



Redmine is a popular open source project management system. Written in Ruby on Rails, it gives teams the ability to track project objectives, integrates well with various source control systems, and includes customizable reporting functionality. This guide will help you install it on your Ubuntu 9.10 (Karmic) Linode. We'll be using nginx with Phusion Passenger as the web server daemon for the site. If you already have the Apache web server installed, guidance will be provided for proxying incoming Redmine requests to nginx running on a different port.

We assume you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). Please make sure you're logged into your Linode as root via an SSH session before proceeding. Throughout this guide, we use the example domain "example.com"; please be sure to substitute your own domain name for each step.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Enable Package Repositories

Edit the file /etc/apt/sources.list and uncomment the `universe` repositories if they're not already enabled. Your repository list should resemble this:

{{< file-excerpt "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe

deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file-excerpt >}}


Issue the following commands to update your local package database and install any outstanding updates.

    apt-get update
    apt-get upgrade --show-upgraded

# Nginx Installation and Configuration

### Install Prerequisite Packages

Issue the following command to install packages required for Ruby on Rails.

    apt-get install wget build-essential ruby1.8 ruby1.8-dev irb1.8 rdoc1.8 zlib1g-dev libopenssl-ruby1.8 libzlib-ruby libssl-dev libpq-dev postgresql subversion

Create symbolic links to the installed version of Ruby:

    ln -s /usr/bin/ruby1.8 /usr/bin/ruby
    ln -s /usr/bin/irb1.8 /usr/bin/irb

Fetch the newest version of the RubyGems source from the [RubyForge download page](http://rubyforge.org/projects/rubygems/). Issue the following commands, substituting the download link for the current version:

    wget http://rubyforge.org/frs/download.php/70696/rubygems-1.3.7.tgz
    tar -xf rubygems*tgz
    cd rubygems*
    ruby setup.rb
    ln -s /usr/bin/gem1.8 /usr/bin/gem

Install some required gems:

    gem install -v=1.0.1 rack
    gem install fastthread
    gem install -v=2.3.5 rails
    gem install postgres
    gem install activerecord
    gem install pg

### Install Passenger and Nginx

Proceed to the [Phusion Passenger](http://www.modrails.com/install.html) site and locate the link for the current source code tarball. Download it as follows (substitute the link for the current version):

    cd /opt
    wget http://rubyforge.org/frs/download.php/71376/passenger-2.2.15.tar.gz
    tar xzvf passenger*.gz

Run the Phusion Passenger installer for Nginx:

    cd passenger*/bin
    ./passenger-install-nginx-module

You'll be greeted by the Phusion Passenger Nginx installer program. Press "Enter" to continue with the installation. When prompted for the Nginx installation method, we recommend you choose "1" to allow the installer to automatically download, compile, and install Nginx for you. Unless you have specific needs that would necessitate passing custom options to Nginx at compile time, this is the safest way to proceed.

Please do **not** remove the Passenger files from `opt` after the install. They need to stay in place or your install will not function correctly.

### Configure Nginx

Nginx is now installed in `/opt/nginx`, but we need a way of controlling it. Issue the following commands to download an "init" script to control the process, set permissions, and configure system startup links:

    cd /opt/
    wget -O init-nginx-deb.sh http://www.linode.com/docs/assets/704-init-nginx-deb.sh
    mv /opt/init-nginx-deb.sh /etc/init.d/nginx
    chmod +x /etc/init.d/nginx
    /usr/sbin/update-rc.d -f nginx defaults

You can now start, stop, and restart Nginx like any other server daemon.

# Proxying Redmine with Apache

If you're already running Apache on your Linode, you'll need to tell nginx to run on a different port and proxy requests for your Redmine installation back to it. If you're running another web server, you'll need to perform similar steps to modify its configuration to support this. This section is entirely optional, and only applies to Apache users.

Issue the following commands to enable proxy support:

    a2enmod proxy
    a2enmod proxy_http
    /etc/init.d/apache2 restart

Configure an Apache virtualhost for your Redmine installation. The example shown below assumes Apache is configured as recommended in our [Ubuntu 9.10 LAMP guide](/docs/lamp-guides/ubuntu-9-10-karmic/). Remember to replace "12.34.56.78" with your Linode's IP address.

{{< file "/etc/apache2/sites-available/redmine.example.com" apache >}}
<VirtualHost 12.34.56.78:80>
     ServerAdmin support@example.com
     ServerName redmine.example.com

     ProxyPass / http://localhost:8080/

     # Uncomment the line below if your site uses SSL.
     #SSLProxyEngine On
</VirtualHost>

{{< /file >}}


Issue the following commands to enable the site and reload Apache:

    a2ensite redmine.example.com
    /etc/init.d/apache2 reload

Next, you'll need to tell nginx to run on a different port. Edit your nginx configuration file, setting the following value:

{{< file-excerpt "/opt/nginx/conf/nginx.conf" nginx >}}
listen 8080;

{{< /file-excerpt >}}


# Installing and Configuring Redmine

### Obtain Redmine

Check the [Redmine project site](http://www.redmine.org/wiki/redmine/Download) for the link to the current stable SVN stable branch. As of this writing, version 0.9.3 is stable; issue the following commands to check it out.

    mkdir -p /srv/www/redmine.example.com
    cd /srv/www/redmine.example.com/
    svn co svn://rubyforge.org/var/svn/redmine/branches/1.0-stable redmine-1.0

You can use `svn up` from the `redmine` directory to keep it up to date in the future.

### Create and Configure the Database

Switch to the `postgres` user and start up the `psql` shell by issuing the following commands:

    su - postgres
    psql

Issue these commands in the `psql` shell to set up the database for Redmine. Be sure to specify a unique, strong password in place of "changeme".

    CREATE ROLE redmine LOGIN ENCRYPTED PASSWORD 'changeme' NOINHERIT VALID UNTIL 'infinity';
    CREATE DATABASE redmine WITH ENCODING='UTF8' OWNER=redmine TEMPLATE=template0;
    ALTER DATABASE "redmine" SET datestyle="ISO,MDY";
    \q
    exit
    cd redmine

Create the file `config/database.yml` with the following contents:

{{< file "config/database.yml" yaml >}}
production:
  adapter: postgresql
  database: redmine
  host: localhost
  username: redmine
  password: changeme
  encoding: utf8
  schema_search_path: public

{{< /file >}}


Issue the following commands to complete database configuration:

    chmod 600 config/database.yml
    rake config/initializers/session_store.rb
    RAILS_ENV=production rake db:migrate
    RAILS_ENV=production rake redmine:load_default_data

### Configure Email Service

Issue the following commands to install `exim4` and configure it for outgoing Internet email delivery. You can Exim installation if you already have an SMTP server configured that accepts unauthenticated locally sent mail, although you will still need to create Redmin's email configuration file as shown at the end of the section.

    apt-get install exim4
    dpkg-reconfigure exim4-config

Select "internet site" as the type of mail configuration to use:

[![Exim general configuration on Ubuntu 9.10.](/docs/assets/288-exim4-config-1-general.png)](/docs/assets/288-exim4-config-1-general.png)

Specify your systems's fully qualified domain name as the system mail name:

[![Exim system mail name configuration on Ubuntu 9.10.](/docs/assets/289-exim4-config-2-system-mail-name.png)](/docs/assets/289-exim4-config-2-system-mail-name.png)

Enter "127.0.0.1" when asked for the IP address to listen on for SMTP connections. For purposes of allowing Redmine to send mail, we only want to listen on localhost.

[![Exim IP address configuration on Ubuntu 9.10.](/docs/assets/290-exim4-config-3-ip-address.png)](/docs/assets/290-exim4-config-3-ip-address.png)

Enter "localhost.localdomain" and your fully qualified domain name when asked for the list of recipient domains.

[![Exim destination domains configuration on Ubuntu 9.10.](/docs/assets/291-exim4-config-4-destinations.png)](/docs/assets/291-exim4-config-4-destinations.png)

Relay domains and machines should be left blank.

[![Exim relay domains configuration on Ubuntu 9.10.](/docs/assets/292-exim4-config-5-relay-domains.png)](/docs/assets/292-exim4-config-5-relay-domains.png)

[![Exim relay machines configuration on Ubuntu 9.10.](/docs/assets/293-exim4-config-6-relay-machines.png)](/docs/assets/293-exim4-config-6-relay-machines.png)

Specify "No" when asked about DNS queries.

[![Exim DNS queries configuration on Ubuntu 9.10.](/docs/assets/294-exim4-config-7-dns.png)](/docs/assets/294-exim4-config-7-dns.png)

When asked about maildirs versus mbox format, you may choose either. Maildirs are increasingly preferred by many modern mail tools.

[![Exim maildirs or mbox configuration on Ubuntu 9.10.](/docs/assets/295-exim4-config-8-maildirs.png)](/docs/assets/295-exim4-config-8-maildirs.png)

Specify "No" when asked whether to split the configuration into smaller files.

[![Exim config file splitting configuration on Ubuntu 9.10.](/docs/assets/296-exim4-config-9-split.png)](/docs/assets/296-exim4-config-9-split.png)

Enter "root" and an email address at your domain for the postmaster mail query.

[![Exim postmaster configuration on Ubuntu 9.10.](/docs/assets/297-exim4-config-10-postmaster.png)](/docs/assets/297-exim4-config-10-postmaster.png)

Create the file `config/email.yml` and copy in the following contents. Be sure to replace the domain field with your fully qualified domain name.

{{< file "config/email.yml" yaml >}}
production:
  delivery_method: :smtp
  smtp_settings:
    address: 127.0.0.1
    port: 25
    domain: redmine.example.com
    authentication: :none

{{< /file >}}


This completes email configuration for your Redmine installation.

### Final Configuration and Testing

We'll create a "redmine" user to manage the installation. Issue the following commands to set ownership and permissions on your Redmine files, taking care to assign a unique, strong password for the Redmine user:

    adduser redmine
    cd /srv/www/redmine.example.com/
    chown -R redmine:redmine *
    cd redmine
    chmod -R 755 files log tmp public/plugin_assets

Edit the file `/opt/nginx/conf/nginx.conf`, setting the "user" parameter to "redmine":

{{< file-excerpt "/opt/nginx/conf/nginx.conf" nginx >}}
user  redmine;

{{< /file-excerpt >}}


Add a server section after the first example server as follows. If you're proxying to nginx from another web server, be sure to change the `listen` directive to `listen 8080;` instead of the default.

{{< file-excerpt "/opt/nginx/conf/nginx.conf" nginx >}}
server {
     listen 80;
     server_name  redmine.example.com;
     root /srv/www/redmine.example.com/redmine/public/;
     access_log /srv/www/redmine.example.com/redmine/log/access.log;
     error_log /srv/www/redmine.example.com/redmine/log/error.log;
     index index.html;
     location / {
        passenger_enabled on;
        allow all;
     }
}

{{< /file-excerpt >}}


Start nginx:

    /etc/init.d/nginx start

Your Redmine installation should be accessible at `http://redmine.example.com`; if you encounter issues, please refer to your log files for a listing of any errors that may have occurred. The default login is username "admin" and password "admin". Congratulations, you've installed Redmine for project management on your Linode!

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the Redmine project issue queue and news feed to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Redmine News Feed](http://www.redmine.org/projects/redmine/issues)
-   [Redmine Issue Queue](http://www.redmine.org/projects/redmine/news)

When upstream sources offer new releases, repeat the instructions for installing Redmine software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Redmine Guide](http://www.redmine.org/wiki/redmine/Guide)



