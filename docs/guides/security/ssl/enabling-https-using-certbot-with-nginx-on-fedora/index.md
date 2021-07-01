---
slug: enabling-https-using-certbot-with-nginx-on-fedora
author:
  name: Linode
  email: docs@linode.com
description: "This guide will show you how to install and use Certbot with NGINX on Fedora. Certbot is a tool that automates the process of requesting a signed TLS/SSL certificate through Let’s Encrypt, easily enabling HTTPS on your websites."
og_description:  "This guide will show you how to install and use Certbot with NGINX on Fedora. Certbot is a tool that automates the process of requesting a signed TLS/SSL certificate through Let’s Encrypt, easily enabling HTTPS on your websites."
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'NGINX']
tags: ['ssl','nginx', 'fedora']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
title: "Enabling HTTPS Using Certbot with NGINX on Fedora"
h1_title: "Securing Web Traffic Using Certbot with NGINX on Fedora"
enable_h1: true
aliases: ['/quick-answers/websites/how-to-install-certbot-on-centos-8/','/quick-answers/websites/certbot/how-to-install-certbot-on-centos-8/','/guides/how-to-install-certbot-on-centos-8/']
relations:
    platform:
        key: how-to-use-certbot-with-nginx
        keywords:
            - distribution: Fedora
---

This guide provides instructions on using the open source [Certbot](https://certbot.eff.org/) utility with the NGINX web server on Fedora. Certbot dramatically reduces the effort (and cost) of securing your websites with HTTPS. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on NGINX (or other web servers).

**Supported distributions:** Recent non-EOL releases of Fedora. Older releases of Fedora may still work, though they haven't been tested.

## Before You Begin

Before continuing with this guide, you need a website accessible over HTTP using your desired domain name. Breaking this down further, the following components are required:

1.  **A server running on Fedora (or another supported distribution)** with credentials to a standard user account (belonging to the `sudo` group) and the ability to access the server through[SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-linode-shell-lish/). Review the [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/guides/securing-your-server/) guides for information on deploying and configuring a Linode Compute Instance.

2.  **A registered domain name with DNS records pointing to the IPv4 (and optionally IPv6) address of your server.** A domain can be obtained through any registrar and can utilize any DNS service, such as Linode's [DNS Manager](/docs/platform/manager/dns-manager/). Review the [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) guide for more information on configuring DNS.

3.  **The NGINX web server software installed on your server and configured for your domain.** You can review the [NGINX](https://fedoraproject.org/wiki/Nginx) guide on Fedora's docs for information on installing and configuring NGINX.
{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< content "understanding-https-tls-certbot-shortguide" >}}

{{< content "configuring-firewalld-for-web-traffic-shortguide" >}}

{{< content "installing-snapd-certbot-dnf-shortguide" >}}

{{< content "requesting-certificate-nginx-certbot-shortguide" >}}

{{< content "testing-https-certbot-shortguide" >}}

{{< content "renewing-certificate-certbot-shortguide" >}}

{{< content "deleting-certificate-certbot-shortguide" >}}

{{< content "learn-more-certbot-shortguide" >}}