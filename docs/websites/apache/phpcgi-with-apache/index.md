---
deprecated: true
author:
  name: Amanda Folson
  email: docs@linode.com
description: 'Guides for using PHP/CGI with the Apache web server.'
keywords: 'Apache web server,Apache on Linode,VPS web server,php,cgi,php-cgi'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/apache/php-cgi/']
modified: Tuesday, April 19th, 2011
modified_by:
  name: System
published: 'Thursday, July 16th, 2009'
title: 'PHP/CGI with Apache'
---

In most cases, we recommend using the `mod_php` module to run PHP scripts with the [Apache HTTP server](/docs/web-servers/apache/). However, there are some instances where PHP must be run as a CGI process, such as Apache configurations using the per-virtual host permissions provided by Apache's `itk` message passing module (mpm). Also, in our experience, `mod_php` is incompatible with the `mod_rails` or Phusion Passenger method of running [Ruby On Rails](/docs/frameworks/). In these cases, if you want to run PHP and Rails applications within a single instance of Apache, you must run PHP scripts as CGI processes.
