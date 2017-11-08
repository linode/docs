---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and Perl-FastCGI on Debian 5 (Lenny).'
keywords: ["nginx", "fastcgi perl", "nginx debian", "nginx fastcgi", "nginx perl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/perl-fastcgi/debian-5-lenny/','websites/nginx/nginx-and-perlfastcgi-on-debian-5-lenny/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2009-12-16
title: 'Nginx and Perl-FastCGI on Debian 5 (Lenny)'
---



The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with Perl and FastCGI.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following commands to update your system and install the nginx web server and compiler tools (Perl should already be installed):

    apt-get update
    apt-get upgrade
    apt-get install nginx build-essential psmisc wget libfcgi-perl
    /etc/init.d/nginx start

# Configure Virtual Hosting

In this guide, the domain "example.com" is used as an example site. You should substitute your own domain name in the configuration steps that follow. First, create directories to hold content and log files:

    mkdir -p /srv/www/www.example.com/public_html
    mkdir /srv/www/www.example.com/logs
    chown -R www-data:www-data /srv/www/www.example.com

Next, you'll need to define the site's virtual host file:

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;

    location / {
        root   /srv/www/www.example.com/public_html;
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
    /etc/init.d/nginx restart

You may wish to create a test HTML page under `/srv/www/www.example.com/public_html/` and view it in your browser to verify that nginx is properly serving your site (Perl will not work yet). Please note that this will require an [entry in DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager) pointing your domain name to your Linode's IP address (found on the "Remote Access" tab in the [Linode Manager](http://manager.linode.com//)).

# Configure FastCGI Wrapper

Issue the following command sequence to download the FastCGI wrapper script (credit: [Denis S. Filimonov](http://www.ruby-forum.com/topic/145858)) and an init script to control the FastCGI process, set the permissions, launch the wrapper for the first time, and ensure that FastCGI launches at startup:

    cd /opt/
    wget -O fastcgi-wrapper http://www.linode.com/docs/assets/671-fastcgi-wrapper.sh
    wget -O init-deb.sh http://www.linode.com/docs/assets/670-init-deb.sh
    mv /opt/fastcgi-wrapper /usr/bin/fastcgi-wrapper.pl
    mv /opt/init-deb.sh /etc/init.d/perl-fastcgi
    chmod +x /usr/bin/fastcgi-wrapper.pl
    chmod +x /etc/init.d/perl-fastcgi
    update-rc.d perl-fastcgi defaults
    /etc/init.d/perl-fastcgi start

# Test Perl with FastCGI

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

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [Perl Documentation](http://perldoc.perl.org/)
- [Installing Nginx on Debian 5 (Lenny)](/docs/web-servers/nginx/installation/debian-5-lenny)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
