---
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up your first web server and point a domain name to your Linode.'
keywords: ["hosting a website", "website", "linode quickstart guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-07
modified_by:
  name: Linode
published: 2012-03-13
title: Set up a Web Server and Host a Website on Linode
---

![Hosting a Website](Hosting-a-Website-smg.jpg "Hosting a Website")

## Host a Website on Your Linode

Hosting a website is one of the most common uses for a Linode. A website can be anything from a single HTML file to an interactive application with multiple components, and the hosting process varies greatly depending on the type of website being served. This guide walks you through the process of setting up some of the most common simple website types.

Complete the steps in our [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/security/securing-your-server/) guides before you begin. The steps in this guide take you from a configured Linode to a fully functioning website.

This guide is written for Debian 9 and Ubuntu 18.04. If you are using a different distribution, adapt the commands (e.g. using `yum` instead of `apt`).

## Set Up a Web Server

The application you use to serve your website depends on the type of site. Find the section below that matches your situation.

### Static Sites

If your website consists entirely of static files like HTML, CSS, JavaScript, and images, then you only need to set up a simple web server to serve the files. Static sites include everything from bare-bones HTML pages to much more complicated [React.js](/docs/development/javascript/deploy-a-react-app-on-linode/) apps. NGINX is a good choice for hosting this type of website.

If you plan to host a simple site such as a blog or photo gallery, another option is to use a [static site generator](/docs/websites/static-sites/how-to-choose-static-site-generator/).

1.  Install NGINX:

        sudo apt install nginx

2.  Create an NGINX configuration file called `/etc/nginx/conf.d/example.com.conf` (replace this and each instance of `example.com` with your site's name) and add the following content:

    {{< file "/etc/nginx/conf.d/example.com.conf" >}}
server {
    listen         80;
    listen         [::]:80;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;

    gzip             on;
    gzip_comp_level  3;
    gzip_types       text/plain text/css application/javascript image/*;
}
{{< /file >}}

3.  The configuration above tells NGINX to look for your site's files in `/var/www/example.com`. Create this directory now, substituting your domain name for `example.com`:

        sudo mkdir -p /var/www/example.com

4.  Give ownership of this directory to your limited user account:

        sudo chown username:username /var/www/example.com

5.  Disable the default NGINX welcome page:

        sudo rm /etc/nginx/sites-enabled/default

6.  Test the NGINX configuration for errors:

        sudo nginx -t

7.  If there are no errors, reload the configuration:

        sudo nginx -s reload

8.  Copy the static files from your local computer to the target directory on your Linode. There are many ways to accomplish this. For example, if your site files are stored in a directory called `my-website` on your computer, you can use `scp` from your local computer:

        scp -r my-website/* username@<linode-ip-address>:/var/www/example.com/

9.  Activate the firewall using the built-in NGINX plugin for UFW:

        sudo ufw allow 'NGINX Full'
        sudo ufw allow ssh
        sudo ufw enable

10. Check that NGINX loaded successfully:

        sudo systemctl status nginx

    If NGINX loads successfully, continue to the [Test your Website](#test-your-website) section below.

This configuration is sufficient to get you started. For more advanced options and optimizations, see our [series on NGINX configuration](/docs/web-servers/nginx/nginx-installation-and-basic-setup/).

### LAMP Stack

Other sites, such as [WordPress](/docs/websites/cms/install-wordpress-on-ubuntu-16-04/), need a database in addition to a web server. This combination is known as a **stack**. WordPress is often used with the extremely popular LAMP stack (Linux, Apache, MariaDB and PHP). To install a LAMP stack manually, find the guide for your distribution in our [LAMP](/docs/web-servers/lamp/) section.

If you are using WordPress, another option is to use Docker. All of the components needed to run WordPress, along with WordPress itself, are bundled into a container that can be deployed with single command. Official Docker images are also available for other CMS platforms including [Ghost](https://hub.docker.com/_/ghost/) and [Joomla](https://hub.docker.com/_/joomla/). <!--- See our [WordPress on Docker](/docs/quick-answers/install-wordpress-using-docker/) guide for details. ---->

### Other Site Types

If none of these application stacks fit your situation, review our [Websites](/docs/websites/) and [Development](/docs/development/) sections to find a solution that works for your project.

## Test your Website

Test your website(s) before you add DNS records and make the site available publicly on your domain. Enter your Linode's public IP address in the address bar of a web browser. You should see your website displayed. When you are confident that the site is functioning correctly, proceed to the next section.

## Add DNS Records

In order to point your domain name at your Linode, you will have to add DNS records. DNS changes can take up to 24 hours to propagate across the internet.

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **DNS Manager** tab.

3.  Select the **Add a domain zone** link. The form shown below appears.

    [![Create a domain zone](910-hosting-1-small.png "Create a Domain zone.")](909-hosting-1.png)

4.  In the **Domain** field, enter your website's domain name in the **Domain** field.

5.  In the **SOA Email** field, enter the administrative contact email address for your domain.

6.  Select the **Yes, insert a few records to get me started** button.

7.  Click **Add a Master Zone**. Several DNS records will be created for your domain, as shown below.

    [![The DNS records created for the domain](911-hosting-2-small.png "The DNS records created for the domain")](912-hosting-2.png)

8. Through your domain registrar (where you bought the domain), make sure that your domain name is set to use Linode's DNS. Use your domain name registrar's interface to set the name servers for your domain to the following:

    - `ns1.linode.com`
    - `ns2.linode.com`
    - `ns3.linode.com`
    - `ns4.linode.com`
    - `ns5.linode.com`

DNS changes can take up to 48 hours to propagate through the Internet. Once the changes are completed, you will be able to access your website by typing the domain name into your browser's address bar.

## Set Reverse DNS

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **Linodes** tab.

3.  Select your Linode.

4.  Click the **Remote Access** tab.

5.  Select the **Reverse DNS** link, as shown below.

    [![Select Reverse DNS link](951-hosting-3-1.png "Select Reverse DNS link")](951-hosting-3-1.png)

6.  Enter the domain in the **Hostname** field, as shown below.

    [![Enter domain in Hostname field](914-hosting-4-small.png "Enter domain in Hostname field")](915-hosting-4.png)

7.  Click **Look up**. A message appears, indicating that a match has been found.

8.  Click **Yes**.
