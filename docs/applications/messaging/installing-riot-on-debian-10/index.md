---
author:
  name: Dan Nielsen
  email: docs@linode.com
description: 'Riot is a secure chat application built on top of the Matrix protocol. This guide provides basic setup instructions for Riot / Matrix on Debian 10.'
og_description: 'Riot is a secure chat application built on top of the Matrix protocol. This guide provides basic setup instructions for Riot / Matrix on Debian 10.'
keywords: ['riot', 'matrix', 'chat', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-09
modified_by:
  name: Linode
title: "Install Riot on Debian 10"
h1_title: "Install Riot on Debian 10"
contributor:
  name: Dan Nielsen
---

**Riot** is an open source complete communication service. Chat, exchange files, make voice or video calls, add bots all while keeping control of your own data.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

4.  To connect to the Synapse / Matrix services with a client other than Riot (installed as part of this guide) you'll need a [Matrix client](https://matrix.org/clients/).


{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Setup DNS

In this demo the base domain will be `demochat.com`. Each service will get a separate subdomain as a general hygiene measure.
So in this example, we'll create DNS records for:

- `demochat.com` (General website and hosting for `.well-known` path to advertise Matrix services.)
- `matrix.demochat.com` (Synapse)
- `riot.demochat.com` (Riot)

Set each of the above DNS records to the public IP address of your Linode instance.

Refer to [Add DNS Records](/docs/websites/set-up-web-server-host-website/#add-dns-records) for more information on configuring
DNS entries or consult your DNS provider's documentation if using an external DNS provider.

## Install Synapse

Install Synapse via Debian packages:

        sudo apt install -y lsb-release wget apt-transport-https
        sudo wget -O /usr/share/keyrings/matrix-org-archive-keyring.gpg https://packages.matrix.org/debian/matrix-org-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/matrix-org-archive-keyring.gpg] https://packages.matrix.org/debian/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/matrix-org.list
        sudo apt update
        sudo apt install matrix-synapse-py3

Enable registration on your synapse instance by setting `enable_registration: true` in `/etc/matrix-sysnapse/homeserver.yaml`
and restarting synapse with `sudo systemctl restart matrix-synapse`.

Now we need to tell the rest of matrix how to find your server. The easiest way is to publish a `.well-known` file that
indicates the hostname and port where the synapse for `demochat.com` can be found.

        sudo mkdir -p /var/www/html/demochat.com/.well-known/matrix
        echo '{ "m.server": "demochat.com:443" }' | sudo tee /var/www/html/demochat.com/.well-known/matrix/server

## Install Riot/Web

Grab the latest .tgz release from (https://github.com/vector-im/riot-web/releases) and check it's GPG signature.

        sudo mkdir -p /var/www/html/riot.demochat.com
        cd /var/www/html/riot.demochat.com
        sudo wget https://github.com/vector-im/riot-web/releases/download/v1.5.15/riot-v1.5.15.tar.gz

        # check its GnuPG signature
        sudo apt install -y gnupg
        sudo wget https://github.com/vector-im/riot-web/releases/download/v1.5.15/riot-v1.5.15.tar.gz.asc

        # grab the signing key for the riot releases repository, ideally from a keyserver...
        sudo gpg --keyserver keyserver.ubuntu.com --search-keys releases@riot.im

        # This should report "Good signature"
        sudo gpg --verify riot-v1.5.15.tar.gz.asc

        sudo tar -xzvf riot-v1.5.15.tar.gz
        sudo ln -s riot-v1.5.15 riot
        cd riot
        sudo cp config.sample.json config.json

Then edit `config.json` and change `base_url` to `https://matrix.demochat.com` and `server_name` to `demochat.com`.

## Nginx and Let's Encrypt

We'll use Nginx as our webserver and Let's Encrypt to secure the services.

1.  Install nginx

        sudo apt -y install nginx

1.  Create the vhost files for each subdomain

        sudo touch /etc/nginx/sites-available/{demochat.com,matrix.demochat.com,riot.demochat.com}
        ln -s /etc/nginx/sites-available/demochat.com /etc/nginx/sites-enabled/demochat.com
        ln -s /etc/nginx/sites-available/matrix.demochat.com /etc/nginx/sites-enabled/matrix.demochat.com
        ln -s /etc/nginx/sites-available/riot.demochat.com /etc/nginx/sites-enabled/riot.demochat.com

1.  Add a vhost configuration to each of configuration files:

    {{< file "/etc/nginx/sites-available/demochat.com" nginx >}}
    server {
        listen 80;
        listen [::]:80;

        server_name demochat.com;
        root /var/www/html/demochat.com;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
    {{< /file >}}

    {{< file "/etc/nginx/sites-available/riot.demochat.com" nginx >}}
    server {
        listen 80;
        listen [::]:80;

        server_name riot.demochat.com;
        root /var/www/html/riot.demochat.com/riot;
        index index.html;

        location / {
            try_files $uri $uri/ =404;
        }
    }
    {{< /file >}}

    {{< file "/etc/nginx/sites-available/matrix.demochat.com" nginx >}}
    server {
        listen 80;
        listen [::]:80;

        server_name matrix.demochat.com;
        root /var/www/html/matrix.demochat.com;
        index index.html;

        location / {
            proxy_pass http://localhost:8008;
        }
    }
    {{< /file >}}

1.  Add certbot and configure Let's Encrypt certificates

        sudo apt install -y python3-certbot-nginx && certbot --nginx -d demochat.com -d riot.demochat.com -d matrix.demochat.com

## Final steps

1.  Add services to the default run level and restart services

        sudo systemctl enable nginx
        sudo systemctl enable matrix-synapse
        sudo systemctl restart nginx

You should now be able to visit https://riot.demochat.com register your account, sign in, and start chatting.
