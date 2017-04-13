---
author:
  name: Linode
  email: docs@linode.com
keywords: 'LEMP,LEMP stack,LEMP server'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['lemp-guides/','websites/lemp/']
published: 'Tuesday, June 29th, 2010'
title: LEMP Guides
---

The LEMP stack configured in these documents is established in contrast to the popular [LAMP Stack](/docs/lamp-guides/) used to power many popular web applications. "LAMP" refers to a Linux-based operating system, the Apache web server, the MySQL database server, and the PHP programing language. It is common to substitute other programing languages like Python, Perl, and even Ruby for PHP. The "LEMP" configuration replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP) to increase the ability of the server to scale in response to demand. Furthermore, these guides provide instructions for deploying applications written in Python and Perl in addition to PHP, and for configuring the PostgreSQL database as an alternative to MySQL if your applications support this database server.

These guides provide quick and straightforward instruction for deploying your server from a fresh install with a root prompt (see [Getting Started](/docs/getting-started/) for prerequisite steps) to a fully functional LEMP stack. LEMP provides a platform for applications that is compatible with the LAMP stack for nearly all applications; however, because nginx is able to serve more pages at once with a more predictable memory usage profile, it may be more suited to high demand situations.
