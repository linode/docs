---
slug: enabling-https-using-certbot-with-nginx-on-centos-7
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to install and use Certbot with NGINX on CentOS/RHEL 7, which automates the process adding TLS/SSL to your websites."
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'NGINX']
tags: ['ssl','nginx', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
title: "Enabling HTTPS Using Certbot with NGINX on CentOS/RHEL 7"
h1_title: "Securing Web Traffic Using Certbot with NGINX on CentOS/RHEL 7"
enable_h1: true
relations:
    platform:
        key: how-to-use-certbot-with-nginx
        keywords:
            - distribution: CentOS/RHEL 7
---

This guide provides instructions on using the open source [Certbot](https://certbot.eff.org/) utility with the NGINX web server on CentOS 7 and RHEL 7. Certbot dramatically reduces the effort (and cost) of securing your websites with HTTPS. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on NGINX (or other web servers).

**Supported distributions:** RHEL 7 and CentOS 7

## Before You Begin

Before continuing with this guide, you need a website accessible over HTTP using your desired domain name. Breaking this down further, the following components are required:

1.  **A server running on CentOS 7 or RHEL 7** with credentials to a standard user account (belonging to the `sudo` group) and the ability to access the server through[SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/). [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) and [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guides for information on deploying and configuring a Linode Compute Instance.

2.  **A registered domain name with DNS records pointing to the IPv4 (and optionally IPv6) address of your server.** A domain can be obtained through any registrar and can utilize any DNS service, such as Linode's [DNS Manager](/docs/guides/dns-manager/). Review the [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) guide for more information on configuring DNS.

3.  **The NGINX web server software installed on your server and configured for your domain.** You can review the [Install a LEMP Stack on CentOS 7](/docs/guides/lemp-stack-on-centos-7-with-fastcgi/) guide for information on installing and configuring NGINX.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

{{< content "understanding-https-tls-certbot-shortguide" >}}

{{< content "configuring-firewalld-for-web-traffic-shortguide" >}}

{{< content "installing-snapd-certbot-yum-shortguide" >}}

{{< content "requesting-certificate-nginx-certbot-shortguide" >}}

{{< content "testing-https-certbot-shortguide" >}}

{{< content "renewing-certificate-certbot-shortguide" >}}

{{< content "deleting-certificate-certbot-shortguide" >}}

{{< content "learn-more-certbot-shortguide" >}}