---
author:
  name: Linode
  email: docs@linode.com
description: An introductory guide to deploying applications with the Seaside Framework
keywords: ["seaside", "smalltalk", "pharo", "squeak", "apache", "framework"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/seaside/','websites/frameworks/deploy-smalltalk-applications-with-seaside/']
modified: 2013-09-27
modified_by:
  name: Linode
published: 2010-01-12
title: Deploy Smalltalk Applications with Seaside
deprecated: true
---

Seaside is a web development framework for the Smalltalk programing language. Seaside offers web developers a number of unique capabilities to create unique applications in an entirely object oriented manner. Seaside also provides helpful abstractions that allow developers to forgo manually generating HTML or managing URL callbacks. This also makes it possible for developers to design applications around user sessions rather than around pages.

Seaside is built in the Pharo implementation of Smalltalk, and is distributed in an image format. In this manner, you can install, run and develop your Seaside application on your local machine. When you have developed your application and are ready to deploy it, upload the image to your Linode. To provide access to Seaside applications, a larger front-end web server like Apache is used to proxy connections back to the Seaside application.

The architecture and scaling of websites developed with Seaside is highly dependent upon your site, and there are a number of approaches. Most common approaches use a number of images running in parallel in combination with a load balancing front-end server that provides "sticky sessions" to ensure that data and session information is preserved for data. Unlike many other web frameworks, Seaside does not store data in an external database server and instead uses a process of image snapshots which provide data persistence.

This document provides an overview of getting started with this Smalltalk web development framework. For the purposes of this example we've deployed Seaside and the "Pier" content management system on a Debian 5 (Lenny) system. Because of the image-based nature of Smalltalk environments, the strategies and approaches for running Seaside applications may not vary between distributions much. Nevertheless, there may be some differences regarding the names of packages and configuration details for the web server. Other details should remain the same between various operating system distributions.

Before proceeding with Seaside and Smalltalk installations, we assume that you have followed our [getting started guide](/docs/getting-started/). You'll also need to install [Apache](/docs/web-servers/apache/) in order to serve your Seaside application. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). One final disclaimer: the Smalltalk virtual machines are all built against 32-bit architectures, so for the best performance, do not deploy a 64-bit image with your Linode.

# Installing Smalltalk Environments

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Most of the programing for your Smalltalk application will occur on your local system. Once you've developed your image to a point where you're comfortable uploading the code base to a production environment, follow these steps to deploy your application.

First, we need to install the virtual machine to run the Smalltalk images. While Debian provides the Squeak Virtual Machine in the `squeak-vm` package, we're going to use the binaries for the Pharo virtual machine. We'll install the necessary binaries in the `/opt/` hierarchy. Issue the following commands:

    apt-get install unzip libfreetype6
    cd /opt
    wget http://gforge.inria.fr/frs/download.php/24736/pharo-vm-0.15.2f-linux.zip
    unzip pharo-vm-0.15.2f-linux.zip
    mv pharo-vm-0.15.2f-linux/ pharo-vm-15-2/

[Upload the image file](/docs/tools-reference/linux-system-administration-basics#upload-files-to-a-remote-server) of your Seaside application. For the purposes of this guide we will use the image produced by the "Pier" Content Management System. We'll store the application image in the directory beneath `/srv/www/` for the specific virtual host: in this example, we'll use `/srv/www/example.com/`. To download the ready-made image for Pier use the following sequence of commands:

    cd /srv/www/example.com/
    wget http://pier.googlecode.com/files/Pier-1.2.app.zip
    unzip Pier-1.2.app.zip
    mv Pier-1.2.app/ pier-app-1.2/

Whenever downloading images and executables directly from upstream providers, it is important to maintain up to date versions of your software. Make sure you're downloading the latest versions of the software to avoid running into solved bugs and security vulnerabilities.

To start the Seaside application, use this command, altering the path to designate the location of your Smalltalk image as necessary. In these examples we use the `-headless` option to allow the Seaside image to run without a local graphical environment. In this example we initiate the `Pier` image downloaded above.

    /opt/pharo-vm-15-2/squeak -vm-display-null /srv/www/example.com/pier-app-1.2/Contents/Resources/pier.image

To test the Seaside application, access your domain in the browser on port `8080`:

    http://example.com:8080/seaside/

In this configuration, the Squeak VM instances run in the current terminal session. For production situations we recommend running your Smalltalk images in [GNU Screen](/docs/tools-reference/ssh/using-the-terminal#gnu-screen). To stop the current instance, simply hit "ctrl-c".

The default configuration of the "Pier" image accessed above binds the Smalltalk server on port `8080` on both the local and the public interface. Ensure that both your application and system firewalls are configured to permit proper access prior to deployment. We're now ready to configure Apache to provide public access to your Smalltalk instance.

# Configuring Apache

The manner in which you architect your Seaside-based application is quite dependent upon the demands of your deployment. The following approaches cover basic practices for making your Seaside application accessible over the network.

Most of the configuration of Seaside occurs within a fully graphical Smalltalk interface. Apache requires some additional dependencies in order to run with Smalltalk. You will need to ensure that `mod_proxy` is enabled along with the `mod_http_proxy` library. Issue the following command to effect this change:

    a2enmod proxy proxy_http

In addition to enabling mod\_proxy, you'll need to allow localhost to access the proxy. In `/etc/apache2/mods-enabled/proxy.conf`, add "Allow from localhost" in the `<Proxy *>` block:

{{< file "/etc/apache2/mods-enabled/proxy.conf" apache >}}
<IfModule mod_proxy.c>
        #turning ProxyRequests on and allowing proxying from all may allow
        #spammers to use your proxy to send email.

        ProxyRequests Off

        <Proxy *>
                AddDefaultCharset off
                Order deny,allow
                Allow from localhost
        </Proxy>

        # Enable/disable the handling of HTTP/1.1 "Via:" headers.
        # ("Full" adds the server version; "Block" removes all outgoing Via: he$
        # Set to one of: Off | On | Full | Block

        ProxyVia On
</IfModule>

{{< /file >}}


In order to configure Apache to serve static content, you'll need to enable `mod_rewrite`. Run the following command to enable `mod_rewrite`:

    a2enmod rewrite

For higher volume deployments and architectures you may want to configure and use `mod_proxy_balancer`. Use the following command:

    a2enmod proxy_balancer

These are the only non-Smalltalk requirements. If your applications requires any additional dependencies you should install them at this juncture. After adding these modules, restart the Apache server with the following command:

    /etc/init.d/apache2 restart

# Case One: Independent Virtual Hosts

### Configuring Apache to Serve Static Content

In addition to configuring Apache to pass requests for dynamic content to the Smalltalk virtual machine, it's a very good idea to allow Apache to serve static content separately from the dynamic content generated by Seaside. It's much more efficient to distribute static content directly from Apache, or some other dedicated web server, so that Seaside and the Smalltalk virtual machine aren't burdened with this rote task.

In this first approach, we'll set up a separate sub-domain and virtual host for static content. Initially both hosts can operate on the machine. However, when you need to scale you can easily move the dynamic content onto a separate server without affecting functionality. By static content, we mean images, sound files, Flash, and in some cases base CSS files.

With Apache installed, create the following Virtual Host file. Typically these are located in the `/etc/apache2/sites-available/` directory, and named by convention with the name of the virtual host (e.g. `static.example.com`). Be sure to change the `VirtualHost` IP to the IP of your Linode.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
     ServerAdmin admin@example.com
     ServerName static.example.com
     DocumentRoot /srv/www/static.example.com/public_html/
     ErrorLog /srv/www/static.example.com/logs/error.log
     CustomLog /srv/www/static.example.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Create the necessary directories by issuing the following commands:

    mkdir -p /srv/www/static.example.com/public_html/
    mkdir -p /srv/www/static.example.com/logs/

Enable the virtual host with the following command. Remember to replace `static.example.com` with the name of the virtual host file:

    a2ensite static.example.com

Reload the web server configuration to create the virtual host:

    /etc/init.d/apache2 reload

When building your application point, ensure all static content is served from URLs that begin with `http://static.example.com/` and the files are located at `/srv/www/static.example.com/public_html/`. You must create an [A Record](/docs/networking/dns/dns-records-an-introduction#types-of-dns-records) that points to the domain of your Linode for `static.example.com` domain.

### Configuring Apache to Proxy Dynamic Requests to Seaside

Seaside applications are all provided by a server running inside the Smalltalk instance. The Apache web server functions as a front end and proxies requests for dynamic content to the Seaside instance. When you've confirmed that the Smalltalk server is responding on `localhost` port `8080`, create the following `VirtualHost`. Remember to change the IP to the IP of your Linode.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
    ProxyPreserveHost On
    ServerName example.com
    ServerAlias www.example.com

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    RewriteEngine On
    RewriteRule ^/(.*)$ http://localhost:8080/seaside/lollipop/$1 [proxy,last]

{{< /file-excerpt >}}


    > \</VirtualHost\>

Alter the path in the `RewriteRule` to match the location and port of your application in this case, for the URL `http://localhost:8080/seaside/lollipop/` the application is located at `seaside/lollipop/` running on `localhost` port number 8080.

Your application may require additional rewrite rules and configuration. If you're running Pier, for example, you will want to use the following set of `Rewrite` specifications:

{{< file-excerpt "Apache Rewrite Rules" apache >}}
RewriteEngine On
RewriteRule ^/seaside/pier(.*)$ http://example.net$1 [redirect,last]
RewriteRule ^/seaside/files/(.*)$ http://localhost:8080/seaside/files/$1 [proxy,last]
RewriteCond /srv/www/example.net/public_html/%{REQUEST_seaFILENAME} !-f
RewriteRule ^/(.*)$ http://localhost:8080/seaside/pier/$1 [proxy,last]

{{< /file-excerpt >}}


In addition, your application may require some extra configuration. Pier requires the hostname to be defined in its control panel as well as in the Seaside control panel. If you're using software written by a third-party, it's best that you follow their specific instructions.

# Case Two: Serve Static and Dynamic Content with One Virtual Host

In this example, all content is provided by the same virtual host. The web server looks for static content in the `DocumentRoot`, and if it finds nothing there it hands the request to the Smalltalk server to provide the dynamic content. Modify your virtual host configuration file to resemble the following. Change the `VirtualHost` IP to the IP of your Linode.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
    ProxyPreserveHost On
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /srv/www/example.com/public_html/

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    RewriteEngine On
    RewriteCond /srv/www/example.com/public_html%{REQUEST_FILENAME} !-f
    RewriteRule ^/(.*)$ http://localhost:8080/seaside/lollipop/$1 [proxy,last]

{{< /file-excerpt >}}


    > \</VirtualHost\>

The `!-f` option at the end of the `RewriteCond` rule tells Apache to only apply the following `RewriteRule` if there isn't a file found that matches the request.

Your application may require additional rewrite rules and configuration. If you're running Pier, for example, you will want to use the following set of `Rewrite` specifications:

{{< file-excerpt "Apache Rewrite Rules" apache >}}
RewriteEngine On
RewriteRule ^/seaside/pier(.*)$ http://example.net$1 [redirect,last]
RewriteRule ^/seaside/files/(.*)$ http://localhost:8080/seaside/files/$1 [proxy,last]
RewriteCond /srv/www/example.net/public_html/%{REQUEST_seaFILENAME} !-f
RewriteRule ^/(.*)$ http://localhost:8080/seaside/pier/$1 [proxy,last]

{{< /file-excerpt >}}


In addition, your application may require some extra configuration. Pier requires the hostname to be defined in its control panel, as well as in the Seaside control panel. If you're using software written by a third-party, it's best that you follow their specific instructions.

# Configure Apache Proxy Cluster

In this example, we scale our Seaside deployment by providing Apache with multiple Seaside images running in parallel. In this setup, each Seaside instance runs on successive ports. This must be configured inside of the Seaside image. This configuration sets a `stickysession` cookie which allows users to maintain consistent connections to the same Smalltalk image. The various instances of your application will need to be configured to share information, so that updates to one image will be passed to other images. Alternatively, your application may be designed so that user experience will be unaffected by which back-end server they access.

This example expounds on the previous approach, where static content was served directly from Apache and dynamic content is passed to Seaside. Consider the following configuration example:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
    ProxyPreserveHost On
    ServerName example.com
    ServerAlias www.example.com
    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined

    DocumentRoot /srv/www/example.com/public_html/
    <Directory /srv/www/example.com/public_html>
       Order deny,allow
       Allow from all
    </Directory>

    ProxyPass / balancer://cluster/ lbmethod=byrequests
    ProxyPassReverse / balancer://cluster/
    <Proxy balancer://cluster>
       BalancerMember http://localhost:8080/seaside/appname/ smax=5 route=seaside1
       BalancerMember http://localhost:8081/seaside/appname/ smax=5 route=seaside2
       BalancerMember http://localhost:8082/seaside/appname/ smax=5 route=seaside3
    </Proxy>

    RewriteEngine On
    RewriteCond /srv/www/example.com/public_html%{REQUEST_FILENAME} !-f
    RewriteRule  ^/(.*)$ $1 [CO=BALANCEID:balancer.seaside1]
    RewriteRule  ^/(.*)$ $1 [CO=BALANCEID:balancer.seaside2]
    RewriteRule  ^/(.*)$ $1 [CO=BALANCEID:balancer.seaside3]

{{< /file-excerpt >}}


    > \</VirtualHost\>

In this example there are a couple of specific settings that you may need to modify based on the nature of your deployment. The most important value is the `smax` value set in the `BalancerMember` declarations. This value creates a "soft maximum" number of connections; any active connections greater than this number are subject to a timeout. You can set hard maximums by specifying a `max=` value as part of this declaration.

You can specify as many members of the balancing cluster as you need. `mod_proxy_balancer` makes it possible to balance requests among a pool that includes services running on both the local machine and/or various remote locations. It's common to run services on a number of distinct machines and proxy requests over the private network connections. Regardless of the actual architecture of deployment, ensure that each `BalancerMember` directive has a unique `route=` id, and that there is a corresponding `RewriteRule` with a final identifier that matches each of the previously created routes.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Seaside Book](http://book.seaside.st/book/)
- [Squeak Source](http://www.squeaksource.com/)
- [Squeak](http://www.squeak.org/)
- [Unix Squeak](http://squeakvm.org/unix/)
- [Pharo](http://www.pharo-project.org/home)
- [Pharo By Example](http://www.pharobyexample.org/)
- [Pier CMS](http://www.piercms.com/)
- [Apache Documentation for mod\_proxy\_balancer](http://httpd.apache.org/docs/2.2/mod/mod_proxy_balancer.html)



