---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide describing how to install and configure HAProxy for TCP/HTTP load balancing'
keywords: 'haproxy,load balancing,high availability'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, September 15th, 2017'
modified: Friday, September 15th, 2017
modified_by:
  name: Linode
title: 'Load Balancing using HAProxy'
contributor:
  name: Robert Hussey
  link: https://github.com/hussrj
  external_resources:
- '[HAProxy Documentation](http://www.haproxy.org/#docs)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

## Introduction
HAProxy (High Availability Proxy) is a TCP/HTTP load balancer and proxy server that allows for spreading incoming requests across multiple endpoints. This is useful in cases where too many concurrent connections could over-saturate the capability of a single server. Instead of a client connecting to a single server which also processes their requests, the client will connect to an HAProxy instance which will use a reverse proxy to forward the request to one of the available endpoints based on the configured load-balancing algorithm.

This guide will describe the installation and configuration of HAProxy for load balancing HTTP requests but the configuration can be adapted for most load balancing scenarios. The setup is simplified from a typical production setup and will use a simple NodeJS script to demonstrate how HAProxy load balances by forwarding requests to the configured backends.

## Before You Begin

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. 

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade
        
3. This guide uses private IP addresses in the example configurations. Refer to our [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide to add private IP addresses and internally network your Linodes.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Installation
Most linux distributions have available HAProxy in the package management system.

### Ubuntu 17.04
    sudo apt-get install haproxy
### Fedora 26
    sudo yum install haproxy

HAProxy installs a default configuration file at /etc/haproxy/haproxy.cfg. This default configuration defines a standard setup without any load-balancing to be performed:

    global
        log /dev/log    local0
        log /dev/log    local1 notice
        chroot /var/lib/haproxy
        stats socket /run/haproxy/admin.sock mode 660 level admin
        stats timeout 30s
        user haproxy
        group haproxy
        daemon

        # Default SSL material locations
        ca-base /etc/ssl/certs
        crt-base /etc/ssl/private

        # Default ciphers to use on SSL-enabled listening sockets.
        # For more information, see ciphers(1SSL). This list is from:
        #  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
        # An alternative list with additional directives can be obtained from
        #  https://mozilla.github.io/server-side-tls/ssl-config-generator/?server=haproxy
        ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
        ssl-default-bind-options no-sslv3

    defaults
        log     global
        mode    http
        option  httplog
        option  dontlognull
        timeout connect 5000
        timeout client  50000
        timeout server  50000
        errorfile 400 /etc/haproxy/errors/400.http
        errorfile 403 /etc/haproxy/errors/403.http
        errorfile 408 /etc/haproxy/errors/408.http
        errorfile 500 /etc/haproxy/errors/500.http
        errorfile 502 /etc/haproxy/errors/502.http
        errorfile 503 /etc/haproxy/errors/503.http
        errorfile 504 /etc/haproxy/errors/504.http

