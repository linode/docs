---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and Perl-FastCGI on Arch Linux.'
keywords: ["perl fastcgi arch linux", "fastcgi", "nginx arch linux", "nginx arch", "nginx perl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/perl-fastcgi/arch-linux/','websites/nginx/nginx-and-perlfastcgi-on-arch-linux/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2011-02-03
title: 'Nginx and Perl-FastCGI on Arch Linux'
---



The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it capable of handling dynamically generated content. The process described in this document centers on the deployment of a FastCGI wrapper for CGI. This makes it possible to deploy all dynamic content that communicates using the CGI protocol. Typically this kind of script is written in Perl, but other CGI scripts will be compatible with this solution.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following command to install the required packages from the Arch Linux repositories:

    pacman -Sy
    pacman -S pacman
    pacman -S nginx fcgi fcgiwrap spawn-fcgi

Edit the `/etc/rc.conf` file, adding "nginx" and "fcgiwrap" to the "DEAMONS=" line as shown in the following excerpt:

{{< file-excerpt "/etc/rc.conf" >}}
DAEMONS=(syslog-ng network netfs crond sshd ntpd nginx fcgiwrap)

{{< /file-excerpt >}}


# Configure the FastCGI Wrapper

Now, edit the `/etc/conf.d/fcgiwrap` file to resemble the following example:

{{< file "/etc/conf.d/fcgiwrap" >}}
SPAWNER='/usr/bin/spawn-fcgi'
FCGI_ADDRESS='127.0.0.1'
FCGI_PORT='9001'
FCGI_USER='http'
FCGI_GROUP='http'
FCGI_EXTRA_OPTIONS=''
SPAWNER_ARGS="-a $FCGI_ADDRESS -p $FCGI_PORT -u $FCGI_USER -g $FCGI_GROUP $FCGI_EXTRA_OPTIONS -- /usr/sbin/fcgiwrap"

{{< /file >}}


Issue the following command to start the FastCGI wrapper for the first time:

    /etc/rc.d/fcgiwrap start

# Configure Virtual Hosting

Create directories for your web content and logs by issuing the following commands. Be sure to replace "example.com" with your domain name.

    mkdir -p /srv/http/example.com/public_html
    mkdir /srv/http/example.com/logs

Issue the following commands to create nginx virtual host directories:

    mkdir /etc/nginx/conf/sites-available
    mkdir /etc/nginx/conf/sites-enabled

Create a virtual host configuration file for your site. Be sure to replace "example.com" with your domain name in the following example configuration.

{{< file "/etc/nginx/conf/sites-available/www.example.com" nginx >}}
server {
    listen   80;
    server_name example.com www.example.com;
    access_log /srv/http/example.com/logs/access.log;
    error_log /srv/http/example.com/logs/error.log;

    location / {
        root   /srv/http/example.com/public_html;
        index  index.html index.htm;
    }

    location ~ \.cgi$ {
        gzip off;
        include fastcgi_params;
        fastcgi_pass  127.0.0.1:9001;
        fastcgi_index index.cgi;
        fastcgi_param  SCRIPT_FILENAME  /srv/http/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


This example assumes that all CGI scripts will end with the characters `.cgi`. If your scripts have some other extension (e.g. `.pl` or `.plx`) modify the example to support that. If you want nginx to use the CGI script as an index page, add `index.cgi` to the `index` line of the `location /` block.

Issue the following commands to enable your new virtual host:

    cd /etc/nginx/conf/sites-enabled/
    ln -s /etc/nginx/conf/sites-available/www.example.com

Edit the file `/etc/nginx/conf/nginx.conf`, inserting the line `include /etc/nginx/conf/sites-enabled/*;` at the start of the `http {` block, as shown in the following file excerpt:

{{< file-excerpt "/etc/nginx/conf/nginx.conf" nginx >}}
http {

    include /etc/nginx/conf/sites-enabled/*;

{{< /file-excerpt >}}


Issue the following command to start nginx:

    /etc/rc.d/nginx start

# Test Perl with FastCGI

Create a file called "test.cgi" in your site's "public\_html" directory with the following contents:

{{< file "/srv/http/example.com/public\\_html/test.cgi" perl >}}
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

    chmod a+x /srv/http/example.com/public_html/test.cgi

When you visit `http://www.example.com/test.cgi` in your browser, your Perl environment variables should be shown. Congratulations, you've configured the nginx web server to use Perl with FastCGI for dynamic content!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [Perl Documentation](http://perldoc.perl.org/)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
