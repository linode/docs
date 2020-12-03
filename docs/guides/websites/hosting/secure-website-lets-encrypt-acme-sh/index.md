---
slug: secure-website-lets-encrypt-acme-sh
author:
  name: Andy Heathershaw
  email: andy@andysh.uk
description: "acme.sh is an alternative to the popular Certbot. This guide shows you how to secure a website using acme.sh with SSL certificates from Let's Encrypt."
og_description: "acme.sh is an alternative to the popular Certbot. This guide shows you how to secure a website using acme.sh with SSL certificates from Let's Encrypt."
keywords: ['ssl','lets encrypt','https','website','websites','acme.sh','secure']
tags: ['http', 'ssl', 'apache', 'nginx', 'security', 'automation']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-12-03
modified_by:
  name: Andy Heathershaw
title: "Secure a website or domain with Let\'s Encrypt and acme.sh"
h1_title: "Secure a website or domain with a Let\'s Encrypt SSL certificate using acme.sh"
contributor:
  name: Andy Heathershaw
  link: https://andysh.uk
external_resources:
- '[acme.sh](https://acme.sh/)'
- '[Use Linode domain API (acme.sh wiki)](https://github.com/acmesh-official/acme.sh/wiki/dnsapi#14-use-linode-domain-api)'
- '[Let''s Encrypt](https://letsencrypt.org/)'
---

## Introduction

[acme.sh](https://acme.sh/) is a client application for ACME-compatible services, such as those used by [Let's Encrypt](https://letsencrypt.org/). It is an alternative to the popular [Certbot](/docs/guides/quick-answers/websites/) application with two big benefits:

- It is written as pure shell scripting so it has no dependencies

- It supports [**a lot** more DNS providers](https://github.com/acmesh-official/acme.sh/wiki/dnsapi).

If you use Linode for your website's DNS, you can use acme.sh to obtain both single and wildcard SSL certificates, using Linode DNS as the domain ownership verification.

## Before You Begin

1. Ensure that you have followed the [Getting Started](/docs/getting-started/) and the [Securing Your Server](/docs/security/securing-your-server/) guides.

2. Decide which user account will issue and renew the certificates and switch to this user. If you want to automatically restart a web server, or write certificates to a restricted folder, you will likely want to install acme.sh under root.

## Install acme.sh

Connect to your Linode and request the acme.sh installer:

    curl https://get.acme.sh | sh

Or, if curl is not available on your system:

    wget -O - https://get.acme.sh | sh

{{< output >}}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   775    0   775    0     0   1283      0 --:--:-- --:--:-- --:--:--  1280
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  193k  100  193k    0     0  1729k      0 --:--:-- --:--:-- --:--:-- 1729k
[Thu 30 Jul 2020 07:48:58 AM UTC] Installing from online archive.
[Thu 30 Jul 2020 07:48:58 AM UTC] Downloading https://github.com/acmesh-official/acme.sh/archive/master.tar.gz
[Thu 30 Jul 2020 07:48:58 AM UTC] Extracting master.tar.gz
[Thu 30 Jul 2020 07:48:58 AM UTC] It is recommended to install socat first.
[Thu 30 Jul 2020 07:48:58 AM UTC] We use socat for standalone server if you use standalone mode.
[Thu 30 Jul 2020 07:48:58 AM UTC] If you don't use standalone mode, just ignore this warning.
[Thu 30 Jul 2020 07:48:58 AM UTC] Installing to /root/.acme.sh
[Thu 30 Jul 2020 07:48:58 AM UTC] Installed to /root/.acme.sh/acme.sh
[Thu 30 Jul 2020 07:48:58 AM UTC] Installing alias to '/root/.bashrc'
[Thu 30 Jul 2020 07:48:58 AM UTC] OK, Close and reopen your terminal to start using acme.sh
[Thu 30 Jul 2020 07:48:58 AM UTC] Installing cron job
no crontab for root
no crontab for root
[Thu 30 Jul 2020 07:48:58 AM UTC] Good, bash is found, so change the shebang to use bash as preferred.
[Thu 30 Jul 2020 07:48:59 AM UTC] OK
[Thu 30 Jul 2020 07:48:59 AM UTC] Install success!
{{< /output >}}

As the message suggests, log out and back in to your Linode.

You should now be able to use acme.sh:

    acme.sh version

{{< output >}}
https://github.com/acmesh-official/acme.sh
v2.8.7
{{< /output >}}

## Create an API token

acme.sh can use the Linode v4 API to create and remove some temporary DNS records on your domain. Follow the steps in the "Create an API Token" section in [Get An API Access Token](/docs/products/tools/linode-api/guides/get-access-token/) product documentation to create a token.

Ensure the token you create has "Read/Write" access to "Domains".

## Issue a certificate

Set an environment variable for the API token you obtained in the step above, and issue the certificate:

    export LINODE_V4_API_KEY="your-api-token-here"
    acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d *.example.com

{{< note >}}
The above command will issue a wildcard certificate for example.com, which covers "example.com" and any subdomains under it.
If you only need to secure "www.example.com", you can issue the command as follows, which covers the non-www (example.com) and www version of the domain (www.example.com):

    acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d www.example.com
{{< /note >}}

acme.she will create two temporary DNS records on your domain using the Linode API and wait for 90 seconds for the records to be pushed to Linode's nameservers.

{{< output >}}
[Thu 30 Jul 2020 12:21:13 PM UTC] Multi domain='DNS:example.com,DNS:*.example.com'
[Thu 30 Jul 2020 12:21:13 PM UTC] Getting domain auth token for each domain
[Thu 30 Jul 2020 12:21:16 PM UTC] Getting webroot for domain='example.com'
[Thu 30 Jul 2020 12:21:16 PM UTC] Getting webroot for domain='*.example.com'
[Thu 30 Jul 2020 12:21:16 PM UTC] Adding txt value: MxeTNC7H4t0zCKF0VKW0J5v2kOTK9knc1a9tAtHrvcw for domain:  _acme-challenge.example.com
[Thu 30 Jul 2020 12:21:16 PM UTC] Using Linode
[Thu 30 Jul 2020 12:21:17 PM UTC] Domain resource successfully added.
[Thu 30 Jul 2020 12:21:17 PM UTC] The txt record is added: Success.
[Thu 30 Jul 2020 12:21:17 PM UTC] Adding txt value: kya3jvonWoGlaNJbzz42oA0e_-hhwocyZFOsWtqUTCI for domain:  _acme-challenge.example.com
[Thu 30 Jul 2020 12:21:17 PM UTC] Using Linode
[Thu 30 Jul 2020 12:21:18 PM UTC] Domain resource successfully added.
[Thu 30 Jul 2020 12:21:18 PM UTC] The txt record is added: Success.
[Thu 30 Jul 2020 12:21:18 PM UTC] Sleep 90 seconds for the txt records to take effect
{{< /output >}}

After 90 seconds, acme.sh will instruct Let's Encrypt to verify the domain and issue the certificate. If all went well, you will see the location to your certificate files:

{{< output >}}
[Thu 30 Jul 2020 12:23:07 PM UTC] Your cert is in  /root/.acme.sh/example.com/example.com.cer
[Thu 30 Jul 2020 12:23:07 PM UTC] Your cert key is in  /root/.acme.sh/example.com/example.com.key
[Thu 30 Jul 2020 12:23:07 PM UTC] The intermediate CA cert is in  /root/.acme.sh/example.com/ca.cer
[Thu 30 Jul 2020 12:23:07 PM UTC] And the full chain certs is there:  /root/.acme.sh/example.com/fullchain.cer
{{< /output >}}

## Configure your web server

You can now use the certificate files listed above to secure your website. This step will vary depending on your web server.

### Apache

These lines (or lines similar to these) should be included in your site configuration files:

{{< file "" >}}
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /root/.acme.sh/example.com/fullchain.cer
    SSLCertificateKeyFile /root/.acme.sh/example.com/example.com.key
    ...
</VirtualHost>
{{< /file >}}

You will also need to have SSL enabled for Apache. To enable it, run:

    a2enmod ssl

After updating your site configuration, reload Apache:

- On Debian-based distributions, run:

        systemctl reload apache2

- On CentOS and other Red Hat-based distributions, run:

        systemctl reload httpd

### NGINX

These lines (or lines similar to these) should be included in your site configuration files:

{{< file "" >}}
server {
    listen 443 ssl;

    ssl_certificate /root/.acme.sh/example.com/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/example.com/example.com.key;
    ...
}
{{< /file >}}

After updating your site configuration, reload NGINX. On systemd-based distributions, run:

    systemctl reload nginx

## Renewing the Certificate

Like the official Let's Encrypt client (Certbot), acme.sh will automatically renew your certificates. When you installed the software earlier, the installer also created a cron job. This cron job runs automatically at a random time each day:

    crontab -l

{{< output >}}
58 0 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
{{< /output >}}

This job will check for certificates coming up for expiry and will renew them. You can instruct acme.sh to automatically install the certificates to a location readable by your web server, and to reload the web server after renewal, so it's completely automated. These options are available when you issue a certificate:

| Option | Purpose |
|:--------------|:------------|
| \-\-cert-file | Location to save the new certificate file. |
| \-\-key-file | Location to save the private key file. |
| \-\-fullchain-file | Location to save the file containing the full chain of certificates. |
| \-\-reloadcmd | Command to run after a certificate has been renewed. |

For example, to put your certificates in `/etc/ssl/example.com` and restart Apache after a renewal:

    acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d www.example.com \
        --cert-file /etc/ssl/example.com/example.com.cer \
        --key-file /etc/ssl/example.com/example.com.key \
        --fullchain-file /etc/ssl/example.com/fullchain-example.com.cer \
        --reloadcmd "systemctl restart apache2"

{{< note >}}
The target directory must exist first. To create it, run:

    mkdir -p /etc/ssl/example.com
{{< /note >}}

{{< note >}}
This new example command uses certificate filesystem locations (under `/etc/ssl/`) that are different from the examples in the [Configure your Web Server](#configure-your-web-server) section (which used the `/root/.acme.sh/` folder). If you want to copy this exact example command, make sure that your web server configurations use the correct locations.
{{< /note >}}

You will now see a few more lines of output:

{{< output >}}
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing cert to:/etc/ssl/example.com/example.com.cer
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing key to:/etc/ssl/example.com/example.com.key
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing full chain to:/etc/ssl/example.com/fullchain-example.com.cer
[Thu 30 Jul 2020 12:42:06 PM UTC] Run reload cmd: systemctl restart apache2
{{< /output >}}