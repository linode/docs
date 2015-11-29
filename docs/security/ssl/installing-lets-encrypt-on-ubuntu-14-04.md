---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing and configuring Let's Encrypt SSL certificates on Ubuntu 14.04 LTS'
keywords: '14.04,ACME,free,HTTPS,Let's Encrypt,LTS,SSL,Ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Sunday, November 29th, 2015'
title: 'Installing Let's Encrypt on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

Let's Encrypt is an SSL certificate authority managed by the Internet Security Research Group (ISRG). It utilizes the Automated Certificate Management Environment (ACME) to automatically deploy browser-trusted SSL certificates to anyone for free. Unlike traditional certificate authorities, Let's Encrypt uses automated domain validation, requiring the ACME client be installed on any server using a Let's Encrypt certificate.

This tutorial will cover the following on a Ubuntu 14.04 server:
- Installing the Let's Encrypt ACME client
- Automatic configuration versus manual configuration
- Apache and Nginx HTTPS configuration
- Required attention and maintenance
- Technical details about Let's Encrypt certificates


Heel, web traveler! This tutorial is not complete yet. Author is waiting for Let's Encrypt to enter public beta on Thursday, December 3rd, 2015 before making further additions.
