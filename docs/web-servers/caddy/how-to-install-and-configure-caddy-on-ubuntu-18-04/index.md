---
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, you will install the Caddy web server on Ubuntu 18.04. You will also configure Caddy to serve your site''s domain over HTTPS.'
og_description:  'In this guide, you will install the Caddy web server on Ubuntu 18.04. You will also configure Caddy to serve your site''s domain over HTTPS.'
keywords: ['web server','caddy','https','Caddyfile']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-05
modified_by:
  name: Linode
title: "How to Install and Configure the Caddy Web Server on Ubuntu 18.04"
h1_title: "Install and Configure the Caddy Web Server on Ubuntu 18.04"
contributor:
  name: Linode
---

[Caddy](https://caddyserver.com/) is a fast, open-source, and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's [hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), and [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services).

1.  Register (purchase) your site's domain name and follow our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview#add-records) guide to point the domain to your Linode.

1.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install Caddy

1. Install Caddy. This will install Caddy version 1.0.4. along with the `hook.service` plugin, which gives you access to a systemd unit file that you can use to manage Caddy as a systemd service. See their [downloads page](https://caddyserver.com/v1/download) for more information on available Caddy versions.

        curl https://getcaddy.com | bash -s personal hook.service

    Caddy will be installed to your `/usr/local/bin/caddy` directory.

    {{< note >}}
To learn about Caddy licensing, please read their [blog post on the topic](https://caddyserver.com/v1/blog/announcing-caddy-1_0-caddy-2-caddy-enterprise). In 2017, commercial use of Caddy and their binaries required a license, however, they have recently updated their licensing and commercial licenses are no longer required for their use.
    {{</ note >}}

1. Install Caddy as a systemd service:

        sudo caddy -service install

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

## Add Web Content

In this section, you will create the necessary directories to host your website files, set their correct permissions, and add a basic index file to your example site.

{{< note >}}
Throughout this section, replace all instances of `example.com` with your own domain.
{{</ note >}}

1.  Set up a *document root* for your website. A document root is the directory where your website files are stored.

        sudo mkdir -p /var/www/example.com

1. Change your site's document root to be owned by the `www-data` user.

        sudo chown -R www-data:www-data /var/www/example.com

1. Create a test index page for your site. Replace `example.com` with your own domain.

        sudo touch /var/www/example.com/index.html

1. Add the example `html` to your site's index.

        sudo echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' | sudo tee /var/www/example.com/index.html

## Configure the Caddyfile

Now that you have your website's document root set up with example content, you are ready to configure Caddy to serve your website files to the internet. This section will create a basic Caddy configuration, which will [automatically enable HTTPS using Let's Encrypt](https://caddyserver.com/v1/docs/automatic-https#obtaining-certificates).

1. Create a directory to store Caddy's configuration files:

        sudo mkdir -p /etc/caddy

1. Update the directory's owner to be the web server user, `www-data`.

        sudo chown -R www-data:www-data /etc/caddy

1. Using the text editor of your choice, create and edit the [Caddyfile](https://caddyserver.com/docs/caddyfile-tutorial) to serve your example site. The Caddyfile is Caddy's main configuration file. Replace `example.com` with your own domain.

      {{< file "/etc/caddy/Caddyfile" >}}
example.com {
    root /var/www/example.com
}
      {{</ file >}}

1. Tell Caddy where to look for your Caddyfile:

        caddy -conf /etc/caddy/Caddyfile

    Caddy will automatically serve your site over HTTPS using Let's Encrypt. Follow the prompts to continue. You will see a similar output.

    {{< output >}}
Activating privacy features...

Your sites will be served over HTTPS automatically using Let's Encrypt.
By continuing, you agree to the Let's Encrypt Subscriber Agreement at:
  https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf
Please enter your email address to signify agreement and to be notified
in case of issues. You can leave it blank, but we don't recommend it.
  Email address: admin@example.com
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

Serving HTTPS on port 443
https://example.com
    {{</ output >}}

1. Open a web browser and visit your domain. You should see the contents of the `index.html`page that you created in Step 4 of the [Add Web Content section](#add-web-content).

## Troubleshooting

If it looks like your Caddy server will not run in the background, it could be that the service plugin has not installed correctly. You will recognize this when you run the `caddy -conf /etc/caddy/Caddyfile` command and the terminal prompt does not come back. Terminating the service will close the server and your site will go down. The following are two methods you can try to run Caddy as a background service.

### Re-download the Service

1.  In a new terminal, open a new session and run the following command:

        ps aux

1.  If you see the following output with `Sl+` in the **STAT** column. This means Caddy is running in the foreground only; the `+` indicates it is a foreground process.

    {{< output >}}
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root     19801  0.0  1.0 117152 10132 ?        Ssl  12:43   0:00 /usr/local/bin/caddy
example+ 19856  0.0  1.2 117152 12512 pts/0    Sl+  12:51   0:00 caddy -conf /etc/caddy/Caddyfile
{{</ output >}}

1.  Create a directory for SSL and give it permissions:

        sudo mkdir -p /etc/ssl/caddy
        sudo chown -R root:www-data /etc/ssl/caddy
        sudo chmod 0770 /etc/ssl/caddy

1.  Get the Caddy service:

        wget https://raw.githubusercontent.com/mholt/caddy/master/dist/init/linux-systemd/caddy.service
        sudo cp caddy.service /etc/systemd/system/

1.  Set permissions for the directory:

        sudo chown root:root /etc/systemd/system/caddy.service
        sudo chmod 644 /etc/systemd/system/caddy.service

1.  Restart the daemons and re-load the caddy conf:

        sudo systemctl daemon-reload
        sudo systemctl restart caddy
        caddy -conf /etc/caddy/Caddyfile

1.  You'll see an output like this indicating that the server has been updated and is listening:

    {{< output >}}
Activating privacy features... done.
Listen: listen tcp :443: bind: address already in use
{{</ output >}}

### Install with Options

Another way to force Caddy to run in the background is to get all your directories and configurations prepared before installing the service.

1.  [Install Caddy](#install-caddy), but do not install the service.

1.  [Add Web Content](#add-web-content) as instructed in these steps.

1.  [Configure the Caddy File](#configure-the-caddyfile), but do not run the step where you tell Caddy where to find your Caddyfile.

1.  Next, run the following command which combines installing the service with telling Caddy where to find your Caddyfile, replace your email address for `admin@example.com`:

        sudo caddy -service install -agree -conf /etc/caddy/Caddyfile -email admin@example.com

    Caddy should start as a background service.