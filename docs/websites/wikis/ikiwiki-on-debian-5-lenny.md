---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use Ikiwiki on Debian to power a standard wiki implementation.'
keywords: ["ikiwiki debian lenny", "ikiwiki debian 5", "ikiwiki", "wiki", "perl", "git", "markdown", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/wikis/ikiwiki/debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-01-31
title: 'Ikiwiki on Debian 5 (Lenny)'
---



Ikiwiki is a static website content management system. Originally designed as a wiki "engine", the package is built on top of plain text files and standard revision control components. Ikiwiki also contains support for blogging, an advanced template system, and an extensive plugin system and library that provide users with great flexibility and features. The installation procedure outlined in this document will guide you through deploying an ikiwiki site using [git](/docs/linux-tools/version-control/git) for version control, and either the [Apache](/docs/web-servers/apache/) or [nginx](/docs/web-servers/nginx/) web server.

# Basic System Configuration

Issue the following commands to set your system hostname, substituting a unique value for "hostname":

    echo "hostname" > /etc/hostname
    hostname -F /etc/hostname

Edit your `/etc/hosts` file to resemble the following, substituting your Linode's public IP address for 12.34.56.78, your hostname for "hostname", and your primary domain name for "example.com".

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 hostname.example.com hostname

{{< /file >}}


If you haven't already added an unprivileged system user, create one now. This will be the user that manages your ikiwiki content. Issue the following command, substituting a unique username for "username":

    adduser username

As with all user accounts, be sure assign a strong password consisting of letters, numbers, and other characters.

# Install Ikiwiki

To install the current version of Ikiwiki on Debian 5 (Lenny), you must install several packages from the [Backports project](http://backports.debian.org). Insert the following line in your `/etc/apt/sources.list` file:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://backports.debian.org/debian-backports lenny-backports main

{{< /file-excerpt >}}


Issue the following commands to update your system's package database and all installed packages, and install the backports repository key:

    apt-get update
    apt-get upgrade
    apt-get install debian-backports-keyring

Add the following snippet to the `/etc/apt/preferences` file:

{{< file-excerpt "/etc/apt/preferences" >}}
Package: ikiwiki
Pin: release a=lenny-backports
Pin-Priority: 999

Package: libnet-openid-consumer-perl
Pin: release a=lenny-backports
Pin-Priority: 999

Package: liburi-perl
Pin: release a=lenny-backports
Pin-Priority: 999

{{< /file-excerpt >}}


Issue the following command to install Ikiwiki and other required software:

    apt-get install ikiwiki git-core build-essential libcgi-session-perl libcgi-formbuilder-perl libnet-openid-consumer-perl libyaml-perl xapian-omega libsearch-xapian-perl libmath-bigint-gmp-perl

# Install and Configure a Web Server

Both of the following subsections assume that you will deploy your ikiwiki site within the top level of the `example.com` virtual host. You will need to modify the domains and file system paths to match your domain name.

### Install Apache

Issue the following command to install Apache:

    apt-get install apache2

Create a virtual host that resembles the following example. Be sure to substitute your own domain name for "example.com".

{{< file "/etc/apache2/sites-available/www.example.com" apache >}}
<VirtualHost *:80>
    ServerAdmin username@example.com
    ServerName example.com
    ServerAlias www.example.com

    DocumentRoot /srv/www/example.com/public_html
    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    AddHandler cgi-script .cgi
    Options FollowSymLinks +ExecCGI
</VirtualHost>

{{< /file >}}


Issue the following commands to create the required directories, enable the site, and restart the web server. Replace "example.com" with your own domain name, and "username" with the username you created at the beginning of this guide:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs
    chown -R username:username /srv/www/example.com
    a2ensite www.example.com
    /etc/init.d/apache2 restart

### Install Nginx

If you've already installed Apache, or another web server, please skip this section. Issue the following command to install nginx and all dependent packages:

    apt-get install nginx libfcgi-perl

Create a filed named `/usr/bin/fastcgi-wrapper.pl` with the following contents:

{{< file "/usr/bin/fastcgi-wrapper.pl" perl >}}
#!/usr/bin/perl

use FCGI;
use Socket;
use POSIX qw(setsid);

require 'syscall.ph';

&daemonize;

# this keeps the program alive or something after exec'ing perl scripts
END() { } BEGIN() { }
*CORE::GLOBAL::exit = sub { die "fakeexit\nrc=".shift()."\n"; };
eval q{exit};
if ($@) {
    exit unless $@ =~ /^fakeexit/;
};

&main;

sub daemonize() {
    chdir '/'                 or die "Can't chdir to /: $!";
    defined(my $pid = fork)   or die "Can't fork: $!";
    exit if $pid;
    setsid                    or die "Can't start a new session: $!";
    umask 0;
}

sub main {
        $socket = FCGI::OpenSocket( "127.0.0.1:8999", 10 ); #use IP sockets
        $request = FCGI::Request( \*STDIN, \*STDOUT, \*STDERR, \%req_params, $socket );
        if ($request) { request_loop()};
            FCGI::CloseSocket( $socket );
}

sub request_loop {
        while( $request->Accept() >= 0 ) {

           #processing any STDIN input from WebServer (for CGI-POST actions)
           $stdin_passthrough ='';
           $req_len = 0 + $req_params{'CONTENT_LENGTH'};
           if (($req_params{'REQUEST_METHOD'} eq 'POST') && ($req_len != 0) ){
                my $bytes_read = 0;
                while ($bytes_read < $req_len) {
                        my $data = '';
                        my $bytes = read(STDIN, $data, ($req_len - $bytes_read));
                        last if ($bytes == 0 || !defined($bytes));
                        $stdin_passthrough .= $data;
                        $bytes_read += $bytes;
                }
            }

            #running the cgi app
            if ( (-x $req_params{SCRIPT_FILENAME}) &&  #can I execute this?
                 (-s $req_params{SCRIPT_FILENAME}) &&  #Is this file empty?
                 (-r $req_params{SCRIPT_FILENAME})     #can I read this file?
            ){
        pipe(CHILD_RD, PARENT_WR);
        my $pid = open(KID_TO_READ, "-|");
        unless(defined($pid)) {
            print("Content-type: text/plain\r\n\r\n");
                        print "Error: CGI app returned no output - ";
                        print "Executing $req_params{SCRIPT_FILENAME} failed !\n";
            next;
        }
        if ($pid > 0) {
            close(CHILD_RD);
            print PARENT_WR $stdin_passthrough;
            close(PARENT_WR);

            while(my $s = <KID_TO_READ>) { print $s; }
            close KID_TO_READ;
            waitpid($pid, 0);
        } else {
                    foreach $key ( keys %req_params){
                       $ENV{$key} = $req_params{$key};
                    }
                    # cd to the script's local directory
                    if ($req_params{SCRIPT_FILENAME} =~ /^(.*)\/[^\/]+$/) {
                            chdir $1;
                    }

            close(PARENT_WR);
            close(STDIN);
            #fcntl(CHILD_RD, F_DUPFD, 0);
            syscall(&SYS_dup2, fileno(CHILD_RD), 0);
            #open(STDIN, "<&CHILD_RD");
            exec($req_params{SCRIPT_FILENAME});
            die("exec failed");
        }
            }
            else {
                print("Content-type: text/plain\r\n\r\n");
                print "Error: No such CGI app - $req_params{SCRIPT_FILENAME} may not ";
                print "exist or is not executable by this process.\n";
            }

        }
}

{{< /file >}}


Create a file named `/etc/init.d/perl-fastcgi` with the following contents:

{{< file "/etc/init.d/perl-fastcgi" bash >}}
#!/bin/bash
PERL_SCRIPT=/usr/bin/fastcgi-wrapper.pl
FASTCGI_USER=www-data
RETVAL=0
case "$1" in
    start)
      su - $FASTCGI_USER -c $PERL_SCRIPT
      RETVAL=$?
  ;;
    stop)
      killall -9 fastcgi-wrapper.pl
      RETVAL=$?
  ;;
    restart)
      killall -9 fastcgi-wrapper.pl
      su - $FASTCGI_USER -c $PERL_SCRIPT
      RETVAL=$?
  ;;
    *)
      echo "Usage: perl-fastcgi {start|stop|restart}"
      exit 1
  ;;
esac
exit $RETVAL

{{< /file >}}


Issue the following commands to make the scripts executable and start Perl-FastCGI:

    chmod +x /usr/bin/fastcgi-wrapper.pl
    chmod +x /etc/init.d/perl-fastcgi
    update-rc.d perl-fastcgi defaults
    /etc/init.d/perl-fastcgi start

In this guide, the domain "example.com" is used as an example site. You should substitute your own domain name in the configuration steps that follow, along with substituting the username you created at the beginning of this guide for "username". First, create directories to hold content and log files:

    mkdir -p /srv/www/example.com/public_html
    mkdir /srv/www/example.com/logs
    chown -R username:username /srv/www/example.com

Next, you'll need to define your site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;

    location / {
        root   /srv/www/example.com/public_html;
        index  index.html index.htm;
    }

    location ~ \.cgi$ {
        gzip off;
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:8999;
        fastcgi_index index.pl;
        fastcgi_param  SCRIPT_FILENAME  /srv/www/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


Issue the following commands to enable the site:

    cd /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/www.example.com
    /etc/init.d/nginx restart

# Configure Ikiwiki

Issue the following commands to create a `~/wiki/` directory as a git repository. All files related to your wiki will be located here, including the source files for the wiki, all templates, and the configuration file. Substitute the username you created at the beginning of this guide for "username." :

    mkdir -p /srv/git/wiki.git
    chown username:username /srv/git/wiki.git
    su - username
    mkdir -p ~/wiki ~/wiki/source/ ~/wiki/.ikiwiki/
    cd ~/wiki
    git init
    cd /srv/git/wiki.git/
    git init --bare

Add the following excerpt to `~/wiki/.git/config`:

{{< file-excerpt "~/wiki/.git/config" >}}
[remote "origin"]
    fetch = +refs/heads/*:refs/remotes/origin/* url = /srv/git/wiki.git

[branch "master"]
    remote = origin merge = refs/heads/master

{{< /file-excerpt >}}


Issue the following commands to copy the default `basewiki` and `templates` to the `~/wiki` directory, download a [sample ikiwiki configuration file](/docs/assets/691-ikiwiki.yaml), and create an initial commit in the `~/wiki` repository:

    cd ~/wiki
    cp -R /usr/share/ikiwiki/templates ~/wiki/
    cp -R /usr/share/ikiwiki/basewiki ~/wiki/
    wget -O ikiwiki.yaml http://www.linode.com/docs/assets/691-ikiwiki.yaml
    git add .
    git commit -m "initial ikiwiki commit"
    git push origin master

Edit the `~/wiki/ikiwiki.yaml` file to suit the needs of your deployment, paying particular attention to example directory paths and URLs. You should take care to replace all instances of "example.com" with your domain name, and all instances of "username" with the username you created at the beginning of this guide. You may wish to review the [ikiwiki documentation](http://ikiwiki.info) for more information regarding specific configuration directives. Issue the following commands to commit your changes and push them:

    git commit ~/wiki/ikiwiki.yaml -m "edited ikiwiki yaml config"
    git push origin master

Create content in the `~/wiki/source/index.mdwn` file, for example:

{{< file "~/wiki/source/index.mdwn" >}}
# Welcome to $wiki

Hello World. What should we call [[this site]]?

{{< /file >}}


When the configuration file has been edited, and there is content in the `~/wiki/source/index.mdwn` file, issue the following command to rebuild the wiki:

    ikiwiki --setup ~/wiki/ikiwiki.yaml

Rerun this command any time you edit the `ikiwiki.yaml` file. You can now visit and interact with your wiki directly at `http://example.com/`, or via the git interface by issuing the following command on your local system:

    git clone ssh://example.com:/srv/git/wiki.git

# Administration Notes

The `ikiwiki.cgi` binary and the `post-update` hook need to be able to write and operate on the source repository and wiki destination, as specified in the `ikiwiki.yaml` file. These scripts can be run with "suid" permissions set, which may eliminate some complexity. If your wiki stops regenerating, make sure the file permissions are set correctly. If you are using gitosis or gitolite to manage your git repositories, the git repository user needs to own the ikiwiki scripts and have write access to the repositories and wiki destination.

The directory ikiwiki uses as its source directory (e.g. `~/wiki/source`) and the enclosing repository, should *not* be edited directly. Clone the `/srv/git/wiki.git` repository and allow ikiwiki to refresh the source repository following "push" operations.

Some functions for viewing wiki histories and recent changes are dependent upon setting up and configuring the "git-web" package, which is outside of the scope of this document.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Ikiwiki Home Page](http://ikiwiki.info)
- [Example Ikiwiki Deployments](http://ikiwiki.info/ikiwikiusers/)



