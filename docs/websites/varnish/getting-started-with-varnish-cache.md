---
author:
  name: Linode Community
  email: docs@linode.com
description: Use Varnish Cache to increase your site's speed and optimize server resources
keywords: ["Varnish", "Ubuntu", "Debian", "Cache", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/varnish/']
modified: 2017-02-24
contributor:
    name: Kevin Cupp
modified_by:
  name: Edward Angert
published: 2014-02-05
title: Getting Started with Varnish Cache
external_resources:
 - '[Official Varnish Documentation](https://www.varnish-cache.org/docs)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Does your server need to handle lots of traffic? Caching is one of the best ways to maximize the output of your Linode. But what is caching, exactly?

The idea behind caching is that your server shouldn't have to regenerate the same dynamic content from scratch every time it's accessed. Save your Linode's resources by putting a caching proxy like Varnish in front of your web service to accelerate responses to HTTP requests and reduce server workload.

![Getting Started with Varnish Cache](/docs/assets/varnish_tg.png "Getting Started with Varnish Cache")

Varnish works by handling requests before they make it to your backend; whether your backend is Apache, nginx, or any other web server. If it doesn't have a request cached, it will forward the request to your backend and then cache its output. You can then store these cached requests in memory, so they're retrieved by and delivered to clients much faster than they would be from disk.

Additionally, Varnish cache can be used as part of a [highly available environment](#use-varnish-cache-for-high-availability-with-backend-polling), which ensures uptime during high traffic loads or server failures.

If your web server is nginx and you plan to use Varnish cache to serve WordPress, visit Linode's guide to [Using Varnish & nginx to Serve WordPress over SSL & HTTP on Debian 8](/docs/websites/varnish/use-varnish-and-nginx-to-serve-wordpress-over-ssl-and-http-on-debian-8).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Install and configure a [web server](/docs/websites/) like Apache or nginx.

4.  Update your system:

        sudo apt update && sudo apt upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install and Configure Varnish Cache

1.  Install Varnish with the package manager:

        sudo apt install varnish

2.  To avoid having your configuration overwritten by future updates, make a copy of the default:

        cd /etc/varnish
        sudo cp default.vcl user.vcl

3.  Stop the Varnish service while making configuration changes:

        sudo systemctl stop varnish

### Configure Varnish Backend with Systemd

Varnish is configured via [Varnish Configuration Language (VCL)](https://www.varnish-cache.org/docs/4.0/reference/vcl.html). Once the configuration file is loaded by the system, Varnish translates and compiles the VCL code into a C program that runs alongside the Varnish process.

Recent versions of Debian (8 and newer) and Ubuntu (15.04 and newer) require Varnish configuration through *systemd*.

1.  Open the `varnish.service` file, set the port, configuration file, and *memory allocation* on the `ExecStart` line. In the following example, these values are: `-a :80`, `/etc/varnish/user.vcl`, and `malloc,1G`.

    {{< file-excerpt "/lib/systemd/system/varnish.service" bash >}}
ExecStart=/usr/sbin/varnishd -j unix,user=vcache -F -a :80 -T localhost:6082 -f /etc/varnish/user.vcl -S /etc/varnish/secret -s malloc,1G

{{< /file-excerpt >}}


2.  The configuration above allocates a maximum of 1GB of memory to store its cache items. If you need to adjust this allocation, edit the number in `-s malloc,1G`. For example, to allocate 2GB of memory:

        -s malloc,2G

3.  Reload systemd:

        sudo systemctl daemon-reload

### Modify Custom Varnish Configuration VCL

Now that you've pointed the Varnish start script to `user.vcl`, you need to configure that file to serve the content Varnish gets from the web server. Edit the `backend default {` section of `/etc/varnish/user.vcl` to tell Varnish where to get the server (backend) content. The example below  uses port `8080`, a web server setting you  will configure later:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
backend default {
    .host = "127.0.0.1";
    .port = "8080";
}

{{< /file-excerpt >}}


### Configure Cache Time-to-Live (TTL)

By default, Varnish will cache requests for two minutes. To adjust this time, open your VCL file and override the `vcl_backend_response` subroutine by updating  your backend declaration:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
sub vcl_backend_response {
  set beresp.ttl = 5m;
}

{{< /file-excerpt >}}


This subroutine is called after a request is fetched from the backend. In this example, we're setting the TTL variable on the object to five minutes (`5m`). Values can be in seconds (`120s`), minutes (`2m`) or hours (`2h`). Your ideal TTL may vary depending on how often the content of your site is updated, and the amount of traffic you need to handle.

## Take Varnish Live: Configure Web Traffic to Serve Cached Content

Now that you've configured Varnish, use this section to make it your web server by swapping the ports your web server and Varnish listen on. As illustrated in the graphic below, all web traffic will be served from Varnish cache and refreshed every two minutes or at the [interval configured above](#configure-cache-time-to-live-ttl):

![Where Varnish Exists in the Web Server Process](/docs/assets/varnish_cache_guide.png "Where Varnish Exists in the Web Server Process")

To allow Varnish to communicate with your web server, you'll need to modify a few settings in the virtual host file for your site.

1.  If you're using nginx, skip this step. If you're using Apache, change the port Apache listens on. Edit `/etc/apache2/ports.conf` and any virtual hosts. Open `ports.conf` and change the `80` in `Listen 80` to another port. Port `8080` will be used in this example:

        Listen 8080

2.  Modify your virtual host file or server block to listen on port 8080:

    **Apache**:

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:8080>

{{< /file-excerpt >}}


    **nginx**:

    {{< file-excerpt "/etc/nginx/sites-available/example.com" aconf >}}
listen 8080;
listen [::]:8080;

{{< /file-excerpt >}}


3.  Check your `/etc/varnish/user.vcl` file and make sure the `backend default` is set to use port 8080:

        backend default {
            .host = "127.0.0.1";
            .port = "8080";
        }

4.  Reload the configuration for your web server:

        sudo systemctl reload apache2
        sudo systemctl restart nginx

5.  Start Varnish:

        sudo systemctl start varnish

    Once it's been started, Varnish will be live to site visitors and content will be served from the cache whenever possible, according to your configuration.

## Advanced Varnish Configuration

The VCL allows extended control over how requests are cached, and you may need to make some modifications. This section will go over a few common VCL configurations.

These modifications should be made in your `user.vcl` file.

### Exclude Content from Varnish Cache

You may want to exclude specific parts of your website from Varnish caching, particularly if there is a non-public or administrative portion. To do this, you'll access Varnish's request object for information about the request, and conditionally tell Varnish to **pass** the request through to the backend with no caching.

You'll need to override the `vcl_recv` subroutine in our VCL file, which is run each time Varnish receives a request, then add a conditional:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
sub vcl_recv
{
    if (req.http.host == "example.com" &&
        req.url ~ "^/admin")
    {
        return (pass);
    }
}

{{< /file-excerpt >}}


This example checks for two conditions you don't want to cache. The first is any request for `example.com`, the second is for any URI requests that begin with `/admin`. If both of these are true, Varnish will not cache the request.

### Unset Cookies

As mentioned earlier, if Varnish detects your website is setting cookies, it assumes your site needs to interact with those cookies and shows dynamic content accordingly, and as a result, Varnish will not cache those pages. You can override this behavior by unsetting the `Cookie` variable on Varnish's `req.http` object.

Add this line to the bottom of the `vcl_recv` section:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
unset req.http.Cookie;

{{< /file-excerpt >}}


You may find that a particular cookie is important for displaying content or determines if your user is logged in or not. In this case, you probably don't want to show cached content and instead, just want to send the user straight to the backend.

For this case, you'll check `req.http.Cookie` for a cookie called "logged_in", and if its found, the request will be passed on to the backend with no caching. Here's our entire `vcl_recv` subroutine thus far:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
sub vcl_recv
{
    if ((req.http.host ~ "example.com" &&
        req.url ~ "^/admin") ||
        req.http.Cookie == "logged_in")
     {
        return (pass);
     }

     unset req.http.Cookie;
}

{{< /file-excerpt >}}


### To Cache POST, or Not to Cache POST?

It's likely you don't want to cache [POST](https://en.wikipedia.org/wiki/POST_(HTTP)) requests, because they probably need to interact with the backend to gather dynamic data or set up a user's session. In the example above, you chose not to cache requests if the user is logged in. This section ensures a user can log in to begin with. An easy approach is to skip POST requests all together.

To accomplish this, add the following condition to the existing `return (pass)` block inside of `vcl_recv`:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
if ((req.http.host == "example.com" &&
    req.url ~ "^/admin") ||
    req.http.Cookie == "logged_in" ||
    req.method == "POST")
{
    return (pass);
}

{{< /file-excerpt >}}


### Use Varnish Cache for High Availability with Backend Polling

Varnish can use a built-in tool called *backend polling* to check on the backend server and continue serving cached content if the backend is unreachable. In the event that Varnish detects downtime, it will continue serving cached content for a *grace time* that you configure in `user.vcl`.

To set up polling, add a probe section to the backend declaration in `/etc/varnish/user.vcl`:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
backend default {
    .host = '127.0.0.1';
    .port = '8080';
    .probe = {
        .url = "/";
        .timeout = 40ms;
        .interval = 1s;
        .window = 10;
        .threshold = 8;
     }
}

{{< /file-excerpt >}}


These settings are just a starting point, and you may want to tweak them for your website. This example instructs Varnish to *poll*, or perform a test connection to, `http://127.0.0.1:8080/` every second, and if it takes less than 40ms to respond for at least 8 of the last 10 polls, the backend is considered healthy.

If the backend fails the test, it's considered unhealthy and objects are served out of the cache in accordance to their grace time setting. To set the grace time, include the following line in `vcl_backend_response`:

{{< file-excerpt "/etc/varnish/user.vcl" >}}
set beresp.grace = 1h;

{{< /file-excerpt >}}


"1h" allows the backend to be down for one hour without any impact to website users. If you're serving static content, the grace time can be even longer to ensure uptime.

#### Serve Varnish Cache from Another Linode (Optional)

For added availability, consider serving Varnish cache from a separate Linode. In this case, the Varnish installation steps should be performed on a separate Linode in the same datacenter as the web server. Once installed, configure the Varnish backend `.host` value to point at the web server Linode's [private IP address](/docs/networking/remote-access#adding-private-ip-addresses). Note that DNS records for your site should be pointed at the Varnish Linode, since this is where the client connects.

That's it! If everything went well, visitors to your site are now being served Varnish-cached content from memory, resulting in dramatic improvements to your site's speed.

## Test Varnish with varnishlog

Now that all traffic is configured to reach Varnish cache, start `varnishlog` to view Varnish activity as it happens. Note that this is a live, ongoing log that will not show any information unless activity has occurred. Once you've started Varnishlog, use a browser to view a page that should be cached and watch the log for activity:

    sudo varnishlog

Stop `varnishlog` with **CTRL+C** when done.

## Firewall Rules

When using a firewall, Varnish requires slight modification to the rules you may have used when setting up a web server.

If Varnish is running on the same Linode as your web server, be sure to allow incoming connections on port 80. However, you will also need to allow connections from localhost on port 8080, since this is how Varnish communicates with the web server.

If Varnish and your web server are running on separate Linodes, you'll need to accept incoming traffic on port 80 on the Varnish Linode, and port 8080 on the web server.

These two are simply the minimum rule modifications. It is strongly recommended you use additional firewall rules on each, based on the other services you have running. If you're not sure how to set up a firewall, check out our guides on [iptables](/docs/security/firewalls/control-network-traffic-with-iptables) and [UFW](/docs/security/firewalls/configure-firewall-with-ufw).
