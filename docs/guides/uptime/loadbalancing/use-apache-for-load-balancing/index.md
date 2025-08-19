---
slug: use-apache-for-load-balancing
author:
  name: Linode Community
  email: docs@linode.com
description: 'Using Apache for HTTP load balancing.'
og_description: 'Using Apache for HTTP load balancing.'
keywords: ['apache', 'load-balancing', 'http']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-04
modified_by:
  name: Linode
title: "Use Apache for Load Balancing"
h1_title: "Use Apache for Load Balancing"
contributor:
  name: Dan Nielse
  link: https://github.com/danielsen
external_resources:
- '[Apache](https://httpd.apache.org)'
- '[Apache Proxy Balancer Module](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html)'
---

In addition to its traditional role of serving static and dynamic content, Apache can be a very capable software load balancer. Using a load balancer is helpful as the demands of serving a single application outgrow a single host. A load balancer intelligently distributes HTTP requests to application backends for servicing.

This guide provides an overview of configuring Apache as a load balancer to distribute HTTP requests.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4. If Apache is not installed follow the [installation guide](/docs/guides/how-to-install-apache-web-server-debian-10/).

5. Familiarize yourself with the [Apache Configuration Basics](/docs/guides/apache-configuration-basics/).

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Enable Apache modules

Apache is bundled with many modules which are not enabled in a fresh install. The modules needed for this guide are:

1. `mod_proxy`, the primary module for redirecting connections.

2. `mod_proxy_http`, for adding HTTP proxying support.

3. `mod_proxy_balancer`, for basic load balancing features.

4. `mod_lbmethod_byrequests`, to enable the request counting balancing algorithm.

5. `mod_headers`, for header manipulation.

{{< note >}}
The request counting algorithm is not the only one available. Modules exist for weighted traffic counting, pending request counting, and heartbeat traffic counting. See the [mod_proxy_balancer documentation](https://httpd.apache.org/docs/2.4/mod/mod_proxy_balancer.html) for more information.
{{< /note >}}

Install the modules.

        sudo /sbin/a2enmod headers
        sudo /sbin/a2enmod proxy
        sudo /sbin/a2enmod proxy_http
        sudo /sbin/a2enmod proxy_balancer
        sudo /sbin/a2enmod lbmethod_byrequests

Restart Apache to put the new modules in action.

        sudo systemctl restart apache2

## Create the Primary Balancing Configuration

Once the modules are enabled, the main balancing configuration file can be added. Make sure to change all IP references as needed. The IPs in the `BalancerMember` directives should be the back-end hosts that service requests. The `route` parameter is used to give members a friendly name for logging. The `timeout` parameter is measured in seconds and should be greater than the timeout value of the member. The `connection_timeout` parameter configures the time that Apache waits for a connection to the member. The `retry` parameter configures the seconds to wait before attempting a new connection after a connection error.

{{< file "/etc/apache2/conf-available/main-balancer.conf" apache >}}
<Proxy balancer://default>
    ProxySet lbmethod=byrequests
    ProxySet failonstatus=410
    ProxySet failontimeout=on
    ProxySet stickysession=BALANCEID

    BalancerMember http://192.168.12.71 route=web1 retry=60 timeout=300 connectiontimeout=25
    BalancerMember http://129.168.12.73 route=web2 retry=60 timeout=300 connectiontimeout=25

    Require all granted
</Proxy>

# The following sections are optional. The /server-status and /balancer-manager provide some basic
# stats on the server. In the case of the balancer manager, it includes some basic balancer member
# controls.

ProxyPass /balancer-manager !
ProxyPass /server-status !

<Location /balancer-manager>
    SetHandler balancer-manager
    Require ip your_remote_ip
</Location>

<Location /server-status>
    SetHandler server-status
    Require ip your_remote_ip
</Location>

{{< /file >}}

{{< note >}}
The main balancer configuration file does not need to be globally enabled. If desired, it can be globally enabled by creating a symlink to it in `/etc/apache2/conf-enabled`.
{{< /note >}}

## Edit the Site Configuration

Next the site configuration file is edited to add the balancer. The configuration adds the `X-Forwarded-For` header to incoming requests. This header is the *de facto* standard for passing the requesting IP to member services. In addition, `X-Balance` headers are added to provide information about member selection for testing. The `X-Balance` headers should be removed in production.

{{< file "/etc/apache2/sites-available/000-default.conf" apache >}}
VirtualHost *:80>
    ServerName www.example.com

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyRequests off
    ProxyTimeout 5
    ProxyPreserveHost on

    Include "conf-available/main-balancer.conf"

    # If there are URLs which should be directed to a specific back-end rather than balanced
    # configure them with ProxyPassMatch. These directives should come before the entries for
    # the root URL.
    #ProxyPassMatch (^/script.php) http://192.168.12.71/$1 connectionTimeout=305 timeout=305

    ProxyPass / balancer://default/
    ProxyPassReverse / balancer://default/

    SetEnvIf X-Forwarded-For "(([\d]{1,3}\.?){4})" FORWARD_IP=$1

    <If "-z env('FORWARD_IP')">
      RequestHeader set X-Forwarded-For %{REMOTE_ADDR}s
    </If>
    <Else>
      RequestHeader set X-Forwarded-For "%{FORWARD_IP}e"
    </Else>

    Header add Set-Cookie "BALANCEID=balancer.%{BALANCER_WORKER_ROUTE}e; path=/;" env=BALANCER_ROUTE_CHANGED

    # These headers are optional but can be useful when testing and debugging.
    Header add X-Balance "BALANCER_ROUTE_CHANGED=%{BALANCER_ROUTE_CHANGED}e" env=BALANCER_ROUTE_CHANGED
    Header add X-Balance "BALANCER_WORKER_ROUTE=%{BALANCER_WORKER_ROUTE}e" env=BALANCER_WORKER_ROUTE
    Header add X-Balance "BALANCER_SESSION_ROUTE=%{BALANCER_SESSION_ROUTE}e" env=BALANCER_SESSION_ROUTE

</VirtualHost>
{{< /file >}}

## Finishing Up

Once the edits to the site configuration are saved, Apache can be tested and restarted.

        sudo /sbin/apachectl -S
        # There should be no errors from the previous command.
        sudo systemctl restart apache2

After the restart Apache forwards all HTTP requests to the configured balancer members. If you enabled the `balancer-manager` or `server-status` they are available at their respective URLs. For further information on readying the balancer for production see the [Apache tuning guide](/docs/guides/tuning-your-apache-server/).
