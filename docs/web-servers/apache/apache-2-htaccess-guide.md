---
author:
  name: Christopher Piccini
  email: cpiccini11@gmail.com
description: 'This guide will provide you with an in depth guide to the .htaccess file. This tutorial will cover handling permisions, redirects and restricting IP addresses.'
keywords: 'htaccess, apache'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, September 25th, 2017'
modified: Tuesday, September 26th, 2017
modified_by:
  name: Linode
title: 'In-depth Guide to .htaccess'
contributor:
  name: Christopher Piccini
  link: https://twitter.com/chrispiccini11
external_resources:
- '[HTTP Error and Status Codes](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html)'
- '[Apache .htaccess Documentation](https://httpd.apache.org/docs/current/howto/htaccess.html)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

# Introduction
The purpose of this guide is to show you how to setup htaccess configuration (.htaccess) for Apache. The guide will cover topics relating to how to handle web site file structure permissions, redirects and IP restrictions.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  Complete the Apache section in the [Install a Lamp Stack](https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04) to install Apache on your Linode.

{:.note}
> Throughout this guide, replace each instance of `testuser` in this guide with your custom user account. Replace each occurrence of `example.com` with the IP address or Fully Qualified Domain Name (FQDN) of your Linode.

## What is .htaccess
.htaccess is a configuration file that is used on web services that run the Apache web server. It is an extremely powerful tool and can be used to modify the Apache configuration without needing to go in and edit the main Apache configuration files. The following sections describe how to create this configuration and use it to restrict directory listings, handle redirects, and restrict IP addresses.

## Enabling .htaccess use
By default the use of .htaccess is not available. To enable this setup you will need to add a few lines to your configuration file.

1. Use a text editor to open your configuration file.

        sudo nano /etc/apache2/sites-available/example.com.conf

2.  After the closing VirtualHost block (</VirtualHost>) add this.

    {: .file-excerpt}
    /etc/apache2/sites-available/example.com.conf
    :  ~~~
       ....
       </VirtualHost>
       <Directory /var/www/html/example.com/public_html>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
       ~~~
3.  Save the file, then restart apache.

        sudo service apache2 restart


## Restricting Directory Listings

By default, a visitor to your website will be able to view the directory and file structure and have access to files on the web server. This may be okay for some, but it would be best practice to restrict directory access so that a visitor to example.com would have to know the file name or directory they would like to see in order to view it. One way we can restrict this is through .htaccess.

### Creating .htaccess
1.  Many popular CMS systems such as Wordpress create .htaccess configurations by default. This guide assumes that no .htaccess file exists, so you will have to create one manually. Navigate to your site's root directory:

        cd /var/www/html/example.com/public_html

2.  Create an .htaccess file:

    {:.file}
    /var/www/html/example.com/public_html/.htaccess
    : ~~~
      Options -Indexes
      ~~~

3.  Now if you navigate to your site you will see a Forbidden message. You have to specifically indicate the file you would like to see.

## Restricting IP's

This section wil guide you through restricting specific IP's from accessing your site. This can be useful if you want to block certain visitors from visiting your site. You may also want to set this up so that you may only allow certain IP's from accessing certain sections of your site. Perhaps you would like to only allow an IP address that belongs that maps back to an administrator to the administration section of your site.

{:.note}
> Subdirectories can inherit settings from .htaccess files in their parent directories, if they are not overridden by a separate .htaccess file in the subdirectory. The examples in this guide will continue to work with an .htaccess file in the project's root directory; however, you should carefully consider which directory different .htaccess directives should be placed in.

### Deny IP's

1.  Create or edit the .htaccess file located in the web directory where you want this setting to be applied:

        cd /var/www/html/example.com/public_html/
        sudo nano .htaccess

2.  Delete the `Options -Indexes` line from the previous section (if applicable) and add the following lines to deny the target IP addresses:

    {:.file}
    /var/www/html/example.com/public_html
    : ~~~
      order allow,deny

      # This will deny the IP 172.15.23.9
      deny from 172.15.23.9

      # This will deny all IP's from 172.15.23.0 through 172.15.23.255
      deny from 172.15.23
      ~~~

### Allowing IP's

1.  Create or edit the .htaccess file located in the web directory where you want this setting to be applied.

2.  Add the following lines to deny all IP's except for the specific IP and pool of IP's mentioned in command.

    {:.file}
    /var/www/html/example.com/public_html
    : ~~~
      order deny,allow

      # Denies all IP's
      Deny from all

      # This will allow the IP 172.15.23.9
      allow from 172.15.23.9

      # This will allow all IP's from 172.15.23.0 through 172.15.23.255
      allow from 172.15.23
      ~~~

## Handling Redirects

You can redirect traffic using .htaccess configuration. Redirects are needed if you want visitors who are accessing a link on your website that you now want to now access a different page. In the below example we will be updating the .htaccess file for the root directory of our website. We want the redirect to happen if a visitor tries to visit http://example.com/main.html they will be redirected http://example.com/test2/index.html

1.  Create a test html file so that you will have something to redirect to:

        mkdir test1
        sudo touch test1/index.html

2.  Give the test html file some basic content:

    {:.file}
    /var/www/html/example.com/public_html/test1/index.html
    : ~~~
      <!doctype html>
      <html>
        <body>
           This is the html file in test1.
        </body>
      </html>
      ~~~
3.  Reopen the .htaccess file in your project's root directory. Remove all existing configuration in this file and add the following line:

    {:.file}
    /var/www/html/example.com/public_html/.htaccess
    : ~~~
      Redirect 301 /main.html /test1/index.html
      ~~~
   The first parameter after the 'Redirect' command is the HTTP status code. Specifying a status code is helpful for letting the browser know that the page has been moved to a new location. If you leave this parameter blank, it will default to a 302 code, which indicates that the redirect is temporary. Specifying 301 makes it clear that the page at the requested location has permanently moved to a new location.

    The next parameter is the unix path to the file that is requested in the URL. This parameter requires that it is a unix path and not a URL. The path will be from the location of the .htaccess file where this redirect configuration is setup. The final parameter indicates where you want the visitor to be redirected to  In this case the traffic is being redirected to the /test2/index.html. For this second parameter a unix path or HTTP URL is acceptable.

4.  Navigate to `example.com/main.html` in a browser. You should see the url redirect to `example.com/test1/index.html` in the address bar, and your test html file should be displayed.

###  Setting the 404 Error Page

When a visitor to your site attempts to access a page or resource that does not exist (for example by following a broken link or typing an incorrect URL), the server will respond with a 404 error code. When this happens, it is important that users receive feedback that explains the error and helps them find what they were looking for. By default, Apache will display an error page in in the event of a 404 error; however, most sites provide a customized error page. You can use .htaccess settings to let Apache know what error page you would like displayed whenever a user attempts to access a nonexistent page.

1.  Reopen the .htaccess file and add the following line:

    {:.file}
    /var/www/html/example.com/public_html/.htaccess
    :  ~~~
       ErrorDocument 404 /404.html
       ~~~

2.  This will redirect all requests for nonexistent documents to a page in the project root directory called `404.html`. Create this file:

    {:.file}
    /var/www/html/example.com/public_html/404.html
    :  ~~~
       <!doctype html>
       <html>
        <body>
          404 Error: Page not found
        </body>
       </html>
       ~~~

3.  In a browser, navigate to a page that does not exist, such as `www.example.com/doesnotexist.html`. The 404 message should be displayed.
