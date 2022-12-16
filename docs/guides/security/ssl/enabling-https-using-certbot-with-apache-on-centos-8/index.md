---
slug: enabling-https-using-certbot-with-apache-on-centos-8
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to install and use Certbot with Apache on CentOS/RHEL 8, which automates the process adding TLS/SSL to your websites."
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption', 'Apache']
tags: ['ssl','apache','centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
title: "Use Certbot to Enable HTTPS with Apache on CentOS 8"
relations:
    platform:
        key: how-to-use-certbot-with-apache
        keywords:
            - distribution: CentOS/RHEL 8
---

This guide provides instructions on using the open source [Certbot](https://certbot.eff.org/) utility with the Apache web server on CentOS 8, AlmaLinux 8, and Rocky Linux 8. Certbot dramatically reduces the effort (and cost) of securing your websites with HTTPS. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on Apache (or other web servers).

**Supported distributions:** RHEL (Red Hat Enterprise Linux) 8 and its derivatives (such a CentOS 8, AlmaLinux 8, and Rocky Linux 8).

## Before You Begin

Before continuing with this guide, you need a website accessible over HTTP using your desired domain name. Breaking this down further, the following components are required:

1.  **A server running on CentOS/RHEL 8, AlmaLinux 8, or Rocky Linux 8 (or another supported distribution)** with credentials to a standard user account (belonging to the `sudo` group) and the ability to access the server through[SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/lish/). [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) and [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guides for information on deploying and configuring a Linode Compute Instance.

2.  **A registered domain name with DNS records pointing to the IPv4 (and optionally IPv6) address of your server.** A domain can be obtained through any registrar and can utilize any DNS service, such as Linode's [DNS Manager](/docs/products/networking/dns-manager/). Review the [DNS Records: An Introduction](/docs/guides/dns-overview/) guide for more information on configuring DNS.

3.  **The Apache web server software installed on your server and configured for your domain.** You can review the [How to Install Apache Web Server on CentOS 8](/docs/guides/how-to-install-apache-web-server-centos-8/) guide for information on installing and configuring Apache.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

{{< content "understanding-https-tls-certbot-shortguide" >}}

{{< content "configuring-firewalld-for-web-traffic-shortguide" >}}

{{< content "installing-snapd-certbot-dnf-rhel-shortguide" >}}

{{< content "requesting-certificate-apache-certbot-shortguide" >}}

{{< content "testing-https-certbot-shortguide" >}}

{{< content "renewing-certificate-certbot-shortguide" >}}

{{< content "deleting-certificate-certbot-shortguide" >}}

{{< content "learn-more-certbot-shortguide" >}}