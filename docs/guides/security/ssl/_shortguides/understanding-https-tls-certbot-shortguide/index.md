---
# Shortguide: Understanding HTTPS, TLS, Let's Encrypt, and Certbot

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: understanding-https-tls-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Understanding HTTPS, TLS, Let's Encrypt, and Certbot

### HTTPS and TLS/SSL

HTTPS builds upon the original *Hypertext Transfer Protocol* (HTTP) standard to offer a more secure browsing experience. It encrypts network traffic using the *Transport Layer Security* (TLS) protocol, which replaces the older (and now deprecated) *Secure Sockets Layer* (SSL) technology. HTTPS protects the privacy and integrity of any data in transit and authenticates a website for the end-user. For this reason, HTTPS must be implemented on websites that handle financial or personal data. However, all domains are strongly encouraged to enable HTTPS and a majority of all sites now use it. Review the [Understanding TLS Certificates and Connections](/docs/guides/what-is-a-tls-certificate/) to learn more about TLS.

### Let's Encrypt

A web server must possess a signed public-key certificate from a trusted Certificate Authority before it can accept HTTPS requests. *Let's Encrypt* is one of the most widely-used of these authorities. It manages a free automated service that distributes basic SSL/TLS certificates to eligible websites. Let's Encrypt leverages the *Automatic Certificate Management Environment* (ACME) protocol to automate the certificate granting process through a challenge-response technique. The [*Let's Encrypt*](https://letsencrypt.org/how-it-works/) site provides more comprehensive technical details about domain validation.

### Certbot

Certbot was developed by the *Electronic Frontier Foundation* (EFF) with the end goal of improving web security by enabling HTTPS. It is compatible with most operating systems as well as the most popular web server software, such as Apache and NGINX. Certbot is responsible for communicating with Let's Encrypt to request the certificate, perform any required ACME challenges, install the certificate, and configure the web server. It can also automatically handle the certificate renewal process. See the [About Certbot](https://certbot.eff.org/about/) page on Certbot's website for additional information