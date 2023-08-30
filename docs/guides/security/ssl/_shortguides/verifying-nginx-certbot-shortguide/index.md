---
# Shortguide: Verifying NGINX is Configured

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: verifying-nginx-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Verifying the NGINX Installation

NGINX must be installed and configured before Certbot can be used. The following instructions configure the minimal NGINX environment required to install and use Certbot. If NGINX is already installed, skip ahead to the [Installing Certbot](#installing-certbot) section. For more information about NGINX, see the Linode [NGINX configuration guide](/docs/guides/how-to-configure-nginx/).

1.  **Confirm that NGINX is installed and running** by running the following command on your server:

        sudo systemctl status nginx

1.  **Verify that your website is accessible over HTTP** through the domain name you've configured by visiting the website through a browser or running the following curl command, replacing *[domain]* with your domain name:

        curl http://[domain]

    This command should display the raw HTML code that's responsible for displaying your website.