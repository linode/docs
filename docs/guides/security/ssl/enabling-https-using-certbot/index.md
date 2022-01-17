---
slug: enabling-https-using-certbot
author:
  name: Linode
  email: docs@linode.com
description: 'This guide contains a list of tutorials which outline different ways to install and use the Certbot utility with Apache web server on Linux.'
og_description:  'This guide contains a list of tutorials which outline different ways to install and use the Certbot utility with Apache web server on Linux.'
keywords: ['Certbot','SSL Certificates','HTTPS','Encryption']
tags: ["ssl", "security", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
image: CERTBOT.jpg
modified_by:
  name: Linode
title: "Enabling HTTPS Using Certbot"
h1_title: "Securing Web Traffic Using Certbot"
enable_h1: true
---

The [Certbot](https://certbot.eff.org/) utility automates all processes involved in obtaining and installing a TLS/SSL certificate. It works directly with the free [Let's Encrypt](https://letsencrypt.org/) certificate authority to request (or renew) a certificate, prove ownership of the domain, and install the certificate on Apache, NGINX, or other web servers. This allows Certbot to dramatically reduce the effort (and cost) of securing your websites with HTTPS.

The following tutorials outline how to install and use Certbot with either Apache or NGINX on various Linux distributions.

## Apache

- **CentOS/RHEL 7**:[Securing Web Traffic Using Certbot with Apache on CentOS/RHEL 7](/docs/guides/enabling-https-using-certbot-with-apache-on-centos-7)

- **CentOS/RHEL 8**:[Securing Web Traffic Using Certbot with Apache on CentOS/RHEL 8](/docs/guides/enabling-https-using-certbot-with-apache-on-centos-8)

- **Debian**:[Securing Web Traffic Using Certbot with Apache on Debian 10 and 9](/docs/guides/enabling-https-using-certbot-with-apache-on-debian)

- **Fedora**:[Securing Web Traffic Using Certbot with Apache on Fedora](/docs/guides/enabling-https-using-certbot-with-apache-on-fedora)

- **Ubuntu**:[Securing Web Traffic Using Certbot with Apache on Ubuntu 20.04 and 18.04](/docs/guides/enabling-https-using-certbot-with-apache-on-ubuntu)

## NGINX

- **CentOS/RHEL 7**:[Securing Web Traffic Using Certbot with NGINX on CentOS/RHEL 7](/docs/guides/enabling-https-using-certbot-with-nginx-on-centos-7)

- **CentOS/RHEL 8**:[Securing Web Traffic Using Certbot with NGINX on CentOS/RHEL 8](/docs/guides/enabling-https-using-certbot-with-nginx-on-centos-8)

- **Debian**:[Securing Web Traffic Using Certbot with NGINX on Debian 10 and 9](/docs/guides/enabling-https-using-certbot-with-nginx-on-debian)

- **Fedora**:[Securing Web Traffic Using Certbot with NGINX on Fedora](/docs/guides/enabling-https-using-certbot-with-nginx-on-fedora)

- **Ubuntu**:[Securing Web Traffic Using Certbot with NGINX on Ubuntu 20.04 and 18.04](/docs/guides/enabling-https-using-certbot-with-nginx-on-ubuntu)