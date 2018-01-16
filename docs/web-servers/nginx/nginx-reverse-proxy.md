---
author:
  name: mouhsen_ibrahim
  email: mohsen47@hotmail.co.uk
description: 'This guide will show you how to use NGINX as a reverse proxy'
og_description: 'This guide shows how to use NGINX as a reverse proxy and explains several common configuration options.'
keywords: ["nginx","proxy","reverse proxy"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-21
modified: 2017-12-21
modified_by:
  name: Linode
title: 'How to Use NGINX as a Reverse Proxy'
contributor:
  name: Mouhsen Ibrahim
  link: https://github.com/mohsenSy
external_resources:
 - '[Nginx Documentation](https://nginx.org/en/docs)'
 - '[Nginx Proxy Documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)'
---

## What is a Reverse Proxy?

A reverse proxy is a type of proxy server which forwards client requests to backend servers.

NGINX offers excellent security, acceleration, and load balancing features, making it one of the most popular choices to serve as a reverse proxy. When used as a reverse proxy NGINX handles all client interaction, so it can provide security and optimization to backend services that often lack these features.

For more information on the benefits of using NGINX as a reverse proxy, see the official [documentation](https://www.nginx.com/resources/glossary/reverse-proxy-server/).

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services; this guide will use `sudo` wherever possible.

3.  Update your system:

        sudo apt update && sudo apt upgrade -y

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

### Install NGINX

Debian and Ubuntu:

    sudo apt install nginx

CentOS and RHEL:

    sudo yum install epel-release && sudo yum install nginx

{{< note >}}
If you are unfamiliar with NGINX configuration, see our [How to Configure NGINX](/docs/web-servers/nginx/how-to-configure-nginx) guide for more information.
{{< /note >}}

## Create a Python Test Server

The sample app will use the `http.server` module (available for Python 3.4 and above) to create a simple HTTP server that will serve static content on `localhost`.

### Install Python

{{< content "install_python_miniconda.md" >}}

### Create a Sample App

1.  Since the module will serve files in the working directory, create a new one for this example:

        mkdir myapp
        cd myapp

2.  Create a test page for the app to serve:

        echo "hello world" > index.html

3.  Start a basic http server:

        python -m http.server 8000 --bind 127.0.0.1

    {{< note >}}
Python 2.7 has an equivalent module via `python -m SimpleHTTPServer 8000` that listens to all interfaces but does not have an option to bind to a specific address from the command line.

Using the `http.server` module from Python 3.4 and above is highly recommanded as it allows a convenient way to bind to a specific IP. Some distributions may need to specify the Python version explicitly: `python3 -m http.server 8000 --bind 127.0.0.1`
{{< /note >}}

4.  Open a new terminal. Use `curl` to check the HTTP headers:

        curl -I localhost:8000

    Review the output to confirm that the server is `SimpleHTTP`:

    {{< output >}}
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.5.3
Date: Tue, 19 Dec 2017 19:56:08 GMT
Content-type: text/html
Content-Length: 12
Last-Modified: Tue, 19 Dec 2017 14:45:31 GMT
{{< /output >}}

5.  Test that the app is listening on `localhost`:

        curl localhost:8000

    This should print `hello world` to the console.

## Specify a Local Host

While this step is optional, specifying a local hostname will make it more convenient to point to the example app in later steps.

Add a hostname `myapp` that will only work locally:

{{< file-excerpt "/etc/hosts" >}}
127.0.0.1       localhost
127.0.0.1       myapp
127.0.1.1       localhost.localdomain   localhost

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
{{< /file-excerpt >}}

## Reverse Proxy Configuration

1.  Create an NGINX configuration file in `/etc/nginx/sites-available/myapp`:

    {{< file "/etc/nginx/sites-available/myapp" nginx >}}
server {
        listen 80;
        server_name myapp;

        location / {
                proxy_pass http://localhost:8000/;
        }
}
{{< /file-excerpt>}}

    {{< caution >}}
Remember to add a trailing slash `/` to the end of the URL in the `proxy_pass` directive so that NGINX can correctly generate a URL to be sent to the backend server.
{{< /caution >}}

2.  Enable the configuration by creating a symlink to `sites-enabled`:

        sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

3.  Remove the default symlink:

        sudo rm /etc/nginx/sites-enabled/default

4.  Restart `nginx` to allow the changes to take effect:

        sudo systemctl restart nginx.service

5.  Test the proxy with curl:

        curl -I myapp

    {{< output >}}
HTTP/1.1 200 OK
Server: nginx/1.10.3
Date: Tue, 19 Dec 2017 20:30:54 GMT
Content-Type: text/html
Content-Length: 12
Connection: keep-alive
Last-Modified: Tue, 19 Dec 2017 14:45:31 GMT
{{< /output >}}

    The server is now `nginx`. You can also navigate to your Linode's public IP address in a browser and confirm that the application is publicly accessible on port 80.

    {{< note >}}
When deploying a web application, be sure to turn off the `Server` header and follow the [recommended NGINX security configurations](https://www.owasp.org/index.php/SCG_WS_nginx).
{{< /note >}}

### Non-HTTP Protocols
NGINX can proxy non-HTTP protocols using appropriate `*_proxy` directives such as:

* `fastcgi_pass` passes a request to a FastCGI server
* `uwsgi_pass` passes a request to a uwsgi server
* `scgi_pass` passes a request to an SCGI server
* `memcached_pass` passes a request to a memcached server

### Pass Request Headers to Backend Servers

Sometimes your backend application needs to know the IP address of the user who is visiting your website. With a reverse proxy, the backend server only sees the proxy IP address. This can be solved by passing the IP address of the client using HTTP request headers. The `proxy_set_header` directive is used for this.

{{< file "/etc/nginx/sites-available/myapp" nginx >}}
server {
    listen 80;

    server_name myapp;

    location / {
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $host;
            proxy_pass http://localhost:8000/;
    }
}
{{< /file >}}

`$remote_addr` is a built-in variable that holds the IP address of the client; `$host` contains the hostname for the request. You can read more about these variables [here](https://nginx.org/en/docs/varindex.html).

### Choose a Bind Address
If your backend server is configured to only accept connections from certain IP addresses and your proxy server has multiple network interfaces, then you want your reverse proxy to choose the right source IP address when connecting to a backend server. This can be achieved with `proxy_bind`:

{{< file-excerpt "/etc/nginx/sites-enabled/example.conf" nginx >}}
location / {
    proxy_bind 192.0.2.1;
    proxy_pass http://localhost:8000/;
}
{{< /file-excerpt >}}

Now when your reverse proxy connects with the backend server it will use `192.0.2.1` as the source IP address.

### Buffers
When NGINX receives a response from the backend server, it buffers the response before sending
it to the client, which helps optimize performance with slow clients. Buffering
can be turned off or customized with these directives: `proxy_buffering`, `proxy_buffers` and `proxy_buffer_size`.

{{< file-excerpt "/etc/nginx/sites-available/myapp" nginx >}}
location / {
    proxy_buffers 8 2k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:8000/;
}
{{< /file-excerpt >}}

 - `proxy_buffering` is used to enable or disable buffering.
 - `proxy_buffering off;` disables buffering. Buffering is enabled by default.
 - `proxy_buffers` controls the number and size of buffers allocated to each request. In the example above, there are 8 buffers, each of which is 2KB.
 - `proxy_buffer_size` controls the size of initial buffer where the response is first stored for all requests.
