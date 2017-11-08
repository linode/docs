---
author:
  name: Linode
  email: docs@linode.com
description: 'Deploying and configuring granular access control with the Apache web server.'
keywords: ["apache", "access control", "security", "http", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/rule-based-access-control/','websites/apache-tips-and-tricks/rulebased-access-control-for-apache/']
modified: 2017-08-30
modified_by:
  name: Linode
published: 2009-12-07
title: 'Rule-based Access Control for Apache'
external_resources:
 - '[LAMP Stack Guides](/docs/lamp-guides/)'
 - '[Apache Configuration and Administration](/docs/web-servers/apache/)'
 - '[Apache Configuration Basics](/docs/web-servers/apache/configuration/configuration-basics)'
 - '[Apache Configuration Structure](/docs/web-servers/apache/configuration/configuration-structure)'
 - '[Auth-based Access Control](/docs/web-servers/apache/configuration/http-authentication)'
 - '[Apache Troubleshooting](/docs/web-servers/apache/troubleshooting/)'
 - '[Apache Documentation](http://httpd.apache.org/docs/2.2/sections.html)'
 - '[Apache Access Control](http://httpd.apache.org/docs/2.0/mod/mod_access.html#allow)'
---


![Apache_banner_image](/docs/assets/RBAC_Apache.jpg)
Apache provides a number of tools that allow administrators to control access to specific resources provided by servers. You may already be familiar with [authentication based access controls](/docs/web-servers/apache/configuration/configuration-structure), which requires that visitors authenticate to the server before gaining access to resources.


 Apache's rule-based access control allows you to specify which visitors have access to which resources on a very granular level. You can create rules which block a given range of IPs from your web server, or from accessing a particular resource, or even simply from accessing a particular virtual host.

The most basic use of rule-based access control is to place firm limits on what resources are accessible over the network connection. In the default Apache configuration, the web server denies all users access to all files on the system. Then Apache permits administrators to allow access to specific resources.

Additional uses for these access rules include blocking particular IP ranges that have been responsible for malicious traffic and limiting access to a given resource or set of resources to "internal users," among a number of other possibilities.

We assume that you have a working installation of Apache and have access to modify configuration files. If you have not installed Apache, you might want to follow one of our [Apache installation guides](/docs/web-servers/apache/) or [LAMP stack installation guides](/docs/lamp-guides/). If you want a more thorough introduction to Apache configuration, please reference our [Apache HTTP server configuration basics](/docs/web-servers/apache/configuration/configuration-basics) and [Apache configuration structure](/content/web-servers/apache/configuration/configuration-structure) guides.

## Examples of Rule Based Access Control

In the examples given in the [Apache configuration structure](/docs/web-servers/apache/configuration/configuration-structure) document, we presented configuration directives that specified rule-based access control conditions for specific resources. You may wish to consult our [Apache configuration structure](/docs/web-servers/apache/configuration/configuration-structure) guide to see a number of examples of these directives in practice.

Here is an example of a basic rule:

{{< file-excerpt "Apache Configuration Directive" apache >}}
Order Deny,Allow
Deny from all
Allow from 192.168.2.101

{{< /file-excerpt >}}


To parse this in more simple terms:

-   The `Order Deny,Allow` directive tells the web server that "Deny" rules should be processed before Allow rules.
-   The `Deny from all` directive tells the web server that all users should be denied access to the given resource. This rule is processed first.
-   The `Allow from` directive tells the web server that requests originating at the IP address `192.168.2.101` should be allowed. This is processed last, and represents an exception to the `Deny from all` rule.

In short, all hosts except for `192.168.2.101` are denied access to this resource.

## Additional Access Control Rules

You can specify granular access control rules for your resources by modifying and expanding the example above. The following notes and suggestions provide some insight into some of the more advanced functionality that is possible with these access control systems.

### Controlling Access for a Range of IPs

If you want to control access for a range of IP addresses rather than for a single address, Apache permits this with the following syntax:

{{< file-excerpt "Apache Configuration Directive" apache >}}
Order Deny,Allow
Deny from all
Allow from 192.168
Allow from 10

{{< /file-excerpt >}}


The above statements allow all addresses that begin with `192.168` and `10`. These IP ranges are typically reserved for Local networking and are not publicly routable addresses. If used, these access control rules will only allow traffic from "local sources" on the network.

Here is an additional example of an access rule:

{{< file-excerpt "Apache Configuration Directive" apache >}}
Order Allow,Deny
Allow from all
Deny from 185.201.1

{{< /file-excerpt >}}


This rule allows everyone access to the given resource, and then denies access to all IP addresses beginning with `185.201.1`. This statement would cover all traffic originating from the range of IP addresses from `185.201.1.0` to `185.201.1.255`.

When creating access control rules, particularly ones that use the `Allow from all` directive, be very sure that these directives are situated in the proper context.

### Advanced Access Control

While IP address are by far the easiest way to control access using these access control rules, Apache provides a number of additional methods.

Firstly, Apache permits administrators to allow or deny access based on the hostname of the requester. This forces Apache to do a reverse DNS (rDNS) lookup of the hostname performing the request, and then allow or deny access based on this information. Consider this example:

{{< file-excerpt "Apache Configuration File" apache >}}
Order Deny,Allow
Deny from all
Allow from hostname.example.com

{{< /file-excerpt >}}


Apache only allows requests from the machine with valid rDNS of `hostname.example.com` to access the resource in this configuration.

Secondly, it's possible to build access rules around environment variables in the HTTP session. This allows you to allow and deny access to resources on the basis of variables such as browser (user agent) and referrer. Let us take the following example:

{{< file-excerpt "Apache Configuration File" apache >}}
SetEnvIf Referer searchenginez.com search_traffic
Order Deny,Allow
Deny from all
Allow from env=search_traffic

{{< /file-excerpt >}}


This access control rule works in conjunction with Apache's `mod_setenvif`. First, if a request's referrer matches `searchenginez.com` the environment variable `search_traffic` is set. Next, all hosts are denied access to the resource. Finally, requests that have the environment variable `search_traffic` set are allowed access to the resource. Please consult the official Apache documentation for [mod\_setenvif](http://httpd.apache.org/docs/2.2/mod/mod_setenvif.html) for more information about setting and using environment variables.
