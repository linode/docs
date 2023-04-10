---
# Shortguide: Renewing a Certificate Using Certbot

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: renewing-certificate-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Renewing a TLS/SSL Certificate Using Certbot

Upon installation, Certbot is configured to renew any certificates automatically. It is not necessary to manually request an updated certificate or run Certbot again unless the site configuration changes. However, Certbot makes it possible to test the auto-renew mechanism or to forcibly update all certificates.

### Test Automated Renewals

To confirm Certbot is configured to renew its certificates automatically, use `certbot renew` along with the `dry-run` flag.

    sudo certbot renew --dry-run

Certbot inspects the certificates and confirms they are not due to be renewed, but simulates the process anyway. It displays details regarding whether the renewal would have been successful.

{{< output >}}
Cert not due for renewal, but simulating renewal for dry run
...
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/example.com/fullchain.pem (success)
  /etc/letsencrypt/live/www.example.com/fullchain.pem (success)
{{< /output >}}

### Manually Renew Certificate

To manually force Certbot to renew all certificates, use the `renew` command without any options.

    sudo certbot renew

{{< note respectIndent=false >}}
Certbot does not renew certificates unless they are scheduled to expire soon. However, adding the `--force-renewal` flag to the `renew` command forces all certificates to be renewed regardless of their status. However, there is usually no good reason to force renewals. Do not use the `force-renewal` option too frequently as this could exceed the Let's Encrypt [*rate limit*](https://letsencrypt.org/docs/rate-limits/) for a domain certificate.
{{< /note >}}