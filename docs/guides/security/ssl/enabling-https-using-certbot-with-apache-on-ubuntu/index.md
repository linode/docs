---
slug: enabling-https-using-certbot-with-apache-on-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide shows you how to install and use Certbot with Apache on Ubuntu 20.04 LTS. Certbot is a tool that automates the process of requesting a signed TLS/SSL certificate through Let’s Encrypt, easily enabling HTTPS on your websites."
og_description: "This guide shows you how to install and use Certbot with Apache on Ubuntu 20.04 LTS. Certbot is a tool that automates the process of requesting a signed TLS/SSL certificate through Let’s Encrypt, easily enabling HTTPS on your websites."
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'Apache']
tags: ['ssl','apache','ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-02
modified: 2021-07-01
modified_by:
  name: Linode
title: "Enabling HTTPS Using Certbot with Apache on Ubuntu 20.04 and 18.04"
h1_title: "Securing Web Traffic Using Certbot with Apache on Ubuntu 20.04 and 18.04"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
aliases: ['/guides/how-to-install-certbot-for-apache-on-ubuntu-20-04/']
relations:
    platform:
        key: how-to-use-certbot-with-apache
        keywords:
            - distribution: Ubuntu
---

This guide provides instructions on using the open source [Certbot](https://certbot.eff.org/) utility with the Apache web server on Ubuntu 20.04 LTS and 18.04 LTS. Certbot dramatically reduces the effort (and cost) of securing your websites with HTTPS. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on Apache (or other web servers).

**Supported distributions:** Ubuntu 20.04 (Focal) and Ubuntu 18.04 (Bionic). Recent non-LTS releases like Ubuntu 21.04 (Hirsute) and 20.10 (Groovy) should also be supported. Ubuntu 16.04 (Xenial) should still be supported, though that LTS release is no longer receiving free security patches or software updates.

## Before You Begin

Before continuing with this guide, you need a website accessible over HTTP using your desired domain name. Breaking this down further, the following components are required:

1.  **A server running on Ubuntu 20.04 LTS and 18.04 LTS (or another supported distribution)** with credentials to a standard user account (belonging to the `sudo` group) and the ability to access the server through[SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-linode-shell-lish/). Review the [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/guides/securing-your-server/) guides for information on deploying and configuring a Linode Compute Instance.

2.  **A registered domain name with DNS records pointing to the IPv4 (and optionally IPv6) address of your server.** A domain can be obtained through any registrar and can utilize any DNS service, such as Linode's [DNS Manager](/docs/platform/manager/dns-manager/). Review the [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) guide for more information on configuring DNS.

3.  **The Apache web server software installed on your server and configured for your domain.** You can review the [How to Install Apache on Ubuntu 18.04 LTS](/docs/guides/how-to-install-nginx-ubuntu-18-04/) guide for information on installing and configuring Apache.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< content "understanding-https-tls-certbot-shortguide" >}}

{{< content "configuring-ufw-for-web-traffic-shortguide" >}}

{{< content "installing-snapd-certbot-apt-shortguide" >}}

{{< content "requesting-certificate-apache-certbot-shortguide" >}}

{{< content "testing-https-certbot-shortguide" >}}

{{< content "renewing-certificate-certbot-shortguide" >}}

{{< content "deleting-certificate-certbot-shortguide" >}}

{{< content "learn-more-certbot-shortguide" >}}