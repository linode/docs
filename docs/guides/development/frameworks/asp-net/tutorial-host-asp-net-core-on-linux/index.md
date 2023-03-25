---
slug: tutorial-host-asp-net-core-on-linux
description: "This guide shows you how to install and get started with the .NET Core for building and hosting ASP.NET applications on Linux using NGINX as a web server and reverse proxy."
keywords: ['asp net core tutorial']
tags: ['web applications', 'nginx']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
modified_by:
  name: Nathaniel Stickman
title: "Tutorial: Hosting ASP.NET Core on Linux"
title_meta: "An ASP.NET Core on Linux Tutorial"
image: ASPNET.jpg
external_resources:
- '[Tutorial: Get Started with ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0)'
- '[Microsofts ASP.NET Core Recommended Learning Path](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0#recommended-learning-path)'
authors: ["Nathaniel Stickman"]
---

[ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0) is Microsoft's cross-platform and open-source redesign of its original ASP.NET framework. With ASP.NET Core, you can build and run .NET applications not only on Windows but also macOS and Linux.

This guide shows you how to install ASP.NET Core on your Linux server and how to use it to create a web application. Then, it walks you through the steps for deploying your application using NGINX.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. This guide uses `example-app` as the name of the ASP.NET Core application and `example.com` as your server's domain name. Replace these with your preferred application name and actual server name, respectively.

{{< note respectIndent=false >}}
The steps in this guide are  written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install ASP.NET Core

These installation steps work for Debian 10 and Ubuntu 20.04. If you are using another Linux distribution, refer to the Microsoft's [Install .NET on Linux](https://docs.microsoft.com/en-us/dotnet/core/install/linux) guide.

1. Add Microsoft's package keys and its package repository.

    - On Debian:

            wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
            sudo dpkg -i packages-microsoft-prod.deb

    - On Ubuntu:

            wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
            sudo dpkg -i packages-microsoft-prod.deb

1. Update the package indices.

        sudo apt update

1. Install the APT package allowing you to use repositories over HTTPS and update APT's indices again.

        sudo apt install apt-transport-https
        sudo apt update

1. Install the .NET Core SDK.

        sudo apt install dotnet-sdk-5.0

    Replace `5.0` with the latest version of the .NET Core SDK available, which you can find by running the following command:

        sudo apt search dotnet-sdk

    Alternatively, you can install .NET SDK using `snap`.

        sudo snap install dotnet-sdk

1. Verify the .NET Core version installed

        dotnet --version

## Create a Web Application with .NET Core

1. Initialize a base .NET web application project.

        dotnet new webapp -o example-app

1. Change into the application's directory.

        cd example-app

    Unless noted otherwise, all subsequent commands in this guide assume you are still in the application's directory.

1. Run the application.

        dotnet watch run

    .NET Core serves the application on `localhost` port `5001`. To visit the application remotely, you can use an SSH tunnel:

    - On Windows, you can use the PuTTY tool to set up your SSH tunnel. Follow the appropriate section of the [Using SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/#ssh-tunnelingport-forwarding) guide, replacing the example port number there with `5001`.
    - On OS X or Linux, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address.

            ssh -L5001:localhost:5001 example-user@192.0.2.0

1. Now you can visit the application in your browser by navigating to `https://localhost:5001`.

    {{< note respectIndent=false >}}
.NET Core serves your application over HTTPS. When visiting the application, you browser may warn you that the SSL certificate is self-signed. Choose to proceed anyway.
    {{< /note >}}

.NET Core uses Razor as its template engine for web application interfaces. You can learn more about using Razor in your web application from Microsoft's [Get started with Razor Pages in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/tutorials/razor-pages/razor-pages-start?view=aspnetcore-5.0&tabs=visual-studio) guide. .NET Core also has extensive support for developing applications using the Model–View–Controller (MVC) architecture. If you want to learn more about MVC, checkout the Microsoft's [Get started with ASP.NET Core MVC](https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-5.0&tabs=visual-studio) guide.

## Deploy Your Application with NGINX

.NET Core's default server, Kestrel, works well for serving dynamic web applications. However, Microsoft recommends pairing it with a reverse proxy server when deploying your application to production. Doing so allows you to offload tasks like request handling and serving static content.

The steps in this section show you how to set up NGINX as the reverse proxy server for your .NET Core application.

### Install and Configure NGINX

1. Install NGINX:

        sudo apt install nginx

1. Create a `/etc/nginx/proxy.conf` file, and add the contents of the example file:

    {{< file "/etc/nginx/proxy.conf" >}}
proxy_redirect          off;
proxy_set_header        Host $host;
proxy_set_header        X-Real-IP $remote_addr;
proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header        X-Forwarded-Proto $scheme;
client_max_body_size    10m;
client_body_buffer_size 128k;
proxy_connect_timeout   90;
proxy_send_timeout      90;
proxy_read_timeout      90;
proxy_buffers           32 4k;
    {{< /file >}}

1. Open the NGINX configuration file — `/etc/nginx/nginx.conf` — and replace its contents with the following:

    {{< file "/etc/nginx/nginx.conf" >}}
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {
    include        /etc/nginx/proxy.conf;
    limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s;
    server_tokens  off;

    sendfile on;
    keepalive_timeout   29;
    client_body_timeout 10; client_header_timeout 10; send_timeout 10;

    upstream example-app{
        server localhost:5000;
    }

    server {
        listen                    443 ssl http2;
        listen                    [::]:443 ssl http2;
        server_name               example.com;

        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;

        location / {
            proxy_pass http://example-app;
            limit_req  zone=one burst=10 nodelay;
        }
    }
}
    {{< /file >}}

1. Open access to the HTTPS port (`443`) on your server's firewall.

        sudo ufw allow https
        sudo ufw reload

### Get an SSL Certificate

The steps below show you how to use [Certbot](https://certbot.eff.org) to request and download a free certificate from [Let's Encrypt](https://letsencrypt.org) and how to add that certificate to your NGINX server.

1. Install the [Snap Store](https://snapcraft.io/docs/getting-started). Snap provides application bundles that work across major Linux distributions. If you are using Ubuntu, Snap should already be installed (since version 16.04):

        sudo apt install snapd

1. Update and refresh Snap.

        sudo snap install core && sudo snap refresh core

1. Ensure that any existing Certbot installation is removed.

        sudo apt remove certbot

1. Install Certbot, and create a symbolic link for executing it.

        sudo snap install --classic certbot
        sudo ln -s /snap/bin/certbot /usr/bin/certbot

1. Download a certificate for your site.

        sudo certbot certonly --nginx

    Certbot prompts you to select from the NGINX sites configured on your machine. Select the one with your domain name.

1. Certbot includes a cron job that automatically renews your certificate before it expires. You can test the automatic renewal with the following command:

        sudo certbot renew --dry-run

### Add the SSL Certificate to NGINX

1. Add the SSL certificate and its key to your NGINX configuration, via the `ssl_certificate` and `ssl_certificate_key` properties as shown below:

    {{< file "/etc/nginx/nginx.conf" >}}
# [...]

    server {
        listen                    443 ssl http2;
        listen                    [::]:443 ssl http2;
        server_name               example.com *.example.com;
        ssl_certificate           /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key       /etc/letsencrypt/live/example.com/privkey.pem;

        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;

# [...]
    {{< /file >}}

1. Verify the NGINX configuration. Then, assuming the test passes, restart NGINX.

        sudo nginx -t
        sudo systemctl restart nginx

1. You can test NGINX's routing to the application by running the application directly.

        dotnet watch run

### Prepare the Application

The steps below ensure that your .NET Core application works properly with the NGINX reverse proxy. These steps also have you make a "published" executable of your application, which makes it easier to use in production scenarios.

1. Open the `Startup.cs` file, and add the *Forwarded Headers* middleware. Ensure that the `app.UseForwarededHeaders` method is invoked before any other middleware.

    {{< file "~/example-app/Startup.cs" >}}
// [...]

using Microsoft.AspNetCore.HttpOverrides;

// [...]

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseAuthentication();

            // [...]
        }

// [...]
    {{< /file >}}

1. Publish your application.

        dotnet publish --configuration Release

    The output should indicate the location of an `example-app.dll` file. Take note of that location, as it is used in the `example-app.service` file created below. It should be similar to `/bin/Release/net5.0/example-app.dll`.

1. Copy your project to the `/var/www` directory. This is a conventional place to store your production application, but it also allows you to separate your production and working versions of the application.

        sudo cp -r ~/example-dotnet-app /var/www/example-dotnet-app

1. Create a service file for `systemd` to run the application.

    {{< file "/etc/systemd/system/example-app.service" >}}
[Unit]
Description=Example .NET Core Web Application

[Service]
WorkingDirectory=/var/www/example-app
ExecStart=/usr/bin/dotnet /var/www/example-app/bin/Release/net5.0/example-app.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=dotnet-example-app
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
    {{< /file >}}

### Run the Application

1. Enable the `systemd` service for the published application, and then start it up.

        sudo systemctl enable example-app
        sudo systemctl start example-app

1. Verify that the application is running by visiting its URL, `http://example.com`.

## Conclusion

You have now successfully created and deployed a .NET Core application. You can continue your journey and learn more about using .NET for web-application development by following Microsoft's [Recommended learning path](https://docs.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-5.0#recommended-learning-path).
