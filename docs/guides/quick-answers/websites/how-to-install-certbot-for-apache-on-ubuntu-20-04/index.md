---
slug: how-to-install-certbot-for-apache-on-ubuntu-20-04
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide explains how to install Certbot on Ubuntu 20.04. It also describes how to use Certbot to install and renew SSL/TLS certificates on Apache.'
og_description: 'This guide explains how to install Certbot on Ubuntu 20.04. It also describes how to use Certbot to install and renew SSL/TLS certificates on Apache.'
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'Apache']
tags: ['ssl','apache','ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-02
modified_by:
  name: Linode
title: "Use Certbot to Install SSL/TLS Certificates for Apache on Ubuntu 20.04"
h1_title: "How to Use Certbot to Install SSL/TLS Certificates for Apache on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[Certbot](https://certbot.eff.org/)'
- '[Lets Encrypt](https://letsencrypt.org/)'
- '[Lets Encrypt](https://letsencrypt.org/how-it-works/)'
- '[rate limit](https://letsencrypt.org/docs/rate-limits/)'
- '[Certbot FAQ](https://certbot.eff.org/faq)'
- '[documentation section](https://certbot.eff.org/docs/)'
- '[Lets Encrypt community](https://community.letsencrypt.org/)'
relations:
    platform:
        key: how-to-install-certbot
        keywords:
            - distribution: Ubuntu 20.04 (Apache)
---

*Certbot* is a free, open-source tool that automates the process of requesting [*Let's Encrypt*](https://letsencrypt.org/) certificates for a website. These signed certificates allow for *Hypertext Transfer Protocol Secure* (HTTPS) to be enabled throughout a domain to provide more secure encrypted communications.

This guide explains how to install [Certbot](https://certbot.eff.org/) on Ubuntu 20.04. It also describes how to use Certbot to install and renew SSL certificates on the Apache webserver.

## Before You Begin

1. Familiarize yourself with Linode's [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of Linode's [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the [Configure a Firewall](/docs/guides/securing-your-server/#configure-a-firewall) section yet as this guide includes firewall rules specifically for an OpenVPN server.

1. Update your system:

        sudo apt-get update && sudo apt-get upgrade

1. Ensure you have already registered a *Fully Qualified Domain Name* (FQDN) for the website. The DNS records for your domain must point to your Linode server. Consult Linode's [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) and [DNS Manager](/docs/platform/manager/dns-manager/) for assistance when configuring your domain.

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Understanding How Certbot Works

HTTPS builds upon the original *Hypertext Transfer Protocol* (HTTP) standard to offer a more secure browsing experience. It encrypts network traffic using either the *Transport Layer Security* (TLS) service or the older *Secure Sockets Layer* (SSL) technology. (SSL is considered deprecated, but it can still be used.) HTTPS protects the privacy and integrity of any data in transit and authenticates a website for the end-user. For this reason, HTTPS must be implemented on websites that handle financial or personal data. However, all domains are strongly encouraged to enable HTTPS, and a majority of all sites now use it.

A web server must possess a signed public-key certificate from a trusted Certificate Authority before it can accept HTTPS requests. *Let's Encrypt* is one of the most widely-used of these authorities. It manages a free automated service that distributes basic SSL/TLS certificates to eligible websites. Let's Encrypt leverages the *Automatic Certificate Management Environment* (ACME) protocol to automate the certificate granting process through a challenge-response technique. A server must run its certificate management agent to request a certificate.

Certbot, which automates and manages the certification task, was developed by the *Electronic Frontier Foundation* (EFF) with the end goal of improving web security. It supports most operating systems and is designed to run on the Apache server hosting the domain. Certbot challenges the server requesting to prove it manages the domain, and validates this claim before it grants the certificate. When it passes this test, the server is entitled to request, renew, and revoke certificates for the domain. Certbot makes all necessary changes to the Apache configuration. The [*Let's Encrypt*](https://letsencrypt.org/how-it-works/) site provides more comprehensive technical details about domain validation.

## System Requirements

For Certbot to operate correctly, the following prerequisites must be met:

* A recent version of Apache must be installed.
* A Fully Qualified Domain Name for the website exists with its DNS record pointing to the Linode server.
* An HTTP-enabled website that can receive connections through *Transmission Control Protocol* (TCP) Port 80 is already online.
* SSH access to the Linode server.

Certbot uses Python to request and configure the certificate. The Certbot installation includes the necessary Python components.

## A Summary of the Certbot Installation and Certificate Request Process

The following are the high-level steps to install Certbot and request an SSL certificate:

1. Install Apache
1. Install Certbot
1. Request a Certificate Using Certbot

## Install Apache

You must install Apache before using Certbot. If Apache is already installed, this section can be skipped. For more information about Apache, see Linode's [Apache Configuration Basics](/docs/web-servers/apache-tips-and-tricks/apache-configuration-basics) guide.

To determine whether Apache is installed, run the `apache2 -v` command. If the command works and indicates what version of Apache is running, then Apache is already installed.

1. Apache is available through the default Ubuntu software repositories, so update the system packages first. Reboot the system if Ubuntu advises you to do so.

        sudo apt-get update
        sudo apt-get upgrade

1. Install the basic `apache2` package.

        sudo apt install apache2

1. Verify the status of Apache using `systemctl`.

        systemctl status apache2

    Apache should display a status of `active`.

    {{< output >}}
apache2.service - The Apache HTTP Server
     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2021-03-02 09:55:01 UTC; 16s ago
       Docs: <https://httpd.apache.org/docs/2.4/>
   Main PID: 2595 (apache2)
    {{< /output >}}

1. (**Optional**) Apache is configured to launch automatically whenever the server reboots. To change this behavior, disable the entry in `systemctl`. To re-enable the default behavior, use the `systemctl enable` command.

        systemctl disable apache2

1. For increased security, configure the `ufw` firewall to deny unauthorized access attempts. Use the `app list` command to display the available entries.

        sudo ufw app list

    `Ufw` displays a list of all of the eligible applications.

    {{< output >}}
Available applications:
Apache
Apache Full
Apache Secure
OpenSSH
{{< /output >}}

1. Allow `ufw` to accept `OpenSSH` connections, and enable `Apache Full`. This allows both HTTP and HTTPS requests through the firewall.

        sudo ufw allow ssh
        sudo ufw allow 'Apache Full'

1. Enable `ufw`.

        sudo ufw enable

1. Confirm you can still access the webserver. Type the [address of your Linode server](/docs/guides/find-your-linodes-ip-address/) into the address bar of the browser.

        http://192.0.2.0

    If the webserver is working, the browser displays the default Apache landing page.

{{< note >}}
Certbot works best with Apache if a virtual host entry is configured for the domain. This approach is mandatory if you are hosting more than one domain on the server.

To set up a virtual host, consult Linode's [Host a Website on Ubuntu 18.04](/docs/web-servers/lamp/hosting-a-website-ubuntu-18-04) guide and follow the instructions in the [Configure Name-based Virtual Hosts](/docs/guides/hosting-a-website-ubuntu-18-04/#configure-name-based-virtual-hosts) section.
{{< /note >}}

## Install Certbot

The *Snap* utility provides an easy way to install Certbot. Snap ensures that you download the latest version of Certbot for your distribution. It also automatically configures Certbot for certificate auto-renewal. To use this method, Snap must be installed.

1. Snap currently comes pre-installed on Ubuntu. The following commands update Snap and display the version.

        sudo snap install core
        sudo snap refresh
        snap version

    {{< note >}}
In the unlikely event, Snap is not already installed, run the command `sudo apt install snapd` and then execute the above commands.
    {{< /note >}}

    {{< output >}}
snap    2.48.3+20.04
snapd   2.48.3+20.04
series  16
ubuntu  20.04
kernel  5.4.0-65-generic
    {{< /output >}}

1. To avoid conflicts, remove any duplicate Ubuntu packages before proceeding.

        sudo apt-get remove certbot

1. Install Certbot using Snap.

        sudo snap install --classic certbot

    The Snap module confirms Certbot is installed.

    {{< output >}}
certbot 1.15.0 from Certbot Project (certbot-eff) installed
    {{< /output >}}

1. Use the `ln` command to configure a symbolic link.

        sudo ln -s /snap/bin/certbot /usr/bin/certbot

{{< note >}}
You can verify what version of Certbot is installed using the `certbot --version` command.
{{< /note >}}

## Request a Certificate Using Certbot

As part of the granting process, Certbot steps through a series of questions about the domain. This information allows it to properly request the certificate. You must agree to the terms of service and provide a valid email address. Certbot might ask slightly different questions depending upon the server configuration, and it skips some preliminary sections if you have used it before.

The following example assumes that a virtual host file has been created for the domain. If the file does not exist, the domain names must be manually entered in step seven.

1. Launch Certbot to start the certification process. Certbot automatically makes any necessary configuration changes to the Apache configuration files.

        sudo certbot --apache

    {{< note >}}
Certbot logs a record of the installation at `/var/log/letsencrypt/letsencrypt.log`. Review this file if there are any problems.
    {{< /note >}}

1. Certbot displays some basic information about the operation. It then asks for an email address where it can send urgent notices about the domain or registration. This should be the email address of the webserver administrator.

    {{< output >}}
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel)
    {{< /output >}}

1. At the prompt, enter your email address.

        user@example.com

1. Certbot then asks you to agree to the *Let's Encrypt* terms of service.

    {{< output >}}
Please read the Terms of Service at
<https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf>. You must
agree to register with the ACME server. Do you agree?
    {{< /output >}}

1. Download and review the PDF file. Enter `Y` to agree to the terms.

1. Certbot asks whether you want to optionally subscribe to the EFF mailing list or not. Select either `Y` or `N` according to your preference.

1. Certbot now requests a domain name for the certificate. Certificates for multiple domains can be requested at the same time. If there is a virtual host for the domain, Certbot displays the following choices:

    {{< output >}}
   Which names would you like to activate HTTPS for?

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: example.com
2: www.example.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
{{< /output >}}

1. Enter the numbers that correspond to the domains to certify. For each domain name, request versions with and without the `www` prefix. If there is more than one domain, separate the numbers using either space or a comma.

        1 2

1. Certbot proceeds to request and install the certificates, performing any necessary challenges. If the operation is successful, Certbot confirms the certificate has been deployed. It also indicates where the certificates and key chains are stored, along with the date the certificate expires. By default, certificates expire in 90 days.

    {{< note >}}
If one of the certificates cannot be created, run the `certbot` command again. Specify the outstanding certificate with the `-d` flag followed by the domain.

For example, `sudo certbot --apache -d www.example.com`. This could also happen if the domain does not have a corresponding virtual hosts file.
    {{< /note >}}

    {{< output >}}
Requesting a certificate for example.com and www.example.com
...
Deploying Certificate to VirtualHost /etc/apache2/sites-enabled/example.com-le-ssl.conf
Deploying Certificate to VirtualHost /etc/apache2/sites-enabled/example.com-le-ssl.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled <https://example.com> and
<https://www.example.com>
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
...

* Congratulations! Your certificate and chain have been saved at:
/etc/letsencrypt/live/example.com/fullchain.pem
Your key file has been saved at:
/etc/letsencrypt/live/example.com/privkey.pem
Your certificate will expire on 2021-05-31.
    {{< /output >}}

1. To confirm Apache can handle HTTPS requests for the domain, navigate to the site using the `https://` prefix. For example, for the domain name `example.com`, enter `https://www.example.com` in the address bar of the browser. If a lock appears next to the URL, then HTTPS is working as expected, and the domain is more secure. The browser displays a warning page if the certificate is not installed properly or if authentication fails.

{{< note >}}
The `ufw` firewall can continue to allow regular HTTP requests. Apache automatically redirects any HTTP requests to the encrypted HTTPS domain and an encrypted page is provided to the user. This allows users to access a site using an HTTP-based URL, for example, from an out-of-date link. Security concerns must be weighed against ease of access here.
    {{< /note >}}

## Use Certbot to Renew an SSL Certificate

When a certificate is granted, Certbot schedules it for automatic renewal. It is not necessary to perform a manual update or run Certbot again unless the site configuration changes. However, Certbot provides a test routine to ensure auto-renewal is correctly configured.

1. To verify Certbot can renew certificates automatically, run the `certbot renew` command using the `dry-run` flag.

        sudo certbot renew --dry-run
    Certbot inspects the certificates and determines whether or not they are due to be renewed, but it simulates the procedure in either case. It indicates whether the renewal would have been successful.
    {{< output >}}
Cert not due for renewal, but simulating renewal for dry run
...
Congratulations, all simulated renewals succeeded:
/etc/letsencrypt/live/example.com/fullchain.pem (success)
/etc/letsencrypt/live/www.example.com/fullchain.pem (success)
{{< /output >}}
1. To manually renew all certificates, run the `renew` command without any options.

        sudo certbot renew
    {{< note >}}
Certbot does not renew the certificates unless they are scheduled to expire soon. Adding the `--force-renewal` flag forces the command to renew all certificates regardless of status. This is not recommended, and there is no real reason to do this. Do not use this option too frequently as this could exceed the *Let's Encrypt* [rate limit](https://letsencrypt.org/docs/rate-limits/) for a domain.
    {{< /note >}}
1. Use the `certonly` command to change the information on a certificate and obtain a new version. This operation repeats the steps from the original certification event and updates any new information. It should only be used to change something about the certificate, such as the contact name or domain name.

        sudo certbot certonly --apache

## Use Certbot to Delete an SSL Certificate

The `certbot revoke` command revokes and deletes a certificate. The `--cert-path` parameter must indicate the location of the certificate. Certbot provided this information when it granted the certificate.

    sudo certbot revoke --cert-path /etc/letsencrypt/live/www.example.com/fullchain.pem
{{< caution >}}
Do not use this option if you plan to host this domain on the same Linode again. Certbot might not always clean up the configuration files properly, and there could be errors if you request the same certificate again later.
{{< /caution >}}

## Learn More About Certbot

Certbot is straightforward to use, but EFF has plenty of documentation available for more advanced scenarios.

* The [*Certbot FAQ*](https://certbot.eff.org/faq) covers many common problems, and the Certbot site features an extensive [documentation section](https://certbot.eff.org/docs/).
* Support requests should be directed to the [*Let's Encrypt community*](https://community.letsencrypt.org/).
