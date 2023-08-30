---
# Shortguide: Deleting a Certificate through Certbot

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: deleting-certificate-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---


## Deleting a TLS/SSL Certificate Using Certbot

The `certbot revoke` command revokes a certificate and provides an option for deleting it. The `--cert-path` parameter must include the location of the certificate. Certbot indicated the certificate directory when it granted the certificate.

    sudo certbot revoke --cert-path /etc/letsencrypt/live/www.example.com/fullchain.pem

{{< note type="alert" respectIndent=false >}}
This option should not be used if you plan to host this domain on the same Linode again. Certbot might not always clean up the configuration files properly, and there could be errors if you request the same certificate again later.
{{< /note >}}
