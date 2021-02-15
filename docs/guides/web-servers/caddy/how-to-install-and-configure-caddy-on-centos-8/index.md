---
slug: how-to-install-and-configure-caddy-on-centos-8
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, you will install the Caddy web server on CentOS 8. You will also configure Caddy to serve your site''s domain over HTTPS.'
og_description: 'In this guide, you will install the Caddy web server on CentOS 8. You will also configure Caddy to serve your site''s domain over HTTPS.'
keywords: ['web server','caddy','https','Caddyfile']
tags: ["centos","web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-05
modified_by:
  name: Linode
title: "How to Install and Configure the Caddy Web Server on CentOS 8"
h1_title: "Install and Configure the Caddy Web Server on CentOS 8"
contributor:
  name: Linode
relations:
    platform:
        key: install-caddy-server
        keywords:
            - distribution: CentOS 8
aliases: ['/web-servers/caddy/how-to-install-and-configure-caddy-on-centos-8/']
---

[Caddy](https://caddyserver.com/) is a fast, open-source, and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's [hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), and [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services).

1.  Register (purchase) your site's domain name and follow our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview#add-records) guide to point the domain to your Linode.

1.  Update your system:

        sudo yum update

1. Install the SELinux core policy Python utilities. This will give you the ability to manage SELinux settings in a fine-grained way.

        sudo yum install -y policycoreutils-python-utils

## Install Caddy

1. Install the `tar` command line utility. The Caddy download script will need `tar` to complete its installation in the next step.

        sudo yum install tar

1. Install Caddy. This will install Caddy version 1.0.4. along with the `hook.service` [plugin](https://github.com/hacdias/caddy-service), which gives you access to a systemd unit file that you can use to manage Caddy as a systemd service. See their [downloads page](https://caddyserver.com/v1/download) for more information on available Caddy versions.

        curl https://getcaddy.com | bash -s personal hook.service

    Caddy will be installed to your `/usr/local/bin/caddy` directory.

    {{< note >}}
To learn about Caddy licensing, please read their [blog post on the topic](https://caddyserver.com/v1/blog/announcing-caddy-1_0-caddy-2-caddy-enterprise). In 2017, commercial use of Caddy and their binaries required a license, however, they have recently updated their licensing and commercial licenses are no longer required for their use.
    {{</ note >}}

1. Add Caddy to your system's `$PATH`.

        sudo echo 'export PATH=/usr/local/bin/caddy:$PATH' | sudo tee /etc/profile.d/caddy.sh

1. Reload your system's profile or log out and SSH back into your Linode.

        . /etc/profile

    {{< note >}}
You can verify that the Caddy executable is in your system's `$PATH` with the following command:

    echo $PATH

The output should include the location of your Caddy executable:

    /usr/local/bin/caddy:/home/example_user/.local/bin:/home/example_user/bin:/usr/local/bin/caddy:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin

    {{</ note >}}

1. Install Caddy as a systemd service.

        sudo env "PATH=$PATH" caddy -service install

1. Temporarily set SELinux to permissive mode in order to start the Caddy service.

        sudo setenforce 0

1. Start the Caddy service:

        sudo systemctl start caddy

1. Verify that the service is active:

        sudo systemctl status caddy

    You should see a similar output:

    {{< output >}}
● caddy.service - Caddy's service
   Loaded: loaded (/etc/systemd/system/caddy.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2020-03-05 14:56:45 EST; 9s ago
 Main PID: 19505 (caddy)
    Tasks: 10 (limit: 4659)
   CGroup: /system.slice/caddy.service
           └─19505 /usr/local/bin/caddy

Mar 05 14:56:45 example_hostname systemd[1]: Started Caddy's service.
Mar 05 14:56:45 example_hostname caddy[19505]: Activating privacy features... done.
Mar 05 14:56:45 example_hostname caddy[19505]: Serving HTTP on port 2015
Mar 05 14:56:45 example_hostname caddy[19505]: http://:2015
    {{</ output >}}

1. Set SELinux back to enforcing mode once you have successfully started the Caddy service.

        sudo setenforce 1

## Add Web Content

In this section, you will create the necessary directories to host your website files, set their correct permissions, and add a basic index file to your example site.

{{< note >}}
Throughout this section, replace all instances of `example.com` with your own domain.
{{</ note >}}

1.  Set up a *document root* for your website. A document root is the directory where your website files are stored.

        sudo mkdir -p /var/www/example.com

1. Use SELinux’s `chcon` command to change the file security context for web content:

        sudo chcon -t httpd_sys_content_t /var/www/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/example.com -R

1. Create a test index page for your site. Replace `example.com` with your own domain.

        sudo touch /var/www/example.com/index.html

1. Add the example `html` to your site's index.

        sudo echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' | sudo tee /var/www/example.com/index.html

## Configure the Caddyfile

Now that you have your website's document root set up with example content, you are ready to configure Caddy to serve your website files to the internet. This section will create a basic Caddy configuration, which will [automatically enable HTTPS using Let's Encrypt](https://caddyserver.com/v1/).

1. Create a directory to store Caddy's configuration files:

        sudo mkdir -p /etc/caddy

1. Using the text editor of your choice, create and edit the [Caddyfile](https://caddyserver.com/docs/caddyfile-tutorial) to serve your example site. The Caddyfile is Caddy's main configuration file. Replace `example.com` with your own domain.

      {{< file "/etc/caddy/Caddyfile" >}}
example.com {
    root /var/www/example.com
}
      {{</ file >}}

1. Open the firewall for traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload

1. Tell Caddy where to look for your Caddyfile, replace `admin@example.com` with your email address:

        sudo env "PATH=$PATH" caddy -agree -conf /etc/caddy/Caddyfile -email admin@example.com &

    Caddy will automatically serve your site over HTTPS using Let's Encrypt.

    {{< output >}}
Activating privacy features...

2020/03/05 13:31:25 [INFO] acme: Registering account for admin@example.com
2020/03/05 13:31:25 [INFO] [example.com] acme: Obtaining bundled SAN certificate
2020/03/05 13:31:26 [INFO] [example.com] AuthURL: https://acme-v02.api.letsencrypt.org/acme/authz-v3/3180082162
2020/03/05 13:31:26 [INFO] [example.com] acme: Could not find solver for: tls-alpn-01
2020/03/05 13:31:26 [INFO] [example.com] acme: use http-01 solver
2020/03/05 13:31:26 [INFO] [example.com] acme: Trying to solve HTTP-01
2020/03/05 13:31:26 [INFO] [example.com] Served key authentication
2020/03/05 13:31:26 [INFO] [example.com] Served key authentication
2020/03/05 13:31:26 [INFO] [example.com] Served key authentication
2020/03/05 13:31:36 [INFO] [example.com] Served key authentication
2020/03/05 13:31:40 [INFO] [example.com] The server validated our request
2020/03/05 13:31:40 [INFO] [example.com] acme: Validations succeeded; requesting certificates
2020/03/05 13:31:41 [INFO] [example.com] Server responded with a certificate.
done.

Serving HTTP on port 80
http://digitalnabi.com

Serving HTTPS on port 443
https://example.com
    {{</ output >}}

1. Open a web browser and visit your domain. You should see the contents of the `index.html` page that you created in Step 4 of the [Add Web Content section](#add-web-content).
