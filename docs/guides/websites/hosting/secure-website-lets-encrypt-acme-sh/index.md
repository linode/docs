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
title: 'Secure a Website or Domain with Let''s Encrypt and acme.sh'
h1_title: 'Secure a Website or Domain with a Let''s Encrypt SSL Certificate and acme.sh'
contributor:
  name: Andy Heathershaw
  link: https://andysh.uk
external_resources:
- '[acme.sh](https://acme.sh/)'
- '[Use Linode domain API (acme.sh wiki)](https://github.com/acmesh-official/acme.sh/wiki/dnsapi#14-use-linode-domain-api)'
- '[Let''s Encrypt](https://letsencrypt.org/)'
---
[*acme.sh*](https://acme.sh/) is a client application for ACME-compatible services, like those used by [Let's Encrypt](https://letsencrypt.org/). It is an alternative to the popular [Certbot](/docs/guides/quick-answers/websites/) application with two big benefits:

- It is written in the Shell language, so it has no dependencies

- acme.sh supports [more DNS providers](https://github.com/acmesh-official/acme.sh/wiki/dnsapi) than other similar clients.

If you use Linode for your website's DNS, you can use acme.sh to obtain both single and wildcard SSL certificates. You can use [Linode DNS](/docs/guides/dns-manager/) as the domain ownership verification.

## Before You Begin

1. Deploy a Linode by following the [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) and the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guides.

1. Ensure that either NGINX or the Apache web server is installed and pre-configured on your distro by following our [web server documentation](/docs/guides/web-servers/). Ensure that port 443 is open on your firewall to allow for SSL/TLS resolution.

1. Decide which system user you want to issue and renew your certificates and [connect to your Linode as this user via SSH](/docs/guides/set-up-and-secure/#connect-to-the-instance). If you want to automatically restart a web server, or write certificates to a restricted folder, you likely want to install acme.sh under root.

## Install acme.sh

1.  If you have not already done so, connect to your Linode and request the acme.sh installer:

        curl https://get.acme.sh | sh

    Or, if curl is not available on your system use `wget`:

        wget -O - https://get.acme.sh | sh

    You should see a similar output:

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

1. log out and back in to your Linode as suggested by the output.

1. Issue the following command to ensure that you have access to acme.sh:

        acme.sh version

    You should see the version acme.sh version returned in the output:

    {{< output >}}
https://github.com/acmesh-official/acme.sh
v2.8.7
{{< /output >}}

1. Finally, enter the following command to add an email address to be used with acme.sh to register your certificates with a Certificate Authority, replacing the `<email_address>` field with the e-mail address you will be registering with:

        acme.sh --register-account -m <email_address>


## Create an API token

acme.sh can use the [Linode v4 API](/docs/api) to create and remove temporary DNS records for a Domain. Follow the steps [Get An API Access Token](/docs/products/tools/linode-api/guides/get-access-token/) product documentation to create a Linode API v4 token.

{{< note >}}
Ensure the token you create has **Read/Write** access to **Domains**.
{{</ note >}}

## Issue a certificate

1. [Connect to your Linode](/docs/guides/getting-started#connect-to-your-linode-via-ssh) and set an environment variable for the API token you obtained in the previous section. Replace `your-api-token-here` with your own token.

        export LINODE_V4_API_KEY="your-api-token-here"

1. Issue the certificate. Replace any instance of `example.com` with the domain you for which you want to issue a certificate.

        acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d *.example.com

    {{< note >}}
The above command issues a wildcard certificate for `example.com`, which covers `example.com` and any subdomains under it.

If you only need to secure `www.example.com`, you can issue the example command. This command covers the non-www (`example.com`) and www version of the domain (`www.example.com`). Replace `example.com` with your own domain.

    acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d www.example.com
{{< /note >}}

    acme.sh creates two temporary DNS records on your domain using the Linode API. Wait approximately 90 seconds for the records to be pushed to Linode's nameservers.

    You should see a similar output:

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

1. After 90 seconds, acme.sh instructs Let's Encrypt to verify the domain and issue the certificate. If all went well, the output returns the location to your certificate files:

    {{< output >}}
[Thu 30 Jul 2020 12:23:07 PM UTC] Your cert is in  /root/.acme.sh/example.com/example.com.cer
[Thu 30 Jul 2020 12:23:07 PM UTC] Your cert key is in  /root/.acme.sh/example.com/example.com.key
[Thu 30 Jul 2020 12:23:07 PM UTC] The intermediate CA cert is in  /root/.acme.sh/example.com/ca.cer
[Thu 30 Jul 2020 12:23:07 PM UTC] And the full chain certs is there:  /root/.acme.sh/example.com/fullchain.cer
{{< /output >}}

## Configure your web server

You can now use the certificate files listed above to secure your website. The required steps may vary depending on your web server. Follow the section for the web server you are using.

### Apache

1. Copy and paste the contents of the example file to your site's Apache virtual hosts configuration file. Replace `example.com` with your own site's domain.

    {{< file "/etc/apache2/sites-available/example.conf" >}}
<VirtualHost *:443>
    SSLEngine on
    SSLCertificateFile /root/.acme.sh/example.com/fullchain.cer
    SSLCertificateKeyFile /root/.acme.sh/example.com/example.com.key
    ...
</VirtualHost>
{{< /file >}}

1. Enable SSL for Apache:

        a2enmod ssl

1. Reload Apache for your configuration file updates to take effect:

    - On Debian-based distributions run the following command:

            systemctl reload apache2

    - On CentOS and other Red Hat-based distributions run the following command:

            systemctl reload httpd

### NGINX

1. Copy and paste the contents of the example file to your site's NGINX configuration file. Replace `example.com` with your own site's domain.

    {{< file "/etc/nginx/sites-available/example.com" >}}
server {
    listen 443 ssl;

    ssl_certificate /root/.acme.sh/example.com/fullchain.cer;
    ssl_certificate_key /root/.acme.sh/example.com/example.com.key;
    ...
}
    {{< /file >}}

1. Reload NGINX for your configuration file updates to take effect. On systemd-based distributions run the following command:

        systemctl reload nginx

## Renewing the Certificate

Like the official Let's Encrypt client (Certbot), acme.sh automatically renews your certificates. When you install the acme.sh software, the installer also creates a cron job. This cron job runs automatically at a random time each day.

1. View the cron job created by the acme.sh installer:

        crontab -l

    You should see a similar output:

    {{< output >}}
58 0 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
{{< /output >}}

    This job checks for certificates coming up for expiry and renews them. You can instruct acme.sh to automatically install the certificates to a location readable by your web server and to also reload the web server after renewal. This completely automates the certificate renewal process.

### Certificate Renewal Options

The following options are available when you issue a certificate:

| Option | Purpose |
|:--------------|:------------|
| \-\-cert-file | Location to save the new certificate file. |
| \-\-key-file | Location to save the private key file. |
| \-\-fullchain-file | Location to save the file containing the full chain of certificates. |
| \-\-reloadcmd | Command to run after a certificate has been renewed. |

For example, to store your certificates in `/etc/ssl/example.com` and restart Apache after a renewal issue the example command. Replace `example.com` with your own domain.

    acme.sh --issue --dns dns_linode_v4 --dnssleep 90 -d example.com -d www.example.com \
        --cert-file /etc/ssl/example.com/example.com.cer \
        --key-file /etc/ssl/example.com/example.com.key \
        --fullchain-file /etc/ssl/example.com/fullchain-example.com.cer \
        --reloadcmd "systemctl restart apache2"

{{< note >}}
The target directory must exist first. To create it run the following command:

    mkdir -p /etc/ssl/example.com
{{< /note >}}

{{< note >}}
The example command uses certificate file system locations (`/etc/ssl/`) that are different from the examples in the [Configure your Web Server](#configure-your-web-server) section (which used the `/root/.acme.sh/` folder). If you want to copy this exact example command, make sure that your web server configurations use the correct locations.
{{< /note >}}

After issuing the command, you should see a similar output:

{{< output >}}
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing cert to:/etc/ssl/example.com/example.com.cer
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing key to:/etc/ssl/example.com/example.com.key
[Thu 30 Jul 2020 12:42:06 PM UTC] Installing full chain to:/etc/ssl/example.com/fullchain-example.com.cer
[Thu 30 Jul 2020 12:42:06 PM UTC] Run reload cmd: systemctl restart apache2
{{< /output >}}