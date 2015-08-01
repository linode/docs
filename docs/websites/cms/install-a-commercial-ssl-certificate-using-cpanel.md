---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: 'Generate a CSR and install a commercial SSL certificate through the cPanel interface.'
keywords: 'cpanel, ssl, ip'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/control-panels/cpanel/ssl-on-cpanel/']
modified: Friday, March 9th, 2012
modified_by:
  name: Linode
published: 'Tuesday, September 27th, 2011'
title: Install a Commercial SSL Certificate Using cPanel
external_resources:
 - '[cPanel Home Page](http://cpanel.net)'
 - '[cPanel Support](http://cpanel.net/support.html)'
---

[cPanel](http://cpanel.net) is a commercial web-based control panel for server systems. It can help ease the burden of common system administration tasks such as website creation, database deployment and management, and more. This guide will show you how to install SSL certificates on your server using cPanel. These instructions should be done through your root WHM interface.

## Create a Certificate Signing Request

You will need a Certificate Signing Request to obtain an SSL certificate from any issuer. To generate your CSR, log into WHM as root, go to the SSL/TLS section, and click on "Generate an SSL Certificate and Signing Request". On the next page, you will need to fill out the form with your information as requested and click on the "Create" button at the bottom:

[![cPanel CSR form.](/docs/assets/815-CSR.png)](/docs/assets/815-CSR.png)

Make sure you enter an email address at the bottom inthe "Contact Info" section so you will get the CSR and key emailed to you. After you generate your CSR, you can contact your SSL issuer of choice to obtain a certificate.

## Install a Commercial SSL Certificate

Once you have obtained an SSL certificate from your issuer of choice, you can proceed to the installation. If you are not installing the certificate on your main IP, continue with this section. If you do need to install a certificate on your main IP, skip down to the next section, "Installing a SSL on your Main IP".

To install your SSL certificate, the domain you are installing it for must have its own IP address that is not currently being used by another domain for SSL. You can change the IP assigned to your domain through your root WHM's "IP Functions" section under the "Change a Site's IP Address" area. On the "Change a Site's IP Address" page, select the domain you are installing the certificate on and click the "Change" button at the bottom. On the next page, you will be able to select a new IP for the domain. If IPs are being used by other domains on the server, they will be grayed out and marked "(dedicated to DOMAIN)". Once you select the new IP, you will be able to install your SSL certificate.

You will now need to go to the SSL/TLS section and click on "Install an SSL Certificate and Setup the Domain". On this page, you will need to paste the contents of your .crt file into the top box. When you click outside the box, it will autofill the domain, user, and IP address as shown here:

[![cPanel SSL install form.](/docs/assets/821-Install-userb.png)](/docs/assets/821-Install-userb.png)

After you verify the domain, user, and IP are correct, just click the "Submit" button at the top of the box. Your domain may need a bit of time to propagate for the new IP, but you should be able to check the SSL installation through the IP as well using `https://12.34.56.78`, where `12.34.56.78` is the IP address of your Linode.

## Install a Commercial SSL Certificate on your Main IP

Installing an SSL certificate on your cPanel server's main IP requires a slight adjustment from the method described above. In the SSL installation form, switch the Username from the domains actual username to "nobody" as shown here:

[![cPanel SSL install form.](/docs/assets/822-Install-nobodyb.png)](/docs/assets/822-Install-nobodyb.png)

Note: If you enabled suPHP during your EasyApache configuration, you will need to use a certificate for your hostname. If you try to use this method with a user's web site, it will require other modifications that will essentially break your users' access to their own files.

## Troubleshooting

Some people experience problems after installing SSL certificates using cPanel. If your server is returing a `500 Internal Server Error`, please see [this post in the cPanel forums](http://forums.cpanel.net/f5/ssl-cert-500-internal-server-error-162653.html) for additional information.