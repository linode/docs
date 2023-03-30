---
slug: how-to-enable-disable-website
description: "Is your site enabled with NGINX or Apache? This guide explains how to quickly disable a website running on Apache/NGINX, & what's involved in re-enabling it"
keywords: ['enable website','disable website','apache','nginx']
tags: ['apache', 'nginx', 'ubuntu', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-17
modified_by:
  name: Linode
title: "Sites Enabled with NGINX or Apache"
title_meta: "How to Enable Sites in NGINX or Apache"
external_resources:
- '[NGINX](https://www.nginx.com/)'
- '[Apache Web Server](https://httpd.apache.org/)'
authors: ["Jeff Novotny"]
---

There may be times when you have to temporarily disable a website. For example, you might have to satisfy a legal requirement or make an emergency content change. Fortunately, you do not have to completely delete or radically reconfigure a website to disable it. This guide provides instructions on how to quickly disable and re-enable a website, based on the webserver and Linux distribution.

The instructions for disabling and re-enabling a website depend on the webserver that is installed on your Linode. See the section that corresponds to sites enabled with NGINX or Apache. Throughout these instructions, replace the placeholder site name of `example.com` with your own domain name.

{{< note respectIndent=false >}}
Taking a site offline, even temporarily, can affect its *Search Engine Optimization* (SEO) ratings. If you only want to briefly disable a site for maintenance reasons, consider using a temporary redirect instead.
{{< /note >}}

## Disable and Enable a Website on the NGINX Web Server

By default, [*NGINX*](https://www.nginx.com/) installed on Ubuntu and Debian systems use the `sites-available` and `sites-enabled` directories or folders to control website access. This approach is often used even on other Linux systems. If the Linode is already using these two directories, follow the instructions in the [Use the Sites-Enabled Directory](#use-the-sites-enabled-directory) subsection. Otherwise, skip to the [Use the Virtual Host File on the NGINX Web Server](/docs/guides/how-to-enable-disable-website/#use-the-virtual-host-file-on-the-nginx-web-server) subsection.

### Use the Sites-Enabled Directory

Ubuntu systems have a `/etc/nginx/sites-available` directory, which contains *virtual host* (vhost) files for each domain hosted on the Linode. For instance, the domain for `example.com` typically has a corresponding virtual host file named `/etc/nginx/sites-available/www.example.com.conf`. The filename might not include the `.conf` extension in all cases.

To enable a website, you must create a symbolic link inside the `/etc/nginx/sites-enabled` directory pointing to the actual vhost file in `/etc/nginx/sites-available`. The `nginx.conf` file reviews the contents of the `sites-enabled` directory and determines which virtual host files to include. These domains are made available to potential viewers. Adding a symbolic link leading to a virtual host file enables the associated site while removing the symbolic link disables it.

{{< file "/etc/nginx/nginx.conf" aconf >}}
...
include /etc/nginx/sites-enabled/*;
...
{{< /file >}}
To disable and enable a website, follow these directions.

1. To find the name of the domain, list all of the sites hosted on the Linode using the following command:

        ls /etc/nginx/sites-available
1. To disable a site, remove the symbolic link from the `/etc/nginx/sites-enabled` directory.

        sudo rm /etc/nginx/sites-enabled/example.com.conf
1. Reload NGINX to apply the change.

        sudo systemctl reload nginx
1. Use a browser to confirm the site no longer resolves. You should see an error page when you access the site.
1. To enable the site again, re-create the symbolic link to the virtual host file.

        sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf
1. Reload NGINX to apply the change.

        sudo systemctl reload nginx
1. Enter the name of the newly-enabled domain in a browser. The webpage should be displayed.

### Use the Virtual Host File on the NGINX Web Server

Some Linux systems do not use the `sites-available` and `sites-enabled` directories. In this case, you can disable a site by renaming the virtual host file. In a typical NGINX installation, the web server is specifically searching for host files ending with `.conf`. So you can "hide" a virtual host by changing its extension.

1. Find the location of the virtual host file you created for the domain using the `sudo nginx -T | grep example.com` command. Change to its parent directory.

        cd etc/nginx/conf.d/
1. Change the extension of the `.conf` file to something else, such as `.disable`.

        sudo mv -i /etc/nginx/conf.d/example.com.conf /etc/nginx/conf.d/example.com.disable
1. Reload NGINX to apply the change.

        sudo systemctl reload nginx
1. Enter the domain name in the browser. The site should no longer resolve.
1. To re-enable the site, rename the virtual host file back to its original name.

        sudo mv -i /etc/nginx/conf.d/example.com.disable /etc/nginx/conf.d/example.com.conf
1. Reload NGINX and confirm the site is accessible again.

{{< note respectIndent=false >}}
There could be cases where a website does not have a separate virtual host file. This might occur if it is the only site on the Linode, or if the system is using a non-standard configuration. In this case, comment out all the lines in the website's vhost entry, using the `#` symbol. See the [Use the Virtual Host File on the Apache Web Server](/docs/guides/how-to-enable-disable-website/#use-the-virtual-host-file-on-the-apache-web-server) section of this guide for more information.
{{< /note >}}

## Disable and Enable a Website on the Apache Web Server

On Ubuntu and other distributions of Linux, [*Apache*](https://httpd.apache.org/) makes it very easy to enable or disable a site. It includes utilities that handle all the necessary configuration changes.

### Use the Apache Utilities: a2dissite and a2ensite

The `a2dissite` and `a2ensite` tools greatly simplify the process of disabling and enabling a website. The following commands are geared towards Ubuntu but are similar to other versions of Linux.

1. Disable the site using the `a2dissite` command followed by the site name. Enter the name used for the virtual host `.conf` file, without the extension.

        a2dissite example.com
1. Reload the Apache configuration to apply the modified changes.

        sudo systemctl reload apache2
    {{< note respectIndent=false >}}
On some versions of Linux, the `apache2` module is known as `httpd`. On these platforms, the equivalent command is `sudo systemctl reload httpd`.
    {{< /note >}}
1. Use a web browser to verify the domain is no longer accessible.
1. To re-enable the site again, use the `a2ensite` command followed by the site name.

        a2ensite example.com
1. Reload the Apache configuration to apply the change.

        sudo systemctl reload apache2
1. Navigate to the domain and ensure the site is available again.

### Use the Virtual Host File on the Apache Web Server

If the `a2dissite` and `a2ensite` tools are not installed, edit the virtual host file and comment out the domain configuration.

1. Locate the virtual host file for the domain. If necessary, use the command `httpd -S` to display the path to this file. Change to the parent directory of the file, for example, `/etc/httpd`.

        cd /etc/httpd/vhost.d
1. Comment out all lines in the virtual host file using the `#` symbol. The virtual host information typically begins with a line such as `<VirtualHost *:80>` followed by a list of the server attributes including `ServerName` and `ServerAlias`.

    {{< file "/etc/httpd/vhost.d/example.com.conf" aconf >}}

# <VirtualHost *:80>

# ServerAdmin webmaster@example.com

# ServerName  example.com

# ServerAlias www.example.com

...

# </VirtualHost>

    {{< /file >}}

1. Reload Apache to apply the changes using `systemctl restart`. On CentOS, the Apache service is referred to as `httpd`.

        sudo systemctl restart httpd.service
1. Try to access the domain using a web browser. The site should no longer resolve.
1. To re-enable the site, open the `.conf` file and uncomment these lines. Remove the `#` symbols preceding each of the lines in the file.

    {{< file "/etc/httpd/vhost.d/example.com.conf" aconf >}}
 <VirtualHost *:80>
  ServerAdmin webmaster@example.com
  ServerName  example.com
  ServerAlias www.example.com
...
 </VirtualHost>
    {{< /file >}}
1. Restart Apache using `systemctl`.

        sudo systemctl restart httpd.service
1. Use a web browser to ensure the site is now available.
