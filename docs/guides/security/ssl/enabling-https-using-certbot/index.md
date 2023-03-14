---
slug: enabling-https-using-certbot
description: "This guide contains a list of tutorials which outline different ways to install and use the Certbot utility with Apache web server on Linux."
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption']
tags: ["ssl", "security", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
image: CERTBOT.jpg
modified_by:
  name: Linode
title: "Securing Web Traffic Using Certbot"
title_meta: "Enabling HTTPS Using Certbot"
authors: ["Linode"]
---

The [Certbot](https://certbot.eff.org/) utility automates all processes involved in obtaining and installing a TLS/SSL certificate. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on Apache, NGINX, or other web servers. This allows Certbot to dramatically reduce the effort (and cost) of securing your websites with HTTPS.

The following tutorials outline how to install and use Certbot with either Apache or NGINX on various Linux distributions.

## Apache

- **CentOS/RHEL 7**:[Use Certbot to Enable HTTPS with Apache on CentOS 7](/docs/guides/enabling-https-using-certbot-with-apache-on-centos-7)

- **CentOS/RHEL 8**:[Use Certbot to Enable HTTPS with Apache on CentOS 8](/docs/guides/enabling-https-using-certbot-with-apache-on-centos-8)

- **Debian**:[Use Certbot to Enable HTTPS with Apache on Debian](/docs/guides/enabling-https-using-certbot-with-apache-on-debian)

- **Fedora**:[Use Certbot to Enable HTTPS with Apache on Fedora](/docs/guides/enabling-https-using-certbot-with-apache-on-fedora)

- **Ubuntu**:[Use Certbot to Enable HTTPS with Apache on Ubuntu 20.04](/docs/guides/enabling-https-using-certbot-with-apache-on-ubuntu)

## NGINX

- **CentOS/RHEL 7**:[Use Certbot to Enable HTTPS with NGINX on CentOS 7](/docs/guides/enabling-https-using-certbot-with-nginx-on-centos-7)

- **CentOS/RHEL 8**:[Use Certbot to Enable HTTPS with NGINX on CentOS 8](/docs/guides/enabling-https-using-certbot-with-nginx-on-centos-8)

- **Debian**:[Use Certbot to Enable HTTPS with NGINX on Debian](/docs/guides/enabling-https-using-certbot-with-nginx-on-debian)

- **Fedora**:[Use Certbot to Enable HTTPS with NGINX on Fedora](/docs/guides/enabling-https-using-certbot-with-nginx-on-fedora)

- **Ubuntu**:[Use Certbot to Enable HTTPS with NGINX on Ubuntu](/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu)