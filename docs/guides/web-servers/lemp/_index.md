---
title: LEMP Guides
description: 'These guides will help you deploy and configure a working LEMP (Linux, NGINX, MySQL, PHP) stack on your Linode to host a variety of websites and applications.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2010-06-29
keywords: ["LEMP", "LEMP stack", "LEMP server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/lemp/','/web-servers/lemp/','/lemp-guides/']
show_in_lists: true
---

The LEMP stack configured in these documents is established in contrast to the popular [LAMP Stack](/docs/lamp-guides/) used to power many popular web applications. "LAMP" refers to a Linux-based operating system, the Apache web server, the MySQL database server, and the PHP programing language. It is common to substitute other programing languages like Python, Perl, and even Ruby for PHP.

The "LEMP" configuration replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP) to increase the ability of the server to scale in response to demand. Furthermore, these guides provide instructions for deploying applications written in Python and Perl in addition to PHP, and for configuring the PostgreSQL database as an alternative to MySQL if your applications support this database server. LEMP provides a platform for applications that is compatible with the LAMP stack for nearly all applications; however, because nginx is able to serve more pages at once with a more predictable memory usage profile, it may be more suited to high demand situations.