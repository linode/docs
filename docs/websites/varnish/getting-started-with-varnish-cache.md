---
author:
  name: Linode Community
  email: docs@linode.com
description: How to install and setup Varnish Cache
keywords: 'Varnish,Ubuntu 12.04,Cache,'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/varnish/']
modified: Friday, February 7th, 2014
contributor:
    name: Kevin Cupp
modified_by:
  name: Alex Fornuto
published: 'Wednesday, February 5th, 2014'
title: Getting Started with Varnish Cache
external_resources:
 - '[Official Varnish Documentation](https://www.varnish-cache.org/docs)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $100 per published guide.*

<hr>

Need to handle a lot of traffic? Caching is one of the best ways to maximize the output of your Linode. The idea is your server shouldn't have to regenerate the same dynamic content from scratch every time it's accessed. Save your Linode's resources by putting a caching proxy like Varnish Cache in front of your web service to accelerate responses to HTTP requests and reduce server workload.

Varnish works by handling requests BEFORE they make it to your backend, whether your backend is Apache, Nginx or anything else. If it doesn't have a request cached, it will forward the request to your backend and then cache its output. You can optionally store these cached requests in memory, so they're retrieved extremely fast.

Sound good? Let's get started setting up a basic Varnish install. The examples in this guide run inside an Ubuntu 12.04 LTS install. We will also be operating in the context of setting up caching for a basic website hosted by Apache.

{: .note }
>
> The steps in this guide are written assuming the root user is running them. If you are not logged in as Root you will need to use 'sudo' for certain steps.

## Installation

1.  First update current packages and install Varnish from apt:

        $ apt-get update
        $ apt-get upgrade
        $ apt-get install varnish

2.  Next thing we'll do is edit the daemon options for Varnish to instruct it to load our custom configuration:

        $ nano /etc/default/varnish

	Scroll down to this chunk of the configuration file to find the current defaults:

    {: .file-excerpt }
    /etc/default/varnish
    :   ~~~
        ## Alternative 2, Configuration with VCL
        #
        # Listen on port 6081, administration on localhost:6082, and forward to
        # one content server selected by the vcl file, based on the request.  Use a 1GB
        # fixed-size cache file.
        #
        DAEMON_OPTS="-a :6081 \
                     -T localhost:6082 \
                     -f /etc/varnish/default.vcl \
                     -S /etc/varnish/secret \
                     -s malloc,256m"
        ~~~

We particularly need to edit the `-f` option. Change it to:

    -f /etc/varnish/user.vcl \

Or whatever name you prefer. It's important to have your configuration outside of the default VCL file or a future package update may overwrite it.

From the configuration above, we also see that Varnish is being told to store its cache items in memory and to take a maximum of 256MB of memory to do that. If you need to adjust this allocation, simply edit the value on this line:

    -s malloc,256m

We'll come back and edit these daemon options more later. For now, let's start configuring Varnish to cache and present our backend.

## Basic Configuration

Varnish is configured via the [Varnish Configuration Language (VCL)](https://www.varnish-cache.org/docs/3.0/reference/vcl.html). Once the configuration file is loaded, Varnish translates and compiles the VCL code into a C program that runs along side the Varnish process.

Let's start customizing our VCL. Start by copying `default.vcl` to a new file, this will give us a good starting point:

    $ cd /etc/varnish
    $ cp default.vcl user.vcl
    $ nano user.vcl

### Configure Backend

1.  The first thing we'll change is our *backend*. This is where Varnish forwards requests to and is essentially what you're caching. In our example case, we are caching Apache which is currently on port 80 on the same Linode, so change the backend accordingly:

        backend default {
            .host = "127.0.0.1";
            .port = "80";
        }

2.  This change alone should get Varnish up and running for us with reasonable defaults. To see, restart Varnish:

        service varnish restart

3.  By default, Varnish runs on port 6081, so in a web browser, access port 6081 on your server:

        http://example.com:6081

    You should be seeing the homepage of your website. To confirm you're seeing a cached version of your site, inspect the headers returned. You should see these two headers:

        Via: 1.1 varnish
        Age: 10

    **Age** is how old this item in the cache is in seconds. Refresh the page a few times and ensure the `Age` header is incrementing properly. If it stays at **0**, your page likely isn't caching and it could be for a number of reasons. If your website sets cookies, Varnish assumes it is displaying user-specific content and therefore will not cache the request. Or if your web application sets Expires headers that are too short, or if it sets a strict `no-cache` policy in its caching headers, Varnish will also not cache that.

### Configuring Cache Time-to-Live (TTL)

By default, Varnish will cache requests for two minutes. If you'd like to adjust this, go back and open your VCL file and override the `vcl_fetch` subroutine by adding this below your backend declaration:

    sub vcl_fetch
    {
        set beresp.ttl = 5m;
    }

This subroutine is called after a request is fetched from the backend. You can see we're setting the TTL variable on the object to five minutes. Values can be in seconds (`120s`), minutes (`2m`) or hours (`2h`). Your ideal TTL can vary based on how often content on your site is updated, how large your site is, and how much traffic you need to handle.

### Take Varnish Live

If we're happy with our basic Varnish set up, it's time to tell Varnish and Apache to swap ports so that requests to our website go through Varnish by default.

1.  To change Apache's port, we'll need to edit `/etc/apache2/ports.conf` and any virtual hosts we have. Open `ports.conf` to find `NameVirtualHost *:80` and `Listen 80` and change `80` in each to another port. We'll go with `8080`:

        NameVirtualHost *:8080
        Listen 8080

2.  Next, go into `/etc/apache2/sites-available` and change the beginning of each of your `VirtualHost` declarations to include the new port number:

        <VirtualHost *:8080>

3.  Now we configure Varnish to start on port 80. Go back into our daemon options file (`/etc/default/varnish`) and find the uncommented options where we were editing before. The line with the `-a` flag specifies the port number, change that to `80`:

        DAEMON_OPTS="-a :80 \

4.  Lastly, we need to edit Varnish's backend configuration to pull from `127.0.0.1:8080` instead of `127.0.0.1:80`. Open `/etc/varnish/user.vcl` and change the backend configuration to:

        backend default {
            .host = "127.0.0.1";
            .port = "8080";
        }

5.  It's time to reload the configuration in both Apache and Varnish. With this, Varnish should be facing live to our site visitors and serving our site from Apache:

        $ service apache2 reload
        $ service varnish restart

## Advanced Configuration

The VCL provides much control over how requests are cached, and it's likely you may need to make some custom modifications for your situation. Let's go over a few common VCL modifications, as well as some tips and tricks.

### Excluding Requests From Caching

If your Linode runs multiple websites, it's common to want to exclude some of them from Varnish's caching. To do this, we'll dig through Varnish's request object to get information about the request and conditionally tell varnish to **pass** the request though to the backend with no caching.

We need to override the `vcl_recv` subroutine in our VCL file which is run each time Varnish receives a request, then add a conditional:

    sub vcl_recv
    {
        if (req.http.host ~ "example.com" ||
            req.url ~ "^/admin")
        {   
            return (pass);
        }
    }

You can see we're checking for two conditions we don't want to cache. The first is any request that is for `example.com`, the second is for any URI requests that begin with `/admin`. If any of these are true, Varnish will not cache the request.

### Unsetting Cookies

As mentioned earlier, if Varnish detects your website is setting cookies, it assumes your site needs to interact with those cookies and show dynamic content accordingly, and Varnish will not cache those pages. We can override this behavior by unsetting the `Cookie` variable on Varnish's `req.http` object.

Add this to the bottom of `vcl_recv` in our VCL:

    unset req.http.Cookie;

You may find that a particular cookie is important for displaying content or determines if your user is logged in or not. In this case, you probably don't want to show cached content and just send the user straight to the backend.

For this case, we'll check `req.http.Cookie` for a cookie called "logged\_in", and if we find it, pass the request on to the backend with no caching. Here's our entire `vcl_recv` subroutine thus far:

    sub vcl_recv
    {
        if (req.http.host ~ "example.com" ||
            req.url ~ "^/admin" ||
            req.http.Cookie ~ "logged_in")
        {   
            return (pass);
        }

        unset req.http.Cookie;
    }

### Cache POST, or Not to Cache POST?

It's very likely you don't want to cache POST requests because they probably need to interact with the backend to gather dynamic data or setup a user's session. In our example above, we chose not to cache requests if the user is logged in. Well we need to make sure they can log in to begin with. An easy approach is to skip POST requests all together.

Let's add this condition to our existing `return (pass)` block inside of `vcl_recv`:

    if (req.http.host ~ "example.com" ||
        req.url ~ "^/admin" ||
        req.http.Cookie ~ "logged_in" ||
        req.request == "POST")
    {   
        return (pass);
    }

### Using the Grace Period

We’ve all lost precious uptime when one of our web services decides to crash. Varnish has some nifty tools in place to cover your tail in such an event, and it's called *backend polling*. The concept is simple: Varnish will poll your backend at an interval you specify, and if it detects the backend is unreachable, it will continue to serve out of the cache for a specified period of time, called *grace time*.

Setting up polling is easy, we do it by adding a probe section to our backend declaration in `/etc/varnish/user.vcl`:

    backend default {
        .host = '127.0.0.1';
        .port = '8080';
        .probe = {
            .url = "/";
            .timeout = 34ms;
            .interval = 1s;
            .window = 10;
            .threshold = 8;
        }
    }

These are the default settings from Varnish's documentation, so you may want to tweak them for your website. This basically says, "Go to `http://127.0.0.1:8080/` every second, and if it takes less than 34ms to respond for at least 8 of the last 10 polls, the backend is considered healthy."

If the backend fails the test, objects are served out of the cache in accordance to their grace time setting. To set this, we need to set the grace time both for the request and for the fetched object. To set grace time for the request, add this line to `vcl_recv`:

    set req.grace = 1h; 

And to set grace time on the object, add this line to `vcl_fetch`:

    set beresp.grace = 1h; 

This allows our backend to be down for a whole hour before we get it fixed without website visitors ever noticing.

### Final VCL File

For reference, here is our final VCL file with all the modifications made in this guide:

{: .file }
/etc/varnish/user.vcl
:   ~~~
    backend default {
        .host = "127.0.0.1";  # IP address of your backend (Apache, nginx, etc.)
        .port = "8080";       # Port your backend is listening on
        .probe = {
            .url = "/";
            .timeout = 34ms;
            .interval = 1s;
            .window = 10;
            .threshold = 8;
        }
    }

    sub vcl_recv
    {
       # Do not cache example.com, the admin area,
       # logged-in users or POST requests
       if (req.http.host ~ "example.com" ||
            req.url ~ "^/admin" ||
            req.http.Cookie ~ "logged_in" ||
            req.request == "POST")
        {
            return (pass);
        }

        # Don't allow cookies to affect cachability
        unset req.http.Cookie;

        # Set Grace Time to one hour
        set req.grace = 1h;
    }

    sub vcl_fetch
    {
        # Set the TTL for cache object to five minutes
        set beresp.ttl = 5m;

        # Set Grace Time to one hour
        set beresp.grace = 1h;
    }
    ~~~