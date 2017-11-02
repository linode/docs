---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and Perl-FastCGI on Fedora 12.'
keywords: ["nginx", "nginx fedora 12", "nginx fastcgi", "nginx perl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/perl-fastcgi/fedora-12/','websites/nginx/nginx-and-perlfastcgi-on-fedora-12/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-03-11
title: 'Nginx and Perl-FastCGI on Fedora 12'
---



The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with Perl and FastCGI on your Fedora 12 Linode.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

Basic System Configuration
--------------------------

Issue the following commands to set your system hostname, substituting a unique value for "hostname." :

    echo "HOSTNAME=hostname" >> /etc/sysconfig/network
    hostname "hostname"

Edit your `/etc/hosts` file to resemble the following, substituting your Linode's public IP address for 12.34.56.78, your hostname for "hostname," and your primary domain name for "example.com." :

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
12.34.56.78 hostname.example.com hostname

{{< /file >}}


Install Required Packages
-------------------------

Issue the following commands to update your system and install the nginx web server and compiler tools (Perl should already be installed):

    yum update
    yum install nginx make automake gcc gcc-c++ spawn-fcgi wget fcgi-perl
    chkconfig --add nginx
    chkconfig nginx on
    /etc/init.d/nginx start

Configure Virtual Hosting
-------------------------

In this guide, we'll be using the domain "example.com" as our example site. You should substitute your own domain name in the configuration steps that follow. First, we'll need to create directories to hold our content and log files:

    mkdir -p /srv/www/www.example.com/public_html
    mkdir /srv/www/www.example.com/logs
    chown -R nginx:nginx /srv/www/www.example.com

Issue the following commands to create virtual hosting directories:

    mkdir /etc/nginx/sites-available
    mkdir /etc/nginx/sites-enabled

Add the following lines to your `/etc/nginx/nginx.conf` file, immediately after the line for `include /etc/nginx/conf.d/*.conf`:

{{< file-excerpt "/etc/nginx/nginx.conf" >}}
# Load virtual host configuration files.
include /etc/nginx/sites-enabled/*;

{{< /file-excerpt >}}


Next, you'll need to define the site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index  index.html index.htm;
    }

    location ~ \.pl$ {
        gzip off;
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:8999;
        fastcgi_index index.pl;
        fastcgi_param  SCRIPT_FILENAME  /srv/www/www.example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


Issue the following commands to enable the site:

    cd /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/www.example.com
    service nginx restart

You may wish to create a test HTML page under `/srv/www/www.example.com/public_html/` and view it in your browser to verify that nginx is properly serving your site (Perl will not work yet). Please note that this will require an [entry in DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager) pointing your domain name to your Linode's IP address.

Configure FastCGI Wrapper
-------------------------

Issue the following command sequence to download the FastCGI wrapper script (credit: [Denis S. Filimonov](http://www.ruby-forum.com/topic/145858)) and an init script to control the FastCGI process, set the permissions, launch the wrapper for the first time, and ensure that FastCGI launches at startup:

    cd /opt/
    wget -O fastcgi-wrapper http://www.linode.com/docs/assets/642-fastcgi-wrapper.sh
    wget -O init-rpm.sh http://www.linode.com/docs/assets/641-init-rpm.sh
    mv /opt/fastcgi-wrapper /usr/bin/fastcgi-wrapper.pl
    mv /opt/init-rpm.sh /etc/rc.d/init.d/perl-fastcgi
    chmod +x /usr/bin/fastcgi-wrapper.pl
    chmod +x /etc/rc.d/init.d/perl-fastcgi
    /etc/rc.d/init.d/perl-fastcgi start
    chkconfig --add perl-fastcgi
    chkconfig perl-fastcgi on

Test Perl with FastCGI
----------------------

Create a file called "test.pl" in your site's "public\_html" directory with the following contents:

{{< file "/srv/www/www.example.com/public\\_html/test.pl" perl >}}
#!/usr/bin/perl

print "Content-type:text/html\n\n";
print <<EndOfHTML;
<html><head><title>Perl Environment Variables</title></head>
<body>
<h1>Perl Environment Variables</h1>
EndOfHTML

foreach $key (sort(keys %ENV)) {
    print "$key = $ENV{$key}<br>\n";
}

print "</body></html>";

{{< /file >}}


Make the script executable by issuing the following command:

    chmod a+x /srv/www/www.example.com/public_html/test.pl

When you visit `http://www.example.com/test.pl` in your browser, your Perl environment variables should be shown. Congratulations, you've configured the nginx web server to use Perl with FastCGI for dynamic content!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [Perl Documentation](http://perldoc.perl.org/)
- [Installing Nginx on Fedora 12](/docs/web-servers/nginx/installation/fedora-12)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
