---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and Perl-FastCGI on Fedora 14.'
keywords: ["nginx", "nginx fedora 14", "nginx fastcgi", "nginx perl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/perl-fastcgi/fedora-14/','websites/nginx/nginx-and-perlfastcgi-on-fedora-14/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2011-01-07
title: 'Nginx and Perl-FastCGI on Fedora 14'
---



The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with Perl and FastCGI on your Fedora 14 system.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following commands to update your system and install the nginx web server and compiler tools (Perl should already be installed):

    yum update
    yum install nginx wget fcgi-perl
    chkconfig --add nginx
    chkconfig --level 35 nginx on
    /etc/init.d/nginx start

# Configure Your Site

In this guide, the domain "example.com" will be used as an example. You should substitute your own domain name in the configuration steps that follow. First, create directories to hold your content and log files:

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


Next, define your site's virtual host file:

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
    /etc/init.d/nginx restart

You may wish to create a test HTML page under `/srv/www/www.example.com/public_html/` and view it in your browser to verify that nginx is properly serving your site (Perl will not work yet). Please note that this will require an [entry in DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager) pointing your domain name to your Linode's IP address (found on the "Remote Access" tab in the [Linode Manager](http://manager.linode.com//)).

# Configure FastCGI Wrapper

First create the FastCGI wrapper script (credit: [Denis S. Filimonov](http://www.ruby-forum.com/topic/145858)) at `/usr/bin/fastcgi-wrapper.pl` with the following contents:

{{< file-excerpt "/usr/bin/fastcgi-wrapper.pl" perl >}}
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

{{< /file-excerpt >}}


Then create an init script to control the FastCGI process that matches the one shown below:

{{< file-excerpt "/etc/rc.d/init.d/perl-fastcgi" bash >}}
#!/bin/sh
#
# nginx – this script starts and stops the nginx daemon
#
# chkconfig: - 85 15
# description: Nginx is an HTTP(S) server, HTTP(S) reverse \
# proxy and IMAP/POP3 proxy server
# processname: nginx
# config: /opt/nginx/conf/nginx.conf
# pidfile: /opt/nginx/logs/nginx.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

perlfastcgi="/usr/bin/fastcgi-wrapper.pl"
prog=$(basename perl)

lockfile=/var/lock/subsys/perl-fastcgi

start() {
    [ -x $perlfastcgi ] || exit 5
    echo -n $"Starting $prog: "
    daemon $perlfastcgi
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    stop
    start
}

reload() {
    echo -n $”Reloading $prog: ”
    killproc $nginx -HUP
    RETVAL=$?
    echo
}

force_reload() {
    restart
}
rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload}"
        exit 2
    esac

{{< /file-excerpt >}}


Next issue the following commands to make the scripts executable and set the perl-fastcgi process to start on boot:

    chmod +x /usr/bin/fastcgi-wrapper.pl
    chmod +x /etc/rc.d/init.d/perl-fastcgi
    /etc/rc.d/init.d/perl-fastcgi start
    chkconfig --add perl-fastcgi
    chkconfig perl-fastcgi on

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
- [Installing Nginx on Fedora 14](/docs/web-servers/nginx/installation/fedora-14)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
