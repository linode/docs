---
author:
  name: Edward Angert
  email: docs@linode.com
keywords: ["let's encrypt", "certbot", "ssl", "tls", "https"]
description: "This quick answer shows how to use Certbot to secure your site's traffic via TLS."
og_description: "This quick answer shows how to use Certbot to secure your site's traffic via TLS."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-06-27
modified_by:
  name: Linode
published: 2018-06-27
title: Secure HTTP Traffic with Certbot
external_resources:
  - '[Certbot Official Documentation](https://certbot.eff.org/docs/)'
---

## What is Certbot?

Certbot is a tool that automates the process of getting a signed certificate via [Let's Encrypt](https://letsencrypt.org/how-it-works/) to use with TLS.

For most operating system and web server configurations, Certbot creates signed certificates, manages the web server to accept secure connections, and can automatically renew certificates it has created. In most cases, Certbot can seamlessly enable HTTPS without causing server downtime.

## Before You Begin

Make sure you have a Fully Qualified Domain Name (FQDN) with a DNS A/AAA record pointing to the domain's Public IP address. Consult [Add DNS Records](/docs/websites/hosting-a-website/#add-dns-records) for more information.

{{< note >}}
If you're using Apache, change each instance of `nginx` to `apache` in the following sections.
{{< /note >}}

## Use Certbot on Debian

{{< content "certbot-shortguide-debian" >}}

## Use Certbot on Ubuntu

{{< content "certbot-shortguide-ubuntu" >}}

## Use Certbot on CentOS 7

{{< content "certbot-shortguide-centos" >}}

## Use Certbot to Renew All Certificates

You can renew all existing certificates that will expire in under 30 days with the following command:

    certbot renew
