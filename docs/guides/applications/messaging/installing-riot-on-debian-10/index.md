---
slug: installing-riot-on-debian-10
description: 'Riot is a secure instant messaging application built on Matrix protocol. This guide provides instructions to setup Riot / Matrix on Debian 10.'
keywords: ['riot', 'matrix', 'chat', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-05
modified_by:
  name: Linode
title: "Install Riot on Debian 10"
title_meta: "How to Install Riot on Debian 10"
authors: ["Dan Nielsen"]
---

**Riot** is an open source complete communication service. You can use Riot to chat, exchange files, make voice or video calls, and add bots; all while keeping control of your data. Riot is a [Matrix](https://matrix.org/clients/) web client.

{{< note >}}
Riot has been renamed to *Element*. You can read more about this name change on the [Element blog](https://element.io/blog/welcome-to-element/). This guide uses the Riot naming to refer to this Matrix web client.
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

    {{< note respectIndent=false >}}
If you choose to configure a firewall, remember to open ports 80 and 443 for the server when you reach the [configure a firewall](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall) section of the guide.
{{< /note >}}

1.  To connect to the Synapse / Matrix services with a client other than Riot, you need a [Matrix client](https://matrix.org/clients/).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Setup DNS

In this guide the base domain is `demochat.com`. Ensure that you replace `demochat.com` with a registered domain name in the following steps. Each service gets a separate subdomain as a general hygiene measure.
So in this example, create DNS records for:

- `demochat.com` (General website and hosting for `.well-known` path to advertise Matrix services.)
- `matrix.demochat.com` (Synapse)
- `riot.demochat.com` (Riot)

Set each of the above DNS records to the public IP address of the Linode instance.

Refer to [Add DNS Records](/docs/guides/set-up-web-server-host-website/#add-dns-records) for more information on configuring
DNS entries or consult your DNS provider's documentation if using an external DNS provider.

## Install Riot
### Install Synapse

1. Install Synapse using its Debian packages:

        sudo apt install -y lsb-release wget apt-transport-https
        sudo wget -O /usr/share/keyrings/matrix-org-archive-keyring.gpg https://packages.matrix.org/debian/matrix-org-archive-keyring.gpg
        echo "deb [signed-by=/usr/share/keyrings/matrix-org-archive-keyring.gpg] https://packages.matrix.org/debian/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/matrix-org.list
        sudo apt update
        sudo apt install matrix-synapse-py3

1. Enable registration on the Synapse instance by setting `enable_registration: true` in your `/etc/matrix-sysnapse/homeserver.yaml` file:

    {{< file "/etc/matrix-sysnapse/homeserver.yaml">}}
...
enable_registration: true
...
{{</ file >}}

1. Restart Synapse to enable your configuration:

        sudo systemctl restart matrix-synapse

1. Configure the rest of Matrix to find the server. The easiest way is to publish a `.well-known` file that
indicates the `hostname` and `port` where the Synapse for `demochat.com` is available.

        sudo mkdir -p /var/www/html/demochat.com/.well-known/matrix
        echo '{ "m.server": "demochat.com:443" }' | sudo tee /var/www/html/demochat.com/.well-known/matrix/server

### Install the Latest Riot/Web Release

In this section, you use the latest `.tgz` release from the [Element repository (formerly know as Vector and Riot)](https://github.com/vector-im/element-web/releases) to install the Matrix web client.
Grab the latest .tgz release from (https://github.com/vector-im/riot-web/releases) and check the GPG signature.

1. Create a new directory to store Riot, move into the directory, and install Riot from the latest release. As of writing this guide the latest version is `v1.5.15`. Ensure you replace any instance of `1.5.15` with your own desired version.

        sudo mkdir -p /var/www/html/riot.demochat.com
        cd /var/www/html/riot.demochat.com
        sudo wget https://github.com/vector-im/riot-web/releases/download/v1.5.15/riot-v1.5.15.tar.gz

1. Verify your installation's GnuPG signature:

        sudo apt install -y gnupg
        sudo wget https://github.com/vector-im/riot-web/releases/download/v1.5.15/riot-v1.5.15.tar.gz.asc

1. Grab the signing key for the riot releases repository. Ideally this is done from a key server:

        sudo gpg --keyserver keyserver.ubuntu.com --search-keys releases@riot.im

1. Verify that you receive a `Good signature` response when you validate the signature:

        sudo gpg --verify riot-v1.5.15.tar.gz.asc

1. Extract the Riot `.tar.gz` file you installed. Ensure you replace `v1.5.15` with your own installation's version number.

        sudo tar -xzvf riot-v1.5.15.tar.gz
        sudo ln -s riot-v1.5.15 riot

1. Move into the `riot` directory and create a copy of the `config.sample.json` and name it `config.json`.

        cd riot
        sudo cp config.sample.json config.json

1. Open the `config.json` file you created and update `base_url` and  `server_name` with the values in the example file.

    {{< file "/var/www/html/riot.demochat.com/riot/config.json" >}}
{
    "default_server_config": {
        "m.homeserver": {
            "base_url": "https://matrix.demochat.com"
            "server_name": "demochat.com"
        },
        "m.identity_server": {
            "base_url": "https://matrix.demochat.com"
        }
    }
...
}
...
{{</ file >}}

### Install and Configure NGINX and Let's Encrypt

In this section, you use [NGINX](https://www.nginx.com/) as your web server and [Let's Encrypt](https://letsencrypt.org/) to secure your services.

1.  Install NGINX:

        sudo apt -y install nginx

1.  Create the vhost files for each subdomain:

        sudo touch /etc/nginx/sites-available/{demochat.com,matrix.demochat.com,riot.demochat.com}
        ln -s /etc/nginx/sites-available/demochat.com /etc/nginx/sites-enabled/demochat.com
        ln -s /etc/nginx/sites-available/matrix.demochat.com /etc/nginx/sites-enabled/matrix.demochat.com
        ln -s /etc/nginx/sites-available/riot.demochat.com /etc/nginx/sites-enabled/riot.demochat.com

1.  Add your site configuration to each of the configuration files you created in the previous step.

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

1.  Install [certbot](https://certbot.eff.org/) and configure your Let's Encrypt certificates:

        sudo apt install -y python3-certbot-nginx && certbot --nginx -d demochat.com -d riot.demochat.com -d matrix.demochat.com

### Enable Your Installation's Services

1.  Add services to the default run level and restart your services:

        sudo systemctl enable nginx
        sudo systemctl enable matrix-synapse
        sudo systemctl restart nginx

You should now be able to visit https://riot.demochat.com register an account, sign in, and start chatting.