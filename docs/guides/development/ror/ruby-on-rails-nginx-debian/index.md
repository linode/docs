---
slug: ruby-on-rails-nginx-debian
description: "This guide shows how to host a Ruby on Rails application on Debian using NGINX and Passenger."
og_description: "This guide shows how to host a Ruby on Rails application on Debian using the NGINX web server and the Passenger app server."
keywords: ["ruby on rails", "ruby on nginx", "rails apps", "debian", "debian 9", " ruby", " nginx"]
tags: ["web applications","debian","nginx","ruby"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/ror/ruby-on-rails-nginx-debian-8/','/development/ror/ruby-on-rails-nginx-debian/','/development/ror/ruby-on-rails-nginx-debian-8/']
modified: 2017-12-28
modified_by:
  name: Jared Kobos
published: 2015-06-25
title: 'Ruby on Rails with NGINX On Debian 9'
external_resources:
 - '[Passenger Official Debian 9 Installation Guide](https://www.phusionpassenger.com/library/install/nginx/install/oss/stretch/)'
 - '[Ruby and Passenger Quickstart](https://www.phusionpassenger.com/library/walkthroughs/start/ruby.html#preparing-the-example-application)'
 - '[Ruby on Rails Home Page](http://rubyonrails.org/)'
 - '[Ruby on Rails Documentation](http://rubyonrails.org/documentation)'
 - '[NGINX Home Page](http://nginx.org/)'
 - '[NGINX Documentation](http://nginx.org/en/docs/)'
 - '[NGINX Configuration](/docs/guides/how-to-configure-nginx/)'
audiences: ["beginner"]
concentrations: ["Web Applications"]
languages: ["ruby"]
relations:
    platform:
        key: ruby-on-rails-nginx
        keywords:
            - distribution: Debian 9
authors: ["Linode"]
---

![Ruby on Rails with nginx on Debian](ruby_on_rails_with_nginx_debian_8_smg.png "Ruby on Rails with nginx on Debian 8")

Ruby on Rails is a web framework that allows web designers and developers to implement dynamic, fully featured web applications. When deploying a Rails app in production, developers can choose from several popular app servers including Puma, Unicorn, and Passenger. This guide will use Passenger, because of its convenient integration with NGINX.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

1.  Follow the [Getting Started](/docs/products/platform/get-started/) and [Securing the Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides, and [set the Linode's hostname](/docs/products/platform/get-started/#setting-the-hostname).

    To check the hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade


## Install Dependencies

1.  Install the system packages required for using Ruby, building Ruby modules, and running Rails applications:

        sudo apt-get install build-essential dirmngr gnupg ruby ruby-dev zlib1g-dev libruby libssl-dev libpcre3-dev libcurl4-openssl-dev rake ruby-rack

### Install Ruby

Use the Ruby Version Manager (RVM) to install Ruby. Be sure to install a Ruby version that is compatible with the version of Rails in your Gemfile. This guide will use Rails 5.1.4 and Ruby 2.4.2.

{{< content "install-ruby-with-rvm" >}}

### Install Rails

Use the Rubygems package manager to install Rails. Replace the version below with the appropriate version for your app:

    gem install rails -v 5.1.4

### Install NGINX And Passenger

1.  Install NGINX:

        sudo apt install nginx

2.  Phusion hosts a repository containing the latest version of Phusion Passenger. To add this to the package manager, first install the Phusion PGP key:

        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
        sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger stretch main > /etc/apt/sources.list.d/passenger.list'

3.  Enable HTTPS support for APT:

        sudo apt-get install apt-transport-https ca-certificates

4.  Update the local package database and install Phusion Passenger:

        sudo apt-get update
        sudo apt-get install libnginx-mod-http-passenger

## Enable Passenger Support and Start NGINX

1.  NGINX is now installed on the system, but support for Phusion Passenger is not enabled. As root, or with the `sudo` command, open the file `/etc/nginx/conf.d/mod-http-passenger.conf` and verify that the following two lines are present and uncommented:

    {{< file "/etc/nginx/conf.d/mod-http-passenger.conf" aconf >}}
passenger_root /usr/lib/ruby/vendor_ruby/phusion_passenger/locations.ini;
passenger_ruby /usr/bin/passenger_free_ruby;
{{< /file >}}

    {{< note respectIndent=false >}}
If the file does not already exist, you will need to create it and add the lines manually.
{{< /note >}}

2.  Restart NGINX:

        sudo systemctl restart nginx

3.  To verify that Passenger support has been installed and enabled correctly:

        sudo passenger-memory-stats

    If Passenger is running, a few running processes should be displayed under the "Passenger processes" section:

    {{< output >}}
----- Passenger processes -----
PID    VMSize    Private  Name
-------------------------------
14337  420.8 MB  1.1 MB   Passenger watchdog
14340  559.3 MB  1.4 MB   Passenger core
14345  292.5 MB  1.2 MB   Passenger ust-router
{{< /output >}}

## Install MySQL Support (Optional)

If the application deployed uses MySQL, install the database server by following our [MySQL on Debian 8](/docs/guides/how-to-install-mysql-on-debian-8/) guide. Once it's installed and configured properly, issue the following command:

    sudo apt-get install libmysqlclient-dev

## Deploy Rails App

1.  Copy your Rails app to your Linode. Navigate to the app's root directory and install any dependencies:

        cd railsapp
        bundle install

2.  Rails requires a JavaScript runtime. Install Node.js:

        sudo curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
        sudo apt install nodejs

    {{< note respectIndent=false >}}
If your Gemfile already includes `therubyracer`, or you have another JavaScript runtime on your system, you can skip this step.
{{< /note >}}

3.  Open `/etc/nginx/sites-available/default` in a text editor and remove `default_server` from the first two lines of the `server` block:

    {{< file "/etc/nginx/sites-available/default" conf >}}
server {
  listen 80;
  listen [::]:80;
   . . .
  {{< /file >}}

4. Since you are using RVM, you will need to specify which version of Ruby should be used by Passenger:

        rvm use
        passenger-config --ruby-command

    The `passenger-config` command will generate several lines of output, similar to:

    {{< output >}}
passenger-config was invoked through the following Ruby interpreter:
  Command: /home/username/.rvm/gems/ruby-2.4.2/wrappers/ruby
  Version: ruby 2.4.2p198 (2017-09-14 revision 59899) [x86_64-linux]
  To use in Apache: PassengerRuby /home/username/.rvm/gems/ruby-2.4.2/wrappers/ruby
  To use in Nginx : passenger_ruby /home/username/.rvm/gems/ruby-2.4.2/wrappers/ruby
  To use with Standalone: /home/username/.rvm/gems/ruby-2.4.2/wrappers/ruby /home/username/.rvm/gems/ruby-2.4.2/gems/passenger-5.1.11/bin/passenger start
{{< /output >}}

    Copy the NGINX line for use in the next step.

5. Configure a new site for your Rails app. Create `/etc/nginx/sites-available/railsapp` in a text editor and add the following content:

    {{< file "/etc/nginx/sites-available/railsapp" conf >}}
server {
  listen 80 default_server;
  server_name 192.0.2.0;
  passenger_ruby /home/path/to/ruby/installation;
  passenger_enabled on;
  root /path/to/app/public;
}
{{< /file >}}

  Set the `server_name` to the public IP address or FQDN of your Linode and replace the `root` path with the path to your Rails application. Paste the output of the `passenger-config` command to replace the `passenger_ruby` line.

6.  Create a symlink to `sites-enabled` to activate the new site:

        sudo ln -s /etc/nginx/sites-available/railsapp /etc/nginx/sites-enabled/railsapp

7.  Restart NGINX:

        sudo systemctl restart nginx

8.  In a web browser, navigate to your Linode's public IP address. Your Rails app should now be live.

## Next Steps

Now that your app is running, consider using build tools such as [Capistrano](https://github.com/capistrano/rails), or continuous integration (CI) tools such as [Travis](https://travis-ci.org/) or [Jenkins](https://jenkins.io/), to speed up your deployment workflow.
