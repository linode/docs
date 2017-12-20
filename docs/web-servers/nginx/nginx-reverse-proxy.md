---
author:
  name: mouhsen_ibrahim
  email: mohsen47@hotmail.co.uk
description: 'This guide will show you how to use nginx as a reverse proxy'
og_description: 'This guide will show you how to use nginx as a reverse proxy.'
keywords: ["nginx","proxy","reverse proxy"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-19
modified: 2017-12-19
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

NGINX offers excellent security, acceleration, and load balancing features, making it one of the most popular choices to serve as a reverse proxy. Since in this configuration NGINX handles all client interaction, it can provide security and optimization to backend servers (or services running on localhost) that often lack these features.

For more information on the benefits of using NGINX as a reverse proxy, see the official [documentation](https://www.nginx.com/resources/glossary/reverse-proxy-server/).

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services; this guide will use `sudo` wherever possible.

3.  Log in to your Linode via SSH and check for updates using `apt-get` package manager.

        sudo apt update && sudo apt upgrade -y

### Install NGINX

Debian and Ubuntu:

    sudo apt install nginx

CentOS and RHEL:

    sudo yum install epel-release && sudo yum install nginx

{{< note >}}
If you are unfamiliar with NGINX configuration, see our [How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx) guide for more information.
{{< /note >}}

## Create a Python Test Server

To create an HTTP server to serve requests from the proxy server, we can use the `http.server` for Python 3.4 and above.

This module will create an HTTP server which will serve files from the working directory.

### Install Python

{{< section file="/shortguides/install_python_miniconda.md" >}}

### Create a Sample App

1.  Since the module will serve all files in the working directory, create a new one for this example:

        mkdir myapp
        cd myapp

2.  Once you have navigated into the new directory, create a test page for the app to serve:

        echo "hello world" > index.html

3.  Start a basic http server which will serve the files from the working directory:

        python -m http.server 8000 --bind 127.0.0.1

    {{< note >}}
Python 2.7 has an equivalent module via `python -m SimpleHTTPServer 8000` that listens to all interfaces but does not have an option to bind to a specific address from the command line.

Using the `http.server` module from Python 3.4 and above is highly recommanded as it allows a convenient way to bind to a specific IP. Some distributions may need to specify the Python version explicitly: `python3 -m http.server 8000 --bind 127.0.0.1`
{{< /note >}}

4.  Open a new terminal. Use `curl` to check the header:

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

While this step is optional, this allows a way to automatically point a local host domain name.

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

In this section you will configure NGINX to serve these two HTTP endpoints on the same port `80` but with different domain names or different URLs.

1.  Create an NGINX configuration in `/etc/nginx/sites-available/myapp`.

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
Do not forget to add a trailing slash `/` to the end of the URL in the `proxy_pass` directive so NGINX can correctly generate a URL to be sent to the backend server.
{{< /caution >}}

2.  Make a symlink to `sites-enabled`:

        sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp

3.  Remove the default symlink.

        sudo rm /etc/nginx/sites-enabled/default

4.  Restart nginx for changes to take effect:

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

    The server is now `nginx`. You can also navigate to your Linode's public IP address in a browser and confirm that the application is now being reversed proxied to port 80.

{{< note >}}
When deploying a web application, be sure to turn off the `Server` header and follow the [recommended NGINX security configurations](https://www.owasp.org/index.php/SCG_WS_nginx).
{{< /note >}}

### Non-HTTP Protocols
NGINX can proxy non-HTTP protocols using appropriate `*_proxy` directives such as:

* `fastcgi_pass` passes a request to a FastCGI server
* `uwsgi_pass` passes a request to a uwsgi server
* `scgi_pass` passes a request to an SCGI server
* `memcached_pass` passes a request to a memcached server

### Passing Request Headers to Backend Servers
Sometimes your web application needs to know the real IP address of the user who is visiting your website. In case of a reverse proxy, the backend server only sees the proxy IP address.

This can be solved by passing the IP address of the client using HTTP request headers. The `proxy_set_header` directive is used for this.

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

`$remote_addr` and `$host` are built-in variables for NGINX. The first one holds the IP address of the client and the second one contains the hostname for the request. You can find more about those variables [here](https://nginx.org/en/docs/varindex.html).

### Choosing a Bind Address
If your backend server is configured to only accept connections from certain IP addresses and your proxy server has multiple network interfaces, then you want your reverse proxy to choose the right source IP address when connecting to a backend serverr. This can be achieved with `proxy_bind`

{{< file-excerpt "/etc/nginx/sites-enabled/example.conf" nginx >}}
location / {
    proxy_bind 192.0.2.1;
    proxy_pass http://localhost:8000/;
}
{{< /file-excerpt >}}

Now when your reverse proxy connects with the backend server it will use the source IP address
specified in the directive which is `192.0.2.1`.

### Buffering
When NGINX receives a response from the backend server, it buffers the response before sending
it directly to the client which helps to optimize performance with slow clients. However, buffering
can be controlled with these directives: `proxy_buffering`, `proxy_buffers` and `proxy_buffer_size`.

{{< file-excerpt "/etc/nginx/sites-available/myapp" nginx >}}
location / {
    proxy_buffers 8 2k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:8000/;
}
{{< /file-excerpt >}}

 - `proxy_buffering` directive is used to enable or disable buffering. It can be disabled with
 - `proxy_buffering off;`. Buffering is enabled by default.
 - `proxy_buffers` controls the number and size of buffers allocated to each request. In the example above, there are 8 buffers with each 2 kilobytes in size.
 - `proxy_buffer_size` controls the size of initial buffer where the response is first stored for all requests.

## Conclusion
We learned the basics of using NGINX as a reverse proxy to serve content from multiple locations and from servers which are not exposed to the internet.

We also learned about buffering responses from backend servers to NGINX and about using a specific IP addresses when connecting to the backend server and sending request headers to backend servers.
