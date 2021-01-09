---
slug: build-aspnetcore-applications-on-debian-10-with-nginx
author:
  name: Dan Nielsen
  email: dnielsen@fastmail.fm
description: 'Setting up an ASP.NET Coe web application on Debian 10.'
og_description: 'Setting up an ASP.NET Coe web application on Debian 10.'
keywords: ['dotnet', 'asp.net', 'dotnet core', 'nginx', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-07
modified_by:
  name: Dan Nielsen
title: "Build an ASP.NET Core Application on Debian 10 With Nginx"
h1_title: "Build an ASP.NET Core Application on Debian 10 With Nginx"
contributor:
  name: Dan Nielsen
  link: https://dnielsen.dev
external_resources:
- '[Debian 10](https://www.debian.org)'
- '[Nginx](https://nginx.com)'
- '[ASP.Net Core](https://docs.microsoft.com/en-us/aspnet/core/)'
---

## Introduction

This guide will cover setting up a simple [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/) web application on [Debain 10](https://www.debian.org) using [Nginx](https://nginx.org) as a reverse proxy and `systemd` as a process manager for the .NET application.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Component Installation

### Install the .NET SDK

        # Add the Microsoft package signing key to the list of trusted keys
        wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
        # Add the package repository
        sudo dpkg -i packages-microsoft-prod.deb
        # Install the SDK
        sudo apt-get update ; \
          sudo apt-get install -y apt-transport-https && \
          sudo apt-get update && \
          sudo apt-get install -y dotnet-sdk-5.0

{{< note >}}
The .NET SDK includes a telemetry feature that collects and reports usage data to Microsoft in the event of a .NET CLI crash. If you choose, you can opt-out of this feature by setting the `DOTNET_CLI_TELEMETRY_OPTOUT` environmnet variable to `1` or `true`. More information can be found [here](https://docs.microsoft.com/en-us/dotnet/core/tools/telemetry).
{{< /note >}}

### Install nginx

        # Install nginx and enable it for automatic start on boot
        sudo apt-get install -y nginx
        sudo systemctl enable nginx

{{< note >}}
nginx is typically started automatically after install but its status can be verified with the following:
{{< /note >}}

        sudo systemctl status nginx
        # Start if needed
        sudo systemctl start nginx

## Configure the Application Environment

In this guide the web application will be stored in `/opt/appone` but could be stored anywhere. A group called `appone` will be created for use with the web application, though this isn't strictly necessary. Users added to this group will be able to `read`, `write`, and `execute` in the application directory.

        sudo /sbin/groupadd appone
        sudo /sbin/usermod -aG appone <username>
        sudo mkdir /opt/appone
        sudo chgrp appone /opt/appone
        # Using the s option when setting directory permisssions
        # will cause files created in /opt/appone to use the appone group.
        # This is sometimes referred to as setting the sticky bit.
        sudo chmod g+swx /opt/appone
    
        # Log out / log in to see the changes to your user group.
        # The verify the changes as follows.
        groups <your username>
        <username> some other groups ... appone

        touch /opt/appone/test
        ls -lh /opt/appone
        -rw-r--r-- 1 <username> appone 0 Jan  8 08:16 test
        rm -f /opt/appone/test

## Add a New Web Application From a .NET Template

The .NET SDK comes with a number of pre-installed templates to ease application bootstrapping. There are also a number of community created templates available in [NuGET](https://www.nuget.org) the .NET package manager but for this guide the default templates are adequate. This guide will use the default `mvc` (Model-View-Controller) template.

{{< note >}}
To see all the installed templates run `dotnet new -u`
{{< /note >}}

{{< note >}}
If you prefer to develop locally, follow the instructions for creating the new application replacing the file paths as appropriate or use your preferred development workflow. When finished with the application changes laid out below, build the application with the `Release` configuration using `dotnet build -c Release` and copy the resulting DLL file to the `/opt/appone` directory on your application host.
{{< /note >}}

        cd /opt/appone
        dotnet new mvc

As this point we have a working ASP.NET MVC application and can now make some adjustments to support it's purpose as a proxy target. These changes will happen in the `Program.cs` and `Startup.cs` files that were generated in the last step.

To begin with `Program.cs` will be changed to explicitly use the `Kestrel` HTTP server and to listen on a single endpoint.

{{< note >}}
By default, ASP.NET core applications are configured to listen on ports 5000 and 5001 for the HTTP and HTTPS protocols respectively. In a reverse proxy setup the HTTPS termination happens at the proxy (Nginx) which then forwards the request to a backend application. In this guide the reverse proxy and the application reside on the same host so encrypting communication between them is not required. If the reverse proxy runs on another host or is distributing connections to multiple remote hosts, consider configuring HTTPS comunnication between the reverse proxy and the backend applications.
{{< /note >}}

{{< file "Program.cs" cs >}}
using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace appone
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseKestrel(opts => {
                        opts.Listen(IPAddress.Loopback, 5000);
                    });
                });
    }
}
{{< /file >}}

Since Nginx will be acting as a reverse proxy forwarding requests to the ASP.NET application in `Startup.cs` the `Forwarded Headers Middleware` will be added. This middleware updates `Request.Scheme` using the `X-Forwarded-Proto` header so that redirect URIs and other security policies are applied correctly. Though this guide does not cover those topics, it's good practice to be familiar with this middleware. The `Forwarded Headers Middleware` should run before all other middleware. Placing it first ensures that middleware which relies on forwarded header information can consume the header values for processing.

{{< file "Startup.cs" cs >}}
using Microsoft.AspNetCore.HttpOverrides;

// ... Snipped for brevity ...

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // This should come before calls to other middleware
    app.UseForwardedHeaders(new ForwardHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });

    // Other middleware calls can be configured below.
}
{{< /file >}}


{{< note >}}
At this time you can use `dotnet run` to start the application however since the application only binds to the network loopback address it will only be available to requests from the local machine and is not seen by the broader internet. If you would like to view the running application change the call to `opts.Listen()` in `Program.cs` to reference the host's public IP address, e.g. `opts.Listen('aa.bb.cc.dd', 5000);` and open port 5000 on your firewall. Remember to close that port and change the call back to the loopback address after inspecting the application.
{{< /note >}}

### Build the Application

        # In the /opt/appone directory
        dotnet build -c Release

## Configure Nginx

Nginx can now be onfigured as a reverse proxy to forward HTTP requests to the ASP.NET application.

{{< file "/etc/nginx/sites-available/default" nginx >}}
server {
    listen        80;
    server_name   the-domain.com;
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

Or if using SSL ...

{{< file "/etc/nginx/sites-available/default" nginx >}}
server {
    listen        80;
    server_name   the-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen        443;
    server_name   the-domain.com

    ssl_certificate     /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/certificate.key;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
{{< /file >}}

Once the Nginx config changes are complete verify the changes and reload Nginx.

        sudo nginx -t
        sudo nginx -s reload

## Create the Service File

Managment of the ASP.NET app is delegated to `systemd` with a service file.

{{< note >}}
If you developed your application locally and copied the release DLL to `/opt/appone`, change the DLL path in the `ExecStart` parameter as needed.
{{< /note >}}

{{< file "/etc/systemd/system/appone.service" ini >}}
[Unit]
Description=Example ASP.NET Core App

[Service]
WorkingDirectory=/opt/appone
# ExecStart=/usr/bin/dotnet /opt/appone/appone.dll
ExecStart=/usr/bin/dotnet /opt/appone/bin/Release/net5.0/appone.dll
Restart=always
# Restart service after 10 seconds if the dotnet service crashes:
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=appone
Environment=ASPNETCORE_ENVIRONMENT=production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
Environment=DOTNET_CLI_TELEMETRY_OPTOUT=true

[Install]
WantedBy=multi-user.target
{{< /file >}}

### Enable and Start the Application Service

        sudo systemctl enable appone.service
        sudo systemctl start appone.service

### Viewing Application Logs

Since the web application is managed using `systemd`, all events and log output are logged to a centralized journal. However, this journal includes entries for all services and processes controlled by `systemd`. To view just the `appone` specific entries use these commands.

        sudo journalctl -fu appone.service
        # Additional times options can be specified
        sudo journalctl -fu appone.service --since yesterday --until one hour ago

## Conclusion

That's it. You now have a working ASP.NET Core web application. Remember to close any firewall ports that were opened for development. If you changed the application IP binding to bind to the public IP address for testing, change it back to the loopback address, rebuild the application, and restart the application service.
