---
slug: how-to-enable-disable-website
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides instructions on how to quickly disable and re-enable a website, based on the web server and Linux distribution'
og_description: 'This guide provides instructions on how to quickly disable and re-enable a website, based on the web server and Linux distribution.'
keywords: ['enable website','disable website','apache','nginx']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-12
modified_by:
  name: Linode
title: "Enabling and Disabling a Website in Apache or NGINX"
h1_title: "How to Enable or Disable a Website in Apache or NGINX."
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[NGINX](https://www.nginx.com/)'
- '[Apache Web Server](https://httpd.apache.org/)'
---

There may be times when you have to temporarily disable a website. For example, you might have to satisfy a legal requirement or make an emergency content change. Fortunately, you do not have to completely delete or radically reconfigure a website to disable it. This guide provides instructions on how to quickly disable and re-enable a website, based on the web server and Linux distribution.

## Before You Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of Linode's [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

The instructions for disabling and re-enabling a website depend on the web server that is installed on your Linode. See the section that corresponds to either NGINX or Apache. Throughout these instructions, replace the placeholder site name of `example.com` with your own domain name.

{{< note >}}
Taking a site offline, even temporarily, can affect its *Search Engine Optimization* (SEO) Ratings. If you only want to briefly disable a site for maintenance reasons, consider using a temporary redirect instead.
{{< /note >}}

## Disabling and Enabling a Web Site on the NGINX Web Server

By default, Ubuntu and Debian systems with [*NGINX*](https://www.nginx.com/) installed use the `sites-available` and `sites-enabled` directories to control website access. This approach is often used even on other Linux systems. If the Linode is already using these two directories, follow the instructions in the first subsection. Otherwise, skip to the "Using the Virtual Host File" subsection.

### Using the Sites-Enabled Directory

Ubuntu systems have a `/etc/nginx/sites-available` directory, which contains *virtual host* (vhost) files for each domain hosted on the Linode. For instance, the domain for `example.com` typically has a corresponding virtual host file named `/etc/nginx/sites-available/www.example.com.conf`. The filename might not include the `.conf` extension in all cases.

To enable a website, you must create a symbolic link inside the `/etc/nginx/sites-enabled` directory pointing to the actual vhost file in `/etc/nginx/sites-available`. The `nginx.conf` file reviews the contents of the `sites-enabled` directory and determines which virtual host files to include. These domains are made available to potential viewers. Adding a symbolic link leading to a virtual host file enables the associated site, while removing the symbolic link disables it.

{{< file "/etc/nginx/nginx.conf" aconf >}}
...
include /etc/nginx/sites-enabled/*;
...
{{< /file >}}
To disable and enable a website, follow these directions.

1.  To find the name of the domain, list all of the sites hosted on the Linode using the following command.

        ls /etc/nginx/sites-available
2.  To disable a site, remove the symbolic link from the `/etc/nginx/sites-enabled` directory.

        sudo rm /etc/nginx/sites-enabled/example.com.conf
3.  Reload NGINX to apply the change.

        sudo systemctl reload nginx
4.  Use a browser to confirm the site no longer resolves. You should see an error page when you access the site.
5.  To enable the site again, re-create the symbolic link to the virtual host file.

        sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf
6.  Reload NGINX to apply the change.

        sudo systemctl reload nginx
7.  Enter the name of the newly-enabled domain in a browser. The webpage should be displayed.

### Using the Virtual Host File

Some Linux systems do not use the `sites-available` and `sites-enabled` directories. In this case, you can disable a site by renaming the virtual host file. In a typical NGINX installation, the web server is specifically searching for vhost files ending with `.conf`. So you can "hide" a virtual host by changing its extension.

1.  Locate the virtual host file you originally created for the domain using the `sudo nginx -T | grep example.com` command. Change to its parent directory.

        cd etc/nginx/conf.d/
2.  Change the extension of the `.conf` file to something else, such as `.disable`.

        sudo mv -i /etc/nginx/conf.d/example.com.conf /etc/nginx/conf.d/example.com.disable
3.  Reload NGINX to apply the change.

        sudo systemctl reload nginx
4.  Enter the domain name in the browser. The site should no longer resolve.
5.  To re-enable the site, rename the virtual host file back to its original name.

        sudo mv -i /etc/nginx/conf.d/example.com.disable /etc/nginx/conf.d/example.com.conf
6.  Reload NGINX and confirm the site is accessible again.

{{< note >}}
There could be cases where a web site does not have a separate virtual host file. This might occur if it is the only site on the Linode, or if the system is using a non-standard configuration. In this case, comment out all the lines in the website's vhost entry, using the `#` symbol. See the "Disabling and Enabling a Web Site on the Apache Web Server Using the Virtual Host File" section of this guide for more information.
{{< /note >}}

## Disabling and Enabling a Web Site on the Apache Web Server

On Ubuntu and some other distributions of Linux, [*Apache*](https://httpd.apache.org/) makes it very easy to enable or disable a site. It includes utilities that handle all the necessary configuration changes.

### Using the Apache Utilities

The `a2dissite` and `a2ensite` tools greatly simplify the process of disabling and enabling a web site. The following commands are geared towards Ubuntu, but are similar on other versions of Linux.

1.  Disable the site using the `a2dissite` command followed by the site name. Enter the name used for the virtual host `.conf` file, without the extension.

        a2dissite example.com
2.  Reload the Apache configuration to apply the changes.

        sudo systemctl reload apache2
    {{< note >}}
On some versions of Linux, the `apache2` module is known as `httpd`. On these platforms, the equivalent command is `sudo systemctl reload httpd`.
    {{< /note >}}
3.  Use a web browser to verify the domain is no longer accessible.
4.  To re-enable the site again, use the `a2ensite` command followed by the site name.

        a2ensite example.com
5.  Reload the Apache configuration to apply the change.

        sudo systemctl reload apache2
6.  Navigate to the domain and ensure it is available again.

### Using the Virtual Host File

If the `a2dissite` and `a2ensite` tools are not installed, edit the virtual host file and comment out the domain configuration.

1.  Locate the virtual host file for the domain. If necessary, use the command `httpd -S` to display the path to this file. Change to the parent directory of the file, for example, `/etc/httpd`.

        cd /etc/httpd/vhost.d
2.  Comment out all lines in the virtual host file using the `#` symbol. The virtual host information typically begins with a line such as `<VirtualHost *:80>` followed by a list of the server attributes including `ServerName` and `ServerAlias`.

    {{< file "/etc/httpd/vhost.d/example.com.conf" aconf >}}
# <VirtualHost *:80>
#  ServerAdmin webmaster@example.com
#  ServerName  example.com
#  ServerAlias www.example.com
...
# </VirtualHost>
    {{< /file >}}

3.  Reload Apache to apply the changes using `systemctl restart`. On CentOS, the Apache service is referred to as `httpd`.

        sudo systemctl restart httpd.service
4.  Try to access the domain using a web browser. The site should no longer resolve.
5.  To re-enable the site, uncomment the contents of the `.conf` file. Remove the `#` symbols preceding each of the lines in the file.

    {{< file "/etc/httpd/vhost.d/example.com.conf" aconf >}}
 <VirtualHost *:80>
  ServerAdmin webmaster@example.com
  ServerName  example.com
  ServerAlias www.example.com
...
 </VirtualHost>
    {{< /file >}}
6.  Restart Apache using `systemctl`.

        sudo systemctl restart httpd.service
7.  Use a web browser to ensure the site is now available.