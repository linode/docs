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


## Static Sites

If your website consists only of static files–HTML, CSS, Javascript, and images–then you only need to set up a simple web server to serve the static files.


## LAMP Stack

Other common sites, such as [WordPress](), need a database in addition to any static files.

## Test your Website

It's a good idea to test your website(s) before you add the DNS records. This is your last chance to check everything and make sure that it looks good before it goes live.

1.  Enter your Linode's IP address in a web browser (e.g., type `http://192.0.2.0` in the address bar, replacing the example IP address with your own). Your website should load in the web browser.

2.  If you plan on hosting multiple websites, you can test the virtual hosts by editing the `hosts` file on your local computer. Check out the [Previewing Websites Without DNS](/docs/networking/dns/previewing-websites-without-dns/) guide for more information.

3.  Test the name-based virtual hosts by entering the domain names in the address bar of the web browser on your desktop computer. Your websites should load in the web browser.

    {{< caution >}}
Remember to remove the entries for the name-based virtual hosts from your `hosts` file when you're ready to test the DNS records.
{{< /caution >}}

## Add DNS Records

Now you need to point your domain name(s) at your Linode. This process can take a while, so please allow up to 24 hours for DNS changes to be reflected throughout the Internet.

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

9.  Repeat steps 1-8 for each name-based virtual host you created earlier.

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
