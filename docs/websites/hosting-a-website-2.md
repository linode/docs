---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to hosting a website on your Linode.'
keywords: ["linode guide", "hosting a website", "website", "linode quickstart guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['hosting-website/']
modified: 2018-05-7
modified_by:
  name: Linode
published: 2012-03-13
title: Hosting a Website
---

![Hosting a Website](/docs/assets/hosting-website/Hosting-a-Website-smg.jpg)

## Host a Website on Your Linode

Hosting a website is one of the most common uses for a Linode. The process for getting your website up and running varies greatly with the size and complexity of your project. This guide will walk you through the process of setting up some of the most common types of simple website.

Complete the steps in our [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/security/securing-your-server/) guides before you begin. The steps
in this guide will take you from a configured Linode to a fully functioning website.

{{< note >}}
This guide was written for Debian 9 and Ubuntu 18.04. If you are using a different distribution, see our []() guides for distro-specific information.
{{< /note >}}

## Static Sites

If your website consists only of static files–HTML, CSS, Javascript, and images–then you only need to set up a simple web server to serve the static files. Static sites include everything from bare-bones HTML and CSS pages to much more complicated [React.js](https://reactjs.org/) apps. NGINX is a good choice for hosting this type of website.

{{< note >}}
If you are planning to host a simple site such as a blog or photo gallery, another option is to use a [static site generator](https://linode.com/docs/websites/static-sites/how-to-choose-static-site-generator/).
{{< /note >}}

1.  Install NGINX:

        sudo apt install nginx

2.  Create an NGINX configuration file for your website. Use a text editor to create `/etc/nginx/conf.d/example.com.conf` and add the following content:

    {{< file "/etc/nginx/conf.d/example.com.conf" >}}
server {
    listen         80 default_server;
    listen         [::]:80 default_server;
    server_name    example.com www.example.com;
    root           /var/www/example.com;
    index          index.html;

    gzip             on;
    gzip_comp_level  3;
    gzip_types       text/plain text/css application/javascript image/*;
}
{{< /file >}}

3.  The configuration above tells NGINX to look for your site's files in `/var/www/example.com`; create this directory now, subsituting your domain name for `example.com`:

        sudo mkdir -p /var/www/example.com

4.  Give ownership of this directory to the `nginx` user:

        sudo chown nginx:nginx /var/www/example.com

5.  Deactivate the default NGINX site:

        sudo mv /etc/nginx/conf.d/default /etc/nginx.conf.d/default.conf.disabled

    If this doesn't work, your NGINX version may have stored the default page in a different location:

        sudo rm /etc/nginx/sites-available/default

6.  Test your NGINX configuration for errors:

        sudo nginx -t

7.  If there are no errors, reload the congiguration:

        sudo nginx -s reload

8.  Copy the static files from your local computer to the target directory on your Linode. There are many ways to accomplish this. For example, if your site files are stored in a directory called `my-website` on your computer, you can use `scp` from your local computer:

        scp -r my-website/* username@<linode-ip-address>:/var/www/example.com



If NGINX loads successfully (you can check with `sudo systemctl status nginx`) you can skip to the [Test your Website](#test-your-website) section below.
## LAMP Stack

Other sites, such as [WordPress](/docs/websites/cms/install-wordpress-on-ubuntu-16-04/), need a database in addition to a web server. This combination is known as a **stack**; one of the most commonly used stacks is the LAMP stack (Linux, Apache, MariaDB and PHP). To install a LAMP stack manually, find the guide for your distribution in our [LAMP](/docs/web-servers/lamp/) section.

If you are using WordPress, another option is to use Docker. All of the components of the LAMP stack, as well as WordPress itself, are bundled into a single container. <!--- See our [WordPress on Docker](/docs/quick-answers/install-wordpress-using-docker/) guide for details. --->

## Test your Website

It's a good idea to test your website(s) before you add the DNS records. To do this, enter your Linode's public IP address in the address bar of a web browser. You should see your website displayed. When you are confident that the site if functioning correctly, proceed to the next section.

## Add DNS Records

Now you need to point your domain name at your Linode. This process can take a while, so please allow up to 24 hours for DNS changes to be reflected throughout the Internet.

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **DNS Manager** tab.

3.  Select the **Add a domain zone** link. The form shown below appears.

    [![Create a domain zone](/docs/assets/910-hosting-1-small.png)](/docs/assets/909-hosting-1.png)

4.  In the **Domain** field, enter your website's domain name in the **Domain** field.

5.  In the **SOA Email** field, enter the administrative contact email address for your domain.

6.  Select the **Yes, insert a few records to get me started** button.

7.  Click **Add a Master Zone**. Several DNS records will be created for your domain, as shown below.

    [![The DNS records created for the domain](/docs/assets/911-hosting-2-small.png)](/docs/assets/912-hosting-2.png)

8. Through your domain registrar (where you bought the domain), make sure that your domain name is set to use Linode's DNS. Use your domain name registrar's interface to set the name servers for your domain to the following:

    - `ns1.linode.com`
    - `ns2.linode.com`
    - `ns3.linode.com`
    - `ns4.linode.com`
    - `ns5.linode.com`

DNS changes can take up to 48 hours to propagate through the Internet. Once the changes are completed, you will be able to access your website by typing the domain name into your browser's address bar.

## Set Reverse DNS

The last step is setting reverse DNS for your domain name.

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **Linodes** tab.

3.  Select your Linode.

4.  Click the **Remote Access** tab.

5.  Select the **Reverse DNS** link, as shown below.

    [![Select Reverse DNS link](/docs/assets/951-hosting-3-1.png)](/docs/assets/951-hosting-3-1.png)

6.  Enter the domain in the **Hostname** field, as shown below.

    [![Enter domain in Hostname field](/docs/assets/914-hosting-4-small.png)](/docs/assets/915-hosting-4.png)

7.  Click **Look up**. A message appears, indicating that a match has been found.

8.  Click **Yes**.
