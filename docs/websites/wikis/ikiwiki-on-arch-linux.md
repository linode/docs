---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using Ikiwiki on Arch Linux to power a standard wiki implementation.'
keywords: ["ikiwiki", "ubuntu", "wiki", "perl", "git", "markdown", "lucid"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/wikis/ikiwiki/arch-linux/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2011-02-23
title: Ikiwiki on Arch Linux
---



Ikiwiki is a static website content management system. Originally designed as a wiki "engine", the package is built on top of plain text files and standard revision control components. Ikiwiki also contains support for blogging, an advanced template system, and an extensive plugin system and library that provide users with great flexibility and features. The installation procedure outlined in this document will guide you through deploying an ikiwiki site using [git](/docs/linux-tools/version-control/git) for version control, and either the [Apache](/docs/web-servers/apache/) or [nginx](/docs/web-servers/nginx/) web server.

# Install Ikiwiki

Issue the following commands to update your system's package database and package manager:

    pacman -Sy
    pacman -S pacman

Issue the following command to install required dependencies:

    pacman -S base-devel git perl-text-markdown perl-cgi-session perl-timedate perl-html-parser perl-html-scrubber perl-mail-sendmail perl-time-duration perl-uri perl-html-template perl-locale-gettext perl-yaml xapian-core

Issue the following command sequence to download and build a collection of Perl dependencies:

    cd /opt/
    wget http://aur.archlinux.org/packages/perl-cgi-formbuilder/perl-cgi-formbuilder.tar.gz
    tar -zxvf perl-cgi-formbuilder.tar.gz
    cd /opt/perl-cgi-formbuilder/
    makepkg -sfi --asroot
    cd /opt/
    wget http://aur.archlinux.org/packages/perl-rpc-xml/perl-rpc-xml.tar.gz
    tar -zxvf perl-rpc-xml.tar.gz
    cd /opt/perl-rpc-xml/
    makepkg -sfi --asroot
    cd /opt/
    wget http://aur.archlinux.org/packages/perl-search-xapian/perl-search-xapian.tar.gz
    tar -zxvf perl-search-xapian.tar.gz
    cd /opt/perl-search-xapian
    makepkg -sfi --asroot
    cd /opt/
    wget http://aur.archlinux.org/packages/perl-crypt-dh/perl-crypt-dh.tar.gz
    tar -zxvf perl-crypt-dh.tar.gz
    cd /opt/perl-crypt-dh
    makepkg -sfi --asroot
    cd /opt/
    wget http://aur.archlinux.org/packages/perl-app-cpanminus/perl-app-cpanminus.tar.gz
    tar -zxvf perl-app-cpanminus.tar.gz
    cd /opt/perl-app-cpanminus
    makepkg -sfi --asroot
    ln -s /usr/bin/vendor_perl/cpanm /usr/bin
    cpanm Net::OpenID::Consumer

Issue the following command sequence to download Ikiwiki:

    cd /opt/
    wget http://aur.archlinux.org/packages/ikiwiki/ikiwiki.tar.gz
    tar -zxvf ikiwiki.tar.gz
    cd /opt/ikiwiki/
    makepkg -sfi --asroot

If you haven't already added an unprivileged system user, create one now. This will be the user that manages your ikiwiki content. Issue the following command, substituting a unique username for "username":

    useradd -m  username

Set the `username` user's password with the following command:

    passwd username

# Install a Web Server

If you have already installed Apache or nginx you can skip this section. For the purposes of this document nginx and Apache are equivalent. The Linode Docs contain extensive documentation of both systems and you should deploy your Ikiwiki site with the server that you are most familiar or comfortable, if you do not already have a web-server installed.

Both of the following subsections assume that you will deploy your ikiwiki site within the top level of the `example.com` virtual host. You will need to modify the domains and file system paths to match your domain name.

### Install Apache

Issue the following command to install Apache:

    pacman -S apache

Edit the `/etc/httpd/conf/httpd.conf` file to uncomment or add the following line:

{{< file-excerpt "/etc/httpd/conf/extra/httpd-vhosts.conf" apache >}}
Include conf/extra/httpd-vhosts.conf

{{< /file-excerpt >}}


Replace the existing example `VirtualHost` configuration examples with one that resembles the following. Modify this example as needed to suit the needs of your deployment:

{{< file-excerpt "/etc/httpd/conf/extra/httpd-vhosts.conf" apache >}}
<VirtualHost *:80>
        ServerAdmin username@example.com
        ServerName example.com
        ServerAlias www.example.com

        DocumentRoot /srv/http/example.com/public_html
        ErrorLog /srv/http/example.com/logs/error.log
        CustomLog /srv/http/example.com/logs/access.log combined

    <Directory /srv/http/example.com/public_html>
           AddHandler cgi-script .cgi
               Options FollowSymLinks +ExecCGI
    </Directory>
</VirtualHost>

{{< /file-excerpt >}}


Issue the following commands to create the required directories and to restart the web server:

    mkdir -p /srv/http/example.com/public_html
    mkdir -p /srv/http/example.com/logs
    chown -R username:username /srv/http/example.com
        /etc/rc.d/http start

You will want to add the `http` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the FastCGI daemon starts following then next reboot cycle.

### Install Nginx

Issue the following command to install Ikiwiki and all dependent packages:

    pacman -S nginx

Issue the following sequence of commands to install and enable support for running CGI scripts:

    pacman -S fcgi fcgiwrap spawn-fcgi
    /etc/rc.d/fcgiwrap start

You will want to add the `fcgiwrap` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the FastCGI daemon starts following then next reboot cycle.

Add an `include` directive to the `/etc/nginx/conf/nginx.conf` file so that nginx will read configuration files in the `/etc/nginx/conf.d/` directory. Use the following form:

{{< file-excerpt "/etc/nginx/conf/nginx.conf" nginx >}}
http {
    include       /etc/nginx/conf.d/*.conf;
    include       mime.types;
    default_type  application/octet-stream;

{{< /file-excerpt >}}


Issue the following command to create a `conf.d/` directory:

    mkdir /etc/nginx/conf.d/

Create a virtual host by inserting a version of the following excerpt into your nginx configuration. Modify this example for the needs of your deployment:

{{< file-excerpt "/etc/nginx/conf.d/vhost.conf" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/http/example.com/logs/access.log;
    error_log /srv/http/example.com/logs/error.log;

    location / {
    root   /srv/http/example.com/public_html;
    index  index.html index.htm;
    }

    location ~ \.cgi$ {
    gzip off;
    include /etc/nginx/conf/fastcgi_params;
    fastcgi_pass  127.0.0.1:9001;
    fastcgi_index index.cgi;
    fastcgi_param  SCRIPT_FILENAME  /srv/http/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file-excerpt >}}


Issue the following commands to create the required directories and to restart the web server:

    mkdir -p /srv/http/example.com/public_html
    mkdir -p /srv/http/example.com/logs
    chown -R username:username /srv/http/example.com
    /etc/rc.d/nginx start

You will want to add the `nginx` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the nginx process starts following then next reboot cycle.

# Configure Ikiwiki

Issue the following commands to create a `~/wiki/` directory as a git repository. All files related to your wiki will be located here, including the source files for the wiki, all templates, and the configuration file. Substitute the username you created at the beginning of this guide for "username." :

    mkdir -p /srv/git/wiki.git
    chown username:users /srv/git/wiki.git
    su - username
    mkdir -p ~/wiki ~/wiki/source/ ~/wiki/.ikiwiki/
    cd ~/wiki
    git init
    cd /srv/git/wiki.git/
    git init --bare

Add the following excerpt to `~/wiki/.git/config`:

{{< file-excerpt "~/wiki/.git/config" >}}
[remote "origin"]
    fetch = +refs/heads/*:refs/remotes/origin/*
    url = /srv/git/wiki.git

[branch "master"]
    remote = origin
    merge = refs/heads/master

{{< /file-excerpt >}}


Configure the `username` user's identity within git. Modify the following model for your user:

    git config --global user.email "username@example.com"
    git config --global user.name "username example"

Issue the following commands to copy the default `basewiki` and `templates` to the `~/wiki` directory, download a [sample ikiwiki configuration file](/docs/assets/694-ikiwiki.yaml), and create an initial commit in the `~/wiki` repository:

    cd ~/wiki
    cp -R /usr/share/ikiwiki/templates ~/wiki/
    cp -R /usr/share/ikiwiki/basewiki ~/wiki/
    wget -O ikiwiki.yaml http://www.linode.com/docs/assets/694-ikiwiki.yaml
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



