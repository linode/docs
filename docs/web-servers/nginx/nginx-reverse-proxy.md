---
author:
    name: mouhsen_ibrahim
    email: mohsen47@hotmail.co.uk
description: 'Using Nginx as a reverse proxy'
keywords: ["nginx","proxy","reverse proxy"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-14
modified: 2017-12-14
modified_by:
    name: Linode
title: 'Nginx reverse proxy'
contributor:
    name: Mouhsen Ibrahim
    link: https://github.com/mohsenSy
external_resources:
  - '[Nginx Documentation](https://nginx.org/en/docs)'
  - '[Nginx Proxy Documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)'
---

## Introduction
[Nginx](https://www.nginx.org) is a HTTP and reverse proxy server, written by [Igor Sysoev](http://sysoev.ru/en/)
and is used by many high traffic Russian websites, using Nginx as a reverse proxy is a simple task which we
will cover in this guide but before that we will take a look at reverse proxies to get an idea about what
are they used for?

## What is a reverse proxy?
A [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) is a type of proxy server which retrieves
content from backend servers on behalf of the client, the backend server receives connections only from
the reverse proxy and not from the client, it can be used to hide the identity of backend servers,
as an application firewall to force authentication before accessing backend servers, SSL termination
at the proxy level, caching content and many other uses cases.

## Before You Begin
1. Complete the [Getting Started](/docs/getting-started) guide.
2. Follow the [Secure Your Server](/docs/security/securing-your-server/) guide to create
   a standard user account, harden SSH access and remove unnecessary network services; this guide will use
   `sudo` wherever possible.
3. Log in to your Linode via SSH and check for updates using `apt-get` package manager.

  `sudo apt-get update && sudo apt-get upgrade -y`

4. If you are a beginner at using Nginx you can check this [tutorial](/docs/web-servers/nginx/how-to-configure-nginx).


### Install Nginx
If you are using a Debian based Linux distribution you can install Nginx with the following command

    sudo apt-get install nginx

If you are using a Red Hat based Linux distribution you can install Nginx with these two commands

    sudo yum install epel-release && sudo yum install nginx

The rest of this tutorial applies to both Debian and Red Hat based distributions without any modifications.

After Nginx is installed you can check if it is installed correctly with the follwoing command `nginx -t`.
It checks Nginx configuration file and return any errors if present.

Next start Nginx with this command `sudo service nginx start`, you can make sure it started correctly
with this command `curl localhost` and you should see an output similar to this
![Nginx Curl Default Page](/docs/assets/nginx/nginx-curl-default-page.png "Nginx Curl Default Page")


### Simple reverse proxy
We will start with a very simple example, in Nginx you can use the `proxy_pass` directive to define a
reverse proxy, this directive can be added to any Nginx block as required.

Let's say we have a site configuration called `example.conf` to define a reverse proxy in it we use:

{{< file-excerpt "/etc/nginx/sites-enabled/example.conf" nginx >}}
location /example1 {
    proxy_pass http://www.example1.com/;
}
location /example2 {
    proxy_pass http://www.example2.com/;
}
{{< /file-excerpt >}}

The above configuration file defines two reverse proxies based on the URL.

When you try to open `http://example.com/example1`, Nginx forwards the request to http://www.example1.com/
and when you try to open `http://example.com/example2`, Nginx forwards the request to http://www.example2.com/

The idea of using Nginx reverse proxy is simple, write the configuration you want then add proxy_pass
directives when needed, however Nginx can proxy non-HTTP protocols using appropriate `*_proxy` directives such as:

* fastcgi_pass passes a request to a FastCGI server
* uwsgi_pass passes a request to a uwsgi server
* scgi_pass passes a request to an SCGI server
* memcached_pass passes a request to a memcached server

{{< caution >}}
DO NOT forget to add / to the end of URL in `proxy_pass` directive so Nginx can correctly generate a URL to be sent to the backend server.
{{< /caution >}}

In the following sections we will test Nginx reverse proxy using some examples, first we need to create a HTTP
server to serve requests from the proxy server, we can use `SimpleHTTPServer` python module.

execute the following commands:

```
  cd
  mkdir hello1
  echo "hello1" > hello1/index
  mkdir hello2
  echo "hello2" > hello1/index
```

These are used to create two directories where we will run the web servers inside them, using two
terminals execute the following commands:

terminal 1
```
  cd hello1
  python -m SimpleHTTPServer 8000
```
terminal 2
```
  cd hello2
  python -m SimpleHTTPServer 8001
```

These create two web servers listening on ports 8000 and 8001

Execute these commands to make sure they are running correctly.

```
  curl localhost:8000/index
  hello1
  curl localhost:8001/index
  hello2
```

Now we will configure Nginx to serve these two HTTP endpoints on the same port `80` but with different
domain names or different URLs as we like.

{{< note >}}
To be able to use the domain names add these three lines to your `/etc/hosts` file

  127.0.0.1 example.com

  127.0.0.1 hello1.example.com

  127.0.0.1 hello2.example.com

{{< /note >}}

### Accessing backend servers using two different domain names
Here we will use two domain names, **hello1.example.com** and **hello2.example.com** to access the
two HTTP endpoints created inside **hello1** and **hello2** directories.

Create a new file called `hello1.example.com.conf` in `/etc/nginx/sites-available/` with the following content:

{{< file "/etc/nginx/sites-available/hello1.example.com.conf" >}}
server {
    listen 80;

    server_name hello1.example.com;

    location / {
            proxy_pass http://localhost:8000/;
    }
}
{{< /file >}}

Create another file called `hello2.example.com.conf` in `/etc/nginx/sites-available/` with the following content:

{{< file "/etc/nginx/sites-available/hello2.example.com.conf" >}}
server {
    listen 80;

    server_name hello2.example.com;

    location / {
            proxy_pass http://localhost:8001/;
    }
}
{{< /file >}}

Enable the two new sites with these two commands:

```
  sudo ln -s /etc/nginx/sites-available/hello1.example.com.conf /etc/nginx/sites-enabled/hello1.example.com.conf
  sudo ln -s /etc/nginx/sites-available/hello2.example.com.conf /etc/nginx/sites-enabled/hello2.example.com.conf
```

Restart Nginx for changes to take effect:
  `sudo service nginx restart`

Now test using these two commands:
```
  curl hello1.example.com/index
  hello1
  curl hello2.example.com/index
  hello2
```
From the above output we can see that `hello1.example.com` is served from the web server listening on port
8000 and running inside **hello1** directory and `hello2.example.com` is served from the web server listening
on port 8001 and running inside **hello2** directory.

### Accessing backend servers using two different URLs

Here we will use a single file to define the two proxies, create a file called `example.com.conf`
in `/etc/nginx/sites-available/` with the following content:

{{< file "/etc/nginx/sites-available/.example.com.conf" >}}
server {
    listen 80;

    server_name example.com;

    location /hello1 {
            proxy_pass http://localhost:8000/;
    }
    location /hello2 {
      proxy_pass http://localhost:8001/;
    }
}
{{< /file >}}

Enable the new site with this command:

```
  sudo ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf
```
Restart Nginx for the new changes to take effect

  `sudo service nginx restart`

Now you can test the new site using these commands:
```
  curl example.com/hello1/index
  hello1
  curl example.com/hello2/index
  hello2
```

### Restrict access to backend servers
Now after we learned how to access your backend servers using Nginx as a reverse proxy you may be wondering
How can I control and restrict this access? Giving users public and full access to your backend servers could
be dangerous so we need to restrict this access.

This can be done with two methods:
  1. Specify the URL which will be used to access your backend servers as follows.

    We will modify the first server to exaplain the idea of restricting access to some URLs, execute the following commands:
    ```
      cd
      cd hello1
      mkdir private
      mkdir public
      echo "private" > private/index
      echo "public" > public/index
    ```

    We created to directories, one is private which we do not want to allow external users through the proxy
    to access it and the other is public which will be accessible by external users through the proxy.

    If we execute the following commands we can see that it is possible to access both private and public URLs with current settings.
```
    curl hello1.example.com/private/index
    private
    curl hello1.example.com/public/index
    public
```
    This is not our intended behavior, to restrict access to public URLs only modify the `proxy_pass` directive
    in `hello1.example.com.conf` as follows:

    {{< file-excerpt "/etc/nginx/sites-available/hello1.example.com.conf" nginx >}}
    location / {
            proxy_pass http://localhost:8000/public/;
    }
    {{< /file-excerpt >}}

    Now restart Nginx for changes to take effect and try the previous commands again
```
    curl hello1.example.com/private/index
    <head>
    <title>Error response</title>
    </head>
    <body>
    <h1>Error response</h1>
    <p>Error code 404.
    <p>Message: File not found.
    <p>Error code explanation: 404 = Nothing matches the given URI.
    </body>
    curl hello1.example.com/public/index
    <head>
    <title>Error response</title>
    </head>
    <body>
    <h1>Error response</h1>
    <p>Error code 404.
    <p>Message: File not found.
    <p>Error code explanation: 404 = Nothing matches the given URI.
    </body>
```
    Now both of them return 404 errors, to be able to access resources under the `/public/` URL you must
    ignore the first part and just add the second one as follows:
```
    curl hello1.example.com/index
    public
```
    Now external users can only access `/public` URLs and not `/private` URLs.

    Without the `/` at the end of the `proxy_pass` directive, the URL sent to the backend server will be
    `/publicindex` which is incorrect, that is why it is important to use `/` at the end of URL
    in `proxy_pass` directive to make sure Nginx can generate the right URL when accessing backend servers.

  2. Use user name and password to access the backend servers
    You can specify a user name and a password to access the backend servers using `auth_basic`
    `auth_basic_user_file` directives.
    We will modify the `hello2.example.com.conf` file to protect the hello2 server using a user name and password.

    First we need to install `apache2-utils` package to be able to create the encrypted password file.

    On Debian based systems you can install it with `sudo apt-get isntall apache2-utils` and on
    Red Hat based systems you can isntall it with `sudo yum install httpd-tools`.

    Create the password file with the following command `sudo htpasswd -c /etc/nginx/.user.passwd linode`

    Enter and confirm the password, this creates a file with the encrypted password stored in it.

    Secure the file with these two commands:
```
      sudo chown www-data /etc/nginx/.user.passwd
      sudo chmod 400 /etc/nginx/.user.passwd
```
    These two commands make sure that only `www-data` user has only read access to the password file.

    Add these two lines to the `location` block in `/etc/nginx/sites-available/hello2.example.com.conf`

    {{< file-excerpt "/etc/nginx/sites-available/hello1.example.com.conf" nginx >}}
    location / {
            auth_basic "Private Only";
            auth_basic_user_file /etc/nginx/.user.passwd;
            proxy_pass http://localhost:8001/;
    }
    {{< /file-excerpt >}}

    {{< note >}}
    For more information about `auth_basic` and `auth_basic_user_file` directives check [this](http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html).
    {{< /note >}}

    Now restart Nginx and try to access `hello2` sever with this command:
```
    curl hello2.example.com/index
    <html>
    <head><title>401 Authorization Required</title></head>
    <body bgcolor="white">
    <center><h1>401 Authorization Required</h1></center>
    <hr><center>nginx/1.10.3 (Ubuntu)</center>
    </body>
    </html>
```
    As you can see the response is 401 Unauthorized, to pass the user name and password use this command
```
    curl linode:<password>@hello2.example.com/index
    hello2
```
    Now after providing user name and password you can access the server.

### Passing Request Headers to Backend Servers
Sometimes your web application needs to know the real IP address of the user who is visiting your website,
in case of a reverse proxy the backend server only sees the proxy IP address, This can be solved by passing
the IP address of the client using HTTP request headers, the `proxy_set_header` directive is used for this.

{{< file "/etc/nginx/sites-enabled/example.com.conf" >}}
server {
    listen 80;

    server_name example.com;

    location / {
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $host;
            proxy_pass http://localhost:8000/;
    }
}
{{< /file >}}

The `$remote_addr` and `$host` are built-in variables for Nginx, the first one holds the IP address of the client and the second one
contains the hostname for the request, you can find more about those variables [here](https://nginx.org/en/docs/varindex.html).

### Choosing a Bind Address
If your backend server is configured to only accept connections from certain IP addresses
and your proxy server has multiple network interfaces then you want your reverse proxy to choose
the right source IP address when connecting to a backend server, this can be achieved with `proxy_bind`
directive as showed next

{{< file-excerpt "/etc/nginx/sites-enabled/example.conf" nginx >}}
location /example1 {
    proxy_bind 192.0.2.1;
    proxy_pass http://www.example1.com/;
}
{{< /file-excerpt >}}

Now when your reverse proxy connects with the backend server it will use the source IP address
specified in the directive which is `192.0.2.1`.

### Buffering
When Nginx receives a response from the backend server it buffers the response before sending
it directly to the client which helps to optimize performance with slow clients, however buffering
can be controlled with these directives `proxy_buffering`, `proxy_buffers` and `proxy_buffer_size`.
The following shows an example

{{< file-excerpt "/etc/nginx/sites-enabled/example.conf" nginx >}}
location /example1 {
    proxy_buffers 8 2k;
    proxy_buffer_size 2k;
    proxy_pass http://www.example1.com/;
}
{{< /file-excerpt >}}

`proxy_buffering` directive is used to enable or disable buffering, it can be disabled with
`proxy_buffering off;`, buffering is enabled by default.

`proxy_buffers` controls the number and size of buffers allocated to each request in the example
above there are 8 buffers with each one 2 kilobytes in size.

`proxy_buffer_size` controls the size of initial buffer where the response is first stored for all requests.

## Conclusion
In this tutorial we learned the basics of using Nginx as a reverse proxy to serve content from multiple
locations and from servers which are not exposed to the internet, we also learned about restricting access
to our backend servers for security reasons and finally learned about buffering responses from backend
servers to Nginx and about using a specific IP address when connecting to the backend server
and sending request headers to backend servers.
