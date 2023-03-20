---
# Shortguide: Testing HTTPS

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: testing-https-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Testing the HTTPS Connection

The next step is to confirm the website is properly configured to use your new certificate and is accessible over HTTPS. To do this, navigate to your website on a web browser, making sure to specify the `https://` protocol when entering your URL. If a lock is visible to the left of the domain name on the browser's address bar, the certificate is likely working as expected. If the certificate is not installed properly, the browser displays a warning page.

You can also enter your domain into the [SSL Server Test](https://www.ssllabs.com/ssltest/) by Qualys SSL Labs to verify that the TLS/SSL certificate has been properly installed and configured. 