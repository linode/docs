---
author:
  name: Christopher Piccini
  email: cpiccini11@gmail.com   
description: 'The purpose of this guide to provide you an in depth guide of the .htaccess file.  This tutorial will cover handling permisions, redirects and restricting IP's'
keywords: 'htaccess, apache'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: '.htaccess in depth guide'
contributor:
  name: Christopher Piccini
  link: https://twitter.com/chrispiccini11
  external_resources:
- '[Link Title 1](https://www.powerfastwebsites.com)'
---

# About the Author
#### Name:  
Chris Piccini
#### Email:  
cpiccini11@gmail.com

# Introduction
The purpose of this guide is to show you how to setup htaccess configuration (.htaccess) for Apache.  The guide will cover topics relating to how to handle web site file structure permissions, redirects and IP restrictions.



## Before You Begin

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](https://www.linode.com/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

2.  Update your system:

        sudo apt-get update
        
3.  Install Apache on your Linode.  Please follow the apache section in [this linode guide](https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04) to install Apache on your linode before following this guide.

4.  Working knowledge of using the nano editor.
        
> Notes:  
> 1.  This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](https://www.linode.com/docs/tools-reference/linux-users-and-groups) guide.
> 2.  Replace each instance of `testuser` in this guide with your custom user account.

## What is .htaccess
.htaccess is a configuration file that is used on web services that run the Apache web server.  It is an extremely powerful tool and can be used to modify the Apache configuration without needing to go in and edit the main Apache configuration files.  The following sections describe how to create this configuration and use it to restrict directory listings, handle redirects, and restrict IP's.

## Enabling .htaccess use
By Default the use of .htaccess is not available.  To enable this setup you will need to add a few lines to your configuration file.

1. Access and open your configuration file.

        sudo nano /etc/apache2/sites-available/example.com.conf
        
2.  After the closing VirtualHost block (</VirtualHost>) add this.
      
        ....
        </VirtualHost>
        # Insert Below into your configuration File.
        <Directory /var/www/html/example.com/public_html>
            Options Indexes FollowSymLinks
            AllowOverride All
            Require all granted
        </Directory>

3.  Save the file, then restart apache.

        sudo service apache2 restart
        
        
## Restricting Directory Listings
In my example.com public_html directory I have two directories (test1 and test2) and three files that consist of a jpeg (Lina.JPG), a javascript file (Untitled-1.js) and an html file (main.html).

If a visitor were to visit example.com they would be able to see my directory and file structure and have access to files on my web server.  This may be okay for some, but it would be best practice to restrict directory access so that a visotor to example.com would have to know the file name or directory they would like to see in order to view it.  One way we can restrict this is through .htaccess.

### Creating .htaccess
1.  Many popular CMS systems such as wordpress already create .htaccess configurations.  For the demonstration purposes of this guide, we do not have an existing .htaccess file and will be creating one manually.  Let's navigate to our site directory.

        cd /var/www/html/example.com/public_html

2.  Create the .htaccess file.

        sudo nano .htaccess
        
3.  In the nano editor, enter this line, then save and exit the file.

        Options -Indexes
        
4.  Now if you navigate to your site you will see a Forbidden message.  You have to specifically indicate the file you would like to see.

### Important things to note.

The .htaccess file settings can propogate directories down the directory tree.  In the previous example we updated the .htaccess file in the root site directory, which applied that rule to the root site directory, as well as the child directories.
        
## Restricting IP's

This section wil guide you through restricting specific IP's from accessing your site.  This can be useful if you want to block certain visitors from visiting your site.  You may also want to set this up so that you may only allow certain IP's from accessing certain sections of your site.  Perhaps you would like to only allow an IP address that belongs that maps back to an administrator to the administration section of your site.

### Deny IP's

1.  Access the .htaccess file located in the web directory you want this setting to take place on.  In the example below, the root directory of example.com is used.

        cd /var/www/html/example.com/public_html/
        sudo nano .htaccess
        
2.  Add below to deny the IP(s).

        order allow, deny
        
        # This will deny the IP 172.15.23.9
        deny from 172.15.23.9
        
        # This will deny all IP's from 172.15.23.0 through 172.15.23.255
        deny from 172.15.23
        
### Allowing IP's

1.  Access the .htaccess file located in the web directory you want this setting to take place on.  In the example below, the root directory of example.com is used.

        cd /var/www/html/example.com/public_html/
        sudo nano .htaccess
        
2.  Add below to deny all IP's except for the specific IP and pool of IP's mentioned in command.

        order deny, allow
        
        # Denies all IP's
        Deny from all
        
        # This will allow the IP 172.15.23.9
        allow from 172.15.23.9
        
        # This will allow all IP's from 172.15.23.0 through 172.15.23.255
        allow from 172.15.23

## Handling Redirects

You can redirect traffic using the htaccess configuration.  Redirects are needed if you want visitors who are accessing a link on your website that you now want to now access a different page.  In the below example we will be updating the .htaccess file for the root directory of our website.  We want the redirect to happen if a visitor tries to visit http://example.com/main.html they will be redirected http://example.com/test2/index.html

1.  Navigate to the site's public root directory.

        cd /var/www/html/example.com/public_html/
        
2.  Access the .htaccess configuration using nano.

        sudo nano .htaccess
        
3.  Remove all existing configuration in this file and add below.  Once complete, save the .htacecess file.

        Redirect /main.html /test2/index.html

This commands starts with the word 'Redirect'.  The first parameter after this command is the unix path to the file that is requested in the URL.  This parameter requires that it is a unix path and not a URL.  The path will be from the location of the .htaccess file where this redirect configuration is setup.  The second parameter in this line indicates where you want the visitor to be redirected to.  In this case the traffic is being redirected to the /test2/index.html.  For this second parameter a unix path or HTTP URL is acceptable.

## 301 Redirects

301 Redirects are a way of letting search engines know that the link a visitor is trying to access has moved to a new url.  This is similar to the previous setup in terms of URL parameters passed in the redirect command.  This command requires an additional parameter in the command.

### Steps

1.  Access to the root directory for example.com.

        cd /var/www/html/example.com/public_html/
        
2.  Open the .htaccess file.

        sudo nano .htaccess
        
3.  Remove content in this file entered by previous steps in this guide.

4.  Add the 301 redirect.

        Redirect 301 /main.html /test2/index.html
        
The difference between the above redirect command in this section vs. the redirect command in the previous section is that this redirect command includes '301' directly after 'Redirect'.

###  Setting the 404 Error Page

The 404 Error code is for when a user attempts to access a page on your site that does not exist.  If this occurs the 404 Error document command will guide the visitor to your custom 404 error page that should explain to the user that this page cannot be found.

1.  Access to the root directory for example.com.

        cd /var/www/html/example.com/public_html/
        
2.  Open the .htaccess file.

        sudo nano .htaccess
        Redirect 404 
        
3.  Add the 404 Error Document command.

      ErrorDocument 404 /404.html
      
The above command will guide the website visitor to a page named 404.html in your root directory.


#Finished