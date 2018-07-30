---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows how to obtain a Let's Encrypt Wildcard SSL Certificate using Certbot tool on Ubuntu 18.04'
keywords: ["Wildcard SSL", "Let's Encrypt", "Certbot"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-07-30
modified_by:
  name: Linode
published: 2018-07-30
title: 'How To Obtain Let's Encrypt Wildcard SSL Certificate using Certbot on Ubuntu 18.04'
contributor:
  name: Gopal Raha
  link: https://github.com/gopalraha
external_resources:
 - '[Certbot documentation](https://certbot.eff.org/docs/)'
 - '[Certbot Official website](https://certbot.eff.org/)'
 - '[Lets Encrypt Official website](https://letsencrypt.org/)'
---

## What is Let's Encrypt Wildcard SSL Certificate?

[Let's Encrypt](https://letsencrypt.org/) is a Certificate Authority (CA) that offers free TLS/SSL certificates. Let's Encrypt is managed by the [Internet Security Research Group](https://letsencrypt.org/isrg/) (ISRG). It supports Automated Certificate Management Environment version-2 (ACMEv2) endpoint API and Wildcard SSL certificate. Wildcard SSL certificate is a single SSL certificate that covers all subdomains (`*.example.com`) and base domain (`example.com`) of a Fully Qualified Domain Name (FQDN). Let's Encrypt wildcard SSL certificates are trusted by all latest web browsers.

In this guide, you will learn how to obtain Let's Encrypt Wildcard SSL certificate using [Certbot](https://certbot.eff.org/) (the Let's Encrypt client) and Certbot DNS Linode plugin (Certbot plugin for automatic domain validation using Linode DNS). Certbot validates a domain name using DNS-01 challenge type provided by Let's Encrypt ACMEv2 endpoint API. This challenge includes adding two DNS TXT records to Linode DNS. As soon as, challenge completes Certbot removes DNS TXT records from Linode DNS. The process of adding and removing DNS TXT records to Linode DNS completes automatically using Certbot DNS Linode plugin. Once your domain name has been validated, the Let's Encrypt will issue a wildcard SSL certificate to you.

## Before You Begin

Before you begin this guide you will need the following:

1.   Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.   This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.   Update your system:

        sudo apt update && sudo apt upgrade
 
4.   A Fully Qualified Domain Name (FQDN) is required and it uses [Linode DNS](/docs/networking/dns/dns-manager-overview/) service. A domain name is configured to point to your Linode. You can learn how to point domain names to Linode by following the [DNS Manager Overview](/docs/networking/dns/dns-manager-overview/#add-records) guide.

  *  DNS A record with **base domain** (`example.com`) is pointing to your Server IP address.     
  *  DNS A records with all **subdomain** (`*.example.com`) is pointing to your Server IP address.

5.   The Linode API access token is required and you need to create Linode API access token by following [How to Create a Linode API Access Token](/docs/platform/api/getting-started-with-the-linode-api/#create-an-api-token) guide and be sure to note your Linode API access token. 

    {{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

With these pre-requisites in place and you are ready to begin. Now, log in to your Ubuntu 18.04 server as a sudo user and continue below:

## Install Dependencies

### Install Certbot

1.  The first step is to install the Certbot (the Let's Encrypt Client) on your Ubuntu 18.04 server. Generally, updated Certbot packages are available for installation from Personal Package Archive (PPA) software repository for Ubuntu 18.04.  

		sudo add-apt-repository ppa:certbot/certbot

2.  Now, you will install the Certbot package using `apt` package manager:

		sudo apt install certbot

### Install Certbot DNS Linode Plugin

1.  The Certbot DNS Linode plugin is a Python application. You need `pip3` in order to install Python packages from official Python’s package repository ([PyPi](https://pypi.org/)). You will install the `python3-pip` package using `apt` package manager:

		sudo apt install python3-pip

2.  Now, you have `pip3` installed and you have the ability to install python packages using `pip3`. The Certbot DNS Linode Plugin will be installed globally with `pip3`. So, that Certbot will get access to use Linode DNS using its API:

		pip3 install certbot-dns-linode 

## Set up Linode API Access Token

1.  The Linode API access token is required to work with Certbot DNS Linode plugin package. The file `linode.ini` contains Linode API access token. Now, you will create a file `linode.ini` using your favorite nano text editor into your home directory:

		nano ~/linode.ini

	{{< note >}}
You have created Linode API earlier. You need to replace it (`t8vyC14nIXnkSqGMpwZX2NjP8VMwW8BBsXr39hqAoL7TrtDODfkSBMyXrdQ9d5nN`) with your Linode API access token.
{{< /note >}}

	{{< file "~/linode.ini" conf >}}
dns_linode_key = t8vyC14nIXnkSqGMpwZX2NjP8VMwW8BBsXr39hqAoL7TrtDODfkSBMyXrdQ9d5nN
{{< /file >}}

Save and close the file when you are finished.

2.  Linode API access token is necessary for API authentication. You should provide correct secure permission to `linode.ini` file. When you will provide secure permission to it then this enables us to hide a warning shown by Certbot **Unsafe permissions on credentials configuration file** during the process of obtaining wildcard certificates:

		chmod 600 ~/linode.ini

## Obtain Let's Encrypt Wildcard SSL Certificate 

	{{< note >}}
This section requires that you have a Fully Qualified Domain Name (FQDN) that is configured to point to your Linode. In the examples below, replace `example.com` with your FQDN.
{{< /note >}}

1.  Certbot will obtain Let's Encrypt Wildcard SSL certificate using `certonly` subcommand. By default, it will attempt to use Linode DNS for Domain Validation (DV) purpose. The preferred challenge during domain authorization includes DNS-01 challenge type and it can be done automatically using Certbot DNS Linode plugin:

  {{< note >}}
This command requires patience and estimate waiting time is **960 seconds** or **16 minutes** for DNS changes to propagate through DNS propagation. It is important step towards automatic Let's Encrypt Domain Validation (DV) over Linode DNS.  
{{< /note >}}

		sudo certbot certonly -d *.example.com -d example.com --dns-linode --dns-linode-credentials ~/linode.ini --server https://acme-v02.api.letsencrypt.org/directory

The **subcommands** and **flags** for obtaining the Let's Encrypt Wildcard SSL certificate are given below: 

  * `certonly` : Obtain a Let's Encrypt Wildcard SSL certificate, but do not install it.
  * `-d` : Obtain a Let's Encrypt Wildcard SSL certificate for a domain name includes all subdomain (`*.example.com`) and base domain (`example.com`), you can use two `-d` flags. 
  * `--dns-linode-plugin`: Obtain Let's Encrypt Wildcard SSL certificates using a DNS TXT record with Linode DNS.
  * `--dns-linode-credentials`: Linode API access tokens credentials in `linode.ini` file.
  * `--server`: Let's Encrypt ACMEv2 Directory Resource URL (`https://acme-v02.api.letsencrypt.org/directory`) for obtaining Let's Encrypt Wildcard SSL certificate.

2.  When prompted, you will specify your email address. This allows you to get renewal and security notices for your domain name on your inbox. Next, agree to the Let's Encrypt Terms of Service and specify whether you like to share your email address with the [Electronic Frontier Foundation](https://www.eff.org/) (EFF). If given information will appear then Let’s Encrypt approves your domain name and issue a wildcard SSL certificate to you:

	{{< output >}}
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator dns-linode, Installer None
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel): email@example.com

-------------------------------------------------------------------------------
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
-------------------------------------------------------------------------------
(A)gree/(C)ancel: A

-------------------------------------------------------------------------------
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? you'd like to send you email about EFF and
our work to encrypt the web, protect its users and defend digital rights.
-------------------------------------------------------------------------------
(Y)es/(N)o: Y

Obtaining a new certificate
Performing the following challenges:
dns-01 challenge for example.com
dns-01 challenge for example.com
Waiting 960 seconds for DNS changes to propagate
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/example.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/example.com/privkey.pem
   Your cert will expire on 2018-10-28. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
{{< /output >}}

3.  In addition, manually append Let's Encrypt Wildcard SSL certificate to your Apache web server or NGINX web server: 

  * **Apache** web server: you can follow [Configure Apache to Use the SSL Certificate](/docs/security/ssl/ssl-apache2-debian-ubuntu/#configure-apache-to-use-the-ssl-certificate) guide.

  * **NGINX** web server: you can follow [Configuring Nginx to Use the SSL Certificate](/docs/web-servers/nginx/enable-tls-on-nginx-for-https-connections/#configure-the-http-block) guide.

File location of Wildcard certificate and key are shown below:

| Name of Certificate and Key  | File Location of Certificate and Key |
| ---------------- |:-------------:|
| **Fullchain Certificate** (Your certificate + chain combined)  | `/etc/letsencrypt/live/example.com/fullchain.pem` |
| **Private Key** (Your certificate's private key) | `/etc/letsencrypt/live/example.com/privkey.pem` |
| **Public Key Certificate** (Your domain certificate)  | `/etc/letsencrypt/live/example.com/cert.pem` |
| **Certificate Chain** (Your chain certificate) | `/etc/letsencrypt/live/example.com/chain.pem` |

## Automatically Renew Let's Encrypt Wildcard SSL Certificate 

1.  Let’s Encrypt Wildcard SSL certificates are valid for 90-days. You will renew your certificates before its expiry date. While checking use the flag `--dry-run` after the `certbot renew` command. Check whether renew scripts are working or not:

  {{< note >}}
This command requires patience and estimate waiting time is **960 seconds** or **16 minutes** for DNS changes to propagate through DNS propagation. It is important step towards automatic Let's Encrypt Domain Validation (DV) over Linode DNS.  
{{< /note >}}

		sudo certbot renew --dry-run

The **subcommands** and **flags** for renewing a Let's Encrypt Wildcard SSL certificate are given below: 

  * `renew`: It will attempt to renew all the Let's Encrypt Wildcard SSL certificates that you have previously obtained.  
  * `--dry-run`: Perform a test run of the Certbot to obtain test certificates but not saving them to disk. 

2.  Schedule automatic certificate renewal using `crontab`. This task will enable certificate renewal at a scheduled time:

		sudo crontab -e

During first run, select default text editor as a nano (`/bin/nano`) text editor. The given example, shows `crontab` will run every 24 hours. You can [set your own crontab schedule from various examples](https://crontab.guru/examples.html). In advance, `certbot renew` command will renew your wildcard certificate at a scheduled time:

	{{< file "crontab" conf >}}
0 0 * * * certbot renew
{{< /file >}}

Save and close the file when you are finished.

## Next Steps

In this guide, you have learned how to obtain Let's Encrypt Wildcard SSL certificates using Certbot tool. This can help you to secure all your subdomain and base domain with a single SSL certificate. It also allows you to take advantage of HTTPS to secure your web servers. If you are managing multi-domain website then these wildcard certificates are perfect and easy to integrate. For more information about Certbot's configuration options, check out the [Certbot Documentation](https://certbot.eff.org/docs/).
