---
author:
  name: Linode
  email: docs@linode.com
description: 'Use Nginx as a Front-end Proxy and Software Load-Balancer.'
keywords: ["apache", "nginx", "proxy", "load balancer", "load balancing", "web server", "http", "use nginx as proxy", "use nginx as load-balancer", "front-end proxy", "cluster"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/configuration/front-end-proxy-and-software-load-balancing/','websites/loadbalancing/Use-Nginx-for-Proxy-Services-and-Software-Load-Balancing/','uptime/loadbalancing/use-nginx-for-proxy-services-and-software-load-balancing/index.cfm/','uptime/loadbalancing/use-nginx-for-proxy-services-and-software-load-balancing/', 'uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer/']
modified: 2017-03-23
modified_by:
  name: Linode
published: 2010-05-11
title: 'Use Nginx as a Front-end Proxy and Software Load Balancer'
external_resources:
 - '[nginx Proxy Module](http://wiki.nginx.org/NginxHttpProxyModule)'
 - '[HTTP Upstream Module](http://wiki.nginx.org/NginxHttpUpstreamModule)'
 - '[nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

The nginx web server can act as a very capable software load balancer, in addition to its more traditional roles serving static content over HTTP and dynamic content using FastCGI handlers for scripts. Because ngnix uses a non-threaded, event-driven architecture, it is able to outperform web servers like Apache. This is particularly true in deployments that receive heavy loads.

![Use Nginx as a Front-end Proxy and Software Load Balancer](/docs/assets/use_nginx_as_a_frontend_proxy_and_software_load_balancer.png "Use Nginx as a Front-end Proxy and Software Load Balancer")

Using a proxy is helpful when the demands of serving a single website outgrow the capabilities of a single machine. Additionally, there are some web frameworks, like [Seaside](/docs/frameworks/seaside/) and Ruby On Rails's Mongrel server, that deploy applications on framework-specific web servers. While these single-purpose servers provide powerful application services, they are not suitable for hosting entire applications. In these cases, using nginx as a front-end proxy to pass only the essential requests to the application server is a viable means of unifying dynamic content with static content and providing a stable production environment.

This document provides an overview of using nginx as a front-end proxy server for other HTTP servers, and as a software load balancer to distribute traffic across a cluster of machines providing HTTP resources. For an introductory guide to configuring nginx, please see our [Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration) guide. If you want a simple nginx deployment with content that uses PHP or Perl scripts, consider following one of our [Installing Nginx](/docs/web-servers/nginx/) guides.

## Prerequisites

Before we begin, make sure you have completed the following:

-   Follow the [Getting Started](/docs/getting-started/) guide.
-   Install the [nginx server](/docs/web-servers/nginx/).
-   Familiarize yourself with [Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration).

If you're new to Linux server administration, you may be interested in our [introduction to Linux basics](/docs/tools-reference/introduction-to-linux-concepts) guide, [Beginner's Guide](/docs/beginners-guide/) and [Administration Basics](/docs/using-linux/administration-basics) guide.

## Front-End Proxy Services with Nginx: How It Works

When a request reaches the nginx front-end proxy server, here's an overview of the process that occurs:

1.  nginx receives a request for a resource.
2.  nginx sends a second *proxied* request to a specified server, and gets a response.
3.  nginx returns the result of that request to the original requester.

## Configure Apache for Port Listening

In this section, you'll configure Apache to listen on an alternate port so it can respond to the nginx front end.

{{< note >}}
This guide assumes you are using Apache 2.4. Some path names will be slightly different if you are using an older version.
{{< /note >}}

1.  The first thing you will configure is the port on which Apache listens. This needs to be a port other than 80, so that you can proxy requests to Apache on the alternate port. This has the added benefit of preventing conflicts between Apache and nginx listening on the same port. First, open up the `/etc/apache2/ports.conf` file for editing, and configure it as shown below:

        sudo nano /etc/apache2/ports.conf

    {{< file-excerpt "/etc/apache2/ports.conf" aconf >}}
NameVirtualHost *:8000
Listen 8000

<IfModule mod_ssl.c>
  # If you add NameVirtualHost *:443 here, you will also have to change
  # the VirtualHost statement in /etc/apache2/sites-available/default-ssl
  # to <VirtualHost*:443>
  # Server Name Indication for SSL named virtual hosts is currently not
  # supported by MSIE on Windows XP.
  Listen 443
</IfModule>

<IfModule mod_gnutls.c>
  Listen 443
</IfModule>

{{< /file-excerpt >}}


2.  Next, in the virtual host configuration file, edit the port to match the new default port set in the previous step. More specifically, edit the `<VirtualHost *:>` line to use port 8000.

        sudo nano /etc/apache2/sites-available/example.com.conf

      {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:8000>
 ServerAdmin webmaster@example.com
 ServerName  www.example.com
 DocumentRoot /var/www/html/example.com

 <Directory />
   Options FollowSymLink
   AllowOverride None
 </Directory>

 <Directory /var/www/html/example.com>
   Options Indexes FollowSymLinks MultiViews
   AllowOverride None
   Order allow,deny
   allow from all
 </Directory>
</VirtualHost>

{{< /file-excerpt >}}


3.  In the `/etc/apache2/apache2.conf` file, comment out the `LogFormat {User-Agent}` line. Then, add a forward so that Apache will log the original user’s IP address in the access logs instead of nginx's IP address (which would be listed as 127.0.0.1).

        sudo nano /etc/apache2/apache2.conf

    {{< file-excerpt "/etc/apache2/apache2.conf" aconf >}}
#LogFormat "%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
LogFormat "%{X-Forwarded-For}i %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined

{{< /file-excerpt >}}


4.  Install the Apache module `libapache2-mod-rpaf`, which takes care of logging the correct IP address.

        sudo apt-get install libapache2-mod-rpaf

5.  Restart Apache.

        service apache restart

6.  Edit the `/etc/nginx/proxy_params` file. These settings are a good starting point for optimal forwarding of proxy requests from Nginx to Apache:

        sudo nano /etc/nginx/proxy_params

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

client_max_body_size 100M;
client_body_buffer_size 1m;
proxy_intercept_errors on;
proxy_buffering on;
proxy_buffer_size 128k;
proxy_buffers 256 16k;
proxy_busy_buffers_size 256k;
proxy_temp_file_write_size 256k;
proxy_max_temp_file_size 0;
proxy_read_timeout 300;

{{< /file >}}


7.  Create the nginx `example.com` virtual host file at `/etc/nginx/sites-available/example.com`. Make sure you specify the same document root here that you did for Apache (for example, `/var/www/html/example.com`). This will ensure that nginx can deliver static files directly without passing the request to Apache. Static files (like JavaScript, CSS, images, PDF files, static HTML files, etc.) can be delivered much faster with nginx than Apache.

        sudo nano /etc/nginx/sites-available/example.com

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen 80;
    server_name www.example.com example.com;
    root /var/www/html/example.com;

    if ($http_host != "www.example.com") {
        rewrite ^ www.example.com$request_uri permanent;
    }

    index index.php index.html;

    location / {
        proxy_pass http://localhost:8000;
        include /etc/nginx/proxy_params;
    }

    location ~* \.(js|css|jpg|jpeg|gif|png|svg|ico|pdf|html|htm)$ {
    }

}

{{< /file-excerpt >}}


    There are some additional `location` directives to add in the `server` section of the `/etc/nginx/sites-available/example.com` file. You will probably need these directives, but it's possible that you may not, depending on your nginx and Apache configuration.

8.  Add a `location` directive to make nginx refuse all requests for files beginning with the characters `.ht`. There's a similar directive in nearly every default Apache configuration. This directive is useful if your Apache deployment relies on settings from `.htaccess` and `.htpasswd`.

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
location ~ /\.ht {
    deny  all;
}

{{< /file-excerpt >}}


9.  If you need to proxy requests for a specific location to a specific resource, use a rewrite rule to capture the path to the resource and pass that along to the proxied server. For example, if you want all requests for `http://example.com/` to be handed to a server running on `192.168.3.105` with a path of `/teams/~example/`, you would write the following `location` block:

    {{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
location / {
  rewrite ^(.*)$ /teams/~example/$1 break;
  proxy_pass   http://192.168.3.105;
}

{{< /file-excerpt >}}


    Here, the rewrite rule (`^(.*)$`) captures the entire request string and appends it (`$1`) to the path on the new server (`/teams/~example/`). Here's how this would play out:

    **Request:** `http://example.com/images/images.png`

    **Response:** `http://192.168.3.105/teams/~example/images/images.png`

    **Request:** `http://example.com/wiki/PracticeSchedule/`

    **Response:** `http://192.168.3.105/teams/~example/wiki/PracticeSchedule/`

10. For most conventional proxy setups, you will also want to add a `proxy_redirect` specification to your `location` directive blocks. This directive rewrites the HTTP headers that nginx receives from the proxy server to make them appear as if they were generated by the nginx server.

    {{< file-excerpt "example.com.vhost proxy location directive" nginx >}}
location /pictures/ {
  proxy_pass       http://192.168.3.106:8080;
  proxy_redirect   http://192.168.3.106:8080 http://example.com/pictures/;
}

{{< /file-excerpt >}}


    In this example, requests are made for resources under `http://example.com/pictures/`, then passed to a server running on port `8080` of the LAN IP address `192.168.3.106`. Without the `proxy_redirect` directive, the `Location:` header of the HTTP response would return the location for a request of `http://example.com/team.jpg` as `http://192.168.3.106:8080/team.jpg`. By adding the `proxy_redirect` directive, proxied requests return the expected `Location:` header.

## Software Load Balancing

In addition to using nginx as a front-end proxy to pass requests to other web servers, nginx can also serve as the front end for clusters of servers, and even as a software load balancer.

### Basic HTTP Clustering

In this example, we'll show you how to build a cluster named `appcluster` with a simple round-robin load balancer. Here are the appropriate excerpts from the `/etc/nginx/sites-available/example.com` file:

{{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
server {

  listen 80;
  server_name example.com www.example.com;

  location / {
     proxy_pass  http://appcluster;
     include /etc/nginx/proxy_params;
  }

}

upstream appcluster {
   server linode.example.com:8801;
   server linode.example.com:8802;
   server linode.example.com:8803 down;
   server linode.example.com:8804;
   server galloway.example.com:8801;
   server galloway.example.com:8802;
   server galloway.example.com:8803;
   server galloway.example.com:8804;
}

# [...]

{{< /file-excerpt >}}


In this example, in the `server` directive block, nginx is configured to listen for requests on a specific IP address and port (e.g. `192.0.2.0` and `80`), and respond to requests for the domains `example.com` and `www.example.com`. All requests for resources at this domain (e.g. `/`) will be passed to the `http://appcluster` server established in the `upstream` directive.

The `upstream` directive establishes the round-robin load balancer. Within this block eight servers are listed, each running on a distinct hostname and port combination.

-   The `upstream` configuration must occur in the top level of the `http` block of the `/etc/nginx/sites-available/example.com` file.
-   The servers running on ports `8801` through `8804` of the servers `linode.example.com` and `galloway.example.com` will receive equal portions of the requests made of the upstream `appcluster`.
-   The `down` parameter excludes that server from being proxied. Use it when one of your servers is down.

### Advanced Load Balancing

nginx also allows you to control the behavior of the `upstream` resource cluster beyond a simple round-robin setup. The simplest modification is to add the `ip_hash` directive to the configuration block. This causes requests from the same IP address to be routed to the same back-end server. Consider the following example excerpt:

{{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
upstream appcluster {
   ip_hash;
   server linode.example.com:8801;
   server linode.example.com:8802;
   server galloway.example.com:8801 down;
   server galloway.example.com:8802;
}

{{< /file-excerpt >}}


Here, the `ip_hash` directive causes nginx to attempt to match requests originating from a single IP address with the same back-end component. If a component server is unreachable, nginx will route those connections to an alternate component.

 {{< note >}}
If a server needs to be taken offline for an extended period of time, append the `down` argument, as shown in the entry for `galloway.example.com:8801`. This will prevent missed connections from attempting to hit a component of the server which is down.
{{< /note >}}

Here is a more advanced configuration, where seven server components running on unique ports on the server `linode.example.com` comprise the `appcluster` upstream:

{{< file-excerpt "/etc/nginx/sites-available/example.com" nginx >}}
upstream appcluster {
   server linode.example.com:8801;
   server linode.example.com:8802 weight=1;
   server linode.example.com:8803 weight=2 max_fails=2;
   server linode.example.com:8804 weight=2 max_fails=2 fail_timeout=20;
   server linode.example.com:8805 weight=4;
   server linode.example.com:8806 weight=4 fail_timeout=4;
   server linode.example.com:8807 weight=2 fail_timeout=20;
}

{{< /file-excerpt >}}


Using these arguments, you can use nginx to manage the behavior and distribution of load across a cluster of servers:

-   By default, each server listed in an upstream cluster has a weight of `1`. The argument `weight=[number]` sets a specific weight. Higher numbers receive more weight.

    In the example above, the components running on ports `8801` and `8802` are treated identically by nginx, as the default value for `weight` is `1`. The components running on `8803`, `8804`, and `8807` will receive twice as much traffic as the first two components. The components running on `8805` and `8806` will receive four times as much traffic as the ones on `8801` and `8802` and twice much traffic as the components on `8803`, `8804`, and `8807`.

-   `max_fails=[number]` specifies the number of unsuccessful attempts at communication with an upstream component before it is considered inoperative. To prevent components from ever being marked as inoperative, even if they are unreachable, set this value to `0`. The default value for `max_fails` is `1`.

    In the example above, the component servers on ports `8801`, `8802`, `8805`, `8806`, and `8807` can only refuse a connection once before being marked as inoperative. Components `8803` and `8804` are allowed to fail twice before being marked as inoperative.

-   The `fail_timeout=[time-in=seconds]` argument determines the span of time within which the `max_fails` number of unsuccessful attempts must occur in order to mark a component of the server inoperative. Note that servers that return a 404 response are considered operative. Also, this value does not affect timeouts for established proxy connections.

    By default, all components have their fail counter reset every 10 seconds, which covers components `8801`, `8802`, `8803`, and `8805`. In the example above, the components running on `8804` and `8807` have their fail counters reset every 20 seconds, while `8806` has its counter reset every 4 seconds.

-   The `ip_hash` directive cannot be combined with the additional arguments shown in the example above.
