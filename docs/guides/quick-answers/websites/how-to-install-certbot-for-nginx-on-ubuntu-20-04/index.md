---
slug: how-to-install-certbot-for-nginx-on-ubuntu-20-04
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide explains how to install Certbot on Ubuntu 20.04. It also describes how to use Certbot to install and renew SSL/TLS certificates on NGINX.'
og_description: 'This guide explains how to install Certbot on Ubuntu 20.04. It also describes how to use Certbot to install and renew SSL/TLS certificates on NGINX.'
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'NGINX']
tags: ['ssl','nginx', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-25
modified_by:
  name: Linode
title: "Use Certbot to Install SSL/TLS Certificates for NGINX on Ubuntu 20.04"
h1_title: "How to Use Certbot to Install SSL/TLS Certificates for NGINX on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[Certbot](https://certbot.eff.org/)'
- '[Lets Encrypt](https://letsencrypt.org/)'
relations:
    platform:
        key: how-to-install-certbot
        keywords:
            - distribution: Ubuntu 20.04 (NGINX)
---

This guide provides step-by-step instructions on how to install the free open source [*Certbot*](https://certbot.eff.org/) tool on Ubuntu 20.04 using NGINX. It additionally explains how to use Certbot to install and renew SSL certificates. Certbot makes it easy to request and install certificates from [*Let's Encrypt*](https://letsencrypt.org/) by automating the entire process. Once the certificate is successfully configured, *Hypertext Transfer Protocol Secure* (HTTPS) is enabled throughout the domain.

## Before You Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of Linode's [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

1.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

1.  Ensure you have already registered a *Fully Qualified Domain Name* (FQDN) for the website. The DNS records for your domain should point to your Linode server. Consult Linode's [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) and [DNS Manager](/docs/platform/manager/dns-manager/) for assistance when configuring your domain.

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Understanding How Certbot Works

### Certbot and the HTTPS Protocol

Certbot automates the steps required to enable HTTPS on a host. HTTPS is a more secure enhancement of the original *Hypertext Transfer Protocol* (HTTP) standard. It uses either *Transport Layer Security* (TLS) or the older, now deprecated, *Secure Sockets Layer* (SSL) technology for encryption. HTTPS authenticates a website and protects the privacy and integrity of any data in transit. For this reason, it is considered mandatory for websites engaging in financial transactions or requesting personal data, and is strongly recommended for all other websites. HTTPS has become more popular recently, and a majority of all domains now use it.

To accept HTTPS requests, a web server must possess a public key certificate that is signed by a trusted certificate authority. The signing verification process guarantees that the certificate holder operates the web site or server in question.

### Certbot and Let's Encrypt

Let's Encrypt is one of the most popular certificate authorities. It operates a free automated service that grants basic SSL/TLS certificates to web sites. Let's Encrypt uses the *Automatic Certificate Management Environment* (ACME) protocol, along with a challenge-response technique, to automate the certificate granting process. To accomplish this, the server that is requesting a certificate must run its own certificate management agent. This enables the server to prove it manages a domain and entitles it to request, renew, and revoke certificates in return. Technical details about domain validation can be found on the [*Let's Encrypt site*](https://letsencrypt.org/how-it-works/).

Certbot, a tool from the *Electronic Frontier Foundation* (EFF), automates the certificate granting operation with the end goal of improving web security. It allows administrators to identify their domain, manages the challenge requests and the granting process, and makes all necessary changes to the NGINX configuration. Certbot supports most operating systems and is designed to run on the web server hosting the domain.

## System Requirements

The installation procedure requires the following components be installed or enabled:

*   A recent version of NGINX.
*   A Fully Qualified Domain Name for the website with a DNS record pointing to the Linode server.
*   An HTTP-enabled website that is already online and can receive connections through *Transmission Control Protocol* (TCP) Port 80.
*   SSH access to the Linode server.

Certbot uses Python functionality to request and configure the certificate, but all necessary Python components are included when Certbot is installed.

## A Summary of the Certbot Installation and Certificate Request Process

The complete process of installing Certbot and requesting a SSL certificate consists of the following high-level steps. The following sections describe each step in more detail:

1.  Installing NGINX.
1.  Installing Certbot.
1.  Requesting a Certificate With Certbot.

## Installing NGINX

NGINX must be installed before Certbot can be used. The following instructions configure the minimal NGINX environment required to install and use Certbot. If NGINX is already installed, skip ahead to the [Installing Certbot](#installing-certbot) section. For more information about NGINX, see the Linode [NGINX configuration guide](/docs/web-servers/nginx/how-to-configure-nginx).

1.  NGINX is available as part of the default Ubuntu package, so the packages should be updated before you proceed. Reboot the system if Ubuntu advises you to do so.

        sudo apt-get update
        sudo apt-get upgrade

1.  Install the basic `nginx` package.

        sudo apt install nginx

1.  Verify the status of NGINX using `systemctl`.

        systemctl status nginx

    NGINX should display a status of `active`.

    {{< output >}}
    nginx.service - A high performance web server and a reverse proxy server
    Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
    Active: active (running) since Fri 2021-02-26 14:13:40 UTC; 34s ago
    {{< /output >}}

1.  **Optional** NGINX is configured to automatically activate when the server reboots. To change this behavior, disable NGINX in `systemctl`.

        systemctl disable nginx

1.  To increase security, configure the `ufw` firewall to deny unauthorized access attempts. First list all of the available applications using the `list` command.

        sudo ufw app list

    `Ufw` displays a list of all of the relevant applications.

    {{< output >}}
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
    {{< /output >}}

1.  Allow `ufw` to accept `OpenSSH` connections, and enable `Nginx Full`, which allows access for both HTTP and HTTPS requests.

        sudo ufw allow OpenSSH
        sudo ufw allow 'Nginx Full'

1.  Enable the firewall.

        sudo ufw enable

{{< note >}}
To host more than one website on a server, configure a location block on NGINX for each domain. This is considered a good practice even if there is only one domain on a server. See Linode's [NGINX guide](/docs/web-servers/nginx/how-to-configure-nginx) for instructions on how to do this.
{{< /note >}}

## Installing Certbot

Using Snap is the easiest way to install Certbot. This procedure is recommended because it ensures the latest version of Certbot for the server is downloaded. It also automatically sets up automated certificate renewal. To use this method, `snapd` must already be installed.

1.  Snap is pre-installed on Ubuntu 20.04. Run the following commands to update Snap and verify the current version.

        sudo snap install core
        sudo snap refresh core
        snap version

    The `version` command displays basic information about Snap in addition to information about the version.

    {{< note >}}
In the unlikely event Snap is not already installed, run the command `sudo apt install snapd` and then execute the commands in this step.
    {{< /note >}}

    {{< output >}}
snap    2.48.3+20.04
snapd   2.48.3+20.04
series  16
ubuntu  20.04
kernel  5.4.0-65-generic
    {{< /output >}}

1.  To avoid conflicts between the Snap installation and pre-existing Ubuntu packages, remove any duplicate Certbot packages using `apt-get remove`.

        sudo apt-get remove certbot

1.  Use Snap to install Certbot.

        sudo snap install --classic certbot

    The Snap module provides confirmation of the Certbot installation.

    {{< output >}}
certbot 1.12.0 from Certbot Project (certbot-eff) installed
    {{< /output >}}

1.  Configure a symbolic link to the Certbot directory using the `ln` command.

        sudo ln -s /snap/bin/certbot /usr/bin/certbot

{{< note >}}
The exact version of Certbot can be determined with the `certbot --version` command.
    {{< /note >}}

## Requesting a Certificate With Certbot

During the certificate granting process, Certbot asks a series of questions about the domain so it can properly request the certificate. You must agree to the terms of service and provide a valid administrative email address. Depending upon the server configuration, the messages displayed by Certbot might differ somewhat from what is shown here.

1.  Run Certbot to start the certification process. The following command automatically edits the NGINX configuration file to allow the certificate to be served.

        sudo certbot --nginx

    {{< note >}}
Certbot saves a record of the installation log at `/var/log/letsencrypt/letsencrypt.log`. It is a good idea to review the log if there are any problems.
    {{< /note >}}

1.  Certbot displays some basic information about the installation process. It then asks for an email address where it can send urgent notices about the domain or registration. This should be the address of the web server administrator.

    {{< output >}}
Enter email address (used for urgent renewal and security notices)
 (Enter 'c' to cancel)
    {{< /output >}}

1.  Enter your email address at the prompt.

        user@example.com

1.  Certbot next asks you to agree to the Let's Encrypt terms of service.

    {{< output >}}
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server. Do you agree?
    {{< /output >}}

1.  Use the link to download the PDF file and review the document. If you agree with the terms, enter `Y`. Entering `N` terminates the certificate request.

        Y
1.  Certbot asks if you want to subscribe to the EFF mailing list. You can answer either `Y` or `N` without affecting the rest of the installation.

        Y

1.  Certbot now requests a domain name for the certificate. Certificates for multiple domains can be requested at the same time.

    {{< output >}}
No names were found in your configuration files. Please enter in your domain
name(s) (comma and/or space separated)  (Enter 'c' to cancel):
    {{< /output >}}

1.  Enter the name for each domain without the `http` or `https` prefix. For each domain name, you should request separate certificates with and without the `www` prefix. If you have more than one domain to certify, separate the names with either a space or a comma.

        www.example.com example.com

    {{< note >}}
If there is a virtual host file for the domain, Certbot displays the names of the eligible domains. Select the numbers corresponding to the domains you are requesting certificates for, separated by spaces.
    {{< /note >}}

1.  Certbot proceeds to request and install the certificates, performing any necessary challenges. If the operation is successful, Certbot confirms the certificates are enabled. It also displays some information about the directories where the certificates and key chains are stored, along with the expiration date. Certificates typically expire in 90 days.

    {{< output >}}
Requesting a certificate for www.example.com
Performing the following challenges:
http-01 challenge for www.example.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/default
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/default

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://www.example.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
...
- Congratulations! Your certificate and chain have been saved at:
/etc/letsencrypt/live/www.example.com/fullchain.pem
Your key file has been saved at:
/etc/letsencrypt/live/www.example.com/privkey.pem
our certificate will expire on 2021-05-29.
    {{< /output >}}

1. To confirm the web server is properly configured for HTTPS, request a web page from the domain using the `https://` prefix. For instance, if a domain is named `example.com`, then enter `https://www.example.com` in the address bar of the browser. If a lock is visible to the left of the domain name on the browser's address bar, then the certificate is working as expected. If the certificate is not installed properly, then the browser displays a warning page.

{{< note >}}
It is considered acceptable to leave HTTP enabled in `ufw`. NGINX automatically redirects any HTTP requests for the website to the encrypted HTTPS domain. This allows users to access a site through an HTTP-based URL, for example, from an old bookmark. As is often the case, there is a tradeoff between security and ease of access.
{{< /note >}}

## Using Certbot to Renew a SSL Certificate

Upon installation, Certbot is configured to renew any certificates automatically. It is not necessary to manually request an updated certificate or run Certbot again unless the site configuration changes. However, Certbot makes it possible to test the auto-renew mechanism or to forcibly update all certificates.

1.  To confirm Certbot is configured to renew its certificates automatically, use `certbot renew` along with the `dry-run` flag.

        sudo certbot renew --dry-run

    Certbot inspects the certificates and confirms they are not due to be renewed, but simulates the process anyway. It displays details regarding whether the renewal would have been successful.

    {{< output >}}
Cert not due for renewal, but simulating renewal for dry run
...
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/example.com/fullchain.pem (success)
  /etc/letsencrypt/live/www.example.com/fullchain.pem (success)
    {{< /output >}}

1.  To manually force Certbot to renew all certificates, use the `renew` command without any options.

        sudo certbot renew

    {{< note >}}
Certbot does not renew certificates unless they are scheduled to expire soon. However, adding the `--force-renewal` flag to the `renew` command forces all certificates to be renewed regardless of their status. However, there is usually no good reason to force renewals. Do not use the `force-renewal` option too frequently as this could exceed the Let's Encrypt [*rate limit*](https://letsencrypt.org/docs/rate-limits/) for a domain certificate.
    {{< /note >}}

1.  To change the information on a certificate and obtain a new version, use the `certonly` command. This operation steps through the questions from the original certification process again and updates the information. Do not use this option unless you want to change something about the certificate, such as the contact name.

        sudo certbot certonly --nginx

## Using Certbot to Delete a SSL Certificate

The `certbot revoke` command revokes a certificate and provides an option for deleting it. The `--cert-path` parameter must include the location of the certificate. Certbot indicated the certificate directory when it granted the certificate.

    sudo certbot revoke --cert-path /etc/letsencrypt/live/www.example.com/fullchain.pem

{{< caution >}}
This option should not be used if you plan to host this domain on the same Linode again. Certbot might not always clean up the configuration files properly, and there could be errors if you request the same certificate again later.
{{< /caution >}}

## Learning More About Certbot

Although Certbot is relatively easy and straightforward to use, EFF has plenty of documentation available for more advanced scenarios. There is a [*FAQ*](https://certbot.eff.org/faq) which covers many common problems. The Certbot site also contains an extensive [*documentation section*](https://certbot.eff.org/docs/). Support requests are best handled through the [*Let's Encrypt community page*](https://community.letsencrypt.org/).